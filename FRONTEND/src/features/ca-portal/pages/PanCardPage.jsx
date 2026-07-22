import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";
import { PortalCTA, PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

const PAN_FAQS = [
  {
    q: "Is PAN the same as TAN?",
    a: "No. PAN is used for income-tax identity and financial reporting, while TAN is for deducting or collecting tax at source. They solve different compliance needs."
  },
  {
    q: "Can FilingBy help if I am not sure whether I need PAN or TAN support?",
    a: "Yes. If you are unsure, start with a short consultation so the team can confirm whether you need PAN application help, PAN correction support, or TAN registration for TDS compliance."
  },
  {
    q: "What should I keep ready before asking for PAN-related help?",
    a: "Keep the applicant type, identity documents, address proof, and the reason for the request ready, especially if the case involves a new application, correction, or business onboarding."
  }
];

export default function PanCardPage() {
  const { settings } = useSharedData();
  const whatsappUrl = settings?.ca_whatsapp_url || "https://wa.me/917567126945";
  const phone = settings?.ca_contact_phone || "+91 75671 26945";

  return (
    <>
      <SEO
        title="PAN Card Assistance India — Application & Correction | FilingBy"
        description="Get PAN card assistance in India for new applications, corrections, document guidance, and help understanding when PAN support is needed instead of TAN."
        keywords="pan card assistance india, pan application help, pan correction support, pan vs tan, pan documents india"
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
        badge="PAN Support"
        title="PAN card help for applications, corrections, and confusion between PAN and TAN"
        description="This page is designed for legacy PAN-card searches and for visitors who need quick help understanding whether the next step is PAN support, TAN registration, or a simple document review."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "PAN Card Assistance" }
        ]}
      >
        <PortalCard
          eyebrow="Quick Answer"
          title="Start here if the search was for PAN card, not TAN"
          description="PAN and TAN are different compliance requirements. If you came from an older PAN page, this destination keeps the search intent aligned and helps you choose the right next step."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Best for</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">New PAN requests, corrections, and document checks</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Common confusion</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">PAN is not the same as TAN for TDS or TCS work</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Fastest next step</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Share the use case and get routed to the correct filing flow</p>
            </div>
          </div>
        </PortalCard>

        <PortalCard
          title="What to check before you proceed"
          description="These are the most common cases where users land on a PAN query but need a clearer route."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "You need a new PAN application for an individual or business entity.",
              "You need a PAN correction because details, spelling, or supporting documents changed.",
              "You are onboarding a business and need to confirm whether the requirement is PAN, TAN, or both.",
              "You want document guidance before starting a tax or compliance application."
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
          title="Related paths"
          description="If your actual requirement is different, use one of these direct routes."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/services/tan-registration"
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#1A56DB] hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">TAN registration</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Use this if the need is TDS or TCS setup and deductor registration.</p>
            </Link>
            <Link
              to="/contact-us"
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#1A56DB] hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">Ask for manual guidance</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Use this if you want the team to confirm the correct service before you start.</p>
            </Link>
          </div>
        </PortalCard>

        <PortalCard title="Frequently asked questions">
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
          title="Need help choosing the right tax-registration path?"
          description="Talk to the FilingBy team before you start the application so the request lands on the correct workflow the first time."
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
