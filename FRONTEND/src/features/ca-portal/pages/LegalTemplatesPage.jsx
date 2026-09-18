import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import NotFound from "../../../shared/components/NotFound.jsx";

const TEMPLATE_DOCUMENTS = {
  "nda": {
    name: "Non-Disclosure Agreement (NDA)",
    desc: "Draft a comprehensive mutual NDA to protect your startup's intellectual property, proprietary information, and commercial secrets.",
    preview: `MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on this ____ day of __________, 2026, by and between:
1. Disclosing/Receiving Party A: ______________________________, having registered office at _____________________________________,
And
2. Disclosing/Receiving Party B: ______________________________, having registered office at _____________________________________.

1. PURPOSE: The parties wish to explore a potential commercial or corporate relationship and may disclose proprietary information.
2. CONFIDENTIAL INFORMATION: Includes all commercial data, software source code, customer lists, designs, and financial projections.
3. EXCLUSIONS: Information already public, independently developed without access, or legally compelled by statutory order.
4. JURISDICTION: Governed by the laws of the Republic of India with exclusive jurisdiction of competent civil courts.

Signatures:
Party A: __________________          Party B: __________________`,
    explanations: [
      "Mutuality: This template is a Mutual NDA, meaning both parties are legally restricted from leaking each other's proprietary disclosures.",
      "Jurisdiction: Set the governing laws based on where your primary operations are registered."
    ],
    faqs: [
      { q: "Is a stamp duty registration mandatory for an NDA?", a: "NDAs in India are legally valid when printed on non-judicial stamp paper of appropriate denomination (typically ₹100 or ₹200) and signed by both authorized signatories." }
    ]
  },
  "rent-agreement": {
    name: "Commercial Rent Agreement Template",
    desc: "A standard legal rental agreement contract format for commercial workspaces, virtual offices, or business premises in India.",
    preview: `COMMERCIAL LEASE & RENT AGREEMENT

This Lease Agreement is made on this ____ day of __________, 2026, by and between:
LANDLORD: ______________________________, residing at ___________________________________________________________,
And
TENANT: ______________________________, residing/having business at ________________________________________________.

1. LEASED PREMISES: The Landlord hereby leases the commercial premises located at ___________________________________,
2. TERM: The lease is granted for a term of 11 (Eleven) months commencing from ____________ and ending on ____________.
3. MONTHLY RENT: The Tenant agrees to pay a monthly rent of ₹__________ on or before the 5th day of every calendar month.
4. REFUNDABLE SECURITY DEPOSIT: The Tenant has deposited ₹__________ as an interest-free security deposit.

IN WITNESS WHEREOF the parties have set their signatures:
Landlord: __________________                   Tenant: __________________`,
    explanations: [
      "11-Month Clause: Most commercial tenancy agreements are drafted for 11 months to avoid mandatory registration under the Registration Act, 1908.",
      "Maintenance Charges: Clearly state if municipal taxes, electricity bills, or society maintenance is included in the base rent."
    ],
    faqs: [
      { q: "Can I use this rent agreement to register for GST?", a: "Yes. Along with the signed rent agreement, you must submit a recent utility bill in the name of the landlord and a signed No-Objection Certificate (NOC)." }
    ]
  },
  "gst-invoice": {
    name: "Standard GST Tax Invoice Template",
    desc: "Statutory tax invoice blueprint compliant with Section 31 of the CGST Act, 2017 and Rule 46 of the CGST Rules.",
    preview: `TAX INVOICE (RULE 46 CGST RULES, 2017)

SUPPLIER NAME: ___________________________________  GSTIN: _______________________
ADDRESS: _________________________________________  STATE CODE: __________________
INVOICE NO: __________________                      DATE OF ISSUE: _______________

RECIPIENT NAME: __________________________________  GSTIN: _______________________
BILLING ADDRESS: _________________________________  PLACE OF SUPPLY: _____________

ITEM DESCRIPTION | HSN/SAC | QTY | RATE | TAXABLE VALUE | CGST% | SGST% | IGST% | TOTAL
1. _____________ | _______ | ___ | ____ | _____________ | _____ | _____ | _____ | _____

TOTAL INVOICE VALUE (IN WORDS): ___________________________________________________
BANK DETAILS: Bank: _________________ A/C No: _______________ IFSC: _______________

AUTHORIZED SIGNATORY: _____________________________`,
    explanations: [
      "Mandatory HSN/SAC Codes: Businesses with turnover above ₹5 Crore must report 6-digit HSN codes; businesses up to ₹5 Crore report 4-digit codes for B2B supplies.",
      "Place of Supply: Explicitly determines whether CGST+SGST (intra-state) or IGST (inter-state) is levied."
    ],
    faqs: [
      { q: "What is the time limit for issuing a GST tax invoice?", a: "For goods, on or before removal or delivery. For services, within 30 days from the date of service provision (45 days for banking/NBFC entities)." }
    ]
  },
  "partnership-deed": {
    name: "Partnership Deed Format Draft",
    desc: "Comprehensive legal partnership deed under the Indian Partnership Act, 1932 detailing profit-sharing, capital contributions, and partner rights.",
    preview: `PARTNERSHIP DEED

This Deed of Partnership is made on this ____ day of __________, 2026, by and between:
1. Party A: ______________________________, residing at _____________________________________,
And
2. Party B: ______________________________, residing at _____________________________________.

1. NAME & PLACE: The business shall be conducted under the firm name of M/s _____________________________.
2. NATURE OF BUSINESS: The firm shall carry on the business of _________________________________________.
3. CAPITAL & PROFIT SHARING: The capital shall be contributed equally, and net profits/losses shared in ratio: ___:___.
4. BANKING & OPERATION: Bank accounts shall be operated jointly by both partners.
5. ARBITRATION: Disputes shall be settled under the Arbitration and Conciliation Act, 1996.

Signatures of Partners:
Partner 1: __________________          Partner 2: __________________`,
    explanations: [
      "Stamp Paper Admissibility: A partnership deed must be executed on judicial stamp paper whose value is prescribed by the applicable State Stamp Act.",
      "PAN Allotment: Once the deed is signed and notarized, the firm applies for its own entity PAN using Form 49A."
    ],
    faqs: [
      { q: "Is registration of a partnership firm mandatory?", a: "Registration under Section 58 of the Indian Partnership Act, 1932 is optional but highly recommended; unregistered firms cannot sue third parties in civil court for contract breaches." }
    ]
  },
  "board-resolution": {
    name: "Board Resolution Template for Corporate Actions",
    desc: "Certified true copy format for board resolutions passed by directors under the Companies Act, 2013.",
    preview: `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF [COMPANY NAME] HELD ON [DATE] AT [REGISTERED OFFICE ADDRESS]

"RESOLVED THAT the Company be and is hereby authorized to open a Current Bank Account with [Bank Name], [Branch Address] in the name and style of '[Company Name]'.

RESOLVED FURTHER THAT [Director Name], Director (DIN: ________), be and is hereby authorized to sign account opening forms, operate the said account, and submit KYC documents on behalf of the Company."

Certified True Copy,
For [COMPANY NAME]

_________________________
Director / Authorized Signatory
DIN: ____________________`,
    explanations: [
      "Corporate Authority: Banks, GST officers, and government departments require certified true copies of board resolutions to verify signatory authority.",
      "Quorum & Notice: Ensure the meeting complied with Section 173 and 174 of the Companies Act, 2013."
    ],
    faqs: [
      { q: "Can a board resolution be passed by circulation?", a: "Yes, under Section 175 of the Companies Act, 2013, resolutions may be passed by circulation among directors if approved by a majority of directors entitled to vote." }
    ]
  }
};

export default function LegalTemplatesPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  if (!TEMPLATE_DOCUMENTS[slug]) {
    return <NotFound />;
  }

  const doc = TEMPLATE_DOCUMENTS[slug];

  const handleCopy = () => {
    if (!doc) return;
    navigator.clipboard.writeText(doc.preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
