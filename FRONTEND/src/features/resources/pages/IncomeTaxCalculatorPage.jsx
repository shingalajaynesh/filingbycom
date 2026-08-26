import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { resourceFaqs } from "../data/resourcePages.js";

const OLD_SLABS = {
  below60: [
    { upTo: 250000, rate: 0, label: "Up to ₹2,50,000" },
    { upTo: 500000, rate: 0.05, label: "₹2,50,001 - ₹5,00,000" },
    { upTo: 1000000, rate: 0.2, label: "₹5,00,001 - ₹10,00,000" },
    { upTo: Infinity, rate: 0.3, label: "Above ₹10,00,000" }
  ],
  senior: [
    { upTo: 300000, rate: 0, label: "Up to ₹3,00,000" },
    { upTo: 500000, rate: 0.05, label: "₹3,00,001 - ₹5,00,000" },
    { upTo: 1000000, rate: 0.2, label: "₹5,00,001 - ₹10,00,000" },
    { upTo: Infinity, rate: 0.3, label: "Above ₹10,00,000" }
  ],
  superSenior: [
    { upTo: 500000, rate: 0, label: "Up to ₹5,00,000" },
    { upTo: 1000000, rate: 0.2, label: "₹5,00,001 - ₹10,00,000" },
    { upTo: Infinity, rate: 0.3, label: "Above ₹10,00,000" }
  ]
};

const NEW_SLABS = [
  { upTo: 400000, rate: 0, label: "Up to ₹4,00,000" },
  { upTo: 800000, rate: 0.05, label: "₹4,00,001 - ₹8,00,000" },
  { upTo: 1200000, rate: 0.1, label: "₹8,00,001 - ₹12,00,000" },
  { upTo: 1600000, rate: 0.15, label: "₹12,00,001 - ₹16,00,000" },
  { upTo: 2000000, rate: 0.2, label: "₹16,00,001 - ₹20,00,000" },
  { upTo: 2400000, rate: 0.25, label: "₹20,00,001 - ₹24,00,000" },
  { upTo: Infinity, rate: 0.3, label: "Above ₹24,00,000" }
];

function calculateSlabTax(taxableIncome, slabs) {
  let previousLimit = 0;
  let tax = 0;

  for (const slab of slabs) {
    if (taxableIncome <= previousLimit) break;
    const slabUpper = slab.upTo;
    const taxableSlice = Math.min(taxableIncome, slabUpper) - previousLimit;
    if (taxableSlice > 0) {
      tax += taxableSlice * slab.rate;
    }
    previousLimit = slabUpper;
  }

  return tax;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Math.round(Number.isFinite(value) ? value : 0));
}

