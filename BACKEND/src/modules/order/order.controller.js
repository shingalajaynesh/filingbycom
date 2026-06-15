import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../../models/Order.model.js";
import Service from "../../models/Service.model.js";
import User from "../../models/User.model.js";
import { sendAdminWhatsAppNotification } from "../../services/whatsapp.service.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

class OrderController {
  // ─── Create Razorpay Order ──────────────────────────────────────────────────
  createRazorpayOrder = async (req, res) => {
    try {
      const { serviceId } = req.body;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }

      const amount = service.basePrice * 100; // Razorpay expects amount in paise

      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Razorpay Order Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Verify Payment and Create Order ────────────────────────────────────────
  verifyOnlineOrder = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, serviceId } = req.body;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) return res.status(401).json({ success: false, message: "Unauthorized" });

      const user = await User.findOne({ clerkId: clerkUser.id });
      if (!user) return res.status(404).json({ success: false, message: "User not found in DB" });

      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ success: false, message: "Service not found" });

      const secret = process.env.RAZORPAY_KEY_SECRET || "test_secret";

      // Verify signature (allows bypass with mock_signature for sandbox testing)
      if (razorpay_signature !== "mock_signature") {
        const generated_signature = crypto
          .createHmac("sha256", secret)
          .update(razorpay_order_id + "|" + razorpay_payment_id)
          .digest("hex");

        if (generated_signature !== razorpay_signature) {
          return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
      }

      // Payment is valid, create the order
      const newOrder = await Order.create({
        user: user._id,
        service: service._id,
        amount: service.basePrice,
        orderStatus: "Pending",
        paymentType: "Online",
        paymentStatus: "Paid",
        paymentID: razorpay_payment_id,
      });

      // Send WhatsApp notification
      await sendAdminWhatsAppNotification({ user, service, order: newOrder });

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      console.error("Verify Order Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Create Cash Order ──────────────────────────────────────────────────────
  createCashOrder = async (req, res) => {
    try {
      const { serviceId } = req.body;
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) return res.status(401).json({ success: false, message: "Unauthorized" });

      const user = await User.findOne({ clerkId: clerkUser.id });
      if (!user) return res.status(404).json({ success: false, message: "User not found in DB" });

      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ success: false, message: "Service not found" });

      // Create the order
      const newOrder = await Order.create({
        user: user._id,
        service: service._id,
        amount: service.basePrice,
        orderStatus: "Pending",
        paymentType: "Cash",
        paymentStatus: "Unpaid",
      });

      // Send WhatsApp notification
      await sendAdminWhatsAppNotification({ user, service, order: newOrder });

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      console.error("Cash Order Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get User Orders ────────────────────────────────────────────────────────
  getUserOrders = async (req, res) => {
    try {
      const clerkUser = req.clerkUser || req.user;

      if (!clerkUser) return res.status(401).json({ success: false, message: "Unauthorized" });

      const user = await User.findOne({ clerkId: clerkUser.id });
      if (!user) return res.status(404).json({ success: false, message: "User not found in DB" });

      const orders = await Order.find({ user: user._id })
        .populate("service", "name slug icon tag")
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Get User Orders Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new OrderController();
