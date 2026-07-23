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
  { path: "contact-us", changefreq: "monthly", priority: "0.8" },
  { path: "faq", changefreq: "weekly", priority: "0.8" },
  { path: "get-live-quote", changefreq: "monthly", priority: "0.8" },
  { path: "blog", changefreq: "daily", priority: "0.8" },
  { path: "gst-calculator", changefreq: "weekly", priority: "0.9" },
  { path: "income-tax-calculator", changefreq: "weekly", priority: "0.9" },
  { path: "roc-tools", changefreq: "weekly", priority: "0.8" },
  { path: "company-registration-guides", changefreq: "weekly", priority: "0.8" },
  { path: "trademark-search", changefreq: "weekly", priority: "0.8" },
  { path: "legal-templates", changefreq: "weekly", priority: "0.8" },
  { path: "services/pan-card", changefreq: "weekly", priority: "0.9" },
  { path: "terms-conditions", changefreq: "monthly", priority: "0.5" },
  { path: "default/refund", changefreq: "monthly", priority: "0.5" },
  { path: "default/privacy-policy", changefreq: "monthly", priority: "0.5" },
  { path: "default/cookie-policy", changefreq: "monthly", priority: "0.5" },
  { path: "default/disclaimer", changefreq: "monthly", priority: "0.5" },
  { path: "default/editorial-policy", changefreq: "monthly", priority: "0.5" },
  { path: "default/corrections-policy", changefreq: "monthly", priority: "0.5" },
  { path: "editorial-team", changefreq: "monthly", priority: "0.6" },
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add static pages
    xml += `\n  <!-- Core Static Pages -->`;
    for (const page of STATIC_PAGES) {
      xml += `
  <url>
    <loc>https://www.filingby.com/${page.path}</loc>
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
    <loc>https://www.filingby.com/services/${service.slug}</loc>
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
    <loc>https://www.filingby.com/virtual-office-${loc.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        // Add area pages inside this city
        if (loc.addresses && loc.addresses.length > 0) {
          for (const addr of loc.addresses) {
            xml += `
  <url>
    <loc>https://www.filingby.com/virtual-office-${loc.slug}/${addr.slug}</loc>
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
    <loc>https://www.filingby.com/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${lastMod ? `\n    <lastmod>${lastMod}</lastmod>` : ""}`;
        if (post.image) {
          xml += `
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>`;
        }
        xml += `
  </url>`;
      }
    }

    xml += `\n</urlset>\n`;

    console.log(`Writing sitemap to ${targetSitemapPath}...`);
    fs.writeFileSync(targetSitemapPath, xml, "utf8");
    console.log("Static sitemap.xml generated successfully!");

    // Generate robots.txt
    const targetRobotsPath = join(__dirname, "../../FRONTEND/public/robots.txt");
    console.log(`Writing robots.txt to ${targetRobotsPath}...`);
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /virtual-office/dashboard/
Disallow: /partner/dashboard/
Disallow: /sso-callback/

Sitemap: https://www.filingby.com/sitemap.xml
Sitemap: https://www.filingby.com/image-sitemap.xml
`;
    fs.writeFileSync(targetRobotsPath, robotsTxt, "utf8");
    console.log("robots.txt generated successfully!");

    // Generate image-sitemap.xml
    const targetImageSitemapPath = join(__dirname, "../../FRONTEND/public/image-sitemap.xml");
    console.log(`Writing image-sitemap.xml to ${targetImageSitemapPath}...`);
    let imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    for (const post of blogs) {
      if (post.image) {
        imageSitemapXml += `
  <url>
    <loc>https://www.filingby.com/blog/${post.slug}</loc>
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>
  </url>`;
      }
    }
    imageSitemapXml += `\n</urlset>\n`;
    fs.writeFileSync(targetImageSitemapPath, imageSitemapXml, "utf8");
    console.log("image-sitemap.xml generated successfully!");

    // Generate feed.xml (RSS Feed)
    const targetFeedPath = join(__dirname, "../../FRONTEND/public/feed.xml");
    console.log(`Writing feed.xml to ${targetFeedPath}...`);
    let feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FilingBy Knowledge Hub</title>
    <link>https://www.filingby.com/blog</link>
    <description>Expert Chartered Accountant advice, tax guides, GST compliance rules, and virtual office regulations in India.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.filingby.com/feed.xml" rel="self" type="application/rss+xml" />`;

    const sortedBlogs = [...blogs]
      .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
      .slice(0, 20);

    for (const post of sortedBlogs) {
      const postLink = `https://www.filingby.com/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
      feedXml += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postLink}</link>
      <guid isPermaLink="true">${postLink}</guid>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200).replace(/<[^>]*>/g, "") + "..."}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.image ? `<enclosure url="${post.image}" length="0" type="image/jpeg" />` : ""}
    </item>`;
    }
    feedXml += `\n  </channel>\n</rss>\n`;
    fs.writeFileSync(targetFeedPath, feedXml, "utf8");
    console.log("feed.xml generated successfully!");

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to generate static sitemap:", error);
    process.exit(1);
  }
}

generate();
