/* global process */
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Define dynamic schema-less models for querying to avoid importing backend files and causing multiple mongoose instance conflicts
const Service = mongoose.models.Service || mongoose.model("Service", new mongoose.Schema({}, { strict: false, collection: "services" }));
const VirtualLocation = mongoose.models.VirtualLocation || mongoose.model("VirtualLocation", new mongoose.Schema({}, { strict: false, collection: "virtuallocations" }));
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", new mongoose.Schema({}, { strict: false, collection: "blogposts" }));

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function serializeForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildBlogSummary(post) {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    image: post.image || post.featuredImage,
    focusKeyword: post.focusKeyword,
  };
}

function buildServiceInitialData(service) {
  return {
    kind: "service-page",
    slug: service.slug,
    service: {
      _id: service._id?.toString?.() || service._id,
      slug: service.slug,
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      updatedAt: service.updatedAt,
      benefits: service.benefits || [],
      documentsRequired: service.documentsRequired || [],
      processSteps: service.processSteps || [],
      faqs: service.faqs || [],
    },
  };
}

function buildBlogInitialData(post, allBlogs) {
  const relatedPosts = allBlogs
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3)
    .map(buildBlogSummary);

  return {
    kind: "blog-post",
    slug: post.slug,
    post,
    relatedPosts,
  };
}

dotenv.config();

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load backend environment file for MONGODB_URI
const backendEnvPath = join(__dirname, "../../BACKEND/.env");
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}
console.log("MONGODB_URI loaded:", process.env.MONGODB_URI ? "YES (Found)" : "NO (Missing)");

const templatePath = join(__dirname, "../dist/index.html");
const distDir = join(__dirname, "../dist");

if (!fs.existsSync(templatePath)) {
  console.error("Vite build output template (dist/index.html) not found. Please run 'vite build' first.");
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, "utf8");

// Static route metadata
const STATIC_PAGES = [
  {
    path: "about-us",
    title: "About Us | FilingBy.com — India's Trusted Compliance Portal",
    description: "Learn about FilingBy's mission, our network of experienced CAs, CSs, and legal professionals, and how we help businesses with seamless compliances.",
    keywords: "about filingby, ca portal india, chartered accountants online, legal desk, business compliance network",
    h1: "About FilingBy",
    content: "<p>FilingBy.com is India's premier CA, CS, and legal compliance network. We connect entrepreneurs, growing businesses, and multinational corporations with experienced professionals to manage GST filings, company formations, tax advisory, and corporate governance 100% online.</p><p>Our mission is to make business compliance transparent, efficient, and affordable for every startup in India.</p>"
  },
  {
    path: "our-promise",
    title: "Our Promise | 100% Compliant & Secure Services | FilingBy",
    description: "Read the FilingBy customer SLA promise. We guarantee transparent pricing, zero hidden charges, timely filing, and robust data security protocols.",
    keywords: "filingby promise, ca service guarantee, business compliance SLA, secure tax filings india",
    h1: "Our Promise to You",
    content: "<p>At FilingBy.com, we promise a hassle-free compliance experience with transparent flat-rate pricing, dedicated expert support, secure data vault standards, and a timely filing SLA guarantee. Your trust is our greatest compliance asset.</p>"
  },
  {
    path: "customer-care",
    title: "Customer Support & Representative Helpdesk | FilingBy",
    description: "Get in touch with a FilingBy representative. We offer instant phone support, WhatsApp chat advisory, and resolution ticketing for all tax filings.",
    keywords: "filingby contact, client support desk, WhatsApp CA advice, contact chartered accountant",
    h1: "Customer Care & Support",
    content: "<p>Have questions about your filings? Reach out to our dedicated client assistance desk. Get instant advisory support over phone calls or WhatsApp chat. Our expert compliance representatives are available Monday to Saturday, 9:00 AM to 7:00 PM.</p>"
  },
  {
    path: "faq",
    title: "Frequently Asked Questions — General Tax & Compliance | FilingBy",
    description: "Find quick answers to common questions about GST registrations, income tax filing deadlines, company registration requirements, and virtual office NOC files.",
    keywords: "compliance FAQs, GST questions, Pvt Ltd criteria, virtual office rules india",
    h1: "Frequently Asked Questions",
    content: "<h3>1. What is the process for company registration?</h3><p>You need to submit director IDs, select a brand name, file the SPICe+ form with the MCA, and register for PAN/TAN. The ROC issues the certificate in 7-10 days.</p><h3>2. How does virtual office work?</h3><p>We provide a legal commercial address, NOC, utility bill, and rent agreement which you submit to register for GST or incorporate a company.</p><h3>3. What are the tax deadlines?</h3><p>Monthly GST filings must be completed by the 11th/20th of each month. ITR returns are usually due by July 31st for individuals.</p>"
  },
  {
    path: "get-live-quote",
    title: "Get a Live Quote — Custom Pricing Estimate | FilingBy",
    description: "Use our interactive pricing tool to get a custom, instant quotation for corporate filings, GST registration, accounting, and virtual office packages.",
    keywords: "calculate filing costs, custom CA quote, business registration price calculator",
    h1: "Request a Custom Quote",
    content: "<p>Use our interactive live pricing tool to configure the exact corporate filing services, bookkeeping hours, and local virtual office addresses your business requires to get a custom price estimation instantly.</p>"
  },
  {
    path: "locations",
    title: "Virtual Office Locations Across 28 States in India | FilingBy",
    description: "Browse premium commercial virtual office addresses for GST registration and company incorporation in Mumbai, Delhi, Surat, Noida, Bangalore, and Pune.",
    keywords: "virtual office locations, business address india, gst verification address, local office spaces",
    h1: "Our Virtual Office Locations",
    content: "<p>Discover compliant commercial business addresses across major economic zones in India. Secure legal rent agreements, utility bills, and landlord NOCs in Delhi, Bangalore, Noida, Gurugram, Mumbai, Surat, and Pune to expand your corporate presence instantly.</p>"
  },
  {
    path: "blog",
    title: "Knowledge Hub & Expert Legal Compliance Blogs | FilingBy",
    description: "Explore legal guides, tax filing instructions, GST regulation changes, startup tips, and ROC compliance checklists authored by expert CAs and CSs.",
    keywords: "knowledge hub blog, compliance guides, legal updates, business filing tips",
    h1: "Knowledge Hub & Compliance Guides",
    content: "<p>Stay informed with the latest statutory updates, step-by-step registration guides, and tax planning strategies written by our network of chartered accountants and corporate secretaries.</p>"
  }
];

