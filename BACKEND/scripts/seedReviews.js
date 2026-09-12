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

const seedReviews = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Synthetic reviews are disabled to ensure AdSense compliance and authentic customer feedback.
    console.log("Synthetic review generation is permanently disabled.");
    console.log("Only authentic, verified client submissions are preserved.");

    process.exit(0);
  } catch (error) {
    console.error("Review script failed:", error);
    process.exit(1);
  }
};

seedReviews();

