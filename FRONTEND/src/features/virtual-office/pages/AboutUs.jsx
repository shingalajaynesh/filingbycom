import { useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { orgSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";

export default function AboutUs() {
  const navigate = useNavigate();
  const { settings } = useSharedData();

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="About FilingBy.com — India's Trusted CA & Virtual Office Platform"
        description="Learn about FilingBy.com — India's trusted platform for online CA services, business incorporation, tax compliance, and virtual office addresses for startups."
        keywords="about FilingBy, CA services company India, virtual office company India, GST registration company"
        canonical="/about-us"
        schema={orgSchema}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About Us", url: "/about-us" }
          ])
        ]}
      />
      {/* Header Fold */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            FilingBy Story
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Simplifying Business Compliance <br />
            <span className="text-[#F97316]">For Indian Entrepreneurs</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            We are a network of verified legal spaces, CA professionals, and technology experts dedicated to providing digital business registrations.
          </p>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="max-w-screen-xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50,000+", label: "Businesses Registered" },
            { value: "99.4%", label: "Client Retention Rate" },
            { value: "150+", label: "CA/CS Professional Panel" },
            { value: "28+", label: "States Covered" },
          ].map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="text-2xl md:text-3xl font-black text-[#1A56DB]">{metric.value}</p>
              <p className="text-gray-500 text-[11px] md:text-xs font-bold uppercase tracking-wider">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="max-w-screen-xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A56DB] bg-blue-50 px-3 py-1 rounded-full">
            Our Purpose
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
            Making company incorporation & GST compliance paperless, affordable and fast.
          </h2>
          <p className="text-gray-600 text-xs font-medium leading-relaxed">
            Founded in 2018, FilingBy.com (formerly NSS IT services) was created to resolve the tedious process of locating physical business desks for company registrations. We aggregate top tier coworking offices, vacant commercial halls, and verified retail setups to provide valid virtual leases.
          </p>
          <p className="text-gray-600 text-xs font-medium leading-relaxed">
            Our software integrates documentation dispatch, mail notifications, and support request tracking directly inside a secure client dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Transparency First", desc: "No hidden administrative charges or arbitrary annual increases. Everything is pre-calculated.", icon: "💎" },
            { title: "100% Legal Guarantee", desc: "All contracts are fully stamp-registered and utility bills checked against government state grids.", icon: "🛡️" },
            { title: "Turnaround SLA", desc: "Digital draft NOCs within 24 hours. Express courier dispatch for original folders.", icon: "⚡" },
            { title: "Expert Care Network", desc: "Dedicated CA/CS support representatives handling commercial tax authority query replies.", icon: "🤝" },
          ].map((val) => (
            <div key={val.title} className="bg-white rounded-2xl shadow-sm p-5 space-y-2">
              <span className="text-2xl">{val.icon}</span>
              <h3 className="text-sm font-bold text-gray-900">{val.title}</h3>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="max-w-screen-xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl md:text-2xl font-black">Ready to scale your business?</h3>
            <p className="text-gray-300 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
              Join thousands of Indian founders who run their corporate registries safely through FilingBy virtual spaces.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button 
                onClick={() => navigate("/locations")}
                className="px-6 py-2.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-full font-bold active:scale-95 transition-all text-xs uppercase cursor-pointer"
              >
                Browse Locations
              </button>
              <a 
                href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/25 text-white rounded-full font-bold active:scale-95 transition-all text-xs uppercase text-center"
              >
                Talk to Expert
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
