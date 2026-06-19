import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import MainService from "../src/models/MainService.model.js";
import Service from "../src/models/Service.model.js";

dotenv.config();

const seedServices = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding Virtual Space services...");

    // 1. Seed Main Services (Categories)
    let cat1 = await MainService.findOne({ name: "Virtual Office Solutions" });
    if (!cat1) {
      cat1 = await MainService.create({
        name: "Virtual Office Solutions",
        order: 1,
        isActive: true,
        portal: "virtual-space",
      });
      console.log("Created category: 'Virtual Office Solutions'");
    } else {
      console.log("Category 'Virtual Office Solutions' already exists. Reusing...");
      // Ensure portal field is correctly updated to virtual-space
      if (cat1.portal !== "virtual-space") {
        cat1.portal = "virtual-space";
        await cat1.save();
      }
    }

    let cat2 = await MainService.findOne({ name: "Meeting & Desk Spaces" });
    if (!cat2) {
      cat2 = await MainService.create({
        name: "Meeting & Desk Spaces",
        order: 2,
        isActive: true,
        portal: "virtual-space",
      });
      console.log("Created category: 'Meeting & Desk Spaces'");
    } else {
      console.log("Category 'Meeting & Desk Spaces' already exists. Reusing...");
      if (cat2.portal !== "virtual-space") {
        cat2.portal = "virtual-space";
        await cat2.save();
      }
    }

    // 2. Define Mock Services under portal: "virtual-space"
    const servicesToSeed = [
      {
        name: "GST Registration Address",
        slug: "gst-registration-address",
        description: "Get a premium commercial business address for GST registration, official correspondence, and complete documentation compliance.",
        basePrice: 999,
        icon: "building",
        billingCycle: "Month",
        portal: "virtual-space",
        mainService: cat1._id,
        order: 1,
        isActive: true,
        isPopular: true,
        documentsRequired: ["PAN Card of Business", "Aadhaar Card of Promoters", "Passport Photo of Directors", "Electricity Bill Consent Signed"],
        processSteps: ["Submit KYC Documents", "Receive Rent Agreement Draft", "Approve & E-Sign Stamp Paper", "NOC & Utility Bill Issued"],
        faqs: [
          { q: "Is physical verification supported?", a: "Yes, our team supports GST officer physical verification, name-board installation, and verification desk setup." },
          { q: "What is the lease period?", a: "The default lease agreement is for 12 months, which can be renewed annually." }
        ]
      },
      {
        name: "Business Address Proof",
        slug: "business-address-proof",
        description: "Use a premium commercial workspace address as your official corporate location for business cards, website registry, and mail handling.",
        basePrice: 599,
        icon: "document",
        billingCycle: "Month",
        portal: "virtual-space",
        mainService: cat1._id,
        order: 2,
        isActive: true,
        isPopular: false,
        documentsRequired: ["PAN Card of Business", "Incorporation Certificate"],
        processSteps: ["Submit KYC Documents", "Agree to Mail Handling Policy", "Receive Stamped Agreement Proof"],
        faqs: [
          { q: "Does this include mail forwarding?", a: "Yes, we scan incoming couriers and email them to you daily. Physical forward dispatch can be requested." }
        ]
      },
      {
        name: "Mailing Address Package",
        slug: "mailing-address-package",
        description: "A budget-friendly address solution dedicated exclusively for courier sorting, bank kit correspondence, and official mailbox scans.",
        basePrice: 399,
        icon: "wallet",
        billingCycle: "Month",
        portal: "virtual-space",
        mainService: cat1._id,
        order: 3,
        isActive: true,
        isPopular: false,
        documentsRequired: ["Identity Proof", "Address Proof of representative"],
        processSteps: ["Verify Identity Details", "Acquire Dedicated Mail Box Number"],
        faqs: []
      },
      {
        name: "Conference Rooms Booking",
        slug: "conference-rooms-booking",
        description: "Fully equipped professional meeting spaces with high-speed Wi-Fi, smart screens, whiteboards, and guest refreshments support.",
        basePrice: 299,
        icon: "handshake",
        billingCycle: "Fixed",
        portal: "virtual-space",
        mainService: cat2._id,
        order: 1,
        isActive: true,
        isPopular: true,
        documentsRequired: ["Identity Proof of organizer"],
        processSteps: ["Select Booking Slot", "Complete Pre-Payment", "Arrive with Guests"],
        faqs: [
          { q: "What is the capacity of meeting rooms?", a: "Our rooms fit 6 to 12 participants comfortably with ergonomic seating." }
        ]
      },
      {
        name: "Dedicated Coworking Desks",
        slug: "dedicated-coworking-desks",
        description: "Your own dedicated premium workspace desk in a commercial environment with power backup, printer support, and internet access.",
        basePrice: 1999,
        icon: "landmark",
        billingCycle: "Month",
        portal: "virtual-space",
        mainService: cat2._id,
        order: 2,
        isActive: true,
        isPopular: true,
        documentsRequired: ["PAN Card", "Aadhaar Card"],
        processSteps: ["Submit KYC details", "Choose desk location", "Get access keycard"],
        faqs: []
      }
    ];

    // Seed/Update services
    for (const serv of servicesToSeed) {
      let existingServ = await Service.findOne({ slug: serv.slug });
      if (!existingServ) {
        await Service.create(serv);
        console.log(`Created service: '${serv.name}'`);
      } else {
        console.log(`Service '${serv.name}' already exists. Updating attributes...`);
        // Overwrite fields to match seeding data
        Object.assign(existingServ, serv);
        await existingServ.save();
      }
    }

    console.log("Virtual Space services seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedServices();
