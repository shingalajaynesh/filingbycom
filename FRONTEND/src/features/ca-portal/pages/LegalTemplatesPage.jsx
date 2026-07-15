import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

const TEMPLATE_DOCUMENTS = {
  "nda": {
    name: "Non-Disclosure Agreement (NDA)",
    desc: "Draft a comprehensive NDA to protect your startup's intellectual property, proprietary information, and trade secrets during business discussions.",
    preview: `MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on this ____ day of __________, 2026, by and between:
1. Party A: ______________________________, residing/having registered office at _____________________________________,
And
2. Party B: ______________________________, residing/having registered office at _____________________________________.

1. PURPOSE: The parties wish to explore a potential business relationship (the "Purpose") and in connection therewith, may disclose confidential commercial and technical information.
2. CONFIDENTIAL INFORMATION: Includes all commercial data, software secrets, customer lists, designs, and financial projections shared under this agreement.
3. EXCLUSIONS: Information already public, independent developments, or legally required disclosures.
4. SIGNATURES:

Party A Signature: __________________          Party B Signature: __________________`,
    explanations: [
      "Mutuality: This template is a Mutual NDA, meaning both parties are legally restricted from leaking each other's proprietary disclosures.",
      "Jurisdiction: Set the governing laws (e.g., Delhi courts, Karnataka courts) based on where your primary operations are registered."
    ],
    faqs: [
      { q: "Is a stamp duty registration mandatory for an NDA?", a: "NDAs in India are legally valid when printed on a stamp paper (typically ₹100 or ₹200 denomination) and signed by both parties. Registration is optional but recommended for high-value intellectual properties." }
    ]
  },
  "rent-agreement": {
    name: "Commercial Rent Agreement Template",
    desc: "A standard legal rental agreement contract format for commercial workspaces, virtual offices, or shop leases in India.",
    preview: `COMMERCIAL LEASE & RENT AGREEMENT

This Lease Agreement is made on this ____ day of __________, 2026, by and between:
LANDLORD: ______________________________, residing at ___________________________________________________________,
And
TENANT: ______________________________, residing/having business at ________________________________________________.

1. LEASED PREMISES: The Landlord hereby leases the commercial property located at ___________________________________,
2. TERM: The lease is granted for a term of 11 (Eleven) months commencing from ____________ and ending on ____________.
3. MONTHLY RENT: The Tenant agrees to pay a monthly rent of ₹__________ (Rupees ____________________ only) on or before the 5th day of every calendar month.
4. REFUNDABLE SECURITY DEPOSIT: The Tenant has deposited ₹__________ as interest-free security deposit.

IN WITNESS WHEREOF the parties have set their signatures:
Landlord: __________________                   Tenant: __________________`,
    explanations: [
      "11-Month Clause: Most commercial and residential lease agreements are drafted for 11 months to avoid mandatory registration under the Registration Act, 1908.",
      "Maintenance Charges: Clearly state if municipal taxes, electricity bills, or society maintenance is included in the base rent."
    ],
    faqs: [
      { q: "Can I use this rent agreement to register for GST?", a: "Yes. Along with the signed rent agreement, you must submit a recent utility bill (electricity bill or gas bill) in the name of the landlord, and a signed No-Objection Certificate (NOC) to secure GST approvals." }
    ]
  }
};

export default function LegalTemplatesPage() {
  const { slug } = useParams();
  const [doc, setDoc] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (TEMPLATE_DOCUMENTS[slug]) {
      setDoc(TEMPLATE_DOCUMENTS[slug]);
    } else {
      // Fallback template builder
      const formattedName = slug?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      setDoc({
        name: `${formattedName} Template`,
        desc: `Standard draft copy of ${formattedName} for Indian businesses, startups, and CA registration requirements.`,
        preview: `${formattedName.toUpperCase()} AGREEMENT DRAFT\n\nThis agreement is made on this ___ day of __________, 2026, between the undersigned parties...\n\n1. TERMS OF ENGAGEMENT...\n\n2. DISPUTE RESOLUTION...\n\nSignatures:\nParty A: _______________      Party B: _______________`,
        explanations: [`This is a generic draft for ${formattedName}. Consult a licensed legal counsel or CA before signing.`],
        faqs: [{ q: `What is the legal validity of ${formattedName}?`, a: "It is legally binding once executed on stamp paper of appropriate denomination and signed by authorized representatives." }]
      });
    }
    setCopied(false);
  }, [slug]);

  const handleCopy = () => {
    if (!doc) return;
    navigator.clipboard.writeText(doc.preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <SEO
        title={`Free ${doc.name} Draft Format PDF — FilingBy`}
        description={doc.desc}
        canonical={`/templates/${slug}`}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Templates Directory", url: "/templates" },
            { name: doc.name, url: `/templates/${slug}` }
          ])
        ]}
      />

      <section className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex gap-2 items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-bold">{doc.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-40 pointer-events-none" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Legal Document Library</span>
          <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">{doc.name}</h1>
          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">{doc.desc}</p>
        </div>

        {/* Text Area Draft Box */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase">Document Draft Preview</span>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
            >
              {copied ? "✓ Copied to Clipboard!" : "Copy Text Draft"}
            </button>
          </div>
          <pre className="w-full bg-slate-900 text-slate-150 p-5 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800">
            {doc.preview}
          </pre>
        </div>

        {/* Legal Explanations */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Important Clauses Explained</h2>
          <ul className="space-y-3">
            {doc.explanations.map((exp, i) => (
              <li key={i} className="flex gap-3 text-xs text-slate-600 leading-relaxed font-medium">
                <span className="text-[#1A56DB] font-extrabold">•</span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {doc.faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="block text-xs font-black text-slate-800">{faq.q}</span>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="rounded-3xl bg-slate-900 p-8 text-center text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-30 pointer-events-none" />
          <h3 className="text-xl font-black">Need a Custom Legal Agreement?</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">Generic templates are a great baseline, but high-value agreements require professional review. Consult our certified lawyers to draft custom corporate contracts.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/get-live-quote" className="px-6 py-3 bg-[#F97316] hover:bg-orange-500 text-white rounded-full text-xs font-bold transition-all border-none">Consult Corporate Lawyer</Link>
            <a href="tel:+917567126945" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full text-xs font-bold border border-white/20">Talk to Advisor</a>
          </div>
        </div>

      </section>
    </main>
  );
}
