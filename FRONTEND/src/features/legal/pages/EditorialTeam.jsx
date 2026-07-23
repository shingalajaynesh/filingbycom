import SEO from "../../../shared/components/SEO.jsx";

export default function EditorialTeam() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Editorial Team & Compliance Reviewers | FilingBy.com"
        description="Meet the FilingBy Editorial Desk and Content Team behind our Indian business compliance guides, tax filing instructions, and virtual office guides."
        canonical="/editorial-team"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Authors & Reviewers</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">FilingBy Editorial Desk & Content Team</h1>
          <p className="text-xs text-gray-500 mt-2">Transparent Publishing & Verification Network</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p>
            FilingBy.com publishes structured compliance resources, tax calculators, statutory guides, and legal templates to simplify business governance across India.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                  ED
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">FilingBy Editorial Desk</h3>
                  <span className="text-[11px] text-blue-600 font-semibold">Primary Publishing Desk</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our in-house editorial desk researches business incorporation procedures, GST regulations, ITR rules, and corporate governance workflows. Content is structured to break down complex government circulars into clear, actionable steps for Indian founders.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                  CT
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">FilingBy Content Team</h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">Technical Review & Fact Checking</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The technical review desk validates mathematical formulas, statutory form names (SPICe+, AOC-4, MGT-7, ITR-1 to ITR-7), government portals (MCA, GSTN, IP India), and date currency before guides are published or updated.
              </p>
            </div>
          </div>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">Editorial Guidelines & Transparency</h2>
            <p>
              We do not fabricate individual practitioner identities or assign fake professional credentials. Our publishing desk operates transparently as an organization, citing official government notifications and primary statutes directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
