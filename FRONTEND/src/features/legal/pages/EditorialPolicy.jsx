import SEO from "../../../shared/components/SEO.jsx";

export default function EditorialPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Editorial Policy & Fact-Checking Standards | FilingBy.com"
        description="FilingBy editorial policy. Learn how our editorial desk researches, fact-checks, updates, and reviews business compliance guides, tax filing articles, and legal resources."
        canonical="/default/editorial-policy"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Editorial Integrity</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Editorial Policy</h1>
          <p className="text-xs text-gray-500 mt-2">Last Updated: July 2026 | Content Quality & Verification Principles</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p>
            At FilingBy.com, our mission is to deliver accurate, objective, easy-to-understand, and practical statutory compliance information to Indian business owners, founders, and tax professionals.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">1. Primary Source Verification</h2>
            <p>
              Our editorial content is researched using official primary government sources, statutory acts, Ministry of Corporate Affairs (MCA) circulars, Central Board of Direct Taxes (CBDT) notifications, and GST Council updates. We cite official legislation and government portals directly when discussing compliance requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">2. Editorial Independence & Ad Policy</h2>
            <p>
              Our editorial desk operates independently of commercial partnerships and advertising sponsors. Advertisements served via Google AdSense or external networks do not influence our research findings, tool calculations, or editorial reviews.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">3. Responsible AI & Human Expert Oversight</h2>
            <p>
              We utilize modern editorial software to assist with draft outlines, formatting, and structural proofing. However, all technical tax calculations, statutory deadlines, legal steps, and government form requirements are systematically verified and edited by human compliance specialists before publication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">4. Regular Audits & Date Currency</h2>
            <p>
              Tax rates and corporate filing procedures change each financial year. Our team regularly audits published guides to ensure dates, slab rates, late fees, and form names reflect current laws (e.g. FY 2025-26 / AY 2026-27 regulations).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
