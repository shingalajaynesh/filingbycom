import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { companyGuideCards } from "../data/resourcePages.js";

export default function CompanyRegistrationGuidesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Company Registration Guides India | Pvt Ltd, LLP, OPC and More"
        description="Compare business entity types in India with FilingBy's incorporation guides. Make informed decisions between Private Limited, LLP, OPC, and Proprietorship."
        keywords="company registration guide India, private limited vs LLP, OPC registration, proprietorship guide"
        canonical="/company-registration-guides"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Company Registration Guides", url: "/company-registration-guides" }
          ])
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Decision guide</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Company registration guides that help founders choose the right structure
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Search traffic in this category comes from comparison and intent-led queries. This page gives users a strong entry point before they move into conversion pages.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {companyGuideCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-2xl font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {card.highlights.map((item) => (
                  <li key={item} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={card.servicePath}
                className="mt-5 inline-flex rounded-full bg-[#1A56DB] px-5 py-3 text-sm font-semibold text-white"
              >
                Learn more
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">What high-intent users usually compare</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Private Limited vs LLP",
              "OPC vs Proprietorship",
              "Registration cost and timeline",
              "Documents required before filing"
            ].map((topic) => (
              <div key={topic} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
