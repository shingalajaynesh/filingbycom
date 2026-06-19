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
        <li><strong>Incorporation Certificate</strong> or partnership deed (for companies/partnerships).</li>
      </ol>

      <h2>Step-by-Step Online Application Process</h2>
      <p>The registration process is fully digitalized and completed on the official government GST portal (gst.gov.in):</p>
      <p><strong>Step 1: Generate TRN (Temporary Reference Number):</strong> Go to Services > Registration > New Registration. Enter basic details, verify mobile and email OTPs to get your TRN.</p>
      <p><strong>Step 2: Submit Part-B of Application:</strong> Log in with the TRN. Fill in the business details, promoter details, authorized signatory, principal place of business, goods/services description, and upload the required documents.</p>
      <p><strong>Step 3: Verification & ARN Generation:</strong> Submit the form using DSC (Digital Signature Certificate) or EVC (Aadhaar OTP). An Application Reference Number (ARN) is generated to track the status.</p>
      <p><strong>Step 4: Review by Officer:</strong> The GST officer reviews your application. If satisfied, your GSTIN (Goods and Services Tax Identification Number) and Registration Certificate (Form REG-06) will be granted within 3 to 7 working days. If queries arise, a clarification notice (REG-03) will be issued.</p>

      <h2>Conclusion</h2>
      <p>Getting registered for GST is the first step toward building a legally compliant and scalable business in India. At FilingBy, our dedicated CA/CS experts assist hundreds of founders daily to register their businesses online without visiting government offices.</p>
    `,
    metaTitle: "GST Registration Online India — Complete Step-by-Step Guide",
    metaDescription: "Step-by-step guide to GST registration in India. Find turnover limits, mandatory documents, landlord NOC details, and registration timeline. Expert-assisted by FilingBy.",
    keywords: "gst registration, how to apply for gst, gst registration documents, gst portal, gst registration threshold",
    category: "GST",
    tags: ["GST", "Taxation", "Compliance", "Startup Guide"],
    author: "FilingBy Legal Desk",
    readTime: 6,
    isPublished: true,
    publishedAt: new Date("2026-06-12T09:00:00.000Z") // 2026 (Recent)
  },
  {
    title: "How to Register a Private Limited Company in India: A Step-by-Step Overview",
    slug: "how-to-register-private-limited-company",
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

      <h2>Conclusion</h2>
      <p>Incorporating a company protects your personal assets and signals corporate maturity to clients and investors. Our team of experienced Chartered Accountants and Company Secretaries at FilingBy handle everything from DSC to COI registration, saving you weeks of paperwork.</p>
    `,
    metaTitle: "Pvt Ltd Company Registration India — Process, Costs & Guidelines",
    metaDescription: "Learn how to register a Private Limited (Pvt Ltd) company in India. Discover SPICe+ form process, DSC requirements, and minimum criteria for startups.",
    keywords: "pvt ltd registration, company incorporation india, spice form mca, start a startup, register company",
    category: "Company Registration",
    tags: ["Company", "Startup Setup", "Legal Compliance", "MCA"],
    author: "FilingBy Corporate Services Team",
    readTime: 8,
    isPublished: true,
    publishedAt: new Date("2025-10-15T11:30:00.000Z") // 2025
  },
  {
    title: "Virtual Office for GST Registration: Everything You Need to Know",
    slug: "virtual-office-for-gst-registration",
    excerpt: "Struggling to get a physical commercial lease for GST registration? Discover how a legal Virtual Office Address provides valid NOCs and utility bills to help you register.",
    content: `
      <h2>The Challenge of Physical Address Verification</h2>
      <p>For modern startups, e-commerce sellers, and service providers, renting a physical commercial office space is often an expensive and unnecessary burden. However, to obtain a GST registration or register a company in a state, the government requires proof of a physical registered address. This is where a Virtual Office becomes invaluable.</p>
      
      <h2>What is a Virtual Office?</h2>
      <p>A Virtual Office is a service that provides businesses with a professional, legal address in a prime commercial location without the high costs of renting physical desk space. You can use this address for corporate mailing, business card registration, and importantly, GST registration and company incorporation.</p>

      <h2>Is Virtual Office Legal for GST Registration in India?</h2>
      <p><strong>Yes, absolutely.</strong> Utilizing a virtual office for GST registration is 100% legal under Indian law, provided the service provider supplies the required statutory documents and the business owner maintains proper records.</p>
      <p>The GST department has strict verification rules, and to pass the registration check successfully, your virtual office provider must furnish:</p>
      <ul>
        <li><strong>Registered Rent/Lease Agreement</strong> between the property owner and your business entity.</li>
        <li><strong>No Objection Certificate (NOC)</strong> from the property owner stating they have no objection to your business registering at their premises.</li>
        <li><strong>Recent Utility Bill</strong> (electricity or municipal tax receipt) showing the property owner's name and matching the exact address format.</li>
      </ul>

      <h2>Core Deliverables from FilingBy Virtual Space</h2>
      <p>When you book a Virtual Space through FilingBy, we deliver complete compliant documents tailored to GST and ROC requirements:</p>
      <ol>
        <li><strong>Signage board</strong> placement at the physical location (crucial for unexpected physical inspections by GST officials).</li>
        <li><strong>Courier & mail handling:</strong> We receive your official mail and courier packs, scan them, and email them to you immediately.</li>
        <li><strong>Desk space support:</strong> Access to meeting rooms or temporary hot desks for audit verification visits.</li>
      </ol>

      <h2>Conclusion</h2>
      <p>FilingBy provides premium virtual offices in 28 states in India, allowing e-commerce traders to register in multiple warehouses, and remote agencies to operate from anywhere legally. Check out our Virtual Space options today starting from just ₹999/month!</p>
    `,
    metaTitle: "Is Virtual Office Legal for GST? Required Documents & FAQs",
    metaDescription: "Yes, virtual offices are legal for GST registration in India. Learn the necessary documents like Landlord NOC, Rent Agreement, and how FilingBy helps.",
    keywords: "virtual office for gst, gst registration address, virtual office rent agreement, noc landlord, e-commerce warehouse address",
    category: "Virtual Office",
    tags: ["Virtual Office", "GST Address", "Compliance", "E-commerce"],
    author: "FilingBy Virtual Office Desk",
    readTime: 5,
    isPublished: true,
    publishedAt: new Date("2024-11-20T14:00:00.000Z") // 2024
  },
  {
    title: "Income Tax Return (ITR) Filing: A Guide for Salaried Individuals",
    slug: "income-tax-return-filing-salaried-individuals",
    excerpt: "Filing your ITR can be stressful. Read this breakdown of ITR-1 requirements, slab rates, deductions, Form 16 verification, and deadline dates.",
    content: `
      <h2>Who Needs to File ITR?</h2>
      <p>Filing an Income Tax Return (ITR) is mandatory in India if your gross total income exceeds the basic exemption limit. For salaried individuals, filing your tax return is crucial for obtaining home loans, visa approvals, and claiming refund amounts on TDS.</p>
      
      <h2>ITR-1 (Sahaj) vs ITR-2: Which Form to Use?</h2>
      <p>Understanding which ITR form applies to you prevents defective filing notices from the Income Tax Department:</p>
      <ul>
        <li><strong>ITR-1 (Sahaj):</strong> For resident individuals who have income from salary/pension, one house property, other sources (interest, etc.), and agricultural income up to ₹5,000, with total income not exceeding ₹50 Lakhs.</li>
        <li><strong>ITR-2:</strong> For individuals having income exceeding ₹50 Lakhs, or holding directorships, capital gains from shares/property, or income from more than one house property.</li>
      </ul>

      <h2>Essential Documents Checklist for ITR Filing</h2>
      <ol>
        <li><strong>PAN and Aadhaar Cards:</strong> Must be linked as per current IT guidelines.</li>
        <li><strong>Form 16:</strong> Issued by your employer detailing taxable salary, exemptions (like HRA, LTA), and TDS deducted.</li>
        <li><strong>AIS (Annual Information Statement) & TIS:</strong> Documents showing all financial transactions, stock trades, dividend income, and interest earned.</li>
        <li><strong>Investment Proofs:</strong> Details of deductions under Section 80C (PPF, ELSS, LIC), 80D (Health Insurance), and Section 24 (Home Loan Interest).</li>
      </ol>

      <h2>Important Tax Saving Deductions</h2>
      <p>Under the Old Tax Regime, you can reduce taxable income using the following sections:</p>
      <p><strong>Section 80C:</strong> Deductions up to ₹1.5 Lakhs for investments in PPF, EPF, ELSS mutual funds, and Principal repayment of home loans.</p>
      <p><strong>Section 80D:</strong> Deductions up to ₹25,000 for self/family health insurance premiums (₹50,000 if parents are senior citizens).</p>
      <p><strong>Section 80CCD(1B):</strong> Additional deduction up to ₹50,000 for contributions to National Pension System (NPS).</p>

      <h2>Conclusion</h2>
      <p>Filing before the annual July 31st deadline avoids late fees under Section 234F and interest charges on outstanding tax. FilingBy's tax experts check your Form 16 against AIS details, ensuring you maximize deductions safely.</p>
    `,
    metaTitle: "ITR-1 Filing Guide for Salaried Employees — Deadlines & Exemption Rules",
    metaDescription: "A comprehensive guide to filing ITR-1 Sahaj for salaried individuals in India. Learn about Form 16, salary tax slabs, and Section 80C/80D deductions.",
    keywords: "itr filing, salary tax return, form 16, income tax exemptions, tax slab rates, file taxes online",
    category: "General",
    tags: ["ITR Filing", "Income Tax", "Tax Saving", "Salaried Class"],
    author: "FilingBy Tax Desk",
    readTime: 5,
    isPublished: true,
    publishedAt: new Date("2023-07-10T10:00:00.000Z") // 2023
  },
  {
    title: "LLP vs Private Limited Company: Which is Better for Your Startup?",
    slug: "llp-vs-private-limited-company",
    excerpt: "Deciding between a Limited Liability Partnership (LLP) and a Pvt Ltd Company? Learn key differences in incorporation costs, compliance, and funding.",
    content: `
      <h2>Understanding Business Structures in India</h2>
      <p>Choosing the right business entity structure affects your startup's ability to raise capital, manage taxes, and stay compliant. For teams of founders, the choices usually narrow down to a Limited Liability Partnership (LLP) or a Private Limited (Pvt Ltd) Company.</p>
      
      <h2>Comparison Metrics</h2>
      <table border="1" cellpadding="5" style="border-collapse: collapse; margin-bottom: 20px; width:100%;">
        <tr style="background-color: #f3f4f6;">
          <th>Feature</th>
          <th>LLP (Limited Liability Partnership)</th>
          <th>Pvt Ltd (Private Limited Company)</th>
        </tr>
        <tr>
          <td><strong>Ownership</strong></td>
          <td>Partners hold capital and management roles.</td>
          <td>Shareholders own shares; Board of Directors manages operations.</td>
        </tr>
        <tr>
          <td><strong>VC Funding</strong></td>
          <td>Rarely funded by VCs. Capital transfer requires deed changes.</td>
          <td>Preferred by VCs. Easy transfer of shares to investors.</td>
        </tr>
        <tr>
          <td><strong>Compliance Load</strong></td>
          <td>Low. Audit only required if turnover > ₹40 Lakhs or contribution > ₹25 Lakhs.</td>
          <td>Moderate to High. Statutory Audit is mandatory from year one.</td>
        </tr>
        <tr>
          <td><strong>Tax on Profit</strong></td>
          <td>30% + surcharge. No dividend distribution tax.</td>
          <td>Base rate of 15% or 22% for new entities. Dividends are taxed.</td>
        </tr>
      </table>

      <h2>When to Choose an LLP?</h2>
      <p>An LLP is ideal for small businesses, professional service providers (like consulting agencies, CAs, lawyers), and bootstrapped startups who do not require external venture capital. It offers limited liability protection with lower operational compliance and registration overheads.</p>

      <h2>When to Choose a Private Limited Company?</h2>
      <p>A Pvt Ltd structure is mandatory if you plan to pitch to Venture Capitalists, raise external equity, allocate ESOPs to employees, or scale globally. The corporate framework is recognized globally and enables clear ownership division.</p>

      <h2>Conclusion</h2>
      <p>If scaling and venture funding is your target, go with a Private Limited structure. If simplicity and lower administrative costs are what you need, register as an LLP. At FilingBy, we help you incorporate either structure 100% online.</p>
    `,
    metaTitle: "LLP vs Pvt Ltd Company — Startup Incorporation Comparison",
    metaDescription: "LLP or Private Limited? Compare the key differences in registration costs, annual compliance, tax slabs, and VC fundraising criteria in India.",
    keywords: "llp vs pvt ltd, limited liability partnership, register company india, vc funding startup, company registration comparison",
    category: "Company Registration",
    tags: ["LLP", "Company Incorporation", "Startup Guide", "Corporate Law"],
    author: "FilingBy Corporate Law Experts",
    readTime: 7,
    isPublished: true,
    publishedAt: new Date("2022-09-18T08:15:00.000Z") // 2022
  },
  {
    title: "Trademark Registration in India: Process, Timeline & Pricing",
    slug: "trademark-registration-india",
    excerpt: "Protect your brand name, logo, or slogan from duplication. Read our guide on Trademark search, classification classes, TM filing, and examination replies.",
    content: `
      <h2>Why Register a Trademark?</h2>
      <p>Your brand name, logo, or catchphrase represents your identity and goodwill. Trademark registration grants you exclusive legal ownership of your brand assets, allowing you to sue duplicate copycats and establish franchise credibility.</p>
      
      <h2>Step 1: Conduct a Trademark Search</h2>
      <p>Before submitting an application, perform a search on the Intellectual Property India database. Your mark must not match any existing registered trademarks in your business industry classes (e.g. Class 9 for software, Class 25 for apparel).</p>

      <h2>Step 2: Submitting Form TM-A</h2>
      <p>File the trademark application online. Once submitted, you can immediately begin using the <strong>™</strong> symbol next to your brand name, indicating that your application is pending review.</p>

      <h2>Step 3: Trademark Examination & Objection</h2>
      <p>A trademark examiner reviews your application to ensure it is not descriptive, offensive, or matching a registered brand. If they find issues, they issue a <strong>Trademark Objection</strong> under Section 9 or Section 11, requiring a legal written reply within 30 days.</p>

      <h2>Step 4: Publication in TM Journal</h2>
      <p>Once accepted by the examiner, the trademark is advertised in the official Trademark Journal for 4 months, allowing third parties to register any oppositions.</p>

      <h2>Step 5: Registration Certificate</h2>
      <p>If no oppositions are filed, the Registrar of Trademarks grants you the Registration Certificate. You can then legally use the registered <strong>®</strong> symbol next to your brand. A trademark is valid for 10 years and is renewable indefinitely.</p>

      <h2>Conclusion</h2>
      <p>Securing your brand early prevents competitors from stealing your name. FilingBy handles complete trademark applications, including professional search reports and attorney-assisted filings, starting at competitive prices.</p>
    `,
    metaTitle: "Online Trademark Registration India — Process, Search & Classes",
    metaDescription: "Step-by-step procedure for online Trademark registration in India. Learn about brand name searches, TM classes, objection replies, and registry fees.",
    keywords: "trademark registration, brand logo search, trademark classes india, tm journal, ipr trademark",
    category: "General",
    tags: ["Trademark", "IPR", "Brand Security", "Legal Protection"],
    author: "FilingBy IP Desk",
    readTime: 6,
    isPublished: true,
    publishedAt: new Date("2021-04-10T15:45:00.000Z") // 2021 (5 Years Ago)
  },
  {
    title: "How to Reply to a GST Notice: Types of Notices & Practical Steps",
    slug: "how-to-reply-gst-notice",
    excerpt: "Received a notice from the GST department? Learn about common causes, tax mismatch notices (GSTR-1 vs 3B), and how to draft a valid response.",
    content: `
      <h2>The Scrutiny under GST law</h2>
      <p>With tax automation, the GST department frequently issues system-generated notices to taxpayers for mismatch checks or document clarifications. Receiving a notice is common and can be resolved easily by submitting a timely, valid reply.</p>
      
      <h2>Common Types of GST Notices</h2>
      <ul>
        <li><strong>GSTR-1 vs GSTR-3B Mismatch:</strong> Notice issued when the liability declared in outward supplies (GSTR-1) does not match the actual tax paid (GSTR-3B).</li>
        <li><strong>ITC Mismatch (GSTR-3B vs GSTR-2B):</strong> Notice checking excess Input Tax Credit claimed compared to what suppliers auto-populated in GSTR-2B.</li>
        <li><strong>Non-filing Notices:</strong> Issued under Section 46 when a taxpayer fails to submit GSTR-3B or annual GSTR-9 returns on time.</li>
        <li><strong>Cancellation Notices:</strong> Issued if the taxpayer has not filed returns for six consecutive months or if address verification fails.</li>
      </ul>

      <h2>Step-by-Step Response Strategy</h2>
      <p><strong>Step 1: Check the Notice Details:</strong> Locate the DIN (Document Identification Number) on the official GST portal to verify if the notice is genuine. Identify the sections, deadline date, and mismatch values.</p>
      <p><strong>Step 2: Collect Supporting Evidence:</strong> Reconcile sales books against tax returns. If it is an ITC mismatch, gather purchase invoices and payment proofs to prove the transactions were genuine.</p>
      <p><strong>Step 3: Draft Your Response:</strong> Write a professional, point-by-point reply explaining the differences (e.g. typos, timing differences). Attach invoice tables and calculation sheets.</p>
      <p><strong>Step 4: Upload Response:</strong> Log in to the GST Portal, go to Services > User Services > View Additional Notices, and upload your written reply in PDF format along with supporting excel reconciliations.</p>

      <h2>Conclusion</h2>
      <p>Ignoring a GST notice leads to tax penalties, interest accruals, or the freezing of your GSTIN registration. At FilingBy, our senior tax consultants review your notice, perform complete book reconciliations, and draft a response reply to satisfy tax audits.</p>
    `,
    metaTitle: "How to Reply to GST Notice Online — Reconciliation & Mismatch Tips",
    metaDescription: "Step-by-step instructions to reply to GST notices for GSTR-1, 3B, or 2B ITC mismatches. Avoid penalties and account suspensions with expert CA support.",
    keywords: "gst notice reply, tax mismatch notice, input tax credit reconciliation, portal gst notice, tax compliance audit",
    category: "GST",
    tags: ["GST Notice", "Tax Audit", "Compliance", "Tax Resolution"],
    author: "FilingBy Tax & Audit Desk",
    readTime: 7,
    isPublished: true,
    publishedAt: new Date("2023-12-05T09:30:00.000Z") // 2023
  },
  {
    title: "FSSAI Food License Guide: Registration Categories, Documents & Fees",
    slug: "fssai-food-license-registration",
    excerpt: "Operating a restaurant, catering company, or e-commerce food brand? Read our breakdown of Basic, State, and Central FSSAI license criteria.",
    content: `
      <h2>The Importance of Food Safety Registration</h2>
      <p>The Food Safety and Standards Authority of India (FSSAI) regulates food safety and distribution. Every food business operator (FBO) in India — including manufacturers, cloud kitchens, grocery stores, restaurants, and import exporters — must obtain an FSSAI registration or license before starting operations.</p>
      
      <h2>FSSAI License Categories & Eligibility</h2>
      <ol>
        <li><strong>FSSAI Basic Registration:</strong> For petty food manufacturers, retailers, and cloud kitchens with an annual turnover of up to ₹12 Lakhs.</li>
        <li><strong>FSSAI State License:</strong> For mid-sized restaurants, caterers, and manufacturers with an annual turnover between ₹12 Lakhs and ₹20 Crores.</li>
        <li><strong>FSSAI Central License:</strong> Mandatory for large-scale manufacturers, importers, exporters, government office caterers, and food businesses with an annual turnover exceeding ₹20 Crores.</li>
      </ol>

      <h2>Documents Needed for FSSAI Registration</h2>
      <ul>
        <li>PAN and Aadhaar card of the proprietor or directors.</li>
        <li>Proof of address of the food processing unit (NOC, Rent Agreement, Utility Bill).</li>
        <li>Layout plan of the food manufacturing or preparation area (for state/central licenses).</li>
        <li>Water test analysis report and list of manufacturing equipment (for state/central licenses).</li>
      </ul>

      <h2>Benefits of Displaying the FSSAI Logo</h2>
      <p>Displaying your 14-digit FSSAI license number on food packaging and menu cards boosts buyer trust, qualifies you to list on delivery platforms like Zomato and Swiggy, and ensures you pass local food inspector checks without penalties.</p>

      <h2>Conclusion</h2>
      <p>Operating a food business without an FSSAI license invites severe financial penalties. FilingBy helps you process your FSSAI registration and license certificates online, ensuring you are compliant to launch your food brand quickly.</p>
    `,
    metaTitle: "FSSAI Food License Registration India — Categories, Fees & Documents",
    metaDescription: "FSSAI Food safety license guide in India. Understand basic registration, state licenses, central licenses, Swiggy/Zomato listing requirements.",
    keywords: "fssai registration, food safety license india, basic fssai registration, state food license, fssai renewal online",
    category: "General",
    tags: ["FSSAI", "Food License", "Food safety", "Business Startup"],
    author: "FilingBy Food Licensing Team",
    readTime: 6,
    isPublished: true,
    publishedAt: new Date("2024-03-24T10:00:00.000Z") // 2024
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
