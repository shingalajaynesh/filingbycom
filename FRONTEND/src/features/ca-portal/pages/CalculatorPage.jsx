import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import CalculatorLayout from "../components/CalculatorLayout.jsx";
import { PortalCTA, PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

const CALCULATOR_DATA = {
  hra: {
    title: "HRA Exemption Calculator (Section 10(13A))",
    desc: "Calculate your House Rent Allowance (HRA) tax exemption and taxable salary component under Rule 2A of Income Tax Rules.",
    source: "Income Tax Act, 1961 (Section 10(13A)) read with Rule 2A",
    sourceUrl: "https://incometaxindia.gov.in/rules/income-tax-rules-1962.aspx",
    formula:
      "Statutory HRA Exemption is the MINIMUM of the following three amounts:\n1. Actual HRA received from employer for the period.\n2. Actual rent paid minus 10% of (Basic Salary + Dearness Allowance).\n3. 50% of (Basic Salary + DA) for Metro cities (Mumbai, Delhi, Kolkata, Chennai) or 40% for Non-Metro locations.",
    workedExample: {
      title: "Worked Case: Salaried Professional in Delhi (Metro)",
      details: [
        "Basic Salary: ₹50,000/month (₹6,00,000/year)",
        "HRA Received: ₹20,000/month (₹2,40,000/year)",
        "Rent Paid: ₹18,000/month in Delhi (₹2,16,000/year)",
        "Condition 1 (Actual HRA): ₹2,40,000",
        "Condition 2 (Rent - 10% Basic): ₹2,16,000 - ₹60,000 = ₹1,56,000",
        "Condition 3 (50% Metro Basic): ₹3,00,000",
        "Exempt HRA (Minimum of 1, 2, 3): ₹1,56,000 (Tax-Free)",
        "Taxable HRA Component: ₹2,40,000 - ₹1,56,000 = ₹84,000"
      ]
    },
    assumptions: [
      "Taxpayer is an employee receiving HRA as part of regular salary structure.",
      "Rent is actually paid by the employee for residential accommodation occupied by them.",
      "Salary for HRA purposes consists of Basic Salary + Dearness Allowance (if forming part of retirement benefits) + Commission based on fixed percentage of turnover.",
      "Applicable only under the Old Tax Regime (HRA exemption is not available under the New Tax Regime Section 115BAC)."
    ],
    limitations: [
      "Cannot claim HRA exemption for rent paid to own self or if residing in own house.",
      "If annual rent paid exceeds ₹1,00,000, quoting the landlord's PAN is mandatory on Form 12BB."
    ],
    faqs: [
      {
        q: "Can I claim HRA exemption under the New Tax Regime?",
        a: "No. Under the Section 115BAC New Tax Regime, HRA exemption under Section 10(13A) is not permitted. It is only available if you file under the Old Tax Regime."
      },
      {
        q: "Can I pay rent to my parents and claim HRA?",
        a: "Yes, provided your parents own the property, you make actual bank transfers for rent, and your parents declare this rental income in their annual income tax returns."
      },
      {
        q: "Can I claim both HRA exemption and Home Loan tax deduction?",
        a: "Yes, if you own a home in a different city or location where you cannot reside due to employment, and you live in rented premises in the city of work."
      }
    ]
  },
  tds: {
    title: "TDS (Tax Deducted at Source) Calculator",
    desc: "Compute statutory TDS withholding rates and net payable amounts for contractors, professionals, and rent under Chapter XVII-B of the Income Tax Act.",
    source: "Income Tax Act, 1961 (Sections 194C, 194J, 194I) — CBDT Withholding Rates",
    sourceUrl: "https://incometaxindia.gov.in/pages/charts-and-tables.aspx",
    formula:
      "Statutory TDS Computation:\n1. TDS Amount = Gross Invoiced Amount × Applicable Statutory Section Rate (%)\n2. Net Disbursable Amount = Gross Invoiced Amount - Deducted TDS\n3. Remittance: Deductor must deposit TDS by 7th of the following month (30th April for March) and issue Form 16A quarterly.",
    workedExample: {
      title: "Worked Case: Professional Legal / Technical Retainer (Sec 194J)",
      details: [
        "Gross Professional Invoice: ₹1,00,000",
        "Statutory Section: 194J(1) (Professional & Technical Fees)",
        "Applicable TDS Rate: 10% (for professional services) / 2% (for technical services)",
        "TDS Deducted: ₹1,00,000 × 10% = ₹10,000",
        "Net Amount Disbursed to Consultant: ₹90,000",
        "TDS Deposited to Government under Challan ITNS 281: ₹10,000 (reflected in consultant's Form 26AS/AIS)"
      ]
    },
    assumptions: [
      "Payee has furnished a valid Permanent Account Number (PAN). If PAN is not provided, higher TDS of 20% applies under Section 206AA.",
      "Amounts exclude GST component from TDS withholding if GST is shown separately on invoice (as per CBDT Circular No. 23/2017).",
      "Threshold limits per section (e.g. ₹30,000 single / ₹1,00,000 aggregate for 194C; ₹30,000 for 194J; ₹2,40,000 for 194I) have been exceeded."
    ],
    limitations: [
      "Lower TDS certificates issued under Section 197 require manual override of standard statutory percentages.",
      "Special sections like Section 194Q (purchase of goods) or 194R (business perquisites) have distinct threshold limits."
    ],
    faqs: [
      {
        q: "What happens if a vendor does not provide a valid PAN?",
        a: "Under Section 206AA of the Income Tax Act, TDS must be deducted at the higher rate of 20% (or the applicable statutory rate, whichever is higher) if the deductee fails to furnish a valid PAN."
      },
      {
        q: "Is TDS calculated on the total invoice value including GST?",
        a: "No. As per CBDT Circular No. 23/2017, where the GST component indicated on the invoice is shown separately, TDS is deducted only on the base value without including the GST amount."
      },
      {
        q: "When must the deducted TDS be deposited with the government?",
        a: "TDS must be deposited with the Central Government by the 7th of the following calendar month (except for March deductions, which must be deposited by April 30th) via Challan ITNS 281."
      }
    ]
  },
  depreciation: {
    title: "Asset Depreciation Calculator (SLM & WDV)",
    desc: "Calculate commercial asset depreciation under Schedule II of Companies Act, 2013 and Section 32 of Income Tax Act using SLM and WDV methodologies.",
    source: "Companies Act, 2013 (Schedule II) & Income Tax Act, 1961 (Section 32)",
    sourceUrl: "https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/companies-act-2013.html",
    formula:
      "Depreciation Computation Methods:\n1. Straight-Line Method (SLM): Annual Depreciation = (Asset Cost - Residual Salvage Value) / Useful Economic Life (Years)\n2. Written Down Value (WDV): Annual Depreciation = Current Book Value × Applicable Depreciation Rate (%)\n3. Income Tax Rule (Sec 32): If asset is put to use for < 180 days in the financial year, 50% of standard depreciation rate applies.",
    workedExample: {
      title: "Worked Case: Computer Server Purchase (₹5,00,000 Cost)",
      details: [
        "Original Purchase Cost: ₹5,00,000",
        "Estimated Salvage Value (5%): ₹25,000",
        "Statutory Useful Life: 5 Years",
        "SLM Annual Depreciation: (₹5,00,000 - ₹25,00,0) / 5 = ₹95,000/year",
        "WDV Method (40% IT Rate): Year 1: ₹2,00,000 | Year 2 Book Value: ₹3,00,000 → Year 2 Dep: ₹1,20,000",
        "Tax Impact: Depreciation is deducted as a business expense, reducing corporate taxable profits."
      ]
    },
    assumptions: [
      "Asset is owned and put to commercial use in the business during the relevant financial year.",
      "Useful life benchmarks follow Schedule II of Companies Act, 2013 (e.g. 3 years for computers/servers, 10 years for plant & machinery, 5 years for office equipment).",
      "Residual salvage value is estimated at 5% of original acquisition cost as per MCA standard guidelines."
    ],
    limitations: [
      "Companies Act books use component-based useful life, whereas Income Tax assessments use Block of Assets concept under Section 32.",
      "Additional depreciation under Section 32(1)(iia) for manufacturing machinery (20%) is calculated separately."
    ],
    faqs: [
      {
        q: "What is the difference between SLM and WDV methods?",
        a: "Under Straight-Line Method (SLM), equal depreciation is charged every year over the asset's useful life. Under Written Down Value (WDV), depreciation is higher in initial years and decreases as the asset's net book value reduces."
      },
      {
        q: "What is the 180-day rule for depreciation under Indian Income Tax?",
        a: "If an asset is acquired and put to use for less than 180 days in a financial year (i.e. put to use on or after October 4th), only 50% of the normal depreciation rate is allowable for that financial year under Section 32."
      },
      {
        q: "Which method is mandatory for Income Tax filing in India?",
        a: "Under Section 32 of the Income Tax Act, the Written Down Value (WDV) method applied to 'Block of Assets' is mandatory for all businesses, except power generating units which have the option to adopt SLM."
      }
    ]
  }
};

export default function CalculatorPage() {
  const { calcSlug } = useParams();

  const data = CALCULATOR_DATA[calcSlug] || {
    title: `${calcSlug?.toUpperCase()} Calculator`,
    desc: "Compute an accurate estimate with FilingBy's statutory business compliance calculator.",
    source: "Statutory Regulations & Compliance Guidelines",
    sourceUrl: "https://www.incometax.gov.in/",
    formula: "Value computed using standard statutory logic.",
    workedExample: {
      title: "Standard Computation Example",
      details: ["Input parameters are processed using statutory rates and standard mathematical models."]
    },
    assumptions: ["Estimates apply to standard registered commercial and individual tax cases."],
    limitations: ["Special exemptions and lower tax certificates require manual review."],
    faqs: [
      {
        q: "Is this calculator suitable for filing tax returns?",
        a: "This calculator provides accurate mathematical estimates based on current statutory rules. Official returns should be verified against actual financial records."
      }
    ]
  };

  return (
    <>
      <SEO
        title={`${data.title} Online India — Fast & Accurate | FilingBy`}
        description={data.desc}
        canonical={`/calculators/${calcSlug}`}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Calculators Directory", url: "/gst-calculator" },
            { name: data.title, url: `/calculators/${calcSlug}` }
          ]),
          buildFaqSchema(data.faqs)
        ]}
      />

      <PortalPageShell
        badge="Statutory Tax Tool"
        title={data.title}
        description={data.desc}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Calculators", to: "/gst-calculator" },
          { label: data.title }
        ]}
        aside={
          <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#1A56DB]">Statutory Authority</p>
              <p className="mt-1 text-xs text-slate-700 font-semibold">{data.source}</p>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Review &amp; Verification</p>
              <p className="mt-1 text-xs text-slate-600">Reviewed by FilingBy CA Advisory Desk</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Updated: August 2026</p>
            </div>
          </div>
        }
      >
        <CalculatorLayout type={calcSlug} />

        {/* How It Is Calculated */}
        <PortalCard title="Calculation Methodology & Formulas" description="Statutory formulas and mathematical logic applied by this tool:">
          <pre className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
            {data.formula}
          </pre>
        </PortalCard>

        {/* Worked Example */}
        {data.workedExample && (
          <PortalCard title={data.workedExample.title} description="Step-by-step numerical breakdown with real-world parameters:">
            <div className="space-y-2 rounded-2xl bg-blue-50/40 p-4 border border-blue-100 text-xs text-slate-700">
              {data.workedExample.details.map((step, idx) => (
                <p key={idx} className={idx >= data.workedExample.details.length - 2 ? "font-bold text-blue-950" : ""}>
                  {step}
                </p>
              ))}
            </div>
          </PortalCard>
        )}

        {/* Assumptions & Limitations */}
        <div className="grid gap-6 md:grid-cols-2">
          <PortalCard title="Assumptions" description="Operating assumptions used in this calculation:">
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
              {data.assumptions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </PortalCard>

          <PortalCard title="Limitations & Exclusions" description="Factors that require special review:">
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
              {data.limitations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </PortalCard>
        </div>

        {/* Official Sources */}
        <PortalCard title="Official Government Reference" description="Statutory regulations published by governing ministries:">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
            <div>
              <p className="font-bold text-slate-900">{data.source}</p>
              <p className="text-slate-500 mt-0.5">Government of India Statutory Rules &amp; Master Circulars</p>
            </div>
            {data.sourceUrl && (
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 shrink-0"
              >
                Official Portal ↗
              </a>
            )}
          </div>
        </PortalCard>

        {/* FAQs */}
        <PortalCard title="Frequently Asked Questions" description="Expert answers from our Chartered Accountants:">
          <div className="space-y-3">
            {data.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="block text-xs font-bold text-slate-900">{faq.q}</span>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCTA
          title="Need CA Assisted Tax or Compliance Filing?"
          description="Use our calculator estimates, then let our experienced Chartered Accountants verify your declarations before submission."
          primary={<Link to="/get-live-quote" className="rounded-full bg-[#1A56DB] px-6 py-3 text-xs font-bold text-white transition hover:bg-blue-600">Consult Tax Expert</Link>}
          secondary={<a href="tel:+917567126945" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/15">Call +91 75671 26945</a>}
        />
      </PortalPageShell>
    </>
  );
}
