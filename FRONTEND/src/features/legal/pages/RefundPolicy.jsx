import SEO from "../../../shared/components/SEO.jsx";

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-24 px-4">
      <SEO
        title="Refund Policy — FilingBy.com"
        description="FilingBy.com Refund Policy. Read details of our 100% money-back guarantee if business registration fails."
        canonical="/refund-policy"
        noindex={true}
      />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">Refund Policy</h1>
        
        <div className="text-xs text-gray-650 leading-relaxed space-y-4 font-medium">
          <p>At FilingBy.com, we stand by the quality of our workspaces. We offer a 100% money-back guarantee in case of registration rejections.</p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">1. Refund Eligibility</h2>
          <p>Refunds are applicable only if the target government registry authority (MCA Registrar or GST Department) formally rejects the address verification details due to reasons directly attributable to FilingBy.com documentation (e.g. invalid land deeds, landlord dispute).</p>
          
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">2. Exclusions</h2>
          <p>Rejections due to client identity proof mismatches, pending business verification notices, or wrong KYC submission do not qualify for refunds.</p>

          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">3. Timeline</h2>
          <p>Approved refunds are processed back to the original source account within 7 to 10 working days after formal inspection report submission.</p>
        </div>
      </div>
    </div>
  );
}
