import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import CalculatorLayout from "../components/CalculatorLayout.jsx";
import { PortalCTA, PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

const CALCULATOR_DATA = {
  hra: {
    title: "HRA Exemption Calculator (Sec 10(13A))",
    desc: "Calculate your HRA tax exemption and taxable house rent allowance details under the applicable salary conditions.",
    formula:
      "HRA exemption is the lowest of these values:\n1. Actual HRA received.\n2. Actual rent paid minus 10% of salary.\n3. 50% of salary for metro cities or 40% for non-metro cities.",
  },
  tds: {
    title: "TDS (Tax Deducted at Source) Calculator",
    desc: "Compute section-wise TDS deductions for contractor payments, professional services, and rent under common income tax rules.",
    formula:
      "TDS amount = Total payment value x applicable section rate.\nNet payable = Total payment value - TDS deducted.",
  },
  depreciation: {
    title: "Asset Depreciation Calculator",
    desc: "Calculate company asset depreciation using both straight-line method (SLM) and written down value (WDV) logic.",
    formula:
      "SLM depreciation = (Asset cost - Salvage value) / Useful life.\nWDV depreciation = Remaining book value x applicable depreciation rate.",
  },
};

export default function CalculatorPage() {
  const { calcSlug } = useParams();

  const data = CALCULATOR_DATA[calcSlug] || {
    title: `${calcSlug?.toUpperCase()} Calculator`,
    desc: "Compute a quick estimate with FilingBy's practical business compliance calculator.",
    formula: "Value computed using the available statutory logic for this calculator.",
  };

  return (
    <>
      <SEO
        title={`${data.title} Online India - Fast & Accurate | FilingBy`}
        description={data.desc}
        canonical={`/calculators/${calcSlug}`}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Calculators Directory", url: "/gst-calculator" },
            { name: data.title, url: `/calculators/${calcSlug}` },
          ]),
        ]}
      />

      <PortalPageShell
        badge="Compliance Calculator"
        title={data.title}
        description={data.desc}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Calculators", to: "/gst-calculator" },
          { label: data.title },
        ]}
        aside={
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#1A56DB]">Quick note</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This tool is useful for estimates. Final tax or filing decisions should still be checked against your actual records.
            </p>
          </div>
        }
      >
        <CalculatorLayout type={calcSlug} />

        <PortalCard title="How It Is Calculated" description="The tool uses the following formula or rule logic.">
          <pre className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            {data.formula}
          </pre>
        </PortalCard>

        <PortalCard title="Frequently Asked Questions" description="A short practical answer before you move to filing or review.">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="block text-xs font-black text-slate-800">Is this calculator enough for actual filing?</span>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
              It is a useful first step, but actual filing should always consider real documents, category-specific rules, and updated government guidance.
            </p>
          </div>
        </PortalCard>

        <PortalCTA
          title="Need help with the final filing decision?"
          description="Use the calculator for direction, then let our team review the practical compliance position before you submit anything important."
          primary={<Link to="/get-live-quote" className="rounded-full bg-[#F97316] px-6 py-3 text-xs font-bold text-white transition hover:bg-orange-500">Book CA Review</Link>}
          secondary={<a href="tel:+917567126945" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/15">Call Tax Expert</a>}
        />
      </PortalPageShell>
    </>
  );
}
