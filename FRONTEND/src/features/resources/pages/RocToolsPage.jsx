import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { rocToolCards, rocComplianceTimeline, resourceFaqs } from "../data/resourcePages.js";

const MCA_FORMS = [
  { id: "aoc4", name: "Form AOC-4 (Financial Statements)", entity: "Pvt Ltd / OPC", dailyFee: 100, normalFeeType: "capital", deadline: "30 days from AGM (Oct 29)" },
  { id: "mgt7", name: "Form MGT-7 / 7A (Annual Return)", entity: "Pvt Ltd / Small Co", dailyFee: 100, normalFeeType: "capital", deadline: "60 days from AGM (Nov 28)" },
  { id: "llp11", name: "LLP Form 11 (Annual Return)", entity: "LLP", dailyFee: 100, normalFeeType: "flat_llp", deadline: "May 30 (60 days from FY end)" },
  { id: "llp8", name: "LLP Form 8 (Statement of Accounts)", entity: "LLP", dailyFee: 100, normalFeeType: "flat_llp", deadline: "October 30 (7 months from FY end)" },
  { id: "dir3kyc", name: "DIR-3 KYC (Director e-KYC)", entity: "Directors / Partners", dailyFee: 0, fixedLateFee: 5000, normalFeeType: "zero", deadline: "September 30 every year" }
];

function getNormalFee(feeType, capital) {
  if (feeType === "zero") return 0;
  if (feeType === "flat_llp") return 50;
  const cap = Number(capital) || 0;
  if (cap < 100000) return 200;
  if (cap < 500000) return 300;
  if (cap < 2500000) return 400;
  if (cap < 10000000) return 500;
  return 600;
}

function formatCurrency(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number.isFinite(val) ? val : 0);
}

