import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { trademarkChecklist, resourceFaqs } from "../data/resourcePages.js";

export default function TrademarkSearchPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <SEO
        title="Trademark Search Guide India | IP India Public Database & Class Finder"
        description="Comprehensive guide to conducting official trademark searches on the IP India registry. Learn Wordmark, Phonetic, and Vienna code searching across 45 Nice classes."
        keywords="trademark search India, IP India public search, trademark class finder, phonetic search trademark, Section 9 11 objections Trade Marks Act"
        canonical="/trademark-search"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Trademark Search Guide", url: "/trademark-search" }
          ]),
          buildFaqSchema(resourceFaqs.trademark)
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-16 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md">
            <span>Brand Protection Blueprint</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Trademark Search Guide &amp; IP India Registry Protocol
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Learn how to perform official brand availability searches, identify conflicting marks, classify goods and services across 45 Nice classes, and prevent statutory examination objections.
          </p>
        </div>
      </section>

      {/* Search Methodology & Checklist */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">7-Step IP India Search Methodology</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Before filing Form TM-A with the Trade Marks Registry, follow this systematic clearance protocol:
            </p>
            <div className="mt-5 space-y-3">
              {trademarkChecklist.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-xs leading-5 text-slate-700 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Official Government Portal</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                The Trade Marks Registry provides a free online database to search existing marks, applications, and registered trademarks:
              </p>
              <a
                href="https://tmrsearch.ipindia.gov.in/tmrpublicsearch/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full justify-center rounded-full bg-[#1A56DB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Open IP India Public Search Portal ↗
              </a>
            </div>

            <div className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-sm">
              <h3 className="text-lg font-bold">Need Trademark Filing Assistance?</h3>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                FilingBy handles complete trademark search clearance, class categorization, TM-A filing, and reply to examination reports.
              </p>
              <Link
                to="/services/trademark-registration"
                className="mt-4 block rounded-full bg-white px-4 py-2.5 text-center text-xs font-bold text-[#1A56DB] hover:bg-slate-100 transition"
              >
                Start Trademark Registration →
              </Link>
            </div>
          </aside>
        </div>

        {/* 3 Search Types & Objection Grounds */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Search Query Modes on IP India</h3>
            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <h4 className="font-bold text-slate-900">1. Wordmark Search ('Contains' &amp; 'Start With')</h4>
                <p className="mt-1">Searches character sequences. Always search using 'Contains' to find marks containing your brand name within larger words.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <h4 className="font-bold text-slate-900">2. Phonetic Search</h4>
                <p className="mt-1">Identifies marks that sound identical when spoken, even with altered spelling (e.g. 'Quick' vs 'Kwik').</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <h4 className="font-bold text-slate-900">3. Vienna Classification Search</h4>
                <p className="mt-1">International figurative classification system used to search visual logo shapes, animals, geometric patterns, and icons.</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Common Examination Objections</h3>
            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="rounded-2xl bg-rose-50/50 p-3.5 border border-rose-100">
                <h4 className="font-bold text-rose-950">Section 9: Absolute Grounds of Refusal</h4>
                <p className="mt-1 text-slate-700">Applies to marks devoid of distinctive character, laudatory terms (e.g. 'Best', 'Premium'), or generic names describing the product's function.</p>
              </div>
              <div className="rounded-2xl bg-amber-50/50 p-3.5 border border-amber-100">
                <h4 className="font-bold text-amber-950">Section 11: Relative Grounds of Refusal</h4>
                <p className="mt-1 text-slate-700">Applies when a mark is identical or deceptively similar to an earlier existing trademark for identical or similar goods/services.</p>
              </div>
            </div>
          </article>
        </div>

        {/* Worked Case Studies & Search Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Worked Case 1: Overcoming Section 11 Phonetic Conflict</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              An applicant wishes to register "NOVASTACK" for cloud infrastructure software in Class 42:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Search Protocol:</strong> Wordmark search finds no exact match. Phonetic search identifies "NOVO-STACK" registered in Class 42.</p>
              <p><strong>Risk Assessment:</strong> High probability of Section 11 objection due to identical phonetic sound and overlapping software services.</p>
              <p><strong>Remedy / Action:</strong> Applicant prefixes with distinct coined prefix "AERONOVA STACK" and files Form TM-A with device logo to ensure registry clearance.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Worked Case 2: Multi-Class Filing for D2C Beverage Brand</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              An organic energy tea startup plans retail distribution and an online subscription storefront:
            </p>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
              <p><strong>Class 30:</strong> Packaged herbal teas and natural beverage concoctions.</p>
              <p><strong>Class 35:</strong> Online retail store services and advertising for beverages.</p>
              <p><strong>Filing Strategy:</strong> Multi-class application protects both physical product formulation and digital brand storefront against copycats.</p>
            </div>
          </article>
        </div>

        {/* Assumptions & Limitations */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Search Protocol Assumptions &amp; Legal Limitations</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-sm text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-800">Assumptions:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Search covers registered trademarks, pending applications, and marks advertised in the official Trademark Journal.</li>
                <li>Classification is evaluated against the 12th Edition of Nice Classification published by WIPO.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Limitations &amp; Exclusions:</h4>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Common law unregistered marks with substantial market goodwill may still initiate passing-off actions.</li>
                <li>Domain names, state business registries, and international Madrid Protocol filings require supplementary cross-search.</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Official Sources & Verification */}
        <article className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Government References</p>
              <p className="mt-1 text-sm text-slate-700">
                Intellectual property registrations in India are administered by the Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM):
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="https://ipindia.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  IP India Official Portal (Trade Marks Registry) ↗
                </a>
                <a
                  href="https://tmrsearch.ipindia.gov.in/tmrpublicsearch/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Trade Marks Public Search System (TMR Database) ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-blue-200 text-xs text-slate-600 shadow-sm shrink-0">
              <p><strong>Reviewed by:</strong> FilingBy IP &amp; Trademark Attorneys</p>
              <p className="mt-1"><strong>Last Updated:</strong> August 2026 (Trade Marks Act, 1999 Compliant)</p>
            </div>
          </div>
        </article>

        {/* FAQs */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Trademark Search &amp; Filing FAQs</h2>
          <div className="mt-6 space-y-4">
            {resourceFaqs.trademark.map((faq) => (
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
