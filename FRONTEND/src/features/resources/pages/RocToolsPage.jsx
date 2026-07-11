import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { rocToolCards } from "../data/resourcePages.js";

export default function RocToolsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="ROC Tools and Annual Compliance Resources | FilingBy"
        description="Explore ROC tools, annual filing checklists, and compliance shortcuts for private limited companies, LLPs, and directors."
        keywords="ROC tools, ROC annual filing, LLP annual filing, AOC-4, MGT-7, DIN eKYC"
        canonical="/roc-tools"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "ROC Tools", url: "/roc-tools" }
          ])
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Compliance hub</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            ROC tools for founders who want fewer deadline surprises
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Use this page as a practical starting point for annual ROC work. It is designed to help users discover the right filing path and connect with your service pages faster.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {rocToolCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-2xl font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {card.items.map((item) => (
                  <li key={item} className="rounded-2xl bg-gray-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={card.servicePath}
                className="mt-5 inline-flex rounded-full bg-[#1A56DB] px-5 py-3 text-sm font-semibold text-white"
              >
                Open service page
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 text-sm leading-6 text-blue-950">
          This page is an SEO and discovery hub, not a substitute for professional advice. Exact ROC timelines, form applicability, and additional compliance duties can vary by entity type, incorporation date, turnover, and event history.
        </div>
      </section>
    </main>
  );
}
