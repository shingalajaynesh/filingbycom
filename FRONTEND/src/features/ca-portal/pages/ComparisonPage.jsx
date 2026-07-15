import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { PortalCTA, PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

const COMPARISON_DATA = {
  "private-limited-company-vs-llp": {
    title: "Private Limited Company vs LLP",
    desc: "Compare a private limited company and an LLP to choose the structure that best fits growth, control, and compliance expectations.",
    features: [
      { name: "Legal Entity Status", col1: "Separate legal entity", col2: "Separate legal entity" },
      { name: "Liability", col1: "Limited to share value", col2: "Limited to capital contribution" },
      { name: "Min / Max Members", col1: "Min 2, Max 200 shareholders", col2: "Min 2 partners, no upper limit" },
      { name: "VC / Angel Funding", col1: "Highly preferred", col2: "Less preferred" },
      { name: "Annual Compliance Cost", col1: "Higher", col2: "Moderate" },
    ],
    p1: { name: "Private Limited", base: 6000, govt: 2500, time: "10-15 Days", pros: ["Attracts investors", "Easy share transfer", "Strong brand value"], cons: ["Higher setup cost", "Stricter compliance"] },
    p2: { name: "LLP Registration", base: 4000, govt: 1500, time: "12-18 Days", pros: ["Lower compliance burden", "Flexible management", "Lean structure"], cons: ["Less funding-friendly", "Lower corporate perception in some cases"] },
    conclusion: "Choose a private limited company if you plan to raise equity capital or build a high-growth startup. Choose an LLP if you want flexibility and lower annual compliance for a service-led business.",
    faqs: [
      { q: "Can an LLP be converted later?", a: "Yes, restructuring is possible, but the process should be planned with compliance and tax implications in mind." },
      { q: "Which one usually costs less to maintain?", a: "An LLP usually has a lower ongoing compliance burden than a private limited company." },
    ],
  },
  "trademark-vs-patent": {
    title: "Trademark vs Patent Registration",
    desc: "Understand the difference between brand protection and invention protection so you choose the right intellectual property route.",
    features: [
      { name: "Protection Scope", col1: "Brand names, logos, slogans", col2: "Inventions, machines, processes" },
      { name: "Validity Period", col1: "10 years, renewable", col2: "20 years, non-renewable" },
      { name: "Filing Agency", col1: "Trade Marks Registry", col2: "Indian Patent Office" },
    ],
    p1: { name: "Trademark", base: 1999, govt: 4500, time: "6-12 Months", pros: ["Protects brand identity", "Renewable indefinitely", "Builds goodwill"], cons: ["Does not protect the invention itself"] },
    p2: { name: "Patent", base: 9999, govt: 8000, time: "2-4 Years", pros: ["Protects the invention", "Creates strong exclusivity", "High asset value"], cons: ["Complex process", "Longer timeline"] },
    conclusion: "Use a trademark when your main concern is brand identity. Use a patent when your value lies in a genuine invention or technical process.",
    faqs: [
      { q: "Can a product have both?", a: "Yes. A business can protect the brand through trademark and the invention through patent, depending on the facts." },
    ],
  },
};

export default function ComparisonPage() {
  const { slug1, slug2 } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const compKey = `${slug1}-vs-${slug2}`;

  useEffect(() => {
    if (COMPARISON_DATA[compKey]) {
      setData(COMPARISON_DATA[compKey]);
    } else {
      const formattedTitle1 = slug1?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const formattedTitle2 = slug2?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      setData({
        title: `${formattedTitle1} vs ${formattedTitle2}`,
        desc: `A practical comparison between ${formattedTitle1} and ${formattedTitle2} for Indian business and compliance decisions.`,
        features: [
          { name: "Primary Focus", col1: formattedTitle1, col2: formattedTitle2 },
          { name: "Compliance Lens", col1: "Setup, cost, usage", col2: "Setup, cost, usage" },
        ],
        p1: { name: formattedTitle1, base: 1999, govt: 1000, time: "7-10 Days", pros: ["Simplified path", "Quicker start"], cons: ["May have fit limitations"] },
        p2: { name: formattedTitle2, base: 2999, govt: 1500, time: "10-14 Days", pros: ["Higher formalisation", "Broader long-term use"], cons: ["May involve more compliance"] },
        conclusion: `Choose the option that better matches your funding plans, governance comfort, and long-term operating model.`,
        faqs: [
          { q: `What is the practical difference between ${formattedTitle1} and ${formattedTitle2}?`, a: "The main difference usually lies in legal structure, compliance burden, and business fit." },
        ],
      });
    }
    setLoading(false);
  }, [compKey, slug1, slug2]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-8 w-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" /></div>;
  }

  return (
    <>
      <SEO
        title={`${data.title} Comparison India - Which Is Better? | FilingBy`}
        description={data.desc}
        canonical={`/compare/${slug1}-vs-${slug2}`}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Comparisons", url: "/compare" },
            { name: data.title, url: `/compare/${slug1}-vs-${slug2}` },
          ]),
        ]}
      />

      <PortalPageShell
        badge="Comparison Guide"
        title={data.title}
        description={data.desc}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Comparisons" },
          { label: data.title },
        ]}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <PortalCard className="h-full">
            <h2 className="text-xl font-black text-slate-900">{data.p1.name}</h2>
            <p className="mt-1 text-xs text-slate-400">Timeline: {data.p1.time}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Registration Pricing</span>
              <span className="mt-1 block text-2xl font-black text-[#1A56DB]">Rs. {data.p1.base.toLocaleString("en-IN")}</span>
              <span className="mt-1 block text-[10px] text-slate-400">+ Govt. fees Rs. {data.p1.govt}</span>
            </div>
            <div className="mt-5 space-y-4 text-xs text-slate-600">
              <div>
                <span className="font-black uppercase tracking-wider text-emerald-700">Pros</span>
                <ul className="mt-2 space-y-1.5">
                  {data.p1.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-black uppercase tracking-wider text-red-700">Cons</span>
                <ul className="mt-2 space-y-1.5">
                  {data.p1.cons.map((con, i) => <li key={i}>• {con}</li>)}
                </ul>
              </div>
            </div>
          </PortalCard>

          <PortalCard className="h-full">
            <h2 className="text-xl font-black text-slate-900">{data.p2.name}</h2>
            <p className="mt-1 text-xs text-slate-400">Timeline: {data.p2.time}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Registration Pricing</span>
              <span className="mt-1 block text-2xl font-black text-[#1A56DB]">Rs. {data.p2.base.toLocaleString("en-IN")}</span>
              <span className="mt-1 block text-[10px] text-slate-400">+ Govt. fees Rs. {data.p2.govt}</span>
            </div>
            <div className="mt-5 space-y-4 text-xs text-slate-600">
              <div>
                <span className="font-black uppercase tracking-wider text-emerald-700">Pros</span>
                <ul className="mt-2 space-y-1.5">
                  {data.p2.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-black uppercase tracking-wider text-red-700">Cons</span>
                <ul className="mt-2 space-y-1.5">
                  {data.p2.cons.map((con, i) => <li key={i}>• {con}</li>)}
                </ul>
              </div>
            </div>
          </PortalCard>
        </div>

        <PortalCard title="Detailed Feature Matrix">
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="p-4 font-black text-slate-800">Feature</th>
                  <th className="p-4 font-black text-slate-800">{data.p1.name}</th>
                  <th className="p-4 font-black text-slate-800">{data.p2.name}</th>
                </tr>
              </thead>
              <tbody>
                {data.features.map((feature, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="p-4 font-bold text-slate-700">{feature.name}</td>
                    <td className="p-4 text-slate-600">{feature.col1}</td>
                    <td className="p-4 text-slate-600">{feature.col2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PortalCard>

        <section className="rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
          <h3 className="text-base font-black text-blue-900">Verdict</h3>
          <p className="mt-3 text-sm leading-7 text-blue-950/80">{data.conclusion}</p>
        </section>

        <PortalCard title="Frequently Asked Questions">
          <div className="space-y-4">
            {data.faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="block text-xs font-black text-slate-800">{faq.q}</span>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCTA
          title="Still deciding between these options?"
          description="A short expert call can help you map legal structure, tax impact, and practical growth fit before you commit."
          primary={<Link to="/get-live-quote" className="rounded-full bg-[#F97316] px-6 py-3 text-xs font-bold text-white transition hover:bg-orange-500">Get Free Consultation</Link>}
          secondary={<a href="tel:+917567126945" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/15">Call CA Panel</a>}
        />
      </PortalPageShell>
    </>
  );
}
