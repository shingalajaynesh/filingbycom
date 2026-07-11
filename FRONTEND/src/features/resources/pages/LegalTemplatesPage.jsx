import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { legalTemplateCards } from "../data/resourcePages.js";

export default function LegalTemplatesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Legal Templates and Agreements for Businesses | FilingBy"
        description="Explore common legal templates and agreement categories for startups, founders, employers, and growing businesses."
        keywords="legal templates India, NDA draft, employment agreement, shareholders agreement, legal notice draft"
        canonical="/legal-templates"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Legal Templates", url: "/legal-templates" }
          ])
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Template hub</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Legal templates and drafting categories that attract practical search intent
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            These pages are useful both for SEO and for lead generation because users searching for a document often become drafting or review customers soon after.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {legalTemplateCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-2xl font-semibold text-slate-900">{card.title}</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
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
                View drafting service
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
