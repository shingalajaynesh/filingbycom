export const trafficTopics = [
  {
    title: "GST Calculator",
    description: "Calculate GST inclusive and exclusive amounts with instant CGST, SGST, and IGST tax breakup.",
    path: "/gst-calculator",
    tag: "Tool"
  },
  {
    title: "Income Tax Calculator",
    description: "Compare Old vs New Tax Regime liabilities for FY 2025-26 (AY 2026-27) with Section 87A rebate rules.",
    path: "/income-tax-calculator",
    tag: "Tool"
  },
  {
    title: "ROC Compliance Tools",
    description: "MCA annual filing timelines, statutory fee structures, penalty calculators, and compliance checklists.",
    path: "/roc-tools",
    tag: "Compliance Hub"
  },
  {
    title: "Company Registration Guides",
    description: "Detailed comparative framework for Private Limited, LLP, OPC, and Sole Proprietorship models.",
    path: "/company-registration-guides",
    tag: "Decision Guide"
  },
  {
    title: "Trademark Search Guide",
    description: "Step-by-step IP India public search methodology across all 45 Nice classes to prevent objections.",
    path: "/trademark-search",
    tag: "IP Guide"
  },
  {
    title: "Legal Templates & Contracts",
    description: "Foundational agreements, key statutory clauses, and stamp duty guidelines for Indian founders.",
    path: "/legal-templates",
    tag: "Contract Hub"
  }
];

export const companyGuideCards = [
  {
    title: "Private Limited Company",
    summary: "Best for scalable startups, equity funding, high credibility, and multiple co-founders.",
    highlights: ["Separate legal entity", "Easy equity allocation & ESOPs", "Preferred by VC & angel investors", "Corporate tax at 22% / 15% (new mfg)"],
    servicePath: "/services/private-limited-company"
  },
  {
    title: "Limited Liability Partnership (LLP)",
    summary: "Ideal for professional consulting firms, service agencies, and bootstrapped partnerships.",
    highlights: ["Limited liability protection", "No mandatory statutory audit if turnover < ₹40L", "Lower annual MCA compliance burden", "No dividend distribution tax"],
    servicePath: "/services/llp-registration"
  },
  {
    title: "One Person Company (OPC)",
    summary: "Designed for solo entrepreneurs seeking limited liability and a formal corporate identity.",
    highlights: ["Single promoter ownership", "Limited personal liability", "Nominee director required", "Can convert to Pvt Ltd later"],
    servicePath: "/services/one-person-company"
  },
  {
    title: "Sole Proprietorship",
    summary: "Quickest setup for individual freelancers, local traders, and early proof-of-concept ventures.",
    highlights: ["Minimal registration formalities", "Low operating cost", "Unlimited personal liability", "Taxed at individual slab rates"],
    servicePath: "/services/sole-proprietorship"
  }
];

export const companyComparisonMatrix = [
  { feature: "Governing Law", pvtLtd: "Companies Act, 2013", llp: "LLP Act, 2008", opc: "Companies Act, 2013", prop: "Common Law / Local Shops Act" },
  { feature: "Minimum Members", pvtLtd: "2 Shareholders / 2 Directors", llp: "2 Designated Partners", opc: "1 Member + 1 Nominee", prop: "1 Individual" },
  { feature: "Liability Protection", pvtLtd: "Limited to unpaid share capital", llp: "Limited to agreed contribution", opc: "Limited to shareholding", prop: "Unlimited personal liability" },
  { feature: "Statutory Audit", pvtLtd: "Mandatory every FY", llp: "Only if turnover > ₹40L or capital > ₹25L", opc: "Mandatory every FY", prop: "Only if tax audit limits breached" },
  { feature: "Taxation Rate", pvtLtd: "22% base + surcharge & cess (effective ~25.17%)", llp: "30% base + surcharge & cess", opc: "22% base + surcharge & cess", prop: "Individual Income Tax slab rates" },
  { feature: "Foreign Investment (FDI)", pvtLtd: "100% automatic route for most sectors", llp: "Allowed under automatic route in eligible sectors", opc: "Non-resident/FDI restricted", prop: "Not permitted" },
  { feature: "Annual ROC Filings", pvtLtd: "AOC-4 (Financials), MGT-7/7A (Annual Return), DIR-3 KYC", llp: "Form 11 (Annual Return), Form 8 (Solvency & Accounts)", opc: "AOC-4, MGT-7A, DIR-3 KYC", prop: "Nil ROC filings (only ITR/GST)" },
  { feature: "Fundraising & ESOPs", pvtLtd: "Full ESOP and preferred equity support", llp: "Profit share agreements only", opc: "Cannot issue ESOPs or equity shares", prop: "Not possible" }
];

