import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function EcommerceOffice() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    platform: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="Virtual Office for E-Commerce Sellers — Amazon VPOB, Flipkart PPOB | FilingBy"
        description="Register as Amazon/Flipkart/Meesho seller with our virtual office address. VPOB (Virtual Principal Place of Business) and PPOB solutions starting ₹999/month. All platforms accepted."
        keywords="virtual office ecommerce India, Amazon VPOB India, Flipkart PPOB address, Meesho seller address, ecommerce GST registration India, virtual office seller registration"
        canonical="/ecommerce-office"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "E-Commerce VPOB", url: "/ecommerce-office" }
        ])}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />
        
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 animate-fadeInUp">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-400/20 text-orange-400 border border-orange-400/20">
              VPOB (Virtual Principal Place of Business) Solutions
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Virtual Office for <br />
              <span className="text-[#F97316]">E-commerce GST Registration</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Fulfill Amazon FC (Fulfilment Center) & Flipkart Assured registration requirements easily. Obtain a valid GSTIN in multiple states using legal virtual addresses starting from ₹999/mo.
            </p>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              {["Amazon", "Flipkart", "Meesho", "Blinkit", "Zepto"].map((plat) => (
                <div key={plat} className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-gray-200">
                  {plat} Compatible
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-900">
              <h3 className="text-lg font-black tracking-tight mb-2">Request VPOB Pricing</h3>
              <p className="text-xs text-gray-500 font-medium mb-4">Select target state for Amazon/Flipkart hub approvals.</p>
              
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <span className="text-4xl text-green-500">✅</span>
                  <h4 className="text-lg font-bold text-gray-900">Request Received!</h4>
                  <p className="text-xs text-gray-500 font-medium">Our VPOB expert will get in touch with you shortly on WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-650 uppercase block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-650 uppercase block mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seller@store.com"
                        className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-650 uppercase block mb-1">Mobile No</label>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9999988888"
                        className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-650 uppercase block mb-1">Target State</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Karnataka"
                        className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-650 uppercase block mb-1">Primary Platform</label>
                      <select
                        name="platform"
                        required
                        value={formData.platform}
                        onChange={handleInputChange}
                        className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none cursor-pointer bg-white"
                      >
                        <option value="">Select Platform</option>
                        <option value="amazon">Amazon Flex/FBA</option>
                        <option value="flipkart">Flipkart FA</option>
                        <option value="meesho">Meesho Supplier</option>
                        <option value="other">Multiple Platforms</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/25"
                  >
                    Get VPOB Document Details
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits cards */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A56DB] bg-blue-50 px-3 py-1 rounded-full">
            Merchant Benefits
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3">
            Why E-commerce Sellers Choose FilingBy
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Seamless compliance solutions tailored for logistics hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Amazon APOB Integration", desc: "Easily register our virtual address as your Additional Place of Business (APOB) to unlock national delivery nodes and lower transit fees.", icon: "📦" },
            { title: "Physical Desk Representation", desc: "Complies with GST physical inspection standards. We allocate physical spaces with signboards to support audits smoothly.", icon: "🖥️" },
            { title: "State NOC Packets", desc: "No Objection Certificate (NOC) templates pre-formatted to pass online portal validation without issues.", icon: "📄" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Slabs */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Simple GST VPOB Pricing Plans
            </h2>
            <p className="text-gray-500 text-sm mt-2">No hidden compliance overheads or broker margins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Single State VPOB", rate: "999", desc: "Best for merchants initiating sales in a single secondary state.", features: ["Valid NOC & Landlord Deed", "Electricity bill utility copy", "Digital mail delivery updates", "Free expert CA alignment"] },
              { name: "Multi-State Combo (3 States)", rate: "2,499", desc: "Best for sellers unlocking East, West, and South warehouse hubs.", features: ["3 High-Converting state addresses", "Priority document delivery", "Complete signboards and tags", "Inspection support call coordination"] },
              { name: "National Seller Package (6+ States)", rate: "4,799", desc: "For large enterprise merchants seeking zero dispatch boundaries.", features: ["6 premium business addresses", "Dedicated customer care liaison", "Immediate 100% refund policy", "Free trade license consultancy"] },
            ].map((plan) => (
              <div key={plan.name} className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-50/20 transition-all duration-300 shadow-sm">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{plan.desc}</p>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <span className="text-3xl font-black text-gray-900">₹{plan.rate}</span>
                    <span className="text-xs font-semibold text-gray-500">/month</span>
                  </div>
                  
                  <ul className="space-y-2 pt-4">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-gray-650 font-medium">
                        <span className="text-green-500 font-extrabold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => navigate("/get-live-quote")}
                  className="w-full mt-8 py-3.5 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-95 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
