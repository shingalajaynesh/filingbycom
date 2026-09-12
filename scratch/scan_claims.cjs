const fs = require('fs');

async function scanClaimsAndCreds() {
  const sitemapData = JSON.parse(fs.readFileSync('scratch/final_adsense_live_audit_results.json', 'utf8'));
  const urlsToScan = [
    'https://www.filingby.com/',
    'https://www.filingby.com/about-us',
    'https://www.filingby.com/contact-us',
    'https://www.filingby.com/our-promise',
    'https://www.filingby.com/customer-care',
    'https://www.filingby.com/faq',
    'https://www.filingby.com/editorial-team',
    'https://www.filingby.com/terms-conditions',
    'https://www.filingby.com/default/refund',
    'https://www.filingby.com/default/privacy-policy',
    'https://www.filingby.com/virtual-space',
    'https://www.filingby.com/locations',
    'https://www.filingby.com/ecommerce-office',
    ...sitemapData.coreServices.map(s => s.url),
    ...sitemapData.blogSample.map(b => b.url)
  ];

  console.log('Scanning', urlsToScan.length, 'key live pages...');
  const findings = {
    reviewedBy: [],
    instantApproval: [],
    guaranteed: [],
    moneyBack: [],
    panIndia: [],
    governmentApproved: [],
    caClaims: [],
    fcaClaims: [],
    csClaims: [],
    advocateClaims: [],
    reviewsSchema: [],
    aggregateRatingSchema: []
  };

  for (const url of urlsToScan) {
    const res = await fetch(url);
    const html = await res.text();
    
    // Check schemas
    if (html.includes('"aggregateRating"') || html.includes('"AggregateRating"')) {
      findings.aggregateRatingSchema.push(url);
    }
    if (html.includes('"review"') || html.includes('"Review"')) {
      findings.reviewsSchema.push(url);
    }

    // Check specific phrases
    const scanRegex = (regex, arr) => {
      const matches = [...html.matchAll(regex)];
      for (const m of matches) {
        const start = Math.max(0, m.index - 60);
        const end = Math.min(html.length, m.index + m[0].length + 60);
        const snippet = html.substring(start, end).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        arr.push({ url, match: m[0], snippet });
      }
    };

    scanRegex(/reviewed by/gi, findings.reviewedBy);
    scanRegex(/instant approval/gi, findings.instantApproval);
    scanRegex(/100% money[- ]back/gi, findings.moneyBack);
    scanRegex(/guaranteed approval/gi, findings.guaranteed);
    scanRegex(/pan[- ]india/gi, findings.panIndia);
    scanRegex(/government[- ]approved/gi, findings.governmentApproved);
    scanRegex(/\bFCA\b/g, findings.fcaClaims);
    scanRegex(/\bFCS\b/g, findings.csClaims);
  }

  console.log('Results Summary:');
  console.log('reviewedBy hits:', findings.reviewedBy.length);
  findings.reviewedBy.forEach(f => console.log(' -', f.url, ':', f.snippet));
  console.log('instantApproval hits:', findings.instantApproval.length);
  findings.instantApproval.forEach(f => console.log(' -', f.url, ':', f.snippet));
  console.log('guaranteedApproval hits:', findings.guaranteed.length);
  findings.guaranteed.forEach(f => console.log(' -', f.url, ':', f.snippet));
  console.log('moneyBack hits:', findings.moneyBack.length);
  findings.moneyBack.forEach(f => console.log(' -', f.url, ':', f.snippet));
  console.log('governmentApproved hits:', findings.governmentApproved.length);
  findings.governmentApproved.forEach(f => console.log(' -', f.url, ':', f.snippet));
  console.log('fcaClaims:', findings.fcaClaims.length);
  console.log('csClaims:', findings.csClaims.length);
  console.log('aggregateRatingSchema:', findings.aggregateRatingSchema);
  console.log('reviewsSchema:', findings.reviewsSchema);

  fs.writeFileSync('scratch/claims_scan_results.json', JSON.stringify(findings, null, 2), 'utf8');
}
scanClaimsAndCreds();
