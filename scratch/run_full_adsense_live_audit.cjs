const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.filingby.com';

function fetchUrl(url, options = {}) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          location: res.headers.location,
          body: data
        });
      });
    });
    req.on('error', (err) => {
      resolve({ url, error: err.message });
    });
    if (options.timeout) {
      req.setTimeout(options.timeout, () => {
        req.destroy();
        resolve({ url, error: 'TIMEOUT' });
      });
    }
  });
}

// Helper to follow redirects up to maxRedirects
async function fetchFollowRedirects(url, maxRedirects = 5) {
  let currentUrl = url;
  let redirectsTraversed = 0;
  let initialResponse = null;

  while (redirectsTraversed < maxRedirects) {
    const res = await fetchUrl(currentUrl);
    if (!initialResponse) initialResponse = res;

    if (res.status >= 300 && res.status < 400 && res.location) {
      redirectsTraversed++;
      let nextUrl = res.location;
      if (nextUrl.startsWith('/')) {
        const parsed = new URL(currentUrl);
        nextUrl = `${parsed.protocol}//${parsed.host}${nextUrl}`;
      }
      currentUrl = nextUrl;
    } else {
      return {
        initialStatus: initialResponse.status,
        initialLocation: initialResponse.location,
        finalUrl: currentUrl,
        finalStatus: res.status,
        body: res.body,
        headers: res.headers,
        redirectCount: redirectsTraversed
      };
    }
  }
  return { error: 'TOO_MANY_REDIRECTS', initialStatus: initialResponse?.status };
}

