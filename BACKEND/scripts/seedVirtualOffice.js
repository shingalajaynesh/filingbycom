import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.model.js";
import VirtualOfficeOrder from "../src/models/VirtualOfficeOrder.model.js";

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Find the first user
    let user = await User.findOne();
    if (!user) {
      console.log("No user found in DB. Creating a mock user...");
      user = await User.create({
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh@example.com",
        phone: "+919876543210",
        clerkId: "user_mock123",
        authProvider: "clerk",
      });
      console.log("Mock user created:", user._id);
    } else {
      console.log("Using existing user:", user.email, "ID:", user._id);
    }

    // Clean up any existing bookings for this user to start fresh
    await VirtualOfficeOrder.deleteMany({ user: user._id });

    // Seed booking 1: Adajan Compliance Hub (Surat)
    const booking1 = await VirtualOfficeOrder.create({
      user: user._id,
      citySlug: "surat",
      addressName: "Adajan Compliance Hub",
      selectedPlan: "gst",
      price: 999,
      complianceStatus: "Payment Received",
      clientDocuments: {
        panCard: "",
        aadhaarCard: "",
        photo: "",
        companyName: "Rajesh Retail Enterprises",
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
          sender: "GST Department, Ward 3",
          category: "GST Department",
          actionTaken: "Scanned & Emailed",
          attachmentUrl: "https://filingby.com/mock/gst_verification_letter.pdf",
          notes: "Physical verification notice received. Scanned and sent to registered email.",
          dateReceived: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          sender: "HDFC Bank Ltd",
          category: "Bank Courier",
          actionTaken: "Stored for Pickup",
          attachmentUrl: "",
          notes: "Company welcome kit and corporate chequebook.",
          dateReceived: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        }
      ],
      inspections: [
        {
          dateScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          status: "Scheduled",
          inspectorName: "Officer M. P. Patel",
          notes: "Verify company name board and file folder on physical desk."
        }
      ],
      paymentStatus: "Paid",
      paymentId: "pay_RJS91823798",
    });

    console.log("Seed successful! Created virtual office booking ID:", booking1._id);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
