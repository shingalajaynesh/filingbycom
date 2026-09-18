/* global process */
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { CORE_SERVICES_CONTENT } from "../src/shared/data/coreServicesContent.js";

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
    path: "",
    title: "Online CA Services in India | Business & Tax Filing | FilingBy",
    description: "FilingBy provides expert GST registration, company incorporation, trademark filing, ITR filing, ROC compliance, and virtual office services across India.",
    keywords: "GST registration online, private limited company registration India, trademark filing, income tax return filing, virtual office India, professional tax registration, startup business setup, CA services online",
    h1: "Start, Manage & Grow Your Business with Online CA Services",
    content: `
      <p style="font-size: 18px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
        FilingBy.com connects Indian entrepreneurs, growing startups, and established enterprises with qualified Chartered Accountants (CAs), Company Secretaries (CSs), and corporate legal advisors. Manage GST registrations, corporate filings, income tax returns, trademark registrations, and virtual office addresses 100% online with transparent flat-rate pricing.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin: 30px 0;">
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 17px; margin-bottom: 8px;">GST Registration &amp; Filing</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">New GSTIN registration, regular monthly GSTR-1 &amp; GSTR-3B filings, annual returns (GSTR-9), and LUT filing for exporters with end-to-end CA assistance.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 17px; margin-bottom: 8px;">Company Incorporation</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Incorporate Private Limited (Pvt Ltd), Limited Liability Partnership (LLP), One Person Company (OPC), or Section 8 non-profit entities via SPICe+ MCA filing.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 17px; margin-bottom: 8px;">Virtual Office for GST (Major Business Hubs)</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Premium commercial office addresses with landlord NOC, registered rent agreements, and latest electricity bills in Mumbai, Surat, Delhi, Bangalore, and Pune.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 17px; margin-bottom: 8px;">Trademark &amp; IP Protection</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Brand name search, trademark class selection (Classes 1-45), online application filing with the Trade Marks Registry, and examination reply drafting.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 17px; margin-bottom: 8px;">Income Tax Return (ITR) Filing</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Expert CA assisted ITR-1, ITR-2, ITR-3, and ITR-4 filing for salaried individuals, traders, professionals, and small businesses for AY 2026-27.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 17px; margin-bottom: 8px;">ROC &amp; MCA Annual Compliance</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Filing annual financial statements (AOC-4), annual return of shares (MGT-7), LLP Form 8 &amp; 11, and DIR-3 KYC for active corporate directors.</p>
        </div>
      <h2 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 36px; margin-bottom: 8px;">Popular Services</h2>
      <p style="font-size: 15px; color: #64748B; margin-bottom: 20px;">Most ordered services by Indian businesses</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 36px;">
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/gst-registration" style="color: #0F172A; text-decoration: none;">GST Registration</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Official Goods and Services Tax registration for businesses in India. Get your 15-digit GSTIN with complete document verification.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹999</span>
            </div>
            <a href="/services/gst-registration" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/private-limited-company" style="color: #0F172A; text-decoration: none;">Private Limited Company</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Incorporate your Pvt Ltd company via MCA V3 SPICe+ framework. Includes DIN, name approval, DSC, and Certificate of Incorporation.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹6999</span>
            </div>
            <a href="/services/private-limited-company" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/trademark-registration" style="color: #0F172A; text-decoration: none;">Trademark Registration</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Protect your brand name, logo, or slogan across India with IP India online filing and comprehensive classification search.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹6999</span>
            </div>
            <a href="/services/trademark-registration" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/gst-return-filing" style="color: #0F172A; text-decoration: none;">GST Return Filing</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Monthly &amp; quarterly GSTR-1, GSTR-2B/IMS reconciliation, and GSTR-3B tax payment computation under QRMP or monthly schemes.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹6999/Month</span>
            </div>
            <a href="/services/gst-return-filing" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/llp-registration" style="color: #0F172A; text-decoration: none;">LLP Registration</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Incorporate a Limited Liability Partnership under MCA rules. Combines corporate limited liability with partnership operational flexibility.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹4999</span>
            </div>
            <a href="/services/llp-registration" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #DBEAFE;">Essential</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/itr-1-filing" style="color: #0F172A; text-decoration: none;">ITR-1 Salaried Individual</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Income tax return filing for salaried residents with total income up to ₹50 Lakhs under New vs Old Tax Regime optimization.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹999</span>
            </div>
            <a href="/services/itr-1-filing" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/udyam-registration" style="color: #0F172A; text-decoration: none;">MSME Udyam Guidance</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Advisory and document preparation for MSME classification under revised composite investment and turnover thresholds.</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹499</span>
            </div>
            <a href="/services/udyam-registration" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>

        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="display: inline-block; background: #FFF7ED; color: #C2410C; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid #FFEDD5;">Popular</span>
            <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;"><a href="/services/roc-annual-filing-pvt" style="color: #0F172A; text-decoration: none;">ROC Filing (Pvt Ltd)</a></h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin-bottom: 14px;">Statutory annual compliance filing for private limited companies: Form AOC-4 (Financials) and Form MGT-7/7A (Annual Return).</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 12px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; color: #94A3B8; display: block; font-weight: 600;">Starting at</span>
              <span style="font-size: 16px; font-weight: 800; color: #1A56DB;">₹2999</span>
            </div>
            <a href="/services/roc-annual-filing-pvt" style="color: #1A56DB; font-weight: 600; font-size: 13px; text-decoration: none;">View details →</a>
          </div>
        </div>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 36px; margin-bottom: 16px;">Free Compliance &amp; Tax Calculators</h2>
      <p style="font-size: 15px; color: #475569; margin-bottom: 18px;">Access our free interactive tax calculators and compliance checklists designed for Indian businesses and tax filers:</p>
      <ul style="padding-left: 20px; margin-bottom: 30px; line-height: 1.8; color: #334155;">
        <li><a href="/gst-calculator" style="color: #1A56DB; font-weight: 600;">Online GST Calculator</a> — Compute CGST, SGST, and IGST breakdowns for 5%, 12%, 18%, and 28% slabs.</li>
        <li><a href="/income-tax-calculator" style="color: #1A56DB; font-weight: 600;">Income Tax Calculator (FY 2025-26)</a> — Compare tax liability between Old and New Tax Regimes with automated rebate calculations.</li>
        <li><a href="/roc-tools" style="color: #1A56DB; font-weight: 600;">ROC Compliance Tools</a> — Track MCA annual return due dates, statutory penalty rules, and LLP compliance checklists.</li>
        <li><a href="/company-registration-guides" style="color: #1A56DB; font-weight: 600;">Company Registration Guide</a> — Compare Private Limited, LLP, One Person Company, and Sole Proprietorship options.</li>
        <li><a href="/trademark-search" style="color: #1A56DB; font-weight: 600;">Trademark Public Search Guide</a> — Search brand name availability across IP India public registry classes.</li>
        <li><a href="/legal-templates" style="color: #1A56DB; font-weight: 600;">Legal Templates &amp; Business Contracts</a> — Download standard NDA, Founders Agreement, and SLA drafting formats.</li>
      </ul>

      <h2 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 36px; margin-bottom: 16px;">How It Works: 100% Online CA Process</h2>
      <ol style="padding-left: 20px; margin-bottom: 30px; line-height: 1.8; color: #334155;">
        <li><strong>Step 1: Select Service &amp; Share Details</strong> — Choose your service (GST, Company Registration, ITR, or Virtual Office) and provide basic business information.</li>
        <li><strong>Step 2: Secure Document Upload</strong> — Upload required identity proofs and address documents via our encrypted client portal.</li>
        <li><strong>Step 3: CA Review &amp; Statutory Filing</strong> — Our qualified chartered accountants and legal experts review your case, prepare the forms, and file them directly on official government portals (MCA, GSTN, Income Tax, IP India).</li>
      </ol>

      <h2 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 36px; margin-bottom: 16px;">Why Indian Businesses Trust FilingBy</h2>
      <ul style="padding-left: 20px; margin-bottom: 30px; line-height: 1.8; color: #334155;">
        <li><strong>Verified Professionals:</strong> Applications are verified by qualified compliance and tax professionals.</li>
        <li><strong>Flat-Rate Transparent Pricing:</strong> Zero hidden consultation charges. You pay clear upfront service fees.</li>
        <li><strong>Fast Turnaround SLA:</strong> Applications submitted within 24 to 72 business hours.</li>
        <li><strong>Service Fee Refund Guarantee:</strong> 100% refund of FilingBy service fees if registration fails due to verified documentation defects directly attributable to us.</li>
      </ul>

      <h2 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 36px; margin-bottom: 16px;">Frequently Asked Questions</h2>
      <div style="margin-top: 16px;">
        <div style="margin-bottom: 20px;">
          <strong style="color: #0F172A; font-size: 16px;">Q: What documents are required for Private Limited company registration?</strong>
          <p style="margin-top: 6px; color: #475569;">A: Directors need PAN card, Aadhaar/Passport, recent bank statement or electricity bill, and registered office proof (landlord NOC, rent agreement, utility bill).</p>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #0F172A; font-size: 16px;">Q: How long does GST registration take?</strong>
          <p style="margin-top: 6px; color: #475569;">A: GST registration is typically granted within 3 to 7 working days upon submission of Aadhaar-authenticated application to the GSTN portal.</p>
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #0F172A; font-size: 16px;">Q: Can I use a virtual office for Amazon and Flipkart seller registration?</strong>
          <p style="margin-top: 6px; color: #475569;">A: Yes. Our virtual offices provide Virtual Principal Place of Business (VPOB) and Principal Place of Business (PPOB) documentation accepted by major e-commerce platforms across all Indian states.</p>
        </div>
      </div>
    `
  },
  {
    path: "about-us",
    title: "About Us | FilingBy.com — India's Trusted Compliance Portal",
    description: "Learn about FilingBy's mission, our network of experienced compliance analysts and tax professionals, and how we help businesses with seamless compliances.",
    keywords: "about filingby, corporate compliance portal india, tax professionals online, legal desk, business compliance network",
    h1: "About FilingBy",
    content: `
      <p style="font-size: 18px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
        FilingBy.com is an Indian corporate compliance and legal technology platform founded to simplify business registration, taxation, and statutory compliance for entrepreneurs, MSMEs, and growing businesses across India.
      </p>
      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Our Mission &amp; Purpose</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Starting and running a business in India requires adherence to an intricate regulatory framework spanning the Ministry of Corporate Affairs (MCA), the Goods and Services Tax Network (GSTN), the Income Tax Department (CBDT), and the Controller General of Patents, Designs and Trade Marks (IP India). For many founders, dealing with multiple government portals, changing form formats, and tight compliance deadlines causes unnecessary administrative friction.
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        FilingBy addresses this challenge by providing an integrated, cloud-enabled compliance desk. We streamline documentation workflows, conduct rigorous pre-filing checks on client identity documents, and ensure that every application meets statutory validation standards before portal submission.
      </p>
      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Core Services We Support</h2>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155; margin-bottom: 24px;">
        <li><strong>Corporate Incorporation:</strong> Complete legal drafting and registration assistance for Private Limited Companies, LLPs, OPCs, Partnerships, and Section 8 non-profits via the MCA SPICe+ framework.</li>
        <li><strong>Tax Registration &amp; Filing:</strong> End-to-end GST registration, monthly and quarterly GSTR return filing, Input Tax Credit (ITC) reconciliation, and individual/business Income Tax Return (ITR) preparation.</li>
        <li><strong>Intellectual Property:</strong> Trademark public clearance searches across 45 international Nice classes, TM-A application drafting, and formal examination report replies.</li>
        <li><strong>Commercial Virtual Offices:</strong> Fully compliant business address solutions in key commercial hubs including Mumbai, Delhi, Surat, and Bangalore, complete with owner NOC, utility bills, and registered rental agreements suitable for GST registration.</li>
      </ul>
      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Our Quality Standards &amp; Client Commitment</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        We operate on the principles of complete pricing transparency, robust data privacy, and systematic document verification. We quote transparent upfront service fees with zero hidden charges. In the rare event that an application is rejected by authorities due to a documentation error on our part, we uphold a clear 100% money-back refund guarantee.
      </p>
    `
  },
  {
    path: "our-promise",
    title: "Our Service Commitment & Client Guarantee | FilingBy.com",
    description: "Read the FilingBy client service charter. We guarantee transparent flat-rate pricing, thorough pre-filing document validation, strict data privacy, and a 100% money-back refund guarantee.",
    keywords: "filingby promise, client service charter, compliance guarantee, transparent pricing, secure document vault, refund policy",
    h1: "Our Service Commitment to Indian Businesses",
    content: `
      <p style="font-size: 18px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
        At FilingBy.com, we recognize that regulatory compliance, tax filing, and corporate registrations form the foundational bedrock of your business. Our service charter is built upon five non-negotiable principles designed to give entrepreneurs, startups, and growing enterprises complete confidence and peace of mind.
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">1. Absolute Pricing Transparency — Zero Hidden Fees</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Unexpected ancillary charges and hidden drafting fees erode trust. Every service on FilingBy—from GST registrations and Private Limited company incorporations to trademark applications and ROC annual filings—features upfront, itemized fee breakdowns. You know precisely what is paid for professional drafting and advisory assistance, and what constitutes statutory government fees or stamp duties, before initiating any work.
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">2. Rigorous Multi-Tier Document Verification</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Government portals (MCA V3, GSTN, IP India, Income Tax) reject applications with minor spelling mismatches, invalid PAN links, or improper utility bill dates. Our operational workflow enforces a multi-tier pre-filing review: your uploaded identity proofs, NOCs, and address documents are systematically checked by experienced compliance analysts before formal portal submission, minimizing the risk of government resubmission notices or clarification requests.
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">3. Strict Data Vault &amp; Cryptographic Privacy</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Confidential client records—including Aadhaar cards, PAN details, bank account statements, and incorporation bylaws—are treated with bank-grade security protocols. We utilize encrypted cloud vaults, strict role-based internal access permissions, and automated session management to prevent unauthorized access. We never sell, license, or monetize your corporate information.
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">4. Clear Filing SLAs &amp; Real-Time Tracking</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Missing a statutory due date triggers severe daily penalties under Section 403 of the Companies Act or late fees under Section 47 of the CGST Act. We operate with strict turnaround SLAs: document reviews begin within 4 to 12 hours of receipt, and filings are submitted within 24 to 72 business hours upon receipt of verified paperwork. Clients receive real-time status updates and SRN/acknowledgment numbers immediately upon submission.
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">5. Honest 100% Money-Back Refund Guarantee</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        We take full accountability for our work. In the rare scenario that a government application or virtual office registration fails due to an error, oversight, or documentation flaw attributable to FilingBy, we issue a 100% refund of our professional service charges without bureaucratic friction. Your satisfaction and trust remain our highest operational priority.
      </p>
    `
  },
  {
    path: "customer-care",
    title: "Customer Care Helpdesk & Support Services | FilingBy.com",
    description: "Connect with the FilingBy client care team. Multi-channel support via direct telephone, WhatsApp desk, email ticketing, and dedicated case manager assistance.",
    keywords: "filingby customer care, compliance support desk, client assistance, whatsapp compliance help, case manager",
    h1: "Customer Care & Client Assistance Desk",
    content: `
      <p style="font-size: 18px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
        Welcome to the FilingBy Customer Care and Client Assistance Desk. Whether you require guidance on selecting the right business structure, need urgent assistance with an ongoing GST filing, or wish to track the status of your trademark application, our team of trained compliance specialists is available to help.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin: 30px 0;">
        <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Direct Inbound Phone Support</h3>
          <p style="font-size: 15px; color: #334155; margin-bottom: 8px;"><strong>Phone:</strong> <a href="tel:+917567126945" style="color: #1A56DB; font-weight: 600;">+91 75671 26945</a></p>
          <p style="font-size: 13px; color: #64748B;">Speak directly with a compliance coordinator. Monday to Saturday, 09:00 AM – 07:00 PM IST.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Dedicated WhatsApp Desk</h3>
          <p style="font-size: 15px; color: #334155; margin-bottom: 8px;"><strong>Instant Chat:</strong> <a href="https://wa.me/917567126945" style="color: #16a34a; font-weight: 600;">+91 75671 26945</a></p>
          <p style="font-size: 13px; color: #64748B;">Fast document sharing, application status checks, and quick queries. Typical response within 15 minutes.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Official Support Helpdesk</h3>
          <p style="font-size: 15px; color: #334155; margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:support@filingby.com" style="color: #1A56DB; font-weight: 600;">support@filingby.com</a></p>
          <p style="font-size: 13px; color: #64748B;">Detailed case reviews, complex drafting queries, and official communications. Response within 2 to 4 business hours.</p>
        </div>
      </div>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Dedicated Case Managers for Your Business</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Unlike generic call centers, each client filing on FilingBy is assigned a dedicated case manager. Your case manager serves as your single point of contact throughout the entire compliance lifecycle, coordinating document verification, liaising with legal drafters, and delivering the official government registration certificates directly to your secure client dashboard.
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Multi-Tier Grievance Escalation Matrix</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        To guarantee timely resolution of complex compliance or service matters, we follow a transparent three-tiered escalation framework:
      </p>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155; margin-bottom: 24px;">
        <li><strong>Level 1 — Case Specialist:</strong> Handles primary queries, document collection, and routine filing status questions (Turnaround: Within 4 business hours).</li>
        <li><strong>Level 2 — Compliance Team Lead:</strong> Reviews technical objections, portal errors, clarification notices, or service delays (Turnaround: Within 1 business day).</li>
        <li><strong>Level 3 — Principal Grievance Officer:</strong> Final escalation for refund requests, billing queries, or contractual matters via email at <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a> (Turnaround: Within 2 business days).</li>
      </ul>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Client Feedback &amp; Continuous Service Auditing</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Every interaction with our customer care helpdesk is logged to monitor response quality, compliance resolution efficiency, and client satisfaction. We routinely audit case records to refine our pre-filing document checklists, minimize bureaucratic turnaround times, and maintain the highest benchmarks of corporate secretarial and tax advisory standards across all service engagements.
      </p>
    `
  },
  {
    path: "faq",
    title: "Frequently Asked Questions — General Tax & Compliance | FilingBy",
    description: "Find quick answers to common questions about GST registrations, income tax filing deadlines, company registration requirements, and virtual office NOC files.",
    keywords: "compliance FAQs, GST questions, Pvt Ltd criteria, virtual office rules india",
    h1: "Frequently Asked Questions",
    content: "<h3>Frequently Asked Questions</h3><h4>1. What is the process for company registration?</h4><p>You need to submit director IDs, select a brand name, file the SPICe+ form with the MCA, and register for PAN/TAN. The ROC issues the certificate in 7-10 days.</p><h4>2. How does virtual office work?</h4><p>We provide a legal commercial address, NOC, utility bill, and rent agreement which you submit to register for GST or incorporate a company.</p><h4>3. What are the tax deadlines?</h4><p>Monthly GST filings must be completed by the 11th/20th of each month. ITR returns are usually due by July 31st for individuals.</p><h4>4. What are the penalties for late filings?</h4><p>Late filing of GST returns attracts a daily late fee of ₹20-50 depending on tax liabilities. Late filing of ITR returns attracts penalty charges up to ₹5,000 under Section 234F.</p>"
  },
  {
    path: "blog",
    title: "Knowledge Hub & Expert Legal Compliance Blogs | FilingBy",
    description: "Explore legal guides, tax filing instructions, GST regulation changes, startup tips, and ROC compliance checklists authored by expert CAs and CSs.",
    keywords: "knowledge hub blog, compliance guides, legal updates, business filing tips",
    h1: "Knowledge Hub & Compliance Guides",
    content: "<p>Stay informed with the latest statutory updates, step-by-step registration guides, and tax planning strategies written by our network of chartered accountants and corporate secretaries.</p>"
  },
  {
    path: "virtual-space",
    title: "Virtual Office India — GST Registration Address in Surat & Mumbai | FilingBy",
    description: "Get a premium virtual office address in Surat or Mumbai for GST registration, company mailing address, or ecommerce seller registration (VPOB/PPOB). Starting at ₹999/month. NOC & utility bills included.",
    keywords: "virtual office India, virtual office GST registration, virtual office address India, VPOB registration, virtual office Mumbai, virtual office Surat, virtual office for Amazon seller",
    h1: "Virtual Office for GST & Business Registration",
    content: "<p>Get a premium virtual office address in India's top business locations for GST registration, company incorporation, and mailing address. Our services start at just ₹999/month and include all mandatory legal documentation: a commercial rent agreement, landlord NOC, and latest utility bills.</p><h3>Features of Our Virtual Office Space</h3><ul><li>100% Compliant Documentation for GST Registration (VPOB & PPOB)</li><li>Professional Business Address in Premium Commercial Parks</li><li>Complete Mail Handling & Forwarding Services</li><li>Access to Meeting Rooms and Coworking Spaces</li></ul>"
  },
  {
    path: "ecommerce-office",
    title: "Virtual Office for E-Commerce Sellers — Amazon VPOB, Flipkart PPOB | FilingBy",
    description: "Register as Amazon/Flipkart/Meesho seller with our virtual office address. VPOB (Virtual Principal Place of Business) and PPOB solutions starting ₹999/month. All platforms accepted.",
    keywords: "virtual office ecommerce India, Amazon VPOB India, Flipkart PPOB address, Meesho seller address, ecommerce GST registration India, virtual office seller registration",
    h1: "Virtual Office for E-Commerce Sellers",
    content: "<p>Expand your e-commerce operations in India with our Virtual Principal Place of Business (VPOB) and Principal Place of Business (PPOB) virtual office services. Easily onboard on Amazon Fulfilment Centers (FCs), Flipkart Assured hubs, Meesho, Zepto, and Blinkit in any state.</p><h3>VPOB Benefits for E-Commerce Brands</h3><ul><li>Register for GST in multiple states to store inventory in local fulfilment centers</li><li>Fast-track documentation (NOC, Rent Agreement, Utility Bills)</li><li>Zero physical office management overheads</li><li>100% compliant documentation matching GST requirements</li></ul>"
  },
  {
    path: "gst-calculator",
    title: "GST Calculator Online India — Exclusive & Inclusive Tax Tool | FilingBy",
    description: "Calculate CGST, SGST, and IGST amounts online using our interactive GST calculator. Compute tax-inclusive and exclusive values with official slab rates.",
    keywords: "GST calculator, GST inclusive calculator, GST exclusive calculator, CGST SGST IGST calculator",
    h1: "Online GST Calculator (Inclusive & Exclusive)",
    content: "<p>Calculate GST inclusive and exclusive pricing online for goods and services in India. View instant CGST, SGST, and IGST breakdowns for standard tax rates (5%, 12%, 18%, and 28%) compliant with CBIC regulations.</p><h3>How to Calculate GST in India</h3><p>GST calculation is straightforward using official mathematical formulas:</p><ul><li><strong>GST Exclusive Formula:</strong> <code>GST Amount = (Base Amount * GST Rate %) / 100</code> | <code>Invoice Total = Base Amount + GST Amount</code></li><li><strong>GST Inclusive Formula:</strong> <code>Base Amount = Total Amount / (1 + (GST Rate % / 100))</code> | <code>GST Amount = Total Amount - Base Amount</code></li></ul><h3>Understanding CGST, SGST, and IGST Splits</h3><ul><li><strong>CGST (Central GST):</strong> Collected by the Central Government on intra-state supplies (equal 50% split of applicable slab).</li><li><strong>SGST (State GST):</strong> Collected by the State Government on intra-state supplies (equal 50% split).</li><li><strong>IGST (Integrated GST):</strong> Levied on inter-state commerce and import transactions.</li></ul><h3>Worked Real-World Case Study</h3><p>A software consulting firm in Mumbai invoices a client in Bengaluru for ₹50,000 (SAC 9983 @18% IGST). Base fee = ₹50,000 + IGST ₹9,000 = Total Billed ₹59,000. Client claims ₹9,000 Input Tax Credit (ITC).</p><h3>Official Sources &amp; Reviewer</h3><p><strong>Official Authority:</strong> Central Board of Indirect Taxes and Customs (CBIC) &amp; GSTN Portal.<br/><strong>Reviewed by:</strong> FilingBy Indirect Tax Desk (Chartered Accountants). Last updated: August 2026.</p>"
  },
  {
    path: "income-tax-calculator",
    title: "Income Tax Calculator India FY 2025-26 (AY 2026-27) — Old vs New Regime Compare",
    description: "Compare tax liabilities between the old and revised 7-slab new tax regime for FY 2025-26 (AY 2026-27). Standard deduction of ₹75,000 and Section 87A rebate calculations.",
    keywords: "income tax calculator India, old vs new regime calculator, FY 2025-26 tax calculator, AY 2026-27 tax slabs, Section 87A rebate 60000, standard deduction 75000",
    h1: "Income Tax Calculator (FY 2025-26 / AY 2026-27)",
    content: "<p>Compare your estimated income tax liabilities between the Old Tax Regime and the revised New Tax Regime (Section 115BAC) for Financial Year 2025-26 (Assessment Year 2026-27). Standard deductions, Section 87A rebates, and 4% cess are computed automatically.</p><h3>Official 7-Tier New Tax Regime Slabs for FY 2025-26 (AY 2026-27)</h3><p>The revised statutory tax slab structure under Section 115BAC is:</p><ul><li><strong>Up to ₹4,00,000:</strong> Nil (0%)</li><li><strong>₹4,00,001 to ₹8,00,000:</strong> 5%</li><li><strong>₹8,00,001 to ₹12,00,000:</strong> 10%</li><li><strong>₹12,00,001 to ₹16,00,000:</strong> 15%</li><li><strong>₹16,00,001 to ₹20,00,000:</strong> 20%</li><li><strong>₹20,00,001 to ₹24,00,000:</strong> 25%</li><li><strong>Above ₹24,00,000:</strong> 30%</li></ul><h3>Section 87A Rebate &amp; ₹75,000 Standard Deduction (Zero Tax up to ₹12.75L)</h3><p>Under the New Regime for FY 2025-26, resident individuals with net taxable income up to ₹12,00,000 receive a full tax rebate under Section 87A (up to ₹60,000), resulting in zero net tax. Combined with the ₹75,000 salaried standard deduction, gross salary income up to ₹12,75,000 incurs zero tax liability.</p><h3>Worked Example: ₹14 Lakh Gross Salary</h3><p>Under Old Regime (₹50k Std Ded + ₹1.75L 80C/80D): Taxable = ₹11.75L → Total Tax = ₹1,71,600. Under New Regime (₹75k Std Ded): Taxable = ₹13.25L → Total Tax = ₹81,900. New Regime saves ₹89,700.</p><h3>Official Sources &amp; Verification</h3><p><strong>Official Reference:</strong> Income Tax Department e-Filing Portal &amp; CBDT Official Tax Rate Charts (AY 2026-27).<br/><strong>Reviewed by:</strong> FilingBy Tax Desk (Chartered Accountants). Last updated: August 2026.</p>"
  },
  {
    path: "roc-tools",
    title: "ROC Filing Tools & MCA Late Fee Calculator | FilingBy.com",
    description: "Calculate Section 403 late filing additional fees and track statutory deadlines for MCA annual returns, AOC-4, MGT-7, and LLP Form 8 or Form 11 using our ROC compliance tools.",
    keywords: "ROC tools, MCA late fee calculator, AOC-4 deadline, MGT-7, DIN eKYC, Section 403 Companies Act, LLP Form 11 penalty",
    h1: "ROC Compliance Tools & MCA Late Fee Calculator",
    content: "<p>Access interactive ROC and MCA compliance tools. Verify statutory due dates, calculate Section 403 late filing additional fees, and review checklist requirements for annual filings on the MCA V3 portal.</p><h3>Interactive MCA Late Fee Calculator (Section 403 &amp; LLP Rules)</h3><p>Under Section 403 of the Companies Act, delayed submission of Form AOC-4 or Form MGT-7 incurs a statutory additional fee of ₹100 per day. For LLPs, Form 11 and Form 8 incur graded additional fees based on delay duration and Small LLP classification under the amended LLP Rules. DIR-3 KYC delayed beyond September 30th attracts a ₹5,000 reactivation fee.</p><h3>Annual Compliance Calendar</h3><ul><li><strong>Form AOC-4 (Pvt Ltd / OPC):</strong> Due within 30 days of AGM (October 29).</li><li><strong>Form MGT-7 / 7A (Annual Return):</strong> Due within 60 days of AGM (November 28).</li><li><strong>LLP Form 11:</strong> Due May 30th (60 days from FY end).</li><li><strong>LLP Form 8:</strong> Due October 30th (Statement of Accounts &amp; Solvency).</li><li><strong>DIR-3 KYC:</strong> Due September 30th for all active DIN holders.</li></ul><h3>Worked Example</h3><p>Pvt Ltd with ₹10L capital files AOC-4 and MGT-7 45 days late: AOC-4 total = ₹4,900 (₹400 normal + ₹4,500 late fee); MGT-7 total = ₹4,900. Total penalty = ₹9,000.</p><h3>Official Sources &amp; Verification</h3><p><strong>Official Reference:</strong> Ministry of Corporate Affairs (MCA V3 Portal) &amp; Companies Act 2013 / LLP Statutory Rules.<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "company-registration-guides",
    title: "Company Registration Guides India — Choose Pvt Ltd vs LLP vs OPC",
    description: "Comprehensive 8-dimension comparative guide to registering a business in India. Compare Private Limited Company, LLP, One Person Company, and Sole Proprietorship options.",
    keywords: "company registration guide India, private limited vs LLP, OPC registration, proprietorship guide, SPICe+ INC-32",
    h1: "Company Registration & Business Entity Decision Guide",
    content: "<p>Read step-by-step guides on choosing and registering the right business structure in India. Compare Private Limited Company, Limited Liability Partnership (LLP), One Person Company (OPC), and Sole Proprietorship models.</p><h3>Comparative Evaluation of Business Structures</h3><ul><li><strong>Private Limited Company (Pvt Ltd):</strong> Limited liability, equity allocation, ESOP support, and high credibility with venture investors. Governed by Companies Act 2013.</li><li><strong>Limited Liability Partnership (LLP):</strong> Combines partnership operational flexibility with corporate limited liability. Mandatory audit only if turnover > ₹40L or capital > ₹25L.</li><li><strong>One Person Company (OPC):</strong> Single-promoter corporate structure with limited liability and separate legal identity.</li><li><strong>Sole Proprietorship:</strong> Lowest setup cost and zero MCA filings, but carries unlimited personal liability.</li></ul><h3>MCA SPICe+ (INC-32) Incorporation Roadmap</h3><p>Incorporate seamlessly via Part A RUN name reservation, Class-3 DSC procurement, electronic MOA/AOA (INC-33/34), and integrated AGILE-PRO-S filing for PAN, TAN, EPFO, ESIC, and corporate bank account.</p><h3>Official Sources &amp; Verification</h3><p><strong>Official Reference:</strong> Ministry of Corporate Affairs (MCA V3 Portal) &amp; Startup India (DPIIT).<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "trademark-search",
    title: "Trademark Search Guide India — Online Brand Name Availability Check",
    description: "Learn how to search the official IP India public database to check brand name availability. Understand 45 Nice classes, search types, and avoid registry objections.",
    keywords: "trademark search India, brand name check, IP India public search, trademark class search, Section 9 11 objections",
    h1: "Trademark Search & Brand Availability Guide",
    content: "<p>Learn how to conduct an official trademark search on the IP India public database. Avoid name rejection issues by checking brand availability, classification, and trademark criteria.</p><h3>7-Step IP India Clearance Methodology</h3><p>Conducting a thorough public search on the IP India database is the critical first step before filing Form TM-A. Search using Wordmark ('Contains' and 'Start With'), Phonetic Search to catch sound-alike marks, and Vienna Code classification for device logos.</p><h3>Understanding 45 Nice Trademark Classes</h3><p>Trademarks are categorized under 45 international Nice classes: Classes 1 to 34 cover physical goods and commodities, while Classes 35 to 45 cover commercial services (e.g. Class 35 for business/e-commerce, Class 42 for software development). Selecting the correct class is vital to securing statutory protection.</p><h3>Avoiding Section 9 and Section 11 Objections</h3><p>Section 9 prohibits marks lacking distinctive character or descriptive laudatory words. Section 11 bars identical or deceptively similar marks in identical or related goods/services classes.</p><h3>Official Sources &amp; Verification</h3><p><strong>Official Reference:</strong> Trade Marks Registry, Controller General of Patents, Designs and Trade Marks (IP India).<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "legal-templates",
    title: "Legal Templates and Startup Business Agreements Library | FilingBy",
    description: "Browse and download essential legal contract blueprints for Indian startups, including NDAs, Founder Agreements, employment contracts, and service SLAs.",
    keywords: "legal templates India, NDA draft, employment agreement, shareholders agreement, founders agreement, Indian Contract Act 1872",
    h1: "Legal Templates & Business Contract Blueprints",
    content: "<p>Download standard legal templates and drafting agreements for Indian startups and businesses under the Indian Contract Act, 1872 and Arbitration and Conciliation Act, 1996.</p><h3>Essential Agreements for Indian Startups</h3><ul><li><strong>Non-Disclosure Agreement (NDA):</strong> Unilateral and mutual confidentiality agreements protecting proprietary business data and trade secrets.</li><li><strong>Founders' Agreement:</strong> Defines equity splits, 4-year reverse vesting with 1-year cliff, IP assignment, and deadlock resolution.</li><li><strong>Shareholders' Agreement (SHA):</strong> Governs investor rights, Right of First Refusal (ROFR), Drag-along, Tag-along, and pre-emption terms.</li><li><strong>Employment &amp; Contractor Agreements:</strong> Comprehensive agreements with mandatory IP assignment, confidentiality, and statutory terms.</li></ul><h3>Execution &amp; Stamp Duty Compliance</h3><p>To be legally admissible in Indian courts, commercial contracts must be executed on non-judicial stamp paper of state-appropriate value or via digital e-stamping.</p><h3>Official Sources &amp; Verification</h3><p><strong>Official Reference:</strong> The Indian Contract Act, 1872 &amp; Arbitration and Conciliation Act, 1996 (India Code).<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "calculators/hra",
    isNoindex: true,
    title: "HRA Exemption Calculator Online India — Section 10(13A) Tax Relief | FilingBy",
    description: "Calculate your House Rent Allowance (HRA) tax exemption amount under Section 10(13A) of the Income Tax Act for metro and non-metro cities.",
    keywords: "HRA calculator, house rent allowance exemption, section 10 13A calculator, Rule 2A income tax",
    h1: "HRA Tax Exemption Calculator (Section 10(13A))",
    content: "<p>Calculate your statutory House Rent Allowance (HRA) tax exemption and taxable salary component under Section 10(13A) of the Income Tax Act read with Rule 2A.</p><h3>Statutory HRA Exemption Formula</h3><p>Exemption is the lowest of: (1) Actual HRA received; (2) Rent paid minus 10% of salary; (3) 50% of salary for metro cities (Mumbai, Delhi, Kolkata, Chennai) or 40% for non-metro cities.</p><h3>Worked Example: ₹50k Basic + ₹20k HRA in Delhi</h3><p>Basic = ₹6,00,000/yr, HRA = ₹2,40,000/yr, Rent = ₹18,000/mo (₹2,16,000/yr). Rent - 10% Basic = ₹1,56,000. 50% Metro Basic = ₹3,00,000. Exempt HRA = ₹1,56,000. Taxable HRA = ₹84,000.</p><h3>Official Reference &amp; Publishing Team</h3><p><strong>Governing Law:</strong> Income Tax Act, 1961 Section 10(13A) &amp; Rule 2A.<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "calculators/tds",
    isNoindex: true,
    title: "TDS Calculator Online India — Section-wise Tax Deduction | FilingBy",
    description: "Compute TDS deductions for contractor payments (194C), professional fees (194J), and rent (194I) under Indian Income Tax rules.",
    keywords: "TDS calculator, tax deducted at source calculator, 194C 194J 194I TDS rates",
    h1: "TDS (Tax Deducted at Source) Calculator",
    content: "<p>Compute section-wise TDS withholding deductions and net disbursable amounts for contractor payments (194C @2%), professional fees (194J @10%), and rent (194I @7.5%) under Chapter XVII-B of the Income Tax Act.</p><h3>Worked Example: ₹1 Lakh Professional Retainer</h3><p>Invoice = ₹1,00,000 under Section 194J(1) @10% TDS. Deducted TDS = ₹10,000 deposited under Challan ITNS 281. Net disbursed = ₹90,000.</p><h3>Official Reference &amp; Publishing Team</h3><p><strong>Governing Law:</strong> Income Tax Act, 1961 Chapter XVII-B.<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "calculators/depreciation",
    isNoindex: true,
    title: "Asset Depreciation Calculator India — SLM vs WDV Method | FilingBy",
    description: "Calculate company asset depreciation under Companies Act and Income Tax Act using Straight Line Method (SLM) and Written Down Value (WDV) methods.",
    keywords: "depreciation calculator, SLM vs WDV calculator, asset depreciation companies act schedule II",
    h1: "Asset Depreciation Calculator (SLM & WDV)",
    content: "<p>Calculate annual asset depreciation using both the Straight-Line Method (SLM) and Written Down Value (WDV) method in accordance with Schedule II of the Companies Act, 2013 and Section 32 of the Income Tax Act.</p><h3>Worked Example: ₹5 Lakh Server Asset</h3><p>Purchase = ₹5,00,000, Salvage = 5% (₹25,000), Life = 5 yrs. SLM Annual Depreciation = ₹95,000/yr. WDV Year 1 (40%) = ₹2,00,000.</p><h3>Official Reference &amp; Publishing Team</h3><p><strong>Governing Law:</strong> Companies Act 2013 Schedule II &amp; Income Tax Act Section 32.<br/><strong>Published by:</strong> FilingBy Editorial Team. Last updated: August 2026.</p>"
  },
  {
    path: "terms-conditions",
    title: "Terms and Conditions of Service & Agreement Policies | FilingBy.com",
    description: "Read FilingBy's terms and conditions. Understand the legal guidelines, usage policies, and responsibilities governing CA compliance and virtual office leases.",
    keywords: "terms and conditions, legal agreement, service terms filingby",
    h1: "Terms and Conditions",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Welcome to FilingBy.com. These Terms and Conditions of Service govern your access to and use of FilingBy's compliance platform, online CA/CS assisted workflows, corporate documentation tools, and commercial virtual office solutions.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. Acceptance of Terms</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        By visiting our website, submitting an order, or utilizing our compliance tools, you enter into a legally binding agreement with FilingBy and agree to adhere to these Terms of Service. If you disagree with any portion of these terms, you must discontinue platform use immediately.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Nature of Services &amp; Advisory Scope</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        FilingBy operates as an independent compliance technology platform. We streamline documentation workflows, provide verification checks, and connect users with qualified professionals (Chartered Accountants, Company Secretaries, and Legal Advocates) for statutory portal submissions. FilingBy does not directly represent itself as a law or audit firm.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. User Obligations &amp; Document Authenticity</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Users are solely responsible for ensuring that all identity proofs (PAN, Aadhaar), registered office proofs, and financial records submitted for government filings are authentic, unaltered, and legally valid. Submission of forged or fraudulent documentation will result in immediate service termination.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">4. Virtual Office Lease Terms</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Virtual office spaces provided through FilingBy are intended strictly for commercial business registration (GST and MCA). Tenants must operate within governing commercial tenancy regulations and adhere to registered office verification standards.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">5. Limitation of Liability</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        To the maximum extent permitted under applicable law, FilingBy's aggregate liability for any claims arising from service delivery shall not exceed the total professional service fees actually paid by the client for the specific order.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">6. Governing Law &amp; Dispute Jurisdiction</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes or claims arising out of or in connection with our services shall be subject to the exclusive jurisdiction of the courts located in Surat, Gujarat, India.
      </p>
    `
  },
  {
    path: "default/refund",
    title: "Refund Policy and Service Fee Guarantee | FilingBy.com",
    description: "Read the FilingBy refund policy. We offer a 100% refund of FilingBy service fees if corporate registration fails due to documentation defects directly attributable to us.",
    keywords: "refund policy, service fee refund guarantee, filingby refund",
    h1: "Refund Policy & Service Fee SLA",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        At FilingBy.com, we prioritize transparency and customer satisfaction. We take full ownership of the administrative documentation prepared by our team and partner workspaces. Specialist professional assistance may be coordinated where a filing legally requires a qualified professional.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. 100% Service Fee Refund SLA</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        We offer a strict 100% Money-Back Guarantee for FilingBy professional service fees covering virtual office address verification orders and company registration filing assistance. If the target government registry authority (such as the State Commercial Tax Department for GST registration or the MCA Registrar of Companies) formally rejects your application due to a verified document defect directly attributable to FilingBy.com or our property host (e.g. invalid land deed, landlord verification dispute, title defect in NOC), FilingBy will refund 100% of the FilingBy professional service fees paid.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Exclusions &amp; Non-Refundable Scenarios</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        To maintain fair commercial practices, refunds are not applicable under the following circumstances:
      </p>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155; margin-bottom: 16px;">
        <li><strong>Client-Side Verification Defaults:</strong> Rejections caused by mismatched client identity proofs (e.g. incorrect PAN name, invalid Aadhaar address, forged signature, unverified Director Identification Number).</li>
        <li><strong>Change of Mind / Voluntary Cancellation:</strong> Orders cancelled after legal documentation (rent agreement drafting, NOC notarization, electric utility bill compilation) has already been dispatched or uploaded to government portals.</li>
        <li><strong>Client Non-Response:</strong> Failure by the Client to respond to clarification queries issued by statutory officers within the mandated statutory timeframe (typically 7 working days).</li>
        <li><strong>Government &amp; Statutory Fees:</strong> Statutory fees paid directly to government authorities, registries, or treasury portals (including MCA filing fees, electronic stamp duty, GST portal charges, trademark application fees, or licensing fees) are collected for and remitted to the respective statutory authorities and are normally outside FilingBy's control once submitted. Eligibility for any refund, reversal, or adjustment of such statutory fees depends entirely on the specific rules, criteria, and administrative procedures of the relevant government authority (such as eligible MCA21 service fee refund claims submitted via the official MCA Refund Form, or state/UT-specific statutory procedures governing electronic stamp-duty refunds). FilingBy's 100% money-back SLA applies exclusively to FilingBy's own professional service fees.</li>
      </ul>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. Claim Refund Submission Procedure</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        To initiate a refund request, the Client must email <a href="mailto:support@filingby.com" style="color: #1A56DB; font-weight: 600;">support@filingby.com</a> or contact their designated compliance manager with: (1) FilingBy Order Reference Number; (2) Copy of the Official Government Rejection Notice (REG-05 for GST, MCA Rejection Challan); (3) Bank account details for electronic credit transfer.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">4. Processing Timelines</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Once a refund request is verified and approved by our legal audit team, the refund amount will be credited back to the Client's original payment method (Bank Transfer, Credit Card, UPI, Netbanking) within <strong>7 to 10 working days</strong>.
      </p>
    `
  },
  {
    path: "services/pan-card",
    title: "PAN Card Assistance India — New Application & Correction | FilingBy",
    description: "Get fast PAN card assistance in India. Dedicated support for new PAN applications, Form 49A/49AA filings, data corrections, NRI PAN cards, and TAN registration guidance.",
    keywords: "pan card assistance india, pan application help, pan correction support, pan vs tan, nri pan card india",
    h1: "PAN Card Assistance for Individuals, NRIs & Commercial Entities",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Comprehensive statutory guidance for new PAN applications (Form 49A / 49AA), data corrections, reprint requests, and business tax identity onboarding across India.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">Understanding Your PAN &amp; Tax Registration Requirements</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        A Permanent Account Number (PAN) is the cornerstone of Indian financial compliance. Review your filing category to ensure accurate processing: Form 49A for Indian residents and Form 49AA for NRIs and foreign citizens; corporate/LLP PAN allotment via MCA SPICe+ incorporation; and corrections/updates for name, DOB, or re-issuance.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">Mandatory Document Checklist for PAN Application</h2>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155; margin-bottom: 24px;">
        <li>Proof of Identity: Aadhaar Card, Passport, Voter ID, or Driving Licence.</li>
        <li>Proof of Address: Utility Bill (under 2 months old), Bank Statement, or Passport.</li>
        <li>Proof of Date of Birth: Birth Certificate, Matriculation Certificate, or Passport.</li>
        <li>For NRIs / Foreigners: Apostilled / Embassy-attested passport and overseas address proof.</li>
      </ul>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">Frequently Asked Questions</h2>
      <div style="margin-top: 12px;">
        <p style="font-size: 14px; color: #0F172A; font-weight: 700; margin-bottom: 4px;">What is the difference between PAN and TAN?</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 14px;">A Permanent Account Number (PAN) is a unique 10-digit alphanumeric identity issued by the Income Tax Department to track financial transactions. A Tax Deduction and Collection Account Number (TAN) is required specifically by entities that deduct or collect tax at source (TDS/TCS).</p>
        <p style="font-size: 14px; color: #0F172A; font-weight: 700; margin-bottom: 4px;">Can FilingBy help with PAN corrections?</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 14px;">Yes. FilingBy assists with name corrections, date of birth updates, signature/photo updates, address changes, and issuing duplicate physical/electronic PAN cards.</p>
      </div>
    `
  },
  {
    path: "default/privacy-policy",
    title: "Privacy Policy and Data Protection Guidelines | FilingBy.com",
    description: "FilingBy.com Privacy Policy. Learn how we handle KYC records, data security, Google AdSense cookies, analytics, and user privacy rights.",
    keywords: "privacy policy, data security, privacy statement filingby, google adsense cookies, privacy opt out",
    h1: "Privacy Policy",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        FilingBy.com respects client privacy. This Privacy Policy details how we collect, store, and utilize information regarding your company registrations, compliance filings, billing transactions, and interactions with our digital platform.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. Information We Collect</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        We collect corporate name records, partner/director identity documentation (PAN, Aadhaar metadata), email coordinates, telephone numbers, and billing records required to execute commercial leases, landlord NOC folders, and statutory filing workflows.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Data Security &amp; KYC Confidentiality</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        All KYC document uploads are encrypted in secure storage buckets and accessed exclusively by authorized compliance desk coordinators during verification checks. We maintain strict role-based access controls and cryptographic safeguards. FilingBy follows privacy and security practices designed to align with applicable Indian data-protection requirements, including provisions of the Digital Personal Data Protection Act, 2023 as and when they become applicable.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. Third-Party Data Sharing Limitations</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        We do not sell, rent, or trade your contact numbers or email addresses with external marketers. Address details and company information are submitted strictly to official statutory tax panels (MCA, GSTN, Income Tax portal) as mandated by your requested filings.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">4. Google AdSense &amp; Third-Party Advertising Cookies</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        We use third-party advertising companies, including Google, to serve advertisements when you visit our website. These companies may use cookies, web beacons, IP addresses, and other identifiers to collect information and serve ads based on your prior visits to our website or other websites on the internet.
      </p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites across the internet. Google and its partners may place or read cookies and collect device/browser identifiers as part of ad serving and measurement on eligible content pages. To learn more about how Google processes information, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style="color: #1A56DB; text-decoration: underline;">How Google uses data when you use our partners' sites or apps</a>.
      </p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Users may opt out of personalized advertising at any time by visiting Google's Ad Settings at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style="color: #1A56DB; text-decoration: underline;">adssettings.google.com</a>. Alternatively, users may opt out of third-party vendor cookies for personalized advertising by visiting the Network Advertising Initiative / Digital Advertising Alliance portal at <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style="color: #1A56DB; text-decoration: underline;">www.aboutads.info</a>.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">5. Analytics &amp; Web Measurement Technologies</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        FilingBy uses Google Analytics and server access logs to evaluate aggregate traffic metrics, monitor site health, and improve navigational clarity. These tools collect standard internet log information, including masked IP addresses, browser types, referral sources, and page dwell times, without associating individual identities with personal account records.
      </p>

      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">6. User Privacy Rights &amp; Contact Method</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        If you have questions regarding this Privacy Policy, wish to inspect the personal documentation retained on file, or wish to request data correction or deletion, contact our Data Privacy Contact via email at <a href="mailto:support@filingby.com" style="color: #1A56DB; text-decoration: underline;">support@filingby.com</a> or by post at FilingBy Compliance Solutions, B-1210 IT PARK, SURAT, Gujarat — 394101, India.
      </p>
    `
  },
  {
    path: "contact-us",
    title: "Contact Us — FilingBy.com | Customer Support & Compliance Desk",
    description: "Have queries about GST registration, company incorporation, or virtual offices? Contact the FilingBy team via phone, email, WhatsApp, or office visit for expert support.",
    keywords: "contact FilingBy, FilingBy phone number, GST registration support, CA portal help, corporate address support, surat corporate office",
    h1: "Contact Us — FilingBy Support & Compliance Desk",
    content: `
      <p style="font-size: 18px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
        Have questions about company incorporation, monthly GST filings, Income Tax returns, or booking a compliant virtual office address? Our dedicated corporate compliance helpdesk and client care specialists are ready to assist your enterprise.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin: 30px 0;">
        <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Direct Telephone Support</h3>
          <p style="font-size: 15px; color: #334155; margin-bottom: 8px;"><strong>Phone:</strong> <a href="tel:+917567126945" style="color: #1A56DB; font-weight: 600;">+91 75671 26945</a></p>
          <p style="font-size: 13px; color: #64748B;">Speak directly with a compliance coordinator. Monday to Saturday, 09:00 AM to 07:00 PM IST.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Electronic Mail Support</h3>
          <p style="font-size: 15px; color: #334155; margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:support@filingby.com" style="color: #1A56DB; font-weight: 600;">support@filingby.com</a></p>
          <p style="font-size: 13px; color: #64748B;">Detailed case reviews and documentation queries answered within 2 to 4 business hours.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">WhatsApp Live Helpdesk</h3>
          <p style="font-size: 15px; color: #334155; margin-bottom: 8px;"><strong>Instant Chat:</strong> <a href="https://wa.me/917567126945" style="color: #16a34a; font-weight: 600;">+91 75671 26945</a></p>
          <p style="font-size: 13px; color: #64748B;">Fast document sharing, acknowledgment tracking, and quick inquiries. Typical response within 15 minutes.</p>
        </div>
      </div>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px; margin-bottom: 12px;">Operational Headquarters &amp; Physical Office</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        <strong>Operations Office:</strong><br/>
        FilingBy Compliance Solutions, B-1210 IT PARK, SURAT, Gujarat — 394101, India.<br/>
        <em>In-person consultations are available by prior appointment during standard business hours (Monday to Friday, 10:00 AM – 05:00 PM IST). Please coordinate with your dedicated case manager or email us prior to visiting.</em>
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px; margin-bottom: 12px;">Specialized Departmental Routing</h2>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155; margin-bottom: 24px;">
        <li><strong>Company Incorporation &amp; Secretarial Filings:</strong> For SPICe+ inquiries, MOA/AOA drafting, director changes, and ROC annual returns, email <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a> with subject <em>[ROC Support]</em>.</li>
        <li><strong>GST Registration &amp; Return Filing:</strong> For GSTIN applications, monthly GSTR-1/3B filing status, and input tax credit reconciliation, email <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a> with subject <em>[GST Helpdesk]</em>.</li>
        <li><strong>Virtual Office Documentation:</strong> For commercial lease agreements, landlord NOC issuance, and utility bill verifications in Surat, Mumbai, Delhi, or Bangalore, email <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a> with subject <em>[Virtual Space Desk]</em>.</li>
        <li><strong>Grievance Redressal &amp; Refund Inquiries:</strong> If you experience any delay, documentation discrepancy, or wish to submit a refund inquiry under our service fee refund policy, contact our principal grievance officer directly at <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a> with your Order ID for resolution within 2 business days.</li>
      </ul>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px; margin-bottom: 12px;">Electronic Invoicing &amp; Transaction Security</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        All professional fees paid to FilingBy are processed through encrypted payment gateways (supporting UPI, Net Banking, and corporate credit/debit cards). For every transaction, clients receive automated tax invoices compliant with GST guidelines showing full HSN/SAC code breakdowns. For enterprise billing or corporate PO vendor onboarding, contact our accounts department at <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a>.
      </p>
    `
  },
  {
    path: "default/cookie-policy",
    title: "Cookie Policy & Tracking Preferences | FilingBy.com",
    description: "Learn how FilingBy.com uses cookies, advertising identifiers, analytical tools, and consent settings to ensure secure browsing and personalized compliance experiences.",
    keywords: "cookie policy, cookies filingby, advertising cookies, consent management",
    h1: "Cookie Policy",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        FilingBy.com ("we", "us", or "our") uses cookies, local storage, web beacons, and related tracking technologies to provide seamless user sessions, maintain authenticated account states, analyze site traffic, and deliver relevant advertisements. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. What Are Cookies?</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work efficiently, provide reporting information, and store user preferences across visits.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Categories of Cookies We Use</h2>
      <div style="margin-bottom: 16px;">
        <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 8px;"><strong>A. Strictly Necessary / Essential Cookies:</strong> Required for core platform functionality, including secure session validation (Clerk authentication), form submissions, order routing, and security protection. These cannot be disabled.</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 8px;"><strong>B. Analytical &amp; Performance Cookies:</strong> Help us understand how visitors interact with our website by measuring page views, navigation paths, and technical performance via privacy-focused tools like Google Tag Manager and Vercel Analytics.</p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 8px;"><strong>C. Advertising &amp; Monetization Cookies (Google AdSense):</strong> Google AdSense and third-party advertising networks use cookies to serve ads on eligible informational pages. These cookies measure ad impressions, prevent fraud, and serve personalized ads based on your visits to our site and other internet pages.</p>
      </div>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. Managing Your Cookie Preferences</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        When you first visit FilingBy.com, our Cookie Consent Banner enables you to accept or reject optional analytical and advertising cookies. You can also modify your browser settings to block or delete cookies at any time.
      </p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        To opt out of Google's personalized advertising cookies specifically, visit the official <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style="color: #1A56DB; font-weight: 600; text-decoration: underline;">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style="color: #1A56DB; font-weight: 600; text-decoration: underline;">www.aboutads.info</a>.
      </p>
    `
  },
  {
    path: "default/disclaimer",
    title: "Legal & Tax Disclaimer | FilingBy.com",
    description: "FilingBy.com legal disclaimer. Important information regarding professional CA/CS assistance, general informational content, government filings, and legal limitations.",
    keywords: "legal disclaimer, tax disclaimer, filingby disclaimer, professional advisory limits",
    h1: "Legal & Tax Disclaimer",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        <strong>Important Notice:</strong> Content published on FilingBy.com, including articles, calculators, guides, and legal templates, is provided for general informational and educational purposes only and does not constitute formal legal, tax, financial, or accounting advice.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. Professional Advisory Boundaries</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        FilingBy is a digital technology platform providing corporate compliance tools, documentation workflows, and verified workspace solutions. Specialist professional assistance may be coordinated where a filing legally requires a qualified professional. FilingBy is not a chartered accountancy firm, company secretarial firm, or legal advocacy partnership and does not provide formal legal representation. Browsing this website or utilizing our calculators does not establish a formal attorney-client or professional-client relationship.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Government Affiliation Disclaimer</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        FilingBy.com is a private technology platform and independent service provider. FilingBy is <strong>NOT affiliated with, endorsed by, or an official agency of</strong> the Ministry of Corporate Affairs (MCA), Goods and Services Tax Network (GSTN), Income Tax Department of India, Controller General of Patents Designs and Trade Marks (CGPDTM), or any central or state government department.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. Calculator &amp; Estimation Tool Limitations</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Calculators provided on this platform (such as GST Inclusive/Exclusive calculators, Income Tax regime comparison tools, HRA calculators, and ROC late fee estimators) yield estimates based on standardized mathematical formulas and user inputs. Actual tax liabilities or statutory late fees imposed by government authorities may vary depending on individual case details and specific statutory conditions.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">4. External Links &amp; Third-Party References</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        FilingBy.com may contain links to external government portals, statutory acts, or reference resources. FilingBy assumes no responsibility for the accuracy, availability, or content of third-party websites.
      </p>
    `
  },
  {
    path: "default/editorial-policy",
    title: "Editorial Policy & Fact-Checking Standards | FilingBy.com",
    description: "FilingBy editorial policy. Learn how our editorial desk researches, fact-checks, updates, and reviews business compliance guides, tax filing articles, and legal resources.",
    keywords: "editorial policy, fact checking, editorial standards, compliance research",
    h1: "Editorial Policy",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        At FilingBy.com, our mission is to deliver accurate, objective, easy-to-understand, and practical statutory compliance information to Indian business owners, founders, and tax professionals.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. Primary Source Verification</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Our editorial content is researched using official primary government sources, statutory acts, Ministry of Corporate Affairs (MCA) circulars, Central Board of Direct Taxes (CBDT) notifications, and GST Council updates. We cite official legislation and government portals directly when discussing compliance requirements.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Editorial Independence &amp; Ad Policy</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Our editorial desk operates independently of commercial partnerships and advertising sponsors. Advertisements served via Google AdSense or external networks do not influence our research findings, tool calculations, or editorial reviews.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. Editorial Quality &amp; Human Expert Oversight</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        All technical tax calculations, statutory deadlines, legal steps, and government form requirements published on our platform are systematically researched, verified, and reviewed by qualified compliance specialists and corporate experts before publication.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">4. Regular Audits &amp; Date Currency</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Tax rates and corporate filing procedures change each financial year. Our team regularly audits published guides to ensure dates, slab rates, late fees, and form names reflect current laws (e.g. FY 2025-26 / AY 2026-27 regulations).
      </p>
    `
  },
  {
    path: "default/corrections-policy",
    title: "Corrections & Fact-Checking Policy | FilingBy.com",
    description: "FilingBy corrections policy. Learn how we handle factual updates, regulatory changes, reader feedback, and corrections across our business compliance knowledge hub.",
    keywords: "corrections policy, fact checking updates, regulatory updates filingby",
    h1: "Corrections & Updates Policy",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        FilingBy.com is committed to maintaining absolute factual accuracy across all published articles, statutory calculators, and business guides. When errors occur or when government authorities issue regulatory amendments, we act swiftly and transparently to correct the record.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">1. Submitting Correction Requests</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        If you identify an outdated statutory due date, a mathematical discrepancy in a calculator tool, or a factual error in an article, please inform our editorial desk immediately at <a href="mailto:support@filingby.com" style="color: #1A56DB; font-weight: 600; text-decoration: underline;">support@filingby.com</a> with the subject line <code>Correction Request</code>.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">2. Evaluation &amp; Revision Workflow</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Upon receiving feedback, our compliance editorial team cross-references the flagged claim against primary MCA/GST/ITD notifications. If a factual correction is warranted, the article or calculator code is updated immediately, and significant modifications are documented with a clear timestamp.
      </p>
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 24px; margin-bottom: 10px;">3. Regulatory &amp; Budgetary Updates</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        When Union Budgets or MCA circulars introduce new tax slabs, fee schedules, or compliance forms, affected articles are placed into an expedited review queue to prevent outdated statutory advice from persisting online.
      </p>
    `
  },
  {
    path: "editorial-team",
    title: "Editorial Team & Compliance Reviewers | FilingBy.com",
    description: "Meet the FilingBy Editorial Desk and Content Team behind our Indian business compliance guides, tax filing instructions, and virtual office guides.",
    keywords: "editorial team, filingby authors, compliance reviewers, editorial desk, fact checking desk",
    h1: "FilingBy Editorial Desk & Content Team",
    content: `
      <p style="font-size: 18px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
        The FilingBy Editorial Desk and Content Team consists of corporate compliance researchers, legal writers, and regulatory analysts dedicated to providing clear, authoritative, and actionable guidance for Indian business owners, startup founders, and tax professionals.
      </p>
      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Editorial Mission &amp; Standards</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        Our mission is to translate complex legal notifications, taxation amendments, and regulatory frameworks into straightforward, practical guidance. We verify all statutory rules against primary official documentation from the Ministry of Corporate Affairs (MCA), the Central Board of Direct Taxes (CBDT), the Central Board of Indirect Taxes and Customs (CBIC), and the Controller General of Patents, Designs and Trade Marks (IP India).
      </p>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Specialized Editorial Desks</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin: 24px 0;">
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;">Indirect Tax &amp; GST Desk</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Focuses on the CGST/SGST/IGST framework, input tax credit eligibility, GSTR filing schedules, e-invoicing mandates, and CBIC notification updates.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;">Corporate Secretarial &amp; MCA Desk</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Focuses on the Companies Act 2013, LLP Act 2008, SPICe+ incorporation forms, annual returns (AOC-4, MGT-7), DIR-3 KYC, and corporate governance compliance.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;">Direct Tax &amp; ITR Desk</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Specializes in Income Tax Act 1961 provisions, revised Section 115BAC new tax regime slabs, Section 87A rebate rules, AIS/TIS reconciliation, and salary tax planning.</p>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 6px;">Intellectual Property &amp; Commercial Desk</h3>
          <p style="font-size: 14px; color: #64748B; line-height: 1.5;">Researches the Trade Marks Act 1999, 45 Nice classification classes, public search procedures, objection reply strategies, and commercial contracting frameworks.</p>
        </div>
      </div>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Fact-Checking &amp; Verification Workflow</h2>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155; margin-bottom: 24px;">
        <li><strong>Primary Source Grounding:</strong> Every guide cites official gazette notifications, sections of relevant Acts, and departmental procedural manuals from official portals.</li>
        <li><strong>Dual-Tier Review:</strong> Articles are drafted by compliance researchers and subjected to fact-checking by our editorial review desk before publication.</li>
        <li><strong>Continuous Periodic Audits:</strong> Guides are updated whenever annual Union Budgets, GST Council recommendations, or MCA circulars introduce new rules, forms, or deadlines.</li>
      </ul>

      <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 28px; margin-bottom: 12px;">Corrections &amp; Reader Feedback</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 16px;">
        If you spot a typo, an outdated statutory fee structure, or an ambiguous legal reference in any of our published articles, our editorial desk welcomes your feedback at <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a>. Every query is examined by our researchers within 48 business hours.
      </p>
    `
  },
  {
    path: "tools/structure-selector",
    isNoindex: true,
    title: "Business Structure Selector Quiz | FilingBy",
    description: "Interactive decision tool to help Indian founders determine whether to incorporate a Private Limited Company, LLP, or One Person Company.",
    keywords: "business structure selector, pvt ltd vs llp selector, startup entity quiz, business incorporation tool India",
    h1: "Business Structure Selector Quiz",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Selecting the correct corporate legal entity structure is a foundational strategic step for Indian entrepreneurs. This interactive selector evaluates critical parameters such as equity fundraising goals, founder count, and compliance appetite to recommend the optimal legal form.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Corporate Structure Considerations</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Private Limited Company:</strong> Ideal for startups seeking angel or venture capital investment, ESOP allocations, and scalable corporate governance under SPICe+ MCA guidelines.</li>
          <li><strong>Limited Liability Partnership (LLP):</strong> Best suited for professional services, consultancies, and family enterprises desiring limited liability with lower mandatory compliance overhead.</li>
          <li><strong>One Person Company (OPC):</strong> Tailored for solo entrepreneurs wanting separate corporate legal personality while retaining sole operational control.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Explore our dedicated entity incorporation desks: <a href="/services/private-limited-company" style="color: #1A56DB; font-weight: 600;">Private Limited Company</a> | <a href="/services/llp-registration" style="color: #1A56DB; font-weight: 600;">LLP Registration</a> | <a href="/services/one-person-company" style="color: #1A56DB; font-weight: 600;">One Person Company</a>.</p>
    `
  },
  {
    path: "tools/gst-eligibility",
    isNoindex: true,
    title: "GST Registration Eligibility Checker | FilingBy",
    description: "Evaluate Goods and Services Tax mandatory registration thresholds, aggregate turnover limits, and interstate supply rules under the CGST Act.",
    keywords: "gst eligibility checker, gst registration threshold, interstate gst rules, turnover limit gst India",
    h1: "GST Registration Eligibility Checker",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Goods and Services Tax (GST) registration requirements depend on aggregate annual turnover thresholds and specific statutory triggers under Section 22 and Section 24 of the CGST Act, 2017.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Statutory GST Thresholds &amp; Mandatory Rules</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Goods Suppliers:</strong> Mandatory registration kicks in when aggregate pan-India turnover exceeds ₹40 Lakhs in normal states (₹20 Lakhs in Special Category States).</li>
          <li><strong>Service Providers:</strong> Mandatory registration threshold is ₹20 Lakhs in normal states (₹10 Lakhs in Special Category States).</li>
          <li><strong>Section 24 Compulsory Registration:</strong> Interstate taxable supplies, e-commerce operators, reverse charge liability, and non-resident taxable persons must obtain GSTIN regardless of turnover.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Ready to register or compute tax? Visit our <a href="/services/gst-registration" style="color: #1A56DB; font-weight: 600;">GST Registration Service</a> or use our interactive <a href="/gst-calculator" style="color: #1A56DB; font-weight: 600;">Online GST Calculator</a>.</p>
    `
  },
  {
    path: "tools/trademark-class",
    isNoindex: true,
    title: "Trademark Class Finder Lookup | FilingBy",
    description: "Identify the appropriate Nice classification class (Classes 1 to 45) for goods and services before filing an Indian trademark application.",
    keywords: "trademark class finder, tm class lookup, nice classification India, trademark class 9 25 43 45",
    h1: "Trademark Class Finder Lookup",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        The Trade Marks Registry in India categorizes goods and services into 45 distinct classes under the international Nice Classification system. Choosing the correct classification is vital to ensure robust statutory brand protection.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Common Trademark Classes in India</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Class 9:</strong> Software, mobile applications, computer hardware, electronics, and digital apparatus.</li>
          <li><strong>Class 25:</strong> Clothing, footwear, headgear, and fashion apparel.</li>
          <li><strong>Class 35:</strong> Advertising, business management, retail services, and e-commerce platforms.</li>
          <li><strong>Class 42:</strong> Scientific, technological services, software development, and IT research.</li>
          <li><strong>Class 43:</strong> Food, beverages, restaurant services, catering, and temporary accommodation.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Conduct a comprehensive trademark audit before filing: <a href="/trademark-search" style="color: #1A56DB; font-weight: 600;">Public Trademark Search Guide</a> | <a href="/services/trademark-registration" style="color: #1A56DB; font-weight: 600;">Trademark Registration Online</a>.</p>
    `
  },
  {
    path: "templates/nda",
    isNoindex: true,
    title: "Mutual Non-Disclosure Agreement (NDA) Template | FilingBy",
    description: "Standard mutual non-disclosure agreement draft for Indian startups, protecting commercial proprietary information and intellectual property.",
    keywords: "nda template india, mutual non disclosure agreement draft, startup confidentiality agreement, proprietary info agreement",
    h1: "Mutual Non-Disclosure Agreement (NDA) Template",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        A Mutual Non-Disclosure Agreement (NDA) protects confidential business disclosures, trade secrets, software code, customer data, and technical processes when evaluating partnerships or vendor arrangements in India.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Key Clauses &amp; Execution Guidelines</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Scope of Confidential Information:</strong> Explicitly covers technical data, business plans, financial projections, and proprietary algorithms.</li>
          <li><strong>Standard Exclusions:</strong> Information in the public domain, independently developed without access, or compelled by judicial authority is excluded.</li>
          <li><strong>Stamp Duty Admissibility:</strong> In India, NDAs must be executed on non-judicial stamp paper of appropriate value under state stamp laws (commonly ₹100 or ₹200) to ensure court admissibility.</li>
          <li><strong>Jurisdiction:</strong> Specifying dispute resolution under the Indian Arbitration and Conciliation Act, 1996 guarantees streamlined adjudication.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Browse additional agreements in our <a href="/legal-templates" style="color: #1A56DB; font-weight: 600;">Legal Templates Library</a> or register your IP via <a href="/services/trademark-registration" style="color: #1A56DB; font-weight: 600;">Trademark Registration</a>.</p>
    `
  },
  {
    path: "templates/rent-agreement",
    isNoindex: true,
    title: "Commercial Rent Agreement Template | FilingBy",
    description: "Standard commercial lease and rental agreement contract format for office workspaces, virtual offices, and business premises in India.",
    keywords: "commercial rent agreement template, office lease agreement draft, 11 month rent agreement India, gst rent agreement",
    h1: "Commercial Rent Agreement Template",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        A commercial rental agreement legally establishes the tenancy relationship between a property owner and a business tenant for commercial workspaces, corporate headquarters, or virtual office setups.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Drafting &amp; GST Compliance Requirements</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>11-Month Tenancy Period:</strong> Short-term commercial leases of up to 11 months are standard practice to avoid mandatory registration under Section 17 of the Registration Act, 1908.</li>
          <li><strong>Address Proof for GST &amp; MCA:</strong> To use the premises as a principal place of business, the agreement must be accompanied by the landlord's signed No Objection Certificate (NOC) and latest electricity bill.</li>
          <li><strong>Maintenance &amp; Commercial Tax:</strong> Explicitly clarify whether municipal rates, water, power, and building maintenance are inclusive in the base rent.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Looking for compliant corporate addresses? Explore <a href="/virtual-space" style="color: #1A56DB; font-weight: 600;">Virtual Office for GST Registration</a> across top Indian business hubs.</p>
    `
  },
  {
    path: "templates/gst-invoice",
    isNoindex: true,
    title: "Standard GST Tax Invoice Template | FilingBy",
    description: "Statutory tax invoice blueprint compliant with Section 31 of the CGST Act 2017 and Rule 46 of the CGST Rules.",
    keywords: "gst invoice template, tax invoice format india, rule 46 cgst invoice, b2b gst invoice format",
    h1: "Standard GST Tax Invoice Template",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Under Section 31 of the Central Goods and Services Tax Act, 2017, every registered supplier of taxable goods or services is required to issue a formal tax invoice containing all mandatory particulars outlined in Rule 46 of the CGST Rules.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Mandatory Tax Invoice Particulars (Rule 46)</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Supplier &amp; Recipient Identification:</strong> Legal name, registered address, and 15-digit GSTIN of both parties.</li>
          <li><strong>Consecutive Serial Number:</strong> Unique numeric or alphanumeric serial number containing up to 16 characters for each financial year.</li>
          <li><strong>Place of Supply &amp; State Code:</strong> Identifies whether the transaction is an intra-state supply (attracting CGST + SGST) or inter-state supply (attracting IGST).</li>
          <li><strong>HSN/SAC Code:</strong> Accurate Harmonized System of Nomenclature code for goods or Service Accounting Code for services.</li>
          <li><strong>Itemized Tax Computation:</strong> Taxable value, statutory tax rate percentage, and exact monetary tax breakdown.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">For automated return reconciliation and filing: <a href="/services/gst-return-filing" style="color: #1A56DB; font-weight: 600;">GST Return Filing Assistance</a> | <a href="/gst-calculator" style="color: #1A56DB; font-weight: 600;">GST Calculator</a>.</p>
    `
  },
  {
    path: "templates/partnership-deed",
    isNoindex: true,
    title: "Partnership Deed Format Draft | FilingBy",
    description: "Comprehensive legal partnership deed format under the Indian Partnership Act 1932 detailing capital contributions, profit sharing, and partner duties.",
    keywords: "partnership deed draft, partnership deed format india, indian partnership act 1932 deed, firm registration agreement",
    h1: "Partnership Deed Format Draft",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        A Partnership Deed is the foundational constitution of a partnership firm formed under the Indian Partnership Act, 1932. It defines the operational rights, financial duties, and mutual profit ratios of all partners.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Core Clauses in a Commercial Partnership Deed</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Firm Name &amp; Principal Place:</strong> The official trading name and registered commercial premises of the partnership.</li>
          <li><strong>Capital Contribution &amp; Interest:</strong> Initial and working capital provided by each partner, including terms of interest on capital under Section 40(b) of the Income Tax Act.</li>
          <li><strong>Profit &amp; Loss Sharing Ratio:</strong> Explicit percentage allocation of net operational profit or commercial loss among partners.</li>
          <li><strong>Banking Operations:</strong> Specific signing mandate for bank transactions, credit facilities, and statutory filings.</li>
          <li><strong>Dispute Resolution &amp; Dissolution:</strong> Arbitration under the Arbitration and Conciliation Act, 1996 and protocols for partner retirement or firm winding up.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Ready to register your firm? Visit our <a href="/services/partnership-firm" style="color: #1A56DB; font-weight: 600;">Partnership Firm Registration Desk</a>.</p>
    `
  },
  {
    path: "templates/board-resolution",
    isNoindex: true,
    title: "Board Resolution Template for Corporate Actions | FilingBy",
    description: "Certified true copy format for board resolutions passed by company directors under the Companies Act 2013.",
    keywords: "board resolution template, certified true copy resolution, bank account board resolution, companies act 2013 resolution",
    h1: "Board Resolution Template for Corporate Actions",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        In corporate administration, a Board Resolution represents an official collective decision made by the Board of Directors of a company during a duly convened meeting under the Companies Act, 2013.
      </p>
      <div style="border: 1px solid #E2E8F0; padding: 24px; border-radius: 16px; background: #F8FAFC; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Common Corporate Board Actions &amp; Compliance</h2>
        <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
          <li><strong>Bank Account Opening:</strong> Authorizing specific directors or executives to open and operate commercial current accounts and digital banking facilities.</li>
          <li><strong>Statutory Registration Signatory:</strong> Appointing authorized representatives for GST, PAN, TAN, Import-Export Code (IEC), and state commercial tax registrations.</li>
          <li><strong>Quorum &amp; Meeting Notice:</strong> Must satisfy the statutory quorum requirement under Section 174 (one-third of total directors or two directors, whichever is higher) and formal 7-day meeting notice under Section 173(3).</li>
          <li><strong>Certification:</strong> Certified True Copies must be signed by a non-interested director or company secretary with DIN clearly specified.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #64748B;">Need company incorporation or annual filing assistance? Visit <a href="/services/private-limited-company" style="color: #1A56DB; font-weight: 600;">Private Limited Incorporation</a> and our <a href="/roc-tools" style="color: #1A56DB; font-weight: 600;">ROC Compliance Suite</a>.</p>
    `
  },
  {
    path: "hubs/gst",
    isNoindex: true,
    title: "GST Compliance and Tax Hub | FilingBy",
    description: "Central resource cluster for Indian GST compliance: registration, monthly return filings, revocation, invoice templates, and calculators.",
    keywords: "gst hub, gst compliance resources, gstr filing hub, gst calculator and templates",
    h1: "GST Compliance & Tax Resource Hub",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Welcome to the FilingBy GST Compliance Hub. Access end-to-end statutory resources, filing pathways, calculation engines, and legal drafting templates designed for Indian businesses and tax filers.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin: 24px 0;">
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 8px;">GST Filing &amp; Advisory Services</h3>
          <ul style="padding-left: 18px; line-height: 1.8; font-size: 14px; color: #334155;">
            <li><a href="/services/gst-registration" style="color: #1A56DB; font-weight: 600;">New GSTIN Registration</a></li>
            <li><a href="/services/gst-return-filing" style="color: #1A56DB; font-weight: 600;">Monthly Return Filing (GSTR-1 &amp; 3B)</a></li>
            <li><a href="/services/gst-amendment" style="color: #1A56DB; font-weight: 600;">Core &amp; Non-Core Amendments</a></li>
            <li><a href="/services/gst-lut" style="color: #1A56DB; font-weight: 600;">LUT Filing for Zero-Rated Exports</a></li>
            <li><a href="/services/gst-revocation" style="color: #1A56DB; font-weight: 600;">Revocation of Cancelled GSTIN</a></li>
          </ul>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 8px;">Tools &amp; Drafting Templates</h3>
          <ul style="padding-left: 18px; line-height: 1.8; font-size: 14px; color: #334155;">
            <li><a href="/gst-calculator" style="color: #1A56DB; font-weight: 600;">Interactive GST Calculator</a></li>
            <li><a href="/tools/gst-eligibility" style="color: #1A56DB; font-weight: 600;">GST Registration Eligibility Checker</a></li>
            <li><a href="/templates/gst-invoice" style="color: #1A56DB; font-weight: 600;">Standard GST Tax Invoice Draft</a></li>
            <li><a href="/templates/rent-agreement" style="color: #1A56DB; font-weight: 600;">Commercial Rent Agreement Draft</a></li>
          </ul>
        </div>
      </div>
      <p style="font-size: 14px; color: #64748B;">For multi-state business expansion, review our nationwide <a href="/virtual-space" style="color: #1A56DB; font-weight: 600;">Virtual Office Solutions for GST</a>.</p>
    `
  },
  {
    path: "hubs/company",
    isNoindex: true,
    title: "Company Incorporation and Startup Hub | FilingBy",
    description: "Step-by-step entity formation guides, comparative analysis, statutory forms, and legal drafting templates for Indian entrepreneurs.",
    keywords: "company formation hub, startup registration resources, pvt ltd llp guides, incorporation checklist",
    h1: "Company Incorporation & Startup Resource Hub",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        The FilingBy Company Incorporation Hub offers comprehensive resources, comparison matrices, and statutory documentation workflows for incorporating and scaling corporate entities in India.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin: 24px 0;">
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 8px;">Incorporation Desks</h3>
          <ul style="padding-left: 18px; line-height: 1.8; font-size: 14px; color: #334155;">
            <li><a href="/services/private-limited-company" style="color: #1A56DB; font-weight: 600;">Private Limited Company (SPICe+)</a></li>
            <li><a href="/services/llp-registration" style="color: #1A56DB; font-weight: 600;">Limited Liability Partnership (LLP)</a></li>
            <li><a href="/services/one-person-company" style="color: #1A56DB; font-weight: 600;">One Person Company (OPC)</a></li>
            <li><a href="/services/section-8-company" style="color: #1A56DB; font-weight: 600;">Section 8 Non-Profit Company</a></li>
          </ul>
        </div>
        <div style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; background: #F8FAFC;">
          <h3 style="font-weight: 700; color: #0F172A; font-size: 16px; margin-bottom: 8px;">Decision Tools &amp; Templates</h3>
          <ul style="padding-left: 18px; line-height: 1.8; font-size: 14px; color: #334155;">
            <li><a href="/compare/private-limited-company-vs-llp" style="color: #1A56DB; font-weight: 600;">Pvt Ltd vs LLP Comparison</a></li>
            <li><a href="/tools/structure-selector" style="color: #1A56DB; font-weight: 600;">Business Structure Selector Quiz</a></li>
            <li><a href="/templates/nda" style="color: #1A56DB; font-weight: 600;">Mutual Non-Disclosure Agreement (NDA)</a></li>
            <li><a href="/templates/board-resolution" style="color: #1A56DB; font-weight: 600;">Board Resolution Template</a></li>
            <li><a href="/company-registration-guides" style="color: #1A56DB; font-weight: 600;">Company Registration Guides</a></li>
          </ul>
        </div>
      </div>
      <p style="font-size: 14px; color: #64748B;">For post-incorporation annual secretarial compliance, consult our <a href="/roc-tools" style="color: #1A56DB; font-weight: 600;">ROC Compliance Suite</a>.</p>
    `
  },
  {
    path: "compare/private-limited-company-vs-llp",
    isNoindex: true,
    title: "Private Limited Company vs LLP Comparison | FilingBy",
    description: "Detailed comparative analysis between a Private Limited Company and a Limited Liability Partnership (LLP) under Indian corporate law.",
    keywords: "pvt ltd vs llp, private limited vs limited liability partnership, startup structure comparison, mca compliance differences",
    h1: "Private Limited Company vs Limited Liability Partnership (LLP)",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        When starting a business in India, choosing between a Private Limited Company and a Limited Liability Partnership (LLP) affects equity fundraising capability, statutory compliance burden, tax efficiency, and operational agility.
      </p>
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="background: #0F172A; color: #FFFFFF;">
              <th style="padding: 12px 16px; border: 1px solid #334155;">Key Parameter</th>
              <th style="padding: 12px 16px; border: 1px solid #334155;">Private Limited Company</th>
              <th style="padding: 12px 16px; border: 1px solid #334155;">Limited Liability Partnership (LLP)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Governing Law</td>
              <td style="padding: 12px 16px; color: #475569;">Companies Act, 2013</td>
              <td style="padding: 12px 16px; color: #475569;">Limited Liability Partnership Act, 2008</td>
            </tr>
            <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Membership Limits</td>
              <td style="padding: 12px 16px; color: #475569;">Min 2, Max 200 shareholders</td>
              <td style="padding: 12px 16px; color: #475569;">Min 2 designated partners, no upper ceiling</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Venture / Angel Investment</td>
              <td style="padding: 12px 16px; color: #475569;">Highly preferred by VCs &amp; Angels (Equity &amp; ESOPs)</td>
              <td style="padding: 12px 16px; color: #475569;">Not suitable for institutional equity funding</td>
            </tr>
            <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Statutory Audit</td>
              <td style="padding: 12px 16px; color: #475569;">Mandatory from Year 1 regardless of turnover</td>
              <td style="padding: 12px 16px; color: #475569;">Mandatory only if turnover &gt; ₹40L or capital &gt; ₹25L</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Annual ROC Compliances</td>
              <td style="padding: 12px 16px; color: #475569;">AOC-4, MGT-7/7A, DIR-3 KYC, Board Meetings</td>
              <td style="padding: 12px 16px; color: #475569;">Form 11 (Annual Return), Form 8 (Statement of Accounts)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style="font-size: 14px; color: #64748B;">Ready to incorporate? <a href="/services/private-limited-company" style="color: #1A56DB; font-weight: 600;">Register a Private Limited Company</a> | <a href="/services/llp-registration" style="color: #1A56DB; font-weight: 600;">Register an LLP</a>.</p>
    `
  },
  {
    path: "compare/trademark-vs-patent",
    isNoindex: true,
    title: "Trademark vs Patent Registration Comparison | FilingBy",
    description: "Understand the core differences between trademark brand identity protection and patent invention exclusivity in India.",
    keywords: "trademark vs patent, brand vs invention protection, ip india difference, patent vs trademark cost timeline",
    h1: "Trademark vs Patent Registration Comparison",
    content: `
      <p style="font-size: 16px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
        Intellectual property rights grant statutory monopolies that protect distinct assets. A trademark protects brand identifiers (names, logos, taglines), whereas a patent protects novel, non-obvious industrial inventions and technical processes.
      </p>
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="background: #0F172A; color: #FFFFFF;">
              <th style="padding: 12px 16px; border: 1px solid #334155;">Key Attribute</th>
              <th style="padding: 12px 16px; border: 1px solid #334155;">Trademark Protection</th>
              <th style="padding: 12px 16px; border: 1px solid #334155;">Patent Protection</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Subject Matter</td>
              <td style="padding: 12px 16px; color: #475569;">Brand names, word marks, logos, slogans, trade dress</td>
              <td style="padding: 12px 16px; color: #475569;">Inventions, manufacturing processes, chemical compositions</td>
            </tr>
            <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Governing Statute</td>
              <td style="padding: 12px 16px; color: #475569;">Trade Marks Act, 1999</td>
              <td style="padding: 12px 16px; color: #475569;">Patents Act, 1970</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Validity Duration</td>
              <td style="padding: 12px 16px; color: #475569;">10 Years (Renewable indefinitely every 10 years)</td>
              <td style="padding: 12px 16px; color: #475569;">20 Years from filing date (Non-renewable)</td>
            </tr>
            <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">Registration Authority</td>
              <td style="padding: 12px 16px; color: #475569;">Trade Marks Registry (IP India)</td>
              <td style="padding: 12px 16px; color: #475569;">Indian Patent Office (IP India)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style="font-size: 14px; color: #64748B;">Secure your brand identity today: <a href="/services/trademark-registration" style="color: #1A56DB; font-weight: 600;">Trademark Registration Online</a> | <a href="/trademark-search" style="color: #1A56DB; font-weight: 600;">Trademark Search Guide</a>.</p>
    `
  }
];

const NOINDEX_PAGES = [
  { path: "get-live-quote", title: "Get a Live Quote | FilingBy.com" },
  { path: "partner-onboarding", title: "Partner Onboarding | FilingBy.com" },
  { path: "card", title: "Digital Business Card | FilingBy.com" },
  { path: "digital-card", title: "Digital Business Card | FilingBy.com" },
  { path: "login", title: "Log In | FilingBy.com" },
  { path: "register", title: "Register | FilingBy.com" },
  { path: "dashboard", title: "Client Dashboard | FilingBy.com" },
  { path: "dashboard/compliance", title: "User Compliance Dashboard | FilingBy.com" },
  { path: "virtual-office/dashboard", title: "Virtual Office Dashboard | FilingBy.com" },
  { path: "partner/dashboard", title: "Partner Dashboard | FilingBy.com" },
  { path: "admin", title: "Admin Portal | FilingBy.com" },
  { path: "admin/dashboard", title: "Admin Control Room | FilingBy.com" },
  { path: "sso-callback", title: "SSO Callback | FilingBy.com" },
  { path: "locations", title: "Virtual Office Locations | FilingBy.com" },
  { path: "404", title: "404 Page Not Found | FilingBy.com" }
];

const NOINDEX_ROUTE_PATHS = new Set(NOINDEX_PAGES.map((page) => page.path));

const SERVICE_SEO_OVERRIDES = {
  "udyam-registration": {
    title: "Udyam Registration Guidance & MSME Classification Support | FilingBy",
    description:
      "Independent guide for MSME classification, NIC codes, and official portal preparation. Official Government Udyam Registration is 100% free on udyamregistration.gov.in.",
    keywords:
      "udyam registration guidance, msme classification support, udyamregistration gov in, official udyam free, msme limits 2025 2026",
    h1: "Udyam Registration Guidance & MSME Classification Support"
  },
  "trust-registration": {
    title: "Trust Compliance in India: Annual Filing, Audit and Legal Checklist",
    description:
      "Understand trust compliance in India, including annual filing, audit applicability, ITR-7, 12A and 80G records, due dates and common mistakes.",
    keywords:
      "trust compliance india, trust audit india, trust compliance checklist, annual trust filing, audit of trust, ngo compliance india",
    h1: "Trust Compliance in India: Annual Filing, Audit and Legal Checklist"
  },
  "csr-registration": {
    title: "CSR Audit in India: Meaning, Applicability and Practical Compliance Guide",
    description:
      "Learn what CSR audit means in India, when it matters, what documents to prepare, how CSR-1 context fits in, and the practical checks companies should review.",
    keywords:
      "csr audit india, csr audit meaning, csr audit report, csr audit checklist, csr compliance guide",
    h1: "CSR Audit in India: Meaning, Applicability and Practical Compliance Guide"
  },
  "moa-amendment": {
    title: "MOA Amendment for Private Limited Companies: Process, Documents and Fees",
    description:
      "Learn how MOA amendment works for private limited companies in India, including board approval, special resolution, MGT-14 filing, timelines, fees and common mistakes.",
    keywords:
      "moa amendment, moa amendment private limited company, can moa be amended, object clause amendment, mgt-14 filing",
    h1: "MOA Amendment for Private Limited Companies: Process, Documents and Fees"
  },
  "pvt-winding-up": {
    title: "Private Limited Company Winding Up in India: Process, STK-2 Route and Key Checks",
    description:
      "Understand private limited company winding up in India, including STK-2 closure, eligibility, records to prepare, tax clean-up and common strike-off mistakes.",
    keywords:
      "private limited company winding up india, stk-2 company closure, close private limited company, company strike off india",
    h1: "Private Limited Company Winding Up in India: Process, STK-2 Route and Key Checks"
  },
  "tan-registration": {
    title: "TAN Registration in India: Form 49B Process, Documents and TDS Setup Guide",
    description:
      "Understand TAN registration in India, including Form 49B, documents, who needs TAN, TAN card queries, TDS setup and common first-time filing mistakes.",
    keywords:
      "tan registration india, tan card, tancard, form 49b, tan application process, tds setup for business",
    h1: "TAN Registration in India: Form 49B Process, Documents and TDS Setup Guide"
  },
  "roc-annual-filing-llp": {
    title: "LLP Compliance in India: Form 8, Form 11 and Annual Filing Checklist",
    description:
      "Understand LLP compliance in India, including Form 8, Form 11, due dates, annual filing checklist, penalties and practical records management for designated partners.",
    keywords:
      "llp compliance india, llp compliance, llp annual filing, form 8 form 11, llp compliance checklist",
    h1: "LLP Compliance in India: Form 8, Form 11 and Annual Filing Checklist"
  },
  "apeda-registration": {
    title: "APEDA Registration in India: Documents, RCMC Process and Export Readiness Guide",
    description:
      "Learn how APEDA registration works in India, including documents, RCMC process, fees, validity, export-readiness checks and common exporter mistakes.",
    keywords:
      "apeda registration india, apeda registration, apeda documents, rcmc registration, apeda online registration",
    h1: "APEDA Registration in India: Documents, RCMC Process and Export Readiness Guide"
  }
};


// Helper to sanitize HTML file creation
function writeHtmlPage(routePath, pageTitle, pageDescription, pageKeywords, pageSchema, pageContent, initialData = null, isNoindex = false) {
  const targetDir = join(distDir, routePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const siteUrl = "https://www.filingby.com";
  const canonicalUrl = routePath ? `${siteUrl}/${routePath.replace(/\/$/, "")}` : `${siteUrl}/`;

  const robotsMeta = isNoindex
    ? '<meta name="robots" content="noindex, follow" />\n  <meta name="googlebot" content="noindex, follow" />'
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />';

  // Assemble custom metadata block
  const seoMetadata = `
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}" />
  <meta name="keywords" content="${pageKeywords}" />
  ${robotsMeta}
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
    /<title>[\s\S]*?<meta name="revisit-after" content="7 days" \/>/i,
    ""
  );

  parsedHtml = parsedHtml.replace(
    /<\/head>/,
    `${seoMetadata}\n</head>`
  );

