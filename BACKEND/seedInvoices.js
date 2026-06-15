import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.model.js";
import Service from "./src/models/Service.model.js";
import Order from "./src/models/Order.model.js";
import VirtualOfficeOrder from "./src/models/VirtualOfficeOrder.model.js";

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for invoice seeding...");

    // 1. Find user (default to first active user in db)
    let user = await User.findOne();
    if (!user) {
      console.log("No user found in DB. Creating a mock user...");
      user = await User.create({
        firstName: "Jaynesh",
        lastName: "Shingala",
        email: "shingala.jaynesh@gmail.com",
        phone: "+918320594829",
        clerkId: "user_mock_jaynesh",
        authProvider: "clerk",
      });
      console.log("Mock user created:", user._id);
    } else {
      console.log("Using existing user:", user.email, "ID:", user._id);
    }

    // 2. Find/create standard Service
    let service = await Service.findOne();
    if (!service) {
      console.log("No services found in DB. Creating a mock service...");
      service = await Service.create({
        name: "Income Tax Notice Reply",
        slug: "income-tax-notice-reply",
        basePrice: 999,
        description: "Reply to Income Tax Notices with professional CA advice.",
        portal: "ca-portal",
        tag: "ITR Filing",
      });
      console.log("Mock service created:", service.name, "ID:", service._id);
    } else {
      console.log("Using existing service:", service.name, "ID:", service._id);
    }

    // 3. Clear existing orders for this user to avoid conflicts and start fresh
    await Order.deleteMany({ user: user._id });
    await VirtualOfficeOrder.deleteMany({ user: user._id });
    console.log("Cleaned up previous orders and bookings for user.");

    // 4. Seed Paid Standard Order
    const standardOrder = await Order.create({
      user: user._id,
      service: service._id,
      amount: service.basePrice,
      orderStatus: "Document Verification",
      paymentType: "Online",
      paymentStatus: "Paid",
      paymentID: "pay_RP_standard_123",
      invoiceNumber: "FB-INV-2026-0001",
      invoiceDate: new Date(),
    });
    console.log("Seeded Standard CA Order with Invoice:", standardOrder.invoiceNumber);

    // 5. Seed Paid Virtual Office Booking
    const voOrder = await VirtualOfficeOrder.create({
      user: user._id,
      citySlug: "surat",
      addressName: "Adajan Compliance Hub",
      selectedPlan: "gst",
      price: 1399,
      complianceStatus: "Documents Uploaded",
      paymentStatus: "Paid",
      paymentId: "pay_VO_leased_456",
      invoiceNumber: "FB-INV-2026-0002",
      invoiceDate: new Date(),
      clientDocuments: {
        panCard: "https://filingby.com/mock/pan_card.pdf",
        aadhaarCard: "https://filingby.com/mock/aadhaar_card.pdf",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        companyName: "Shingala Enterprises Pvt Ltd",
        incorporationCert: "",
      },
      complianceDocuments: {
        nocFile: "",
        utilityBillFile: "",
        rentAgreementFile: "",
        consentLetterFile: "",
      },
      mailLogs: [
        {
          sender: "GST Department Surat",
          category: "GST Department",
          actionTaken: "Scanned & Emailed",
          notes: "Onboarding letter received.",
          dateReceived: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      inspections: []
    });
    console.log("Seeded Virtual Office Booking with Invoice:", voOrder.invoiceNumber);

    console.log("Seeding complete! Successfully seeded invoice testing database records.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
