export const navData = [
  {
    id: 'company-registration',
    label: 'Company Registration',
    icon: '🏢',
    sections: [
      {
        heading: 'Incorporation',
        items: [
          { label: 'Private Limited Company', slug: 'private-limited-company' },
          { label: 'LLP Registration', slug: 'llp-registration' },
          { label: 'One Person Company', slug: 'one-person-company' },
          { label: 'Public Limited Company', slug: 'public-limited-company' },
          { label: 'Section 8 Company', slug: 'section-8-company' },
          { label: 'Nidhi Company', slug: 'nidhi-company' },
          { label: 'Partnership Firm', slug: 'partnership-firm' },
          { label: 'Sole Proprietorship', slug: 'sole-proprietorship' },
          { label: 'Producer Company', slug: 'producer-company' },
          { label: 'Indian Subsidiary', slug: 'indian-subsidiary' },
          { label: 'Foreign Company', slug: 'foreign-company-registration' },
        ],
      },
      {
        heading: 'Conversions',
        items: [
          { label: 'OPC to Pvt Limited', slug: 'opc-to-pvt-conversion' },
          { label: 'Pvt to Public Limited', slug: 'pvt-to-public-conversion' },
          { label: 'LLP to Pvt Limited', slug: 'llp-to-pvt-conversion' },
          { label: 'Proprietorship to Pvt Ltd', slug: 'proprietorship-to-pvt' },
        ],
      },
      {
        heading: 'Winding Up',
        items: [
          { label: 'Pvt Ltd Winding Up', slug: 'pvt-winding-up' },
          { label: 'LLP Winding Up', slug: 'llp-winding-up' },
          { label: 'Section 8 Winding Up', slug: 'section8-winding-up' },
        ],
      },
    ],
  },
  {
    id: 'gst-services',
    label: 'GST Services',
    icon: '📋',
    sections: [
      {
        heading: 'Registration',
        items: [
          { label: 'GST Registration', slug: 'gst-registration' },
          { label: 'GST Registration for Foreigners', slug: 'gst-registration-foreigners' },
        ],
      },
      {
        heading: 'Filing & Returns',
        items: [
          { label: 'GST Return Filing', slug: 'gst-return-filing' },
          { label: 'GST Nil Return Filing', slug: 'gst-nil-return-filing' },
          { label: 'GSTR-9 Annual Return', slug: 'gstr-9-annual-filing' },
          { label: 'GST TDS Return', slug: 'gst-tds-return' },
          { label: 'GST ITC-04 Filing', slug: 'gst-itc04-filing' },
        ],
      },
      {
        heading: 'Other GST',
        items: [
          { label: 'GST Amendment', slug: 'gst-modification' },
          { label: 'GST Cancellation', slug: 'gst-cancellation' },
          { label: 'GST Revocation', slug: 'gst-revocation' },
          { label: 'GST LUT Filing', slug: 'gst-lut-filing' },
          { label: 'GST E-Way Bill', slug: 'gst-eway-bill' },
          { label: 'GST Audit', slug: 'gst-audit' },
          { label: 'GST Notice Reply', slug: 'gst-notice-reply' },
        ],
      },
    ],
  },
  {
    id: 'income-tax',
    label: 'Income Tax',
    icon: '💰',
    sections: [
      {
        heading: 'ITR Filing',
        items: [
          { label: 'ITR-1 Salaried Individual', slug: 'itr-1-filing' },
          { label: 'ITR-2 Capital Gains', slug: 'itr-2-filing' },
          { label: 'ITR-3 Business/Profession', slug: 'itr-3-filing' },
          { label: 'ITR-4 Presumptive Income', slug: 'itr-4-filing' },
          { label: 'ITR-5 LLP/Firms', slug: 'itr-5-filing' },
          { label: 'ITR-6 Companies', slug: 'itr-6-filing' },
          { label: 'ITR-7 Trusts/NGOs', slug: 'itr-7-filing' },
          { label: 'Belated / Revised ITR', slug: 'belated-revised-itr' },
        ],
      },
      {
        heading: 'TDS',
        items: [
          { label: 'TDS Return Filing', slug: 'tds-return-filing' },
          { label: 'Form 16 (TDS Certificate)', slug: 'form-16' },
          { label: 'Lower TDS Certificate', slug: 'lower-tds-certificate' },
          { label: 'Form 15CA / 15CB', slug: 'form-15ca-15cb' },
          { label: 'TAN Registration', slug: 'tan-registration' },
        ],
      },
      {
        heading: 'Tax Planning',
        items: [
          { label: 'Tax Planning & Consultancy', slug: 'tax-planning' },
          { label: 'Tax Audit (3CB-3CD)', slug: 'tax-audit' },
          { label: 'Transfer Pricing', slug: 'transfer-pricing' },
          { label: 'Income Tax Notice Reply', slug: 'income-tax-notice-reply' },
        ],
      },
    ],
  },
  {
    id: 'trademark-ip',
    label: 'Trademark & IP',
    icon: '™️',
    sections: [
      {
        heading: 'Trademark',
        items: [
          { label: 'Trademark Registration', slug: 'trademark-registration' },
          { label: 'Trademark Search', slug: 'trademark-search' },
          { label: 'Trademark Renewal', slug: 'trademark-renewal' },
          { label: 'Trademark Objection Reply', slug: 'trademark-objection' },
          { label: 'Trademark Opposition', slug: 'trademark-opposition' },
          { label: 'Trademark Assignment', slug: 'trademark-assignment' },
          { label: 'Trademark Withdrawal', slug: 'trademark-withdrawal' },
          { label: 'Series Trademark', slug: 'series-trademark' },
          { label: 'International Trademark', slug: 'international-trademark' },
        ],
      },
      {
        heading: 'Copyright & Patent',
        items: [
          { label: 'Copyright Registration', slug: 'copyright-registration' },
          { label: 'Patent Filing (Provisional)', slug: 'patent-provisional' },
          { label: 'Patent Filing (Complete)', slug: 'patent-complete' },
          { label: 'Design Registration', slug: 'design-registration' },
        ],
      },
      {
        heading: 'Branding',
        items: [
          { label: 'Logo Design', slug: 'logo-design' },
          { label: 'Brand Name Search', slug: 'brand-name-search' },
        ],
      },
    ],
  },
  {
    id: 'licenses',
    label: 'Licenses',
    icon: '📜',
    sections: [
      {
        heading: 'Food & Health',
        items: [
          { label: 'FSSAI Basic Registration', slug: 'fssai-basic-registration' },
          { label: 'FSSAI State License', slug: 'fssai-state-license' },
          { label: 'FSSAI Central License', slug: 'fssai-central-license' },
          { label: 'FSSAI Renewal', slug: 'fssai-renewal' },
          { label: 'FSSAI Modification', slug: 'fssai-modification' },
          { label: 'FSSAI Annual Return', slug: 'fssai-annual-return' },
          { label: 'Drug License', slug: 'drug-license' },
          { label: 'Ayush License', slug: 'ayush-license' },
        ],
      },
      {
        heading: 'Import / Export',
        items: [
          { label: 'Import Export Code (IEC)', slug: 'iec-registration' },
          { label: 'IEC Modification', slug: 'iec-modification' },
          { label: 'IEC Surrender', slug: 'iec-surrender' },
          { label: 'AD Code Registration', slug: 'ad-code-registration' },
        ],
      },
      {
        heading: 'MSME & Startup',
        items: [
          { label: 'MSME / Udyam Registration', slug: 'udyam-registration' },
          { label: 'Startup India Registration', slug: 'startup-india' },
          { label: 'DPIIT Recognition', slug: 'dpiit-recognition' },
        ],
      },
      {
        heading: 'Other Licenses',
        items: [
          { label: 'Shop & Establishment', slug: 'shop-establishment' },
          { label: 'Professional Tax Reg.', slug: 'professional-tax' },
          { label: 'BIS Certification', slug: 'bis-certification' },
          { label: 'ISO Certification', slug: 'iso-certification' },
          { label: 'APEDA Registration', slug: 'apeda-registration' },
          { label: 'Spice Board Registration', slug: 'spice-board-registration' },
          { label: 'ESI Registration', slug: 'esi-registration' },
          { label: 'PF Registration', slug: 'pf-registration' },
        ],
      },
    ],
  },
  {
    id: 'mca-compliance',
    label: 'MCA / ROC',
    icon: '🏛️',
    sections: [
      {
        heading: 'Annual Filings',
        items: [
          { label: 'ROC Filing (Pvt Ltd)', slug: 'roc-annual-filing-pvt' },
          { label: 'ROC Filing (LLP)', slug: 'roc-annual-filing-llp' },
          { label: 'ROC Filing (OPC)', slug: 'roc-annual-filing-opc' },
          { label: 'MGT-7 Annual Return', slug: 'mgt7-filing' },
          { label: 'AOC-4 Financial Statement', slug: 'aoc4-filing' },
        ],
      },
      {
        heading: 'Director Compliance',
        items: [
          { label: 'Director KYC (DIN eKYC)', slug: 'din-ekyc' },
          { label: 'Appointment of Director', slug: 'director-appointment' },
          { label: 'Removal of Director', slug: 'director-removal' },
          { label: 'Change in Designation', slug: 'director-designation-change' },
          { label: 'DSC Registration', slug: 'dsc-registration' },
        ],
      },
      {
        heading: 'Company Changes',
        items: [
          { label: 'Increase Authorized Capital', slug: 'increase-authorized-capital' },
          { label: 'Change Company Name', slug: 'change-company-name' },
          { label: 'Change Registered Office', slug: 'change-registered-office' },
          { label: 'MOA Amendment', slug: 'moa-amendment' },
          { label: 'AOA Amendment', slug: 'aoa-amendment' },
          { label: 'Share Transfer', slug: 'share-transfer' },
          { label: 'Share Allotment', slug: 'share-allotment' },
          { label: 'DPT-3 Filing', slug: 'dpt3-filing' },
          { label: 'ADT-1 Auditor Appointment', slug: 'adt1-filing' },
        ],
      },
    ],
  },
  {
    id: 'payroll-hr',
    label: 'Payroll & HR',
    icon: '💼',
    sections: [
      {
        heading: 'Payroll Services',
        items: [
          { label: 'Payroll Processing', slug: 'payroll-processing' },
          { label: 'PF Return Filing', slug: 'pf-return-filing' },
          { label: 'ESI Return Filing', slug: 'esi-return-filing' },
          { label: 'Professional Tax Filing', slug: 'professional-tax-filing' },
          { label: 'TDS on Salary (24Q)', slug: 'tds-salary-24q' },
          { label: 'Labour Compliance', slug: 'labour-compliance' },
          { label: 'HR Policy Drafting', slug: 'hr-policy' },
        ],
      },
    ],
  },
  {
    id: 'accounting-audit',
    label: 'Accounting & Audit',
    icon: '📊',
    sections: [
      {
        heading: 'Accounting',
        items: [
          { label: 'Bookkeeping Services', slug: 'bookkeeping' },
          { label: 'Annual Compliance + Bookkeeping', slug: 'annual-compliance-bookkeeping' },
          { label: 'Virtual CFO Services', slug: 'virtual-cfo' },
          { label: 'Project Report', slug: 'project-report' },
          { label: 'CMA Data Preparation', slug: 'cma-data' },
          { label: 'MSME Loan Consultancy', slug: 'msme-loan' },
        ],
      },
      {
        heading: 'Audit',
        items: [
          { label: 'Statutory Audit', slug: 'statutory-audit' },
          { label: 'Internal Audit', slug: 'internal-audit' },
          { label: 'Stock Audit', slug: 'stock-audit' },
          { label: 'Concurrent Audit', slug: 'concurrent-audit' },
        ],
      },
    ],
  },
  {
    id: 'legal-services',
    label: 'Legal Services',
    icon: '⚖️',
    sections: [
      {
        heading: 'Agreement Drafting',
        items: [
          { label: 'MOU Drafting', slug: 'mou-drafting' },
          { label: 'NDA Agreement', slug: 'nda-drafting' },
          { label: 'Employment Agreement', slug: 'employment-agreement' },
          { label: 'Franchise Agreement', slug: 'franchise-agreement' },
          { label: 'Rent Agreement', slug: 'rent-agreement' },
          { label: 'Sale Deed', slug: 'sale-deed' },
          { label: 'Partnership Deed', slug: 'partnership-deed' },
          { label: 'Shareholders Agreement', slug: 'shareholders-agreement' },
        ],
      },
      {
        heading: 'Notices & Recovery',
        items: [
          { label: 'Legal Notice', slug: 'legal-notice' },
          { label: 'Reply to Legal Notice', slug: 'legal-notice-reply' },
          { label: 'Cheque Bounce Notice', slug: 'cheque-bounce-notice' },
          { label: 'Debt Recovery', slug: 'debt-recovery' },
        ],
      },
      {
        heading: 'Other Legal',
        items: [
          { label: 'Power of Attorney', slug: 'power-of-attorney' },
          { label: 'Affidavit', slug: 'affidavit' },
          { label: 'Will Drafting', slug: 'will-drafting' },
          { label: 'Online Dispute Resolution', slug: 'odr' },
        ],
      },
    ],
  },
  {
    id: 'ngo-trust',
    label: 'NGO & Trust',
    icon: '🏥',
    sections: [
      {
        heading: 'Registration',
        items: [
          { label: 'Trust Registration', slug: 'trust-registration' },
          { label: 'Society Registration', slug: 'society-registration' },
          { label: 'Section 8 Company', slug: 'section-8-company' },
          { label: 'NGO Darpan Registration', slug: 'ngo-darpan' },
        ],
      },
      {
        heading: 'Tax Exemptions',
        items: [
          { label: '12A Registration', slug: '12a-registration' },
          { label: '80G Registration', slug: '80g-registration' },
          { label: 'CSR Registration', slug: 'csr-registration' },
          { label: 'FCRA Registration', slug: 'fcra-registration' },
        ],
      },
    ],
  },
];
