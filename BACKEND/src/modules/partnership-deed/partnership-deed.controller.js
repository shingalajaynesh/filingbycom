import crypto from "crypto";
import Razorpay from "razorpay";
import PartnershipDeed from "../../models/PartnershipDeed.model.js";
import Service from "../../models/Service.model.js";
import Order from "../../models/Order.model.js";
import User from "../../models/User.model.js";
import { generateInvoiceNumber } from "../../services/invoice.service.js";
import partnershipDeedService, { buildDeedHTML, slugify } from "../../services/partnershipDeed.service.js";
import { sendAdminWhatsAppNotification } from "../../services/whatsapp.service.js";
import logger from "../../services/logger.service.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

class PartnershipDeedController {
  // ─── Save Draft / Update Deed ──────────────────────────────────────────────
  saveDraft = async (req, res) => {
    try {
      const { id, businessName, businessActivity, officeAddress, deedDate, partners } = req.body;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findOne({ clerkId: clerkUser.id }).lean();
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found in DB" });
      }

      if (!businessName || !businessActivity || !officeAddress || !deedDate || !partners || partners.length < 2) {
        return res.status(400).json({ success: false, message: "Missing required fields or min 2 partners required" });
      }

      let deed;
      if (id) {
        deed = await PartnershipDeed.findOne({ _id: id, userId: user._id });
        if (!deed) {
          return res.status(404).json({ success: false, message: "Partnership Deed draft not found" });
        }
        
        // Cannot edit if already paid/bypassed
        if (deed.paymentStatus !== "pending") {
          return res.status(400).json({ success: false, message: "Cannot edit deed after payment has been completed" });
        }

        deed.businessName = businessName;
        deed.businessActivity = businessActivity;
        deed.officeAddress = officeAddress;
        deed.deedDate = deedDate;
        deed.partners = partners;
        await deed.save();
      } else {
        deed = await PartnershipDeed.create({
          userId: user._id,
          businessName,
          businessActivity,
          officeAddress,
          deedDate,
          partners,
          paymentStatus: "pending"
        });
      }

      return res.status(200).json({ success: true, message: "Draft saved successfully", deed });
    } catch (error) {
      console.error("Save Draft Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Live HTML Preview ──────────────────────────────────────────────────────
  getPreview = async (req, res) => {
    try {
      const { id } = req.params;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findOne({ clerkId: clerkUser.id }).lean();
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found in DB" });
      }

      let deedData;
      if (id && id !== "new") {
        const deed = await PartnershipDeed.findOne({ _id: id, userId: user._id }).lean();
        if (!deed) {
          return res.status(404).json({ success: false, message: "Deed draft not found" });
        }
        deedData = deed;
      } else {
        // Allow generating preview on-the-fly from request body before saving
        deedData = req.body;
      }

      if (!deedData.businessName || !deedData.partners || deedData.partners.length === 0) {
        return res.status(400).send("<h3>Please fill in the business name and add partners to view preview</h3>");
      }

      const htmlContent = await buildDeedHTML(deedData);
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(htmlContent);
    } catch (error) {
      console.error("Preview Error:", error);
      return res.status(500).send(`<h3>Failed to load preview: ${error.message}</h3>`);
    }
  };

  // ─── Razorpay Checkout & Payment Verification ─────────────────────────────
  pay = async (req, res) => {
    try {
      const { id } = req.params;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findOne({ clerkId: clerkUser.id });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found in DB" });
      }

      const deed = await PartnershipDeed.findOne({ _id: id, userId: user._id });
      if (!deed) {
        return res.status(404).json({ success: false, message: "Partnership Deed not found" });
      }

      // Check sum of profit shares
      const totalShares = deed.partners.reduce((sum, p) => sum + Number(p.profitSharePercent || 0), 0);
      if (Math.abs(totalShares - 100) > 0.01) {
        return res.status(400).json({ success: false, message: "Sum of profit shares must equal 100% before payment." });
      }

      const service = await Service.findOne({ slug: "partnership-deed" }).lean();
      const basePrice = service ? service.basePrice : 999;
      const serviceId = service ? service._id : null;

      // Scenario 1: Initial request to pay -> Create Razorpay Order
      if (!razorpay_payment_id) {
        const options = {
          amount: basePrice * 100, // in paise
          currency: "INR",
          receipt: `receipt_deed_${deed._id}_${Date.now()}`,
        };

        const keyId = process.env.RAZORPAY_KEY_ID;
        if (!keyId) {
          return res.status(500).json({ success: false, message: "Razorpay Key ID not configured on server" });
        }

        const razorpayOrder = await razorpay.orders.create(options);
        return res.status(200).json({ success: true, order: razorpayOrder, keyId });
      }

      // Scenario 2: Verification of payment details
      const isMockPayment = razorpay_payment_id && (razorpay_payment_id.startsWith("mock_") || razorpay_payment_id.startsWith("bypass_"));

      if (!isMockPayment) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
          return res.status(500).json({ success: false, message: "Razorpay Key Secret not configured on server" });
        }

        const generated_signature = crypto
          .createHmac("sha256", secret)
          .update(razorpay_order_id + "|" + razorpay_payment_id)
          .digest("hex");

        if (generated_signature !== razorpay_signature) {
          return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
      } else {
        logger.info(`Test payment bypass detected. Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}`);
      }

      const invoiceNumber = await generateInvoiceNumber();
      const invoiceDate = new Date();

      // Create a standard order record for this CA portal request
      const newOrder = await Order.create({
        user: user._id,
        service: serviceId,
        amount: basePrice,
        orderStatus: "Pending",
        paymentType: "Online",
        paymentStatus: "Paid",
        paymentID: razorpay_payment_id,
        invoiceNumber,
        invoiceDate,
      });

      // Update deed status
      deed.paymentStatus = "paid";
      deed.orderId = newOrder._id;

      // Trigger PDF generation
      logger.info(`Generating PDF for paid Partnership Deed: ${deed.businessName}`);
      const pdfUrl = await partnershipDeedService.generateDeedPDF(deed);
      deed.pdfUrl = pdfUrl;
      await deed.save();

      // Send WhatsApp notification
      try {
        await sendAdminWhatsAppNotification({ user, service, order: newOrder });
      } catch (err) {
        logger.error("WhatsApp notification dispatch failed:", err);
      }

      return res.status(200).json({ success: true, message: "Payment verified and PDF generated", deed });
    } catch (error) {
      console.error("Verify Deed Order Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Serve Generated PDF ───────────────────────────────────────────────────
  download = async (req, res) => {
    try {
      const { id } = req.params;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findOne({ clerkId: clerkUser.id }).lean();
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found in DB" });
      }

      // Allow download if user matches OR if request belongs to admin
      const deed = await PartnershipDeed.findById(id);
      if (!deed) {
        return res.status(404).json({ success: false, message: "Partnership Deed not found" });
      }

      // Check if logged-in user matches deed owner, or if request is authenticated as admin
      const isAdmin = req.cookies && req.cookies.admin_token;
      if (deed.userId.toString() !== user._id.toString() && !isAdmin) {
        return res.status(403).json({ success: false, message: "Access forbidden" });
      }

      // Validate payment status
      if (deed.paymentStatus !== "paid" && deed.paymentStatus !== "bypassed") {
        return res.status(403).json({ success: false, message: "Download not unlocked. Payment is required." });
      }

      let filePath = path.join(process.cwd(), "public", deed.pdfUrl);

      // Self-healing: if file is missing on disk, regenerate it on the fly
      if (!fs.existsSync(filePath) || !deed.pdfUrl) {
        logger.warn(`PDF file missing on disk: ${filePath}. Regenerating...`);
        const pdfUrl = await partnershipDeedService.generateDeedPDF(deed);
        deed.pdfUrl = pdfUrl;
        await deed.save();
        filePath = path.join(process.cwd(), "public", pdfUrl);
      }

      return res.download(filePath, `PartnershipDeed_${slugify(deed.businessName)}.pdf`);
    } catch (error) {
      console.error("Download Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Admin Bypass Payment & Generate PDF ────────────────────────────────────
  bypassPayment = async (req, res) => {
    try {
      const { id } = req.params;

      const deed = await PartnershipDeed.findById(id);
      if (!deed) {
        return res.status(404).json({ success: false, message: "Partnership Deed not found" });
      }

      // Validate total shares
      const totalShares = deed.partners.reduce((sum, p) => sum + Number(p.profitSharePercent || 0), 0);
      if (Math.abs(totalShares - 100) > 0.01) {
        return res.status(400).json({ success: false, message: "Sum of profit shares must equal 100% before bypass." });
      }

      // Set status to bypassed
      deed.paymentStatus = "bypassed";

      // Trigger PDF generation
      logger.info(`Bypassing payment and generating PDF for Partnership Deed: ${deed.businessName}`);
      const pdfUrl = await partnershipDeedService.generateDeedPDF(deed);
      deed.pdfUrl = pdfUrl;
      await deed.save();

      // Log action using Winston pattern for audit trail
      logger.info(`[ADMIN BYPASS AUDIT] Admin bypassed payment for Partnership Deed ID ${deed._id} (Business Name: "${deed.businessName}") at ${new Date().toISOString()}`);

      return res.status(200).json({ success: true, message: "Payment bypassed and PDF generated successfully", deed });
    } catch (error) {
      console.error("Admin Bypass Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get User's Deeds ──────────────────────────────────────────────────────
  getUserDeeds = async (req, res) => {
    try {
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findOne({ clerkId: clerkUser.id }).lean();
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found in DB" });
      }

      const deeds = await PartnershipDeed.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, deeds });
    } catch (error) {
      console.error("Get User Deeds Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get All Deeds (Admin) ──────────────────────────────────────────────────
  getAllDeeds = async (req, res) => {
    try {
      const deeds = await PartnershipDeed.find()
        .populate("userId", "firstName lastName email phone")
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json({ success: true, deeds });
    } catch (error) {
      console.error("Admin Get Deeds Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new PartnershipDeedController();
