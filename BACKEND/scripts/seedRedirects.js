import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Redirect from "../src/models/Redirect.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vercelJsonPath = join(__dirname, "../../FRONTEND/vercel.json");

const seedRedirects = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    
    if (!fs.existsSync(vercelJsonPath)) {
      console.error(`vercel.json not found at: ${vercelJsonPath}`);
      process.exit(1);
    }

    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, "utf8"));
    const redirectsList = vercelConfig.redirects || [];
    
    console.log(`Parsed vercel.json. Found ${redirectsList.length} redirect rules.`);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    let insertedCount = 0;
    for (const rule of redirectsList) {
      const source = rule.source.toLowerCase().replace(/\/$/, "") || "/";
      const destination = rule.destination;
      // Vercel redirect status: permanent (308 or 301) -> we map to 301 (or 308 if preferred, 301 is standard for technical SEO redirects)
      const statusCode = rule.permanent ? 301 : 302;

      await Redirect.findOneAndUpdate(
        { source },
        { 
          destination, 
          statusCode,
          isActive: true
        },
        { upsert: true, new: true }
      );
      insertedCount++;
    }

    console.log(`Seeded ${insertedCount} redirect rules in the database.`);
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed redirects:", error);
    process.exit(1);
  }
};

seedRedirects();
