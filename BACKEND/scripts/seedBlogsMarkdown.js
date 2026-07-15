import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import BlogPost from "../src/models/BlogPost.model.js";

dotenv.config();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
});

const DEFAULT_AUTHOR_ID = "filingby-editorial-desk";
const DEFAULT_REVIEWER_ID = "filingby-content-team";
const DEFAULT_FEATURED_IMAGE_WIDTH = 1200;
const DEFAULT_FEATURED_IMAGE_HEIGHT = 675;
const DEFAULT_GALLERY_IMAGE_WIDTH = 1200;
const DEFAULT_GALLERY_IMAGE_HEIGHT = 900;

function normalizeAlertSyntax(markdownContent) {
  return markdownContent.replace(
    /^\[!([A-Z]+)\]\s*(.+)$/gm,
    (_, kind, text) => `> [!${kind}] ${text}`
  );
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function stripMarkdown(markdownContent) {
  return markdownContent
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[>#*_~-]/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadingTime(markdownContent) {
  const words = stripMarkdown(markdownContent).split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.ceil(words / 220));
}

function extractTableOfContents(markdownContent) {
  return markdownContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^##\s+/.test(line) || /^###\s+/.test(line))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^###?\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      return text ? { text, id, level } : null;
    })
    .filter(Boolean);
}

function normalizeFaq(value) {
  return toArray(value)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        q: item.q || item.question || "",
        a: item.a || item.answer || ""
      };
    })
    .filter((item) => item?.q && item?.a);
}

function normalizeGallery(value) {
  return toArray(value)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        url: item.url || "",
        alt: item.alt || "",
        caption: item.caption || "",
        width: Number(item.width) || DEFAULT_GALLERY_IMAGE_WIDTH,
        height: Number(item.height) || DEFAULT_GALLERY_IMAGE_HEIGHT
      };
    })
    .filter((item) => item?.alt && item?.caption);
}

function normalizeReferences(value) {
  return toArray(value)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        title: item.title || "",
        url: item.url || "",
        publisher: item.publisher || item.organisation || "",
        accessedOn: item.accessedOn || ""
      };
    })
    .filter((item) => item?.title && item?.url);
}

function normalizeSources(value) {
  return toArray(value)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        title: item.title || "",
        organisation: item.organisation || item.publisher || "",
        url: item.url || "",
        accessedOn: item.accessedOn || "",
        kind: item.kind || ""
      };
    })
    .filter((item) => item?.title && item?.url);
}

function buildSources(metadata) {
  const sources = normalizeSources(metadata.sources);
  if (sources.length > 0) {
    return sources;
  }

  return normalizeReferences(metadata.references).map((reference) => ({
    title: reference.title,
    organisation: reference.publisher || "",
    url: reference.url,
    accessedOn: reference.accessedOn || "",
    kind: "reference"
  }));
}

function normalizeVersionHistory(value) {
  return toArray(value)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        date: item.date || "",
        change: item.change || ""
      };
    })
    .filter((item) => item?.date && item?.change);
}

function parseMarkdown(rawText) {
  const { data, content } = matter(rawText);
  const normalizedContent = normalizeAlertSyntax(content);
  const renderedHtml = md.render(normalizedContent)
    .replace(/<h([23])>(.*?)<\/h\1>/g, (_, level, headingHtml) => {
      const plainText = headingHtml.replace(/<[^>]+>/g, "").trim();
      const id = plainText
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      return `<h${level} id="${id}">${headingHtml}</h${level}>`;
    })
    .replace(/<table>/g, '<table class="article-table">');
  const cleanHtml = sanitizeHtml(renderedHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td"
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      h2: ["id"],
      h3: ["id"],
      table: ["class"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });

  return {
    metadata: data,
    markdownContent: normalizedContent.trim(),
    htmlContent: cleanHtml
  };
}