export default function IncomeTaxCalculatorPage() {
  const [grossIncome, setGrossIncome] = useState("1200000");
  const [salaryIncome, setSalaryIncome] = useState(true);
  const [ageGroup, setAgeGroup] = useState("below60");
  const [oldDeductions, setOldDeductions] = useState("150000");
  const [newDeductions, setNewDeductions] = useState("0");

  const summary = useMemo(() => {
    const income = Math.max(0, Number(grossIncome) || 0);
    const oldDeductionAmount = Math.max(0, Number(oldDeductions) || 0);
    const newDeductionAmount = Math.max(0, Number(newDeductions) || 0);
    
    // Standard deduction: ₹75,000 for salaried in New Regime; ₹50,000 in Old Regime
    const oldStandardDeduction = salaryIncome ? 50000 : 0;
    const newStandardDeduction = salaryIncome ? 75000 : 0;

    const oldTaxableIncome = Math.max(0, income - oldStandardDeduction - oldDeductionAmount);
    const newTaxableIncome = Math.max(0, income - newStandardDeduction - newDeductionAmount);

    let oldBaseTax = calculateSlabTax(oldTaxableIncome, OLD_SLABS[ageGroup]);
    let newBaseTax = calculateSlabTax(newTaxableIncome, NEW_SLABS);

    // Old Regime 87A rebate: taxable income <= 5L gets rebate up to ₹12,500
    let oldRebate = 0;
    if (oldTaxableIncome <= 500000) {
      oldRebate = Math.min(oldBaseTax, 12500);
    }
    let oldTaxAfterRebate = Math.max(0, oldBaseTax - oldRebate);

    // New Regime 87A rebate & marginal relief for FY 2025-26:
    // Taxable income <= ₹12,00,000 gets full rebate up to ₹60,000
    let newRebate = 0;
    let newTaxAfterRebate = newBaseTax;

    if (newTaxableIncome <= 1200000) {
      newRebate = Math.min(newBaseTax, 60000);
      newTaxAfterRebate = Math.max(0, newBaseTax - newRebate);
    } else {
      // Marginal relief under 87A: tax cannot exceed excess income over 12L
      const excessIncome = newTaxableIncome - 1200000;
      if (newBaseTax > excessIncome) {
        newTaxAfterRebate = excessIncome;
      }
    }

    const oldCess = oldTaxAfterRebate * 0.04;
    const newCess = newTaxAfterRebate * 0.04;

    const oldTotal = oldTaxAfterRebate + oldCess;
    const newTotal = newTaxAfterRebate + newCess;

    return {
      oldStandardDeduction,
      newStandardDeduction,
      oldTaxableIncome,
      newTaxableIncome,
      oldBaseTax,
      newBaseTax,
      oldRebate,
      newRebate,
      oldTaxAfterRebate,
      newTaxAfterRebate,
      oldCess,
      newCess,
      oldTotal,
      newTotal,
      betterRegime: oldTotal < newTotal ? "Old Regime" : newTotal < oldTotal ? "New Regime" : "Equal Tax",
      savings: Math.abs(oldTotal - newTotal)
    };
  }, [ageGroup, grossIncome, newDeductions, oldDeductions, salaryIncome]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Income Tax Calculator India FY 2025-26 (AY 2026-27) | Old vs New Regime"
        description="Calculate income tax for FY 2025-26 (AY 2026-27) under the revised 7-slab New Regime vs Old Regime. Accurate Section 87A rebate and ₹75,000 standard deduction calculator."
        keywords="income tax calculator FY 2025-26, new tax regime AY 2026-27, old vs new tax regime calculator India, Section 87A rebate, standard deduction 75000"
        canonical="/income-tax-calculator"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Income Tax Calculator", url: "/income-tax-calculator" }
          ]),
          buildFaqSchema(resourceFaqs.incomeTax)
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md">
            <span>Verified for AY 2026-27</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Income Tax Calculator (FY 2025-26 / AY 2026-27)
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Compare tax liability under the official 7-slab New Tax Regime (Section 115BAC) and the Old Tax Regime with standard deductions, Section 87A rebates, and 4% health & education cess.
          </p>
        </div>
      </section>

      {/* Interactive Tool Grid */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Enter Your Income &amp; Deductions</h2>
            <p className="text-xs text-slate-500 mt-1">Estimates apply to resident individuals under Indian Income Tax Act rules.</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Gross Annual Income (₹)</span>
              <input
                type="number"
                min="0"
                step="10000"
                value={grossIncome}
                onChange={(event) => setGrossIncome(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-base font-semibold"
                placeholder="e.g. 1200000"
              />
            </label>

            <div>
              <span className="text-sm font-semibold text-slate-700">Income Type</span>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSalaryIncome(true)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                    salaryIncome ? "bg-[#1A56DB] text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Salaried (₹75k / ₹50k Std Ded)
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryIncome(false)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                    !salaryIncome ? "bg-[#0F172A] text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Non-Salaried / Pro
                </button>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Age Category (Old Regime)</span>
              <select
                value={ageGroup}
                onChange={(event) => setAgeGroup(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-sm font-medium"
              >
                <option value="below60">Below 60 years (General)</option>
                <option value="senior">60 to 79 years (Senior Citizen)</option>
                <option value="superSenior">80+ years (Super Senior)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Old Regime Deductions (80C, 80D, HRA, etc.)</span>
              <input
                type="number"
                min="0"
                step="5000"
                value={oldDeductions}
                onChange={(event) => setOldDeductions(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-sm"
                placeholder="e.g. 150000"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Sec 80C (up to 1.5L), 80D, Sec 24b Home Loan</span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">New Regime Eligible Deductions (NPS 80CCD(2))</span>
              <input
                type="number"
                min="0"
                step="5000"
                value={newDeductions}
                onChange={(event) => setNewDeductions(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white text-sm"
                placeholder="e.g. 0"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Employer NPS contribution (up to 14% of salary)</span>
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-5 text-blue-900">
            <strong>Key Rule:</strong> Under the FY 2025-26 New Tax Regime, taxable income up to ₹12,00,000 gets a full Section 87A rebate (zero tax). With the ₹75,000 salaried standard deduction, gross salaries up to ₹12,75,000 pay ₹0 tax.
          </div>
        </article>

        {/* Summary Side Card */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-md">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300 font-bold">Optimal Recommendation</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-400">{summary.betterRegime}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {summary.savings > 0 ? (
                <>You save approx. <strong className="text-white font-bold">{formatCurrency(summary.savings)}</strong> by opting for {summary.betterRegime}.</>
              ) : (
                "Both regimes result in identical tax liability for this income level."
              )}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Taxable Income Breakdown</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                <span>Standard Deduction</span>
                <span className="font-semibold text-slate-900">New: {formatCurrency(summary.newStandardDeduction)} | Old: {formatCurrency(summary.oldStandardDeduction)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                <span>New Regime Taxable Income</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.newTaxableIncome)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                <span>Old Regime Taxable Income</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.oldTaxableIncome)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Comparison Cards */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Old Regime Card */}
          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Old Tax Regime</p>
              <span className="text-xs rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">Deductions Heavy</span>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900">{formatCurrency(summary.oldTotal)}</p>
            <p className="mt-1 text-xs text-slate-500">Total payable tax (including 4% cess)</p>
            
            <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Base Slab Tax:</span>
                <span className="font-semibold">{formatCurrency(summary.oldBaseTax)}</span>
              </div>
              {summary.oldRebate > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Sec 87A Rebate (up to ₹5L):</span>
                  <span className="font-semibold">-{formatCurrency(summary.oldRebate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>4% Health &amp; Education Cess:</span>
                <span className="font-semibold">{formatCurrency(summary.oldCess)}</span>
              </div>
            </div>
          </article>

          {/* New Regime Card */}
          <article className="rounded-3xl border-2 border-blue-500 bg-blue-50/30 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A56DB]">New Tax Regime (Default)</p>
              <span className="text-xs rounded-full bg-blue-600 px-3 py-1 font-bold text-white">FY 2025-26 Slabs</span>
            </div>
            <p className="mt-4 text-3xl font-black text-[#1A56DB]">{formatCurrency(summary.newTotal)}</p>
            <p className="mt-1 text-xs text-slate-500">Total payable tax (including 4% cess)</p>

            <div className="mt-5 space-y-2 rounded-2xl bg-white p-4 text-xs text-slate-700 border border-blue-100">
              <div className="flex justify-between">
                <span>Base Slab Tax:</span>
                <span className="font-semibold">{formatCurrency(summary.newBaseTax)}</span>
              </div>
              {summary.newRebate > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Sec 87A Rebate (up to ₹12L):</span>
                  <span className="font-semibold">-{formatCurrency(summary.newRebate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>4% Health &amp; Education Cess:</span>
                <span className="font-semibold">{formatCurrency(summary.newCess)}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Rich Educational, Methodological & Authority Content */}
      <section className="mx-auto max-w-6xl px-4 pt-12 space-y-8">
        {/* Official Slabs Table */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Official New Tax Regime Slabs for FY 2025-26 (AY 2026-27)</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            The Union Budget revised the tax slabs under Section 115BAC of the Income Tax Act. Below is the statutory 7-tier tax slab structure:
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3 px-4">Taxable Income Slab (New Regime)</th>
                  <th className="py-3 px-4">Applicable Tax Rate</th>
                  <th className="py-3 px-4">Cumulative Tax at Slab Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr><td className="py-3 px-4 font-medium text-slate-900">₹0 to ₹4,00,000</td><td className="py-3 px-4 font-bold text-emerald-600">Nil (0%)</td><td className="py-3 px-4">₹0</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">₹4,00,001 to ₹8,00,000</td><td className="py-3 px-4">5%</td><td className="py-3 px-4">₹20,000</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">₹8,00,001 to ₹12,00,000</td><td className="py-3 px-4">10%</td><td className="py-3 px-4">₹60,000 (100% rebated u/s 87A)</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">₹12,00,001 to ₹16,00,000</td><td className="py-3 px-4">15%</td><td className="py-3 px-4">₹1,20,000</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">₹16,00,001 to ₹20,00,000</td><td className="py-3 px-4">20%</td><td className="py-3 px-4">₹2,00,000</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">₹20,00,001 to ₹24,00,000</td><td className="py-3 px-4">25%</td><td className="py-3 px-4">₹3,00,000</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">Above ₹24,00,000</td><td className="py-3 px-4 font-bold text-blue-700">30%</td><td className="py-3 px-4">₹3,00,000 + 30% on excess</td></tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Who Should Use It & Worked Example */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Who Should Use This Calculator?</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Salaried Employees:</strong> Compare Form 16 withholding estimates, evaluate the ₹75,000 standard deduction, and select the optimal declaration for payroll TDS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Freelancers &amp; Professionals:</strong> Assess presumptive taxation net incomes under Section 44ADA vs regular accounting methods.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Business Owners &amp; Directors:</strong> Calculate tax impact before taking remuneration vs dividend distributions.</span>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Real-World Case Study: ₹14 Lakh Salary</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Consider a salaried taxpayer earning ₹14,00,000 gross salary with ₹1.5L in 80C deductions and ₹25k in 80D health insurance:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Under Old Regime:</strong> Taxable Income = ₹14L - ₹50k (Std Ded) - ₹1.75L (80C+80D) = ₹11,75,000. Base Tax = ₹1,65,000 + 4% Cess = <strong>₹1,71,600</strong>.</p>
              <p><strong>Under New Regime:</strong> Taxable Income = ₹14L - ₹75k (Std Ded) = ₹13,25,000. Base Tax = ₹20k (4-8L) + ₹40k (8-12L) + ₹18,750 (12-13.25L @15%) = ₹78,750 + 4% Cess = <strong>₹81,900</strong>.</p>
              <p className="text-emerald-700 font-bold">Result: New Regime saves ₹89,700 in tax!</p>
            </div>
          </article>
        </div>

        {/* Assumptions, Exclusions & Limitations */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Assumptions, Limitations &amp; Exclusions</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-sm text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-800">Assumptions:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Taxpayer is an individual tax resident of India for FY 2025-26.</li>
                <li>Standard deduction of ₹75,000 (New) or ₹50,000 (Old) applies to salaried/pensioner filers.</li>
                <li>Section 87A rebate applies to resident individuals with net taxable income up to ₹12,00,000 (New) or ₹5,00,000 (Old).</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Exclusions &amp; Limitations:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Special rate incomes (e.g. Short Term Capital Gains u/s 111A @20%, Long Term Capital Gains u/s 112A @12.5%, Virtual Digital Assets @30%) are not calculated here.</li>
                <li>High-net-worth surcharge slabs (10% above ₹50L, 15% above ₹1Cr, 25% above ₹2Cr under New Regime) are computed separately.</li>
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
                Verified against statutory provisions published by the Income Tax Department, Government of India:
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Income Tax Department e-Filing Portal (ITR-1 / ITR-2 Guidelines) ↗
                </a>
                <a
                  href="https://incometaxindia.gov.in/pages/charts-and-tables.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  CBDT Official Tax Rate &amp; Exemption Charts ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-blue-200 text-xs text-slate-600 shadow-sm shrink-0">
              <p><strong>Reviewed by:</strong> FilingBy Tax &amp; Legal Desk (Chartered Accountants)</p>
              <p className="mt-1"><strong>Last Updated:</strong> August 2026 (AY 2026-27 Compliant)</p>
            </div>
          </div>
        </article>

        {/* FAQs */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Income Tax Calculator FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.incomeTax.map((faq) => (
              <div key={faq.q} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#0F172A] p-6 text-white">
            <div>
              <h3 className="text-lg font-bold">Need Assisted ITR Filing by a Chartered Accountant?</h3>
              <p className="text-xs text-slate-300 mt-1">Get your ITR prepared, verified, and filed online with zero hassle.</p>
            </div>
            <Link
              to="/services/itr-1-filing"
              className="rounded-full bg-[#1A56DB] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition shrink-0"
            >
              Start ITR Filing
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
