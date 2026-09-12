const fs = require('fs');

const partnerHtml = fs.readFileSync('dist/partner-onboarding/index.html', 'utf8');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');

console.log('--- PARTNER ONBOARDING VERIFICATION ---');
console.log('Robots tag:', partnerHtml.match(/<meta name="robots"[^>]+>/i)?.[0]);
console.log('Googlebot tag:', partnerHtml.match(/<meta name="googlebot"[^>]+>/i)?.[0]);
console.log('Canonical:', partnerHtml.match(/<link rel="canonical"[^>]+>/i)?.[0]);
console.log('Exists in dist/sitemap.xml?:', sitemap.includes('partner-onboarding'));
