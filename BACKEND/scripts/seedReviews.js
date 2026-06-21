import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "../src/models/Review.model.js";
import Service from "../src/models/Service.model.js";
import VirtualLocation from "../src/models/VirtualLocation.model.js";

dotenv.config();

const seedReviews = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding client reviews...");

    // Clear existing reviews to ensure clean state
    await Review.deleteMany({});
    console.log("Cleared existing reviews.");

    // 1. Seed Homepage Reviews
    const homeReviews = [
      {
        authorName: "Rahul Mehta",
        businessName: "Mehta Enterprises",
        rating: 5,
        comment: "FilingBy handled our GST registration and company incorporation seamlessly. Highly professional team!",
        pageType: "home",
        portal: "ca-portal",
        isActive: true,
      },
      {
        authorName: "Priya Sharma",
        businessName: "PS Fashion Studio",
        rating: 5,
        comment: "Got our trademark registered in just 3 days. The process was completely online and hassle-free.",
        pageType: "home",
        portal: "ca-portal",
        isActive: true,
      },
      {
        authorName: "Vikram Patel",
        businessName: "Patel Trading Co.",
        rating: 5,
        comment: "Their CA team files our monthly GST returns on time every month. No stress, no penalties!",
        pageType: "home",
        portal: "ca-portal",
        isActive: true,
      },
      {
        authorName: "Abhishek Tewari",
        businessName: "Tewari Logistics",
        rating: 5,
        comment: "Many thanks to the team for making the virtual office booking process so smooth. Fantastic coordination and actively responding to queries.",
        pageType: "home",
        portal: "virtual-space",
        initials: "AB",
        color: "bg-blue-600",
        isActive: true,
      },
      {
        authorName: "Anson Antony",
        businessName: "Antony Consulting",
        rating: 5,
        comment: "I had a great experience getting a virtual address. Very helpful throughout the process and made everything smooth and hassle-free. Highly recommended!",
        pageType: "home",
        portal: "virtual-space",
        initials: "AA",
        color: "bg-emerald-600",
        isActive: true,
      },
      {
        authorName: "Jaimin Patel",
        businessName: "Patel Tech Hub",
        rating: 5,
        comment: "Highly recommended to anyone wanting a virtual office space. Staff is also very helpful. I got very good responses with all my work.",
        pageType: "home",
        portal: "virtual-space",
        initials: "JP",
        color: "bg-blue-700",
        isActive: true,
      },
    ];

    await Review.insertMany(homeReviews);
    console.log("Seeded homepage reviews.");

    // 2. Fetch all existing services to link service-specific reviews to
    const services = await Service.find({}).lean();

    if (services.length > 0) {
      const serviceReviews = [];
      
      for (const service of services) {
        console.log(`Adding reviews for service: ${service.name} (${service.slug})`);
        
        serviceReviews.push({
          authorName: "Amit Verma",
          businessName: "Tech Solutions Inc.",
          rating: 5,
          comment: `Superb and extremely swift processing of our ${service.name}. The team handled all documentation and corporate queries with absolute professionalism!`,
          pageType: "service",
          portal: service.portal || "ca-portal",
          service: service._id,
          isActive: true,
        });

        serviceReviews.push({
          authorName: "Sneha Reddy",
          businessName: "Green Growth Organics",
          rating: 4,
          comment: `Great experience getting our ${service.name} completed via FilingBy. Response times were very prompt, and their professional guidance saved us hours of paperwork.`,
          pageType: "service",
          portal: service.portal || "ca-portal",
          service: service._id,
          isActive: true,
        });
      }

      await Review.insertMany(serviceReviews);
      console.log(`Seeded ${serviceReviews.length} service-specific reviews.`);
    } else {
      console.log("No services found in database to associate reviews with. Skipping service-specific reviews.");
    }

    // 3. Fetch all existing locations to link location/center specific reviews to
    const locations = await VirtualLocation.find({}).lean();

    if (locations.length > 0) {
      const locationReviews = [];
      
      for (const loc of locations) {
        console.log(`Adding reviews for location: ${loc.name} (${loc.slug})`);
        
        // City-level review
        locationReviews.push({
          authorName: `${loc.name} Enterprise Client`,
          businessName: `${loc.name} Operations`,
          rating: 5,
          comment: `Getting our virtual office and GST registration in ${loc.name} was incredibly fast. Highly responsive representative and 100% compliant documents.`,
          pageType: "location",
          portal: "virtual-space",
          virtualLocation: loc._id,
          initials: loc.name.slice(0, 2).toUpperCase(),
          color: "bg-indigo-650",
          isActive: true,
        });

        // Center-specific reviews
        if (loc.addresses && loc.addresses.length > 0) {
          for (const addr of loc.addresses) {
            console.log(`Adding review for center: ${addr.name} under ${loc.name}`);
            locationReviews.push({
              authorName: `Verified Client`,
              businessName: `Operations @ ${addr.name}`,
              rating: 5,
              comment: `Highly recommend the ${addr.name} workspace. The physical inspection was successfully audited, and the local desk set-up is perfect.`,
              pageType: "location",
              portal: "virtual-space",
              virtualLocation: loc._id,
              officeCenter: addr.slug,
              initials: addr.slug.slice(0, 2).toUpperCase(),
              color: "bg-emerald-700",
              isActive: true,
            });
          }
        }
      }

      await Review.insertMany(locationReviews);
      console.log(`Seeded ${locationReviews.length} location-specific reviews.`);
    } else {
      console.log("No virtual locations found in database to associate reviews with. Skipping location reviews.");
    }

    console.log("Review seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding reviews failed:", error);
    process.exit(1);
  }
};

seedReviews();
