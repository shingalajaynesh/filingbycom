# AdSense Resubmission Final Checklist — FilingBy.com

Use this checklist prior to requesting Google AdSense review in your Google AdSense Console.

---

## 1. Technical & Verification Setup
- [x] **AdSense Verification Script**: Active in production `<head>` (`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6303291083449043" crossorigin="anonymous"></script>`).
- [x] **Publisher ID Verification**: Matches `ca-pub-6303291083449043` across `index.html`, `AdSenseBlock.jsx`, and `ads.txt`.
- [x] **ads.txt Validation**: Returns HTTP 200 at `https://www.filingby.com/ads.txt` in plain text with no HTML shell or BOM.
- [x] **robots.txt Access**: Explicitly allows `Googlebot` and `Mediapartners-Google` without blocking ad crawlers.
- [x] **Sitemap Integrity**: `https://www.filingby.com/sitemap.xml` contains canonical indexable URLs only, excluding login, register, admin, and dashboards.
- [x] **HTTPS & Canonicals**: Clean 301 redirects from HTTP to HTTPS and non-www `filingby.com` to `www.filingby.com`.

---

## 2. Monetization Route Scoping
- [x] **Route Allowlist Implemented**: `isAdSenseEligibleRoute(pathname)` restricts Google ads strictly to `/blog` and `/blog/*`.
- [x] **Protected Routes Monitored**: Zero ads displayed on login, register, password reset, client dashboards, admin portals, quote tools, or payment forms.
- [x] **No Empty Ad Units**: Placeholder boxes and empty ad containers are hidden prior to official approval.

---

## 3. Trust, Transparency & Consent Pages
- [x] **About Us**: Live at `/about-us` detailing platform operational purpose and business scope.
- [x] **Contact Us**: Live at `/contact-us` with active email (`support@filingby.com`), phone (`+91 75671 26945`), and submission form.
- [x] **Privacy Policy**: Live at `/default/privacy-policy` detailing data usage and Google AdSense cookie disclosures.
- [x] **Cookie Policy**: Live at `/default/cookie-policy` with third-party ad tracking details and Google Ads Settings opt-out links.
- [x] **Terms & Conditions**: Live at `/terms-conditions` defining platform SLA and user obligations.
- [x] **Refund Policy**: Live at `/default/refund` outlining 100% money-back criteria.
- [x] **Legal & Tax Disclaimer**: Live at `/default/disclaimer` explicitly stating non-affiliation with government bodies and professional advisory limits.
- [x] **Editorial Policy**: Live at `/default/editorial-policy` detailing primary sourcing and human expert review.
- [x] **Corrections Policy**: Live at `/default/corrections-policy` defining factual correction submission processes.
- [x] **Editorial Team**: Live at `/editorial-team` disclosing author and reviewer desks transparently.
- [x] **Footer Navigation**: All 8 policy pages linked from the global footer across desktop and mobile.
- [x] **Cookie Consent Banner**: Integrated with Google Consent Mode v2 supporting Accept/Decline options.

---

## 4. Content Quality & E-E-A-T Compliance
- [x] **Original Publisher Value**: Articles provide step-by-step guidance on Indian business registrations, tax rules, and virtual office regulations.
- [x] **No Placeholder Text**: Zero `Lorem ipsum`, `Coming Soon`, or ecommerce remnants (`T-Shirt`/`Blue`/`Jacket`).
- [x] **Unverified Claims Audited**: Generic claims logged in `REQUIRES_OWNER_VERIFICATION.md` for site owner confirmation.
- [x] **Structured Data Clean**: JSON-LD schemas validated without fake ratings or review inflation.

---

## 5. Final Live Verification Steps
1. Verify live site deployment at `https://www.filingby.com/`.
2. Inspect `https://www.filingby.com/ads.txt` in a browser tab to ensure HTTP 200 plain text response.
3. Test `https://www.filingby.com/sitemap.xml` in Google Search Console.
4. Confirm `REQUIRES_OWNER_VERIFICATION.md` items with the site owner.
5. In the Google AdSense Console, verify site status and click **Request Review** if status is not currently `Getting ready`.
