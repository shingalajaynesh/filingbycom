import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blogs");
const SITEMAP_PATH = path.join(process.cwd(), "..", "FRONTEND", "public", "sitemap.xml");

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "seoTitle",
  "seoDescription",
  "focusKeyword",
  "category",
  "author",
  "lastUpdated",
  "isPublished"
];

const VERIFIED_REVIEWERS = new Set(["filingby-content-team"]);
const VERIFIED_AUTHORS = new Set(["filingby-editorial-desk"]);
const HIGH_STAKES_CATEGORIES = new Set([
  "GST",
  "Company Registration",
  "LLP",
  "Trademark",
  "Income Tax",
  "TDS",
  "Startup India",
  "MSME",
  "FSSAI",
  "IEC",
  "ROC Compliance"
]);

function hasSourceMaterial(data) {
  const hasSources = Array.isArray(data.sources) && data.sources.length > 0;
  const hasReferences = Array.isArray(data.references) && data.references.length > 0;
  return hasSources || hasReferences;
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/[>#*_~-]/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  return stripMarkdown(text).split(/\s+/).filter(Boolean).length;
}

function paragraphMetrics(body) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith("#") && !part.startsWith("|"));

  const lengths = paragraphs.map((part) => wordCount(part));
  return {
    paragraphCount: paragraphs.length,
    averageParagraphWords: lengths.length
      ? Math.round(lengths.reduce((sum, value) => sum + value, 0) / lengths.length)
      : 0,
    longParagraphs: lengths.filter((value) => value > 120).length,
    paragraphs
  };
}

function extractInternalLinks(body, metadata) {
  const markdownLinks = [...body.matchAll(/\[[^\]]+]\((\/[^)]+)\)/g)].map((match) => match[1]);
  const frontmatterLinks = [
    ...(Array.isArray(metadata.internalLinks) ? metadata.internalLinks : []),
    ...(Array.isArray(metadata.relatedCalculators) ? metadata.relatedCalculators : []),
    ...(Array.isArray(metadata.relatedBlogs) ? metadata.relatedBlogs.map((slug) => `/blog/${slug}`) : []),
    ...(Array.isArray(metadata.relatedServices) ? metadata.relatedServices.map((slug) => `/services/${slug}`) : []),
    ...(metadata.topicHub ? [metadata.topicHub] : [])
  ];

  return [...new Set([...markdownLinks, ...frontmatterLinks])];
}

function getLiveRoutes(files) {
  const routes = new Set(["/", "/blog", "/virtual-space", "/locations", "/income-tax-calculator"]);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);
    if (data.slug) {
      routes.add(`/blog/${data.slug}`);
    }
  }

  if (fs.existsSync(SITEMAP_PATH)) {
    const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
    const matches = sitemap.matchAll(/<loc>https:\/\/www\.filingby\.com([^<]+)<\/loc>/g);
    for (const match of matches) {
      routes.add(match[1]);
    }
  }

  return routes;
}

function countExactKeyword(body, keyword) {
  if (!keyword) return 0;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return (body.match(regex) || []).length;
}

function repeatedHeadingCount(body) {
  const headings = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^##+\s+/.test(line))
    .map((line) => line.toLowerCase());
  const counts = new Map();
  for (const heading of headings) {
    counts.set(heading, (counts.get(heading) || 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1);
}

function duplicateParagraphMap(files) {
  const map = new Map();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const body = raw.split("---").slice(2).join("---");
    const paragraphs = body
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("#") && wordCount(part) > 30);

    for (const paragraph of paragraphs) {
      const key = paragraph.toLowerCase();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(file);
    }
  }

  return [...map.entries()]
    .filter(([, usedBy]) => new Set(usedBy).size > 1)
    .map(([paragraph, usedBy]) => ({
      paragraph: paragraph.slice(0, 220),
      files: [...new Set(usedBy)]
    }))
    .sort((a, b) => b.files.length - a.files.length);
}

