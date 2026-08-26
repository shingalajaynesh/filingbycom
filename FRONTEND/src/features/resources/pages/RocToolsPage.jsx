import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { rocToolCards, rocComplianceTimeline, resourceFaqs } from "../data/resourcePages.js";

export default function RocToolsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="ROC Compliance Tools & Annual MCA Return Filing Guide | FilingBy"
        description="Statutory MCA annual filing schedules, late penalty calculators, and compliance checklists for Private Limited Companies and LLPs. AOC-4, MGT-7, Form 11, and DIR-3 KYC guidelines."
        keywords="ROC tools, MCA annual filing, AOC-4 deadline, MGT-7 filing, LLP Form 11, LLP Form 8, DIR-3 KYC penalty, Section 403 Companies Act"
        canonical="/roc-tools"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "ROC Compliance Tools", url: "/roc-tools" }
          ]),
          buildFaqSchema(resourceFaqs.roc)
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md">
            <span>MCA Statutory Portal</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            ROC Compliance &amp; Annual MCA Filing Hub
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Track annual return deadlines, statutory fee schedules, director KYC mandates, and late filing penalties under the Companies Act, 2013 and Limited Liability Partnership Act, 2008.
          </p>
        </div>
      </section>

      {/* Annual Compliance Timeline & Penalties */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Mandatory MCA Annual Compliance Calendar</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Every registered company and LLP in India is legally required to submit statutory disclosures on the MCA V3 portal within strict statutory timeframes:
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3 px-4">Statutory Form</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Statutory Due Date</th>
                  <th className="py-3 px-4">Purpose &amp; Description</th>
                  <th className="py-3 px-4">Late Penalty Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {rocComplianceTimeline.map((item) => (
                  <tr key={item.form} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-blue-700">{item.form}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.entity}</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">{item.deadline}</td>
                    <td className="py-3 px-4 text-xs">{item.description}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-rose-600">{item.lateFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* 3 Main Compliance Tracks */}
        <div className="grid gap-6 lg:grid-cols-3">
          {rocToolCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-blue-200 transition">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
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
                className="mt-6 inline-flex justify-center rounded-full bg-[#1A56DB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Filing Assistance &amp; Details →
              </Link>
            </article>
          ))}
        </div>

        {/* Penalty Mechanics & Section 403 Breakdown */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">How MCA Late Penalties are Calculated (Section 403)</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-sm text-slate-600 leading-relaxed">
            <div className="rounded-2xl bg-rose-50/50 p-5 border border-rose-100">
              <h3 className="text-base font-bold text-rose-950">1. Private Limited Company Additional Fees</h3>
              <p className="mt-2 text-xs text-slate-700">
                Under Section 403 of the Companies Act, delayed submission of Form AOC-4 or MGT-7 attracts an additional fee of <strong>₹100 per day per form</strong> without an upper cap until the date of filing. Directors can also face disqualification under Section 164(2) for continuous 3-year defaults.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-100">
              <h3 className="text-base font-bold text-amber-950">2. LLP Form 8 &amp; Form 11 Late Fees</h3>
              <p className="mt-2 text-xs text-slate-700">
                Under Section 69 of the Limited Liability Partnership Act, delay in filing Form 11 (Annual Return) or Form 8 (Statement of Accounts) incurs a statutory late fee of <strong>₹100 per day</strong> per document with no maximum ceiling.
              </p>
            </div>
          </div>
        </article>

        {/* Official Sources & Editorial Verification */}
        <article className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Government References</p>
              <p className="mt-1 text-sm text-slate-700">
                All regulatory compliance requirements, statutory due dates, and digital filing systems are governed by the Ministry of Corporate Affairs:
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="https://www.mca.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Ministry of Corporate Affairs (MCA V3 Portal) ↗
                </a>
                <a
                  href="https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/companies-act-2013.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Companies Act 2013 Statutory Rules &amp; Master Circulars ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-blue-200 text-xs text-slate-600 shadow-sm shrink-0">
              <p><strong>Reviewed by:</strong> FilingBy Corporate Secretarial Desk (CS &amp; CA)</p>
              <p className="mt-1"><strong>Last Updated:</strong> August 2026 (MCA V3 Registry Compliant)</p>
            </div>
          </div>
        </article>

        {/* FAQs */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">ROC &amp; Annual Compliance FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.roc.map((faq) => (
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
