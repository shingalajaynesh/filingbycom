/**
 * Canonical fallback service dataset for FilingBy's core services.
 * Ensures the homepage and client application NEVER show empty states
 * if backend API calls fail, time out, or are unavailable during cold starts.
 */
export const FALLBACK_SERVICES = [
  {
    _id: "core-gst-registration",
    slug: "gst-registration",
    name: "GST Registration",
    description: "Official Goods and Services Tax registration for businesses in India. Get your 15-digit GSTIN with complete document verification and filing support.",
    basePrice: 999,
    billingCycle: "Fixed",
    category: "GST Services",
    icon: "receipt",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-private-limited-company",
    slug: "private-limited-company",
    name: "Private Limited Company",
    description: "Incorporate your Pvt Ltd company via MCA V3 SPICe+ framework. Includes DIN, name approval, DSC, MOA/AOA drafting, and Certificate of Incorporation.",
    basePrice: 6999,
    billingCycle: "Fixed",
    category: "Company Registration",
    icon: "building",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-trademark-registration",
    slug: "trademark-registration",
    name: "Trademark Registration",
    description: "Protect your brand name, logo, or slogan across India with IP India online filing. Complete Nice classification selection and priority assistance.",
    basePrice: 6999,
    billingCycle: "Fixed",
    category: "Trademark & IP",
    icon: "trademark",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-gst-return-filing",
    slug: "gst-return-filing",
    name: "GST Return Filing",
    description: "Monthly and quarterly GST compliance, outward invoice reporting (GSTR-1), GSTR-2B/IMS ITC reconciliation, and summary GSTR-3B tax computation.",
    basePrice: 6999,
    billingCycle: "Month",
    category: "GST Services",
    icon: "chart",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-llp-registration",
    slug: "llp-registration",
    name: "LLP Registration",
    description: "Incorporate a Limited Liability Partnership under MCA rules. Combines corporate limited liability with partnership operational flexibility.",
    basePrice: 4999,
    billingCycle: "Fixed",
    category: "Company Registration",
    icon: "handshake",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-itr-1-filing",
    slug: "itr-1-filing",
    name: "ITR-1 Salaried Individual",
    description: "Income tax return filing for salaried residents with total income up to ₹50 Lakhs under New vs Old Tax Regime optimization.",
    basePrice: 999,
    billingCycle: "Fixed",
    category: "Income Tax",
    icon: "wallet",
    tag: "Essential",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-udyam-registration",
    slug: "udyam-registration",
    name: "MSME Classification & Udyam Guidance",
    description: "Advisory and document preparation for MSME classification under revised composite investment and turnover thresholds.",
    basePrice: 499,
    billingCycle: "Fixed",
    category: "Licenses",
    icon: "scale",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-roc-annual-filing-pvt",
    slug: "roc-annual-filing-pvt",
    name: "ROC Filing (Pvt Ltd)",
    description: "Statutory annual compliance filing for private limited companies: Form AOC-4 (Financials) and Form MGT-7/7A (Annual Return).",
    basePrice: 2999,
    billingCycle: "Fixed",
    category: "MCA / ROC",
    icon: "landmark",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-fssai-basic-registration",
    slug: "fssai-basic-registration",
    name: "FSSAI Registration",
    description: "Statutory food business registration under FoSCoS for petty food manufacturers, cloud kitchens, and traders.",
    basePrice: 1499,
    billingCycle: "Fixed",
    category: "Licenses",
    icon: "document",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-one-person-company",
    slug: "one-person-company",
    name: "One Person Company",
    description: "Full corporate structure and limited liability for solo entrepreneurs under Section 2(62) of the Companies Act, 2013.",
    basePrice: 4999,
    billingCycle: "Fixed",
    category: "Company Registration",
    icon: "building",
    tag: "Popular",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-iec-registration",
    slug: "iec-registration",
    name: "Import Export Code (IEC)",
    description: "10-digit DGFT commercial import-export identifier legally required for international trade clearance and customs compliance.",
    basePrice: 999,
    billingCycle: "Fixed",
    category: "Licenses",
    icon: "globe",
    tag: "Essential",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-roc-annual-filing-llp",
    slug: "roc-annual-filing-llp",
    name: "ROC Filing (LLP)",
    description: "Annual statutory returns for LLPs: Form 11 (Annual Return) and Form 8 (Statement of Account & Solvency) on MCA portal.",
    basePrice: 6999,
    billingCycle: "Fixed",
    category: "MCA / ROC",
    icon: "landmark",
    tag: "Compliance",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-startup-india",
    slug: "startup-india",
    name: "Startup India Registration",
    description: "DPIIT recognition for eligible Indian startups to access tax exemptions under Section 80-IAC and angel tax safeguards.",
    basePrice: 4999,
    billingCycle: "Fixed",
    category: "Licenses",
    icon: "chart",
    tag: "Growth",
    isPopular: true,
    isActive: true
  },
  {
    _id: "core-trust-registration",
    slug: "trust-registration",
    name: "Trust Registration",
    description: "Public charitable and private trust registration, trust deed execution, and guidance on 12AB and 80G tax exemptions.",
    basePrice: 19999,
    billingCycle: "Fixed",
    category: "NGO & Trust",
    icon: "handshake",
    tag: "NGO / Trust",
    isPopular: true,
    isActive: true
  }
];

/**
 * Top curated popular services in deterministic display order.
 * Derived directly from the canonical FALLBACK_SERVICES array.
 * First 8 are displayed by default on the homepage Popular Services grid.
 * Clicking 'Show All Services' expands to all 14 core services.
 */
export const CURATED_POPULAR_SLUGS = FALLBACK_SERVICES.map(s => s.slug);