function validateFile(file, liveRoutes) {
  const absolutePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const { data, content } = matter(raw);
  const metrics = paragraphMetrics(content);
  const links = extractInternalLinks(content, data);
  const issues = [];

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  if (HIGH_STAKES_CATEGORIES.has(data.category) && !hasSourceMaterial(data)) {
    issues.push("Missing references or sources for a high-stakes compliance article");
  }

  if (data.reviewerId && !VERIFIED_REVIEWERS.has(data.reviewerId)) {
    issues.push(`Reviewer profile is not verified: ${data.reviewerId}`);
  }

  if (data.reviewedBy && !data.reviewerId) {
    issues.push("Reviewed content is missing reviewerId");
  }

  if (data.authorId && !VERIFIED_AUTHORS.has(data.authorId)) {
    issues.push(`Author profile is not verified: ${data.authorId}`);
  }

  if (data.featuredImage && (!data.featuredImageWidth || !data.featuredImageHeight)) {
    issues.push("Featured image is missing width or height");
  }

  if (Array.isArray(data.imageGallery)) {
    const dimensionless = data.imageGallery.filter((item) => item.url && (!item.width || !item.height)).length;
    if (dimensionless > 0) {
      issues.push(`Image gallery has ${dimensionless} item(s) without width and height`);
    }
  }

  if (!/^##\s+/m.test(content)) {
    issues.push("Missing H2 sections");
  }

  if (/lorem ipsum|todo|tbd|placeholder|\[insert/i.test(content)) {
    issues.push("Contains unresolved placeholder text");
  }

  if (metrics.longParagraphs > 0) {
    issues.push(`Contains ${metrics.longParagraphs} paragraph(s) over 120 words`);
  }

  const repeatedHeadings = repeatedHeadingCount(content);
  if (repeatedHeadings.length > 0) {
    issues.push(`Contains repeated headings: ${repeatedHeadings.map(([heading]) => heading.replace(/^#+\s+/, "")).join(", ")}`);
  }

  const focusKeywordCount = countExactKeyword(content.toLowerCase(), String(data.focusKeyword || "").toLowerCase());
  if (focusKeywordCount > 8) {
    issues.push(`Focus keyword repeated ${focusKeywordCount} times`);
  }

  const brokenLinks = links.filter(
    (href) =>
      href.startsWith("/") &&
      !href.startsWith("/blog?category=") &&
      !href.startsWith("/services/") &&
      !liveRoutes.has(href)
  );
  if (brokenLinks.length > 0) {
    issues.push(`Broken internal links: ${brokenLinks.join(", ")}`);
  }

  return {
    file,
    title: data.title || "",
    slug: data.slug || "",
    wordCount: wordCount(content),
    averageParagraphWords: metrics.averageParagraphWords,
    focusKeywordCount,
    issues
  };
}

function printSection(title, lines) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
  for (const line of lines) {
    console.log(line);
  }
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
  const liveRoutes = getLiveRoutes(files);
  const audits = files.map((file) => validateFile(file, liveRoutes));
  const duplicateParagraphs = duplicateParagraphMap(files).slice(0, 10);

  const titleMap = new Map();
  const metaMap = new Map();
  for (const file of files) {
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
    if (data.title) {
      titleMap.set(data.title, [...(titleMap.get(data.title) || []), file]);
    }
    if (data.seoDescription) {
      metaMap.set(data.seoDescription, [...(metaMap.get(data.seoDescription) || []), file]);
    }
  }

  const duplicateTitles = [...titleMap.entries()].filter(([, list]) => list.length > 1);
  const duplicateMetaDescriptions = [...metaMap.entries()].filter(([, list]) => list.length > 1);
  const failed = audits.filter((item) => item.issues.length > 0);

  printSection(
    "Summary",
    [
      `Files audited: ${audits.length}`,
      `Files with issues: ${failed.length}`,
      `Duplicate titles: ${duplicateTitles.length}`,
      `Duplicate meta descriptions: ${duplicateMetaDescriptions.length}`,
      `Cross-file repeated paragraphs found: ${duplicateParagraphs.length}`
    ]
  );

  if (duplicateParagraphs.length > 0) {
    printSection(
      "Repeated Paragraphs",
      duplicateParagraphs.map((item) => `${item.files.length} files | ${item.files.join(", ")} | ${item.paragraph}`)
    );
  }

  if (failed.length > 0) {
    printSection(
      "File Issues",
      failed.flatMap((item) => [
        `${item.file} | words=${item.wordCount} | avgParagraph=${item.averageParagraphWords} | keywordMatches=${item.focusKeywordCount}`,
        ...item.issues.map((issue) => `  - ${issue}`)
      ])
    );
    process.exitCode = 1;
    return;
  }

  printSection("Status", ["All audited blog files passed the configured quality checks."]);
}

main();
