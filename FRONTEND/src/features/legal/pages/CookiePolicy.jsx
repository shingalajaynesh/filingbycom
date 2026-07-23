import SEO from "../../../shared/components/SEO.jsx";

export default function CookiePolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Cookie Policy & Tracking Preferences | FilingBy.com"
        description="Learn how FilingBy.com uses cookies, advertising identifiers, analytical tools, and consent settings to ensure secure browsing and personalized compliance experiences."
        canonical="/default/cookie-policy"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Legal Documentation</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Cookie Policy</h1>
          <p className="text-xs text-gray-500 mt-2">Last Updated: July 2026 | Cookie & Consent Management Framework</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p>
            FilingBy.com ("we", "us", or "our") uses cookies, local storage, web beacons, and related tracking technologies to provide seamless user sessions, maintain authenticated account states, analyze site traffic, and deliver relevant advertisements. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work efficiently, provide reporting information, and store user preferences across visits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">2. Categories of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">A. Strictly Necessary / Essential Cookies</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Required for core platform functionality, including secure session validation (Clerk authentication), form submissions, order routing, and security protection. These cannot be disabled.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">B. Analytical & Performance Cookies</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Help us understand how visitors interact with our website by measuring page views, navigation paths, and technical performance via privacy-focused tools like Google Tag Manager and Vercel Analytics.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">C. Advertising & Monetization Cookies (Google AdSense)</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Google AdSense and third-party advertising networks use cookies to serve ads on eligible informational pages (e.g. blog posts). These cookies measure ad impressions, prevent fraud, and serve personalized ads based on your visits to our site and other internet pages.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">3. Managing Your Cookie Preferences</h2>
            <p>
              When you first visit FilingBy.com, our Cookie Consent Banner enables you to accept or reject optional analytical and advertising cookies. You can also modify your browser settings to block or delete cookies at any time.
            </p>
            <p>
              To opt out of Google's personalized advertising cookies specifically, visit the official <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">www.aboutads.info</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
