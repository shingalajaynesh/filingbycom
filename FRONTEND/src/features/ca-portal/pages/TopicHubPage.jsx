import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { PortalCTA, PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

const HUB_CLUSTERS = {
  gst: {
    name: "GST Compliance and Tax Hub",
    desc: "All key GST resources, service routes, calculators, and support paths for Indian businesses in one place.",
    services: [
      { name: "GST Registration", slug: "gst-registration" },
      { name: "GST Amendment", slug: "gst-amendment" },
      { name: "GST Return Filing", slug: "gst-filing" },
      { name: "GST LUT Filing", slug: "gst-lut" },
      { name: "GST Cancellation Revocation", slug: "gst-revocation" },
    ],
    calculators: [
      { name: "Interactive GST Calculator", path: "/gst-calculator" },
      { name: "TDS Exemption Calculator", path: "/calculators/tds" },
    ],
    templates: [
      { name: "GST Commercial Rent Agreement", path: "/templates/rent-agreement" },
      { name: "Standard GST Invoice Format", path: "/templates/gst-invoice" },
    ],
  },
  company: {
    name: "Company Incorporation and Startup Hub",
    desc: "Step-by-step guides, entity comparisons, service routes, and practical setup resources for company formation in India.",
    services: [
      { name: "Private Limited Company Incorporation", slug: "private-limited-company" },
      { name: "Limited Liability Partnership (LLP)", slug: "llp-registration" },
      { name: "One Person Company (OPC)", slug: "one-person-company" },
      { name: "Section 8 NGO Registration", slug: "section-8-company" },
      { name: "Nidhi Company Registration", slug: "nidhi-company" },
    ],
    calculators: [{ name: "Asset Depreciation Calculator", path: "/calculators/depreciation" }],
    templates: [
      { name: "Mutual Non-Disclosure Agreement (NDA)", path: "/templates/nda" },
      { name: "Partnership Deed Format Draft", path: "/templates/partnership-deed" },
      { name: "Board Resolution Template", path: "/templates/board-resolution" },
    ],
  },
};

export default function TopicHubPage() {
  const { hubSlug } = useParams();
  const { services: backendServices } = useSharedData();
  const [hubData, setHubData] = useState(null);

  useEffect(() => {
    if (HUB_CLUSTERS[hubSlug]) {
      setHubData(HUB_CLUSTERS[hubSlug]);
      return;
    }

    const formattedTitle = hubSlug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const matchedServices = backendServices
      ? backendServices.filter((service) => service.category?.toLowerCase() === hubSlug.toLowerCase() && service.isActive !== false).slice(0, 5)
      : [];

    setHubData({
      name: `${formattedTitle} Topic Hub`,
      desc: `A grouped view of services, tools, and resources for ${formattedTitle} related compliance queries.`,
      services: matchedServices.length > 0 ? matchedServices : [{ name: "General Compliance Service", slug: "general-compliance" }],
      calculators: [{ name: "Business Calculator", path: "/gst-calculator" }],
      templates: [{ name: "General Agreement Template", path: "/templates/service-agreement" }],
    });
  }, [hubSlug, backendServices]);

  if (!hubData) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-8 w-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" /></div>;
  }

  return (
    <>
      <SEO
        title={`${hubData.name} - Regulatory Procedures and Services | FilingBy`}
        description={hubData.desc}
        canonical={`/hubs/${hubSlug}`}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Topic Hubs", url: "/hubs" },
            { name: hubData.name, url: `/hubs/${hubSlug}` },
          ]),
        ]}
      />

      <PortalPageShell
        badge="Topic Hub"
        title={hubData.name}
        description={hubData.desc}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Topic Hubs" },
          { label: hubData.name },
        ]}
      >
        <div className="grid gap-6 md:grid-cols-3">
          <PortalCard eyebrow="Registration Services">
            <div className="space-y-2">
              {hubData.services.map((service, index) => (
                <Link key={index} to={`/services/${service.slug}`} className="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-[#1A56DB]">
                  {service.name}
                </Link>
              ))}
            </div>
          </PortalCard>

          <PortalCard eyebrow="Calculators and Tools">
            <div className="space-y-2">
              {hubData.calculators.map((tool, index) => (
                <Link key={index} to={tool.path} className="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-[#1A56DB]">
                  {tool.name}
                </Link>
              ))}
            </div>
          </PortalCard>

          <PortalCard eyebrow="Templates and Drafts">
            <div className="space-y-2">
              {hubData.templates.map((template, index) => (
                <Link key={index} to={template.path} className="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-[#1A56DB]">
                  {template.name}
                </Link>
              ))}
            </div>
          </PortalCard>
        </div>

        <section className="rounded-[2rem] border border-slate-200/70 bg-slate-100/60 p-6">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <div className="text-center">
              <span className="block text-lg font-black text-slate-800">100%</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Online Process</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-black text-slate-800">CA Guided</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Practical Review</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-black text-slate-800">Action Ready</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Service and Tool Paths</span>
            </div>
          </div>
        </section>

        <PortalCTA
          title="Need professional advisory support?"
          description="Book a short consultation to connect the right service, tool, document, and next compliance step for your business."
          primary={<Link to="/get-live-quote" className="rounded-full bg-[#F97316] px-6 py-3 text-xs font-bold text-white transition hover:bg-orange-500">Book Free Slot</Link>}
          secondary={<a href="tel:+917567126945" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/15">Talk to CA</a>}
        />
      </PortalPageShell>
    </>
  );
}
