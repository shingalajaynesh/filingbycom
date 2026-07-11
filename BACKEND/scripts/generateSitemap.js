import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Import models
import Service from "../src/models/Service.model.js";
import VirtualLocation from "../src/models/VirtualLocation.model.js";
import BlogPost from "../src/models/BlogPost.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Target file path: FRONTEND/public/sitemap.xml
const targetSitemapPath = join(__dirname, "../../FRONTEND/public/sitemap.xml");

const STATIC_PAGES = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "virtual-space", changefreq: "daily", priority: "1.0" },
  { path: "locations", changefreq: "weekly", priority: "0.9" },
  { path: "ecommerce-office", changefreq: "weekly", priority: "0.9" },
  { path: "about-us", changefreq: "monthly", priority: "0.8" },
  { path: "our-promise", changefreq: "monthly", priority: "0.8" },
  { path: "customer-care", changefreq: "monthly", priority: "0.8" },
  { path: "faq", changefreq: "weekly", priority: "0.8" },
  { path: "get-live-quote", changefreq: "monthly", priority: "0.8" },
  { path: "blog", changefreq: "daily", priority: "0.8" },
  { path: "gst-calculator", changefreq: "weekly", priority: "0.9" },
  { path: "income-tax-calculator", changefreq: "weekly", priority: "0.9" },
  { path: "roc-tools", changefreq: "weekly", priority: "0.8" },
  { path: "company-registration-guides", changefreq: "weekly", priority: "0.8" },
  { path: "trademark-search", changefreq: "weekly", priority: "0.8" },
  { path: "legal-templates", changefreq: "weekly", priority: "0.8" },
];

async function generate() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }

    console.log("Connecting to database to fetch sitemap routes...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    // 1. Fetch dynamic compliance services (ca-portal)
    const services = await Service.find({ isActive: { $ne: false } }).lean();
    console.log(`Fetched ${services.length} active CA services.`);

    // 2. Fetch virtual office locations (cities) and areas
    const locations = await VirtualLocation.find().lean();
    console.log(`Fetched ${locations.length} virtual office locations (cities).`);

    // 3. Fetch published blog posts
    const blogs = await BlogPost.find({ isPublished: true }).lean();
    console.log(`Fetched ${blogs.length} published blogs.`);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    xml += `\n  <!-- Core Static Pages -->`;
    for (const page of STATIC_PAGES) {
      xml += `
  <url>
    <loc>https://filingby.com/${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // Add CA services
    if (services.length > 0) {
      xml += `\n\n  <!-- Dynamic CA / Compliance Services -->`;
      for (const service of services) {
        xml += `
  <url>
    <loc>https://filingby.com/services/${service.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    // Add Virtual Office Cities and Areas
    if (locations.length > 0) {
      xml += `\n\n  <!-- Dynamic Virtual Office Cities & Areas -->`;
      for (const loc of locations) {
        // Add city landing page
        xml += `
  <url>
    <loc>https://filingby.com/virtual-office-${loc.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        // Add area pages inside this city
        if (loc.addresses && loc.addresses.length > 0) {
          for (const addr of loc.addresses) {
            xml += `
  <url>
    <loc>https://filingby.com/virtual-office-${loc.slug}/${addr.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
          }
        }
      }
    }

    // Add Blogs
    if (blogs.length > 0) {
      xml += `\n\n  <!-- Dynamic Blogs & Guides -->`;
      for (const post of blogs) {
        const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : null;
        xml += `
  <url>
    <loc>https://filingby.com/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${lastMod ? `\n    <lastmod>${lastMod}</lastmod>` : ""}
  </url>`;
      }
    }

    xml += `\n</urlset>\n`;

    console.log(`Writing sitemap to ${targetSitemapPath}...`);
    fs.writeFileSync(targetSitemapPath, xml, "utf8");
    console.log("Static sitemap.xml generated successfully!");

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to generate static sitemap:", error);
    process.exit(1);
  }
}

generate();
