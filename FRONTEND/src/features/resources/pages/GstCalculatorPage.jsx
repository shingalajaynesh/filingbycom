import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { resourceFaqs } from "../data/resourcePages.js";

const GST_RATES = [5, 12, 18, 28];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0);
}

export default function GstCalculatorPage() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("exclusive");
  const [taxType, setTaxType] = useState("intra");

  const result = useMemo(() => {
    const numericAmount = Number(amount) || 0;
    const numericRate = Number(rate) || 0;

    if (numericAmount <= 0 || numericRate <= 0) {
      return {
        baseAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      };
    }

    const baseAmount =
      mode === "inclusive"
        ? numericAmount / (1 + numericRate / 100)
        : numericAmount;
    const totalAmount =
      mode === "inclusive"
        ? numericAmount
        : numericAmount + (numericAmount * numericRate) / 100;
    const taxAmount = totalAmount - baseAmount;

    return {
      baseAmount,
      taxAmount,
      totalAmount,
      cgst: taxType === "intra" ? taxAmount / 2 : 0,
      sgst: taxType === "intra" ? taxAmount / 2 : 0,
      igst: taxType === "inter" ? taxAmount : 0
    };
  }, [amount, mode, rate, taxType]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="GST Calculator Online India | Inclusive and Exclusive GST Tool"
        description="Use FilingBy's GST calculator to compute inclusive and exclusive GST amounts with instant CGST, SGST, and IGST breakup."
        keywords="GST calculator, GST inclusive calculator, GST exclusive calculator, CGST SGST IGST calculator"
        canonical="/gst-calculator"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "GST Calculator", url: "/gst-calculator" }
          ]),
          buildFaqSchema(resourceFaqs.gst)
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Free tax tool</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            GST Calculator for quick invoice and pricing decisions
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Calculate GST on inclusive or exclusive amounts, view the tax split, and move directly into GST registration or filing support when you need expert help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Amount</span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white"
                placeholder="Enter amount"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">GST Rate</span>
              <select
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white"
              >
                {GST_RATES.map((gstRate) => (
                  <option key={gstRate} value={gstRate}>
                    {gstRate}%
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Amount type</p>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "exclusive", label: "Exclusive of GST" },
                  { value: "inclusive", label: "Inclusive of GST" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      mode === option.value
                        ? "bg-[#1A56DB] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Tax split</p>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "intra", label: "CGST + SGST" },
                  { value: "inter", label: "IGST" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTaxType(option.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      taxType === option.value
                        ? "bg-[#0F172A] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#0F172A] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Base amount</p>
              <p className="mt-3 text-2xl font-bold">{formatCurrency(result.baseAmount)}</p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-5 border border-blue-100">
              <p className="text-xs uppercase tracking-[0.3em] text-[#1A56DB]">GST amount</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(result.taxAmount)}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 border border-gray-200">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Invoice total</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(result.totalAmount)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Tax breakup</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-slate-500">CGST</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(result.cgst)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-slate-500">SGST</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(result.sgst)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-slate-500">IGST</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(result.igst)}</p>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">How to use it</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>1. Enter your base amount or invoice amount.</li>
              <li>2. Pick the GST rate that applies to the sale.</li>
              <li>3. Choose whether the entered amount is inclusive or exclusive of GST.</li>
              <li>4. Switch between intra-state and inter-state tax split as needed.</li>
            </ol>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] p-6 text-white shadow-sm">
            <h2 className="text-xl font-semibold text-white">Need filing support too?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Once your numbers are clear, move straight to registration, return filing, or GST compliance help.
            </p>
            <div className="mt-5 space-y-3">
              <Link to="/services/gst-registration" className="block rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-[#1A56DB]">
                GST Registration
              </Link>
              <Link to="/services/gst-return-filing" className="block rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white">
                GST Return Filing
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">GST calculator FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.gst.map((faq) => (
              <article key={faq.q} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
