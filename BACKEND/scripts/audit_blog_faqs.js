import fs from 'fs';
import path from 'path';

const blogsDir = 'd:/WEBSITE DEVELOPMENT/filingbycom/BACKEND/content/blogs';
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));

console.log(`Analyzing ${files.length} blog markdown files for template FAQs...\n`);

const clean = [];
const minor = [];
const strong = [];
const ymyl = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
  const slug = file.replace('.md', '');
  
  // Look for FAQ section
  const hasFaq = /## Frequently Asked Questions|## FAQs|### FAQs/i.test(content);
  
  // Check for common template strings
  const templateMatches = [
    'How long does',
    'Typically 3–7 working days',
    'Government fee varies',
    '100% online',
    'No physical visits are required',
    'consult a professional'
  ].filter(phrase => content.includes(phrase));

  // Determine YMYL relevance (tax, incorporation, trademark, government penalties)
  const isYmyl = /itr|tax|gst|penalty|fine|llp|incorporation|notice|director|audit|fssai/i.test(slug);

  if (templateMatches.length >= 3) {
    strong.push({ slug, matches: templateMatches });
  } else if (templateMatches.length >= 1) {
    minor.push({ slug, matches: templateMatches });
  } else {
    clean.push({ slug });
  }

  if (isYmyl && templateMatches.length >= 1) {
    ymyl.push({ slug, matches: templateMatches });
  }
}

console.log('=== BLOG FAQ INVENTORY SUMMARY ===');
console.log(`Clean (${clean.length}):`, clean.map(c => c.slug).slice(0, 5));
console.log(`Minor Template Issue (${minor.length}):`, minor.map(m => m.slug).slice(0, 5));
console.log(`Strong Template Duplication (${strong.length}):`, strong.map(s => s.slug).slice(0, 5));
console.log(`YMYL Update Needed (${ymyl.length}):`, ymyl.map(y => y.slug).slice(0, 5));

fs.writeFileSync(
  'd:/WEBSITE DEVELOPMENT/filingbycom/BACKEND/scripts/blog_faq_inventory.json',
  JSON.stringify({ clean, minor, strong, ymyl }, null, 2)
);