const GLOBAL_PRERENDER_FOOTER = `
  <footer style="margin-top: 60px; padding-top: 40px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #64748B;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 30px;">
      <div>
        <strong style="display: block; color: #0F172A; margin-bottom: 12px; font-size: 14px; text-transform: uppercase;">Core Services</strong>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/services/gst-registration" style="color: #475569; text-decoration: none;">GST Registration</a></li>
          <li><a href="/services/private-limited-company" style="color: #475569; text-decoration: none;">Private Limited Company</a></li>
          <li><a href="/services/trademark-registration" style="color: #475569; text-decoration: none;">Trademark Registration</a></li>
          <li><a href="/services/gst-return-filing" style="color: #475569; text-decoration: none;">GST Return Filing</a></li>
          <li><a href="/services/llp-registration" style="color: #475569; text-decoration: none;">LLP Registration</a></li>
          <li><a href="/services/itr-1-filing" style="color: #475569; text-decoration: none;">ITR-1 Return Filing</a></li>
          <li><a href="/services/udyam-registration" style="color: #475569; text-decoration: none;">MSME Udyam Registration</a></li>
          <li><a href="/services/one-person-company" style="color: #475569; text-decoration: none;">One Person Company</a></li>
          <li><a href="/services/fssai-basic-registration" style="color: #475569; text-decoration: none;">FSSAI Registration</a></li>
          <li><a href="/services/iec-registration" style="color: #475569; text-decoration: none;">Import Export Code (IEC)</a></li>
          <li><a href="/services/roc-annual-filing-pvt" style="color: #475569; text-decoration: none;">ROC Filing (Pvt Ltd)</a></li>
          <li><a href="/services/roc-annual-filing-llp" style="color: #475569; text-decoration: none;">ROC Filing (LLP)</a></li>
          <li><a href="/services/startup-india" style="color: #475569; text-decoration: none;">Startup India DPIIT</a></li>
          <li><a href="/services/trust-registration" style="color: #475569; text-decoration: none;">Trust Registration</a></li>
        </ul>
      </div>
      <div>
        <strong style="display: block; color: #0F172A; margin-bottom: 12px; font-size: 14px; text-transform: uppercase;">Compliance Tools</strong>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/gst-calculator" style="color: #475569; text-decoration: none;">GST Calculator</a></li>
          <li><a href="/income-tax-calculator" style="color: #475569; text-decoration: none;">Income Tax Calculator</a></li>
          <li><a href="/roc-tools" style="color: #475569; text-decoration: none;">ROC Compliance Tools</a></li>
          <li><a href="/company-registration-guides" style="color: #475569; text-decoration: none;">Company Registration Guides</a></li>
          <li><a href="/trademark-search" style="color: #475569; text-decoration: none;">Trademark Search</a></li>
          <li><a href="/legal-templates" style="color: #475569; text-decoration: none;">Legal Templates</a></li>
        </ul>
      </div>
      <div>
        <strong style="display: block; color: #0F172A; margin-bottom: 12px; font-size: 14px; text-transform: uppercase;">Company &amp; Workspaces</strong>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/virtual-space" style="color: #475569; text-decoration: none;">Virtual Space</a></li>
          <li><a href="/ecommerce-office" style="color: #475569; text-decoration: none;">Ecommerce Office</a></li>
          <li><a href="/about-us" style="color: #475569; text-decoration: none;">About Us</a></li>
          <li><a href="/our-promise" style="color: #475569; text-decoration: none;">Our Promise</a></li>
          <li><a href="/customer-care" style="color: #475569; text-decoration: none;">Customer Care</a></li>
          <li><a href="/faq" style="color: #475569; text-decoration: none;">FAQs</a></li>
          <li><a href="/blog" style="color: #475569; text-decoration: none;">Knowledge Hub</a></li>
          <li><a href="/contact-us" style="color: #475569; text-decoration: none;">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <strong style="display: block; color: #0F172A; margin-bottom: 12px; font-size: 14px; text-transform: uppercase;">Legal Policies</strong>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/terms-conditions" style="color: #475569; text-decoration: none;">Terms of Service</a></li>
          <li><a href="/default/refund" style="color: #475569; text-decoration: none;">Refund Policy</a></li>
          <li><a href="/default/privacy-policy" style="color: #475569; text-decoration: none;">Privacy Policy</a></li>
          <li><a href="/default/cookie-policy" style="color: #475569; text-decoration: none;">Cookie Policy</a></li>
          <li><a href="/default/disclaimer" style="color: #475569; text-decoration: none;">Disclaimer</a></li>
          <li><a href="/default/editorial-policy" style="color: #475569; text-decoration: none;">Editorial Policy</a></li>
          <li><a href="/default/corrections-policy" style="color: #475569; text-decoration: none;">Corrections Policy</a></li>
          <li><a href="/editorial-team" style="color: #475569; text-decoration: none;">Editorial Team</a></li>
        </ul>
      </div>
    </div>
    <p style="border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center; font-size: 12px; color: #94A3B8;">
      © 2026 FilingBy.com. All rights reserved. Professional corporate compliance &amp; taxation desk.
    </p>
  </footer>
`;

  // Inject content into <div id="root"> replacing entire template root container
  const preRenderedContent = `
    <div data-prerender-shell="true">
      <div class="prerendered-content" style="max-width: 1000px; margin: 40px auto; padding: 20px; font-family: -apple-system, sans-serif; line-height: 1.6; color: #334155;">
        ${pageContent}
        ${GLOBAL_PRERENDER_FOOTER}
      </div>
    </div>
    <div id="app-root"></div>
    ${initialData ? `<script id="__FILINGBY_PRERENDER_DATA__" type="application/json">${serializeForScript(initialData)}</script>` : ""}
  `;

  parsedHtml = parsedHtml.replace(
    /<div id="root">[\s\S]*?<\/body>/i,
    `<div id="root">${preRenderedContent}</div>\n</body>`
  );

  fs.writeFileSync(join(targetDir, "index.html"), parsedHtml, "utf8");
}

