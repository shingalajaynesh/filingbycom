import SEO from "../../../shared/components/SEO.jsx";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-24 px-4">
      <SEO
        title="Privacy Policy & Data Security Standards | FilingBy.com"
        description="Read FilingBy.com's Privacy Policy. Learn how we encrypt and protect your KYC documents, business records, and payment information with strict confidentiality."
        canonical="/default/privacy-policy"
        noindex={false}
      />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">Privacy Policy</h1>
        
        <div className="text-xs text-gray-650 leading-relaxed space-y-4 font-medium">
          <p>FilingBy.com respects client privacy. This Privacy Policy details how we collect, store, and utilize details regarding your company registrations and transactions.</p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">1. Information We Collect</h2>
          <p>We collect corporate name records, partner/director Aadhaar/PAN metadata, email addresses, phone coordinates, and payment records necessary to execute rent deeds and NOC folders.</p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">2. Data Security</h2>
          <p>All KYC document uploads are stored in encrypted buckets and accessed solely by authorized CS/CA registration desk officers during verification checks.</p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">3. Third Party Sharing</h2>
          <p>We do not share your private numbers or emails with external marketers. Address details are submitted exclusively to official governmental tax panels.</p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">4. Google AdSense & Third-Party Advertising Cookies</h2>
          <p>
            We use third-party advertising companies, including Google, to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet.
          </p>
          <p>
            Google and its partners may place or read cookies, use web beacons, IP addresses, and similar identifiers as part of ad serving and measurement on eligible content pages. You can learn more at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">How Google uses data when you use our partners' sites or apps</a>.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting the Google Ads Settings page at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">adssettings.google.com</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.aboutads.info</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
