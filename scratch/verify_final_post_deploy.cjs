const fs = require('fs');

const BASE_URL = "https://www.filingby.com";

async function fetchLive(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (Final-AdSense-Readiness-Audit)"
      },
      ...options
    });
    const text = await res.text();
    return {
      url,
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      text
    };
  } catch (err) {
    return { url, status: 0, error: err.message, text: "" };
  }
}

async function runLiveVerification() {
  console.log("=== RUNNING POST-DEPLOYMENT LIVE VALIDATION ===");
  const results = {};

  // 1. Sitemap Check
  console.log("--> 1. Fetching and validating live sitemap.xml...");
  const sitemapRes = await fetchLive(`${BASE_URL}/sitemap.xml?_t=${Date.now()}`);
  const sitemapUrls = [...sitemapRes.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  results.sitemap = {
    status: sitemapRes.status,
    totalCount: sitemapUrls.length,
    urls: sitemapUrls
  };

  const deadUrls = [
    'https://www.filingby.com/hubs/gst',
    'https://www.filingby.com/hubs/company',
    'https://www.filingby.com/compare/private-limited-company-vs-llp',
    'https://www.filingby.com/compare/trademark-vs-patent',
    'https://www.filingby.com/locations'
  ];
  results.sitemapPruningCheck = deadUrls.map(u => ({
    url: u,
    inSitemap: sitemapUrls.includes(u)
  }));

  // Probe all sitemap URLs
  console.log(`--> 2. Probing all ${sitemapUrls.length} live sitemap URLs...`);
  const sitemapStatusCounts = { 200: 0, 301: 0, 302: 0, 404: 0, 500: 0, other: 0 };
  const sitemapNon200 = [];
  const sitemapNoindex = [];

  for (const url of sitemapUrls) {
    const res = await fetchLive(url);
    if (res.status === 200) {
      sitemapStatusCounts[200]++;
    } else if (res.status in sitemapStatusCounts) {
      sitemapStatusCounts[res.status]++;
      sitemapNon200.push({ url, status: res.status });
    } else {
      sitemapStatusCounts.other++;
      sitemapNon200.push({ url, status: res.status });
    }

    if (res.text.includes('content="noindex') || res.text.includes("content='noindex")) {
      sitemapNoindex.push(url);
    }
  }

  results.sitemapProbing = {
    statusCounts: sitemapStatusCounts,
    non200: sitemapNon200,
    noindexFound: sitemapNoindex
  };

  // 3. FSSAI Blog Live Check
  console.log("--> 3. Checking FSSAI blog live thresholds...");
  const fssaiRes = await fetchLive(`${BASE_URL}/blog/fssai-basic-vs-state-vs-central-guide?_t=${Date.now()}`);
  const fssaiHtml = fssaiRes.text;

  // Extract quotes
  const m15 = [...fssaiHtml.matchAll(/1\.5\s*crore/gi)].map(m => m.index);
  const m50 = [...fssaiHtml.matchAll(/50\s*crore/gi)].map(m => m.index);
  const m12 = [...fssaiHtml.matchAll(/12\s*lakh/gi)].map(m => m.index);

  results.fssai = {
    status: fssaiRes.status,
    has15Cr: m15.length > 0,
    has50Cr: m50.length > 0,
    m12Count: m12.length,
    snippets15Cr: m15.slice(0, 3).map(idx => fssaiHtml.slice(Math.max(0, idx - 60), idx + 80).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
    snippets50Cr: m50.slice(0, 3).map(idx => fssaiHtml.slice(Math.max(0, idx - 60), idx + 80).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
    snippets12Lakh: m12.map(idx => fssaiHtml.slice(Math.max(0, idx - 60), idx + 80).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  };

  // 4. Raw HTML Privacy Policy Check
  console.log("--> 4. Checking raw HTML Privacy Policy...");
  const privacyRes = await fetchLive(`${BASE_URL}/default/privacy-policy?_t=${Date.now()}`);
  const privHtml = privacyRes.text;
  results.privacyRaw = {
    status: privacyRes.status,
    googleAdvertising: /google/i.test(privHtml) && /advertising/i.test(privHtml),
    cookies: /cookies/i.test(privHtml),
    webBeaconsOrIdentifiers: /web beacons/i.test(privHtml) && /identifiers/i.test(privHtml),
    personalizedAds: /personalized advertising/i.test(privHtml),
    optOutInfo: /adssettings\.google\.com/i.test(privHtml) && /aboutads\.info/i.test(privHtml),
    contactPrivacyRequests: /support@filingby\.com/i.test(privHtml)
  };

  // 5. Locations Page Check
  console.log("--> 5. Checking /locations page robots directives...");
  const locationsRes = await fetchLive(`${BASE_URL}/locations?_t=${Date.now()}`);
  results.locations = {
    status: locationsRes.status,
    hasNoindex: locationsRes.text.includes('content="noindex, follow"') || locationsRes.text.includes("content='noindex, follow'"),
    inSitemap: sitemapUrls.includes(`${BASE_URL}/locations`)
  };

  // 6. True 404 Check
  console.log("--> 6. Checking true 404 response on deleted routes...");
  const deadTest = await fetchLive(`${BASE_URL}/hubs/gst`);
  results.deadRouteTest = {
    url: `${BASE_URL}/hubs/gst`,
    status: deadTest.status,
    isTrue404: deadTest.status === 404,
    hasNoindex: deadTest.text.includes("noindex, nofollow")
  };

  // 7. Save output
  fs.writeFileSync('scratch/final_post_deploy_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log("=== VALIDATION FINISHED. Output saved to scratch/final_post_deploy_results.json ===");
}

runLiveVerification();
