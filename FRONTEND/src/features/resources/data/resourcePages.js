export const trafficTopics = [
  {
    title: "GST Calculator",
    description: "Calculate GST inclusive and exclusive amounts with instant tax breakup.",
    path: "/gst-calculator",
    tag: "Tool"
  },
  {
    title: "Income Tax Calculator",
    description: "Estimate old vs new regime tax for FY 2025-26 with quick comparisons.",
    path: "/income-tax-calculator",
    tag: "Tool"
  },
  {
    title: "ROC Tools",
    description: "Annual filing checklists, compliance steps, and service shortcuts for companies and LLPs.",
    path: "/roc-tools",
    tag: "Hub"
  },
  {
    title: "Company Registration Guides",
    description: "Compare Pvt Ltd, LLP, OPC, and proprietorship structures before you file.",
    path: "/company-registration-guides",
    tag: "Guide"
  },
  {
    title: "Trademark Search",
    description: "Check your brand idea, classes, and next steps before filing a trademark.",
    path: "/trademark-search",
    tag: "Guide"
  },
  {
    title: "Legal Templates",
    description: "Explore the agreements and legal documents founders ask for most often.",
    path: "/legal-templates",
    tag: "Templates"
  }
];

export const companyGuideCards = [
  {
    title: "Private Limited Company",
    summary: "Best for funded startups and businesses planning to raise capital.",
    highlights: ["Separate legal entity", "Easy equity allocation", "Stronger investor preference"],
    servicePath: "/services/private-limited-company"
  },
  {
    title: "LLP Registration",
    summary: "Useful for professional firms and lower-maintenance partnerships.",
    highlights: ["Limited liability", "Flexible management", "Lower compliance than many companies"],
    servicePath: "/services/llp-registration"
  },
  {
    title: "One Person Company",
    summary: "Suitable for solo founders who want a company structure instead of proprietorship.",
    highlights: ["Single promoter format", "Limited liability", "Corporate identity"],
    servicePath: "/services/one-person-company"
  },
  {
    title: "Sole Proprietorship",
    summary: "Simple setup for freelancers, consultants, and small early-stage businesses.",
    highlights: ["Fast to start", "Low cost", "Works well for testing demand"],
    servicePath: "/services/sole-proprietorship"
  }
];

export const legalTemplateCards = [
  {
    title: "Founders & Shareholder Documents",
    items: ["Shareholders agreement", "Founders arrangement", "Share allotment support"],
    servicePath: "/services/shareholders-agreement"
  },
  {
    title: "Employment & HR Documents",
    items: ["Employment agreement", "HR policy", "Contractor documentation"],
    servicePath: "/services/employment-agreement"
  },
  {
    title: "Commercial Contracts",
    items: ["NDA drafting", "MOU drafting", "Franchise and rent agreements"],
    servicePath: "/services/nda-drafting"
  },
  {
    title: "Notice & Dispute Documents",
    items: ["Legal notice", "Reply drafting", "Cheque bounce notice support"],
    servicePath: "/services/legal-notice"
  }
];

export const rocToolCards = [
  {
    title: "Private Limited Annual Filing",
    summary: "Track the regular ROC work most private limited companies need each financial year.",
    items: ["AOC-4 preparation", "MGT-7 support", "Board and AGM checklist"],
    servicePath: "/services/roc-annual-filing-pvt"
  },
  {
    title: "LLP Annual Filing",
    summary: "Review the core annual returns and accounting work for LLP compliance.",
    items: ["Form 11 support", "Form 8 support", "Partner data review"],
    servicePath: "/services/roc-annual-filing-llp"
  },
  {
    title: "Director & DIN Actions",
    summary: "Keep director records current and avoid avoidable non-compliance.",
    items: ["DIN eKYC", "Appointment or removal", "Designation changes"],
    servicePath: "/services/din-ekyc"
  }
];

export const trademarkChecklist = [
  "Shortlist 2 to 3 brand name options before searching.",
  "Search both exact matches and similar sounding names.",
  "Review the correct trademark class for your goods or services.",
  "Check domain and social handle availability alongside the registry search.",
  "Keep logo, wordmark, and tagline searches separate where needed."
];

export const resourceFaqs = {
  gst: [
    {
      q: "What is the difference between inclusive and exclusive GST?",
      a: "Exclusive GST means tax is added on top of the base amount. Inclusive GST means the entered amount already contains GST and the tax must be backed out."
    },
    {
      q: "Can I use this GST calculator for CGST and SGST split?",
      a: "Yes. The calculator shows an equal split for CGST and SGST for intra-state sales and the full amount as IGST for inter-state sales."
    }
  ],
  incomeTax: [
    {
      q: "Which financial year does this calculator use?",
      a: "This estimator is designed for FY 2025-26 and AY 2026-27 for resident individuals, based on the current slab presentation on the Income Tax Department help pages."
    },
    {
      q: "Does the result include surcharge or special rates?",
      a: "No. It is a practical estimator for regular salary and business income. Surcharge, special capital gains rates, and detailed marginal relief scenarios are not included."
    }
  ]
};