const seedMarkdownBlogs = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for markdown blog seeding...");

    const blogsDir = path.join(process.cwd(), "content", "blogs");
    if (!fs.existsSync(blogsDir)) {
      console.error(`Blogs directory does not exist at ${blogsDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(blogsDir).filter((file) => file.endsWith(".md"));
    console.log(`Found ${files.length} markdown articles for seeding.`);

    const postsToInsert = [];

    for (const file of files) {
      const filePath = path.join(blogsDir, file);
      const rawText = fs.readFileSync(filePath, "utf-8");
      const { metadata, markdownContent, htmlContent } = parseMarkdown(rawText);

      if (!metadata.slug || !metadata.title) {
        console.warn(`Skipping file ${file} due to missing slug or title metadata.`);
        continue;
      }

      const readingMinutes = parseInt(metadata.readingTime, 10) || estimateReadingTime(markdownContent);
      const publishedAt = toDate(metadata.publishedAt) || toDate(metadata.lastUpdated) || new Date();
      const lastUpdated = toDate(metadata.lastUpdated) || publishedAt;
      const tableOfContents = toArray(metadata.tableOfContents).length > 0
        ? toArray(metadata.tableOfContents)
        : extractTableOfContents(markdownContent);
      const featuredImage = metadata.featuredImage || metadata.image || "";

      postsToInsert.push({
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt || "",
        content: htmlContent,
        image: featuredImage,
        metaTitle: metadata.seoTitle || metadata.title,
        metaDescription: metadata.seoDescription || metadata.excerpt || "",
        keywords: metadata.focusKeyword || "",
        category: metadata.category || "General",
        tags: toArray(metadata.secondaryKeywords),
        author: metadata.author || "FilingBy Legal Desk",
        authorId: metadata.authorId || DEFAULT_AUTHOR_ID,
        readTime: readingMinutes,
        isPublished: metadata.isPublished ?? true,
        publishedAt,
        lastUpdated,
        lastVerifiedAt: toDate(metadata.lastVerifiedAt) || lastUpdated,
        reviewedBy: metadata.reviewedBy || "",
        reviewerId: metadata.reviewerId || (metadata.reviewedBy ? DEFAULT_REVIEWER_ID : ""),
        reviewedByTitle: metadata.reviewedByTitle || "",
        reviewerExperience: metadata.reviewerExperience || "",
        searchIntent: metadata.searchIntent || "",
        seoTitle: metadata.seoTitle || "",
        seoDescription: metadata.seoDescription || "",
        focusKeyword: metadata.focusKeyword || "",
        secondaryKeywords: toArray(metadata.secondaryKeywords),
        subCategory: metadata.subCategory || "",
        readingTime: metadata.readingTime || `${readingMinutes} mins`,
        featuredImage,
        imageAlt: metadata.imageAlt || "",
        featuredImageWidth: featuredImage
          ? Number(metadata.featuredImageWidth) || DEFAULT_FEATURED_IMAGE_WIDTH
          : undefined,
        featuredImageHeight: featuredImage
          ? Number(metadata.featuredImageHeight) || DEFAULT_FEATURED_IMAGE_HEIGHT
          : undefined,
        tableOfContents,
        keyTakeaways: toArray(metadata.keyTakeaways),
        faq: normalizeFaq(metadata.faq),
        relatedServices: toArray(metadata.relatedServices),
        relatedBlogs: toArray(metadata.relatedBlogs),
        topicHub: metadata.topicHub || "",
        relatedCalculators: toArray(metadata.relatedCalculators),
        relatedTemplates: toArray(metadata.relatedTemplates),
        internalLinks: toArray(metadata.internalLinks),
        cta: metadata.cta || "",
        imageGallery: normalizeGallery(metadata.imageGallery),
        references: normalizeReferences(metadata.references),
        sources: buildSources(metadata),
        versionHistory: normalizeVersionHistory(metadata.versionHistory),
        status: metadata.status || "published"
      });
    }

    if (postsToInsert.length === 0) {
      console.log("No valid markdown articles found to seed.");
      process.exit(0);
    }

    await BlogPost.deleteMany({});
    console.log("Cleared existing blog posts.");

    const seeded = await BlogPost.insertMany(postsToInsert);
    console.log(`Successfully seeded ${seeded.length} markdown blog posts!`);
    process.exit(0);
  } catch (error) {
    console.error("Markdown seeding failed:", error);
    process.exit(1);
  }
};

seedMarkdownBlogs();
