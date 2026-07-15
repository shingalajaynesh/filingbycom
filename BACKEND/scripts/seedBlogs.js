import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import BlogPost from "../src/models/BlogPost.model.js";

dotenv.config();

const samplePosts = [
  {
    title: "GST Registration Guide: Requirements, Process & Timeline",
    slug: "gst-registration-guide",
    seoTitle: "GST Registration Online India: Complete Step-by-Step Guide",
    seoDescription: "Secure your GSTIN online. Learn turnover limits, documents needed, step-by-step instructions, and CA representation timelines.",
    focusKeyword: "gst registration online",
    secondaryKeywords: ["gstin registration", "documents for gst", "gst turnover limit"],
    searchIntent: "Commercial / Informational",
    category: "GST",
    subCategory: "Registration",
    author: "FilingBy Legal Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "12 mins",
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    imageAlt: "GST registration process checklist",
    excerpt: "Learn how to obtain GST registration in India, including documents required, turnover thresholds, step-by-step registration process, and timeline.",
    content: `
      <h2>Introduction to GST Registration</h2>
      <p>The Goods and Services Tax (GST) is an indirect tax applied to the supply of goods and services in India. GST registration is mandatory for businesses whose turnover exceeds the specified limits, or for those engaged in interstate sales or e-commerce trading.</p>
      
      <h2>Who is Mandatory Required to Register for GST?</h2>
      <p>Under the GST regime, businesses must register if they fall under any of the following categories:</p>
      <ul>
        <li><strong>Turnover Limit:</strong> Service providers with aggregate turnover exceeding ₹20 Lakhs (₹10 Lakhs for special category states) and goods suppliers exceeding ₹40 Lakhs (₹20 Lakhs for special category states).</li>
        <li><strong>Interstate Businesses:</strong> Any business making sales across state borders must register, regardless of turnover.</li>
        <li><strong>E-commerce Sellers:</strong> Individuals selling goods through e-commerce portals like Amazon, Flipkart, or Meesho.</li>
        <li><strong>Casual Taxable Persons:</strong> Individuals occasionally supplying goods or services in a state where they don't have a fixed place of business.</li>
      </ul>

      <h2>Key Documents Required for GST Registration</h2>
      <p>Before applying online on the GST portal, make sure you keep the following documents scanned and ready:</p>
      <ol>
        <li><strong>PAN Card</strong> of the applicant or business entity.</li>
        <li><strong>Aadhaar Card</strong> of the promoter/proprietor/directors.</li>
        <li><strong>Proof of Business Address:</strong> Utility bill (electricity, water, landline), property tax receipt, or municipal khata copy.</li>
        <li><strong>Proof of Address Occupancy:</strong> If rented, a registered Rent Agreement along with a No Objection Certificate (NOC) from the landlord. If owned, proof of ownership.</li>
        <li><strong>Bank Account Proof:</strong> A cancelled cheque, bank statement, or passbook copy showing bank name, account holder name, and IFSC code.</li>
      </ol>

      <h2>Step-by-Step Online Application Process</h2>
      <p>The registration process is fully digitalized and completed on the official government GST portal (gst.gov.in):</p>
      <p><strong>Step 1: Generate TRN (Temporary Reference Number):</strong> Go to Services > Registration > New Registration. Enter basic details, verify mobile and email OTPs to get your TRN.</p>
      <p><strong>Step 2: Submit Part-B of Application:</strong> Log in with the TRN. Fill in the business details, promoter details, authorized signatory, principal place of business, goods/services description, and upload the required documents.</p>
      <p><strong>Step 3: Verification & ARN Generation:</strong> Submit the form using DSC (Digital Signature Certificate) or EVC (Aadhaar OTP). An Application Reference Number (ARN) is generated to track the status.</p>
      <p><strong>Step 4: Review by Officer:</strong> The GST officer reviews your application. If satisfied, your GSTIN (Goods and Services Tax Identification Number) and Registration Certificate (Form REG-06) will be granted within 3 to 7 working days. If queries arise, a clarification notice (REG-03) will be issued.</p>
    `,
    faq: [
      { q: "Is Aadhaar authentication mandatory for GST?", a: "Yes, Aadhaar authentication is mandatory for quick approval without physical site audits." }
    ],
    relatedServices: ["gst-registration", "gst-filing"],
    relatedCalculators: ["/gst-calculator"],
    relatedTemplates: ["rent-agreement"],
    internalLinks: ["/hubs/gst"],
    cta: "Get GST Registration with CA Assistance",
    isPublished: true
  },
  {
    title: "How to Register a Private Limited Company in India: A Step-by-Step Overview",
    slug: "how-to-register-private-limited-company",
    seoTitle: "Pvt Ltd Company Registration India — Process, Costs & Guidelines",
    seoDescription: "Learn how to register a Private Limited (Pvt Ltd) company in India. Discover SPICe+ form process, DSC requirements, and minimum criteria for startups.",
    focusKeyword: "register a private limited company",
    secondaryKeywords: ["pvt ltd incorporation", "company registration online", "spice form mca"],
    searchIntent: "Transactional / Informational",
    category: "Company Setup",
    subCategory: "Registration",
    author: "FilingBy Legal Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "15 mins",
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Private limited company incorporation files",
    excerpt: "Ready to start your company? This guide details the step-by-step procedure to incorporate a Private Limited (Pvt Ltd) Company in India through SPICe+.",
    content: `
      <h2>Why Register a Private Limited Company?</h2>
      <p>A Private Limited (Pvt Ltd) Company is the most popular corporate structure for startups and growing businesses in India. It offers key advantages such as limited liability protection, legal separate existence, easy transfer of shares, and high credibility among venture capitalists and banks.</p>
      
      <h2>Minimum Requirements for Pvt Ltd Incorporation</h2>
      <ul>
        <li><strong>Directors:</strong> Minimum of 2 directors (at least one must be a resident in India).</li>
        <li><strong>Shareholders:</strong> Minimum of 2 shareholders (can be the same as directors).</li>
        <li><strong>Registered Office:</strong> A physical address in India to act as the registered office of the company.</li>
        <li><strong>Capital:</strong> No minimum capital requirement. You can start with as little as ₹10,000 capital.</li>
      </ul>

      <h2>Step-by-Step Incorporation Journey (SPICe+ Portal)</h2>
      <p>The Ministry of Corporate Affairs (MCA) has simplified incorporation via the integrated web form <strong>SPICe+</strong> (Simplified Proforma for Incorporating Company Electronically Plus).</p>
      
      <h3>Step 1: Obtain Digital Signature Certificates (DSC)</h3>
      <p>Since the application is signed and filed digitally, all proposed directors must obtain a class-3 Digital Signature Certificate (DSC).</p>

      <h3>Step 2: Reserve the Company Name (RUN - Spice+ Part A)</h3>
      <p>Submit up to two proposed names in order of preference. The name must be unique, not clash with existing company/LLP names, and not infringe on active trademarks.</p>

      <h3>Step 3: Draft MOA & AOA</h3>
      <p>Draft the Memorandum of Association (MOA) which defines the company's core objects, and the Articles of Association (AOA) which define its internal rules and regulations.</p>

      <h3>Step 4: File SPICe+ Part B</h3>
      <p>Provide details of director identification (DIN), registered office address, share capital division, and apply for PAN, TAN, EPFO, ESIC, and Profession Tax registration in a single integrated submission.</p>

      <h3>Step 5: Get Certificate of Incorporation (COI)</h3>
      <p>MCA processes the application. Once approved, the Registrar of Companies (ROC) issues the Certificate of Incorporation (COI) along with the PAN and TAN numbers.</p>
    `,
    faq: [
      { q: "What is the minimum capital required to start a Pvt Ltd?", a: "There is no statutory minimum capital requirement; you can incorporate with an authorized capital starting at ₹10,000." }
    ],
    relatedServices: ["private-limited-company", "llp-registration"],
    relatedCalculators: ["/calculators/depreciation"],
    relatedTemplates: ["nda", "board-resolution"],
    internalLinks: ["/hubs/company"],
    cta: "Incorporate Your Pvt Ltd Company Online",
    isPublished: true
  },
  {
    title: "Trademark Registration Guide: Brand and Logo Protection in India",
    slug: "trademark-registration-india",
    seoTitle: "Trademark Registration India Online: Complete Step-by-Step CA Guide",
    seoDescription: "Secure your brand name and logo. Learn trademark search guidelines, NICE classes, dynamic application steps, and objection replies.",
    focusKeyword: "trademark registration india",
    secondaryKeywords: ["brand name protection", "logo registration online", "nice class lookup"],
    searchIntent: "Transactional",
    category: "Trademark",
    subCategory: "Registration",
    author: "FilingBy Intellectual Property Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "10 mins",
    featuredImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Trademark registration brand filing",
    excerpt: "Learn how to secure trademark protection for your company name, logo, or tagline in India. Discover NICE classification details and search guidelines.",
    content: `
      <h2>The Importance of Trademark Registration</h2>
      <p>A trademark is a unique symbol, design, word, or phrase that distinguishes your goods or services from competitors. Registering your trademark grants exclusive usage rights and prevents third parties from copying your brand identity.</p>
      
      <h2>Steps to Apply for a Trademark Online</h2>
      <p>The trademark registration is administered by the Office of the Controller General of Patents, Designs and Trade Marks:</p>
      <ul>
        <li><strong>Step 1: Trademark Search:</strong> Run a detailed search on the official IP India registry database to check if similar active marks exist.</li>
        <li><strong>Step 2: Class Selection:</strong> Select from 45 NICE classes (Classes 1 to 34 for goods; Classes 35 to 45 for services) representing your industry.</li>
        <li><strong>Step 3: Application Submission:</strong> File Form TM-A online with details of the applicant, trademark type, and user date (whether the mark is already in use or proposed to be used).</li>
        <li><strong>Step 4: Examination & Objection:</strong> The registrar examines the application. If found clashing under Section 9 or 11, an examination report is issued, requiring a reply within 30 days.</li>
        <li><strong>Step 5: Advertisement & Registration:</strong> Once accepted, the mark is advertised in the Trademark Journal for 4 months. If no opposition is filed, the registration certificate is issued.</li>
      </ul>
    `,
    faq: [
      { q: "How long is a trademark registration valid?", a: "A registered trademark is valid for 10 years from the date of filing and can be renewed indefinitely every 10 years." }
    ],
    relatedServices: ["trademark-registration", "trademark-objection"],
    relatedCalculators: ["/trademark-search"],
    relatedTemplates: ["nda"],
    internalLinks: ["/hubs/trademark"],
    cta: "Apply for Trademark Registration Now",
    isPublished: true
  },
  {
    title: "Income Tax Return (ITR) Filing Guide: Steps & Due Dates for AY 2026-27",
    slug: "income-tax-filing-ay-2026-27",
    seoTitle: "ITR Filing Online India: Step-by-Step Direct Tax Guide",
    seoDescription: "Step-by-step guide to filing your Income Tax Return (ITR) online. Find correct ITR forms, tax saving deductions, and penalty rules.",
    focusKeyword: "income tax filing online",
    secondaryKeywords: ["itr due date", "tax exemption 80c", "new tax regime vs old"],
    searchIntent: "Informational",
    category: "Tax",
    subCategory: "Filing",
    author: "FilingBy Tax Consulting Panel",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "14 mins",
    featuredImage: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Income tax filing return files",
    excerpt: "Need to file your income tax returns? This guide breaks down ITR-1 to ITR-6 forms, tax saving deductions, and the compliance calendar for AY 2026-27.",
    content: `
      <h2>Introduction to Income Tax Returns</h2>
      <p>Under the Income Tax Act, 1961, filing income tax returns (ITR) is mandatory for individuals, partners, and corporate firms whose income exceeds the basic exemption thresholds. It serves as legal proof of income and is essential for securing home loans and visas.</p>
      
      <h2>Guide to ITR Forms Selection</h2>
      <ul>
        <li><strong>ITR-1 (Sahaj):</strong> For resident individuals having salary income, one house property, and interest income (up to ₹50 Lakhs).</li>
        <li><strong>ITR-2:</strong> For individuals and HUFs not having business/professional income (covers capital gains, multiple house properties).</li>
        <li><strong>ITR-3:</strong> For individuals and HUFs having income from proprietary business or profession.</li>
        <li><strong>ITR-4 (Sugam):</strong> For individuals, HUFs, and partnership firms opting for presumptive taxation under Sec 44AD/44ADA.</li>
      </ul>
    `,
    faq: [
      { q: "What is the penalty for filing ITR after the due date?", a: "Late fee of ₹5,000 applies under Section 234F, reduced to ₹1,000 if total income is below ₹5 Lakhs." }
    ],
    relatedServices: ["itr-filing", "tax-audit"],
    relatedCalculators: ["/income-tax-calculator", "/calculators/hra"],
    relatedTemplates: ["salary-slip"],
    internalLinks: ["/hubs/tax"],
    cta: "File Your ITR Online with CA Guidance",
    isPublished: true
  },
  {
    title: "LLP vs Private Limited Company: Complete Business Comparison",
    slug: "llp-vs-private-limited-company",
    seoTitle: "LLP or Private Limited Company Comparison India — Which is Better?",
    seoDescription: "Detailed comparison between Limited Liability Partnership (LLP) and Private Limited Company (Pvt Ltd) to choose your startup structure.",
    focusKeyword: "llp vs private limited company",
    secondaryKeywords: ["llp compared to pvt ltd", "incorporation costs", "startups structure"],
    searchIntent: "Commercial",
    category: "Company Setup",
    subCategory: "Comparison",
    author: "FilingBy Corporate Legal Team",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "11 mins",
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Co-founders comparing business legal structures",
    excerpt: "Understand the key differences between a Limited Liability Partnership (LLP) and a Private Limited Company regarding compliance, funding, and ownership.",
    content: `
      <h2>The Core Difference</h2>
      <p>Both LLP and Pvt Ltd structures offer limited liability protection to their members. However, they target different startup trajectories. LLPs are governed under the LLP Act 2008, while Private Limited Companies are regulated under the Companies Act 2013.</p>
    `,
    faq: [
      { q: "Which has a lower compliance burden?", a: "LLPs have lower compliance costs and do not require mandatory audits unless turnover exceeds ₹40 Lakhs or capital contribution exceeds ₹25 Lakhs." }
    ],
    relatedServices: ["private-limited-company", "llp-registration"],
    relatedCalculators: ["/calculators/depreciation"],
    relatedTemplates: ["nda"],
    internalLinks: ["/compare/private-limited-company-vs-llp"],
    cta: "Compare and Register Your Business Online",
    isPublished: true
  },
  {
    title: "FSSAI Food License Guide: Categories, Documents & Compliance",
    slug: "fssai-food-license-registration",
    seoTitle: "FSSAI Food License Registration India Online — Guide",
    seoDescription: "Secure your food business safety license. Understand Basic, State, and Central FSSAI criteria and Swiggy/Zomato onboarding requirements.",
    focusKeyword: "fssai food license online",
    secondaryKeywords: ["food safety certificate", "state food license", "fssai renewal"],
    searchIntent: "Transactional",
    category: "Licensing",
    subCategory: "FSSAI",
    author: "FilingBy Food safety Panel",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "9 mins",
    featuredImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Restaurant kitchen food safety audit checklist",
    excerpt: "Operating a restaurant, cloud kitchen, or e-commerce food brand? Read our breakdown of Basic, State, and Central FSSAI license criteria.",
    content: `
      <h2>Food Safety Registrations in India</h2>
      <p>FSSAI registration is a mandatory safety certificate required for all food business operators (FBO) in India. The licensing tier depends on business turnover and manufacturing capacity.</p>
    `,
    faq: [
      { q: "Is FSSAI mandatory for cloud kitchens?", a: "Yes, every kitchen selling food online via Swiggy/Zomato must possess an active FSSAI registration." }
    ],
    relatedServices: ["fssai-registration", "gst-registration"],
    relatedCalculators: ["/gst-calculator"],
    relatedTemplates: ["rent-agreement"],
    internalLinks: ["/hubs/gst"],
    cta: "Apply for FSSAI Licensing with FilingBy",
    isPublished: true
  },
  {
    title: "Startup India Recognition: Eligibility & Tax Exemption Benefits",
    slug: "startup-india-recognition-benefits",
    seoTitle: "DPIIT Startup India Recognition & Tax Relief Guide",
    seoDescription: "Register under DPIIT Startup India scheme to claim 80-IAC tax tax exemptions, patent cost rebates, and public tender relaxations.",
    focusKeyword: "startup india recognition",
    secondaryKeywords: ["dpiit registration benefits", "80iac tax exemption", "startup funding eligibility"],
    searchIntent: "Informational",
    category: "Company Setup",
    subCategory: "Startup India",
    author: "FilingBy Startup Incubator Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "12 mins",
    featuredImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Startup founders planning business growth",
    excerpt: "Learn how to register under the DPIIT Startup India scheme to access tax holidays, compliance self-certifications, and easy winding-up benefits.",
    content: `
      <h2>What is DPIIT Recognition?</h2>
      <p>The Department for Promotion of Industry and Internal Trade (DPIIT) manages the Startup India program. Eligible companies can apply online to claim corporate advantages.</p>
    `,
    faq: [
      { q: "Is a partnership firm eligible for Startup India?", a: "Yes, registered partnership firms, LLPs, and Private Limited Companies are eligible, provided they are under 10 years old from incorporation." }
    ],
    relatedServices: ["private-limited-company", "llp-registration"],
    relatedCalculators: ["/calculators/depreciation"],
    relatedTemplates: ["nda"],
    internalLinks: ["/hubs/company"],
    cta: "Register Your Startup Under DPIIT Scheme",
    isPublished: true
  },
  {
    title: "MSME Udyam Registration Guide: Benefits & Online Steps",
    slug: "msme-udyam-registration-guide",
    seoTitle: "MSME Udyam Registration Online: Complete Government Benefits Guide",
    seoDescription: "Get your MSME certificate online. Learn capital thresholds, interest rate concessions, and delayed payment protections.",
    focusKeyword: "msme udyam registration",
    secondaryKeywords: ["udyam certificate online", "msme lending rates", "delayed payment protection"],
    searchIntent: "Transactional",
    category: "Licensing",
    subCategory: "MSME",
    author: "FilingBy MSME Help Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "8 mins",
    featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Small scale business unit factory",
    excerpt: "Want to secure priority bank loans and government subsidy schemes? Obtain your MSME Udyam registration certificate in a few easy steps.",
    content: `
      <h2>The MSME Classification</h2>
      <p>Micro, Small, and Medium Enterprises (MSMEs) are classified based on investment in plant/machinery and turnover limits. The registration is completely paperless and linked to Aadhaar.</p>
    `,
    faq: [
      { q: "What is the key benefit of MSME certificate?", a: "Protection against delayed payments (buyers must clear dues within 45 days) and collateral-free bank loans." }
    ],
    relatedServices: ["msme-registration", "gst-registration"],
    relatedCalculators: ["/gst-calculator"],
    relatedTemplates: ["rent-agreement"],
    internalLinks: ["/hubs/gst"],
    cta: "Get MSME Udyam Registration Certificate",
    isPublished: true
  },
  {
    title: "Import Export Code (IEC) Registration Guide: Steps & Fees",
    slug: "import-export-code-iec-guide",
    seoTitle: "IEC Import Export Code Online India: Complete DGFT Guide",
    seoDescription: "Apply for your Import Export Code online. Read required documents, customs clearances, and lifetime validity guidelines.",
    focusKeyword: "import export code registration",
    secondaryKeywords: ["iec code application", "dgft portal online", "customs registration documents"],
    searchIntent: "Transactional",
    category: "Licensing",
    subCategory: "Import Export",
    author: "FilingBy Cross-Border Compliance Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "9 mins",
    featuredImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Shipping containers at sea port terminal",
    excerpt: "Planning to trade globally? Obtain your 10-digit Import Export Code (IEC) from the Director General of Foreign Trade (DGFT) online.",
    content: `
      <h2>The Role of IEC in Global Trade</h2>
      <p>An Import Export Code (IEC) is a primary registration required by custom authorities to clear shipments and receive bank transfers from foreign accounts.</p>
    `,
    faq: [
      { q: "Does the IEC require annual renewals?", a: "The IEC has lifetime validity, but holders must update their details on the DGFT portal annually between April and June." }
    ],
    relatedServices: ["iec-registration", "gst-registration"],
    relatedCalculators: ["/gst-calculator"],
    relatedTemplates: ["rent-agreement"],
    internalLinks: ["/hubs/gst"],
    cta: "Apply for Import Export Code Online",
    isPublished: true
  },
  {
    title: "Professional Tax (PT) in India: State-Wise Slabs & Filings",
    slug: "professional-tax-india-slabs",
    seoTitle: "Professional Tax (PT) Registration & State Slab Rates",
    seoDescription: "Complete guide to professional tax registration, state slab structures (Maharashtra, Karnataka, Gujarat), and employee payroll deductions.",
    focusKeyword: "professional tax registration",
    secondaryKeywords: ["pt slab rates", "payroll deductions compliance", "professional tax returns"],
    searchIntent: "Informational",
    category: "Tax",
    subCategory: "Professional Tax",
    author: "FilingBy Payroll Services Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "10 mins",
    featuredImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    imageAlt: "HR office managing employee payroll taxes",
    excerpt: "Understand the state-level professional tax compliance rules for employers, salary deduction slabs, and due dates.",
    content: `
      <h2>What is Professional Tax?</h2>
      <p>Professional Tax is a state-level tax levied on salaried employees and professionals. Employers must register, deduct PT from salary payments, and deposit it with the state treasury.</p>
    `,
    faq: [
      { q: "Is professional tax mandatory in all Indian states?", a: "No, states like Delhi, Haryana, and Rajasthan do not levy professional tax." }
    ],
    relatedServices: ["pt-registration", "itr-filing"],
    relatedCalculators: ["/income-tax-calculator", "/calculators/tds"],
    relatedTemplates: ["salary-slip"],
    internalLinks: ["/hubs/tax"],
    cta: "Get Professional Tax Registration Online",
    isPublished: true
  },
  {
    title: "EPFO & ESIC Employer Registration: Compliance & Slabs",
    slug: "epfo-esic-employer-registration",
    seoTitle: "EPF and ESIC Employer Registration Online Compliance Guide",
    seoDescription: "Obtain EPF & ESIC employer registration. Learn threshold employee counts, contribution percentages, and filing timelines.",
    focusKeyword: "epfo esic registration",
    secondaryKeywords: ["epf contribution slabs", "esic employee insurance", "payroll compliance registration"],
    searchIntent: "Transactional",
    category: "Licensing",
    subCategory: "Labor Law",
    author: "FilingBy Employee Welfare Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "11 mins",
    featuredImage: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Co-workers working in corporate business office",
    excerpt: "Expanding your payroll? Learn the mandatory employee limits for EPF and ESIC registration and monthly contribution percentages.",
    content: `
      <h2>The Core Labor Codes</h2>
      <p>The Employees Provident Fund (EPF) and Employees State Insurance (ESI) protect employee retirement savings and healthcare options in India.</p>
    `,
    faq: [
      { q: "What is the employee threshold for mandatory EPF registration?", a: "EPF registration is mandatory once a business employs 20 or more workers." }
    ],
    relatedServices: ["epf-registration", "pt-registration"],
    relatedCalculators: ["/income-tax-calculator"],
    relatedTemplates: ["salary-slip", "employment-agreement"],
    internalLinks: ["/hubs/tax"],
    cta: "Register for EPFO and ESIC Online",
    isPublished: true
  },
  {
    title: "Section 8 NGO Registration: Process & Trust Exemptions",
    slug: "section-8-ngo-registration-guide",
    seoTitle: "Section 8 Company Registration India: NGO Setup Guide",
    seoDescription: "Step-by-step procedure to incorporate a Section 8 NGO company. Read 12A/80G tax benefits, licenses, and MCA rules.",
    focusKeyword: "section 8 company registration",
    secondaryKeywords: ["ngo incorporation online", "80g tax exemptions", "mca charity licensing"],
    searchIntent: "Transactional",
    category: "Company Setup",
    subCategory: "Section 8",
    author: "FilingBy Charitable Trust Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "13 mins",
    featuredImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Volunteers working at charitable NGO shelter",
    excerpt: "Incorporate a Section 8 company for charitable, educational, or religious promotion to claim 12A and 80G direct tax exemptions.",
    content: `
      <h2>The Section 8 Entity</h2>
      <p>A Section 8 company is incorporated under the Companies Act 2013 to promote art, science, education, charity, or environmental protection, where profits are strictly reinvested.</p>
    `,
    faq: [
      { q: "Can a Section 8 company pay dividends?", a: "No, Section 8 companies are strictly prohibited from paying dividends to directors or shareholders." }
    ],
    relatedServices: ["section-8-company", "private-limited-company"],
    relatedCalculators: ["/calculators/depreciation"],
    relatedTemplates: ["board-resolution", "nda"],
    internalLinks: ["/hubs/company"],
    cta: "Incorporate a Section 8 NGO Online",
    isPublished: true
  },
  {
    title: "One Person Company (OPC) Registration: Setup Criteria",
    slug: "one-person-company-opc-incorporation",
    seoTitle: "OPC One Person Company Registration India Online Guide",
    seoDescription: "Learn how to register a One Person Company (OPC) in India. Understand nominee criteria, tax structures, and compliance limits.",
    focusKeyword: "one person company registration",
    secondaryKeywords: ["opc incorporation online", "nominee requirements", "sole proprietorship vs opc"],
    searchIntent: "Transactional",
    category: "Company Setup",
    subCategory: "OPC",
    author: "FilingBy Corporate Advisory Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "11 mins",
    featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Single business founder workspace desk office",
    excerpt: "Start your solo venture with limited liability corporate credibility. Discover the nominee requirements and tax rules of One Person Companies.",
    content: `
      <h2>Solo Entrepreneurship with Limited Liability</h2>
      <p>An OPC allows a single promoter to incorporate a separate corporate entity while protecting personal assets, unlike a traditional Sole Proprietorship.</p>
    `,
    faq: [
      { q: "Is a nominee mandatory for an OPC?", a: "Yes, you must nominate another individual who will assume management of the company in the event of the founder's death or incapacity." }
    ],
    relatedServices: ["one-person-company", "private-limited-company"],
    relatedCalculators: ["/calculators/depreciation"],
    relatedTemplates: ["board-resolution", "nda"],
    internalLinks: ["/compare/llp-registration-vs-one-person-company"],
    cta: "Register Your One Person Company Online",
    isPublished: true
  },
  {
    title: "TDS Payment Slabs & Schedulers: Section-Wise Filing Guide",
    slug: "tds-payments-deposits-sections",
    seoTitle: "TDS Section-Wise Tax Rates, Deposits & Return Guidelines",
    seoDescription: "Understand TDS sections (194C, 194J, 194I) under the Income Tax Act. Learn deposit timelines and quarterly return deadlines.",
    focusKeyword: "tds registration online",
    secondaryKeywords: ["tds section rates", "form 26q filing", "tan tax registration"],
    searchIntent: "Informational",
    category: "Tax",
    subCategory: "TDS",
    author: "FilingBy Direct Tax Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "12 mins",
    featuredImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Tax expert reviews professional billing ledger",
    excerpt: "Learn how to deduct and deposit TDS under the Income Tax Act. Discover due dates for Form 24Q, 26Q, and Section rates.",
    content: `
      <h2>The Concept of TDS</h2>
      <p>Tax Deducted at Source (TDS) ensures income tax collection at the source of transaction. Payers must deduct tax, deposit it with the government monthly, and file quarterly returns.</p>
    `,
    faq: [
      { q: "What is the due date to deposit monthly TDS?", a: "TDS deducted must be deposited to the government treasury by the 7th of the following calendar month." }
    ],
    relatedServices: ["tan-registration", "itr-filing"],
    relatedCalculators: ["/calculators/tds", "/income-tax-calculator"],
    relatedTemplates: ["salary-slip"],
    internalLinks: ["/hubs/tax"],
    cta: "Manage Your TDS Returns with CA Panel",
    isPublished: true
  },
  {
    title: "HRA Tax Exemption Calculation Guide: Save on Salary Income",
    slug: "hra-exemption-calculation-guide",
    seoTitle: "HRA Exemption Calculation Guide (Section 10(13A))",
    seoDescription: "Learn how to calculate House Rent Allowance (HRA) exemptions under old tax regimes. Discover landlord PAN and rent receipt rules.",
    focusKeyword: "calculate hra exemption",
    secondaryKeywords: ["hra tax exemption rules", "metro city basic salary", "landlord pan requirement"],
    searchIntent: "Informational",
    category: "Tax",
    subCategory: "HRA",
    author: "FilingBy Employee Tax Panel",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "10 mins",
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Rented house keys on rental agreement contract",
    excerpt: "Claiming house rent allowance? Discover the three tax rules to maximize your HRA exemptions and decrease your net taxable salaries.",
    content: `
      <h2>HRA Exemption Criteria</h2>
      <p>Taxpayers renting accommodation can claim HRA tax relief under Section 10(13A) of the Income Tax Act. The calculation depends on salary, HRA component, and actual rent paid.</p>
    `,
    faq: [
      { q: "Is landlord PAN mandatory to claim HRA?", a: "Yes, if your annual rent payments exceed ₹1 Lakh, you must submit the landlord's PAN to your employer." }
    ],
    relatedServices: ["itr-filing", "pt-registration"],
    relatedCalculators: ["/calculators/hra", "/income-tax-calculator"],
    relatedTemplates: ["rent-agreement", "salary-slip"],
    internalLinks: ["/hubs/tax"],
    cta: "Calculate and Claim HRA Tax Exemptions",
    isPublished: true
  },
  {
    title: "Asset Depreciation Slabs: WDV vs SLM Calculation Rules",
    slug: "depreciation-rates-wdv-slm-rules",
    seoTitle: "Asset Depreciation Rates (Companies Act & Income Tax Act)",
    seoDescription: "Understand tax depreciation rates. Learn difference between Written Down Value (WDV) and Straight Line Method (SLM) for capital assets.",
    focusKeyword: "calculate asset depreciation",
    secondaryKeywords: ["depreciation rates tax", "wdv method depreciation", "useful asset life companies act"],
    searchIntent: "Informational",
    category: "Tax",
    subCategory: "Depreciation",
    author: "FilingBy Audits & Valuations Desk",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "11 mins",
    featuredImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Capital machinery assets inside factory unit",
    excerpt: "Compute company asset depreciation values. Read WDV vs SLM methods, and matching rates under Companies Act Schedule II.",
    content: `
      <h2>The Meaning of Depreciation</h2>
      <p>Depreciation accounts for asset wear and tear over time. For tax purposes, WDV is preferred. For corporate books, SLM based on asset useful life is standard.</p>
    `,
    faq: [
      { q: "Which depreciation method is mandatory for tax filings?", a: "The Income Tax Act 1961 mandates the Written Down Value (WDV) method for computing tax depreciation deductions." }
    ],
    relatedServices: ["tax-audit", "private-limited-company"],
    relatedCalculators: ["/calculators/depreciation", "/income-tax-calculator"],
    relatedTemplates: ["board-resolution"],
    internalLinks: ["/hubs/tax"],
    cta: "Calculate Company Asset Depreciation Rates",
    isPublished: true
  },
  {
    title: "Trademark Objection Reply Guide: Sections 9 & 11 Objections",
    slug: "trademark-objection-reply-section-9",
    seoTitle: "How to File Trademark Objection Reply (Section 9/11) India",
    seoDescription: "Step-by-step guide to drafting and submitting a trademark objection reply online. Learn common arguments to resolve registry blocks.",
    focusKeyword: "trademark objection reply",
    secondaryKeywords: ["section 9 absolute grounds", "section 11 relative grounds", "trademark examination report"],
    searchIntent: "Transactional",
    category: "Trademark",
    subCategory: "Objection",
    author: "FilingBy Trademark Attorneys",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "12 mins",
    featuredImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Trademark attorney review legal drafts court gavel",
    excerpt: "Received a trademark examination report? Learn how to draft and file a professional reply to Section 9 and Section 11 objections within 30 days.",
    content: `
      <h2>Receiving an Objection Notice</h2>
      <p>A trademark objection occurs when the examiner queries your mark under Section 9 (lacks distinctiveness) or Section 11 (matches existing brands). You must upload a written reply in 30 days.</p>
    `,
    faq: [
      { q: "What happens if I miss the 30-day objection deadline?", a: "If you fail to submit a reply within 30 days of report generation, the registry abandons your trademark application." }
    ],
    relatedServices: ["trademark-objection", "trademark-registration"],
    relatedCalculators: ["/trademark-search"],
    relatedTemplates: ["nda"],
    internalLinks: ["/hubs/trademark"],
    cta: "File a Professional Trademark Objection Reply",
    isPublished: true
  },
  {
    title: "Commercial Rent Agreement Drafting: Clauses & Validation",
    slug: "commercial-rent-agreement-drafting",
    seoTitle: "How to Draft a Commercial Rent Agreement for GST & Offices",
    seoDescription: "Learn standard terms of commercial rental agreements. Read lock-in periods, security deposits, and GST registration requirements.",
    focusKeyword: "draft commercial rent agreement",
    secondaryKeywords: ["stamp paper denomination", "registered rent lease", "noc property utility"],
    searchIntent: "Transactional",
    category: "Licensing",
    subCategory: "Documentation",
    author: "FilingBy Real Estate Lawyers",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "10 mins",
    featuredImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Signing commercial property rent agreement lease contract",
    excerpt: "Setting up your physical office or virtual space? Understand the mandatory lease clauses, security deposit lock-ins, and stamp paper denominations.",
    content: `
      <h2>The Legal Lease Framework</h2>
      <p>A Rent Agreement defines landlord and tenant commitments. For businesses, a valid rent agreement on stamp paper accompanied by a utility bill and NOC is essential to register for GST.</p>
    `,
    faq: [
      { q: "Is registration mandatory for an 11-month lease?", a: "Under the Registration Act 1908, lease agreements for up to 11 months do not require mandatory registration with sub-registrars." }
    ],
    relatedServices: ["gst-registration", "virtual-space"],
    relatedCalculators: ["/gst-calculator"],
    relatedTemplates: ["rent-agreement"],
    internalLinks: ["/hubs/gst"],
    cta: "Draft Your Commercial Rent Agreement Now",
    isPublished: true
  },
  {
    title: "Non-Disclosure Agreement (NDA) Guide: Startup IP Protection",
    slug: "nda-agreement-startup-protection",
    seoTitle: "Non-Disclosure Agreement (NDA) Drafting Guidelines for Startups",
    seoDescription: "Protect your intellectual property. Learn key clauses of mutual and one-way NDAs, confidentiality terms, and stamp duty validations.",
    focusKeyword: "draft nda agreement",
    secondaryKeywords: ["mutual non disclosure contract", "confidentiality breach penalties", "protect startup ip"],
    searchIntent: "Transactional",
    category: "Licensing",
    subCategory: "Documentation",
    author: "FilingBy Intellectual Property Lawyers",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "9 mins",
    featuredImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Sealed legal business contracts on corporate desk",
    excerpt: "Sharing code or financial data with potential partners? Draft a legally binding Non-Disclosure Agreement (NDA) to secure your startup secrets.",
    content: `
      <h2>Why NDAs are Essential</h2>
      <p>NDAs restrict business partners, employees, and consultants from disclosing trade secrets, proprietary software, and client ledgers without written consent.</p>
    `,
    faq: [
      { q: "Which stamp paper is required for NDA in India?", a: "NDAs are generally executed on non-judicial stamp paper of ₹100 or ₹200 denomination, varying by state laws." }
    ],
    relatedServices: ["private-limited-company", "trademark-registration"],
    relatedCalculators: ["/trademark-search"],
    relatedTemplates: ["nda"],
    internalLinks: ["/hubs/company"],
    cta: "Get Custom NDA Drafted by Legal Team",
    isPublished: true
  },
  {
    title: "ROC Annual Filings AOC-4 & MGT-7: Company Compliance Schedulers",
    slug: "roc-annual-filings-aoc4-mgt7",
    seoTitle: "ROC Annual Return Filings AOC-4 & MGT-7 Guide",
    seoDescription: "Avoid late penalties on ROC filings. Complete guide to Form AOC-4 (financial sheets) and MGT-7 (annual return) schedules for companies.",
    focusKeyword: "roc annual filing online",
    secondaryKeywords: ["form aoc4 balance sheets", "form mgt7 annual returns", "mca corporate compliance calendar"],
    searchIntent: "Informational",
    category: "Company Setup",
    subCategory: "ROC",
    author: "FilingBy Company Secretaries (CS)",
    reviewedBy: "Hiren Patel (FCA)",
    lastUpdated: new Date("2026-07-15"),
    readingTime: "12 mins",
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Auditor reviewing corporate financial accounting balance sheets",
    excerpt: "Keep your Pvt Ltd company active. Read the due dates, audit requirements, and director validation steps for AOC-4 and MGT-7 returns.",
    content: `
      <h2>The Mandatory ROC Annual Cycle</h2>
      <p>Every active company registered under the MCA must file annual returns. Delay in uploads attracts daily penalty fees and risks disqualifying directors.</p>
    `,
    faq: [
      { q: "What is the due date to file Form AOC-4?", a: "Form AOC-4 must be filed within 30 days of the company's Annual General Meeting (AGM)." }
    ],
    relatedServices: ["private-limited-company", "llp-registration"],
    relatedCalculators: ["/calculators/depreciation"],
    relatedTemplates: ["board-resolution"],
    internalLinks: ["/hubs/company"],
    cta: "Manage Your Company ROC Filings with CA Panel",
    isPublished: true
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for blog seeding...");

    // Clean up any existing blog posts to start fresh
    await BlogPost.deleteMany({});
    console.log("Cleared existing blog posts.");

    // Seed blogs
    const seeded = await BlogPost.insertMany(samplePosts);
    console.log(`Successfully seeded ${seeded.length} blog posts!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
