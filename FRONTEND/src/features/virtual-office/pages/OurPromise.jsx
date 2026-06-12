import { useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function OurPromise() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="Our Promise — 100% Refund Guarantee & SLA | FilingBy"
        description="Read about FilingBy's service commitment. We promise a 100% refund policy if registration fails, quick tax inspection support, and express 24-hour document dispatch."
        keywords="FilingBy refund policy, virtual office SLA, tax inspection support, transparent CA pricing"
        canonical="/our-promise"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "Our Promise", url: "/our-promise" }
        ])}
      />
      {/* Header Fold */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-400/20 text-orange-400 border border-orange-400/20">
            FilingBy Service Commitment
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Our Guarantee to You: <br />
            <span className="text-[#F97316]">100% Compliant or Full Refund</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Your trust is our greatest asset. That's why we secure every virtual lease against strict state codes and offer instant refunds if registrations fail.
          </p>
        </div>
      </section>

      {/* Trust Cards Grid */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "100% Refund Policy",
              desc: "In the rare event that the commercial tax inspector or MCA registrar rejects our address despite valid papers, we will offer a complete 100% refund of the agreement fee, no questions asked.",
              icon: "💰",
              color: "border-l-4 border-[#F97316]",
            },
            {
              title: "Tax Inspection Coordination",
              desc: "GST physical inspections are common. When authorities issue a notice, we schedule a physical desk slot at the target workspace, put up your company name board, and ensure a representative is present to coordinate.",
              icon: "🕵️‍♂️",
              color: "border-l-4 border-blue-600",
            },
            {
              title: "Zero Hidden Charges",
              desc: "Brokers often charge extra for NOC dispatch, name boards, or monthly mail sorting. FilingBy practices flat pricing. You pay once for the selected slab and enjoy complete administrative coverage.",
              icon: "💎",
              color: "border-l-4 border-[#1A56DB]",
            },
            {
              title: "Valid Stamp Duty Leases",
              desc: "We do not sell generic paper prints. Every lease agreement is compiled with correct stamp values, registered property deeds, and matches the local municipal layout records.",
              icon: "📜",
              color: "border-l-4 border-green-500",
            },
          ].map((promise) => (
            <div key={promise.title} className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex gap-6 ${promise.color}`}>
              <span className="text-4xl flex-shrink-0">{promise.icon}</span>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-900">{promise.title}</h3>
                <p className="text-gray-600 text-xs font-medium leading-relaxed">{promise.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline of Support SLA */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-12">FilingBy Response SLA Timelines</h2>
          
          <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {[
              { time: "Under 1 Hour", label: "Initial Draft Agreement Sharing", desc: "Our system prepares and sends digital draft copies of the NOC and Rent Agreement on WhatsApp for your initial check." },
              { time: "Within 24 Hours", label: "Stamp Duty & Utility Bill Issuance", desc: "We complete the lease execution, collect official utility receipts, and email final PDF files." },
              { time: "2-3 Days", label: "Express Courier Delivery", desc: "Original hard copies, stamp deeds, and business name tags are dispatched and tracking details shared." },
            ].map((step) => (
              <div key={step.label} className="relative pl-10">
                <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#1A56DB] border-4 border-white shadow-sm" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                    {step.time}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">{step.label}</h3>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="max-w-screen-xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl md:text-2xl font-black">Register with absolute confidence.</h3>
            <p className="text-gray-300 text-xs md:text-sm max-w-lg mx-auto">
              Our legal experts are ready to draft your documents today. Securing corporate compliance starts here.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button 
                onClick={() => navigate("/locations")}
                className="px-6 py-2.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-full font-bold active:scale-95 transition-all text-xs uppercase cursor-pointer"
              >
                Browse Cities
              </button>
              <button 
                onClick={() => navigate("/get-live-quote")}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/25 text-white rounded-full font-bold active:scale-95 transition-all text-xs uppercase cursor-pointer"
              >
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
