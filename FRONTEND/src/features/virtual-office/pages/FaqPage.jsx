import { useState } from "react";
import SEO from "../../../shared/components/SEO.jsx";
import { buildFaqSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      title: "General Virtual Office Questions",
      items: [
        { q: "What is a Virtual Office?", a: "A Virtual Office provides businesses with a professional corporate address, mailing services, and tax registration compliance (GST/ROC) without the cost of renting a physical commercial office." },
        { q: "Can I use this address for GST registration?", a: "Yes, our addresses are 100% compliant for obtaining a GSTIN in India. We supply all legal documents like the landlord No Objection Certificate (NOC), Utility Bill copy, and Registered Rent Agreement." },
        { q: "How is mail handled at the virtual address?", a: "Our reception desks receive all packages, letters, and government notices. We log the items, take scans of the envelope, notify you immediately on your dashboard, and forward them physically if requested." }
      ]
    },
    {
      title: "Registration & Audits",
      items: [
        { q: "What documents are required from me?", a: "You need to share standard KYC documents: Director PAN Card, Aadhaar Card, photo, and details of your business activity. For foreign subsidiaries, passports and embassy attestations are required." },
        { q: "How do you coordinate with physical GST inspections?", a: "When the department officer calls for site verification, our local coordinator schedules a slot at the workspace. We set up your physical desk, files, and name board, and ensure a host coordinates directly with the officer." }
      ]
    },
    {
      title: "Billing & Renewals",
      items: [
        { q: "What is your refund policy?", a: "We offer a 100% money-back guarantee. If local tax inspectors reject our registry documents and we cannot resolve it, you get a full refund within 7 working days." },
        { q: "Are there any hidden renewal charges?", a: "No. All prices are flat. Renewal terms are communicated beforehand and strictly match the initial agreement rate slabs." }
      ]
    }
  ];

  const flatFaqs = categories.flatMap(cat => cat.items);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="Virtual Office FAQs — GST, Mail Handling & Audit Desk Help | FilingBy"
        description="Find answers to common virtual office questions in India. Learn about GST registration compliance, physical site inspections, mail handling, and refund rules."
        keywords="virtual office FAQ, virtual office registration questions, GST verification support, mail forwarding India"
        canonical="/faq"
        schema={buildFaqSchema(flatFaqs)}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Virtual Office", url: "/virtual-space" },
            { name: "FAQ", url: "/faq" }
          ])
        ]}
      />
      {/* Header Fold */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            FilingBy FAQ Center
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Find immediate answers regarding virtual desk leases, corporate registration compliance, and mail forwarding services.
          </p>
        </div>
      </section>

      {/* Main FAQ list */}
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        {categories.map((cat, catIdx) => (
          <div key={cat.title} className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 border-l-4 border-[#1A56DB] pl-3">
              {cat.title}
            </h2>
            
            <div className="space-y-3">
              {cat.items.map((item, idx) => {
                const uniqueKey = `${catIdx}-${idx}`;
                return (
                  <div key={idx} className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${openFaq === uniqueKey ? "ring-1 ring-blue-500/10 shadow-md" : "hover:shadow-md"}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === uniqueKey ? null : uniqueKey)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === uniqueKey ? "bg-[#1A56DB] text-white" : "bg-gray-100 text-gray-500"} p-1`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
                          </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">{item.q}</span>
                      </div>
                      <div className={`w-5 h-5 text-[#1A56DB] flex-shrink-0 transition-transform duration-200 ${openFaq === uniqueKey ? "rotate-180" : ""}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </button>
                    {openFaq === uniqueKey && (
                      <div className="px-5 pb-5 pl-14 animate-fadeInUp">
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