function writeNoIndexHtmlPage(routePath, pageTitle) {
  const targetDir = join(distDir, routePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const is404 = routePath === "404";
  const isPrivateOr404 =
    is404 ||
    routePath.startsWith("dashboard") ||
    routePath.startsWith("admin") ||
    routePath.startsWith("virtual-office/dashboard") ||
    routePath.startsWith("partner/dashboard") ||
    routePath.startsWith("sso-callback") ||
    routePath === "login" ||
    routePath === "register";

  const robotsDirective = isPrivateOr404 ? "noindex, nofollow" : "noindex, follow";

  const seoMetadata = `
  <title>${pageTitle}</title>
  <meta name="robots" content="${robotsDirective}" />
  <meta name="googlebot" content="${robotsDirective}" />
  <link rel="canonical" href="https://www.filingby.com/${routePath}" />
  `;

  // Clean default head SEO from template and inject route-specific SEO tags
  let parsedHtml = templateHtml.replace(
    /<title>[\s\S]*?<meta name="revisit-after" content="7 days" \/>/i,
    ""
  );

  parsedHtml = parsedHtml.replace(
    /<\/head>/,
    `${seoMetadata}\n</head>`
  );

  const innerContent = is404
    ? `<div style="max-width: 600px; margin: 80px auto; text-align: center; font-family: -apple-system, sans-serif; padding: 20px;">
        <h1 style="font-size: 48px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">404</h1>
        <h2 style="font-size: 22px; font-weight: 700; color: #1E293B; margin-bottom: 16px;">Page Not Found</h2>
        <p style="font-size: 15px; color: #64748B; line-height: 1.6; margin-bottom: 24px;">The compliance or legal service page you are looking for doesn't exist or has moved.</p>
        <a href="/" style="display: inline-block; background: #1A56DB; color: #ffffff; padding: 12px 28px; border-radius: 9999px; font-weight: 600; text-decoration: none; font-size: 14px;">Return Home</a>
      </div>`
    : `<div id="app-root"></div>`;

  parsedHtml = parsedHtml.replace(
    /<div id="root">[\s\S]*?<\/body>/i,
    `<div id="root">${innerContent}</div>\n</body>`
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
        `<h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin-bottom: 20px;">${page.h1}</h1>${page.content}`,
        null,
        page.isNoindex || false
      );
    }

    console.log(`Prerendering ${NOINDEX_PAGES.length} noindex pages...`);
    for (const page of NOINDEX_PAGES) {
      writeNoIndexHtmlPage(page.path, page.title);
    }
    if (fs.existsSync(join(distDir, "404/index.html"))) {
      fs.copyFileSync(join(distDir, "404/index.html"), join(distDir, "404.html"));
    }

    const staticUrls = [
      { path: "", changefreq: "daily", priority: "1.0" },
      { path: "virtual-space", changefreq: "daily", priority: "1.0" },
      { path: "ecommerce-office", changefreq: "weekly", priority: "0.9" },
      { path: "about-us", changefreq: "monthly", priority: "0.8" },
      { path: "our-promise", changefreq: "monthly", priority: "0.8" },
      { path: "customer-care", changefreq: "monthly", priority: "0.8" },
      { path: "faq", changefreq: "weekly", priority: "0.8" },
      { path: "blog", changefreq: "daily", priority: "0.8" },
      { path: "gst-calculator", changefreq: "weekly", priority: "0.9" },
      { path: "income-tax-calculator", changefreq: "weekly", priority: "0.9" },
      { path: "roc-tools", changefreq: "weekly", priority: "0.8" },
      { path: "company-registration-guides", changefreq: "weekly", priority: "0.8" },
      { path: "trademark-search", changefreq: "weekly", priority: "0.8" },
      { path: "legal-templates", changefreq: "weekly", priority: "0.8" },
      { path: "contact-us", changefreq: "monthly", priority: "0.7" },
      { path: "editorial-team", changefreq: "monthly", priority: "0.7" },
      { path: "terms-conditions", changefreq: "monthly", priority: "0.5" },
      { path: "default/refund", changefreq: "monthly", priority: "0.5" },
      { path: "default/privacy-policy", changefreq: "monthly", priority: "0.5" },
      { path: "default/cookie-policy", changefreq: "monthly", priority: "0.5" },
      { path: "default/disclaimer", changefreq: "monthly", priority: "0.5" },
      { path: "default/editorial-policy", changefreq: "monthly", priority: "0.5" },
      { path: "default/corrections-policy", changefreq: "monthly", priority: "0.5" },
    ].filter((page) => !NOINDEX_ROUTE_PATHS.has(page.path));

    if (!process.env.MONGODB_URI) {
      console.warn("WARNING: MONGODB_URI is not set. Skipping dynamic page pre-rendering and sitemap generation.");

      // Check if we already have pre-generated files in public/ (committed from local builds)
      const filesToCopy = ["sitemap.xml", "image-sitemap.xml", "robots.txt", "feed.xml", "ads.txt"];
      let copiedCount = 0;
      for (const file of filesToCopy) {
        const publicFile = join(__dirname, `../public/${file}`);
        if (fs.existsSync(publicFile)) {
          fs.copyFileSync(publicFile, join(distDir, file));
          copiedCount++;
        }
      }

      if (copiedCount === filesToCopy.length) {
        console.log("Successfully copied pre-generated sitemaps, robots.txt, feed.xml, and ads.txt from public/ to dist/.");
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

    const CORE_INDEXABLE_SERVICES = new Set([
      "gst-registration",
      "gst-return-filing",
      "private-limited-company",
      "llp-registration",
      "one-person-company",
      "trademark-registration",
      "itr-1-filing",
      "fssai-basic-registration",
      "udyam-registration",
      "iec-registration",
      "startup-india",
      "roc-annual-filing-pvt",
      "roc-annual-filing-llp",
      "trust-registration",
    ]);

    console.log(`Prerendering ${services.length} CA services (Core: ${CORE_INDEXABLE_SERVICES.size} indexed, ${services.length - CORE_INDEXABLE_SERVICES.size} noindexed)...`);
    for (const service of services) {
      const isCore = CORE_INDEXABLE_SERVICES.has(service.slug);
      const isNoindex = !isCore;
      const core = CORE_SERVICES_CONTENT[service.slug] || null;

      const o = SERVICE_SEO_OVERRIDES[service.slug] || null;
      const title = core?.metaTitle || o?.title || `${service.name} Online India — Fast & Affordable | FilingBy`;
      
      let description = core?.metaDescription || o?.description || service.seoDescription || service.description || "";
      if (!description) {
        description = `Get expert CA/CS assisted ${service.name} services online in India with transparent pricing, secure uploads, and guaranteed compliance.`;
      } else if (description.length < 120 && !core) {
        description = `${description.trim()} Secure online filing, transparent flat-rate pricing, and dedicated expert support for businesses across India.`;
      }
      if (description.length > 160 && !core) {
        description = description.substring(0, 157) + "...";
      }

      const keywords = core?.metaKeywords || o?.keywords || `${service.name.toLowerCase()} online, ${service.name.toLowerCase()} registration, online CA services India`;

      const schemaName = service.slug === "udyam-registration"
        ? "MSME Classification & Udyam Guidance"
        : (core?.name || service.name);
      const schemaDesc = service.slug === "udyam-registration"
        ? "Independent educational and advisory guidance for MSME classification, NIC codes, and official portal preparation. Official Udyam Registration is 100% free on the Government portal udyamregistration.gov.in."
        : description;

      const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": schemaName,
        "description": schemaDesc,
        "image": "https://www.filingby.com/logo.jpeg",
        "provider": {
          "@type": "Organization",
          "name": "FilingBy",
          "url": "https://www.filingby.com"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Corporate Compliance Services"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": core?.basePrice || service.basePrice || "999.00",
          "priceValidUntil": "2027-12-31",
          "url": `https://www.filingby.com/services/${service.slug}`,
          "availability": "https://schema.org/InStock"
        }
      };

      const docsList = core?.documentsRequired || service.documentsRequired || [];
      const stepsList = core?.processSteps || service.processSteps || [];
      const benefitsList = core?.benefits || service.benefits || [];
      const faqsList = core?.faqs || service.faqs || [];
      const statutory = core?.statutoryInfo || null;

      const bodyContent = `
        <h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin-bottom: 20px;">${core?.h1 || o?.h1 || service.name}</h1>
        ${statutory ? `
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 18px; border-radius: 14px; margin-bottom: 24px; font-size: 14px; line-height: 1.6;">
            <p style="margin: 0 0 6px 0;"><strong>Governing Act:</strong> ${escapeXml(statutory.governingAct)}</p>
            <p style="margin: 0 0 6px 0;"><strong>Relevant Sections:</strong> ${escapeXml(statutory.sections)}</p>
            <p style="margin: 0 0 6px 0;"><strong>Official Portal:</strong> ${escapeXml(statutory.portal)}</p>
            <p style="margin: 0;"><strong>Statutory Fee:</strong> ${escapeXml(statutory.statutoryFee)}</p>
          </div>
        ` : ""}
        <div style="font-size: 16px; color: #334155; line-height: 1.7; margin-bottom: 30px;">
          ${core?.overview ? core.overview : `<p>${description}</p>`}
        </div>
        ${service.slug === "udyam-registration" ? `
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #065F46; margin-bottom: 8px;">Official Government Registration is 100% Free</h2>
            <p style="font-size: 16px; font-weight: 700; color: #047857; margin: 0 0 10px 0;">Government Udyam Registration Fee: ₹0 (Zero Official Fee)</p>
            <p style="font-size: 14px; color: #065F46; line-height: 1.6; margin: 0 0 16px 0;">The Government of India provides official Udyam Registration completely free of charge and paperless on <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" style="color: #047857; font-weight: 700; text-decoration: underline;">udyamregistration.gov.in</a>. FilingBy is an independent platform and is not affiliated with or authorized by the Ministry of MSME to process or issue registrations.</p>
            <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 9999px; font-weight: 700; text-decoration: none; font-size: 14px;">View Official Udyam Portal (Free) ↗</a>
            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #D1FAE5; font-size: 13px; color: #065F46;">
              <strong>Optional FilingBy Service:</strong> Independent Business Classification Consultation: ₹${core?.basePrice || "499"} (Advisory only)
            </div>
          </div>
        ` : `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 16px; margin-bottom: 30px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 10px;">Pricing details</h2>
            <p style="font-size: 24px; font-weight: 800; color: #1A56DB;">₹${core?.basePrice || service.basePrice || "999"} <span style="font-size: 14px; font-weight: 500; color: #64748B;">/ ${service.billingCycle || "Fixed"}</span></p>
          </div>
        `}
        ${benefitsList.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">Key Advantages &amp; Statutory Benefits</h2>
          <ul style="margin-bottom: 30px; padding-left: 20px; line-height: 1.7;">
            ${benefitsList.map(b => `<li style="margin-bottom: 8px;">${escapeXml(b)}</li>`).join("")}
          </ul>
        ` : ""}
        ${docsList.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">Documents Required</h2>
          <ul style="margin-bottom: 30px; padding-left: 20px; line-height: 1.7;">
            ${docsList.map(doc => `<li style="margin-bottom: 8px;">${escapeXml(doc)}</li>`).join("")}
          </ul>
        ` : ""}
        ${stepsList.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">Filing Process &amp; Roadmap</h2>
          <ol style="margin-bottom: 30px; padding-left: 20px; line-height: 1.7;">
            ${stepsList.map(step => `<li style="margin-bottom: 12px;">${escapeXml(step)}</li>`).join("")}
          </ol>
        ` : ""}
        ${faqsList.length > 0 ? `
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin-top: 30px;">Frequently Asked Questions</h2>
          <div style="margin-top: 15px;">
            ${faqsList.map(faq => `<div style="margin-bottom: 20px;"><strong style="color: #0F172A; font-size: 16px;">Q: ${escapeXml(faq.q)}</strong><p style="margin-top: 6px; color: #475569; line-height: 1.6;">A: ${escapeXml(faq.a)}</p></div>`).join("")}
          </div>
        ` : ""}
      `;

      const serviceInitialDataPayload = core
        ? {
            ...service,
            name: core.name,
            category: core.category,
            basePrice: core.basePrice,
            description: core.overview.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
            documentsRequired: core.documentsRequired,
            processSteps: core.processSteps,
            benefits: core.benefits,
            faqs: core.faqs,
            statutoryInfo: core.statutoryInfo
          }
        : service;

      writeHtmlPage(
        `services/${service.slug}`,
        title,
        description,
        keywords,
        schema,
        bodyContent,
        buildServiceInitialData(serviceInitialDataPayload),
        isNoindex
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
        null,
        cityBody,
        null,
        true // isNoindex = true (Pending owner confirmation of location operator agreements)
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
            <p style="color: #475569; margin-bottom: 30px;">${addr.description || `A commercial desk space and business address in ${loc.name}. Available across supported business hubs.`}</p>
          `;

          writeHtmlPage(
            `virtual-office-${loc.slug}/${addr.slug}`,
            areaTitle,
            areaDesc,
            areaKeywords,
            null,
            areaBody,
            null,
            true // isNoindex = true (Pending owner confirmation of location operator agreements)
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

      const postKeywords = [
        post.focusKeyword,
        ...(Array.isArray(post.secondaryKeywords) ? post.secondaryKeywords : []),
        ...(Array.isArray(post.tags) ? post.tags : [])
      ].filter(Boolean);

      const postSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `https://www.filingby.com/blog/${post.slug}#article`,
        "headline": post.title,
        "description": description,
        "datePublished": post.publishedAt,
        "dateModified": post.lastUpdated || post.updatedAt || post.publishedAt,
        "author": { 
          "@type": "Organization", 
          "name": "FilingBy Editorial Team" 
        },
        "publisher": {
          "@type": "Organization",
          "name": "FilingBy",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.filingby.com/logo.jpeg"
          }
        },
        "image": [post.image || "https://www.filingby.com/logo.jpeg"],
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.filingby.com/blog/${post.slug}`
        },
        "keywords": postKeywords.join(", ")
      };

      const bodyContent = `
        <article style="max-width: 800px; margin: 0 auto;">
          <div style="font-size: 14px; font-weight: 600; color: #1A56DB; text-transform: uppercase; margin-bottom: 10px;">
            ${post.category} &bull; ${post.readTime} min read &bull; ${formattedDate}
          </div>
          <h1 style="font-size: 36px; font-weight: 800; color: #0F172A; line-height: 1.25; margin-bottom: 20px;">${post.title}</h1>
          <div style="display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 22px; font-size: 14px; color: #475569;">
            <span><strong style="color: #0F172A;">Published by:</strong> FilingBy Editorial Team</span>
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

    // Prerender Blog Directory Page (/blog)
    console.log(`Prerendering /blog directory index with ${blogs.length} articles...`);
    const blogIndexTitle = "Corporate Compliance & Tax Knowledge Hub | FilingBy.com Blog";
    const blogIndexDesc = "Browse in-depth guides, compliance checklists, and statutory updates on GST registration, company incorporation, trademark protection, and Indian corporate tax laws.";
    const blogIndexKeywords = "filingby blog, compliance guides india, gst registration guide, company incorporation india, income tax updates, startup legal checklist";

    const blogIndexSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": blogIndexTitle,
      "description": blogIndexDesc,
      "url": "https://www.filingby.com/blog",
      "publisher": {
        "@type": "Organization",
        "name": "FilingBy.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.filingby.com/logo.jpeg"
        }
      }
    };

    const blogCardsHtml = blogs.map((post) => `
      <div style="border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span style="display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #1A56DB; background: #EFF6FF; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px;">${escapeXml(post.category || "General")}</span>
          <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 10px; line-height: 1.35;">
            <a href="/blog/${post.slug}" style="color: #0F172A; text-decoration: none;">${escapeXml(post.title)}</a>
          </h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
            ${escapeXml(post.excerpt || "")}
          </p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 12px;">
          <span>${post.readTime || 5} min read</span>
          <a href="/blog/${post.slug}" style="color: #1A56DB; font-weight: 600; text-decoration: none;">Read Full Guide &rarr;</a>
        </div>
      </div>
    `).join("");

    const blogIndexBody = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px 0;">
        <h1 style="font-size: 36px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Corporate Compliance &amp; Tax Knowledge Hub</h1>
        <p style="font-size: 18px; color: #475569; line-height: 1.6; margin-bottom: 30px; max-width: 800px;">
          Welcome to the FilingBy Knowledge Hub. Explore our comprehensive library of practitioner-level compliance guides, statutory filing walk-throughs, GST registration tutorials, and corporate legal checklists written and reviewed by our experienced compliance desk.
        </p>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin-bottom: 40px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 10px;">Editorial Integrity &amp; Fact-Checking</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 0;">
            All articles published on FilingBy.com undergo multi-stage editorial verification against relevant statutory frameworks, including the Companies Act, 2013, the Central Goods and Services Tax (CGST) Act, 2017, the Income-tax Act, 1961, and official circulars issued by the Ministry of Corporate Affairs (MCA), the Central Board of Direct Taxes (CBDT), and the Central Board of Indirect Taxes and Customs (CBIC). For inquiries or fact-checking feedback, contact our editorial team at <a href="mailto:support@filingby.com" style="color: #1A56DB;">support@filingby.com</a>.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; margin-bottom: 50px;">
          ${blogCardsHtml}
        </div>
      </div>
    `;

    writeHtmlPage(
      "blog",
      blogIndexTitle,
      blogIndexDesc,
      blogIndexKeywords,
      blogIndexSchema,
      blogIndexBody
    );

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
      if (!CORE_INDEXABLE_SERVICES.has(service.slug)) continue;
      sitemapXml += `
  <url>
    <loc>${escapeXml(`https://www.filingby.com/services/${service.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Virtual Office City and Area pages are excluded from sitemap.xml pending owner location confirmation.
    // Core Virtual Office Hub (/virtual-space), Locations Directory (/locations), and E-commerce Hub (/ecommerce-office) remain in staticUrls.

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

    // Generate/sync ads.txt automatically
    console.log("Syncing ads.txt automatically...");
    const adsTxt = "google.com, pub-6303291083449043, DIRECT, f08c47fec0942fa0\n";
    fs.writeFileSync(join(distDir, "ads.txt"), adsTxt, "utf8");
    fs.writeFileSync(join(__dirname, "../public/ads.txt"), adsTxt, "utf8");
    console.log("ads.txt verified and synced automatically!");

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