export const legalTemplateCards = [
  {
    title: "Founders & Shareholder Agreements",
    summary: "Establish governing rules, equity vesting schedules, and dispute mechanisms among partners.",
    items: ["Shareholders' Agreement (SHA)", "Founders' Collaboration Agreement", "Share Subscription & Allotment Support"],
    servicePath: "/services/shareholders-agreement"
  },
  {
    title: "Employment & HR Documentation",
    summary: "Protect company IP, trade secrets, and define workplace obligations for employees and contractors.",
    items: ["Employment Agreement with IP Assignment", "Independent Contractor Agreement", "Company HR & Remote Work Policy"],
    servicePath: "/services/employment-agreement"
  },
  {
    title: "Commercial & Business Contracts",
    summary: "Standardize bilateral business arrangements, confidentiality boundaries, and vendor terms.",
    items: ["Non-Disclosure Agreement (NDA)", "Memorandum of Understanding (MOU)", "Service Level Agreement (SLA) & Vendor Contracts"],
    servicePath: "/services/nda-drafting"
  },
  {
    title: "Notices & Statutory Communications",
    summary: "Formal legal notices for contractual breaches, outstanding payment recovery, and dispute resolution.",
    items: ["Legal Demand Notice (Section 138 NI Act)", "Contractual Breach Notice", "Reply to Legal Notice & Dispute Memo"],
    servicePath: "/services/legal-notice"
  }
];

export const rocToolCards = [
  {
    title: "Private Limited Annual Filing",
    summary: "Mandatory annual statutory compliances for all active private limited companies in India.",
    items: ["Form AOC-4 (Financial Statements filing within 30 days of AGM)", "Form MGT-7 / MGT-7A (Annual Return filing within 60 days of AGM)", "Board Meetings & Annual General Meeting (AGM) Documentation"],
    servicePath: "/services/roc-annual-filing-pvt"
  },
  {
    title: "LLP Annual Compliance",
    summary: "Statutory annual returns and solvency declarations for Limited Liability Partnerships.",
    items: ["Form 11 (Annual Return due by May 30th every year)", "Form 8 (Statement of Account & Solvency due by October 30th)", "Partner Capital Contribution & Solvency Review"],
    servicePath: "/services/roc-annual-filing-llp"
  },
  {
    title: "Director KYC & DIN Compliance",
    summary: "Annual statutory validation of Director Identification Numbers to keep DIN status active.",
    items: ["DIR-3 KYC Web (Annual OTP verification for existing DINs)", "DIR-3 KYC Form (Documented e-KYC for updated details/passports)", "Director Appointment, Resignation (DIR-11/DIR-12) & Address Updates"],
    servicePath: "/services/din-ekyc"
  }
];

export const rocComplianceTimeline = [
  { form: "LLP Form 11", entity: "LLPs", deadline: "May 30 (60 days from FY end)", description: "Annual return containing partner details and business activities.", lateFee: "₹100 per day without upper ceiling" },
  { form: "DIR-3 KYC", entity: "All Directors & Designated Partners", deadline: "September 30", description: "Annual KYC validation for active DIN holders via mobile/email OTP.", lateFee: "₹5,000 one-time deactivation revival fee" },
  { form: "AOC-4", entity: "Private Limited / OPC", deadline: "October 29 (30 days from AGM)", description: "Balance Sheet, Profit & Loss Account, and Director's Report filing.", lateFee: "₹100 per day per form" },
  { form: "LLP Form 8", entity: "LLPs", deadline: "October 30 (30 days from 6 months of FY end)", description: "Statement of Accounts, Solvency, and Income/Expenditure declaration.", lateFee: "₹100 per day without upper ceiling" },
  { form: "MGT-7 / 7A", entity: "Private Limited / Small Companies", deadline: "November 28 (60 days from AGM)", description: "Annual return detailing shareholding structure and director meetings.", lateFee: "₹100 per day per form" }
];

export const trademarkChecklist = [
  "Shortlist 2 to 3 distinct, non-descriptive brand name variations before conducting search.",
  "Run Wordmark search using 'Start With', 'Contains', and 'Match With' operators on IP India.",
  "Perform Phonetic Search to identify similarly sounding marks regardless of spelling differences.",
  "Identify the exact Nice Classification classes (Classes 1-34 for Goods, Classes 35-45 for Services).",
  "Check public domain registrars and MCA company name databases to ensure cross-channel freedom.",
  "Review registered marks for identical phonetic roots or visual logos under the Vienna Classification.",
  "Evaluate potential objection risks under Section 9 (lack of distinctiveness) and Section 11 (prior identical marks)."
];

