import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "../src/models/Review.model.js";

dotenv.config({ path: "./.env" });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const totalReviews = await Review.countDocuments();
    console.log(`Total reviews currently in DB: ${totalReviews}`);

    const syntheticNames = [
      "Amit Verma",
      "Sneha Reddy",
      "Rahul Mehta",
      "Priya Sharma",
      "Vikram Patel",
      "Verified Client",
      /Enterprise Client/i
    ];

    const deleted = await Review.deleteMany({
      $or: [
        { authorName: { $in: ["Amit Verma", "Sneha Reddy", "Rahul Mehta", "Priya Sharma", "Vikram Patel", "Verified Client"] } },
        { authorName: { $regex: /Enterprise Client/i } },
        { comment: { $regex: /trademark registered in just 3 days/i } },
        { comment: { $regex: /Superb and extremely swift processing of our/i } },
        { comment: { $regex: /Great experience getting our.*completed via FilingBy/i } }
      ]
    });

    console.log(`Deleted synthetic reviews count: ${deleted.deletedCount}`);

    const remainingReviews = await Review.find().lean();
    console.log(`Remaining reviews in DB (${remainingReviews.length}):`);
    for (const r of remainingReviews) {
      console.log(`- [${r.pageType}] ${r.authorName} (${r.rating}*): "${r.comment.slice(0, 60)}..."`);
    }

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Error cleaning reviews:", err);
    process.exit(1);
  }
};

run();