export default function RocToolsPage() {
  const [selectedForm, setSelectedForm] = useState("aoc4");
  const [capital, setCapital] = useState("1000000");
  const [delayDays, setDelayDays] = useState("30");

  const formMeta = useMemo(() => {
    return MCA_FORMS.find((f) => f.id === selectedForm) || MCA_FORMS[0];
  }, [selectedForm]);

  const feeCalculation = useMemo(() => {
    const days = Math.max(0, Number(delayDays) || 0);
    const normalFee = getNormalFee(formMeta.normalFeeType, capital);
    
    let additionalFee = 0;
    if (formMeta.id === "dir3kyc") {
      additionalFee = days > 0 ? formMeta.fixedLateFee : 0;
    } else {
      additionalFee = days * formMeta.dailyFee;
    }

    const totalPayable = normalFee + additionalFee;

    let riskLevel = "Normal";
    let riskMessage = "Filing within normal timeline with statutory fees only.";

    if (days > 0 && days <= 30) {
      riskLevel = "Moderate";
      riskMessage = "Additional daily late fee applies. Submit promptly to avoid compounding penalty.";
    } else if (days > 30 && days <= 180) {
      riskLevel = "High";
      riskMessage = "Significant accumulated additional fee. Potential notice from Registrar of Companies (ROC).";
    } else if (days > 180) {
      riskLevel = "Severe";
      riskMessage = "Severe risk of director disqualification (Section 164(2)), company strike-off, and ROC prosecution.";
    }

    return {
      days,
      normalFee,
      additionalFee,
      totalPayable,
      riskLevel,
      riskMessage
    };
  }, [capital, delayDays, formMeta]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="ROC Compliance Tools & MCA Late Fee Calculator | FilingBy"
        description="Calculate MCA late filing additional fees under Section 403 and track statutory deadlines for AOC-4, MGT-7, LLP Form 11/8, and DIR-3 KYC with our interactive ROC compliance tools."
        keywords="ROC tools, MCA late fee calculator, AOC-4 late fee, MGT-7 late fee, LLP Form 11 penalty, DIR-3 KYC penalty 5000, Section 403 Companies Act"
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
            <span>MCA V3 Statutory Hub</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            ROC Compliance &amp; MCA Late Fee Calculator
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Calculate Section 403 additional late fees, verify annual filing deadlines, prevent director disqualifications, and manage statutory filings for Private Limited Companies and LLPs.
          </p>
        </div>
      </section>

      {/* Interactive Tool Grid: MCA Late Fee Calculator */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">MCA V3 Additional Late Fee Calculator</h2>
            <p className="text-xs text-slate-500 mt-1">Calculates statutory government fees and daily additional penalty under Section 403 of Companies Act / Section 69 of LLP Act.</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Select Statutory MCA Form</span>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-sm font-semibold"
              >
                {MCA_FORMS.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name} — {form.entity}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">Statutory Due Date: {formMeta.deadline}</span>
            </label>

            {formMeta.normalFeeType === "capital" && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Nominal / Authorized Capital (₹)</span>
                <select
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-sm font-medium"
                >
                  <option value="100000">Up to ₹1,00,000 (Normal Fee: ₹200)</option>
                  <option value="499999">₹1,00,000 to ₹4,99,999 (Normal Fee: ₹300)</option>
                  <option value="1000000">₹5,00,000 to ₹24,99,999 (Normal Fee: ₹400)</option>
                  <option value="5000000">₹25,00,000 to ₹99,99,999 (Normal Fee: ₹500)</option>
                  <option value="10000000">₹1,00,00,000 and Above (Normal Fee: ₹600)</option>
                </select>
              </label>
            )}

            <label className={`block ${formMeta.normalFeeType !== "capital" ? "md:col-span-2" : ""}`}>
              <span className="text-sm font-semibold text-slate-700">Delay Past Statutory Due Date (in Days)</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={delayDays}
                onChange={(e) => setDelayDays(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-base font-semibold"
                placeholder="e.g. 30"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {formMeta.id === "dir3kyc" ? "If delay > 0 days, statutory revival fee of ₹5,000 applies." : "Statutory penalty accumulates at ₹100 per day without ceiling."}
              </span>
            </label>
          </div>

          {/* Fee Calculation Outputs */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">Normal Filing Fee</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(feeCalculation.normalFee)}</p>
            </div>
            <div className="rounded-3xl bg-rose-50 p-5 border border-rose-100">
              <p className="text-[10px] uppercase tracking-[0.25em] text-rose-700 font-bold">Additional Late Fee</p>
              <p className="mt-2 text-2xl font-black text-rose-600">{formatCurrency(feeCalculation.additionalFee)}</p>
              <p className="text-[10px] text-rose-500 mt-1">{feeCalculation.days} days delayed</p>
            </div>
            <div className="rounded-3xl bg-[#0F172A] p-5 text-white shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300 font-bold">Total MCA Portal Fee</p>
              <p className="mt-2 text-2xl font-black text-emerald-400">{formatCurrency(feeCalculation.totalPayable)}</p>
            </div>
          </div>

          {/* Compliance Status Notice */}
          <div className={`mt-6 rounded-2xl p-4 text-xs leading-5 border ${
            feeCalculation.riskLevel === "Severe"
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : feeCalculation.riskLevel === "High"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-blue-50/70 border-blue-100 text-blue-900"
          }`}>
            <strong>Compliance Status ({feeCalculation.riskLevel} Risk):</strong> {feeCalculation.riskMessage}
          </div>
        </article>

        {/* Sidebar Help Card */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-md">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300 font-bold">Avoid MCA Penalties</p>
            <h3 className="mt-3 text-xl font-bold">FilingBy Annual Secretarial Retainer</h3>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              Never miss an AGM, AOC-4, MGT-7, or DIR-3 KYC deadline. Our dedicated Company Secretaries ensure 100% on-time MCA V3 compliance.
            </p>
            <Link
              to="/services/roc-annual-filing-pvt"
              className="mt-5 block rounded-full bg-[#1A56DB] px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-blue-600 transition"
            >
              Book Annual Filing Assistance →
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Key Statutory Sections</h3>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <p><strong>Section 403 (Companies Act):</strong> Imposes ₹100/day penalty for late filing of financial statements and annual returns.</p>
              <p><strong>Section 164(2):</strong> Disqualifies directors for 5 years if a company fails to file returns for 3 consecutive financial years.</p>
              <p><strong>Section 69 (LLP Act):</strong> Mandates ₹100/day late filing fee for Form 8 and Form 11.</p>
            </div>
          </div>
        </aside>
      </section>

      {/* Annual Compliance Timeline & Penalties */}
      <section className="mx-auto max-w-6xl px-4 pt-6 space-y-8">
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

        {/* Worked Case Studies & Calculation Methodology */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Worked Case 1: Pvt Ltd AOC-4 &amp; MGT-7 Delayed by 45 Days</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Consider a Private Limited Company with ₹10,00,000 authorized capital that delays filing Form AOC-4 and Form MGT-7 by 45 days past their respective due dates:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Form AOC-4 Government Fee:</strong> Normal Fee: ₹400 + Late Fee (45 days × ₹100): ₹4,500 = <strong>₹4,900</strong>.</p>
              <p><strong>Form MGT-7 Government Fee:</strong> Normal Fee: ₹400 + Late Fee (45 days × ₹100): ₹4,500 = <strong>₹4,900</strong>.</p>
              <p className="text-rose-700 font-bold">Total Additional Statutory Penalty Incurred: ₹9,000</p>
              <p className="text-slate-500">Early filing saves ₹9,000 in unrecoverable government penalty charges.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Worked Case 2: LLP Form 11 Delayed by 90 Days</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              An active Limited Liability Partnership (LLP) fails to submit Form 11 (Annual Return) by May 30th and files on August 28th (90-day delay):
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Normal LLP Filing Fee:</strong> ₹50</p>
              <p><strong>Additional Late Fee (Section 69):</strong> 90 days × ₹100/day = ₹9,000</p>
              <p className="text-rose-700 font-bold">Total Payable on MCA V3 Portal: ₹9,050</p>
              <p className="text-slate-500">Note: LLP penalties have no statutory upper ceiling and continue compounding daily until filed.</p>
            </div>
          </article>
        </div>

        {/* Assumptions, Limitations & Exclusions */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Assumptions, Limitations &amp; Exclusions</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-sm text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-800">Assumptions:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Calculations are based on statutory fee rules prescribed under the Companies (Registration Offices and Fees) Rules, 2014 and LLP Rules, 2009.</li>
                <li>AGM for the financial year is assumed to have been held within the statutory period (on or before September 30th).</li>
                <li>Normal fees depend on the authorized capital category recorded in the MCA Master Data.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Exclusions &amp; Limitations:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Compounding fees and National Company Law Tribunal (NCLT) condonation charges under Section 460 are not included in the standard calculator.</li>
                <li>Adjudication penalties imposed by the Registrar under Section 454 for non-filing of notices are assessed on a case-by-case basis.</li>
              </ul>
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
              <p><strong>Reviewed by:</strong> FilingBy Corporate Secretarial Desk (CS &amp; Chartered Accountants)</p>
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
