import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const run = async () => {
  try {
    // 1. Update all markdown files in BACKEND/content/blogs/
    const blogsDir = path.resolve("./content/blogs");
    if (fs.existsSync(blogsDir)) {
      const files = fs.readdirSync(blogsDir).filter(f => f.endsWith(".md"));
      console.log(`Found ${files.length} markdown blog files in ${blogsDir}`);

      let mdUpdated = 0;
      for (const file of files) {
        const filePath = path.join(blogsDir, file);
        let content = fs.readFileSync(filePath, "utf-8");
        let changed = false;

        if (content.includes('reviewedBy: "Hiren Patel (FCA)"') || content.includes('reviewedBy: Hiren Patel (FCA)')) {
          content = content.replace(/reviewedBy:\s*"?Hiren Patel \(FCA\)"?/g, 'reviewedBy: "FilingBy Content Team"');
          changed = true;
        }

        if (content.includes('reviewedByTitle: "Chartered Accountant"') || content.includes('reviewedByTitle: Chartered Accountant')) {
          content = content.replace(/reviewedByTitle:\s*"?[^"\n\r]*Chartered Accountant[^"\n\r]*"?/g, 'reviewedByTitle: "Editorial Fact-Checking Desk"');
          changed = true;
        }

        if (content.includes('reviewerExperience: "15+ Years Experience"') || content.includes('reviewerExperience: 15+ Years Experience')) {
          content = content.replace(/reviewerExperience:\s*"?[^"\n\r]*15\+\s*Years Experience[^"\n\r]*"?/g, 'reviewerExperience: ""');
          changed = true;
        }

        if (changed) {
          fs.writeFileSync(filePath, content, "utf-8");
          mdUpdated++;
        }
      }
      console.log(`Updated ${mdUpdated} markdown files.`);
    }

    // 2. Update BACKEND/scripts/generateBlogBatch.js
    const generateBatchPath = path.resolve("./scripts/generateBlogBatch.js");
    if (fs.existsSync(generateBatchPath)) {
      let content = fs.readFileSync(generateBatchPath, "utf-8");
      if (content.includes('Hiren Patel (FCA)')) {
        content = content.replace(/const REVIEWED_BY = "Hiren Patel \(FCA\)";/g, 'const REVIEWED_BY = "FilingBy Content Team";');
        content = content.replace(/reviewedByTitle: "Chartered Accountant"/g, 'reviewedByTitle: "Editorial Fact-Checking Desk"');
        content = content.replace(/reviewerExperience: "15\+ Years Experience"/g, 'reviewerExperience: ""');
        fs.writeFileSync(generateBatchPath, content, "utf-8");
        console.log("Updated scripts/generateBlogBatch.js");
      }
    }

    // 3. Update BACKEND/scripts/seedBlogs.js
    const seedBlogsPath = path.resolve("./scripts/seedBlogs.js");
    if (fs.existsSync(seedBlogsPath)) {
      let content = fs.readFileSync(seedBlogsPath, "utf-8");
      if (content.includes('Hiren Patel (FCA)')) {
        content = content.replace(/reviewedBy:\s*"Hiren Patel \(FCA\)"/g, 'reviewedBy: "FilingBy Content Team"');
        content = content.replace(/reviewedByTitle:\s*"Chartered Accountant"/g, 'reviewedByTitle: "Editorial Fact-Checking Desk"');
        content = content.replace(/reviewerExperience:\s*"15\+ Years Experience"/g, 'reviewerExperience: ""');
        fs.writeFileSync(seedBlogsPath, content, "utf-8");
        console.log("Updated scripts/seedBlogs.js");
      }
    }

    // 4. Update MongoDB blogposts collection
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB for BlogPost update.");

      const BlogPost = mongoose.connection.collection("blogposts");
      const result = await BlogPost.updateMany(
        {
          $or: [
            { reviewedBy: { $regex: /Hiren Patel/i } },
            { reviewedByTitle: { $regex: /Chartered Accountant/i } },
            { reviewerExperience: { $regex: /15\+ Years/i } }
          ]
        },
        {
          $set: {
            reviewedBy: "FilingBy Content Team",
            reviewedByTitle: "Editorial Fact-Checking Desk",
            reviewerExperience: "",
            reviewerId: "filingby-content-team"
          }
        }
      );
      console.log(`Updated ${result.modifiedCount} MongoDB blog posts.`);

      await mongoose.disconnect();
      console.log("MongoDB disconnected.");
    }

    console.log("Reviewer attribution update completed successfully!");
  } catch (err) {
    console.error("Error updating reviewer attribution:", err);
    process.exit(1);
  }
};

run();
