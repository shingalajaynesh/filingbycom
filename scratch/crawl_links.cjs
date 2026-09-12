const fs = require('fs');

async function runLinkCrawl() {
  console.log("=== CRAWLING INTERNAL LINKS FROM SITEMAP URLS ===");
  const sitemapData = JSON.parse(fs.readFileSync('scratch/final_adsense_live_audit_results.json', 'utf8'));
  const sitemapUrls = sitemapData.sitemap.urls;

  const internalLinks = new Set();
  const externalGovLinks = new Set();

  // Pick 30 representative pages across the site to harvest links
  const samplePages = [
    'https://www.filingby.com/',
    'https://www.filingby.com/about-us',
    'https://www.filingby.com/contact-us',
    'https://www.filingby.com/our-promise',
    'https://www.filingby.com/faq',
    'https://www.filingby.com/virtual-space',
    'https://www.filingby.com/locations',
    'https://www.filingby.com/ecommerce-office',
    'https://www.filingby.com/blog',
    'https://www.filingby.com/gst-calculator',
    'https://www.filingby.com/income-tax-calculator',
    'https://www.filingby.com/roc-tools',
    'https://www.filingby.com/company-registration-guides',
    'https://www.filingby.com/trademark-search',
    'https://www.filingby.com/legal-templates',
    'https://www.filingby.com/terms-conditions',
    'https://www.filingby.com/default/refund',
    'https://www.filingby.com/default/privacy-policy',
    'https://www.filingby.com/editorial-team',
    ...sitemapData.coreServices.map(s => s.url).slice(0, 5),
    ...sitemapUrls.filter(u => u.includes('/blog/')).slice(0, 6)
  ];

  for (const pageUrl of samplePages) {
    try {
      const res = await fetch(pageUrl);
      const html = await res.text();
      const hrefMatches = [...html.matchAll(/href=["']([^"'#\s]+)["']/gi)].map(m => m[1]);

      for (let href of hrefMatches) {
        if (href.startsWith('/')) {
          internalLinks.add(`https://www.filingby.com${href}`);
        } else if (href.startsWith('https://www.filingby.com')) {
          internalLinks.add(href.split('#')[0]);
        } else if (href.includes('.gov.in') || href.includes('incometax.gov') || href.includes('mca.gov') || href.includes('cbic.gov') || href.includes('ipindia')) {
          externalGovLinks.add(href);
        }
      }
    } catch (e) {
      console.error("Error harvesting from", pageUrl, e.message);
    }
  }

  console.log(`Discovered ${internalLinks.size} unique internal links and ${externalGovLinks.size} external gov links.`);

  // Test internal links
  const internalResults = { '200': 0, '3xx': 0, '404': 0, '5xx': 0, brokenList: [] };
  for (const link of internalLinks) {
    try {
      const res = await fetch(link, { redirect: 'manual' });
      if (res.status >= 200 && res.status < 300) {
        internalResults['200']++;
      } else if (res.status >= 300 && res.status < 400) {
        internalResults['3xx']++;
      } else if (res.status === 404) {
        internalResults['404']++;
        internalResults.brokenList.push({ link, status: 404 });
      } else {
        internalResults['5xx']++;
        internalResults.brokenList.push({ link, status: res.status });
      }
    } catch (e) {
      internalResults.brokenList.push({ link, status: 0, error: e.message });
    }
  }

  console.log("Internal Link Test Results:", internalResults);

  // Test sample external gov links
  const govResults = [];
  for (const link of [...externalGovLinks].slice(0, 10)) {
    try {
      const res = await fetch(link, {
        method: 'HEAD',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      govResults.push({ link, status: res.status });
    } catch (e) {
      govResults.push({ link, status: 'error', error: e.message });
    }
  }

  console.log("Sample Gov Links Health:", govResults);

  fs.writeFileSync('scratch/broken_link_results.json', JSON.stringify({
    internalResults,
    govResults
  }, null, 2), 'utf8');
}

runLinkCrawl();