const NOINDEX_PAGES = [
  { path: "login", title: "Log In | FilingBy.com" },
  { path: "register", title: "Register | FilingBy.com" },
  { path: "dashboard", title: "Client Dashboard | FilingBy.com" },
  { path: "virtual-office/dashboard", title: "Virtual Office Dashboard | FilingBy.com" },
  { path: "partner/dashboard", title: "Partner Dashboard | FilingBy.com" }
];

// Helper to sanitize HTML file creation
function writeHtmlPage(routePath, pageTitle, pageDescription, pageKeywords, pageSchema, pageContent, initialData = null) {
  const targetDir = join(distDir, routePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const siteUrl = "https://www.filingby.com";
  const canonicalUrl = `${siteUrl}/${routePath.replace(/\/$/, "")}`;

  // Assemble custom metadata block
  const seoMetadata = `
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}" />
  <meta name="keywords" content="${pageKeywords}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FilingBy.com" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${pageDescription}" />
  <meta property="og:image" content="https://www.filingby.com/logo.jpeg" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDescription}" />
  <meta name="twitter:image" content="https://www.filingby.com/logo.jpeg" />

  <!-- Geo / Regional -->
  <meta name="geo.region" content="IN" />
  <meta name="geo.placename" content="India" />
  <meta name="language" content="English" />
  <meta name="author" content="FilingBy.com" />
  <meta name="theme-color" content="#1A56DB" />
  ${pageSchema ? `<script type="application/ld+json">${JSON.stringify(pageSchema)}</script>` : ""}`;

  // Clean default head SEO from template and inject route-specific SEO tags
  let parsedHtml = templateHtml.replace(
    /<!-- Primary SEO \(defaults — react-helmet-async overrides per page\) -->[\s\S]+?<!-- Preconnect for performance -->/,
    `<!-- Preconnect for performance -->`
  );

  parsedHtml = parsedHtml.replace(
    /<\/head>/,
    `${seoMetadata}\n</head>`
  );

  // Inject content into <div id="root">
  const preRenderedContent = `
    <div data-prerender-shell="true">
      <div class="prerendered-content" style="max-width: 1000px; margin: 40px auto; padding: 20px; font-family: -apple-system, sans-serif; line-height: 1.6; color: #334155;">
        ${pageContent}
      </div>
    </div>
    <div id="app-root"></div>
    ${initialData ? `<script id="__FILINGBY_PRERENDER_DATA__" type="application/json">${serializeForScript(initialData)}</script>` : ""}
  `;

  parsedHtml = parsedHtml.replace(
    /<div id="root">\s*<div id="app-root"><\/div>\s*<\/div>/,
    `<div id="root">${preRenderedContent}</div>`
  );

  fs.writeFileSync(join(targetDir, "index.html"), parsedHtml, "utf8");
}

function writeNoIndexHtmlPage(routePath, pageTitle) {
  const targetDir = join(distDir, routePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const seoMetadata = `
  <title>${pageTitle}</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="googlebot" content="noindex, nofollow" />
  <link rel="canonical" href="https://www.filingby.com/${routePath}" />
  `;

  // Clean default head SEO from template and inject route-specific SEO tags
  let parsedHtml = templateHtml.replace(
    /<!-- Primary SEO \(defaults — react-helmet-async overrides per page\) -->[\s\S]+?<!-- Preconnect for performance -->/,
    `<!-- Preconnect for performance -->`
  );

  parsedHtml = parsedHtml.replace(
    /<\/head>/,
    `${seoMetadata}\n</head>`
  );

  fs.writeFileSync(join(targetDir, "index.html"), parsedHtml, "utf8");
}

async function prerender() {
  try {
    // 1. Always prerender static pages
    console.log(`Prerendering ${STATIC_PAGES.length} static pages...`);
    for (const page of STATIC_PAGES) {
      writeHtmlPage(
        page.path,
        page.title,
        page.description,
        page.keywords,
        null,
        `<h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin-bottom: 20px;">${page.h1}</h1>${page.content}`
      );
    }

    console.log(`Prerendering ${NOINDEX_PAGES.length} noindex pages...`);
    for (const page of NOINDEX_PAGES) {
      writeNoIndexHtmlPage(page.path, page.title);
    }

    const staticUrls = [
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

    if (!process.env.MONGODB_URI) {
      console.warn("WARNING: MONGODB_URI is not set. Skipping dynamic page pre-rendering and sitemap generation.");

      // Check if we already have pre-generated files in public/ (committed from local builds)
      const filesToCopy = ["sitemap.xml", "image-sitemap.xml", "robots.txt", "feed.xml"];
      let copiedCount = 0;
      for (const file of filesToCopy) {
        const publicFile = join(__dirname, `../public/${file}`);
        if (fs.existsSync(publicFile)) {
          fs.copyFileSync(publicFile, join(distDir, file));
          copiedCount++;
        }
      }

      if (copiedCount === filesToCopy.length) {
        console.log("Successfully copied pre-generated sitemaps, robots.txt, and feed.xml from public/ to dist/.");
      } else {
        console.log("Pre-generated files missing in public/. Generating static fallbacks...");
        // Re-generate standard static fallbacks as a safe backup...
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        sitemapXml += `\n  <!-- Core Static Pages -->`;
        for (const page of staticUrls) {
          sitemapXml += `
  <url>
    <loc>https://www.filingby.com/${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        }
        sitemapXml += `\n</urlset>\n`;

        fs.writeFileSync(join(distDir, "sitemap.xml"), sitemapXml, "utf8");
        fs.writeFileSync(join(__dirname, "../public/sitemap.xml"), sitemapXml, "utf8");

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
        fs.writeFileSync(join(distDir, "robots.txt"), robotsTxt, "utf8");
        fs.writeFileSync(join(__dirname, "../public/robots.txt"), robotsTxt, "utf8");

        const emptyImageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
</urlset>
`;
        fs.writeFileSync(join(distDir, "image-sitemap.xml"), emptyImageSitemap, "utf8");
        fs.writeFileSync(join(__dirname, "../public/image-sitemap.xml"), emptyImageSitemap, "utf8");

        const emptyFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FilingBy Knowledge Hub</title>
    <link>https://www.filingby.com/blog</link>
    <description>Expert Chartered Accountant advice, tax guides, GST compliance rules, and virtual office regulations in India.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.filingby.com/feed.xml" rel="self" type="application/rss+xml" />
  </channel>
</rss>
`;
        fs.writeFileSync(join(distDir, "feed.xml"), emptyFeedXml, "utf8");
        fs.writeFileSync(join(__dirname, "../public/feed.xml"), emptyFeedXml, "utf8");
      }

      console.log("Pre-rendering build completed successfully!");
      process.exit(0);
    }

    console.log("Connecting to database for prerendering data...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Fetch dynamic content
    const services = await Service.find({ isActive: { $ne: false } }).lean();
    const locations = await VirtualLocation.find().lean();
    const blogs = await BlogPost.find({ isPublished: true }).lean();

    console.log(`Prerendering ${services.length} CA services...`);
    for (const service of services) {
      const title = `${service.name} Online India — Fast & Affordable | FilingBy`;
      const description = service.description || `Get expert CA/CS assisted ${service.name} services online in India with transparent pricing.`;
      const keywords = `${service.name.toLowerCase()} online, ${service.name.toLowerCase()} registration, online CA services India`;

      const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": service.name,
        "description": service.description || description,
        "brand": { "@type": "Brand", "name": "FilingBy" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": service.basePrice || "999.00"
        }
      };

      const bodyContent = `
        <h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin-bottom: 20px;">${service.name}</h1>
        <p style="font-size: 18px; color: #475569; margin-bottom: 30px;">${service.description}</p>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 10px;">Pricing details</h2>
          <p style="font-size: 24px; font-weight: 800; color: #1A56DB;">₹${service.basePrice || "999"} <span style="font-size: 14px; font-weight: 500; color: #64748B;">/ ${service.billingCycle || "Fixed"}</span></p>
        </div>
        ${service.documentsRequired?.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">Documents Required</h2>
          <ul style="margin-bottom: 30px; padding-left: 20px;">
            ${service.documentsRequired.map(doc => `<li style="margin-bottom: 8px;">${doc}</li>`).join("")}
          </ul>
        ` : ""}
        ${service.processSteps?.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">Filing Process</h2>
          <ol style="margin-bottom: 30px; padding-left: 20px;">
            ${service.processSteps.map(step => `<li style="margin-bottom: 12px;">${step}</li>`).join("")}
          </ol>
        ` : ""}
        ${service.faqs?.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">FAQs</h2>
          <div style="margin-top: 15px;">
            ${service.faqs.map(faq => `<div style="margin-bottom: 20px;"><strong style="color: #0F172A; font-size: 16px;">Q: ${faq.q}</strong><p style="margin-top: 6px; color: #475569;">A: ${faq.a}</p></div>`).join("")}
          </div>
        ` : ""}
      `;

      writeHtmlPage(
        `services/${service.slug}`,
        title,
        description,
        keywords,
        schema,
        bodyContent,
        buildServiceInitialData(service)
      );
    }

    console.log(`Prerendering ${locations.length} virtual office cities and area hubs...`);
    for (const loc of locations) {
      // 1. City Page
      const cityTitle = `Virtual Office in ${loc.name} — GST Address ₹${loc.rate}/mo | FilingBy`;
      const cityDesc = `Get a premium virtual office address in ${loc.name} for GST registration, company incorporation, or business mailing. Starting ₹${loc.rate}/month.`;
      const cityKeywords = `virtual office ${loc.slug}, virtual office address ${loc.slug}, business address ${loc.slug}`;

      const citySchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `Virtual Office ${loc.name} — FilingBy`,
        "description": cityDesc,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": loc.name,
          "addressRegion": loc.name,
          "addressCountry": "IN"
        }
      };

      const cityBody = `
        <h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">Virtual Office in ${loc.name}</h1>
        <p style="font-size: 18px; color: #475569; margin-bottom: 25px;">${loc.tagline || "Premium commercial business addresses for GST & company incorporation"}</p>
        <p style="font-size: 16px; color: #64748B; margin-bottom: 30px;">Starting at ₹${loc.rate}/month. Includes landlord NOC, rent agreement, and utility bills for 100% compliance.</p>
        <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px; margin-bottom: 15px;">Available locations in ${loc.name}</h2>
        <div style="display: grid; gap: 20px; margin-bottom: 30px;">
          ${loc.addresses?.map(addr => `
            <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #FFF;">
              <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 6px;">${addr.name}</h3>
              <p style="color: #475569; margin-bottom: 8px;">${addr.address}</p>
              <span style="font-weight: 600; color: #1A56DB;">Feature: ${addr.feature || "Compliant Workspace"}</span>
            </div>
          `).join("")}
        </div>
      `;

      writeHtmlPage(
        `virtual-office-${loc.slug}`,
        cityTitle,
        cityDesc,
        cityKeywords,
        citySchema,
        cityBody
      );

      // 2. Area Pages
      if (loc.addresses && loc.addresses.length > 0) {
        for (const addr of loc.addresses) {
          const areaTitle = `Virtual Office in ${addr.name}, ${loc.name} | FilingBy`;
          const areaDesc = `Secure NOC, rent agreement, and utility bills for GST and company registration at ${addr.name}, ${loc.name}. Starting ₹${addr.priceGST || loc.rate}/mo.`;
          const areaKeywords = `virtual office ${addr.slug}, virtual office ${loc.slug}, GST address ${addr.slug}`;

          const areaBody = `
            <h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">${addr.name}</h1>
            <h2 style="font-size: 18px; color: #64748B; margin-bottom: 25px;">Virtual Office Address in ${loc.name}</h2>
            <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #F8FAFC; margin-bottom: 30px;">
              <strong style="color: #0F172A;">Physical Address:</strong>
              <p style="font-size: 16px; color: #475569; margin-top: 6px; margin-bottom: 12px;">${addr.address}</p>
              <strong style="color: #0F172A;">Pricing Breakup:</strong>
              <p style="margin-top: 6px;">GST Registration Plan: <span style="font-weight: 800; color: #1A56DB;">₹${addr.priceGST || "999"}/mo</span></p>
              <p>Company Incorporation Plan: <span style="font-weight: 800; color: #1A56DB;">₹${addr.priceIncorp || "1,299"}/mo</span></p>
              <p>Mail Handling Only Plan: <span style="font-weight: 800; color: #1A56DB;">₹${addr.priceMail || "599"}/mo</span></p>
            </div>
            <h3 style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 10px;">Workspace Description</h3>
            <p style="color: #475569; margin-bottom: 30px;">${addr.description || `A premium commercial desk space and business address in ${loc.name}. Fully compliant for all corporate registration needs.`}</p>
          `;

          writeHtmlPage(
            `virtual-office-${loc.slug}/${addr.slug}`,
            areaTitle,
            areaDesc,
            areaKeywords,
            null,
            areaBody
          );
        }
      }
    }

    console.log(`Prerendering ${blogs.length} published blogs...`);
    for (const post of blogs) {
      const title = `${post.metaTitle || post.title} | FilingBy.com`;
      const description = post.metaDescription || post.excerpt;
      const keywords = post.keywords || `${post.title.toLowerCase()}, filingby blog`;
      const formattedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN") : "";
      const formattedUpdatedDate = post.lastUpdated ? new Date(post.lastUpdated).toLocaleDateString("en-IN") : formattedDate;
      const formattedVerifiedDate = post.lastVerifiedAt ? new Date(post.lastVerifiedAt).toLocaleDateString("en-IN") : "";
      const reviewerName = post.reviewerId === "filingby-content-team" ? "FilingBy Content Team" : "FilingBy Content Team";

      const postSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": description,
        "datePublished": post.publishedAt,
        "dateModified": post.lastUpdated || post.updatedAt || post.publishedAt,
        "author": { "@type": "Person", "name": post.author || "FilingBy Editorial Desk" },
        "reviewedBy": { "@type": "Organization", "name": reviewerName }
      };

      const bodyContent = `
        <article style="max-width: 800px; margin: 0 auto;">
          <div style="font-size: 14px; font-weight: 600; color: #1A56DB; text-transform: uppercase; margin-bottom: 10px;">
            ${post.category} &bull; ${post.readTime} min read &bull; ${formattedDate}
          </div>
          <h1 style="font-size: 36px; font-weight: 800; color: #0F172A; line-height: 1.25; margin-bottom: 20px;">${post.title}</h1>
          <div style="display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 22px; font-size: 14px; color: #475569;">
            <span><strong style="color: #0F172A;">Written by:</strong> ${post.author || "FilingBy Editorial Desk"}</span>
            <span><strong style="color: #0F172A;">Reviewed by:</strong> ${reviewerName}</span>
            <span><strong style="color: #0F172A;">Last updated:</strong> ${formattedUpdatedDate}</span>
            ${formattedVerifiedDate ? `<span><strong style="color: #0F172A;">Last verified:</strong> ${formattedVerifiedDate}</span>` : ""}
          </div>
          ${post.image ? `<img src="${post.image}" alt="${escapeXml(post.imageAlt || post.title)}" style="width: 100%; height: auto; border-radius: 18px; margin-bottom: 24px;" />` : ""}
          <p style="font-size: 18px; color: #475569; font-style: italic; margin-bottom: 30px; border-left: 4px solid #E2E8F0; padding-left: 15px;">${post.excerpt}</p>
          <div style="margin-top: 30px; font-size: 16px; color: #334155;" class="blog-body">
            ${post.content}
          </div>
          <div style="margin-top: 32px; padding: 18px 20px; border: 1px solid #E2E8F0; border-radius: 16px; background: #FFFFFF;">
            <strong style="display: block; color: #0F172A; margin-bottom: 8px;">Editorial note</strong>
            <span style="color: #475569;">This article is general information for Indian businesses. It is not legal, tax or accounting advice for your exact facts.</span>
          </div>
        </article>
      `;

      writeHtmlPage(
        `blog/${post.slug}`,
        title,
        description,
        keywords,
        postSchema,
        bodyContent,
        buildBlogInitialData(post, blogs)
      );
    }

    // Generate sitemap.xml automatically
    console.log("Generating sitemap.xml automatically...");

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    sitemapXml += `\n  <!-- Core Static Pages -->`;
    for (const page of staticUrls) {
      sitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/${page.path}`)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    sitemapXml += `\n\n  <!-- Dynamic CA / Compliance Services -->`;
    for (const service of services) {
      sitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/services/${service.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    sitemapXml += `\n\n  <!-- Dynamic Virtual Office Cities and Areas -->`;
    for (const loc of locations) {
      sitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/virtual-office-${loc.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      if (loc.addresses && loc.addresses.length > 0) {
        for (const addr of loc.addresses) {
          sitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/virtual-office-${loc.slug}/${addr.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
        }
      }
    }

    sitemapXml += `\n\n  <!-- Dynamic Blogs and Guides -->`;
    for (const post of blogs) {
      const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : null;
      sitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/blog/${post.slug}`)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${lastMod ? `\n    <lastmod>${lastMod}</lastmod>` : ""}`;

      if (post.image) {
        sitemapXml += `
    <image:image>
      <image:loc>${escapeXml(post.image)}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>`;
      }

      sitemapXml += `
  </url>`;
    }

    sitemapXml += `\n</urlset>\n`;

    // Save to dist/sitemap.xml (for current production build)
    fs.writeFileSync(join(distDir, "sitemap.xml"), sitemapXml, "utf8");
    // Save to public/sitemap.xml (to persist in static repo folder)
    const publicSitemapPath = join(__dirname, "../public/sitemap.xml");
    fs.writeFileSync(publicSitemapPath, sitemapXml, "utf8");
    console.log("Sitemap.xml generated and updated automatically!");

    // Generate robots.txt automatically
    console.log("Generating robots.txt automatically...");
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
    fs.writeFileSync(join(distDir, "robots.txt"), robotsTxt, "utf8");
    fs.writeFileSync(join(__dirname, "../public/robots.txt"), robotsTxt, "utf8");
    console.log("robots.txt generated and updated automatically!");

    // Generate image-sitemap.xml automatically
    console.log("Generating image-sitemap.xml automatically...");
    let imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    for (const post of blogs) {
      if (post.image) {
        imageSitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/blog/${post.slug}`)}</loc>
    <image:image>
      <image:loc>${escapeXml(post.image)}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>
  </url>`;
      }
    }
    imageSitemapXml += `\n</urlset>\n`;
    fs.writeFileSync(join(distDir, "image-sitemap.xml"), imageSitemapXml, "utf8");
    fs.writeFileSync(join(__dirname, "../public/image-sitemap.xml"), imageSitemapXml, "utf8");
    console.log("image-sitemap.xml generated and updated automatically!");

    // Generate feed.xml (RSS Feed) automatically
    console.log("Generating feed.xml (RSS Feed) automatically...");
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
      ${post.image ? `<enclosure url="${escapeXml(post.image)}" length="0" type="image/jpeg" />` : ""}
    </item>`;
    }
    feedXml += `\n  </channel>\n</rss>\n`;
    fs.writeFileSync(join(distDir, "feed.xml"), feedXml, "utf8");
    fs.writeFileSync(join(__dirname, "../public/feed.xml"), feedXml, "utf8");
    console.log("feed.xml (RSS Feed) generated and updated automatically!");

    console.log("Database connection closed.");
    await mongoose.connection.close();
    console.log("Pre-rendering built completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Pre-rendering execution error:", error);
    process.exit(1);
  }
}

prerender();
