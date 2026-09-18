import SEO from "../../../shared/components/SEO.jsx";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-24 px-4">
      <SEO
        title="Privacy Policy & Data Security Standards | FilingBy.com"
        description="Read FilingBy.com's Privacy Policy. Learn how we handle KYC records, data security, Google AdSense cookies, analytics, and user privacy rights."
        canonical="/default/privacy-policy"
        noindex={false}
      />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">Privacy Policy</h1>
        
        <div className="text-xs text-gray-650 leading-relaxed space-y-4 font-medium">
          <p>
            FilingBy.com respects client privacy. This Privacy Policy details how we collect, store, and utilize information regarding your company registrations, compliance filings, billing transactions, and interactions with our digital platform.
          </p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">1. Information We Collect</h2>
          <p>
            We collect corporate name records, partner/director identity documentation (PAN, Aadhaar metadata), email coordinates, telephone numbers, and billing records required to execute commercial leases, landlord NOC folders, and statutory filing workflows.
          </p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">2. Data Security & KYC Confidentiality</h2>
          <p>
            All KYC document uploads are encrypted in secure storage buckets and accessed exclusively by authorized compliance desk coordinators during verification checks. We maintain strict role-based access controls and cryptographic safeguards. FilingBy follows privacy and security practices designed to align with applicable Indian data-protection requirements, including provisions of the Digital Personal Data Protection Act, 2023 as and when they become applicable.
          </p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">3. Third-Party Data Sharing Limitations</h2>
          <p>
            We do not sell, rent, or trade your contact numbers or email addresses with external marketers. Address details and company information are submitted strictly to official statutory tax panels (MCA, GSTN, Income Tax portal) as mandated by your requested filings.
          </p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">4. Google AdSense & Third-Party Advertising Cookies</h2>
          <p>
            We use third-party advertising companies, including Google, to serve advertisements when you visit our website. These companies may use cookies, web beacons, IP addresses, and other identifiers to collect information and serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites across the internet. Google and its partners may place or read cookies and collect device/browser identifiers as part of ad serving and measurement on eligible content pages. To learn more about how Google processes information, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">How Google uses data when you use our partners' sites or apps</a>.
          </p>
          <p>
            Users may opt out of personalized advertising at any time by visiting Google's Ad Settings at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">adssettings.google.com</a>. Alternatively, users may opt out of third-party vendor cookies for personalized advertising by visiting the Network Advertising Initiative / Digital Advertising Alliance portal at <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.aboutads.info</a>.
          </p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">5. Analytics & Web Measurement Technologies</h2>
          <p>
            FilingBy uses Google Analytics and server access logs to evaluate aggregate traffic metrics, monitor site health, and improve navigational clarity. These tools collect standard internet log information, including masked IP addresses, browser types, referral sources, and page dwell times, without associating individual identities with personal account records.
          </p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">6. User Privacy Rights & Contact Method</h2>
          <p>
            If you have questions regarding this Privacy Policy, wish to inspect the personal documentation retained on file, or wish to request data correction or deletion, contact our Data Privacy Contact via email at <a href="mailto:support@filingby.com" className="text-blue-600 hover:underline">support@filingby.com</a> or by post at FilingBy Compliance Solutions, B-1210 IT PARK, SURAT, Gujarat — 394101, India.
          </p>
        </div>
      </div>
    </div>
  );
}
