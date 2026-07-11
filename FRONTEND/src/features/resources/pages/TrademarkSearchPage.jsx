import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { trademarkChecklist } from "../data/resourcePages.js";

export default function TrademarkSearchPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Trademark Search Guide India | Check Brand Availability"
        description="Use FilingBy's trademark search guide to review brand name availability, classes, and next steps before filing in India."
        keywords="trademark search India, brand name check, IP India public search, trademark class search"
        canonical="/trademark-search"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Trademark Search", url: "/trademark-search" }
          ])
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl relative z-10 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Brand protection</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Trademark search guide for founders before they file
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-blue-100 sm:text-base">
              A good search reduces avoidable objections and rework. Use this page to understand the process, then move into the official registry search or a filing service.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Trademark search checklist</h2>
          <div className="mt-5 space-y-3">
            {trademarkChecklist.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl bg-gray-50 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A56DB] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Official search portal</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The Government of India's official public trademark search portal is the most important place to verify exact and similar marks.
            </p>
            <a
              href="https://tmrsearch.ipindia.gov.in/tmrpublicsearch/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-full bg-[#1A56DB] px-5 py-3 text-sm font-semibold text-white"
            >
              Open IP India Public Search
            </a>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">When to get expert help</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>If similar marks show up in the same class.</li>
              <li>If you need advice on class selection.</li>
              <li>If your brand includes a logo plus a wordmark.</li>
              <li>If you want a filing strategy after the search.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
