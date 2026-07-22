import { useMemo, useState } from "react";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { resourceFaqs } from "../data/resourcePages.js";

const OLD_SLABS = {
  below60: [
    { upTo: 250000, rate: 0 },
    { upTo: 500000, rate: 0.05 },
    { upTo: 1000000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 }
  ],
  senior: [
    { upTo: 300000, rate: 0 },
    { upTo: 500000, rate: 0.05 },
    { upTo: 1000000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 }
  ],
  superSenior: [
    { upTo: 500000, rate: 0 },
    { upTo: 1000000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 }
  ]
};

const NEW_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 }
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
    const income = Number(grossIncome) || 0;
    const oldDeductionAmount = Number(oldDeductions) || 0;
    const newDeductionAmount = Number(newDeductions) || 0;
    const standardDeduction = salaryIncome ? 75000 : 0;

    const oldTaxableIncome = Math.max(0, income - standardDeduction - oldDeductionAmount);
    const newTaxableIncome = Math.max(0, income - standardDeduction - newDeductionAmount);

    let oldTax = calculateSlabTax(oldTaxableIncome, OLD_SLABS[ageGroup]);
    let newTax = calculateSlabTax(newTaxableIncome, NEW_SLABS);

    if (oldTaxableIncome <= 500000) {
      oldTax = Math.max(0, oldTax - Math.min(oldTax, 12500));
    }

    if (newTaxableIncome <= 1200000) {
      newTax = Math.max(0, newTax - Math.min(newTax, 60000));
    }

    const oldTotal = oldTax * 1.04;
    const newTotal = newTax * 1.04;

    return {
      standardDeduction,
      oldTaxableIncome,
      newTaxableIncome,
      oldTax,
      newTax,
      oldTotal,
      newTotal,
      betterRegime: oldTotal <= newTotal ? "Old Regime" : "New Regime",
      savings: Math.abs(oldTotal - newTotal)
    };
  }, [ageGroup, grossIncome, newDeductions, oldDeductions, salaryIncome]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Income Tax Calculator India FY 2025-26 | Old vs New Regime"
        description="Calculate your income tax for FY 2025-26 (AY 2026-27) under Old vs New tax regimes with FilingBy's free online Indian tax estimator for salaried and pros."
        keywords="income tax calculator India, old vs new regime calculator, FY 2025-26 tax calculator, ITR calculator"
        canonical="/income-tax-calculator"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Income Tax Calculator", url: "/income-tax-calculator" }
          ]),
          buildFaqSchema(resourceFaqs.incomeTax)
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Free tax tool</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Income tax calculator with old vs new regime comparison
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Estimate tax for resident individuals for FY 2025-26 and AY 2026-27. This tool is designed for quick planning and compares the two regimes side by side.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Gross annual income</span>
              <input
                type="number"
                min="0"
                value={grossIncome}
                onChange={(event) => setGrossIncome(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white"
                placeholder="Enter annual income"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Age category</span>
              <select
                value={ageGroup}
                onChange={(event) => setAgeGroup(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white"
              >
                <option value="below60">Below 60 years</option>
                <option value="senior">60 to 79 years</option>
                <option value="superSenior">80 years or above</option>
              </select>
            </label>

            <div>
              <span className="text-sm font-semibold text-slate-700">Income type</span>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSalaryIncome(true)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    salaryIncome ? "bg-[#1A56DB] text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Salaried
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryIncome(false)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    !salaryIncome ? "bg-[#0F172A] text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Non-salaried
                </button>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Old regime deductions</span>
              <input
                type="number"
                min="0"
                value={oldDeductions}
                onChange={(event) => setOldDeductions(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white"
                placeholder="80C, 80D, home loan, etc."
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">New regime eligible deductions</span>
              <input
                type="number"
                min="0"
                value={newDeductions}
                onChange={(event) => setNewDeductions(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#1A56DB] focus:bg-white"
                placeholder="Employer NPS or other eligible items"
              />
            </label>
          </div>

          <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            This is an estimate for resident individuals and includes 4% cess. It does not include surcharge, capital gains special rates, or detailed marginal relief just above the new regime rebate threshold.
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Quick comparison</p>
            <h2 className="mt-3 text-2xl font-semibold">Best estimate right now</h2>
            <p className="mt-2 text-3xl font-bold text-blue-300">{summary.betterRegime}</p>
            <p className="mt-3 text-sm text-slate-300">
              Estimated difference: {formatCurrency(summary.savings)}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Deduction summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Standard deduction</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.standardDeduction)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Old regime taxable income</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.oldTaxableIncome)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>New regime taxable income</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.newTaxableIncome)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Old regime</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(summary.oldTotal)}</p>
            <p className="mt-2 text-sm text-slate-500">Estimated tax including 4% cess</p>
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Base tax before cess: <span className="font-semibold text-slate-900">{formatCurrency(summary.oldTax)}</span>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">New regime</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(summary.newTotal)}</p>
            <p className="mt-2 text-sm text-slate-500">Estimated tax including 4% cess</p>
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Base tax before cess: <span className="font-semibold text-slate-900">{formatCurrency(summary.newTax)}</span>
            </div>
          </article>
        </div>

        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Income tax calculator FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.incomeTax.map((faq) => (
              <article key={faq.q} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Official slab references:
            {" "}
            <a
              href="https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700"
            >
              Income Tax Department help page for AY 2026-27
            </a>
            {" "}
            and
            {" "}
            <a
              href="https://www.incometaxindia.gov.in/w/threshold-limits-under-income-tax-act"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700"
            >
              threshold and rebate reference
            </a>
            .
          </div>
        </div>
      </section>
    </main>
  );
}
