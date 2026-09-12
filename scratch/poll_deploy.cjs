const BASE_URL = "https://www.filingby.com";

async function pollDeployment() {
  console.log("Checking Vercel live deployment status...");
  let deployed = false;
  let attempts = 0;

  while (!deployed && attempts < 24) {
    attempts++;
    try {
      const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml?_t=${Date.now()}`);
      const text = await sitemapRes.text();
      const count = (text.match(/<loc>/g) || []).length;
      
      const privacyRes = await fetch(`${BASE_URL}/default/privacy-policy?_t=${Date.now()}`);
      const privacyText = await privacyRes.text();
      const hasAdSenseRaw = privacyText.includes("Google AdSense &amp; Third-Party Advertising Cookies") || privacyText.includes("Google AdSense & Third-Party Advertising Cookies");

      const locationsRes = await fetch(`${BASE_URL}/locations?_t=${Date.now()}`);
      const locationsText = await locationsRes.text();
      const locationsNoindex = locationsText.includes('content="noindex, follow"');

      console.log(`[Attempt ${attempts}] Sitemap count: ${count}, Privacy raw AdSense: ${hasAdSenseRaw}, Locations noindex: ${locationsNoindex}`);

      if (count === 100 && hasAdSenseRaw && locationsNoindex) {
        deployed = true;
        console.log("=== VERCEL PRODUCTION DEPLOYMENT IS LIVE! ===");
        break;
      }
    } catch (e) {
      console.log(`Attempt ${attempts} error:`, e.message);
    }

    await new Promise(r => setTimeout(r, 10000));
  }

  if (!deployed) {
    console.error("Timed out waiting for Vercel production deployment.");
    process.exit(1);
  }
}

pollDeployment();
