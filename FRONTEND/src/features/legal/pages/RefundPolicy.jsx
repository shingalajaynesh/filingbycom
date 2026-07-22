import SEO from "../../../shared/components/SEO.jsx";

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Refund Policy & 100% Money Back Guarantee | FilingBy"
        description="Read FilingBy.com's 100% money-back refund policy. Learn how our risk-free service guarantee applies if government registration details encounter issues."
        canonical="/default/refund"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Risk-Free Guarantee</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Refund Policy & Money-Back SLA</h1>
          <p className="text-xs text-gray-500 mt-2">Last Updated: July 2026 | Service Satisfaction & Rejection Refund SLA</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p>
            At FilingBy.com, we prioritize professional accountability, corporate transparency, and customer satisfaction. We take full ownership of the legal and administrative documentation prepared by our professional Chartered Accountants (CA) and workspace network partners.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-emerald-600 pl-3">1. 100% Money-Back Refund SLA</h2>
            <p>
              We offer a strict 100% Money-Back Guarantee for virtual office address verification orders and company registration filing assistance.
            </p>
            <p>
              If the target government registry authority (such as the State Commercial Tax Department for GST registration or the MCA Registrar of Companies) formally rejects your application due to a verified document defect directly attributable to FilingBy.com or our property host (e.g. invalid land deed, landlord verification dispute, title defect in NOC), FilingBy will refund 100% of the service fees paid.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-emerald-600 pl-3">2. Exclusions & Non-Refundable Scenarios</h2>
            <p>
              To maintain fair commercial practices, refunds are not applicable under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Client-Side Verification Defaults:</strong> Rejections caused by mismatched client identity proofs (e.g. incorrect PAN name, invalid Aadhaar address, forged signature, unverified Director Identification Number).
              </li>
              <li>
                <strong>Change of Mind / Voluntary Cancellation:</strong> Orders cancelled after legal documentation (rent agreement drafting, NOC notarization, electric utility bill compilation) has already been dispatched or uploaded to government portals.
              </li>
              <li>
                <strong>Client Non-Response:</strong> Failure by the Client to respond to clarification queries issued by statutory officers within the mandated statutory timeframe (typically 7 working days).
              </li>
              <li>
                <strong>Government Fees:</strong> Statutory fees paid directly to government portals (MCA challans, stamp duty, GST portal charges) are non-refundable once processed by the treasury.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-emerald-600 pl-3">3. Claim Refund Submission Procedure</h2>
            <p>
              To initiate a refund request, the Client must email <strong>refunds@filingby.com</strong> or contact their designated compliance manager with:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>FilingBy Order Reference Number</li>
              <li>Copy of the Official Government Rejection Notice (REG-05 for GST, MCA Rejection Challan)</li>
              <li>Bank account details for electronic credit transfer</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-emerald-600 pl-3">4. Processing Timelines</h2>
            <p>
              Once a refund request is verified and approved by our legal audit team, the refund amount will be credited back to the Client's original payment method (Bank Transfer, Credit Card, UPI, Netbanking) within <strong>7 to 10 working days</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
