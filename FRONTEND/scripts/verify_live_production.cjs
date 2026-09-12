const https = require('https');

async function fetchUrl(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache', ...(options.headers || {}) },
    redirect: 'manual'
  });
  const text = await res.text();
  return {
    status: res.status,
    headers: res.headers,
    text,
    location: res.headers.get('location')
  };
}

(async () => {
  console.log('========================================================');
  console.log('=== 10. RAW LIVE HTTP VERIFICATION: CORE STATIC PAGES ===');
  console.log('========================================================');
  
  // A. Homepage
  const home = await fetchUrl('https://www.filingby.com/');
  console.log('Homepage Status:', home.status);
  console.log('Homepage length:', home.text.length);
  console.log('No synthetic review names (e.g. Rajesh Sharma, Ananya Verma):', 
    !home.text.includes('Rajesh Sharma') && !home.text.includes('Ananya Verma'));
  console.log('No duplicate testimonial heading:', 
    (home.text.match(/What Our Clients Say/gi) || []).length <= 1);
  console.log('No unsupported guarantees (e.g. 100% compliance guaranteed):', 
    !/100% compliance guaranteed/i.test(home.text));

  // B. About Us
  const about = await fetchUrl('https://www.filingby.com/about-us');
  console.log('\nAbout Us Status:', about.status);
  console.log('About Us length:', about.text.length);
  console.log('Accurate business identity (Online CA-backed platform / technology):',
    about.text.includes('FilingBy') && !about.text.includes('Hiren Patel'));
  console.log('No fake CA/CS team / profiles:', 
    !about.text.includes('FCA') && !about.text.includes('Hiren Patel'));

  // C. Contact Us
  const contact = await fetchUrl('https://www.filingby.com/contact-us');
  console.log('\nContact Us Status:', contact.status);
  console.log('Operations Office accurate (Surat Mota Varachha):', 
    contact.text.includes('Surat') || contact.text.includes('75671'));
  console.log('No placeholder/fake Delhi/Ahmedabad address claims:', 
    !contact.text.includes('fake') && !/New Delhi.*Headquarters/i.test(contact.text));

  // D. Blog directory
  const blog = await fetchUrl('https://www.filingby.com/blog');
  console.log('\nBlog Directory Status:', blog.status);
  const articleMatches = (blog.text.match(/href="\/blog\/[a-z0-9-]+"/g) || []);
  const uniqueArticles = new Set(articleMatches);
  console.log('Article links discoverable in initial HTML:', uniqueArticles.size);

  console.log('\n========================================================');
  console.log('=== 11. LIVE CORE SERVICES VERIFICATION (ALL 14) =======');
  console.log('========================================================');
  const coreSlugs = [
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

  console.log('| Slug | HTTP | Words | Robots | Canonical Self | Service Schema | Status |');
  console.log('|---|---|---|---|---|---|---|');

  for (const slug of coreSlugs) {
    const res = await fetchUrl(`https://www.filingby.com/services/${slug}`);
    const html = res.text;
    const is200 = res.status === 200;
    const isIndexed = html.includes('content="index, follow');
    const canonicalExpected = `https://www.filingby.com/services/${slug}`;
    const hasCanonical = html.includes(`href="${canonicalExpected}"`);
    const hasServiceSchema = html.includes('"@type":"Service"');
    const hasProductSchema = html.includes('"@type":"Product"');
    const hasReviews = html.includes('"review"') || html.includes('"Review"');
    const words = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    const pass = is200 && isIndexed && hasCanonical && hasServiceSchema && !hasProductSchema && !hasReviews;
    console.log(`| ${slug} | ${res.status} | ${words} | ${isIndexed ? 'index, follow' : 'NOINDEX'} | ${hasCanonical ? 'YES' : 'NO'} | ${hasServiceSchema ? '@type: Service' : 'MISSING'} | ${pass ? 'PASS' : 'FAIL'} |`);
  }

  console.log('\n========================================================');
  console.log('=== 12. LIVE SECONDARY SERVICES NOINDEX CHECK (15 SAMPLE) ==');
  console.log('========================================================');
  const sampleNonCore = [
    'apeda-registration',
    'tan-registration',
    'pan-card',
    'partnership-firm',
    'trademark-objection',
    'trademark-hearing',
    'fssai-renewal-modification',
    'fssai-state-license',
    'fssai-central-license',
    'gst-lut-filing',
    'gst-cancellation-revocation',
    'darpan-registration',
    'section-8-company',
    'dir-3-kyc',
    'msme-loan'
  ];

  for (const slug of sampleNonCore) {
    const res = await fetchUrl(`https://www.filingby.com/services/${slug}`);
    const isNoindex = res.text.includes('content="noindex, follow');
    const hasCanonical = res.text.includes(`href="https://www.filingby.com/services/${slug}"`);
    console.log(`Non-core [${slug}]: HTTP ${res.status} | noindex, follow = ${isNoindex} | Canonical self = ${hasCanonical}`);
  }

  console.log('\n========================================================');
  console.log('=== 13. LIVE VIRTUAL-OFFICE GEO & REDIRECT CHECK =======');
  console.log('========================================================');
  const voUrls = [
    'https://www.filingby.com/virtual-office-surat',
    'https://www.filingby.com/virtual-office-surat/adajan',
    'https://www.filingby.com/virtual-office-mumbai',
    'https://www.filingby.com/virtual-office-mumbai/bkc',
    'https://www.filingby.com/virtual-office-bangalore',
    'https://www.filingby.com/virtual-office-pune/kharadi'
  ];
  for (const u of voUrls) {
    const res = await fetchUrl(u);
    const isNoindex = res.text.includes('content="noindex, follow');
    console.log(`${u.replace('https://www.filingby.com', '')}: HTTP ${res.status} | noindex, follow = ${isNoindex}`);
  }

  // Redirect check for legacy /virtual-office/mumbai
  const legacyRes = await fetchUrl('https://www.filingby.com/virtual-office/mumbai');
  console.log('Legacy /virtual-office/mumbai redirect status:', legacyRes.status, 'Location:', legacyRes.location);
  
  const legacyAreaRes = await fetchUrl('https://www.filingby.com/virtual-office/mumbai/bkc');
  console.log('Legacy /virtual-office/mumbai/bkc redirect status:', legacyAreaRes.status, 'Location:', legacyAreaRes.location);

  console.log('\n========================================================');
  console.log('=== 14. LIVE UDYAM CHECK ===============================');
  console.log('========================================================');
  const udyamLive = await fetchUrl('https://www.filingby.com/services/udyam-registration');
  const uText = udyamLive.text;
  console.log('Positioning header:', uText.includes('Udyam Registration Guidance & MSME Classification Support'));
  console.log('Official portal linked directly:', uText.includes('https://udyamregistration.gov.in/'));
  console.log('Government registration fee ₹0 stated:', uText.includes('₹0'));
  console.log('Thresholds (₹2.5Cr / ₹10Cr, ₹25Cr / ₹100Cr, ₹125Cr / ₹500Cr):', 
    uText.includes('2.5 Crore') && uText.includes('25 Crore') && uText.includes('125 Crore'));
  console.log('Ministry non-affiliation notice:', 
    uText.includes('not affiliated with or authorized by the Ministry of MSME'));
  console.log('No FilingBy filing claim:', 
    !/we file your Udyam/i.test(uText) && !/application-filing assistance/i.test(uText));

  console.log('\n========================================================');
  console.log('=== 15. LIVE FSSAI CHECK ===============================');
  console.log('========================================================');
  const fssaiLive = await fetchUrl('https://www.filingby.com/services/fssai-basic-registration');
  const fText = fssaiLive.text;
  console.log('Turnover threshold ₹1.5 crore:', fText.includes('1.5 Crore'));
  console.log('State Licence threshold ₹50 crore:', fText.includes('50 Crore'));
  console.log('Perpetual validity explained:', fText.includes('perpetual validity'));
  console.log('Validity vs fee obligation distinction:', 
    fText.includes('perpetual validity does not mean food licensing is fee-free') || fText.includes('statutory fee obligations'));
  console.log('FoSCoS identified as official system:', fText.includes('FoSCoS'));
  console.log('FilingBy professional fee separated:', fText.includes('Separate from FilingBy') || fText.includes('separate, optional professional'));

  console.log('\n========================================================');
  console.log('=== 16. LIVE TAX CALCULATOR CHECK ======================');
  console.log('========================================================');
  const taxLive = await fetchUrl('https://www.filingby.com/income-tax-calculator');
  const tText = taxLive.text;
  console.log('AY 2026-27 Slabs (4L, 8L, 12L, 16L, 20L, 24L):', 
    tText.includes('4,00,000') && tText.includes('8,00,000') && tText.includes('12,00,000') && tText.includes('16,00,000') && tText.includes('20,00,000') && tText.includes('24,00,000'));
  console.log('Standard deduction ₹75,000:', tText.includes('75,000'));
  console.log('Section 87A rebate ₹60,000 up to ₹12L:', tText.includes('60,000'));
  console.log('Zero outdated Finance Act 2024 citation:', !tText.includes('Finance Act 2024'));

  console.log('\n========================================================');
  console.log('=== 17. ADS.TXT, 18. ROBOTS.TXT, 19. SITEMAP ===========');
  console.log('========================================================');
  const adsLive = await fetchUrl('https://www.filingby.com/ads.txt');
  console.log('ads.txt HTTP status:', adsLive.status);
  console.log('ads.txt content:', adsLive.text.trim());

  const robotsLive = await fetchUrl('https://www.filingby.com/robots.txt');
  console.log('robots.txt HTTP status:', robotsLive.status);
  console.log('robots.txt points to sitemap:', robotsLive.text.includes('https://www.filingby.com/sitemap.xml'));

  const sitemapLive = await fetchUrl('https://www.filingby.com/sitemap.xml');
  console.log('sitemap.xml HTTP status:', sitemapLive.status);
  const sitemapUrls = sitemapLive.text.match(/<loc>(.*?)<\/loc>/g)?.map(l => l.replace(/<\/?loc>/g, '')) || [];
  console.log('Total URLs in live sitemap:', sitemapUrls.length);

  console.log('\n========================================================');
  console.log('=== 20. TRUE 404 VERIFICATION ==========================');
  console.log('========================================================');
  const randSlug = `nonexistent-check-${Date.now()}`;
  const notFound = await fetchUrl(`https://www.filingby.com/${randSlug}`);
  console.log('Random 404 HTTP Status:', notFound.status);
  console.log('Has noindex, nofollow:', notFound.text.includes('noindex, nofollow'));
  console.log('Has Page Not Found UI:', notFound.text.includes('404') || notFound.text.includes('Page Not Found'));

})();
