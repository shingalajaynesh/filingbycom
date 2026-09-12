const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

const udyamHtml = fs.readFileSync(path.join(distDir, 'services/udyam-registration/index.html'), 'utf8');
const fssaiHtml = fs.readFileSync(path.join(distDir, 'services/fssai-basic-registration/index.html'), 'utf8');

console.log('=== UDYAM REGISTRATION AUDIT ===');
console.log('Title has Guidance/Support:', /Guidance/i.test(udyamHtml) && /Support/i.test(udyamHtml));
console.log('H1:', udyamHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]);
console.log('Contains Official portal link (udyamregistration.gov.in):', udyamHtml.includes('udyamregistration.gov.in'));
console.log('Contains ₹0 government fee:', udyamHtml.includes('₹0'));
console.log('Contains post-2025 thresholds (₹2.5, ₹25, ₹125):', udyamHtml.includes('2.5 Crore') && udyamHtml.includes('25 Crore') && udyamHtml.includes('125 Crore'));
console.log('Schema @type Service present:', udyamHtml.includes('"@type":"Service"'));
console.log('Schema Name:', udyamHtml.match(/"name":"(MSME Classification &amp; Udyam Guidance|MSME Classification & Udyam Guidance|.*?)"/)?.[1]);
console.log('No annual renewal stated:', /permanent and does not require periodic renewal/i.test(udyamHtml));
console.log('Explicitly states FilingBy not authorized:', /not affiliated with or authorized by the Ministry of MSME/i.test(udyamHtml));

console.log('\n=== FSSAI REGISTRATION AUDIT ===');
console.log('H1:', fssaiHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]);
console.log('Turnover threshold ₹1.5 Crore:', fssaiHtml.includes('1.5 Crore'));
console.log('State Licence ₹50 Crore threshold:', fssaiHtml.includes('50 Crore'));
console.log('Perpetual validity explained:', /perpetual validity/i.test(fssaiHtml));
console.log('Distinguishes validity vs fee obligation:', /perpetual validity does not mean food licensing is fee-free|statutory fee obligations/i.test(fssaiHtml));
console.log('FoSCoS fee schedule mentioned:', /FoSCoS/i.test(fssaiHtml));
console.log('FilingBy fee separated from Govt fee:', /Separate from FilingBy/i.test(fssaiHtml) || /separate.*professional/i.test(fssaiHtml));

console.log('\n=== BANNED PHRASES SEARCH IN DIST ===');
const distFiles = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full);
    else if (f.name.endsWith('.html') || f.name.endsWith('.js') || f.name.endsWith('.json')) distFiles.push(full);
  }
}
walk(distDir);
console.log('Total files checked in dist:', distFiles.length);

const banned = [
  { name: 'application-filing assistance', regex: /application-filing assistance/i },
  { name: 'Udyam filing service', regex: /udyam filing service/i },
  { name: 'our udyam registration fee', regex: /our udyam registration fee/i },
  { name: 'authorized Udyam provider', regex: /authorized udyam/i },
  { name: 'official Udyam service (by FilingBy)', regex: /official udyam service/i },
  { name: 'lifetime free FSSAI', regex: /lifetime free fssai/i },
  { name: 'no future fee (FSSAI)', regex: /no future fee/i },
  { name: 'no renewal fee (FSSAI)', regex: /no renewal fee/i },
  { name: 'Finance Act 2024 (income tax attribution)', regex: /Finance Act,? 2024/i }
];

let bannedFound = 0;
for (const file of distFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const b of banned) {
    if (b.regex.test(content)) {
      console.log('FLAGGED in ' + path.relative(distDir, file) + ' for: ' + b.name);
      bannedFound++;
    }
  }
}
console.log('Total banned phrase violations found in dist:', bannedFound);
