import fs from 'fs';

function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/const SERVICE_SEO_OVERRIDES = \{([\s\S]*?)\n\};\n/);
  if (!match) return [];
  const block = match[1];
  const keys = [];
  const lines = block.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*"([a-z0-9-]+)":\s*\{/);
    if (m) keys.push(m[1]);
  }
  return keys;
}

const spKeys = extractKeys('d:/WEBSITE DEVELOPMENT/filingbycom/FRONTEND/src/features/ca-portal/pages/ServicePage.jsx');
const prKeys = extractKeys('d:/WEBSITE DEVELOPMENT/filingbycom/FRONTEND/scripts/prerender.js');

console.log('SERVICE_SEO_OVERRIDES in ServicePage.jsx (' + spKeys.length + '):', spKeys);
console.log('SERVICE_SEO_OVERRIDES in prerender.js (' + prKeys.length + '):', prKeys);
