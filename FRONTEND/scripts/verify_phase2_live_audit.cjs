const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.filingby.com';

const BOILERPLATE_CLUSTERS = [
  "Another reason this topic matters is that many businesses in India move from informal working to structured compliance",
  "That is exactly why the article is written in a business-first way rather than a purely technical one",
  "distinguish between what is legally required, what is commercially smart and what is simply good housekeeping",
  "A founder should therefore ask three questions very early",
  "This is where long-term thinking matters",
  "one compliance task often overlaps with another",
  "The comparison above matters because many business owners default to the path that looks easiest in the short term",
  "At this stage, speed matters less than factual clarity",
  "This step works best when finance, operations and the authorised signatory are aligned",
  "Most avoidable queries at this point come from inconsistent supporting records"
];

const TEMPLATE_PHRASES = [
  "only relevant when a deadline arrives",
  "simple internal checklist showing what is being filed",
  "How long does this take?",
  "What documents do I need?",
  "What happens if there is a delay?",
  "Can I do this online?",
  "Is this mandatory for my business?",
  "Typically 3–7 working days",
  "Typically 3-7 working days",
  "Government fee varies",
  "100% online",
  "No physical visits are required",
  "Scenario one is the urgent external trigger",
  "Scenario two is the growth transition",
  "How to keep this useful over the next five years",
  "The right way to handle",
  "consult a professional to avoid penalties",
  "move from informal working to structured compliance",
  "business-first way rather than a purely technical one",
  "speed matters less than factual clarity",
  "works best when finance, operations and the authorised signatory",
  "Most avoidable queries at this point come from inconsistent",
  "three questions very early",
  "long-term thinking matters",
  "default to the path that looks easiest",
  "one compliance task often overlaps with another",
  "A simple internal checklist",
  "legally required, what is commercially smart",
  "purely technical one",
  "informal working to structured compliance"
];

const CORE_SERVICES = [
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

const GEO_PAGES = [
  'virtual-office-mumbai',
  'virtual-office-surat',
  'virtual-office-noida',
  'virtual-office-gurugram',
  'virtual-office-bangalore',
  'virtual-office-pune',
  'virtual-office-kolkata',
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

async function fetchUrl(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'Cache-Control': 'no-cache', ...(options.headers || {}) },
      redirect: 'manual'
    });
    const text = await res.text();
    return {
      ok: true,
      status: res.status,
      headers: res.headers,
      text,
      location: res.headers.get('location')
    };
  } catch (err) {
    return { ok: false, error: err.message, status: 0, text: '' };
  }
}

