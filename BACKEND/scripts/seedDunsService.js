import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../src/models/Service.model.js";

dotenv.config();

const seedDunsService = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding DUNS service...");

    const dunsData = {
      name: "DUNS Number Registration",
      slug: "duns-number",
      basePrice: 2999,
      description: "Get your 9-digit DUNS (Data Universal Numbering System) number online in India for international trade, Apple Developer accounts, and global vendor registration.",
      seoTitle: "DUNS Number Registration India | Dun & Bradstreet Number",
      seoDescription: "Apply for DUNS number registration online in India. Fast processing for Apple Developer accounts, D&B profile creation, and international contract compliance.",
      seoKeywords: "DUNS number registration India, D&B number online, Apple Developer DUNS number, Dun & Bradstreet registration",
      portal: "ca-portal",
      billingCycle: "Fixed",
      tag: "Popular",
      benefits: [
        "Global Corporate Recognition: Accepted by international buyers, MNCs, and government procurement portals worldwide.",
        "Mandatory for Apple Developer Enrollment: Required by Apple for publishing iOS apps under an organization developer account.",
        "Credit Profile & Trade Credit: Enables credit rating agencies and international suppliers to verify your business credentials.",
        "100% Hassle-Free Filing: Assisted documentation and verification by FilingBy compliance experts."
      ],
      documentsRequired: [
        "Certificate of Incorporation / GST Registration / Partnership Deed",
        "PAN Card of the Business Entity & Authorized Director/Partner",
        "Proof of Registered Office Address (Utility Bill / Rent Agreement / Bank Statement)",
        "Authorized Signatory Details & Official Business Email ID"
      ],
      processSteps: [
        "Document Compilation: Upload corporate KYC, registration details, and address proofs.",
        "Application Submission: FilingBy compliance team submits verification details to Dun & Bradstreet.",
        "Phone Verification: Complete D&B telephonic verification call for identity authentication.",
        "DUNS Allocation: Receive your official 9-digit DUNS number and corporate profile access."
      ],
      faqs: [
        {
          q: "What is a DUNS number?",
          a: "A DUNS (Data Universal Numbering System) number is a unique 9-digit identifier issued by Dun & Bradstreet (D&B) to establish a business entity's credit and corporate identity globally."
        },
        {
          q: "Why do I need a DUNS number for an Apple Developer Account?",
          a: "Apple requires all corporate organization developer accounts to verify legal entity status through a verified D&B DUNS number before app publishing."
        },
        {
          q: "How long does DUNS number issuance take?",
          a: "Standard verification takes 5 to 7 business days after all corporate documents and phone verification are completed."
        }
      ]
    };

    let existing = await Service.findOne({ slug: "duns-number" });
    if (existing) {
      Object.assign(existing, dunsData);
      await existing.save();
      console.log("Updated existing 'duns-number' service in MongoDB.");
    } else {
      await Service.create(dunsData);
      console.log("Created new 'duns-number' service in MongoDB.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding DUNS service:", err);
    process.exit(1);
  }
};

seedDunsService();
