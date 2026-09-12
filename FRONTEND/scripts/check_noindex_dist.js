import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

const nonCore = ['gst-cancellation', 'pan-card', 'tan-registration', 'trademark-objection', 'payroll-management', 'import-export-code-modification'];

console.log('CHECKING REPRESENTATIVE NON-CORE SERVICES IN DIST:\n');
for (const slug of nonCore) {
  const f = path.join(distDir, 'services', slug, 'index.html');
  if (fs.existsSync(f)) {
    const html = fs.readFileSync(f, 'utf8');
    const robots = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i)?.[1] || 'NONE';
    const sitemapPresent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8').includes(`/services/${slug}`);
    console.log(`${slug}: robots="${robots}" | in sitemap: ${sitemapPresent ? 'YES (FAIL)' : 'NO (PASSED)'}`);
  } else {
    console.log(`${slug}: NOT FOUND in dist`);
  }
}
