const fs = require('fs');

function getEditorialWords(html) {
  const marker = '<div class="prerendered-content"';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return 0;
  
  const endMarker = '<div id="app-root">';
  const endIdx = html.indexOf(endMarker, startIdx);
  if (endIdx === -1) return 0;
  
  const rawBody = html.substring(startIdx, endIdx);
  // remove scripts, styles, json data, html tags
  const clean = rawBody
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
  return clean.trim().split(/\s+/).filter(w => w.length > 0).length;
}

const sampleBlogs = [
  'presumptive-taxation-44ad-44ada-guide',
  'tds-on-salary-vs-professional-fees-guide',
  'tds-on-professional-fees-contracts-rent-guide',
  'tax-audit-applicability-guide',
  'gst-registration-guide',
  'composition-vs-regular-gst-scheme',
  'gstr-1-vs-gstr-3b-reconciliation-guide',
  'gst-for-ecommerce-sellers-guide',
  'how-to-register-private-limited-company',
  'llp-vs-private-limited-for-bootstrapped-startups',
  'roc-compliance-calendar-private-limited-guide',
  'trademark-search-and-class-selection-guide',
  'trademark-objection-reply-guide',
  'trademark-renewal-restoration-guide',
  'fssai-basic-vs-state-vs-central-guide',
  'udyam-registration-for-service-business-guide',
  'startup-india-benefits-and-documents-guide',
  'iec-registration-for-first-time-exporters-guide',
  'virtual-office-for-gst-registration-guide',
  'virtual-office-for-company-registration-guide'
];

console.log("=== EDITORIAL BODY WORD COUNTS (EXCLUDING CHROME/SCRIPTS) ===");
for (const slug of sampleBlogs) {
  const filePath = `FRONTEND/dist/blog/${slug}/index.html`;
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const words = getEditorialWords(html);
    console.log(`${slug}: ${words} words`);
  } else {
    console.log(`${slug}: FILE NOT FOUND`);
  }
}
