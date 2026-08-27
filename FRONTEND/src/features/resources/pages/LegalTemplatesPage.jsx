import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { legalTemplateCards, resourceFaqs } from "../data/resourcePages.js";

export default function LegalTemplatesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Legal Templates & Business Contracts India | Founder Agreements & NDAs"
        description="Comprehensive guide to drafting legally enforceable business contracts in India. Access blueprints for NDAs, Founders Agreements, Employment Contracts, and SHAs."
        keywords="legal templates India, NDA draft, employment agreement, shareholders agreement, founders agreement vesting, Indian Contract Act 1872"
        canonical="/legal-templates"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Legal Templates", url: "/legal-templates" }
          ]),
          buildFaqSchema(resourceFaqs.legalTemplates)
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md">
            <span>Corporate Contract Desk</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Legal Templates &amp; Business Contract Blueprints
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Essential drafting standards, mandatory statutory clauses, and execution protocols for Indian startups and commercial enterprises under the Indian Contract Act, 1872.
          </p>
        </div>
      </section>

      {/* Agreement Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {legalTemplateCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-blue-200 transition">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-xs leading-5 text-slate-600">{card.summary}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={card.servicePath}
                className="mt-6 inline-flex justify-center rounded-full bg-[#1A56DB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Custom Drafting Support →
              </Link>
            </article>
          ))}
        </div>

        {/* Mandatory Boilerplate Clauses */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Mandatory Clauses for Enforceability in India</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">1. Governing Law &amp; Jurisdiction</h3>
              <p className="mt-1 text-xs text-slate-600">Must explicitly specify the laws of the Republic of India and exclusive jurisdiction of competent courts (e.g. courts of Mumbai/Delhi).</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">2. Dispute Resolution &amp; Arbitration</h3>
              <p className="mt-1 text-xs text-slate-600">Specifies seated arbitration under the Arbitration and Conciliation Act, 1996 for fast-track dispute resolution outside conventional litigation.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">3. IP Assignment &amp; Work-for-Hire</h3>
              <p className="mt-1 text-xs text-slate-600">Guarantees that all intellectual property, source code, designs, and inventions created by contractors/staff vest exclusively with the company.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">4. Confidentiality &amp; Trade Secrets</h3>
              <p className="mt-1 text-xs text-slate-600">Defines proprietary data boundaries and extends confidentiality obligations beyond agreement termination (typically 2 to 5 years).</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">5. Founder Equity Vesting</h3>
              <p className="mt-1 text-xs text-slate-600">Establishes 4-year reverse vesting with a 1-year cliff to protect early-stage startup cap tables if a co-founder departs prematurely.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">6. Stamp Duty &amp; Execution</h3>
              <p className="mt-1 text-xs text-slate-600">Requires physical execution on state-appropriate non-judicial stamp paper or verified digital e-stamping for court admissibility.</p>
            </div>
          </div>
        </article>

        {/* Worked Case Studies & Contract Blueprints */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Worked Case 1: Founders' Agreement with 4-Year Reverse Vesting</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Three startup co-founders incorporate with equal 33.3% equity allocations:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Vesting Schedule:</strong> 1-year cliff (0% vested if departure occurs in year 1) + monthly vesting over remaining 36 months (25% per annum).</p>
              <p><strong>IP Assignment:</strong> All algorithms, patent applications, domain assets, and customer databases vest irrevocably with the company entity.</p>
              <p><strong>Deadlock Resolution:</strong> Escalation to independent advisory mediator followed by expedited arbitration under the Arbitration &amp; Conciliation Act.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Worked Case 2: Mutual Commercial Non-Disclosure Agreement (NDA)</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Two fintech companies share proprietary API architectures and financial models during merger/integration talks:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Confidentiality Term:</strong> 3 years from date of disclosure; perpetual for source code and cryptographic trade secrets.</p>
              <p><strong>Exclusions:</strong> Information already in the public domain or independently proven to be known prior to disclosure.</p>
              <p className="text-blue-700 font-bold">Admissibility: Executed via digital e-stamping under the Information Technology Act, 2000.</p>
            </div>
          </article>
        </div>

        {/* Assumptions & Limitations */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Contract Enforceability Assumptions &amp; Limitations</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-sm text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-800">Assumptions:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Parties entering the agreement have the legal capacity and board authority to bind their respective legal entities.</li>
                <li>Agreements are executed with lawful consideration and lawful object under Section 10 of the Indian Contract Act, 1872.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Limitations &amp; Statutory Constraints:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Post-employment non-compete covenants are generally void and unenforceable under Section 27 of the Indian Contract Act, 1872.</li>
                <li>Inadequate stamp duty payment under state-specific stamp acts can result in agreements being impounded by courts until deficiency penalties (up to 10x) are settled.</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Official Sources & Verification */}
        <article className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Statutory References</p>
              <p className="mt-1 text-sm text-slate-700">
                Commercial agreements and statutory obligations in India are regulated under:
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="https://www.indiacode.nic.in/handle/123456789/2187"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  The Indian Contract Act, 1872 (India Code) ↗
                </a>
                <a
                  href="https://www.indiacode.nic.in/handle/123456789/1978"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  The Arbitration and Conciliation Act, 1996 (India Code) ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-blue-200 text-xs text-slate-600 shadow-sm shrink-0">
              <p><strong>Reviewed by:</strong> FilingBy Corporate Legal &amp; Drafting Desk</p>
              <p className="mt-1"><strong>Last Updated:</strong> August 2026 (Statutory Indian Law Compliant)</p>
            </div>
          </div>
        </article>

        {/* FAQs */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Legal Templates &amp; Contracts FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.legalTemplates.map((faq) => (
              <div key={faq.q} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