async function runAudit() {
  console.log('================================================================');
  console.log('FILINGBY.COM — LIVE PRODUCTION AUDIT SUITE');
  console.log('================================================================\n');

  const results = {
    canonicalHost: [],
    homepageRaw: null,
    backendStatus: null,
    sitemapAudit: null,
    coreServices: [],
    secondaryServices: [],
    quarantinedCalculators: [],
    dynamicValid: [],
    dynamicInvalid: [],
    random404: [],
    purgedLegacy: [],
    explicitRedirects: [],
    pagesRoot: null,
    privateRoutes: [],
    privateSubpaths: [],
    blogs: [],
    blogIndex: null,
    legalParity: {},
    unsupportedClaims: [],
    robotsTxt: null,
    adsTxt: null,
    metaVerification: null,
    activeDisplayAds: []
  };

  // 1. CANONICAL HOST CHECK
  console.log('--- 1. CANONICAL HOST VERIFICATION ---');
  const hostVariants = [
    'http://filingby.com',
    'https://filingby.com',
    'http://www.filingby.com',
    'https://www.filingby.com'
  ];
  for (const u of hostVariants) {
    const res = await fetchUrl(u);
    const item = { url: u, status: res.status, location: res.location };
    results.canonicalHost.push(item);
    console.log(`Host ${u} -> Status: ${res.status}, Location: ${res.location || 'NONE (Canonical)'}`);
  }

  // 2. LIVE HOMEPAGE RAW HTML
  console.log('\n--- 2. LIVE HOMEPAGE RAW HTML AUDIT ---');
  const hpRes = await fetchUrl('https://www.filingby.com/');
  const hpContainsEmpty = hpRes.body.includes('No services currently available');
  const hpContainsPopular = hpRes.body.includes('Popular Services');
  const visibleServices = [];
  const cardMatches = hpRes.body.match(/<a href="\/services\/([^"]+)"[^>]*>([^<]+)<\/a>/g) || [];
  for (const m of cardMatches) {
    const text = m.replace(/<[^>]+>/g, '').trim();
    if (text && !visibleServices.includes(text) && !text.includes('→')) {
      visibleServices.push(text);
    }
  }
  results.homepageRaw = {
    status: hpRes.status,
    containsEmptyState: hpContainsEmpty,
    containsPopularSection: hpContainsPopular,
    visibleServiceNames: visibleServices,
    htmlLength: hpRes.body.length
  };
  console.log(`Homepage Status: ${hpRes.status}, Length: ${hpRes.body.length} bytes`);
  console.log(`Empty state ("No services currently available"): ${hpContainsEmpty ? 'FOUND (FAIL)' : 'ZERO OCCURRENCES (PASS)'}`);
  console.log(`Popular Services section present: ${hpContainsPopular ? 'YES' : 'NO'}`);
  console.log(`Visible Service Cards in Raw HTML: ${visibleServices.join(', ')}`);

  // 3. BACKEND SERVICE CATALOGUE
  console.log('\n--- 3. BACKEND LIVE CATALOGUE CHECK ---');
  const t0 = Date.now();
  const beRes = await fetchUrl('https://filingbycom.onrender.com/services', { timeout: 15000 });
  const beTime = Date.now() - t0;
  let beCount = 0;
  let bePopular = 0;
  if (!beRes.error && beRes.status === 200) {
    try {
      const data = JSON.parse(beRes.body);
      const list = Array.isArray(data) ? data : data.services || data.data || [];
      beCount = list.length;
      bePopular = list.filter(s => s.isPopular).length;
    } catch (e) {
      console.error('Failed to parse backend JSON:', e.message);
    }
  }
  results.backendStatus = {
    status: beRes.status,
    responseTimeMs: beTime,
    serviceCount: beCount,
    popularCount: bePopular,
    error: beRes.error
  };
  console.log(`Backend API Status: ${beRes.status}, Latency: ${beTime}ms, Total Services: ${beCount}, Popular: ${bePopular}`);

  // 4. LIVE SITEMAP (97 URLs)
  console.log('\n--- 4. LIVE SITEMAP 97-URL AUDIT ---');
  const smRes = await fetchUrl('https://www.filingby.com/sitemap.xml');
  const sitemapUrls = (smRes.body.match(/<loc>(.*?)<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));
  console.log(`Sitemap Total URLs: ${sitemapUrls.length}`);

  let sm200 = 0, sm3xx = 0, sm404 = 0, sm5xx = 0, smNoindex = 0, smCanonMismatch = 0;
  const smDetails = [];

  for (const u of sitemapUrls) {
    const res = await fetchUrl(u);
    let is200 = res.status === 200;
    let is3xx = res.status >= 300 && res.status < 400;
    let is404 = res.status === 404;
    let is5xx = res.status >= 500;
    let hasNoindex = res.body && (res.body.includes('content="noindex') || res.body.includes('content="none'));
    
    // Check self-canonical
    const canonMatch = res.body ? res.body.match(/<link rel="canonical" href="([^"]+)"/i) : null;
    const canonUrl = canonMatch ? canonMatch[1] : null;
    const isCanonMatch = canonUrl === u || canonUrl === `${u}/` || `${canonUrl}/` === u;

    if (is200) sm200++;
    if (is3xx) sm3xx++;
    if (is404) sm404++;
    if (is5xx) sm5xx++;
    if (hasNoindex) smNoindex++;
    if (!isCanonMatch) smCanonMismatch++;

    smDetails.push({ url: u, status: res.status, isCanonMatch, hasNoindex });
  }
  results.sitemapAudit = {
    total: sitemapUrls.length,
    status200: sm200,
    status3xx: sm3xx,
    status404: sm404,
    status5xx: sm5xx,
    noindexCount: smNoindex,
    canonMismatchCount: smCanonMismatch
  };
  console.log(`Sitemap audit: 200=${sm200}, 3xx=${sm3xx}, 404=${sm404}, 5xx=${sm5xx}, noindex=${smNoindex}, canonicalMismatch=${smCanonMismatch}`);

  // 5. 14 CORE SERVICES
  console.log('\n--- 5. 14 CORE SERVICES VERIFICATION ---');
  const coreSlugs = [
    'gst-registration', 'gst-return-filing', 'private-limited-company',
    'llp-registration', 'one-person-company', 'trademark-registration',
    'itr-1-filing', 'fssai-basic-registration', 'iec-registration',
    'udyam-registration', 'roc-annual-filing-pvt', 'trust-registration',
    'startup-india', 'roc-annual-filing-llp'
  ];
  for (const slug of coreSlugs) {
    const u = `https://www.filingby.com/services/${slug}`;
    const res = await fetchUrl(u);
    const hasIndex = res.body && res.body.includes('content="index, follow');
    const canonMatch = res.body ? res.body.match(/<link rel="canonical" href="([^"]+)"/i) : null;
    const h1Match = res.body ? res.body.match(/<h1[^>]*>([^<]+)<\/h1>/i) : null;
    results.coreServices.push({
      slug,
      status: res.status,
      hasIndexMeta: hasIndex,
      canonical: canonMatch ? canonMatch[1] : null,
      h1: h1Match ? h1Match[1].trim() : null,
      bodyLength: res.body ? res.body.length : 0
    });
    console.log(`Core service /services/${slug} -> Status: ${res.status}, Index: ${hasIndex}, H1: "${h1Match ? h1Match[1].trim() : 'NONE'}"`);
  }

  // 6. 3 QUARANTINED CALCULATORS
  console.log('\n--- 6. THREE QUARANTINED CALCULATORS AUDIT ---');
  const calculators = ['/calculators/hra', '/calculators/tds', '/calculators/depreciation'];
  for (const c of calculators) {
    const res = await fetchUrl(`https://www.filingby.com${c}`);
    const hasNoindex = res.body && res.body.includes('content="noindex, follow"');
    const inSitemap = sitemapUrls.includes(`https://www.filingby.com${c}`);
    results.quarantinedCalculators.push({
      path: c,
      status: res.status,
      hasNoindex,
      inSitemap
    });
    console.log(`Calculator ${c} -> Status: ${res.status}, Noindex: ${hasNoindex}, inSitemap: ${inSitemap}`);
  }

  // 7. 12 VALID PUBLIC DYNAMIC ROUTES
  console.log('\n--- 7. 12 VALID DYNAMIC PUBLIC ROUTES AUDIT ---');
  const validDynamic = [
    '/tools/structure-selector', '/tools/gst-eligibility', '/tools/trademark-class',
    '/templates/nda', '/templates/rent-agreement', '/templates/gst-invoice',
    '/templates/partnership-deed', '/templates/board-resolution',
    '/hubs/gst', '/hubs/company',
    '/compare/private-limited-company-vs-llp', '/compare/trademark-vs-patent'
  ];
  for (const route of validDynamic) {
    const res = await fetchUrl(`https://www.filingby.com${route}`);
    const hasNoindex = res.body && res.body.includes('content="noindex, follow"');
    const inSitemap = sitemapUrls.includes(`https://www.filingby.com${route}`);
    const h1Match = res.body ? res.body.match(/<h1[^>]*>([^<]+)<\/h1>/i) : null;
    results.dynamicValid.push({
      route,
      status: res.status,
      hasNoindex,
      inSitemap,
      h1: h1Match ? h1Match[1].trim() : 'NONE',
      bodyLength: res.body ? res.body.length : 0
    });
    console.log(`Dynamic Valid ${route} -> Status: ${res.status}, Noindex: ${hasNoindex}, inSitemap: ${inSitemap}, H1: "${h1Match ? h1Match[1].trim() : 'NONE'}"`);
  }

  // 8. INVALID PUBLIC DYNAMIC ROUTES
  console.log('\n--- 8. INVALID DYNAMIC ROUTES (EXPECTED 404) ---');
  const invalidDynamic = [
    '/tools/not-a-real-tool-xyz', '/tools/foobar-404',
    '/templates/not-a-real-template-xyz', '/templates/fake-agreement',
    '/hubs/not-a-real-hub-xyz', '/hubs/random-topic',
    '/compare/foo-vs-bar', '/compare/not-real-vs-not-real'
  ];
  for (const route of invalidDynamic) {
    const res = await fetchUrl(`https://www.filingby.com${route}`);
    results.dynamicInvalid.push({
      route,
      status: res.status,
      location: res.location,
      bodyLength: res.body ? res.body.length : 0
    });
    console.log(`Dynamic Invalid ${route} -> Status: ${res.status} (Expected 404, Loc: ${res.location || 'NONE'})`);
  }

  // 9. RANDOM TRUE 404 TEST (15 URLs)
  console.log('\n--- 9. RANDOM TRUE 404 TEST (15 URLs) ---');
  const randomUrls = [
    '/this-does-not-exist-at-all',
    '/services/non-existent-compliance-service-123',
    '/blog/fake-nonexistent-article-xyz',
    '/calculators/nonexistent-calculator',
    '/pages/random-deleted-page',
    '/products/fake-item',
    '/collections/random-store-collection',
    '/admin/fake-private-subpath-outside-rewrite',
    '/sso-callback/invalid-nested-path',
    '/tools/fake-quiz-404',
    '/templates/nonexistent-contract',
    '/hubs/fake-cluster',
    '/compare/fake-vs-fake-entity',
    '/api/nonexistent-endpoint',
    '/wp-login.php'
  ];
  for (const route of randomUrls) {
    const res = await fetchUrl(`https://www.filingby.com${route}`);
    results.random404.push({ route, status: res.status, location: res.location });
    console.log(`Random Unknown ${route} -> Status: ${res.status}`);
  }

  // 10. PURGED LEGACY URLS (EXPECTED DIRECT 404)
  console.log('\n--- 10. PURGED LEGACY URLS AUDIT (EXPECTED 404) ---');
  const purgedUrls = [
    '/pages/csr-audit',
    '/pages/llp-income-tax-return',
    '/pages/trust-compliance',
    '/pages/trust-audit',
    '/pages/ngo-compliance',
    '/pages/ngo-registration',
    '/blog/income-tax-filing-ay-2026-27',
    '/collections',
    '/search',
    '/cart',
    '/wpm',
    '/b',
    '/cdn',
    '/v1/produce',
    '/%24%7Bt%7D'
  ];
  for (const route of purgedUrls) {
    const res = await fetchUrl(`https://www.filingby.com${route}`);
    results.purgedLegacy.push({ route, status: res.status, location: res.location });
    console.log(`Purged URL ${route} -> Status: ${res.status}, Loc: ${res.location || 'NONE'}`);
  }

  // 11. EXPLICIT LEGACY REDIRECTS (49 REDIRECTS)
  console.log('\n--- 11. EXPLICIT 49 CONFIGURED REDIRECTS AUDIT ---');
  const vJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../FRONTEND/vercel.json'), 'utf8'));
  const remainingRedirects = vJson.redirects || [];
  let redirPass = 0, redirFail = 0;

  for (const r of remainingRedirects) {
    if (r.has && r.has.some(h => h.type === 'host')) continue; // skip apex domain rule here
    const sourcePath = r.source
      .replace(/:city\([^)]+\)/, 'mumbai')
      .replace(':city', 'mumbai')
      .replace(':area', 'bkc');
    const u = `https://www.filingby.com${sourcePath}`;
    const directRes = await fetchUrl(u);
    const chainRes = await fetchFollowRedirects(u);

    const is3xx = directRes.status === 301 || directRes.status === 308;
    const dest200 = chainRes.finalStatus === 200;
    const pass = is3xx && dest200;

    if (pass) redirPass++;
    else redirFail++;

    results.explicitRedirects.push({
      source: r.source,
      testedUrl: sourcePath,
      status: directRes.status,
      location: directRes.location,
      finalStatus: chainRes.finalStatus,
      pass
    });
    console.log(`Redirect ${sourcePath} -> ${directRes.status} -> ${directRes.location} (Final: ${chainRes.finalStatus}) [${pass ? 'PASS' : 'FAIL'}]`);
  }
  console.log(`Redirects Summary: ${redirPass} Passed, ${redirFail} Failed out of ${remainingRedirects.length - 1} path rules.`);

  // 12. PAGES ROOT REDIRECT
  console.log('\n--- 12. /pages ROOT REDIRECT AUDIT ---');
  const pagesRes = await fetchUrl('https://www.filingby.com/pages');
  results.pagesRoot = { status: pagesRes.status, location: pagesRes.location };
  console.log(`/pages -> Status: ${pagesRes.status}, Location: ${pagesRes.location}`);

  // 13. PRIVATE AUTH & SUBPATHS
  console.log('\n--- 13. PRIVATE AUTH & SUBPATHS AUDIT ---');
  const privRoutes = [
    '/login', '/register', '/sso-callback',
    '/dashboard', '/dashboard/compliance',
    '/virtual-office/dashboard', '/partner/dashboard',
    '/admin', '/admin/dashboard'
  ];
  for (const p of privRoutes) {
    const res = await fetchUrl(`https://www.filingby.com${p}`);
    const hasNoindex = res.body && res.body.includes('noindex');
    results.privateRoutes.push({ path: p, status: res.status, hasNoindex });
    console.log(`Private Route ${p} -> Status: ${res.status}, Noindex: ${hasNoindex}`);
  }

  const privSubpaths = [
    '/dashboard/definitely-not-a-real-feature',
    '/admin/not-a-real-screen',
    '/partner/dashboard/not-real',
    '/virtual-office/dashboard/not-real'
  ];
  for (const p of privSubpaths) {
    const res = await fetchUrl(`https://www.filingby.com${p}`);
    const hasNoindex = res.body && res.body.includes('noindex');
    results.privateSubpaths.push({ path: p, status: res.status, hasNoindex, location: res.location });
    console.log(`Private Subpath ${p} -> Status: ${res.status}, Location: ${res.location || 'NONE'}, Noindex: ${hasNoindex}`);
  }

  // 14. 60 BLOGS AUDIT
  console.log('\n--- 14. 60 PUBLISHED BLOG ARTICLES AUDIT ---');
  const blogUrls = sitemapUrls.filter(u => u.includes('/blog/') && !u.endsWith('/blog'));
  let blogs200 = 0, blogsIndexed = 0, blogsWithContent = 0;
  for (const b of blogUrls) {
    const res = await fetchUrl(b);
    if (res.status === 200) blogs200++;
    if (res.body && res.body.includes('content="index, follow')) blogsIndexed++;
    if (res.body && res.body.length > 3000) blogsWithContent++;
  }
  results.blogs = {
    total: blogUrls.length,
    status200: blogs200,
    indexedCount: blogsIndexed,
    substantiveContentCount: blogsWithContent
  };
  console.log(`Blogs Audit: Total=${blogUrls.length}, 200=${blogs200}, Indexed=${blogsIndexed}, SubstantiveContent=${blogsWithContent}`);

  // 15. BLOG INDEX
  console.log('\n--- 15. BLOG INDEX (/blog) ---');
  const biRes = await fetchUrl('https://www.filingby.com/blog');
  results.blogIndex = {
    status: biRes.status,
    bodyLength: biRes.body ? biRes.body.length : 0,
    containsCards: biRes.body ? biRes.body.includes('/blog/') : false
  };
  console.log(`/blog -> Status: ${biRes.status}, Length: ${biRes.body.length} bytes, Contains Article Links: ${results.blogIndex.containsCards}`);

  // 16. LEGAL LIVE PARITY
  console.log('\n--- 16. LEGAL LIVE PARITY & WORDING AUDIT ---');
  const refundRes = await fetchUrl('https://www.filingby.com/default/refund');
  const privacyRes = await fetchUrl('https://www.filingby.com/default/privacy-policy');
  
  const refundHasMcaException = refundRes.body.includes('MCA21') || refundRes.body.includes('stamp');
  const refundHasUniversalFeeClaim = refundRes.body.includes('government statutory fees are non-refundable once paid') || refundRes.body.includes('statutory fees are strictly non-refundable under any circumstances');
  const privacyHasDpdpQual = privacyRes.body.includes('as and when') || privacyRes.body.includes('Data Privacy Contact');
  const privacyClaimsActiveDpo = privacyRes.body.includes('Data Protection Officer (DPO) appointed under Section 10');

  results.legalParity = {
    refundStatus: refundRes.status,
    refundHasMcaException,
    refundHasUniversalFeeClaim,
    privacyStatus: privacyRes.status,
    privacyHasDpdpQual,
    privacyClaimsActiveDpo
  };
  console.log(`Refund Policy: Status=${refundRes.status}, MCA exception mentioned=${refundHasMcaException}, Universal non-refundable claim=${refundHasUniversalFeeClaim}`);
  console.log(`Privacy Policy: Status=${privacyRes.status}, Conditional DPDP wording=${privacyHasDpdpQual}, Active statutory DPO claimed=${privacyClaimsActiveDpo}`);

  // 17. UNSUPPORTED CLAIMS SCAN
  console.log('\n--- 17. UNSUPPORTED CLAIMS SCAN ---');
  const phrasesToFind = [
    '500+ MCA', 'MCA Certified Experts', '10,000+', '2500+ Monthly',
    '5,000+ businesses', '4.8/5 Star Rated (1,500+ Businesses)'
  ];
  const pagesToScan = [
    'https://www.filingby.com/',
    'https://www.filingby.com/about-us',
    'https://www.filingby.com/our-promise',
    'https://www.filingby.com/services/gst-registration',
    'https://www.filingby.com/services/private-limited-company'
  ];
  for (const pageUrl of pagesToScan) {
    const res = await fetchUrl(pageUrl);
    for (const phrase of phrasesToFind) {
      if (res.body && res.body.includes(phrase)) {
        results.unsupportedClaims.push({ pageUrl, phrase });
        console.error(`❌ FOUND UNSUPPORTED CLAIM "${phrase}" in ${pageUrl}`);
      }
    }
  }
  console.log(`Unsupported Claims Found: ${results.unsupportedClaims.length}`);

  // 18. ROBOTS.TXT
  console.log('\n--- 18. ROBOTS.TXT AUDIT ---');
  const robRes = await fetchUrl('https://www.filingby.com/robots.txt');
  results.robotsTxt = {
    status: robRes.status,
    body: robRes.body
  };
  console.log(`robots.txt Status: ${robRes.status}\n${robRes.body}`);

  // 19. ADS.TXT
  console.log('\n--- 19. ADS.TXT AUDIT ---');
  const adsRes = await fetchUrl('https://www.filingby.com/ads.txt');
  results.adsTxt = {
    status: adsRes.status,
    body: adsRes.body.trim(),
    matchesExpected: adsRes.body.trim() === 'google.com, pub-6303291083449043, DIRECT, f08c47fec0942fa0'
  };
  console.log(`ads.txt Status: ${adsRes.status}, Content: "${adsRes.body.trim()}", Valid: ${results.adsTxt.matchesExpected}`);

  // 20. ADSENSE VERIFICATION META & DISPLAY ADS SEARCH
  console.log('\n--- 20. ADSENSE VERIFICATION META & ZERO DISPLAY ADS AUDIT ---');
  const metaMatch = hpRes.body.includes('<meta name="google-adsense-account" content="ca-pub-6303291083449043" />') || hpRes.body.includes('ca-pub-6303291083449043');
  results.metaVerification = metaMatch;
  console.log(`AdSense ownership meta in <head>: ${metaMatch ? 'PRESENT (PASS)' : 'MISSING (FAIL)'}`);

  const adDisplayPatterns = [
    'adsbygoogle.js',
    'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    '<ins class="adsbygoogle"'
  ];
  for (const p of adDisplayPatterns) {
    if (hpRes.body.includes(p)) {
      results.activeDisplayAds.push(p);
      console.error(`❌ FOUND ACTIVE DISPLAY AD SNIPPET "${p}" on homepage`);
    }
  }
  console.log(`Active AdSense display ad snippets: ${results.activeDisplayAds.length} (Expected: 0)`);

  // Write full results to JSON file for reporting
  fs.writeFileSync(path.join(__dirname, 'final_adsense_live_audit_results.json'), JSON.stringify(results, null, 2));
  console.log('\n================================================================');
  console.log('LIVE AUDIT COMPLETE — Results written to final_adsense_live_audit_results.json');
}

runAudit();
