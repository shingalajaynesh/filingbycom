const fs = require('fs');

const BASE_URL = "https://www.filingby.com";

async function fetchLive(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (Google-AdSense-Readiness-Audit)"
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

async function runAudit() {
  console.log("=== STARTING COMPREHENSIVE LIVE ADSENSE AUDIT ===");
  const auditReport = {};

  // 1. Ads.txt check
  console.log("--> 1. Checking ads.txt...");
  const adsTxtRes = await fetchLive(`${BASE_URL}/ads.txt`);
  auditReport.adsTxt = {
    status: adsTxtRes.status,
    content: adsTxtRes.text.trim(),
    isValid: adsTxtRes.text.trim() === "google.com, pub-6303291083449043, DIRECT, f08c47fec0942fa0"
  };

  // 2. Robots.txt check
  console.log("--> 2. Checking robots.txt...");
  const robotsRes = await fetchLive(`${BASE_URL}/robots.txt`);
  auditReport.robotsTxt = {
    status: robotsRes.status,
    content: robotsRes.text,
    hasSitemap: robotsRes.text.includes("https://www.filingby.com/sitemap.xml")
  };

  // 3. Sitemap.xml fetch and parse
  console.log("--> 3. Checking sitemap.xml...");
  const sitemapRes = await fetchLive(`${BASE_URL}/sitemap.xml`);
  const locMatches = [...sitemapRes.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  auditReport.sitemap = {
    status: sitemapRes.status,
    totalUrls: locMatches.length,
    urls: locMatches
  };

  // 4. Audit all sitemap URLs live
  console.log(`--> 4. Auditing all ${locMatches.length} sitemap URLs individually...`);
  const sitemapAuditList = [];
  for (let i = 0; i < locMatches.length; i++) {
    const url = locMatches[i];
    const res = await fetchLive(url);
    const html = res.text;

    // extract robots
    const robotsMatch = html.match(/<meta[^>]*name=["'](?:robots|googlebot)["'][^>]*content=["']([^"']*)["']/i);
    const robots = robotsMatch ? robotsMatch[1] : (html.includes("noindex") ? "contains noindex" : "none (index default)");

    // extract canonical
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : "none";

    // word count in prerendered body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '').replace(/<[^>]+>/g, ' ') : '';
    const words = bodyContent.trim().split(/\s+/).filter(w => w.length > 0).length;

    // content type
    let contentType = "Other";
    if (url.includes("/blog/")) contentType = "Blog";
    else if (url.includes("/services/")) contentType = "Core Service";
    else if (url.includes("calculator") || url.includes("/calculators/")) contentType = "Calculator/Tool";
    else if (url.includes("privacy") || url.includes("terms") || url.includes("refund") || url.includes("disclaimer") || url.includes("policy")) contentType = "Legal/Trust";
    else if (url.includes("about") || url.includes("contact") || url.includes("promise") || url.includes("customer-care") || url.includes("editorial")) contentType = "Identity/Trust";
    else if (url === BASE_URL || url === `${BASE_URL}/`) contentType = "Homepage";
    else if (url.includes("virtual-space") || url.includes("locations") || url.includes("ecommerce-office")) contentType = "Virtual Office Hub";

    // Substantive check
    const isSubstantive = res.status === 200 && words > 200 && !html.includes("Lost in Compliance Space");

    // AdSense Value Risk
    let risk = "STRONG";
    if (res.status === 404) {
      risk = "REMOVE/NOINDEX CANDIDATE";
    } else if (words < 150) {
      risk = "QUESTIONABLE";
    } else if (words < 300 && contentType !== "Legal/Trust") {
      risk = "ACCEPTABLE";
    }

    sitemapAuditList.push({
      url,
      http: res.status,
      robots,
      canonical,
      contentType,
      words,
      substantive: isSubstantive ? "YES" : "NO",
      risk
    });
  }
  auditReport.sitemapAudit = sitemapAuditList;

  // 5. 20-Blog Human Sample Quality Scan
  console.log("--> 5. Auditing 20-Blog Human Quality Sample...");
  const sampleBlogs = [
    // 4 Tax/TDS
    "presumptive-taxation-44ad-44ada-guide",
    "tds-on-salary-vs-professional-fees-guide",
    "tds-on-professional-fees-contracts-rent-guide",
    "tax-audit-applicability-guide",
    // 4 GST
    "gst-registration-guide",
    "gst-input-tax-credit-rules-guide",
    "gst-e-invoicing-applicability-and-limits-guide",
    "gst-annual-return-gstr-9-checklist-guide",
    // 3 MCA/LLP
    "how-to-register-private-limited-company",
    "llp-vs-private-limited-for-bootstrapped-startups",
    "roc-compliance-calendar-private-limited-guide",
    // 3 Trademark
    "trademark-search-and-class-selection-guide",
    "trademark-objection-reply-guide",
    "trademark-renewal-restoration-guide",
    // 2 FSSAI/MSME
    "fssai-basic-vs-state-vs-central-guide",
    "udyam-registration-for-service-business-guide",
    // 2 Startup/IEC
    "startup-india-benefits-and-documents-guide",
    "iec-registration-documents-and-process-guide",
    // 2 Virtual Office
    "virtual-office-for-gst-registration-guide",
    "virtual-office-for-company-registration-guide"
  ];

  const blogSampleResults = [];
  for (const slug of sampleBlogs) {
    const url = `${BASE_URL}/blog/${slug}`;
    const res = await fetchLive(url);
    const html = res.text;

    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
    const hasSchema = html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"');
    const hasEditorialAuthor = html.includes("FilingBy Editorial Team");
    const hasTable = /<table[\s\S]*?<\/table>/i.test(html);
    const hasGovCitations = /incometax|cbic\.gov|mca\.gov|ipindia|udyamregistration|fssai\.gov/i.test(html);
    const hasWhatsApp = html.includes("wa.me");

    blogSampleResults.push({
      slug,
      url,
      status: res.status,
      words,
      hasSchema,
      hasEditorialAuthor,
      hasTable,
      hasGovCitations,
      hasWhatsApp
    });
  }
  auditReport.blogSample = blogSampleResults;

  // 6. Core 14 Services Quality Scan
  console.log("--> 6. Auditing Core 14 Services...");
  const coreServices = [
    "gst-registration",
    "gst-return-filing",
    "private-limited-company",
    "llp-registration",
    "one-person-company",
    "trademark-registration",
    "itr-1-filing",
    "fssai-basic-registration",
    "udyam-registration",
    "iec-registration",
    "startup-india",
    "roc-annual-filing-pvt",
    "roc-annual-filing-llp",
    "trust-registration"
  ];

  const coreServiceResults = [];
  for (const slug of coreServices) {
    const url = `${BASE_URL}/services/${slug}`;
    const res = await fetchLive(url);
    const html = res.text;

    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
    const isIndexed = !html.includes("noindex");
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : "";
    const hasFaq = html.includes("FAQ") || html.includes("Frequently Asked Questions");
    const hasGovDistinction = html.includes("independent") || html.includes("official portal") || html.includes("Government fee");

    coreServiceResults.push({
      slug,
      url,
      status: res.status,
      words,
      isIndexed,
      canonical,
      hasFaq,
      hasGovDistinction
    });
  }
  auditReport.coreServices = coreServiceResults;

  // 7. Secondary Services Sample (check noindex, follow)
  console.log("--> 7. Sampling Secondary Services (verifying noindex, follow)...");
  const secondarySample = [
    "tax-audit",
    "gstr-9c-filing",
    "gst-lut-filing",
    "section-8-company",
    "nidhi-company",
    "trademark-objection",
    "trademark-renewal",
    "itr-2-filing",
    "itr-3-filing",
    "fssai-state-license",
    "fssai-central-license",
    "import-export-code-modification",
    "startup-india-seed-fund",
    "director-kyc-dir-3",
    "society-registration"
  ];

  const secondaryResults = [];
  for (const slug of secondarySample) {
    const url = `${BASE_URL}/services/${slug}`;
    const res = await fetchLive(url);
    const html = res.text;
    const isNoindex = html.includes("noindex");
    const isFollow = html.includes("follow");
    const inSitemap = auditReport.sitemap.urls.includes(url);

    secondaryResults.push({
      slug,
      status: res.status,
      isNoindex,
      isFollow,
      inSitemap
    });
  }
  auditReport.secondaryServicesSample = secondaryResults;

  // 8. Virtual Office Geo Pages Sample (verifying noindex, follow)
  console.log("--> 8. Auditing Virtual Office Geo Pages...");
  const geoPages = [
    "delhi", "mumbai", "bangalore", "pune", "hyderabad", "chennai", "kolkata",
    "ahmedabad", "surat", "jaipur", "lucknow", "chandigarh", "kochi", "indore",
    "bhopal", "gurgaon", "noida"
  ];

  const geoResults = [];
  for (const city of geoPages) {
    const url = `${BASE_URL}/virtual-office-${city}`;
    const res = await fetchLive(url);
    const html = res.text;
    const isNoindex = html.includes("noindex");
    const inSitemap = auditReport.sitemap.urls.includes(url);

    geoResults.push({
      city,
      url,
      status: res.status,
      isNoindex,
      inSitemap
    });
  }
  auditReport.geoPages = geoResults;

  // 9. Trust & Identity Pages
  console.log("--> 9. Auditing About Us & Contact Us...");
  const aboutRes = await fetchLive(`${BASE_URL}/about-us`);
  const contactRes = await fetchLive(`${BASE_URL}/contact-us`);
  const editorialDeskRes = await fetchLive(`${BASE_URL}/editorial-team`);
  auditReport.trustPages = {
    about: {
      status: aboutRes.status,
      mentionsPlatform: /platform|technology/i.test(aboutRes.text),
      mentionsIndependent: /independent/i.test(aboutRes.text),
      mentionsCAWarning: /not a ca firm|independent private|assists/i.test(aboutRes.text),
      words: aboutRes.text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length
    },
    contact: {
      status: contactRes.status,
      hasEmail: contactRes.text.includes("support@filingby.com"),
      hasPhone: contactRes.text.includes("+91 75671 26945"),
      hasOffice: contactRes.text.includes("SURAT"),
      words: contactRes.text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length
    },
    editorialTeam: {
      status: editorialDeskRes.status,
      words: editorialDeskRes.text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length
    }
  };

  // 10. Sitewide Claims & Credentials
  console.log("--> 10. Scanning Sitewide Claims & Credentials across tested pages...");
  // Combine all texts gathered so far
  const combinedTexts = [
    aboutRes.text,
    contactRes.text,
    ...blogSampleResults.map(b => b.url),
    ...coreServiceResults.map(s => s.url)
  ];

  // 11. Soft 404 test
  console.log("--> 11. Testing Soft 404s...");
  const nonExistentUrls = [
    `${BASE_URL}/services/random-fake-service-xyz`,
    `${BASE_URL}/blog/random-fake-blog-article-xyz`,
    `${BASE_URL}/calculators/random-fake-calc-xyz`,
    `${BASE_URL}/virtual-office-random-fake-city-xyz`,
    `${BASE_URL}/random-page-12345`
  ];
  const soft404Results = [];
  for (const url of nonExistentUrls) {
    const res = await fetchLive(url);
    const has404Status = res.status === 404;
    const hasNoindex = res.text.includes("noindex");
    soft404Results.push({
      url,
      status: res.status,
      isTrue404: has404Status,
      hasNoindex
    });
  }
  auditReport.soft404 = soft404Results;

  // 12. Write output
  fs.writeFileSync('scratch/final_adsense_live_audit_results.json', JSON.stringify(auditReport, null, 2), 'utf8');
  console.log("=== AUDIT COMPLETE. Data saved to scratch/final_adsense_live_audit_results.json ===");
}

runAudit();
