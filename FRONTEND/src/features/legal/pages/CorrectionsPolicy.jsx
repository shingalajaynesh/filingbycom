import SEO from "../../../shared/components/SEO.jsx";

export default function CorrectionsPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Corrections & Fact-Checking Policy | FilingBy.com"
        description="FilingBy corrections policy. Learn how we handle factual updates, regulatory changes, reader feedback, and corrections across our business compliance knowledge hub."
        canonical="/default/corrections-policy"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Quality Assurance</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Corrections & Updates Policy</h1>
          <p className="text-xs text-gray-500 mt-2">Last Updated: July 2026 | Transparency in Factual Revisions</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p>
            FilingBy.com is committed to maintaining absolute factual accuracy across all published articles, statutory calculators, and business guides. When errors occur or when government authorities issue regulatory amendments, we act swiftly and transparently to correct the record.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">1. Submitting Correction Requests</h2>
            <p>
              If you identify an outdated statutory due date, a mathematical discrepancy in a calculator tool, or a factual error in an article, please inform our editorial desk immediately at <a href="mailto:support@filingby.com" className="text-blue-600 font-semibold underline">support@filingby.com</a> with the subject line <code>Correction Request</code>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">2. Evaluation & Revision Workflow</h2>
            <p>
              Upon receiving feedback, our compliance editorial team cross-references the flagged claim against primary MCA/GST/ITD notifications. If a factual correction is warranted:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
              <li>The article or calculator code is updated immediately.</li>
              <li>Significant factual modifications are documented with a clear "Updated Date" timestamp.</li>
              <li>Substantive changes to statutory interpretations are highlighted with an editor's note where appropriate.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">3. Regulatory & Budgetary Updates</h2>
            <p>
              When Union Budgets or MCA circulars introduce new tax slabs, fee schedules, or compliance forms, affected articles are placed into an expedited review queue to prevent outdated statutory advice from persisting online.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
