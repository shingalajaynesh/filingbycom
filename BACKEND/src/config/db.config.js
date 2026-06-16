/**
 * db.config.js
 * Configures the Mongoose connection settings to MongoDB Atlas.
 * Includes fail-safe timeouts to prevent server hangs during database outages.
 */

import mongoose from "mongoose";
import logger from "../services/logger.service.js";

/**
 * Connects to MongoDB Atlas using the configured MONGODB_URI environment variable.
 * Gracefully shuts down Node if the initial connection fails.
 */
const connectDB = async () => {
  try {
    // serverSelectionTimeoutMS is set to 5000ms (5 seconds).
    // If the database is unreachable, it rejects early instead of hanging indefinetly.
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10, // Optimize memory consumption by limiting concurrent database socket connections
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    // Exit process with failure (1) if connection could not be established
    process.exit(1);
  }
};

export default connectDB;