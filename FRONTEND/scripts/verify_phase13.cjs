const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

console.log('--- 1. VERIFYING ALL 7 VIRTUAL OFFICE CITY PAGES ROBOTS META ---');
const cities = ['mumbai', 'surat', 'noida', 'gurugram', 'bangalore', 'pune', 'kolkata'];
for (const city of cities) {
  const filePath = path.join(distDir, `virtual-office-${city}/index.html`);
  if (!fs.existsSync(filePath)) {
    console.error(`FAIL: Missing ${filePath}`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const hasNoindexFollow = html.includes('<meta name="robots" content="noindex, follow" />');
  console.log(`City [${city}]: noindex, follow = ${hasNoindexFollow}`);
}

console.log('\n--- 2. VERIFYING ALL 10 VIRTUAL OFFICE AREA PAGES ROBOTS META ---');
const areas = [
  'virtual-office-mumbai/bkc',
  'virtual-office-surat/adajan',
  'virtual-office-surat/vesu',
  'virtual-office-surat/mota-varachha',
  'virtual-office-noida/sector-62',
  'virtual-office-gurugram/cyber-city',
  'virtual-office-bangalore/indiranagar',
  'virtual-office-pune/kharadi',
  'virtual-office-kolkata/salt-lake-sector-v',
  'virtual-office-kolkata/park-street'
];
for (const areaPath of areas) {
  const fullPath = path.join(distDir, `${areaPath}/index.html`);
  if (!fs.existsSync(fullPath)) {
    console.error(`FAIL: Missing ${fullPath}`);
    continue;
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const hasNoindexFollow = html.includes('<meta name="robots" content="noindex, follow" />');
  console.log(`Area [${areaPath}]: noindex, follow = ${hasNoindexFollow}`);
}

console.log('\n--- 3. VERIFYING CORE 14 SERVICES INDEXABILITY & CONTENT ---');
const coreServices = [
  'gst-registration',
  'gst-return-filing',
  'private-limited-company',
  'llp-registration',
  'one-person-company',
  'trademark-registration',
  'itr-1-filing',
  'fssai-basic-registration',
  'iec-registration',
  'udyam-registration',
  'roc-annual-filing-pvt',
  'trust-registration',
  'startup-india',
  'roc-annual-filing-llp'
];

for (const slug of coreServices) {
  const filePath = path.join(distDir, `services/${slug}/index.html`);
  if (!fs.existsSync(filePath)) {
    console.error(`FAIL: Missing service ${slug}`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const isIndex = html.includes('<meta name="robots" content="index, follow');
  const hasServiceSchema = html.includes('"@type":"Service"');
  const hasReview = html.includes('"review"') || html.includes('"Review"');
  const hasProduct = html.includes('"@type":"Product"');
  console.log(`Service [${slug}]: indexed = ${isIndex}, ServiceSchema = ${hasServiceSchema}, ProductSchema = ${hasProduct}, SyntheticReview = ${hasReview}`);
}

console.log('\n--- 4. VERIFYING SITEMAP EXCLUSIONS ---');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');

const checks = [
  { name: 'partner-onboarding excluded', pass: !sitemap.includes('partner-onboarding') },
  { name: 'virtual-office-surat excluded', pass: !sitemap.includes('virtual-office-surat') },
  { name: 'virtual-office-mumbai excluded', pass: !sitemap.includes('virtual-office-mumbai') },
  { name: 'virtual-office-bangalore excluded', pass: !sitemap.includes('virtual-office-bangalore') },
  { name: 'virtual-office-noida excluded', pass: !sitemap.includes('virtual-office-noida') },
  { name: 'virtual-office-gurugram excluded', pass: !sitemap.includes('virtual-office-gurugram') },
  { name: 'virtual-office-pune excluded', pass: !sitemap.includes('virtual-office-pune') },
  { name: 'virtual-office-kolkata excluded', pass: !sitemap.includes('virtual-office-kolkata') },
  { name: 'virtual-space included', pass: sitemap.includes('/virtual-space') },
  { name: 'locations included', pass: sitemap.includes('/locations') },
  { name: 'ecommerce-office included', pass: sitemap.includes('/ecommerce-office') },
  { name: 'gst-registration included', pass: sitemap.includes('/services/gst-registration') }
];
for (const check of checks) {
  console.log(`${check.name}: ${check.pass ? 'PASS' : 'FAIL'}`);
}

console.log('\n--- 5. VERIFYING ADS.TXT, ROBOTS.TXT, 404.HTML ---');
const adsTxt = fs.readFileSync(path.join(distDir, 'ads.txt'), 'utf8');
const robotsTxt = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
const has404 = fs.existsSync(path.join(distDir, '404.html'));

console.log('ads.txt has publisher ID pub-6303291083449043:', adsTxt.includes('pub-6303291083449043'));
console.log('robots.txt points to sitemap:', robotsTxt.includes('Sitemap: https://www.filingby.com/sitemap.xml'));
console.log('404.html exists in dist root:', has404);
