import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../src/models/Service.model.js";

dotenv.config();

const SERVICE_UPDATES = [
  {
    slug: "trust-registration",
    seoTitle: "Trust Compliance in India: Annual Filing, Audit and Legal Checklist",
    seoDescription:
      "Learn trust compliance requirements in India, including annual filings, audit applicability, records to maintain, common mistakes and practical timelines.",
    seoKeywords:
      "trust compliance india, trust audit india, trust compliance checklist, annual trust filing, trust registration compliance",
    descriptionAppend:
      " Covers annual trust compliance, trust audit applicability, ITR-7 filing discipline, 12A and 80G record readiness, and practical governance steps for Indian trusts."
  },
  {
    slug: "csr-registration",
    seoTitle: "CSR Audit in India: Meaning, Applicability and Practical Compliance Guide",
    seoDescription:
      "A practical CSR audit guide covering meaning, applicability, reporting context, documents to prepare and common mistakes businesses make.",
    seoKeywords:
      "csr audit india, csr audit meaning, csr audit checklist, csr compliance guide, csr registration service",
    descriptionAppend:
      " Also useful for companies reviewing CSR-1 readiness, utilisation evidence, audit support records and board-report disclosure discipline."
  },
  {
    slug: "moa-amendment",
    seoTitle: "MOA Amendment for Private Limited Companies: Process, Documents and Fees",
    seoDescription:
      "Learn how MOA amendment works for private limited companies in India, including board approvals, ROC steps, fees and common filing errors.",
    seoKeywords:
      "moa amendment private limited company, object clause amendment, mgt-14 filing, moa amendment process india, roc moa change",
    descriptionAppend:
      " Includes object clause amendment planning, board and shareholder approval flow, MGT-14 filing support and practical ROC documentation checks."
  },
  {
    slug: "pvt-winding-up",
    seoTitle: "Private Limited Company Winding Up in India: Process, STK-2 Route and Key Checks",
    seoDescription:
      "Understand private limited company winding up in India, including STK-2 closure, eligibility, records to prepare, tax considerations and common mistakes.",
    seoKeywords:
      "private limited company winding up india, stk-2 company closure, close private limited company, strike off company india",
    descriptionAppend:
      " Explains Fast Track Exit suitability, STK-2 closure checks, tax and shareholder implications, and the practical clean-up needed before company strike-off."
  },
  {
    slug: "tan-registration",
    seoTitle: "TAN Registration in India: Form 49B Process, Documents and TDS Setup Guide",
    seoDescription:
      "Understand TAN registration in India, including Form 49B, required documents, who needs TAN and how to prepare for TDS compliance properly.",
    seoKeywords:
      "tan registration india, form 49b, tan card online, tds setup for business, tan application process",
    descriptionAppend:
      " Useful for businesses setting up TDS operations, understanding Form 49B, and preparing deductor records before the first return cycle begins."
  },
  {
    slug: "roc-annual-filing-llp",
    seoTitle: "LLP Compliance in India: Form 8, Form 11 and Annual Filing Checklist",
    seoDescription:
      "Understand LLP compliance in India, including Form 8, Form 11, due dates, penalties, annual filing checklist and practical record-keeping steps.",
    seoKeywords:
      "llp compliance india, llp annual filing, form 8 form 11, llp compliance checklist, annual return for llp",
    descriptionAppend:
      " Covers Form 8 and Form 11 deadlines, annual LLP record discipline, penalty exposure and practical filing control for designated partners."
  },
  {
    slug: "itr-1-filing",
    seoTitle: "ITR Filing for Salaried Individuals in India: Documents, Deductions and Filing Checklist",
    seoDescription:
      "A practical ITR filing guide for salaried individuals in India covering documents, deductions, common mistakes and filing readiness.",
    seoKeywords:
      "itr filing for salaried individuals, salary return filing india, itr 1 filing, salaried employee tax return, income tax filing salary",
    descriptionAppend:
      " Helps salaried taxpayers organise Form 16, AIS, deduction proofs and return-filing checks before the due date."
  },
  {
    slug: "apeda-registration",
    seoTitle: "APEDA Registration in India: Documents, RCMC Process and Export Readiness Guide",
    seoDescription:
      "Learn how APEDA registration works in India, including documents, RCMC process, fees, validity and export-readiness checks for businesses.",
    seoKeywords:
      "apeda registration india, apeda documents, rcmc registration, apeda online registration, agricultural export registration",
    descriptionAppend:
      " Includes APEDA document checks, RCMC workflow, fee expectations, renewal context and exporter onboarding preparation."
  },
  {
    slug: "gst-audit",
    seoTitle: "GST Audit in India: Applicability, Reconciliation and Practical Preparation Guide",
    seoDescription:
      "Understand GST audit in India, including applicability, reconciliation work, records to prepare and common mistakes businesses should avoid.",
    seoKeywords:
      "gst audit india, gst audit applicability, gst reconciliation guide, gstr audit preparation, gst compliance audit",
    descriptionAppend:
      " Focuses on GST reconciliation, document readiness, audit support records and practical compliance preparation for growing businesses."
  },
  {
    slug: "12a-registration",
    seoTitle: "12A Registration for Trusts and NGOs in India: Process, Documents and Tax Benefit Guide",
    seoDescription:
      "Learn how 12A registration works for trusts and NGOs in India, including eligibility, documents, tax exemption benefits and practical filing checks.",
    seoKeywords:
      "12a registration india, 12a registration for trust, ngo tax exemption, trust 12a process, 12a application documents",
    descriptionAppend:
      " Covers 12A eligibility, trust and NGO document preparation, tax exemption positioning and the practical compliance trail needed after approval."
  },
  {
    slug: "tds-return-filing",
    seoTitle: "TDS Return Filing in India: Due Dates, Forms and Correction Guide for Businesses",
    seoDescription:
      "Understand TDS return filing in India, including Form 24Q, 26Q and 27Q, due dates, late fees, correction filing and practical compliance checks.",
    seoKeywords:
      "tds return filing india, form 24q 26q 27q, tds late fee, tds correction return, tds filing service",
    descriptionAppend:
      " Useful for businesses setting up TDS filing discipline, handling quarterly return forms, late fee exposure and correction statement planning."
  }
];

function mergeDescription(base = "", append = "") {
  const normalizedBase = base.trim();
  if (!append || normalizedBase.includes(append.trim())) {
    return normalizedBase;
  }
  return normalizedBase ? `${normalizedBase} ${append.trim()}` : append.trim();
}

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database for July 2026 SEO actions...");

    for (const update of SERVICE_UPDATES) {
      const service = await Service.findOne({ slug: update.slug });
      if (!service) {
        console.log(`Skipped missing service: ${update.slug}`);
        continue;
      }

      service.seoTitle = update.seoTitle;
      service.seoDescription = update.seoDescription;
      service.seoKeywords = update.seoKeywords;
      service.description = mergeDescription(service.description, update.descriptionAppend);

      await service.save();
      console.log(`Updated SEO fields for: ${update.slug}`);
    }

    console.log("July 2026 SEO actions applied successfully.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to apply July 2026 SEO actions:", error);
    process.exit(1);
  }
}

run();
