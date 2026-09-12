/**
 * Authoritative, practitioner-level content for FilingBy's 14 Core Indexable Services.
 * Shared directly by both React runtime (ServicePage.jsx) and Node prerender pipeline (prerender.js)
 * ensuring 100% content parity between raw crawler HTML and hydrated browser DOM.
 */

export const CORE_SERVICES_CONTENT = {
  "gst-registration": {
    name: "GST Registration",
    category: "GST Services",
    basePrice: 999,
    h1: "GST Registration Online India — New GSTIN Application Guide",
    metaTitle: "GST Registration Online India | Apply New GSTIN | FilingBy",
    metaDescription: "Apply for GST registration online in India. Check turnover thresholds by state, Section 24 exemptions, e-commerce rules, required documents, and Form REG-01 steps.",
    metaKeywords: "gst registration online, apply new gstin, gst threshold india, form gst reg-01, turnover limit for gst, voluntary gst registration",
    overview: `
      <p>GST Registration is the statutory tax registration under Sections 22 through 25 of the Central Goods and Services Tax (CGST) Act, 2017. For exclusive suppliers of goods, the general threshold is ₹40 Lakhs (under Notification No. 10/2019-Central Tax), but this limit is subject to state adoption: specified special category states (Manipur, Mizoram, Nagaland, Tripura) operate at ₹10 Lakhs, while states like Telangana, Puducherry, Uttarakhand, Meghalaya, and Sikkim apply ₹20 Lakhs. The ₹40 Lakh limit also does not apply to inter-state supplies or specified manufacturing categories.</p>
      <p>For service providers, the registration threshold is ₹20 Lakhs (₹10 Lakhs in specified special category states). Crucially, under Notification No. 10/2017-Integrated Tax, service providers supplying inter-state services are exempt from mandatory Section 24 registration if their aggregate turnover remains within the applicable threshold.</p>
      <p>Suppliers selling through electronic commerce operators (ECOs) are subject to nuanced rules: service providers through ECOs are exempt below the turnover threshold (Notification No. 65/2017-CT), Section 9(5) services place liability directly on the ECO, and eligible intra-state goods suppliers with turnover below threshold may operate with an enrollment number (Notification No. 34/2023-CT). Compulsory registration applies under Section 24 to non-exempt inter-state goods suppliers, casual taxable persons, input service distributors, and persons liable under reverse charge (RCM). Voluntary registration is open to any business seeking to pass on Input Tax Credit (ITC).</p>
    `,
    statutoryInfo: {
      governingAct: "Central Goods and Services Tax (CGST) Act, 2017",
      sections: "Sections 22, 23, 24 & 25; Rules 8-10 of CGST Rules; Notif. 10/2019-CT, 10/2017-IT",
      portal: "Official GSTN Portal (gst.gov.in)",
      statutoryFee: "₹0 (Zero official government fee; FilingBy charges flat advisory fee)"
    },
    documentsRequired: [
      "PAN Card of the Business Entity / Proprietor / Partners / Directors",
      "Aadhaar Card of Proprietor / Authorized Signatories (Mobile linked for OTP verification)",
      "Proof of Business Premises: Commercial Rent Agreement + Landlord NOC + Electricity Bill (< 2 months old)",
      "Bank Account Proof: Cancelled Cheque or Bank Statement showing Name, Account Number, and IFSC",
      "Passport size photograph of the Proprietor / Managing Partner / Directors",
      "Constitution Proof: Partnership Deed (for firms) or Certificate of Incorporation + MOA/AOA (for companies)",
      "Letter of Authorization or Board Resolution appointing the primary Authorized Signatory"
    ],
    processSteps: [
      "Profile Creation & TRN Generation: Submission of basic PAN, mobile, and email details in Part A of Form GST REG-01 to generate a Temporary Reference Number (TRN).",
      "Form REG-01 Part B Compilation: Entering trade name, constitution details, HSN/SAC classifications, business premises proofs, and bank credentials.",
      "Aadhaar OTP Authentication: Completing Aadhaar-based e-KYC authentication of the primary authorized signatory to expedite automated approval.",
      "ARN Tracking & Officer Verification: Generation of Application Reference Number (ARN); jurisdictional tax officer verification (replying to Form REG-03 clarification notice if issued within statutory timelines).",
      "Certificate Grant: Issuance of 15-digit GSTIN and formal Registration Certificate in Form GST REG-06."
    ],
    benefits: [
      "Legal Authorization to Collect Indirect Tax from Customers across India",
      "Seamless Input Tax Credit (ITC) Pass-Through on B2B Purchases and Expenses",
      "Access to National Marketplace Onboarding and B2B Vendor Panels",
      "Inter-State Commercial Expansion and Eligibility for Public Tenders"
    ],
    faqs: [
      {
        q: "What are the turnover thresholds for GST registration in India?",
        a: "For exclusive suppliers of goods, the threshold is ₹40 Lakhs in states that adopted Notification No. 10/2019-CT, but ₹20 Lakhs in states like Telangana, Puducherry, Uttarakhand, Meghalaya, and Sikkim, and ₹10 Lakhs in Manipur, Mizoram, Nagaland, and Tripura. For service providers, the threshold is ₹20 Lakhs generally and ₹10 Lakhs in specified special category states."
      },
      {
        q: "Does an interstate service provider need compulsory GST registration below the threshold?",
        a: "No. While Section 24(i) generally mandates registration for inter-state suppliers, the Government issued Notification No. 10/2017-Integrated Tax exempting persons supplying inter-state services whose aggregate turnover does not exceed ₹20 Lakhs (₹10 Lakhs in specified special category states) from compulsory registration."
      },
      {
        q: "Is GST registration mandatory for everyone selling through e-commerce operators?",
        a: "No, the rule depends on supply nature and notifications. Service providers selling through ECOs are exempt if turnover is below the ₹20L/₹10L threshold (Notification No. 65/2017-CT). For goods, Notification No. 34/2023-CT exempts small intra-state sellers with turnover below the threshold from mandatory registration if they obtain an enrollment number on the GST portal."
      },
      {
        q: "How long does the GST registration process take on the GSTN portal?",
        a: "Under the CGST Rules, applications with successful Aadhaar authentication where no query is raised are typically approved by the system within 3 to 7 working days. If the tax officer issues a clarification notice (Form REG-03), the applicant must reply within 7 working days via Form REG-04, after which the officer has 7 working days to process."
      }
    ]
  },

  "gst-return-filing": {
    name: "GST Return Filing",
    category: "GST Services",
    basePrice: 6999,
    h1: "GST Return Filing Online India — Monthly & Quarterly GSTR Compliance",
    metaTitle: "GST Return Filing Online India | Monthly GSTR-1 & 3B | FilingBy",
    metaDescription: "Professional monthly and quarterly GST return filing in India. GSTR-1 sales upload, GSTR-2B / IMS ITC reconciliation, GSTR-3B tax payment, and due date compliance.",
    metaKeywords: "gst return filing online, gstr-1 due date, gstr-3b due date, itc reconciliation gstr-2b ims, qrmp scheme, gst late fee section 47",
    overview: `
      <p>GST Return Filing is the recurring statutory obligation under Sections 37, 39, and 44 of the CGST Act, 2017 for registered taxpayers to report outward supplies, reconcile eligible Input Tax Credit (ITC), and remit net indirect tax liabilities to the government.</p>
      <p>Filing frequency and due dates depend on taxpayer classification:
        <br/><strong>Monthly Filers:</strong> Form GSTR-1 (statement of outward supplies) is generally due by the 11th of the succeeding month, and Form GSTR-3B (summary return and tax payment) is generally due by the 20th of the succeeding month.
        <br/><strong>QRMP / Quarterly Filers:</strong> Eligible taxpayers with annual turnover up to ₹5 Crore opting for the Quarterly Return Monthly Payment (QRMP) scheme file GSTR-1 by the 13th of the month following the quarter (with optional Invoice Furnishing Facility - IFF by the 13th in months 1 and 2), while quarterly GSTR-3B is due on the 22nd or 24th of the month following the quarter depending on the state/UT of registration.
        <br/><em>Note: Due dates can be extended by government notification; users should verify the current GST portal due date for the relevant tax period.</em>
      </p>
    `,
    statutoryInfo: {
      governingAct: "Central Goods and Services Tax (CGST) Act, 2017",
      sections: "Section 16(2)(aa) (ITC Eligibility), Section 37 (GSTR-1), Section 39 (GSTR-3B), Section 47 (Late Fees)",
      portal: "Official GSTN Portal (gst.gov.in)",
      statutoryFee: "Section 47 late fee: ₹50/day (regular) or ₹20/day (nil return), capped statutorily"
    },
    documentsRequired: [
      "Monthly / Quarterly Sales Register detailing B2B and B2C outward supply invoices with HSN/SAC breakdowns",
      "Purchase Register / Inward Invoices to perform electronic reconciliation against GSTR-2B and IMS",
      "Credit Notes, Debit Notes, and Advance Adjustments issued during the tax period",
      "Previous tax period GSTR-3B Filing Acknowledgement and Electronic Cash/Credit Ledger statements",
      "Export Invoices with Shipping Bills / Bill of Export details and LUT confirmation (if applicable)",
      "Bank Account Statements reflecting statutory tax payments and vendor settlement transactions"
    ],
    processSteps: [
      "Sales & Purchase Register Ingestion: Aggregating outward invoices and matching inward purchase registers against system-generated GSTR-2B and IMS records.",
      "ITC Reconciliation under Section 16(2)(aa): Reconciling purchase records and available ITC with system-generated Form GSTR-2B / Invoice Management System (IMS) information and current Section 16 eligibility conditions.",
      "Form GSTR-1 / IFF Preparation & Filing: Uploading outward invoice data by the statutory due date (generally 11th for monthly filers, 13th for quarterly filers).",
      "Tax Liability Computation & Ledger Offset: Computing net CGST, SGST, and IGST liabilities after offsetting eligible ITC from the electronic credit ledger.",
      "GSTR-3B Submission & Payment Verification: Filing summary return Form GSTR-3B by the applicable due date (20th for monthly; 22nd or 24th for quarterly) and generating ARN."
    ],
    benefits: [
      "Prevents GSTIN Suspension and Automated E-Way Bill Blocking under Rule 138E",
      "Ensures Compliant Input Tax Credit (ITC) Recovery Aligned with Section 16(2)(aa) and IMS",
      "Maintains High GST Compliance Rating and Minimizes Departmental Mismatch Notices",
      "Smooth B2B Client Onboarding by Providing Prompt Customer GSTR-1 Tax Pass-Through"
    ],
    faqs: [
      {
        q: "What are the statutory due dates for GSTR-1 and GSTR-3B?",
        a: "For monthly filers, GSTR-1 is generally due by the 11th of the following month, and GSTR-3B is generally due by the 20th. For QRMP quarterly filers, GSTR-1 is generally due by the 13th of the month following the quarter, and GSTR-3B is due on the 22nd or 24th of the month following the quarter depending on the state/UT. Due dates can be extended by government notification; verify on the GST portal."
      },
      {
        q: "How does ITC reconciliation work under current GST rules?",
        a: "Under Section 16(2)(aa) of the CGST Act, Input Tax Credit can only be claimed if the invoice or debit note has been furnished by the supplier in their GSTR-1/IFF and communicates to the recipient in auto-generated Form GSTR-2B. Taxpayers use GSTR-2B and the GST portal Invoice Management System (IMS) to verify, accept, or flag supplier invoices before filing GSTR-3B."
      },
      {
        q: "What late fees are levied for delayed GST return filing?",
        a: "Under Section 47 of the CGST Act, delay in filing GSTR-3B attracts a statutory late fee of ₹50 per day (₹25 CGST + ₹25 SGST) for returns with tax liability, and ₹20 per day for Nil returns, subject to statutory maximum caps based on turnover. Interest at 18% per annum is also charged on net cash tax liability under Section 50."
      },
      {
        q: "What happens if GST returns are not filed for consecutive periods?",
        a: "Non-filing of GST returns for consecutive tax periods triggers automated blocking of E-Way Bill generation under Rule 138E. Continued non-filing can lead to suspension and suo-moto cancellation of GSTIN by the jurisdictional tax authority under Section 29 read with Rule 21."
      }
    ]
  },

  "private-limited-company": {
    name: "Private Limited Company",
    category: "Company Registration",
    basePrice: 6999,
    h1: "Private Limited Company Registration Online India — MCA SPICe+ Guide",
    metaTitle: "Private Limited Company Registration Online India | SPICe+ MCA | FilingBy",
    metaDescription: "Incorporate a Private Limited Company in India via MCA SPICe+ (INC-32). Check director requirements, DIN, DSC, MOA, AOA, COI timelines, and transparent fees.",
    metaKeywords: "private limited company registration india, pvt ltd incorporation mca, spice+ inc-32, din dsc moa aoa, certificate of incorporation coi, pvt ltd cost india",
    overview: `
      <p>A Private Limited Company is India's most popular corporate business structure governed by the Companies Act, 2013 and administered by the Ministry of Corporate Affairs (MCA). A Pvt Ltd entity offers limited liability protection to shareholders, separate legal entity status, perpetual succession, and the ability to raise venture capital through equity share issuance.</p>
      <p>Incorporation is executed through the MCA V3 integrated SPICe+ (INC-32) framework, combining name reservation, Director Identification Number (DIN) allocation, incorporation, and post-incorporation registrations into a unified digital submission.</p>
    `,
    statutoryInfo: {
      governingAct: "Companies Act, 2013",
      sections: "Section 3, 7 & 8; Companies (Incorporation) Rules, 2014",
      portal: "Ministry of Corporate Affairs (mca.gov.in)",
      statutoryFee: "Zero MCA fee for SPICe+ up to ₹15 Lakh nominal capital; state stamp duty applicable"
    },
    documentsRequired: [
      "PAN Card of all proposed Directors and Shareholders (Mandatory for Indian nationals)",
      "Identity Proof: Aadhaar Card, Passport, or Voter ID of all Directors and Shareholders",
      "Address Proof of Directors: Bank Account Statement, Electricity Bill, or Mobile Bill (< 2 months old)",
      "Passport size photographs of all Directors and Shareholders",
      "Registered Office Address Proof: Electricity Bill, Gas Bill, or Property Tax Receipt (< 2 months old)",
      "No-Objection Certificate (NOC) signed by property owner and Commercial Rent Agreement",
      "Specimen Signatures and Class-3 Digital Signature Certificates (DSC) for all directors"
    ],
    processSteps: [
      "Name Reservation (SPICe+ Part A): Applying for company name approval on the MCA V3 portal ensuring adherence to Rule 8 of Companies (Incorporation) Rules.",
      "Class-3 DSC Procurement: Generating cryptographic Digital Signature Certificates for all proposed directors for signing electronic forms.",
      "Integrated SPICe+ Part B Filing: Compiling corporate bylaws, share capital structure, director declarations, and registered office details.",
      "Electronic MOA & AOA Execution: Drafting and digitally signing e-MOA (Form INC-33) with object clauses and e-AOA (Form INC-34) with internal governance rules.",
      "AGILE-PRO-S Linked Registrations: Integrated processing for PAN, TAN, EPFO, ESIC, Professional Tax (where applicable), and corporate bank account opening.",
      "Certificate of Incorporation (COI): ROC review and issuance of COI containing Corporate Identification Number (CIN), permanent PAN, and TAN."
    ],
    benefits: [
      "Limited Liability Protection Shielding Shareholders' Personal Assets",
      "Preferred Vehicle for Venture Capital, Angel Funding, and ESOP Allocation",
      "Independent Legal Corporate Entity with Unbroken Perpetual Succession",
      "Enhanced Brand Credibility with Domestic and Multinational Corporate Clients"
    ],
    faqs: [
      {
        q: "What are the minimum requirements to incorporate a Private Limited Company?",
        a: "A Private Limited Company requires a minimum of 2 directors, 2 shareholders (directors can also be shareholders), and a registered office address in India. At least one director must be an Indian resident (stayed in India for >= 182 days in the preceding financial year)."
      },
      {
        q: "Is there any minimum paid-up capital requirement for a Private Limited Company?",
        a: "No. Following the Companies (Amendment) Act, 2015, the requirement for a minimum paid-up capital of ₹1 Lakh was abolished. A company can be incorporated with nominal authorized capital (e.g., ₹10,000 to ₹1,00,000)."
      },
      {
        q: "What is Form INC-20A, and why is it mandatory after incorporation?",
        a: "Form INC-20A is the Declaration of Commencement of Business. Every company incorporated in India must file INC-20A within 180 days of incorporation, verifying that shareholders have deposited their agreed share subscription money into the company bank account."
      },
      {
        q: "How long does the MCA V3 incorporation process typically take?",
        a: "Upon submission of verified documents and DSC authorization, MCA processing and Certificate of Incorporation issuance generally takes 5 to 10 working days, subject to ROC scrutiny and portal availability."
      }
    ]
  },

  "llp-registration": {
    name: "LLP Registration",
    category: "Company Registration",
    basePrice: 4999,
    h1: "LLP Registration Online India — Form FiLLiP MCA Incorporation Guide",
    metaTitle: "LLP Registration Online India | FiLLiP Form MCA | FilingBy",
    metaDescription: "Register a Limited Liability Partnership (LLP) in India online. Learn about designated partners, DPIN, Form FiLLiP, LLP agreement in Form 3, and audit exemptions.",
    metaKeywords: "llp registration online india, limited liability partnership incorporation, form fillip mca, llp agreement form 3, llp vs pvt ltd, dpin dsc partners",
    overview: `
      <p>A Limited Liability Partnership (LLP) is a corporate business form established under the Limited Liability Partnership Act, 2008 that combines the organizational flexibility of a partnership with the limited liability protection of a joint-stock company.</p>
      <p>Unlike traditional partnership firms, an LLP is a distinct legal entity where partners are protected from joint liability arising from another partner's wrongful acts or misconduct. LLPs are favored by professional service providers, consultants, and bootstrapped startups due to lower statutory compliance burdens and absence of mandatory statutory audits unless turnover exceeds ₹40 Lakhs or capital contribution exceeds ₹25 Lakhs.</p>
    `,
    statutoryInfo: {
      governingAct: "Limited Liability Partnership Act, 2008",
      sections: "Section 11, 12, 23 & 34; LLP Rules, 2009",
      portal: "Ministry of Corporate Affairs (mca.gov.in)",
      statutoryFee: "MCA incorporation fee based on partner capital contribution; state stamp duty on LLP agreement"
    },
    documentsRequired: [
      "PAN Card of all proposed Designated Partners (Mandatory for Indian nationals)",
      "Identity Proof: Aadhaar Card, Passport, or Voter ID of all Partners",
      "Address Proof of Partners: Bank Statement, Telephone Bill, or Electricity Bill (< 2 months old)",
      "Passport size photographs of all Partners",
      "Registered Office Proof: Electricity Bill or Water Bill (< 2 months old) + Rent Agreement",
      "Landlord No-Objection Certificate (NOC) granting permission to use premises as LLP registered office",
      "Class-3 Digital Signature Certificates (DSC) of at least 2 Designated Partners"
    ],
    processSteps: [
      "Name Reservation (RUN-LLP): Reserving the proposed LLP name on the MCA V3 portal ensuring the suffix 'LLP' is included.",
      "Class-3 DSC Procurement: Obtaining digital signature certificates for designated partners to execute electronic filings.",
      "FiLLiP Form Submission: Filing the integrated Form for Incorporation of Limited Liability Partnership (FiLLiP) on MCA V3.",
      "COI & LLPIN Issuance: ROC review and issuance of Certificate of Incorporation with unique 7-digit Limited Liability Partnership Identification Number (LLPIN).",
      "LLP Agreement Drafting & Form 3 Filing: Drafting mutual rights and duties on state-specific stamp paper and filing Form 3 with the ROC within 30 days."
    ],
    benefits: [
      "Limited Liability Shield Protecting Personal Assets from Business Debts",
      "No Mandatory Statutory Audit if Turnover is Below ₹40L and Contribution Below ₹25L",
      "Operational Flexibility Governed by Mutual Terms in the LLP Agreement",
      "Zero Dividend Distribution Tax on Profit Shares Disbursed to Partners"
    ],
    faqs: [
      {
        q: "What is the mandatory deadline for filing the LLP Agreement in Form 3?",
        a: "Under Section 23 of the LLP Act, the executed LLP Agreement must be filed in Form 3 with the ROC within 30 days of incorporation. Delay in filing Form 3 attracts graded statutory additional fees under the restructured LLP Rules based on the duration of delay and Small LLP status."
      },
      {
        q: "When does statutory audit become compulsory for an LLP?",
        a: "Under Rule 24 of the LLP Rules, 2009, an LLP is exempt from mandatory audit of its accounts unless its annual turnover exceeds ₹40 Lakhs or its partner capital contribution exceeds ₹25 Lakhs in any financial year."
      },
      {
        q: "Can foreign nationals become designated partners in an Indian LLP?",
        a: "Yes. Foreign nationals can be partners or designated partners in an Indian LLP under FDI guidelines, provided at least one designated partner is a resident of India."
      },
      {
        q: "How is an LLP taxed compared to a private limited company?",
        a: "An LLP is taxed at a flat rate of 30% on total income (plus surcharge and 4% cess). However, unlike companies, profit distributions to partners are completely exempt from tax in the hands of the partners under Section 10(23) of the Income Tax Act."
      }
    ]
  },

  "one-person-company": {
    name: "One Person Company",
    category: "Company Registration",
    basePrice: 4999,
    h1: "One Person Company (OPC) Registration Online India — MCA Guide",
    metaTitle: "One Person Company (OPC) Registration Online | MCA SPICe+ | FilingBy",
    metaDescription: "Register a One Person Company (OPC) in India online. Check sole director eligibility, nominee consent in Form INC-3, SPICe+ process, and corporate compliance exemptions.",
    metaKeywords: "one person company registration india, opc incorporation online, nominee consent inc-3, opc vs proprietorship, single director company mca",
    overview: `
      <p>A One Person Company (OPC) is a specialized corporate structure introduced under Section 2(62) of the Companies Act, 2013, enabling a single entrepreneur to operate a corporate entity with 100% ownership and limited liability protection.</p>
      <p>An OPC bridges the gap between an unorganized sole proprietorship and a multi-shareholder private limited company. The promoter retains complete operational autonomy while protecting personal assets from business liabilities. The Act mandates the appointment of a Nominee Director in the Memorandum of Association who assumes management of the entity in the event of the sole subscriber's death or permanent incapacitation.</p>
    `,
    statutoryInfo: {
      governingAct: "Companies Act, 2013",
      sections: "Section 2(62) & Section 3; Rule 3 of Companies (Incorporation) Rules, 2014",
      portal: "Ministry of Corporate Affairs (mca.gov.in)",
      statutoryFee: "Zero MCA incorporation fee up to ₹15 Lakh nominal capital; state stamp duty applicable"
    },
    documentsRequired: [
      "PAN Card and Aadhaar Card of the Sole Subscriber / Director",
      "PAN Card and Aadhaar Card of the Nominee Director",
      "Written Consent of Nominee Director in Form INC-3 along with identity and address proofs",
      "Proof of Address of Sole Member and Nominee: Bank Statement or Utility Bill (< 2 months old)",
      "Passport size photographs of Sole Director and Nominee Director",
      "Registered Office Proof: Electricity Bill (< 2 months old) + Rent Agreement + Landlord NOC",
      "Class-3 Digital Signature Certificate (DSC) for the Sole Director"
    ],
    processSteps: [
      "Name Reservation (SPICe+ Part A): Applying for corporate name approval ending with the suffix '(OPC) Private Limited'.",
      "Class-3 DSC Procurement: Generating cryptographic digital signature for the sole subscriber for MCA electronic authorization.",
      "SPICe+ Part B & INC-3 Submission: Compiling company bylaws, sole director declarations, and nominee consent Form INC-3.",
      "Drafting Electronic MOA (INC-33) & AOA (INC-34): Specifying business object clauses and governance regulations.",
      "AGILE-PRO-S Linked Registrations: Integrated processing for PAN, TAN, EPFO, ESIC, and corporate bank account opening.",
      "Issuance of Certificate of Incorporation: ROC review and release of COI containing Corporate Identification Number (CIN)."
    ],
    benefits: [
      "100% Equity Ownership with Zero Share Dilution or Partner Conflicts",
      "Complete Limited Liability Protection for the Solo Entrepreneur",
      "Exemption from Holding Annual General Meetings (AGMs) under Section 96",
      "Seamless Legal Entity Status Capable of Holding Property and Raising Debt"
    ],
    faqs: [
      {
        q: "Who is eligible to incorporate an OPC in India?",
        a: "Under Rule 3 of the Companies (Incorporation) Rules, any natural person who is an Indian citizen (whether resident in India or otherwise) is eligible to incorporate an OPC and act as a nominee. A person can incorporate only one OPC."
      },
      {
        q: "What are the compliance exemptions available to an OPC?",
        a: "An OPC is exempt from holding Annual General Meetings (AGMs) under Section 96, does not require a Cash Flow Statement in financial reports, and can file simplified Annual Returns in Form MGT-7A signed by a single director without requiring a Company Secretary certification."
      },
      {
        q: "Can an OPC voluntarily convert into a Private Limited Company?",
        a: "Yes. Under updated MCA rules, an OPC can convert voluntarily into a Private Limited Company or Public Company at any time without waiting for a mandatory 2-year lock-in period or turnover ceilings."
      },
      {
        q: "What is the role of a Nominee in an OPC?",
        a: "The nominee is nominated by the sole subscriber to take over ownership and management of the OPC in the event of the subscriber's death or incapacity to contract, ensuring uninterrupted perpetual succession."
      }
    ]
  },

  "trademark-registration": {
    name: "Trademark Registration",
    category: "Trademark & IP",
    basePrice: 6999,
    h1: "Trademark Registration Online India — Form TM-A Brand Protection Guide",
    metaTitle: "Trademark Registration Online India | Form TM-A IP India | FilingBy",
    metaDescription: "Register brand name and logo trademark in India. Check 45 Nice classes, official search clearance, government fee rebates for MSMEs, and TM-A filing steps.",
    metaKeywords: "trademark registration online india, form tm-a filing, ip india brand search, trademark classes 1-45, trademark fees msme, section 9 11 objections",
    overview: `
      <p>Trademark Registration in India is governed by the Trade Marks Act, 1999 and the Trade Marks Rules, 2017, administered by the Controller General of Patents, Designs and Trade Marks (IP India).</p>
      <p>A registered trademark grants the owner exclusive statutory rights to use, license, and commercially exploit their brand name, logo, slogan, shape of goods, or packaging across India, protecting against counterfeiting and brand infringement under Section 29 of the Act. Applications are filed under one or more of 45 international Nice classifications (Classes 1–34 for goods, Classes 35–45 for services).</p>
    `,
    statutoryInfo: {
      governingAct: "Trade Marks Act, 1999 & Trade Marks Rules, 2017",
      sections: "Section 18 (Application), Section 9 & 11 (Refusal Grounds), Section 23 (Registration)",
      portal: "Controller General of Patents, Designs and Trade Marks (ipindiaonline.gov.in)",
      statutoryFee: "Official e-filing fee: ₹4,500 (Individual/Startup/MSME) or ₹9,000 (Others)"
    },
    documentsRequired: [
      "Brand Name, Logo, Device, or Slogan Artwork in high-resolution PNG/JPEG format",
      "Identity and Address Proof of Applicant (PAN and Aadhaar for individuals/proprietors)",
      "Certificate of Incorporation / Partnership Deed / Trust Deed (for corporate/entity applicants)",
      "Udyam MSME Registration Certificate or DPIIT Recognition (Mandatory to claim 50% government fee concession)",
      "Power of Attorney / Form TM-48 executed on non-judicial stamp paper authorizing the trademark agent",
      "User Affidavit with Supporting Invoices / Advertisements (Required only if claiming prior commercial use in India)"
    ],
    processSteps: [
      "Comprehensive IP India Clearance Search: Conducting public database searches across exact, phonetic, and Vienna classification codes to verify uniqueness.",
      "Nice Classification & Class Determination: Selecting the precise class (Classes 1 to 45) and drafting goods/services descriptions matching business operations.",
      "Online Filing of Form TM-A: Submitting the application on the IP India e-filing portal and generating the statutory TM Application Number.",
      "Examination & Examination Report Reply: Scrutiny by the Trade Marks Registry and filing a formal response to objections raised under Section 9 (absolute grounds) or Section 11 (relative grounds) within 1 month of receipt of the examination report.",
      "Trade Marks Journal Publication: Mandatory 4-month public advertisement window in the Trade Marks Journal inviting third-party oppositions.",
      "Registration Certificate Grant: Issuance of statutory Certificate of Registration under the seal of the Trade Marks Registry (valid for 10 years). Total processing typically spans several months to over a year."
    ],
    benefits: [
      "Exclusive Nation-Wide Legal Rights to the Brand Name, Logo, and Commercial Slogan",
      "Legal Standing to File Infringement Lawsuits and Claim Damages under Section 135",
      "Right to Officially Use the Prestigious ® Symbol on Commercial Goods and Collateral",
      "Valuable Intangible Corporate Asset Eligible for Licensing, Franchising, or Valuation"
    ],
    faqs: [
      {
        q: "What is the official government fee for trademark application filing?",
        a: "For Individuals, Sole Proprietorships, Startups (DPIIT recognized), and MSMEs (Udyam registered), the official e-filing fee is ₹4,500 per class. For all other corporate entities (Pvt Ltd, LLP without MSME), the official fee is ₹9,000 per class."
      },
      {
        q: "What is the legal difference between the TM and ® symbols?",
        a: "The 'TM' symbol can be used immediately upon filing Form TM-A to signal public claim over the mark while the application is pending. The '®' registered symbol can strictly be used only after the official Certificate of Registration is issued by the Trade Marks Registry. Using ® on an unregistered mark is a penal offense under Section 107."
      },
      {
        q: "How long is a registered trademark valid in India?",
        a: "A registered trademark is valid for 10 years from the date of application. It can be renewed indefinitely every 10 years by filing Form TM-R with the applicable renewal fee."
      },
      {
        q: "What happens if the Trademark Examiner raises an objection under Section 9 or 11?",
        a: "Under Rule 33(4) of the Trade Marks Rules, 2017, the applicant must file a formal response with judicial precedents and evidence within 1 month of receiving the examination report. If the examiner is unsatisfied, a show-cause hearing is scheduled before the Hearing Officer."
      }
    ]
  },

  "itr-1-filing": {
    name: "ITR-1 Salaried Individual",
    category: "Income Tax",
    basePrice: 999,
    h1: "ITR-1 (Sahaj) Return Filing Online India — AY 2026-27 Tax Guide",
    metaTitle: "ITR-1 Return Filing Online India | Salaried Taxpayer AY 2026-27 | FilingBy",
    metaDescription: "File ITR-1 Sahaj online for salaried individuals for AY 2026-27. Form 16, AIS, TIS, 26AS matching, Section 115BAC new regime tax rebate, and due date compliance.",
    metaKeywords: "itr-1 filing online india, form 16 income tax return, ay 2026-27 tax slabs, section 115bac new regime, section 87a rebate 60000, ais tis reconciliation",
    overview: `
      <p>Form ITR-1 (Sahaj) is the simplified statutory income tax return prescribed under the Income-tax Act, 1961 for resident individuals earning total annual income up to ₹50 Lakhs. Eligible income sources include salary or pension income, income from one residential house property, and other sources (such as savings account interest, bank fixed deposits, family pension, and dividends).</p>
      <p>For Assessment Year 2026-27 (Financial Year 2025-26), returns are evaluated under the revised default New Tax Regime under Section 115BAC (offering standard deduction of ₹75,000 and Section 87A rebate up to ₹60,000 for income up to ₹12 Lakhs) or the optional Old Tax Regime.</p>
    `,
    statutoryInfo: {
      governingAct: "Income-tax Act, 1961 & Income Tax Rules, 1962",
      sections: "Section 139(1), Section 115BAC, Section 87A, Section 139AA",
      portal: "Income Tax Department e-Filing Portal (incometax.gov.in)",
      statutoryFee: "Section 234F late fee: ₹5,000 (or ₹1,000 for income <= ₹5 Lakhs)"
    },
    documentsRequired: [
      "PAN Card and Aadhaar Card (Mandatorily linked under Section 139AA of the Income Tax Act)",
      "Form 16 (Part A with TDS challan data and Part B with detailed salary breakup) from employer",
      "Annual Information Statement (AIS) and Taxpayer Information Summary (TIS) downloaded from e-Filing portal",
      "Form 26AS verifying tax deducted at source by all deductors and advance tax deposits",
      "Bank Account Statements and Interest Certificates for all active savings and fixed deposit accounts",
      "Home Loan Interest Certificate issued by lending institution (under Section 24 for Old Regime)",
      "Chapter VI-A Investment Proofs (Section 80C, 80D, 80G, 80CCD) if exercising Old Regime option"
    ],
    processSteps: [
      "Data Ingestion & Cross-Reconciliation: Matching employer Form 16 figures against auto-populated AIS, TIS, and Form 26AS data.",
      "Tax Regime Optimization: Computing comparative tax liability between the revised New Regime (Section 115BAC) and Old Regime to recommend the highest tax savings.",
      "Income Computation: Consolidating taxable salary, house property deductions, and other source interest income.",
      "Form ITR-1 Compilation on Income Tax Portal: Preparing the electronic return schema and validating against CBDT system rules.",
      "Return Submission & Aadhaar e-Verification: Submitting the return and executing mandatory Aadhaar OTP or net-banking e-verification within 30 days."
    ],
    benefits: [
      "Avoids Statutory Penalties under Section 234F and Daily Interest Charges under Section 234A",
      "Essential Proof of Income for Bank Loan Approvals, Credit Cards, and Visa Processing",
      "Seamless Claim and Speedy Direct-Bank Credit of Excess TDS Withholding Refunds",
      "Statutory Record for Legal Financial Transparency and Wealth Creation"
    ],
    faqs: [
      {
        q: "Who is eligible to file income tax return using Form ITR-1 (Sahaj)?",
        a: "Resident individuals whose total taxable income does not exceed ₹50 Lakhs from: (1) Salary or pension, (2) One residential house property, and (3) Income from other sources (interest, dividends, family pension). Agricultural income must not exceed ₹5,000."
      },
      {
        q: "Who is strictly disqualified from filing ITR-1?",
        a: "Individuals who are directors in a company, hold unlisted equity shares, have income from business or profession, have capital gains, own more than one house property, have foreign assets or foreign income, or earn total income exceeding ₹50 Lakhs cannot file ITR-1."
      },
      {
        q: "What is the statutory due date and penalty for late filing of ITR-1?",
        a: "The statutory due date for non-audit individuals is July 31st of the assessment year. Filing after July 31st attracts a late fee under Section 234F of ₹5,000 (restricted to ₹1,000 for total income up to ₹5 Lakhs) plus penal interest of 1% per month under Section 234A."
      },
      {
        q: "How does the Section 87A rebate work under the New Tax Regime for AY 2026-27?",
        a: "Under the revised Section 115BAC for FY 2025-26 / AY 2026-27, resident individuals with net taxable income up to ₹12 Lakhs receive a tax rebate up to ₹60,000, resulting in zero net tax. Salaried individuals earning up to ₹12.75 Lakhs pay zero tax after deducting the ₹75,000 standard deduction."
      }
    ]
  },

  "fssai-basic-registration": {
    name: "FSSAI Registration",
    category: "Licenses",
    basePrice: 1499,
    h1: "FSSAI Food Registration Online India — FoSCoS Regulatory Compliance",
    metaTitle: "FSSAI Food Registration Online India | FoSCoS 2026 Thresholds | FilingBy",
    metaDescription: "Apply for 14-digit FSSAI Food Registration online in India. Current FoSCoS turnover threshold up to ₹1.5 Crore, perpetual validity without recurring renewal applications, statutory FoSCoS fee rules, and documents.",
    metaKeywords: "fssai registration online, foscos portal, fssai turnover 1.5 crore, fssai perpetual validity, food license india",
    overview: `
      <p>FSSAI Registration is the statutory food safety authorization governed by Section 31 of the Food Safety and Standards Act, 2006 and the Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011.</p>
      <p>Administered by the Food Safety and Standards Authority of India (FSSAI) through the FoSCoS portal (foscos.fssai.gov.in), registration is mandatory for food business operators (FBOs), small manufacturers, retail outlets, cloud kitchens, and caterers whose annual turnover does not exceed ₹1.5 Crore under the revised thresholds implemented from 1 April 2026 (State Licence: ₹1.5 Crore to ₹50 Crore; Central Licence: above ₹50 Crore).</p>
      <p><strong>Perpetual Validity vs. Continuing Fee Obligations:</strong> Under current FSSAI regulations effective in 2026, licences and registrations have perpetual validity unless suspended, cancelled, or surrendered by the food authority—meaning no periodic renewal applications are required merely to extend the certificate's validity. However, perpetual validity does not mean food licensing is fee-free. The official FSSAI framework clarifies that FBOs may pay statutory fees for any number of years at once, and fees can be paid during the year. Applicable government statutory fees vary by registration or licence category and food-business type, and are remitted directly on FoSCoS. Operating a food business without valid FSSAI authorization attracts penalties up to ₹5 Lakhs and prosecution under Section 63.</p>
    `,
    statutoryInfo: {
      governingAct: "Food Safety and Standards Act, 2006 & Licensing Regulations",
      sections: "Section 31 (Licensing & Registration), Section 63 (Penalties)",
      portal: "FSSAI FoSCoS Portal (foscos.fssai.gov.in)",
      statutoryFee: "Government fee varies by registration/licence category and food-business type; the current amount is payable through FoSCoS. Separate from FilingBy's optional professional fee."
    },
    documentsRequired: [
      "Passport size photograph of the Food Business Operator / Authorized Signatory",
      "Government Identity Proof: Aadhaar Card, PAN Card, or Voter ID",
      "Proof of Business Premises: Commercial Rent Agreement + Landlord NOC + Electricity Bill (< 2 months old) or Ownership Deed",
      "List of Food Products / Categories to be manufactured, stored, packed, or distributed",
      "Form of Declaration / Undertaking signed by applicant confirming adherence to hygienic and sanitary practices",
      "Partnership Deed or Certificate of Incorporation (for entities other than sole proprietors)"
    ],
    processSteps: [
      "FoSCoS Portal Profile Creation: Registering user credentials on the FSSAI Food Safety Compliance System (foscos.fssai.gov.in).",
      "Form A Application Submission: Selecting business nature (retailer, cloud kitchen, food stall, manufacturer) and entering turnover/capacity details.",
      "Food Product Categorization: Mapping food items to standardized FSSAI food category codes (Categories 1 to 16).",
      "Statutory Government Fee Payment: Remitting the official FoSCoS government fee electronically on the portal.",
      "Scrutiny & Certificate Issuance: Verification by the jurisdictional Food Safety Officer and electronic generation of the 14-digit FSSAI Registration Certificate with QR code."
    ],
    benefits: [
      "Mandatory Qualification to Sell on Food Aggregators (Zomato, Swiggy, Blinkit, Zepto)",
      "Perpetual Certificate Validity Without Recurring Renewal Applications (Subject to Statutory FoSCoS Fee Schedule)",
      "Builds Consumer Trust by Ensuring Compliance with National Food Safety Standards",
      "Protection from Hefty Fines up to ₹5 Lakhs and Prosecution under Section 63"
    ],
    faqs: [
      {
        q: "What are the revised turnover thresholds for FSSAI Registration vs State License in 2026?",
        a: "Under the revised FSSAI framework effective 1 April 2026: (1) FSSAI Registration applies to food businesses with annual turnover up to ₹1.5 Crore; (2) State Licence applies to food businesses with turnover above ₹1.5 Crore and up to ₹50 Crore; (3) Central Licence applies to food businesses with annual turnover exceeding ₹50 Crore, large importers, exporters, and multi-state operations."
      },
      {
        q: "Does FSSAI Registration require periodic renewal applications under the 2026 rules?",
        a: "Under current FSSAI regulations effective in 2026, registrations and licences have perpetual validity unless suspended, cancelled, or surrendered. No periodic renewal application is required merely to extend certificate validity. However, perpetual validity does not eliminate statutory fees: official FSSAI guidance clarifies that FBOs may pay statutory fees for any number of years at once, and fees can be paid during the year according to the FoSCoS fee schedule."
      },
      {
        q: "How are fees structured between the government and FilingBy?",
        a: "Government fee varies by registration/licence category and food-business type; the current amount is payable through FoSCoS. FilingBy charges a separate, optional professional service fee for food category mapping, documentation review, FoSCoS portal compilation, and compliance follow-up. FilingBy is an independent private consultancy and not a government authority."
      },
      {
        q: "Is FSSAI registration mandatory for home-based bakers and cloud kitchens?",
        a: "Yes. Under FSSAI regulations, every food business operator—including home kitchens, bakers, tiffin services, and delivery-only cloud kitchens—must hold valid registration before commencing commercial operations."
      },
      {
        q: "What is the penalty for running a food business without FSSAI registration?",
        a: "Under Section 63 of the FSS Act, 2006, operating a food business without an FSSAI license or registration is punishable with imprisonment for a term up to 6 months and a fine up to ₹5 Lakhs."
      }
    ]
  },

  "udyam-registration": {
    name: "MSME Classification & Udyam Guidance",
    category: "Licenses",
    basePrice: 499,
    h1: "Udyam Registration Guidance & MSME Classification Support",
    metaTitle: "Udyam Registration Guidance & MSME Classification Support | FilingBy",
    metaDescription: "Independent guide for MSME classification, NIC codes, and official portal preparation. Official Government Udyam Registration is 100% free on udyamregistration.gov.in.",
    metaKeywords: "udyam registration guidance, msme classification support, udyamregistration gov in, official udyam free, msme limits 2025 2026, nic code msme",
    overview: `
      <p>Udyam Registration is the official recognition framework administered by the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India, under the MSMED Act, 2006.</p>
      <p><strong>Official Government Registration is 100% Free:</strong> Official Udyam Registration on the Government of India portal (<a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer">udyamregistration.gov.in</a>) is completely <strong>FREE OF COST</strong> and paperless, based entirely on digital self-declaration. The official portal states that, apart from the Government portal and Government Single Window Systems, <strong>no private online/offline service, agency or person is authorized to do MSME Registration or undertake related official activity</strong>.</p>
      <p><strong>Independent Guidance &amp; Advisory Role:</strong> FilingBy is an independent private compliance platform and is <strong>not affiliated with or authorized by the Ministry of MSME to issue or process Udyam Registration</strong>. The actual registration must be completed directly by the applicant on the official Government portal. FilingBy provides optional, independent classification guidance, helping business owners evaluate composite investment and turnover thresholds, select correct National Industrial Classification (NIC) codes, compile necessary data, and understand post-registration MSME protections.</p>
      <p><strong>Revised Post-April 2025 MSME Classification Limits:</strong> Effective 1 April 2025, enterprises are classified using composite criteria of investment in plant & machinery/equipment and annual turnover:
      <ul>
        <li><strong>Micro Enterprise:</strong> Investment up to ₹2.5 Crore AND Turnover up to ₹10 Crore</li>
        <li><strong>Small Enterprise:</strong> Investment up to ₹25 Crore AND Turnover up to ₹100 Crore</li>
        <li><strong>Medium Enterprise:</strong> Investment up to ₹125 Crore AND Turnover up to ₹500 Crore</li>
      </ul>
      Both investment and turnover limits must be satisfied for an enterprise to be categorized accordingly.</p>
    `,
    statutoryInfo: {
      governingAct: "Micro, Small and Medium Enterprises Development (MSMED) Act, 2006",
      sections: "Notification S.O. 2119(E) as amended; Section 7 & Sections 15-24 of MSMED Act",
      portal: "Official MSME Udyam Portal (udyamregistration.gov.in)",
      statutoryFee: "₹0 (Zero official government fee; registration on the official government portal is 100% free. FilingBy provides optional independent business classification consultation)"
    },
    documentsRequired: [
      "Aadhaar Number of the Proprietor / Managing Partner / Authorized Director (Mobile linked for OTP validation on the government portal)",
      "PAN Card of the Enterprise / Proprietor (Mandatorily validated against Income Tax database)",
      "GSTIN (Mandatory only for enterprises liable to register under the CGST Act, 2017)",
      "Business Bank Account Details: Bank Account Number and IFSC code",
      "National Industrial Classification (NIC) Activity Identification: Determining appropriate 2-digit, 4-digit, and 5-digit activity codes",
      "Investment in Plant & Machinery / Equipment and Gross Turnover figures (Cross-referenced with tax return records)"
    ],
    processSteps: [
      "MSME Classification Review: Evaluating enterprise investment and turnover against the revised post-April-2025 composite thresholds.",
      "NIC Activity Mapping: Selecting relevant 5-digit National Industrial Classification codes for manufacturing or service operations.",
      "Business-Data Readiness: Assembling and reviewing Aadhaar-linked mobile, PAN, bank IFSC, and GSTIN details prior to portal access.",
      "Direct Official Portal Submission: Accessing the official Government Udyam portal (udyamregistration.gov.in) to complete free digital self-declaration.",
      "Aadhaar OTP Verification & Instant Certificate: Authenticating via Aadhaar OTP on the government portal to generate the permanent Udyam Certificate with dynamic QR code at zero government fee."
    ],
    benefits: [
      "Mandatory 45-Day Payment Settlement Protection under the MSMED Act, 2006 (Section 15)",
      "Priority Sector Lending and Concessional Bank Interest Rates on Business Working Capital",
      "50% Government Fee Concession on Trademark Filing and 80% on Patent Applications",
      "Exemption from Earnest Money Deposit (EMD) in Central Government and PSU Tenders"
    ],
    faqs: [
      {
        q: "What is the official government fee for Udyam Registration?",
        a: "There is ZERO official government fee. Udyam Registration on the Government of India portal (udyamregistration.gov.in) is completely free of charge. Official guidance confirms no private service or person is authorized to do MSME Registration or charge official fees. Any fee charged by FilingBy is strictly for optional, independent business classification and data readiness consultation."
      },
      {
        q: "Does FilingBy file the official Udyam registration on my behalf?",
        a: "No. FilingBy is an independent compliance platform and is not authorized by the Ministry of MSME to issue or process Udyam Registration. The official registration must be submitted directly by the enterprise owner on udyamregistration.gov.in using Aadhaar OTP authentication. FilingBy provides guidance on MSME classification, NIC codes, and portal readiness."
      },
      {
        q: "What are the current MSME classification criteria effective from 1 April 2025 onwards?",
        a: "Under the revised official Udyam classification effective 1 April 2025: (1) Micro Enterprise: Investment in plant & machinery/equipment up to ₹2.5 Crore AND Turnover up to ₹10 Crore; (2) Small Enterprise: Investment up to ₹25 Crore AND Turnover up to ₹100 Crore; (3) Medium Enterprise: Investment up to ₹125 Crore AND Turnover up to ₹500 Crore. Both investment and turnover conditions must be satisfied."
      },
      {
        q: "Does Udyam Registration require periodic or annual renewal?",
        a: "No. The Udyam Registration Certificate is permanent and does not require periodic renewal or renewal fees. Enterprises need only maintain updated financial and turnover details on the portal as tax returns are finalized."
      },
      {
        q: "How does Udyam Registration protect businesses against delayed payments?",
        a: "Under Sections 15 to 24 of the MSMED Act, 2006, buyers must settle dues to MSME suppliers within 45 days (or agreed contract period). Delay entitles the MSME to compound interest with monthly rests at 3 times the RBI bank rate, enforceable through the MSME Samadhaan portal."
      }
    ]
  },

  "iec-registration": {
    name: "Import Export Code (IEC)",
    category: "Licenses",
    basePrice: 999,
    h1: "Import Export Code (IEC) Registration Online India — DGFT Portal Guide",
    metaTitle: "Import Export Code (IEC) Registration Online | DGFT ANF-2A | FilingBy",
    metaDescription: "Apply for 10-digit Import Export Code (IEC) online via DGFT portal. Check mandatory documentation, ₹500 government fee, annual April-June update rule, and ICEGATE linkage.",
    metaKeywords: "import export code registration, iec code apply online, dgft anf-2a, iec registration fee 500, annual iec update dgft, icegate custom clearance",
    overview: `
      <p>The Import Export Code (IEC) is a 10-digit primary business identification number issued by the Directorate General of Foreign Trade (DGFT), Ministry of Commerce and Industry, under Section 7 of the Foreign Trade (Development and Regulation) Act, 1992 and the Foreign Trade Policy (FTP 2023).</p>
      <p>An IEC is legally mandatory for any commercial entity in India seeking to import goods or export goods and cross-border services. Custom authorities (ICEGATE) and commercial banks require a valid IEC to clear international shipments, process foreign inward remittances, and claim export incentive benefits such as Duty Drawback and RoDTEP.</p>
    `,
    statutoryInfo: {
      governingAct: "Foreign Trade (Development and Regulation) Act, 1992 & Foreign Trade Policy 2023",
      sections: "Section 7; Para 2.05 of Foreign Trade Policy",
      portal: "Directorate General of Foreign Trade (dgft.gov.in)",
      statutoryFee: "Official government fee: ₹500 paid directly on Bharatkosh/DGFT"
    },
    documentsRequired: [
      "PAN Card of the Business Entity / Sole Proprietor (The 10-digit IEC is identical to entity PAN)",
      "Proof of Legal Constitution: Partnership Deed, Certificate of Incorporation, or Trust Deed (not required for proprietorships)",
      "Proof of Business Address: Commercial Rent Agreement + Landlord NOC + Electricity Bill (< 2 months old) or Sale Deed",
      "Bank Account Verification: Active Current Account Cancelled Cheque or Bank Certificate with account name and IFSC",
      "Digital Signature Certificate (Class-3 DSC) or Aadhaar of Authorized Signatory for DGFT portal e-signing"
    ],
    processSteps: [
      "DGFT Portal User Profile Setup: Creating an authorized corporate user account on the DGFT portal (dgft.gov.in).",
      "Form ANF-2A Compilation: Completing electronic application Form ANF-2A with entity details, bank credentials, and partner/director information.",
      "Document Attachment & Verification: Uploading bank proof, address verification, and constitution paperwork.",
      "Statutory Fee Payment: Remitting the official government fee of ₹500 directly to the DGFT through Bharatkosh gateway.",
      "Electronic DSC/Aadhaar Signing: Signing the application using Class-3 DSC or Aadhaar OTP authentication.",
      "Electronic Certificate Issuance: Processing of ANF-2A and bank credentials by DGFT followed by digital issuance of the 10-digit IEC e-Certificate."
    ],
    benefits: [
      "Mandatory Statutory Clearance for Customs Port Handling on ICEGATE",
      "Enables Smooth Processing of Inward Foreign Remittances via Commercial Banks",
      "Unlocks Export Promotion Incentives (Duty Drawback, RoDTEP, RoSCTL Schemes)",
      "Lifetime Validity Subject to Simple Annual Online Confirmation on DGFT Portal"
    ],
    faqs: [
      {
        q: "What is the official government fee for Import Export Code (IEC) registration?",
        a: "The official statutory application fee levied by the DGFT is ₹500, paid directly through the government payment gateway. FilingBy charges a transparent service fee for document verification, form compilation, and query handling."
      },
      {
        q: "Is there an annual renewal or confirmation requirement for an IEC?",
        a: "Yes. Under Para 2.05 of the Foreign Trade Policy, every IEC holder must confirm or update their IEC details electronically on the DGFT portal annually between April and June. Even if there are no changes, electronic confirmation is mandatory to prevent the IEC from being deactivated."
      },
      {
        q: "Is an IEC required for service exporters or software companies?",
        a: "An IEC is mandatory for service exporters if the service provider intends to claim export incentives, benefits, or concessions under Foreign Trade Policy schemes. If no export benefits are claimed, an IEC is not strictly necessary for service exports, though banks typically mandate it for foreign currency remittance clearance."
      },
      {
        q: "Can an individual obtain an IEC in personal name?",
        a: "Yes. Any individual holding a valid PAN card can apply for an Import Export Code in their individual capacity for commercial export or import operations."
      }
    ]
  },

  "startup-india": {
    name: "Startup India Registration",
    category: "Licenses",
    basePrice: 4999,
    h1: "Startup India Recognition Online — DPIIT Certificate & Tax Exemptions",
    metaTitle: "Startup India Registration Online | DPIIT Recognition Certificate | FilingBy",
    metaDescription: "Apply for DPIIT Startup India Recognition online. Learn about Section 80-IAC 3-year tax holiday, angel tax exemption, 80% patent fee rebate, and eligibility rules.",
    metaKeywords: "startup india registration online, dpiit recognition certificate, section 80-iac tax holiday, angel tax exemption section 56, startup india eligibility, patent rebate startup",
    overview: `
      <p>Startup India Recognition is the flagship government initiative administered by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry, governed by Notification G.S.R. 127(E) dated 19th February 2019.</p>
      <p>Recognition is available to Private Limited Companies, Limited Liability Partnerships, and Registered Partnership Firms incorporated within the past 10 years with annual turnover not exceeding ₹100 Crores, working towards innovation, development, or commercialization of new products or services. Certified startups access statutory benefits including Section 80-IAC 3-year income tax holiday, angel tax exemption under Section 56(2)(viib), and 80% rebate on patent application fees.</p>
    `,
    statutoryInfo: {
      governingAct: "DPIIT Notification G.S.R. 127(E); Income-tax Act 1961 Section 80-IAC & 56(2)(viib)",
      sections: "DPIIT Startup Recognition Framework",
      portal: "Official Startup India Portal (startupindia.gov.in)",
      statutoryFee: "₹0 (Zero official government fee; FilingBy charges flat advisory fee)"
    },
    documentsRequired: [
      "Certificate of Incorporation (for Private Limited Company) or Registration Certificate (for LLP)",
      "PAN Card of the Startup Entity",
      "Board Resolution / Letter of Authorization appointing the authorized representative",
      "Comprehensive Business Pitch Deck / Presentation detailing the innovation, problem solved, unique selling proposition (USP), and revenue scalability",
      "Working Website URL, Product Demo Video, Mobile App link, or Prototype Proof",
      "Copies of Published Patents, Trademark Registrations, or Industry Awards (if available)"
    ],
    processSteps: [
      "Startup India Hub Profile Creation: Setting up corporate entity profile on the Startup India National Portal (startupindia.gov.in).",
      "DPIIT Application Submission: Entering incorporation numbers, capital investment details, and employment generation figures.",
      "Innovation & Scalability Documentation: Submitting detailed answers explaining how the product/service demonstrates novelty and scalable market potential.",
      "Self-Certification & Document Upload: Attaching COI, board resolution, and pitch deck under statutory self-certification rules.",
      "Inter-Ministerial Review: Review by DPIIT scrutinizing eligibility criteria and technical innovation claims.",
      "Recognition Certificate Issuance: Grant of official DPIIT Recognition Certificate with a unique DIPP number and access to startup schemes."
    ],
    benefits: [
      "Eligibility to Apply for 3-Year 100% Tax Holiday under Section 80-IAC of Income Tax Act",
      "Exemption from Angel Tax Assessment under Section 56(2)(viib) for Share Premium",
      "80% Government Fee Rebate on Patents and 50% Subsidy on Trademark Filings",
      "Relaxation in Prior Experience and Turnover Criteria in Public Procurement Tenders"
    ],
    faqs: [
      {
        q: "What are the key eligibility criteria for DPIIT Startup India Recognition?",
        a: "To qualify: (1) The entity must be incorporated as a Private Limited Company, LLP, or Registered Partnership; (2) Less than 10 years must have elapsed from incorporation; (3) Turnover must not have exceeded ₹100 Crores in any financial year; (4) The entity must be working towards innovation, development, or improvement of products/services with a scalable business model."
      },
      {
        q: "What is the Section 80-IAC Income Tax exemption for startups?",
        a: "Under Section 80-IAC of the Income-tax Act, 1961, a recognized startup (incorporated as Pvt Ltd or LLP) can apply for a 100% deduction of profits for 3 consecutive assessment years out of its first 10 years. This tax holiday requires separate review and approval by the Inter-Ministerial Board (IMB)."
      },
      {
        q: "What intellectual property (IP) concessions are provided to recognized startups?",
        a: "DPIIT-recognized startups receive an 80% rebate on government patent filing fees, a 50% rebate on trademark filing fees, and free access to government-empanelled IP facilitators for patent and trademark prosecution."
      },
      {
        q: "Is there an official government fee for DPIIT Startup India recognition?",
        a: "No. The Government of India levies zero application fees for DPIIT recognition. FilingBy provides professional assistance in preparing the required pitch presentation, innovation justification, and documentation review for an upfront service charge."
      }
    ]
  },

  "roc-annual-filing-pvt": {
    name: "ROC Filing (Pvt Ltd)",
    category: "MCA / ROC",
    basePrice: 2999,
    h1: "ROC Annual Filing for Private Limited Companies — Form AOC-4 & MGT-7",
    metaTitle: "ROC Annual Filing Pvt Ltd Online | Form AOC-4 & MGT-7 MCA | FilingBy",
    metaDescription: "File ROC annual returns for Private Limited Companies online. Form AOC-4 financials, Form MGT-7/7A annual returns, AGM timelines, and Section 403 penalty protection.",
    metaKeywords: "roc annual filing pvt ltd, form aoc-4 due date, form mgt-7 filing mca, annual return private limited, section 403 penalty 100 per day, dir-3 kyc",
    overview: `
      <p>ROC Annual Filing is the statutory compliance obligation mandated under Sections 92, 129, and 137 of the Companies Act, 2013, requiring every Private Limited Company to submit its audited annual accounts and annual return to the Registrar of Companies (ROC) via the MCA V3 portal.</p>
      <p>Regardless of whether the company conducted commercial operations or generated revenue, it must hold an Annual General Meeting (AGM) by September 30th and file Form AOC-4 (Financial Statements, Balance Sheet, and P&L) within 30 days, followed by Form MGT-7 or MGT-7A (Annual Return of shareholding and directorships) within 60 days of the AGM.</p>
    `,
    statutoryInfo: {
      governingAct: "Companies Act, 2013",
      sections: "Section 92 (MGT-7), Section 137 (AOC-4), Section 403 (Late Fees)",
      portal: "Ministry of Corporate Affairs (mca.gov.in)",
      statutoryFee: "MCA normal filing fee (₹200-₹600 based on capital); late fee: ₹100/day per form"
    },
    documentsRequired: [
      "Audited Balance Sheet, Profit & Loss Account, and Notes to Accounts signed by Directors and Statutory Auditor",
      "Independent Auditor's Report along with CARO report (Companies Auditor's Report Order, if applicable)",
      "Directors' Report prepared under Section 134 of the Companies Act with mandatory corporate disclosures",
      "Notice and Minutes of the Annual General Meeting (AGM) and Board Meetings",
      "List of Shareholders and Transfer Register detailing share transactions during the financial year",
      "Form MGT-8 Secretarial Audit Certificate (Mandatory only if paid-up capital >= ₹10Cr or turnover >= ₹50Cr)",
      "Active Director Identification Numbers (DIN) with completed DIR-3 KYC and Class-3 DSC of Directors"
    ],
    processSteps: [
      "Financial Account Finalization: Audit of annual accounts by an independent Chartered Accountant (Statutory Auditor).",
      "Board Approval & AGM Execution: Holding board meeting to adopt financial statements and convening the formal AGM by September 30th.",
      "Form AOC-4 Compilation & MCA V3 Filing: Filing audited financials, auditor report, and directors' report within 30 days of AGM (by October 29th).",
      "Form MGT-7 / MGT-7A Submission: Compiling shareholding, director changes, and meetings data within 60 days of AGM (by November 28th).",
      "Director KYC Verification: Submitting Form DIR-3 KYC for all active DIN holders by September 30th.",
      "SRN Tracking & Challan Archival: Generating Service Request Numbers (SRN) and downloading approved MCA filing receipts."
    ],
    benefits: [
      "Protects Company and Directors from Penal Surcharges of ₹100/Day under Section 403",
      "Prevents Disqualification of Directors under Section 164(2) of the Companies Act",
      "Maintains Active Corporate Status on MCA Master Data Portal for Banking Operations",
      "Mandatory Prerequisite for Corporate Loans, Investor Due Diligence, and Tenders"
    ],
    faqs: [
      {
        q: "What are the statutory due dates for Private Limited ROC annual filings?",
        a: "For companies whose financial year ends on March 31st: (1) Form DIR-3 KYC is due by September 30th; (2) Annual General Meeting (AGM) must be held by September 30th; (3) Form AOC-4 is due within 30 days of AGM (October 29th); (4) Form MGT-7 / 7A is due within 60 days of AGM (November 28th)."
      },
      {
        q: "What is the statutory penalty for delayed filing of Form AOC-4 and MGT-7?",
        a: "Under Section 403 of the Companies Act, 2013, a delayed filing of AOC-4 or MGT-7 attracts an additional statutory late fee of ₹100 per day per form with no maximum upper limit. Non-filing also exposes directors to disqualification under Section 164(2)."
      },
      {
        q: "Is ROC annual filing mandatory for dormant or inactive private limited companies?",
        a: "Yes. Every company registered under the Companies Act must complete annual ROC filings every single year from incorporation until it is formally dissolved or struck off via Form STK-2. Zero business activity does not exempt a company from filing Nil returns."
      },
      {
        q: "Which companies are eligible to file simplified Form MGT-7A?",
        a: "Form MGT-7A is an abridged annual return available exclusively to One Person Companies (OPCs) and 'Small Companies' (companies with paid-up capital not exceeding ₹4 Crores and annual turnover not exceeding ₹40 Crores)."
      }
    ]
  },

  "roc-annual-filing-llp": {
    name: "ROC Filing (LLP)",
    category: "MCA / ROC",
    basePrice: 6999,
    h1: "LLP Annual Filing Online India — Form 11 & Form 8 MCA Compliance",
    metaTitle: "LLP Annual Filing Online India | Form 11 & Form 8 MCA | FilingBy",
    metaDescription: "Complete annual compliance for your LLP in India. File Form 11 (Annual Return by May 30) and Form 8 (Statement of Accounts by Oct 30) with MCA V3 penalty protection.",
    metaKeywords: "llp annual filing online, form 11 due date may 30, form 8 statement of accounts oct 30, llp additional fee mca, llp audit threshold 40 lakh",
    overview: `
      <p>ROC Annual Filing for an LLP is governed by Sections 34 and 35 of the Limited Liability Partnership Act, 2008 read with the LLP Rules, 2009. Every registered LLP is legally required to complete two major statutory filings with the Registrar of Companies (ROC) annually: Form 11 (Annual Return) within 60 days of the closure of the financial year (generally due May 30th), and Form 8 (Statement of Account & Solvency) within 30 days from the end of 6 months of the financial year (generally due October 30th).</p>
      <p>These filings are mandatory even if the LLP had zero commercial transactions during the year. Under the restructured LLP Rules and Section 69, delayed filing attracts additional fees calculated as a graded multiplier of the normal filing fee based on the period of delay and whether the entity is a Small LLP or other LLP, rather than a flat unscaled penalty.</p>
    `,
    statutoryInfo: {
      governingAct: "Limited Liability Partnership Act, 2008 & LLP Rules, 2009",
      sections: "Section 34 (Form 8), Section 35 (Form 11), Section 69 (Additional Fees)",
      portal: "Ministry of Corporate Affairs (mca.gov.in)",
      statutoryFee: "MCA normal fee (₹50-₹200); delayed filing attracts graded additional fee multipliers (2x to 50x normal fee based on delay duration and Small LLP status)"
    },
    documentsRequired: [
      "Statement of Account and Solvency detailing assets, liabilities, income, and expenditure as of March 31st",
      "Summary of Partner Capital Contributions and Profit-Sharing Ratios",
      "List of Designated Partners with active DPIN details and validity checks",
      "Details of penalties, compounding applications, or court proceedings (if any)",
      "Tax Audit Report under Section 44AB of the Income Tax Act (If annual turnover exceeds ₹40 Lakhs or contribution exceeds ₹25 Lakhs)",
      "Class-3 Digital Signature Certificate (DSC) of minimum two Designated Partners"
    ],
    processSteps: [
      "Books of Accounts Reconciliation: Closing financial books and partner capital accounts as on March 31st.",
      "Form 11 Preparation & Submission: Compiling partner counts, contribution totals, and filing on MCA V3 generally by May 30th.",
      "Financial Solvency Declaration: Drafting Statement of Account & Solvency signed by designated partners declaring solvency.",
      "Professional Certification: Securing certification from a practicing Chartered Accountant, CS, or Cost Accountant (if thresholds exceed).",
      "Form 8 Compilation & Submission: Filing Statement of Account & Solvency on the MCA V3 portal generally by October 30th.",
      "Challan Archival: Downloading official MCA SRN receipts and payment confirmations for corporate records."
    ],
    benefits: [
      "Avoids Graded MCA Additional Fee Escalations under Section 69 and LLP Rules",
      "Maintains Active and Compliant Status on MCA Public Master Data Records",
      "Protects Designated Partners from Statutory Non-Compliance Defaults",
      "Ensures Seamless Banking Facility Renewals and Credit Line Operations"
    ],
    faqs: [
      {
        q: "What are the statutory due dates for annual filings of an LLP in India?",
        a: "An LLP has two mandatory annual filing deadlines: (1) Form 11 (Annual Return) is generally due by May 30th (60 days from financial year close); (2) Form 8 (Statement of Account & Solvency) is generally due by October 30th. Due dates can be extended by MCA circulars."
      },
      {
        q: "How are additional fees calculated for late filing of LLP Form 8 or Form 11?",
        a: "Under the amended LLP Rules (Annexure A), delayed filing of Form 8 or Form 11 no longer incurs an unscaled flat ₹100/day fine. Instead, MCA applies a graded additional fee multiplier schedule based on the duration of delay (e.g. from 2 to 25 times the normal filing fee for Small LLPs, and up to 50 times for other LLPs, depending on whether the delay is up to 15, 30, 60, 90, 180, 360 days or more)."
      },
      {
        q: "Is audit mandatory for all LLPs before filing Form 8?",
        a: "No. Under Rule 24 of the LLP Rules, 2009, an audit by a Chartered Accountant is mandatory only if the LLP's annual turnover exceeds ₹40 Lakhs or its partner capital contribution exceeds ₹25 Lakhs. LLPs below these thresholds can file Form 8 without a statutory audit."
      },
      {
        q: "Must an LLP file Form 11 and Form 8 if it had zero business transactions?",
        a: "Yes. Filing is mandatory for every active LLP from the date of incorporation, regardless of whether commercial transactions occurred. A Nil return must be submitted to maintain active legal standing."
      }
    ]
  },

  "trust-registration": {
    name: "Trust Registration",
    category: "NGO & Trust",
    basePrice: 19999,
    h1: "Trust Registration Online India — Public Charitable Trust & 12A/80G Guide",
    metaTitle: "Trust Registration Online India | Public Charitable Trust 12A/80G | FilingBy",
    metaDescription: "Register a Public Charitable Trust in India. Understand state-specific legislation, Sub-Registrar deed registration, and separate Income Tax 12AB / 80G approvals.",
    metaKeywords: "trust registration online india, public charitable trust deed, sub-registrar trust registration, section 12ab exemption form 10a, section 80g donation deduction, trust audit form 10b",
    overview: `
      <p>Trust Registration in India involves the legal formation of a trust whose governing framework depends on the trust's nature and state jurisdiction. Private trusts are governed nationally by the Indian Trusts Act, 1882. However, the Indian Trusts Act expressly excludes public charitable and religious trusts.</p>
      <p>Public charitable trusts are governed by state-specific legislation where enacted (such as the Maharashtra Public Trusts Act, 1950 in Maharashtra and Gujarat, or the Rajasthan Public Trust Act) or executed through a registered Trust Deed before the jurisdictional Sub-Registrar of Assurances under the Registration Act, 1908 in states without separate public trust statutes.</p>
      <p>Crucially, trust deed registration establishes the entity, but does not automatically confer income tax exemptions. Charitable status for tax purposes requires separate application to the Income Tax Department: Form 10A for provisional/regular registration under Section 12AB (exemption of income) and Section 80G (tax deduction for eligible donors).</p>
    `,
    statutoryInfo: {
      governingAct: "State Public Trusts Acts (where applicable) / Indian Trusts Act, 1882 (Private Trusts); Registration Act, 1908; Income-tax Act, 1961",
      sections: "Section 17 Registration Act; Sections 11, 12, 12AB & 80G Income-tax Act",
      portal: "State Stamps & Registration Portal / Sub-Registrar Office; Income Tax e-Filing Portal (incometax.gov.in)",
      statutoryFee: "State-specific stamp duty on trust deed plus Sub-Registrar registration fees"
    },
    documentsRequired: [
      "Comprehensive Trust Deed drafted on state-appropriate non-judicial stamp paper specifying objects, trustees, and administrative powers",
      "PAN Card and Aadhaar Card of the Author / Settlor of the Trust",
      "PAN Card and Aadhaar Card of minimum two Trustees and Managing Trustee",
      "Passport size photographs of Settlor, all Trustees, and two independent witnesses",
      "Proof of Registered Trust Office: Electricity Bill (< 2 months old) + Landlord NOC + Commercial Rent Agreement or Ownership Proof",
      "Identity and address proofs of two independent witnesses present during Sub-Registrar registration",
      "Utility bill or bank passbook copy of the Settlor proving permanent residential address"
    ],
    processSteps: [
      "Trust Deed Drafting: Drafting the formal Trust Deed specifying trust name, registered office, settlor, trustees, powers, and explicit charitable objects (education, medical relief, relief of poverty).",
      "Stamp Duty Calculation & E-Stamping: Procurement of non-judicial stamp paper of appropriate state-specific valuation.",
      "Registration at Sub-Registrar Office: Physical execution and registration of the Trust Deed before the jurisdictional Sub-Registrar in the presence of two witnesses (or Charity Commissioner where applicable).",
      "Trust PAN & TAN Procurement: Applying for permanent PAN and TAN in the trust's registered legal name.",
      "Trust Bank Account Setup: Opening an operational current bank account under the trust's registered name.",
      "Section 12AB & 80G Tax Exemption Filing: Applying for tax exemption certificates on the Income Tax portal via Form 10A (separate procedure from trust formation)."
    ],
    benefits: [
      "Legal Standing to Hold Immovable Property and Manage Funds for Charitable Objectives",
      "Eligibility to Apply for Income Tax Exemption under Section 11 and 12AB",
      "Eligibility to Apply for Section 80G Approval to Offer Donor Tax Deductions",
      "Clear Governance Structure and Perpetual Institutional Operation"
    ],
    faqs: [
      {
        q: "Which law governs public charitable trusts in India?",
        a: "The Indian Trusts Act, 1882 governs private trusts and expressly excludes public charitable or religious trusts. Public charitable trusts are governed by state-specific Public Trusts Acts (e.g. in Maharashtra and Gujarat) or registered via a Trust Deed before the Sub-Registrar under the Registration Act, 1908 in states without separate public trust laws."
      },
      {
        q: "Does registering a Trust Deed automatically grant tax exemption?",
        a: "No. Registering the Trust Deed before the Sub-Registrar merely creates the legal entity. To secure income tax exemption on donations and income, the trust must separately apply to the Income Tax Department under Section 12AB and Section 80G using Form 10A on the e-Filing portal."
      },
      {
        q: "What is the minimum number of trustees required to register a trust?",
        a: "A public charitable trust generally requires a minimum of two trustees and one settlor (author of the trust). The settlor may also serve as a trustee. There is no statutory upper limit on the number of trustees unless specified in the trust deed."
      },
      {
        q: "What recurring annual compliances apply to registered charitable trusts?",
        a: "Registered trusts must: (1) Maintain books of accounts; (2) Obtain an audit report in Form 10B/10BB from a Chartered Accountant if income exceeds the basic exemption limit; (3) File annual income tax return in Form ITR-7 by the statutory due date; (4) Submit statement of donations in Form 10BD annually."
      }
    ]
  }
};
