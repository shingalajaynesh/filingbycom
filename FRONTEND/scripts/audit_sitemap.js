import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitemapPath = path.join(__dirname, '../dist/sitemap.xml');

const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

console.log(`TOTAL URLS IN SITEMAP: ${urls.length}\n`);

const breakdown = {
  core: [],
  services: [],
  blogs: [],
  tools_resources: [],
  virtual_office: [],
  legal_trust: [],
  other: []
};

for (const url of urls) {
  const p = url.replace('https://www.filingby.com', '');
  if (p.startsWith('/services/')) {
    breakdown.services.push(p);
  } else if (p.startsWith('/blog/')) {
    breakdown.blogs.push(p);
  } else if (p.startsWith('/virtual-office-') || p === '/virtual-space' || p === '/locations' || p === '/ecommerce-office' || p === '/virtual-office-ecommerce') {
    breakdown.virtual_office.push(p);
  } else if (p.startsWith('/gst-calculator') || p.startsWith('/income-tax-calculator') || p.startsWith('/roc-tools') || p.startsWith('/company-registration-guides') || p.startsWith('/trademark-search') || p.startsWith('/legal-templates') || p.startsWith('/calculators/') || p.startsWith('/compare/') || p.startsWith('/hubs/')) {
    breakdown.tools_resources.push(p);
  } else if (p.startsWith('/default/') || p === '/terms-conditions' || p === '/contact-us' || p === '/editorial-team' || p === '/about-us' || p === '/our-promise' || p === '/customer-care' || p === '/faq') {
    breakdown.legal_trust.push(p);
  } else if (p === '' || p === '/' || p === '/blog') {
    breakdown.core.push(p);
  } else {
    breakdown.other.push(p);
  }
}

console.log('SITEMAP BREAKDOWN:');
console.log(`- Core Pages: ${breakdown.core.length}`);
console.log(`- Approved Indexable Services: ${breakdown.services.length}`);
console.log(`- Substantive Articles (Blogs): ${breakdown.blogs.length}`);
console.log(`- Tools & Resources: ${breakdown.tools_resources.length}`);
console.log(`- Virtual Office Pages: ${breakdown.virtual_office.length}`);
console.log(`- Legal & Trust Pages: ${breakdown.legal_trust.length}`);
console.log(`- Other / Uncategorized: ${breakdown.other.length}`);
console.log(`TOTAL EXACT COUNT: ${urls.length}`);

console.log('\nServices List:');
console.log(breakdown.services);
