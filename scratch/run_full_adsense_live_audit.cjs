const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.filingby.com';

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

async function run() {
  console.log('--- 1. FETCHING SITEMAP ---');
  const sitemapRes = await fetchUrl(`${SITE_URL}/sitemap.xml`);
  const sitemapUrls = (sitemapRes.text.match(/<loc>(.*?)<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));
  console.log(`Total URLs in sitemap: ${sitemapUrls.length}`);

  console.log('--- 2. AUDITING ALL SITEMAP URLS ---');
  const sitemapAudit = [];
  for (const url of sitemapUrls) {
    const res = await fetchUrl(url);
    const html = res.text;
    const robots = (html.match(/<meta name="robots" content="([^"]+)"/i) || [])[1] || 'none';
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || 'none';
    
    let type = 'Other';
    if (url.includes('/blog/')) type = 'Blog';
    else if (url.includes('/services/')) type = 'Core Service';
    else if (url.includes('-calculator') || url.includes('tools') || url.includes('search')) type = 'Tool/Calculator';
    else if (url === `${SITE_URL}/` || url === `${SITE_URL}/about-us` || url === `${SITE_URL}/contact-us` || url === `${SITE_URL}/our-promise` || url === `${SITE_URL}/customer-care` || url === `${SITE_URL}/faq` || url === `${SITE_URL}/blog`) type = 'Core Public / Trust';
    else if (url.includes('/legal') || url.includes('/terms') || url.includes('/privacy') || url.includes('/refund') || url.includes('/disclaimer') || url.includes('/editorial')) type = 'Legal / Policy';
    else if (url.includes('/virtual-space') || url.includes('/locations') || url.includes('/ecommerce-office')) type = 'Core Commercial Hub';

    const words = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    const isSubstantive = words > 250;
    
    let rating = 'ACCEPTABLE';
    if (type === 'Blog' && words > 1000) rating = 'STRONG';
    else if (type === 'Core Service' && words > 600) rating = 'STRONG';
    else if (res.status !== 200 || robots.includes('noindex')) rating = 'REMOVE/NOINDEX CANDIDATE';
    else if (words < 150) rating = 'QUESTIONABLE';

    sitemapAudit.push({
      url,
      status: res.status,
      robots,
      canonical,
      type,
      words,
      isSubstantive,
      rating
    });
  }

  // Summary of sitemap audit
  console.log(`Sitemap Audit Complete: ${sitemapAudit.length} URLs audited.`);
  const statusCounts = {};
  for (const s of sitemapAudit) {
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  }
  console.log('HTTP Status Breakdown:', statusCounts);

  const ratingCounts = {};
  for (const s of sitemapAudit) {
    ratingCounts[s.rating] = (ratingCounts[s.rating] || 0) + 1;
  }
  console.log('AdSense Value Risk Breakdown:', ratingCounts);

  console.log('--- 3. CHECKING PRIVACY POLICY CONTENT ---');
  const privacyRes = await fetchUrl(`${SITE_URL}/default/privacy`);
  const privHtml = privacyRes.text;
  const privChecks = {
    http: privacyRes.status,
    mentionsGoogle: /Google/i.test(privHtml),
    mentionsCookies: /cookie/i.test(privHtml),
    mentionsAdSense: /AdSense|advertising|ad technologies/i.test(privHtml),
    mentionsThirdParty: /third[- ]party vendors/i.test(privHtml),
    mentionsPersonalizedAds: /personalized advertising|interest[- ]based/i.test(privHtml),
    mentionsOptOut: /opt[- ]out|aboutads\.info|adssettings/i.test(privHtml),
    mentionsAnalytics: /analytics/i.test(privHtml),
    mentionsContact: /support@filingby\.com/i.test(privHtml)
  };
  console.log('Privacy Policy Checks:', privChecks);

  console.log('--- 4. CHECKING ABOUT US & CONTACT US CONTENT ---');
  const aboutRes = await fetchUrl(`${SITE_URL}/about-us`);
  const contactRes = await fetchUrl(`${SITE_URL}/contact-us`);
  const promiseRes = await fetchUrl(`${SITE_URL}/our-promise`);
  
  const trustChecks = {
    aboutStatus: aboutRes.status,
    contactStatus: contactRes.status,
    aboutPlatformIdentity: aboutRes.text.includes('platform') || aboutRes.text.includes('FilingBy'),
    aboutNoFakeCA: !/Chartered Accountant Hiren Patel|15\+ Years Experience/i.test(aboutRes.text),
    contactOffice: contactRes.text.includes('Surat') || contactRes.text.includes('Operations'),
    contactPhone: contactRes.text.includes('75671') || contactRes.text.includes('phone') || contactRes.text.includes('call'),
    contactEmail: contactRes.text.includes('support@filingby.com')
  };
  console.log('Trust Checks:', trustChecks);

  console.log('--- 5. SITEWIDE CLAIMS & CREDENTIALS SCAN ---');
  // Scan across all sitemap URLs
  let credHits = {
    caHits: 0,
    fcaHits: 0,
    csHits: 0,
    advocateHits: 0,
    reviewedByHits: 0,
    verifiedExpertHits: 0,
    guaranteedHits: 0,
    moneyBackHits: 0,
    instantApprovalHits: 0
  };

  for (const item of sitemapAudit) {
    const res = await fetchUrl(item.url);
    const text = res.text;
    if (/FCA\b/i.test(text)) credHits.fcaHits++;
    if (/Reviewed by\s*:/i.test(text)) credHits.reviewedByHits++;
    if (/verified expert/i.test(text)) credHits.verifiedExpertHits++;
    if (/guaranteed approval/i.test(text)) credHits.guaranteedHits++;
    if (/money back/i.test(text)) credHits.moneyBackHits++;
    if (/instant approval/i.test(text)) credHits.instantApprovalHits++;
  }
  console.log('Sitewide Claims Scan:', credHits);

  console.log('--- 6. INTERNAL BROKEN LINK CRAWLER (SAMPLE OF SITEMAP URLS) ---');
  const internalLinks = new Set();
  const externalGovLinks = new Set();

  for (const item of sitemapAudit.slice(0, 30)) {
    const res = await fetchUrl(item.url);
    const hrefs = res.text.match(/href="([^"]+)"/g) || [];
    for (const h of hrefs) {
      const link = h.replace(/href="|"$/g, '');
      if (link.startsWith('/') && !link.startsWith('//')) {
        internalLinks.add(link);
      } else if (link.startsWith('https://www.filingby.com/')) {
        internalLinks.add(link.replace('https://www.filingby.com', ''));
      } else if (link.includes('gov.in') || link.includes('incometax') || link.includes('mca.gov') || link.includes('gst.gov')) {
        externalGovLinks.add(link);
      }
    }
  }

  console.log(`Discovered ${internalLinks.size} internal unique links and ${externalGovLinks.size} external gov links.`);
  let brokenInternal = [];
  for (const link of Array.from(internalLinks).slice(0, 50)) {
    const res = await fetchUrl(`${SITE_URL}${link}`);
    if (res.status >= 400) {
      brokenInternal.push({ link, status: res.status });
    }
  }
  console.log(`Broken Internal Links count in tested sample: ${brokenInternal.length}`, brokenInternal);

  console.log('--- 7. SOFT 404 / MALFORMED URL CHECKS ---');
  const testUrls = [
    `${SITE_URL}/services/non-existent-service-${Date.now()}`,
    `${SITE_URL}/blog/non-existent-blog-${Date.now()}`,
    `${SITE_URL}/virtual-office-invalid-city-${Date.now()}`,
    `${SITE_URL}/calculators/invalid-calc-${Date.now()}`
  ];
  for (const tu of testUrls) {
    const r = await fetchUrl(tu);
    console.log(`Malformed URL [${tu}]: HTTP ${r.status} | robots: ${(r.text.match(/<meta name="robots" content="([^"]+)"/i) || [])[1]}`);
  }

  // Save full audit data to JSON for reference
  fs.writeFileSync(
    path.join(__dirname, 'adsense_readiness_audit_data.json'),
    JSON.stringify({ sitemapAudit, privChecks, trustChecks, credHits, brokenInternal }, null, 2)
  );
}

run().catch(console.error);
