import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { companyGuideCards, companyComparisonMatrix, resourceFaqs } from "../data/resourcePages.js";

export default function CompanyRegistrationGuidesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Company Registration Guide India | Pvt Ltd vs LLP vs OPC vs Proprietorship"
        description="Comprehensive business entity comparison framework in India. Compare Private Limited Company, Limited Liability Partnership (LLP), One Person Company (OPC), and Sole Proprietorship."
        keywords="company registration guide India, private limited vs LLP, OPC registration, proprietorship vs pvt ltd, SPICe+ INC-32 registration"
        canonical="/company-registration-guides"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Company Registration Guides", url: "/company-registration-guides" }
          ]),
          buildFaqSchema(resourceFaqs.companyRegistration)
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md">
            <span>Entity Selection Framework</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Company Registration &amp; Structure Decision Guide
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Compare legal structures, statutory liabilities, tax rates, fundraising capabilities, and annual compliance requirements before incorporating on the MCA V3 portal.
          </p>
        </div>
      </section>

      {/* Entity Overview Cards */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {companyGuideCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-blue-200 transition">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-xs leading-5 text-slate-600">{card.summary}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {card.highlights.map((item) => (
                    <li key={item} className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 font-medium">
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={card.servicePath}
                className="mt-6 inline-flex justify-center rounded-full bg-[#1A56DB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Incorporate {card.title} →
              </Link>
            </article>
          ))}
        </div>

        {/* 8-Point Comprehensive Comparison Matrix */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">8-Dimension Statutory Comparison Matrix</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Detailed evaluation of the 4 primary business entity formats in India across governance, liability, taxation, and fundraising dimensions:
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-3">Evaluation Feature</th>
                  <th className="py-3 px-3 text-blue-700">Private Limited</th>
                  <th className="py-3 px-3">LLP</th>
                  <th className="py-3 px-3">One Person Company</th>
                  <th className="py-3 px-3">Sole Proprietorship</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {companyComparisonMatrix.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.feature}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium bg-blue-50/20">{row.pvtLtd}</td>
                    <td className="py-3 px-3">{row.llp}</td>
                    <td className="py-3 px-3">{row.opc}</td>
                    <td className="py-3 px-3">{row.prop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* SPICe+ INC-32 Filing Process */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Step-by-Step MCA SPICe+ (INC-32) Incorporation Roadmap</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-bold text-white">1</span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Part A: Name Approval</h3>
              <p className="mt-1 text-xs text-slate-600">File RUN (Reserve Unique Name) with up to 2 distinct brand name options under relevant MCA object codes.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-bold text-white">2</span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Digital Signatures &amp; DIN</h3>
              <p className="mt-1 text-xs text-slate-600">Procure Class-3 DSCs for all proposed directors and generate DINs directly through the SPICe+ application.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-bold text-white">3</span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Part B: MOA &amp; AOA</h3>
              <p className="mt-1 text-xs text-slate-600">Draft electronic Memorandum (e-MOA INC-33) and Articles of Association (e-AOA INC-34) defining company objectives.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-bold text-white">4</span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">AGILE-PRO-S &amp; COI</h3>
              <p className="mt-1 text-xs text-slate-600">Integrated filing for PAN, TAN, EPFO, ESIC, Professional Tax, GST, and corporate bank account with Certificate of Incorporation.</p>
            </div>
          </div>
        </article>

        {/* Official Sources & Verification */}
        <article className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Government References</p>
              <p className="mt-1 text-sm text-slate-700">
                Company and LLP incorporation guidelines are governed by the Ministry of Corporate Affairs (MCA):
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="https://www.mca.gov.in/content/mca/global/en/home.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  MCA V3 Company Incorporation Portal ↗
                </a>
                <a
                  href="https://www.startupindia.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Startup India DPIIT Recognition Guidelines ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-blue-200 text-xs text-slate-600 shadow-sm shrink-0">
              <p><strong>Reviewed by:</strong> FilingBy Corporate Secretarial Desk (CS &amp; Corporate Attorneys)</p>
              <p className="mt-1"><strong>Last Updated:</strong> August 2026 (SPICe+ V3 Process Compliant)</p>
            </div>
          </div>
        </article>

        {/* FAQs */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Company Registration FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.companyRegistration.map((faq) => (
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
