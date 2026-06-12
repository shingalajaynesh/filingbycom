import SEO from "../../../shared/components/SEO.jsx";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-24 px-4">
      <SEO
        title="Privacy Policy — FilingBy.com"
        description="FilingBy.com Privacy Policy. Learn how we handle your KYC documents, transaction records, and ensure your data remains secure."
        canonical="/privacy-policy"
        noindex={true}
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
        </div>
      </div>
    </div>
  );
}
