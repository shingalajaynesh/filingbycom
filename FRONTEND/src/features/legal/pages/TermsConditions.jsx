import SEO from "../../../shared/components/SEO.jsx";

export default function TermsConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-24 px-4">
      <SEO
        title="Terms and Conditions — FilingBy.com"
        description="FilingBy.com Terms & Conditions. Read standard agreements governing the lease of virtual office services in India."
        canonical="/terms-conditions"
        noindex={false}
      />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">Terms and Conditions</h1>
        
        <div className="text-xs text-gray-650 leading-relaxed space-y-4 font-medium">
          <p>Welcome to FilingBy.com. These Terms and Conditions govern your use of our virtual office services, agreements, and support interfaces.</p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">1. Service Scope</h2>
          <p>FilingBy.com provides legal addresses, NOC documentation, utility bills, and inspection support for corporate registrar and GST registry listings. Physical desks are provided temporarily during audits as outlined in slot agreements.</p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">2. Compliance Guarantee</h2>
          <p>Clients are solely responsible for compliance with central and local laws. FilingBy does not assume liability for business actions, taxation disputes, or corporate defaults associated with registered addresses.</p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">3. Subscription and Renewals</h2>
          <p>Lease agreements are valid for the specified tenure (typically 12 months) and must be renewed 30 days before expiration to avoid registry deregistration penalties.</p>
        </div>
      </div>
    </div>
  );
}