async function runLiveAudit() {
  console.log('================================================================');
  console.log(' PHASE 2 PRODUCTION LIVE VERIFICATION AUDIT');
  console.log(' Target Domain: ' + SITE_URL);
  console.log(' Timestamp:     ' + new Date().toISOString());
  console.log('================================================================\n');

  // 1. Root & Deployment Header Check
  console.log('[1] PRODUCTION DEPLOYMENT & HEADERS:');
  const rootRes = await fetchUrl(SITE_URL + '/');
  console.log(`    - Status:       ${rootRes.status}`);
  console.log(`    - Server:       ${rootRes.headers.get('server') || 'N/A'}`);
  console.log(`    - x-vercel-id:  ${rootRes.headers.get('x-vercel-id') || 'N/A'}`);
  console.log(`    - Age:          ${rootRes.headers.get('age') || '0'}`);
  console.log(`    - Date:         ${rootRes.headers.get('date') || 'N/A'}`);

  // 2. Blog Directory Page Check
  console.log('\n[2] LIVE BLOG DIRECTORY (/blog):');
  const blogDirRes = await fetchUrl(SITE_URL + '/blog');
  console.log(`    - HTTP Status: ${blogDirRes.status}`);
  const blogLinksMatches = blogDirRes.text.match(/href="\/blog\/([a-z0-9-]+)"/g) || [];
  const liveBlogSlugs = Array.from(new Set(blogLinksMatches.map(m => m.replace(/href="\/blog\/|\"/g, ''))));
  console.log(`    - Article links discoverable in initial HTML: ${liveBlogSlugs.length} / 60`);
  const hasCategories = blogDirRes.text.includes('Income Tax') && 
                        blogDirRes.text.includes('GST Compliance') && 
                        blogDirRes.text.includes('Company Registration');
  console.log(`    - Useful category navigation: ${hasCategories ? 'YES' : 'NO'}`);
  const hasHiddenInventory = blogDirRes.text.includes('display: none') && blogDirRes.text.includes('/blog/');
  console.log(`    - No crawler-only hidden article inventory: ${!hasHiddenInventory ? 'PASS' : 'FAIL'}`);
  const hasFakeReviewerDir = /Reviewed by|Chartered Accountant|FCA|Hiren Patel/i.test(blogDirRes.text);
  console.log(`    - Zero fake reviewer labels: ${!hasFakeReviewerDir ? 'PASS' : 'FAIL'}`);

  // Read local markdown files to compare all 60 slugs
  const mdDir = path.join(__dirname, '../../BACKEND/content/blogs');
  const mdFiles = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));
  const allExpectedSlugs = mdFiles.map(f => f.replace('.md', ''));

  // 3. Live 60-Blog Programmatic Audit
  console.log('\n[3] PROGRAMMATIC AUDIT OF ALL 60 LIVE BLOG ARTICLES:');
  console.log('| Slug | HTTP | Robots | Canonical | BlogPosting | Author | datePublished | dateModified | References | Status |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');

  let passedArticles = 0;
  let liveBoilerplateHits = 0;
  let liveTemplateHits = 0;
  let liveFakeExpertHits = 0;

  const articleResults = [];

  for (const slug of allExpectedSlugs) {
    const url = `${SITE_URL}/blog/${slug}`;
    const res = await fetchUrl(url);
    const html = res.text;

    const is200 = res.status === 200;
    const robotsMatch = (html.match(/<meta name="robots" content="([^"]+)"/i) || [])[1];
    const isIndexed = robotsMatch && robotsMatch.includes('index') && !robotsMatch.includes('noindex');

    const canonicalExpected = `https://www.filingby.com/blog/${slug}`;
    const hasSelfCanonical = html.includes(`href="${canonicalExpected}"`) || html.includes(`rel="canonical" href="${canonicalExpected}"`);

    const hasBlogPosting = html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"');
    const hasOrgAuthor = html.includes('"name":"FilingBy Editorial Team"') || html.includes('"name": "FilingBy Editorial Team"');
    const hasPublisher = html.includes('"name":"FilingBy"') || html.includes('"name": "FilingBy"');

    const datePublishedMatch = (html.match(/"datePublished":"([^"]+)"/) || [])[1];
    const dateModifiedMatch = (html.match(/"dateModified":"([^"]+)"/) || [])[1];
    const hasValidDates = !!(datePublishedMatch && dateModifiedMatch && datePublishedMatch.startsWith('2026'));

    const hasOfficialRefs = html.includes('Official References') || html.includes('https://');

    // Fake expert check
    const hasFakeReviewer = /Reviewed by\s*:\s*(?:Chartered Accountant|CA|CS|FCA|Hiren Patel)/i.test(html) ||
                            /"reviewer"/i.test(html) ||
                            /15\+\s*Years Experience/i.test(html);
    if (hasFakeReviewer) liveFakeExpertHits++;

    // Boilerplate scan
    for (const b of BOILERPLATE_CLUSTERS) {
      if (html.includes(b)) liveBoilerplateHits++;
    }
    // Template scan
    for (const t of TEMPLATE_PHRASES) {
      if (html.includes(t)) liveTemplateHits++;
    }

    const pass = is200 && isIndexed && hasSelfCanonical && hasBlogPosting && hasOrgAuthor && hasPublisher && hasValidDates && !hasFakeReviewer;
    if (pass) passedArticles++;

    articleResults.push({
      slug,
      status: res.status,
      robots: isIndexed ? 'index, follow' : robotsMatch,
      canonical: hasSelfCanonical ? 'MATCH' : 'MISMATCH',
      blogPosting: hasBlogPosting ? 'YES' : 'NO',
      author: hasOrgAuthor ? 'FilingBy Editorial Team' : 'OTHER',
      datePublished: datePublishedMatch || 'MISSING',
      dateModified: dateModifiedMatch || 'MISSING',
      references: hasOfficialRefs ? 'YES' : 'NO',
      result: pass ? 'PASS' : 'FAIL',
      html
    });

    console.log(`| ${slug} | ${res.status} | ${isIndexed ? 'index, follow' : robotsMatch} | ${hasSelfCanonical ? 'SELF' : 'FAIL'} | ${hasBlogPosting ? 'YES' : 'NO'} | ${hasOrgAuthor ? 'Editorial Team' : 'OTHER'} | ${datePublishedMatch?.split('T')[0] || 'N/A'} | ${dateModifiedMatch?.split('T')[0] || 'N/A'} | ${hasOfficialRefs ? 'YES' : 'NO'} | ${pass ? 'PASS' : 'FAIL'} |`);
  }

  console.log(`\n    Total Audited: ${allExpectedSlugs.length} | Passed: ${passedArticles} / 60`);

  // 4. Live Boilerplate & Fake Expert Results
  console.log('\n[4] LIVE BOILERPLATE & FAKE-EXPERT SCAN:');
  console.log(`    - Prohibited Boilerplate Cluster Hits: ${liveBoilerplateHits}`);
  console.log(`    - Prohibited Template Phrase Hits:    ${liveTemplateHits}`);
  console.log(`    - Synthetic Reviewer / Fake CA Hits:   ${liveFakeExpertHits}`);

  // 5. Live TDS Critical Pages
  console.log('\n[5] LIVE TDS CRITICAL PAGES VERIFICATION:');

  // A. tds-on-professional-fees-contracts-rent-guide
  const tdsProfHtml = (articleResults.find(a => a.slug === 'tds-on-professional-fees-contracts-rent-guide') || {}).html || '';
  const prof194H = tdsProfHtml.includes('2%') && tdsProfHtml.includes('₹20,000');
  const prof194M = tdsProfHtml.includes('2%') && tdsProfHtml.includes('₹50,00,000');
  const prof194IB = tdsProfHtml.includes('2%') && tdsProfHtml.includes('₹50,000 per month or part of a month');
  const prof194I_Plant = tdsProfHtml.includes('Plant') && tdsProfHtml.includes('2%') && tdsProfHtml.includes('₹50,000 per month or part of a month');
  const prof194I_Land = tdsProfHtml.includes('Land') && tdsProfHtml.includes('10%') && tdsProfHtml.includes('₹50,000 per month or part of a month');
  const prof194I_No24L = !/194-I[^\n]*aggregate > ₹2\.4L/i.test(tdsProfHtml);
  const prof194A = tdsProfHtml.includes('Bank / Co-operative Bank / Post-Office Interest') && 
                   tdsProfHtml.includes('₹50,000') && 
                   tdsProfHtml.includes('₹1,00,000') &&
                   tdsProfHtml.includes('₹10,000');
  const profSalary = tdsProfHtml.includes('Section 392(1)') && 
                     tdsProfHtml.includes('Average rate on estimated taxable salary using rates in force') &&
                     tdsProfHtml.includes('up to ₹4,00,000');
  const profForm141 = tdsProfHtml.includes('Form 141') && tdsProfHtml.includes('01.04.2026');

  console.log(`    - tds-on-professional-fees-contracts-rent-guide:`);
  console.log(`      * Section 194H (2%, ₹20k):                                    ${prof194H ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194M (2%, ₹50L):                                    ${prof194M ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194-IB (2%):                                        ${prof194IB ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194-I Plant & Machinery (2%, ₹50k/mo, no ₹2.4L):   ${prof194I_Plant && prof194I_No24L ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194-I Land & Building (10%, ₹50k/mo, no ₹2.4L):     ${prof194I_Land && prof194I_No24L ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194A (Bank ₹50k/₹1L senior & Other ₹10k):          ${prof194A ? 'PASS' : 'FAIL'}`);
  console.log(`      * Salary TDS (Section 392(1), Average Rate, AY 2026-27 ₹4L):  ${profSalary ? 'PASS' : 'FAIL'}`);
  console.log(`      * Form 141 Transition (01.04.2026):                           ${profForm141 ? 'PASS' : 'FAIL'}`);

  // B. tds-on-salary-vs-professional-fees-guide
  const tdsSalaryHtml = (articleResults.find(a => a.slug === 'tds-on-salary-vs-professional-fees-guide') || {}).html || '';
  const salSalary = tdsSalaryHtml.includes('Section 392(1)') &&
                    tdsSalaryHtml.includes('Average rate') &&
                    tdsSalaryHtml.includes('up to ₹4,00,000') &&
                    !/Salary[^\n]*3,00,000 under New Regime/i.test(tdsSalaryHtml);
  const sal194J = tdsSalaryHtml.includes('₹50,000') && tdsSalaryHtml.includes('April 1, 2025');
  console.log(`    - tds-on-salary-vs-professional-fees-guide:`);
  console.log(`      * Salary Dynamic Average Rate & AY 2026-27 ₹4L:              ${salSalary ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194J (₹50,000 threshold w.e.f. 01.04.2025):          ${sal194J ? 'PASS' : 'FAIL'}`);

  // C. late-tds-return-and-correction-guide
  const lateTdsHtml = (articleResults.find(a => a.slug === 'late-tds-return-and-correction-guide') || {}).html || '';
  const late461 = lateTdsHtml.includes('Section 461') && 
                  lateTdsHtml.includes('Section 271H') &&
                  lateTdsHtml.includes('one month from the prescribed') &&
                  !lateTdsHtml.includes('Section 508 transition') &&
                  !lateTdsHtml.includes('mapped to Section 508');
  console.log(`    - late-tds-return-and-correction-guide:`);
  console.log(`      * Section 461 Statement Penalty & 1-Month Safe Harbor:        ${late461 ? 'PASS' : 'FAIL'}`);

  // D. form-16-vs-form-16a-guide
  const form16Html = (articleResults.find(a => a.slug === 'form-16-vs-form-16a-guide') || {}).html || '';
  const form16_194H = form16Html.includes('2% (w.e.f. 01.10.2024; was 5%)') && form16Html.includes('₹20,000');
  const form16_194A = form16Html.includes('Bank / Co-operative Bank / Post-Office Interest') && 
                      form16Html.includes('₹50,000') && 
                      form16Html.includes('₹1,00,000') &&
                      form16Html.includes('₹10,000');
  const form16_194I = form16Html.includes('₹50,000 per month or part of a month');
  const form16_Salary = form16Html.includes('Section 392(1)');
  console.log(`    - form-16-vs-form-16a-guide:`);
  console.log(`      * Section 194H (2%, ₹20k):                                    ${form16_194H ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194A (Bank ₹50k/₹1L senior & Other ₹10k):          ${form16_194A ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 194-I (₹50k/month):                                  ${form16_194I ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 392(1) Salary Mapping:                              ${form16_Salary ? 'PASS' : 'FAIL'}`);

  // E. tan-registration-and-tds-setup-guide
  const tanHtml = (articleResults.find(a => a.slug === 'tan-registration-and-tds-setup-guide') || {}).html || '';
  const tan194M = tanHtml.includes('Section 194M') && tanHtml.includes('2% TDS');
  const tan141 = tanHtml.includes('Form No. 141') && tanHtml.includes('Form 26QB');
  const tan272BB = tanHtml.includes('Section 272BB') && tanHtml.includes('₹10,000');
  console.log(`    - tan-registration-and-tds-setup-guide:`);
  console.log(`      * Section 194M (2%):                                          ${tan194M ? 'PASS' : 'FAIL'}`);
  console.log(`      * Form 141 Transition:                                        ${tan141 ? 'PASS' : 'FAIL'}`);
  console.log(`      * Section 272BB (₹10k flat):                                  ${tan272BB ? 'PASS' : 'FAIL'}`);

  // F. tds-lower-deduction-certificate-guide
  const lowerHtml = (articleResults.find(a => a.slug === 'tds-lower-deduction-certificate-guide') || {}).html || '';
  const lower197 = lowerHtml.includes('Section 197') && lowerHtml.includes('Form 13') && lowerHtml.includes('2% (w.e.f. 01.10.2024; was 5%)');
  console.log(`    - tds-lower-deduction-certificate-guide:`);
  console.log(`      * Section 197 / Form 13 / 194H 2%:                            ${lower197 ? 'PASS' : 'FAIL'}`);

  // 6. Live Statutory Spot-Checks (FSSAI, MSME, GST, MCA)
  console.log('\n[6] LIVE STATUTORY SPOT-CHECKS (FSSAI / MSME / GST / MCA / INCOME-TAX PERIOD):');
  
  // Income-tax period check
  const noticeHtml = (articleResults.find(a => a.slug === 'income-tax-notice-143-1-139-9-guide') || {}).html || '';
  const taxPeriodPass = noticeHtml.includes('Income-tax Act, 1961') && noticeHtml.includes('Income Tax Act, 2025');
  console.log(`    - Income Tax Dual-Act Period Context (1961 Act vs 2025 Act):   ${taxPeriodPass ? 'PASS' : 'FAIL'}`);

  // FSSAI check
  const fssaiBasicHtml = (articleResults.find(a => a.slug === 'fssai-basic-vs-state-vs-central-guide') || {}).html || '';
  const fssaiRenewalHtml = (articleResults.find(a => a.slug === 'fssai-renewal-and-modification-guide') || {}).html || '';
  const fssaiPass = fssaiBasicHtml.includes('1.5 Crore') && 
                    fssaiBasicHtml.includes('50 Crore') && 
                    fssaiRenewalHtml.includes('perpetual validity');
  console.log(`    - FSSAI Thresholds (₹1.5Cr/₹50Cr) & Perpetual Validity:         ${fssaiPass ? 'PASS' : 'FAIL'}`);

  // MSME / Udyam check
  const msmeBenefitsHtml = (articleResults.find(a => a.slug === 'msme-benefits-after-udyam-registration-guide') || {}).html || '';
  const udyamServHtml = (articleResults.find(a => a.slug === 'udyam-registration-for-service-business-guide') || {}).html || '';
  const msmePass = msmeBenefitsHtml.includes('2.5 Crore') && 
                   msmeBenefitsHtml.includes('10 Crore') && 
                   msmeBenefitsHtml.includes('25 Crore') && 
                   msmeBenefitsHtml.includes('100 Crore') && 
                   msmeBenefitsHtml.includes('125 Crore') && 
                   msmeBenefitsHtml.includes('500 Crore') &&
                   (udyamServHtml.includes('₹0') || msmeBenefitsHtml.includes('₹0'));
  console.log(`    - MSME Post-April 2025 Slabs & ₹0 Official Portal Fee:          ${msmePass ? 'PASS' : 'FAIL'}`);

  // GST check
  const gstrHtml = (articleResults.find(a => a.slug === 'gstr-1-vs-gstr-3b-reconciliation-guide') || {}).html || '';
  const gstPass = gstrHtml.includes('Rule 88C') && gstrHtml.includes('DRC-01B') && gstrHtml.includes('Invoice Management System');
  console.log(`    - GST Rule 88C DRC-01B & IMS Reconciliation:                    ${gstPass ? 'PASS' : 'FAIL'}`);

  // MCA / LLP check
  const llpCalHtml = (articleResults.find(a => a.slug === 'llp-annual-compliance-calendar') || {}).html || '';
  const pvtIncorp = (articleResults.find(a => a.slug === 'how-to-register-private-limited-company') || {}).html || '';
  const mcaPass = pvtIncorp.includes('SPICe+') && 
                  llpCalHtml.includes('Section 76A');
  console.log(`    - MCA SPICe+ & Decriminalised LLP Compliance (Section 76A):     ${mcaPass ? 'PASS' : 'FAIL'}`);

  // 7. Live Site-Wide Indexation Check
  console.log('\n[7] LIVE SITE-WIDE INDEXATION REGRESSION AUDIT:');
  
  // A. Core Services (14) -> index, follow
  let coreLiveIndexed = 0;
  for (const cs of CORE_SERVICES) {
    const res = await fetchUrl(`${SITE_URL}/services/${cs}`);
    const robotsMatch = (res.text.match(/<meta name="robots" content="([^"]+)"/i) || [])[1];
    if (res.status === 200 && robotsMatch && robotsMatch.includes('index') && !robotsMatch.includes('noindex')) {
      coreLiveIndexed++;
    }
  }
  console.log(`    - Core Services (index, follow):     ${coreLiveIndexed} / 14`);

  // B. Secondary Services (Sample of 20) -> noindex, follow
  const sampleSecondary = [
    '12a-registration', '80g-registration', 'ad-code-registration', 'adt1-filing', 'affidavit',
    'annual-compliance-bookkeeping', 'aoa-amendment', 'aoc4-filing', 'apeda-registration', 'ayush-license',
    'belated-revised-itr', 'bis-certification', 'bookkeeping', 'brand-name-search', 'business-address-proof',
    'change-company-name', 'change-registered-office', 'cheque-bounce-notice', 'cma-data', 'concurrent-audit'
  ];
  let secondaryLiveNoindexFollow = 0;
  for (const ss of sampleSecondary) {
    const res = await fetchUrl(`${SITE_URL}/services/${ss}`);
    const robotsMatch = (res.text.match(/<meta name="robots" content="([^"]+)"/i) || [])[1];
    if (res.status === 200 && robotsMatch && robotsMatch.includes('noindex') && robotsMatch.includes('follow') && !robotsMatch.includes('nofollow')) {
      secondaryLiveNoindexFollow++;
    }
  }
  console.log(`    - Secondary Services Sample (noindex, follow): ${secondaryLiveNoindexFollow} / ${sampleSecondary.length}`);

  // C. Virtual Office Geo Pages (All 17) -> noindex, follow
  let geoLiveNoindexFollow = 0;
  for (const gp of GEO_PAGES) {
    const res = await fetchUrl(`${SITE_URL}/${gp}`);
    const robotsMatch = (res.text.match(/<meta name="robots" content="([^"]+)"/i) || [])[1];
    if (res.status === 200 && robotsMatch && robotsMatch.includes('noindex') && robotsMatch.includes('follow') && !robotsMatch.includes('nofollow')) {
      geoLiveNoindexFollow++;
    }
  }
  console.log(`    - Geo Landing Pages (noindex, follow): ${geoLiveNoindexFollow} / ${GEO_PAGES.length}`);

  // 8. Live Sitemap, Robots, Ads.txt & True 404
  console.log('\n[8] LIVE SITEMAP, ROBOTS.TXT, ADS.TXT & TRUE 404:');
  
  // Sitemap
  const sitemapRes = await fetchUrl(`${SITE_URL}/sitemap.xml`);
  const sitemapUrls = (sitemapRes.text.match(/<loc>(.*?)<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));
  console.log(`    - sitemap.xml Status: ${sitemapRes.status}`);
  console.log(`    - Total URLs in Live Sitemap: ${sitemapUrls.length} (Expected: 105)`);
  const blogSitemapCount = sitemapUrls.filter(u => u.includes('/blog/')).length;
  console.log(`    - Blog URLs in Sitemap:       ${blogSitemapCount} / 60`);
  const coreSitemapCount = CORE_SERVICES.filter(cs => sitemapUrls.includes(`${SITE_URL}/services/${cs}`)).length;
  console.log(`    - Core Service URLs in Sitemap: ${coreSitemapCount} / 14`);
  const secondaryInSitemap = sampleSecondary.filter(ss => sitemapUrls.includes(`${SITE_URL}/services/${ss}`)).length;
  console.log(`    - Secondary Services Leaked into Sitemap: ${secondaryInSitemap} (Expected: 0)`);
  const geoInSitemap = GEO_PAGES.filter(gp => sitemapUrls.includes(`${SITE_URL}/${gp}`)).length;
  console.log(`    - Geo Pages Leaked into Sitemap:          ${geoInSitemap} (Expected: 0)`);

  // Ads.txt
  const adsRes = await fetchUrl(`${SITE_URL}/ads.txt`);
  console.log(`    - ads.txt Status:  ${adsRes.status}`);
  const adsExactContent = adsRes.text.trim();
  const adsPass = adsExactContent === 'google.com, pub-6303291083449043, DIRECT, f08c47fec0942fa0';
  console.log(`    - ads.txt Content: "${adsExactContent}" (Valid: ${adsPass ? 'PASS' : 'FAIL'})`);

  // Robots.txt
  const robotsRes = await fetchUrl(`${SITE_URL}/robots.txt`);
  console.log(`    - robots.txt Status: ${robotsRes.status}`);
  const robotsPass = robotsRes.text.includes('Sitemap: https://www.filingby.com/sitemap.xml');
  console.log(`    - robots.txt Points to Sitemap: ${robotsPass ? 'PASS' : 'FAIL'}`);

  // True 404
  const rand404Url = `${SITE_URL}/test-nonexistent-path-${Date.now()}`;
  const notFoundRes = await fetchUrl(rand404Url);
  console.log(`    - Nonexistent URL Status: ${notFoundRes.status} (Expected: 404)`);
  const notFoundRobots = (notFoundRes.text.match(/<meta name="robots" content="([^"]+)"/i) || [])[1];
  const notFoundPass = notFoundRes.status === 404 && notFoundRobots === 'noindex, nofollow';
  console.log(`    - 404 Robots Directive:   ${notFoundRobots} (Valid: ${notFoundPass ? 'PASS' : 'FAIL'})`);

  console.log('\n================================================================');
  console.log(' LIVE VERIFICATION AUDIT COMPLETE');
  console.log(` Final Article Pass Rate: ${passedArticles} / 60`);
  console.log(` Core Services Indexed:   ${coreLiveIndexed} / 14`);
  console.log(` Secondary Noindex Follow:${secondaryLiveNoindexFollow} / ${sampleSecondary.length}`);
  console.log(` Geo Pages Noindex Follow:${geoLiveNoindexFollow} / ${GEO_PAGES.length}`);
  console.log(` Sitemap Count:           ${sitemapUrls.length}`);
  console.log(` Ads.txt Valid:           ${adsPass}`);
  console.log(` True 404 Valid:          ${notFoundPass}`);
  console.log('================================================================\n');
}

runLiveAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});