export const resourceFaqs = {
  gst: [
    {
      q: "What is the difference between GST inclusive and GST exclusive amounts?",
      a: "GST Exclusive means the base price does not include tax; GST is calculated on top of the base amount. GST Inclusive means the entered figure already includes the tax amount, and the calculator reverses out the base price using the formula: Base = Gross / (1 + Rate/100)."
    },
    {
      q: "How are CGST, SGST, and IGST calculated on an invoice?",
      a: "For intra-state sales (where supplier and buyer are in the same state), the applicable GST rate is split equally between CGST (Central GST) and SGST (State GST). For inter-state sales (supplier and buyer in different states), the full rate applies as IGST (Integrated GST)."
    },
    {
      q: "What are the standard GST slab rates in India?",
      a: "The standard GST rates in India are 0% (essential food & unprocessed items), 5% (basic necessities and economy passenger transport), 12% (standard goods, processed foods), 18% (most commercial services, industrial items, IT software), and 28% (luxury items, automobiles, and aerated beverages)."
    },
    {
      q: "When is GST registration mandatory for a business?",
      a: "GST registration is mandatory if annual turnover exceeds ₹40 lakh for businesses dealing exclusively in goods (₹20 lakh in special category states) or ₹20 lakh for service providers (₹10 lakh in special category states). It is also mandatory for e-commerce sellers, inter-state suppliers, and businesses liable under Reverse Charge Mechanism (RCM)."
    },
    {
      q: "What is the Reverse Charge Mechanism (RCM)?",
      a: "Under RCM, the liability to pay GST is shifted from the supplier to the recipient of goods or services. This applies to specific notified categories like goods transport agency (GTA) services, legal services by advocates, and director services to a company."
    },
    {
      q: "Can I claim Input Tax Credit (ITC) on all business purchases?",
      a: "ITC can be claimed on goods and services used in furtherance of business, provided the supplier has filed their GSTR-1, the tax appears in your GSTR-2B, and the expense is not blocked under Section 17(5) of the CGST Act (e.g., motor vehicles, food & beverages, personal consumption)."
    }
  ],
  incomeTax: [
    {
      q: "What are the revised New Tax Regime slabs for FY 2025-26 (AY 2026-27)?",
      a: "Under the revised New Tax Regime (Section 115BAC) for FY 2025-26 / AY 2026-27: Income up to ₹4,00,000 is taxed at Nil; ₹4,00,001 to ₹8,00,000 at 5%; ₹8,00,001 to ₹12,00,000 at 10%; ₹12,00,001 to ₹16,00,000 at 15%; ₹16,00,001 to ₹20,00,000 at 20%; ₹20,00,001 to ₹24,00,000 at 25%; and income above ₹24,00,000 at 30%."
    },
    {
      q: "How does the Section 87A rebate work under the New Tax Regime for FY 2025-26?",
      a: "For FY 2025-26, resident individuals with taxable income up to ₹12,00,000 receive a full rebate under Section 87A (up to ₹60,000), making their net tax liability zero. When combined with the ₹75,000 standard deduction for salaried individuals, gross salary income up to ₹12.75 lakh incurs zero income tax."
    },
    {
      q: "What is the Standard Deduction for salaried individuals in FY 2025-26?",
      a: "Under the New Tax Regime, the standard deduction for salaried individuals and pensioners is ₹75,000 (increased from ₹50,000 under the Finance Act 2024). Under the Old Tax Regime, the standard deduction remains ₹50,000."
    },
    {
      q: "Can I switch between the Old and New Tax Regimes every year?",
      a: "Salaried individuals without business or professional income can switch between the Old and New Regimes each financial year at the time of filing their ITR. However, individuals with business or professional income can switch to the Old Regime only once in a lifetime, and once opted back into the New Regime, cannot switch again."
    },
    {
      q: "Which deductions can I still claim under the Old Tax Regime?",
      a: "The Old Tax Regime allows Section 80C deductions (up to ₹1.5 lakh for EPF, PPF, ELSS, LIC, tuition fees), Section 80D (health insurance up to ₹25,000/₹50,000), House Rent Allowance (HRA) exemption, Leave Travel Allowance (LTA), and home loan interest under Section 24(b) (up to ₹2 lakh for self-occupied property)."
    },
    {
      q: "How is the 4% Health & Education Cess applied?",
      a: "A 4% Health and Education Cess is calculated on the total income tax payable (including applicable surcharge) after deducting all eligible Section 87A tax rebates."
    }
  ],
  roc: [
    {
      q: "What are the mandatory annual filings for a Private Limited Company?",
      a: "Every Private Limited Company must file Form AOC-4 (Financial Statements within 30 days of AGM), Form MGT-7 or MGT-7A (Annual Return within 60 days of AGM), and conduct annual DIR-3 KYC for all directors by September 30th."
    },
    {
      q: "What is the penalty for late filing of LLP Form 8 and Form 11?",
      a: "Under the LLP Act, delayed filing of Form 11 (Annual Return) or Form 8 (Statement of Account & Solvency) attracts a statutory penalty of ₹100 per day per form with no statutory upper limit until filed."
    },
    {
      q: "What happens if a director misses the September 30th DIR-3 KYC deadline?",
      a: "If DIR-3 KYC is not completed by September 30th, the MCA portal marks the DIN status as 'Deactivated due to non-filing of DIR-3 KYC'. To reactivate the DIN, the director must file the e-KYC form and pay a mandatory late fee of ₹5,000."
    },
    {
      q: "When must a newly incorporated company hold its first AGM?",
      a: "A newly incorporated company must hold its first Annual General Meeting (AGM) within 9 months from the closing of its first financial year. For subsequent years, the AGM must be held within 6 months from the close of the financial year (typically by September 30th)."
    }
  ],
  companyRegistration: [
    {
      q: "What is the difference between a Private Limited Company and an LLP?",
      a: "A Private Limited Company has share capital, can issue equity/ESOPs, has mandatory statutory audit, and is favored by investors. An LLP operates under a partnership deed, has lower compliance burdens, requires audit only if turnover exceeds ₹40L or capital exceeds ₹25L, but cannot raise venture equity or issue ESOPs."
    },
    {
      q: "What documents are required to register a company in India?",
      a: "Directors need PAN card, Aadhaar card/Passport/Voter ID, recent bank statement or electricity bill (less than 2 months old), passport-sized photos, and registered office address proof (utility bill, rent agreement, and landlord NOC)."
    },
    {
      q: "How long does it take to incorporate a Private Limited Company?",
      a: "With complete documentation and digital signature certificates (DSC) in order, MCA approval and Certificate of Incorporation (COI) along with PAN and TAN are typically issued in 3 to 7 working days via SPICe+ (INC-32)."
    },
    {
      q: "Can a foreigner or NRI be a director in an Indian company?",
      a: "Yes. Foreign nationals and NRIs can be directors in an Indian company, provided at least one director on the board is an Indian resident (who has stayed in India for at least 182 days during the financial year). Documents must be notarized and apostilled in the home country."
    }
  ],
  trademark: [
    {
      q: "Why is a trademark public search necessary before applying?",
      a: "A trademark search on the official IP India registry verifies whether an identical or phonetically similar mark is already registered or pending under the same or related class. This significantly reduces the risk of registry examination objections under Section 9 or Section 11 of the Trade Marks Act, 1999."
    },
    {
      q: "What is the difference between TM and ® symbols?",
      a: "The 'TM' symbol indicates that a trademark application has been filed and is pending registration. The '®' (Registered) symbol can legally only be used after the Trade Marks Registry has officially granted the Trademark Registration Certificate."
    },
    {
      q: "What is Nice Classification in trademark filing?",
      a: "The Nice Classification is an international system used to categorize goods and services into 45 distinct classes: Classes 1 to 34 cover physical goods and commodities, while Classes 35 to 45 cover services. Applying in the correct class ensures legal enforceability."
    },
    {
      q: "How long does trademark registration take in India?",
      a: "From filing Form TM-A to receiving the registration certificate typically takes 6 to 12 months if there are no examination objections or third-party oppositions during the 4-month advertisement period in the Trademark Journal."
    }
  ],
  legalTemplates: [
    {
      q: "What are the essential clauses in a Non-Disclosure Agreement (NDA)?",
      a: "Key clauses include definition of Confidential Information, exclusions from confidentiality (publicly available data, independently developed data), non-disclosure obligations, term of confidentiality (typically 2 to 5 years), permitted disclosures to advisors, governing law, and return/destruction of confidential materials."
    },
    {
      q: "Why do startup co-founders need a Founders' Agreement?",
      a: "A Founders' Agreement defines equity ownership splits, milestone-based vesting schedules (typically 4-year vesting with a 1-year cliff), roles and responsibilities, IP assignment to the entity, decision-making deadlock resolution, and exit/departure mechanisms."
    },
    {
      q: "Is stamp duty mandatory for business agreements in India?",
      a: "Yes. Under the Indian Stamp Act, 1899 and state-specific stamp acts, commercial agreements, NDAs, service contracts, and lease agreements must be executed on non-judicial stamp paper of appropriate value to be admissible as evidence in Indian courts."
    },
    {
      q: "What is the difference between an NDA and a Non-Compete clause?",
      a: "An NDA protects proprietary business data and trade secrets from being disclosed. A non-compete clause restricts a person from engaging in a competing business during or after an agreement; in India, post-employment non-compete restrictions are generally void under Section 27 of the Indian Contract Act, 1872."
    }
  ]
};
