const { CORE_SERVICES_CONTENT } = require('../src/shared/data/coreServicesContent.js');

const services = Object.keys(CORE_SERVICES_CONTENT);
console.log(`Auditing numeric statutory claims across ${services.length} core services...\n`);

const rows = [];

for (const slug of services) {
  const s = CORE_SERVICES_CONTENT[slug];
  const allText = [
    s.overview,
    JSON.stringify(s.statutoryInfo),
    ...(s.documentsRequired || []),
    ...(s.processSteps || []),
    ...(s.benefits || []),
    ...(s.faqs || []).map(f => f.q + ' ' + f.a)
  ].join(' ');

  // Extract statements with numbers, rupees, days, months, percentages
  const sentences = allText.split(/(?<=[.?!])\s+/);
  for (const sentence of sentences) {
    const clean = sentence.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (/[₹\d%]|lakh|crore|days|month|year|section/i.test(clean)) {
      // Look for statutory statements
      if (/(threshold|turnover|investment|fee|penalty|due date|within \d+|section|rate|validity|delay|fine)/i.test(clean)) {
        rows.push({
          service: s.name,
          slug,
          text: clean
        });
      }
    }
  }
}

console.log(`Found ${rows.length} statutory numeric statements.`);
for (let i = 0; i < Math.min(rows.length, 30); i++) {
  console.log(`[${rows[i].service}] ${rows[i].text.substring(0, 120)}...`);
}
