import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { PortalCTA, PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

const PAN_FAQS = [
  {
    q: "What is the difference between PAN and TAN?",
    a: "A Permanent Account Number (PAN) is a unique 10-digit alphanumeric identity issued by the Income Tax Department to track financial transactions and income tax assessments. A Tax Deduction and Collection Account Number (TAN) is required specifically by entities that deduct or collect tax at source (TDS/TCS)."
  },
  {
    q: "What documents are required for a new PAN card application?",
    a: "For individual applicants: Proof of Identity (Aadhaar, Passport, Voter ID), Proof of Address, and Proof of Date of Birth. For companies and LLPs: Certificate of Incorporation (COI) and registered office address proof."
  },
  {
    q: "Can FilingBy help with PAN card corrections or duplicate PAN cards?",
    a: "Yes. FilingBy assists with name corrections, date of birth updates, signature/photo updates, address changes, and issuing duplicate physical/electronic PAN cards."
  },
  {
    q: "Can a foreigner or NRI apply for an Indian PAN card?",
    a: "Yes. Foreign individuals, NRIs, and foreign corporate entities investing in India or generating taxable Indian income can apply for an Indian PAN card using Form 49AA with notarized and apostilled identity and address documents."
  }
];

export default function PanCardPage() {
  const { settings } = useSharedData();
  const whatsappUrl = settings?.ca_whatsapp_url || "https://wa.me/917567126945";
  const phone = settings?.ca_contact_phone || "+91 75671 26945";

  return (
    <>
      <SEO
        title="PAN Card Assistance India — New Application & Correction | FilingBy"
        description="Get fast PAN card assistance in India. Dedicated support for new PAN applications, Form 49A/49AA filings, data corrections, NRI PAN cards, and TAN registration guidance."
        keywords="pan card assistance india, pan application help, pan correction support, pan vs tan, nri pan card india"
        canonical="/services/pan-card"
        schema={null}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/" },
            { name: "PAN Card Assistance", url: "/services/pan-card" }
          ]),
          buildFaqSchema(PAN_FAQS)
        ]}
      />

      <PortalPageShell
        badge="Tax Identity Support"
        title="PAN Card Assistance for Individuals, NRIs &amp; Commercial Entities"
        description="Comprehensive statutory guidance for new PAN applications (Form 49A / 49AA), data corrections, reprint requests, and business tax identity onboarding."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "PAN Card Assistance" }
        ]}
      >
        <PortalCard
          eyebrow="Tax Identity Essentials"
          title="Understanding Your PAN &amp; Tax Registration Requirements"
          description="A Permanent Account Number (PAN) is the cornerstone of Indian financial compliance. Review your filing category to ensure accurate processing:"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1A56DB]">Individual &amp; NRI PAN</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Form 49A for Indian residents and Form 49AA for NRIs and foreign citizens</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1A56DB]">Corporate &amp; LLP PAN</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Integrated PAN allotment during SPICe+ MCA incorporation</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1A56DB]">Corrections &amp; Updates</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Update name, father's name, DOB, or request re-issuance of physical cards</p>
            </div>
          </div>
        </PortalCard>

        <PortalCard
          title="Mandatory Document Checklist for PAN Application"
          description="Prepare the following verified KYC documents before submitting your request:"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Proof of Identity: Aadhaar Card, Passport, Voter ID, or Driving Licence.",
              "Proof of Address: Utility Bill (under 2 months old), Bank Statement, or Passport.",
              "Proof of Date of Birth: Birth Certificate, Matriculation Certificate, or Passport.",
              "For NRIs / Foreigners: Apostilled / Embassy-attested passport and overseas address proof."
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A56DB]/10 text-xs font-black text-[#1A56DB]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCard
          title="Related Tax Registration Pathways"
          description="If you need employer TDS registration or broader business compliance support:"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/services/tan-registration"
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#1A56DB] hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">TAN Registration (TDS Deductors)</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Required by employers and businesses deducting tax under TDS provisions.</p>
            </Link>
            <Link
              to="/contact-us"
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#1A56DB] hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">Consult a Tax Professional</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Get personalized guidance on business entity taxation and registration.</p>
            </Link>
          </div>
        </PortalCard>

        <PortalCard title="Frequently Asked Questions">
          <div className="space-y-3">
            {PAN_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">{faq.q}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCTA
          title="Need Assistance with PAN Application or Corrections?"
          description="Speak with FilingBy's tax advisory desk to ensure smooth submission with zero document errors."
          primary={
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              WhatsApp The Team
            </a>
          }
          secondary={
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Call {phone}
            </a>
          }
        />
      </PortalPageShell>
    </>
  );
}
