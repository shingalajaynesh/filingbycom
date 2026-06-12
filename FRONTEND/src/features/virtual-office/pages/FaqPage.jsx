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
        description="Find immediate answers to questions about virtual office setups in India. Learn about GST compliance, physical inspections, mailing procedures, and refund guarantees."
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
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0F172A] to-[#1A56DB] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            FilingBy FAQ Center
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
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
                  <div key={idx} className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === uniqueKey ? null : uniqueKey)}
                      className="w-full text-left px-5 py-4 font-bold text-gray-900 hover:text-[#1A56DB] flex justify-between items-center transition-colors text-sm"
                    >
                      <span>{item.q}</span>
                      <span className="text-gray-400">{openFaq === uniqueKey ? "−" : "+"}</span>
                    </button>
                    {openFaq === uniqueKey && (
                      <div className="px-5 pb-4 text-xs font-medium text-gray-600 leading-relaxed border-t border-gray-50 pt-2.5">
                        {item.a}
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
