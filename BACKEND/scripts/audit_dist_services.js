import fs from 'fs';
import path from 'path';

const distDir = 'd:/WEBSITE DEVELOPMENT/filingbycom/FRONTEND/dist/services';

const coreSlugs = [
  'gst-registration',
  'gst-return-filing',
  'private-limited-company',
  'llp-registration',
  'one-person-company',
  'trademark-registration',
  'itr-1-filing',
  'fssai-basic-registration',
  'udyam-registration',
  'iec-registration',
  'startup-india',
  'roc-annual-filing-pvt',
  'roc-annual-filing-llp',
  'trust-registration'
];

function countVisibleWords(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const noScript = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                       .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  return noScript.split(/\s+/).filter(Boolean).length;
}

console.log('SLUG | RAW HTML WORDS | PRERENDERED META ROBOTS');
console.log('--------------------------------------------------');
for (const slug of coreSlugs) {
  const filePath = path.join(distDir, slug, 'index.html');
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const wc = countVisibleWords(html);
    const robots = (html.match(/<meta name="robots" content="([^"]+)"/i) || [])[1];
    console.log(`${slug} | ${wc} words | ${robots}`);
  } else {
    console.log(`${slug} | NOT FOUND | -`);
  }
}
