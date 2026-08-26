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
    const numericAmount = Math.max(0, Number(amount) || 0);
    const numericRate = Math.max(0, Number(rate) || 0);

    if (numericAmount <= 0 || numericRate <= 0) {
      return {
        baseAmount: numericAmount,
        taxAmount: 0,
        totalAmount: numericAmount,
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
        title="GST Calculator Online India | Inclusive & Exclusive Tax Breakup"
        description="Calculate GST inclusive and exclusive pricing online for goods and services in India. Instant CGST, SGST, and IGST breakdowns for 5%, 12%, 18%, and 28% slabs with CBIC compliance."
        keywords="GST calculator India, GST inclusive calculator, GST exclusive calculator, CGST SGST IGST calculator, GST rate finder"
        canonical="/gst-calculator"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "GST Calculator", url: "/gst-calculator" }
          ]),
          buildFaqSchema(resourceFaqs.gst)
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md">
            <span>Free Tax Tool</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Online GST Calculator (Inclusive &amp; Exclusive)
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Compute accurate Goods and Services Tax (GST) calculations for business invoicing, purchase reconciliations, and tax return preparation with automatic CGST, SGST, and IGST splits.
          </p>
        </div>
      </section>

      {/* Calculator Main Grid */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Calculate Invoice &amp; Tax Amounts</h2>
            <p className="text-xs text-slate-500 mt-1">Select tax rate slab, calculation mode, and transaction supply type.</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Amount (₹)</span>
              <input
                type="number"
                min="0"
                step="100"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-base font-semibold"
                placeholder="Enter amount"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">GST Slab Rate</span>
              <select
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-sm font-medium"
              >
                {GST_RATES.map((gstRate) => (
                  <option key={gstRate} value={gstRate}>
                    {gstRate}% {gstRate === 18 ? "(Standard Services & IT)" : gstRate === 5 ? "(Basic Commodities)" : gstRate === 12 ? "(Processed Goods)" : "(Luxury & Demerit)"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Calculation Mode</p>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "exclusive", label: "Exclusive (+ GST)" },
                  { value: "inclusive", label: "Inclusive (Total contains GST)" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                      mode === option.value
                        ? "bg-[#1A56DB] text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Supply Type (Place of Supply)</p>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "intra", label: "Intra-State (CGST + SGST)" },
                  { value: "inter", label: "Inter-State (IGST)" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTaxType(option.value)}
                    className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                      taxType === option.value
                        ? "bg-[#0F172A] text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#0F172A] p-5 text-white shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-blue-200 font-bold">Net Base Amount</p>
              <p className="mt-2 text-2xl font-black">{formatCurrency(result.baseAmount)}</p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-5 border border-blue-100">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#1A56DB] font-bold">Total GST ({rate}%)</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(result.taxAmount)}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-5 border border-emerald-100">
              <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Gross Invoice Total</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(result.totalAmount)}</p>
            </div>
          </div>

          {/* Detailed Tax Split */}
          <div className="mt-6 rounded-3xl border border-gray-100 bg-gray-50/70 p-5">
            <h3 className="text-sm font-bold text-slate-900">Tax Component Breakdown</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">CGST ({taxType === "intra" ? rate / 2 : 0}%)</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(result.cgst)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Central Government Share</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">SGST / UTGST ({taxType === "intra" ? rate / 2 : 0}%)</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(result.sgst)}</p>
                <p className="text-[10px] text-slate-400 mt-1">State Government Share</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">IGST ({taxType === "inter" ? rate : 0}%)</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(result.igst)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Integrated Interstate Tax</p>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar Help Card */}
        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">How to Use This Tool</h3>
            <ol className="mt-4 space-y-3 text-xs leading-5 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1A56DB]">1.</span>
                <span><strong>Enter Amount:</strong> Input your quotation or billed amount.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1A56DB]">2.</span>
                <span><strong>Select Rate:</strong> Choose the applicable GST slab rate (5%, 12%, 18%, or 28%).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1A56DB]">3.</span>
                <span><strong>Pick Mode:</strong> Choose 'Exclusive' if adding tax, or 'Inclusive' to back out the base price.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1A56DB]">4.</span>
                <span><strong>Select Supply:</strong> Intra-state generates CGST+SGST; inter-state generates IGST.</span>
              </li>
            </ol>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] p-6 text-white shadow-sm">
            <h3 className="text-lg font-bold text-white">Need CA Assisted GST Services?</h3>
            <p className="mt-2 text-xs leading-5 text-slate-200">
              FilingBy manages new GST registrations, monthly GSTR-1 &amp; GSTR-3B filings, and annual reconciliations.
            </p>
            <div className="mt-5 space-y-2.5">
              <Link to="/services/gst-registration" className="block rounded-full bg-white px-4 py-2.5 text-center text-xs font-bold text-[#1A56DB] hover:bg-slate-100 transition">
                New GST Registration
              </Link>
              <Link to="/services/gst-return-filing" className="block rounded-full border border-white/30 px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-white/10 transition">
                Monthly GST Return Filing
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Rich Educational & Authority Sections */}
      <section className="mx-auto max-w-6xl px-4 space-y-8">
        {/* Formulas & Calculation Mechanics */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">GST Mathematical Formulas &amp; Calculation Mechanics</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            The mathematical formulas used under Indian Goods and Services Tax laws depend on whether prices are quoted pre-tax or inclusive of statutory tax:
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
              <h3 className="text-base font-bold text-slate-900">1. GST Exclusive Formula (Adding Tax)</h3>
              <p className="mt-2 text-xs text-slate-600">Used when creating sales quotations or adding GST to net wholesale prices:</p>
              <div className="mt-3 rounded-xl bg-white p-3 font-mono text-xs text-blue-900 border border-slate-200">
                GST Amount = (Base Amount × GST Rate %) / 100<br/>
                Invoice Total = Base Amount + GST Amount
              </div>
              <p className="mt-2 text-xs text-slate-500"><em>Example:</em> ₹10,000 base at 18% GST → Tax = ₹1,800 → Total = ₹11,800.</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
              <h3 className="text-base font-bold text-slate-900">2. GST Inclusive Formula (Extracting Tax)</h3>
              <p className="mt-2 text-xs text-slate-600">Used for MRP consumer goods or backward reconciliations:</p>
              <div className="mt-3 rounded-xl bg-white p-3 font-mono text-xs text-blue-900 border border-slate-200">
                Base Amount = Total Amount / (1 + (GST Rate % / 100))<br/>
                GST Amount = Total Amount - Base Amount
              </div>
              <p className="mt-2 text-xs text-slate-500"><em>Example:</em> ₹11,800 inclusive at 18% GST → Base = ₹10,000 → Tax = ₹1,800.</p>
            </div>
          </div>
        </article>

        {/* Worked Invoice Example & Slabs */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Real-World Case Study: IT Consulting Billing</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              A software consulting firm in Mumbai invoices a client in Bangalore for ₹50,000 for monthly retainer services:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Service Classification:</strong> SAC 9983 (Information Technology Support Services)</p>
              <p><strong>Applicable Rate:</strong> 18% Standard Services Slab</p>
              <p><strong>Supply Type:</strong> Inter-State (Maharashtra to Karnataka) → 18% IGST</p>
              <p><strong>Invoice Breakdown:</strong> Base Fee: ₹50,000 + IGST (18%): ₹9,000 = <strong>Total Billed: ₹59,000</strong></p>
              <p className="text-blue-700 font-semibold">The client can claim ₹9,000 Input Tax Credit (ITC) against their output GST liability.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Statutory GST Slabs in India</h3>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-900">0% (Nil / Exempt)</span>
                <span>Fresh food, milk, grains, unprocessed agricultural produce</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-900">5% (Basic Goods)</span>
                <span>Edible oils, sugar, tea, spices, life-saving medicines</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-900">12% (Standard Goods)</span>
                <span>Computers, processed food items, diagnostic kits</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-900">18% (Commercial)</span>
                <span>IT services, professional fees, telecom, industrial goods</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-900">28% (Luxury / Sin)</span>
                <span>Motor vehicles, aerated drinks, high-end consumer electronics</span>
              </div>
            </div>
          </article>
        </div>

        {/* Assumptions, Limitations & Official Sources */}
        <article className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Government References</p>
              <p className="mt-1 text-sm text-slate-700">
                GST rates and classification rules are governed by the GST Council and Central Board of Indirect Taxes and Customs (CBIC):
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="https://cbic-gst.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  CBIC GST Official Portal (HSN / SAC Code Rate Finder) ↗
                </a>
                <a
                  href="https://www.gst.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  GST Common Portal (GSTN Filing &amp; Verification) ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-blue-200 text-xs text-slate-600 shadow-sm shrink-0">
              <p><strong>Reviewed by:</strong> FilingBy Indirect Tax Desk (Chartered Accountants)</p>
              <p className="mt-1"><strong>Last Updated:</strong> August 2026 (CBIC Harmonized Tariff Compliant)</p>
            </div>
          </div>
        </article>

        {/* FAQs */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">GST Calculator FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.gst.map((faq) => (
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
