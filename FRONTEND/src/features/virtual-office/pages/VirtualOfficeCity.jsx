import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "../../../shared/components/SEO.jsx";
import { buildCityVirtualOfficeSchema, buildFaqSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";


// Standard brand logos helper
function BrandLogo({ name }) {
  const configs = {
    Swiggy: { bg: "from-orange-500 to-red-500", letter: "S", color: "text-white", text: "swiggy" },
    Amazon: { bg: "from-yellow-400 to-orange-400", letter: "a", color: "text-gray-900", text: "amazon" },
    Flipkart: { bg: "from-blue-500 to-blue-700", letter: "F", color: "text-yellow-400", text: "Flipkart" },
    Zepto: { bg: "from-purple-500 to-purple-750", letter: "Z", color: "text-white", text: "zepto" },
    Blinkit: { bg: "from-yellow-450 to-yellow-500", letter: "b", color: "text-black", text: "blinkit" },
  };
  const cfg = configs[name];
  if (!cfg) return <span className="text-gray-400 font-bold text-xs">{name}</span>;
  return (
    <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity select-none grayscale hover:grayscale-0">
      <div className={`w-5 h-5 rounded bg-gradient-to-br ${cfg.bg} flex items-center justify-center ${cfg.color} font-black text-[10px] flex-shrink-0`}>
        {cfg.letter}
      </div>
      <span className="text-gray-750 font-extrabold text-xs tracking-tight">{cfg.text}</span>
    </div>
  );
}

export default function VirtualOfficeCity() {
  const { city } = useParams();
  const navigate = useNavigate();
  const { locations, settings } = useSharedData();

  // Extract city slug from route (e.g. from `/virtual-office-delhi` or `/virtual-office/:city`)
  const currentPath = window.location.pathname;
  let detectedCitySlug = "surat";
  if (city) {
    detectedCitySlug = city.toLowerCase();
  } else {
    const match = currentPath.match(/\/virtual-office-([a-zA-Z0-9-]+)/);
    if (match && match[1]) {
      detectedCitySlug = match[1].toLowerCase();
    }
  }

  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    purpose: "",
    message: "",
    city: "",
  });

  // Pre-fill target city on mount or path change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      city: detectedCitySlug.charAt(0).toUpperCase() + detectedCitySlug.slice(1)
    }));
  }, [detectedCitySlug]);

  // Data Map for Cities
  const cityInfo = {
    surat: {
      name: "Surat",
      tagline: "Ring Road, Adajan, Vesu & Varachha",
      rate: "999",
      image: "https://images.unsplash.com/photo-1609137144814-722c608f6575?auto=format&fit=crop&w=1200&q=80",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.818318182283!2d72.7842608!3d21.199321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04df1603504bf%3A0xe54ef48f86f7881c!2sAdajan%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        {
          name: "Adajan Compliance Hub",
          slug: "adajan",
          address: "304, Prime Shoppers, Near Green Arcade, Adajan, Surat, Gujarat - 395009",
          feature: "Prime Commercial Hub, Direct Connectivity",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          priceGST: "999",
          priceIncorp: "1,299",
          priceMail: "599",
          amenities: ["High-speed Wi-Fi", "Courier Handling", "Meeting Rooms", "Professional Receptionist", "GST Officer Desk"]
        },
        {
          name: "Vesu Business Center",
          slug: "vesu",
          address: "502, Rajhans VIP Plaza, VIP Road, Vesu, Surat, Gujarat - 395007",
          feature: "Premium VIP Road Landmark Address",
          image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
          priceGST: "1,099",
          priceIncorp: "1,399",
          priceMail: "649",
          amenities: ["Premium Address", "VIP Lounge Access", "Meeting Rooms", "Digital Mail Forwarding", "Name Board Placement"]
        }
      ],
      faqs: [
        { q: "Is physical verification supported in Surat for GST registration?", a: "Yes, our representatives assist in managing site inspections at our Surat centers by arranging the physical desk and documentation." },
        { q: "Will I get a NOC and utility bill?", a: "Yes, we provide the complete legal documentation kit including the NOC, Utility Bill, Rent Agreement, and Consent Letter." }
      ]
    },
    mumbai: {
      name: "Mumbai",
      tagline: "Bandra Kurla Complex, Andheri East & Nariman Point",
      rate: "1,299",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3770.835848243377!2d72.86475737597125!3d19.070941187085732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e6df3ab0b9%3A0xe54ef48f86f7881c!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        {
          name: "BKC Prestige Towers",
          slug: "bkc",
          address: "Bandra Kurla Complex, G Block, BKC Road, Bandra East, Mumbai - 400051",
          feature: "Grade-A Financial Hub Office Space",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
          priceGST: "1,499",
          priceIncorp: "1,899",
          priceMail: "799",
          amenities: ["Premium BKC Address", "Luxury Boardrooms", "Corporate Lounge", "Reception Desk", "GST Inspection Support"]
        }
      ],
      faqs: [
        { q: "Do you support BMC/Commercial taxes verification in Mumbai?", a: "Yes, all municipal NOC standards and local tax requirements are fully satisfied by our Mumbai documentation." }
      ]
    }
  };

  const dbCity = locations.find(loc => loc.slug === detectedCitySlug);

  // Fallback for custom search/generic cities
  const defaultCity = dbCity || cityInfo[detectedCitySlug] || {
    name: detectedCitySlug ? detectedCitySlug.charAt(0).toUpperCase() + detectedCitySlug.slice(1) : "Selected City",
    tagline: "Premium business addresses for GST & company incorporation",
    rate: "999",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Premium Business Center",
        slug: "premium-center",
        address: `Main Commercial Street, Central Business District, ${detectedCitySlug || "Selected City"}`,
        feature: "Fully Compliant Business Address",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        priceGST: "999",
        priceIncorp: "1,299",
        priceMail: "599",
        amenities: ["NOC & utility files", "Mail collection", "Desk occupancy", "Professional Receptionist"]
      },
    ],
    faqs: [
      { q: "Will I get all required files for GST registration?", a: "Yes, we provide the Rent Agreement, NOC, and Utility Bill (Electricity/Water) to verify ownership of the property." },
      { q: "Is the price transparent?", a: "Absolutely. No hidden management charges or annual renewals. The price you see is all-inclusive." }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { submitInquiry } = useSharedData();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await submitInquiry(formData);
      if (data.success) {
        setSubmitted(true);
        toast.success("Inquiry submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit inquiry");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title={`Virtual Office in ${defaultCity.name} — GST Address ₹${defaultCity.rate}/mo | FilingBy`}
        description={`Get a premium virtual office in ${defaultCity.name} for GST registration, company address, or ecommerce seller registration. Includes NOC, utility bills & rent agreement. Starting ₹${defaultCity.rate}/month.`}
        keywords={`virtual office ${defaultCity.name.toLowerCase()}, virtual office address ${defaultCity.name.toLowerCase()}, GST registration ${defaultCity.name.toLowerCase()}, business address ${defaultCity.name.toLowerCase()} India`}
        canonical={`/virtual-office-${detectedCitySlug}`}
        schema={buildCityVirtualOfficeSchema(defaultCity.name)}
        extraSchemas={[
          buildFaqSchema(defaultCity.faqs),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Virtual Office", url: "/virtual-space" },
            { name: "Locations", url: "/locations" },
            { name: defaultCity.name, url: `/virtual-office-${detectedCitySlug}` }
          ])
        ]}
      />

      {/* Mini Top Sticky Navigation Bar */}
      <div className="bg-white shadow-sm py-4 sticky top-[28px] z-40 border-b border-gray-150">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏢</span>
            <span className="font-black text-gray-900 text-sm md:text-base">Virtual Office in {defaultCity.name}</span>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded hidden sm:inline-block">Starting ₹{defaultCity.rate}/mo</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
              className="text-xs font-black text-gray-900 px-4 py-2 rounded-xl border border-gray-300 hover:border-[#1A56DB] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>📞</span>
              <span className="hidden sm:inline">Call Representative</span>
              <span className="sm:hidden">Call Now</span>
            </a>
            <button
              onClick={() => navigate("/locations")}
              className="text-xs font-black text-white bg-[#1A56DB] hover:bg-blue-700 px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer shadow-md shadow-blue-500/10 border-0"
            >
              Other Cities
            </button>
          </div>
        </div>
      </div>

      {/* Hero / Split Fold Section */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-20 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-15 pointer-events-none" />

        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Fold: Details & Value Props */}
          <div className="lg:col-span-7 space-y-6 animate-fadeInUp">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-orange-400/20 text-orange-400 border border-orange-400/20">
                ⭐ 4.8/5 Star Rated (1,500+ Businesses)
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20">
                🛡️ 100% Moneyback SLA
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Premium Business Address in <br />
              <span className="text-[#F97316]">{defaultCity.name}</span> for GST & MCA
            </h1>

            <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Register your company branch, set up VPOB, or file for a GST registration using a government-compliant commercial address. Complete documentation delivered in 24 hours.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 max-w-xl">
              {[
                "Government Approved NOC",
                "Utility Bill (Electricity/Water)",
                "Registered Stamp Rent Agreement",
                "Physical Inspection Room & Sign",
                "Mail Forwarding & Safe Keeping",
                "Compliance Guarantee Refund"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-gray-200 font-semibold">
                  <span className="w-5 h-5 bg-green-500/25 text-green-400 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Trusted logos */}
            <div className="pt-6 border-t border-white/10 max-w-lg">
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-4">COMPLIANCE TRUSTED BY TEAMS FROM</p>
              <div className="flex flex-wrap gap-6 items-center">
                <BrandLogo name="Swiggy" />
                <BrandLogo name="Amazon" />
                <BrandLogo name="Flipkart" />
                <BrandLogo name="Zepto" />
                <BrandLogo name="Blinkit" />
              </div>
            </div>
          </div>

          {/* Right Fold: Lead Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-gray-900 relative">
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
              <h3 className="text-lg font-black tracking-tight mb-2 text-gray-900">Request Quotation & Documents</h3>
              <p className="text-xs text-gray-500 font-medium mb-6">Leave your query and our compliance officer will share local office details on WhatsApp.</p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <span className="text-5xl block animate-bounce">✅</span>
                  <h4 className="text-xl font-black text-gray-900">Request Registered!</h4>
                  <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                    Our workspace specialist for {defaultCity.name} is preparing draft document drafts and pricing lists. We will message you on WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-600 uppercase block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Verma"
                      className="w-full text-xs font-semibold px-4 py-3.5 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-600 uppercase block mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@company.com"
                        className="w-full text-xs font-semibold px-4 py-3.5 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-600 uppercase block mb-1">WhatsApp Mobile</label>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9999988888"
                        className="w-full text-xs font-semibold px-4 py-3.5 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-600 uppercase block mb-1">Target City</label>
                      <input
                        type="text"
                        name="city"
                        readOnly
                        value={formData.city}
                        className="w-full text-xs font-semibold px-4 py-3.5 rounded-xl border-0 bg-gray-150 text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-600 uppercase block mb-1">Requirement Purpose</label>
                      <select
                        name="purpose"
                        required
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="w-full text-xs font-semibold px-4 py-3.5 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none cursor-pointer"
                      >
                        <option value="">Select Purpose</option>
                        <option value="gst">GST Registration</option>
                        <option value="incorporation">Company Incorporation</option>
                        <option value="mailing">Business Address / Mailing</option>
                        <option value="ecommerce">E-Commerce VPOB / Seller</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-600 uppercase block mb-1">Message / Area Preference (Optional)</label>
                    <textarea
                      name="message"
                      rows="2"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="e.g. Looking for a center near Ramesh Nagar metro"
                      className="w-full text-xs font-semibold px-4 py-3.5 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/25 border-0 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Submitting Inquiry..." : "Get Live Quotes & NOC Drafts"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Available Workspace Centers List */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1A56DB] bg-blue-50 px-3.5 py-1.5 rounded-full">
            Local Workspaces Directory
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mt-4 leading-tight">
            Premium Virtual Office Spaces in {defaultCity.name}
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-2">
            Select a commercial workspace address below. Click details to check specific building photographs, detailed legal details, and floor levels.
          </p>
        </div>

        {/* Workspace Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {defaultCity.addresses.map((addr, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col group border-0"
            >
              {/* Card Photo header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={addr.image}
                  alt={addr.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                  100% GST Verifiable
                </span>
                <span className="absolute bottom-4 left-4 text-white font-black text-xl md:text-2xl drop-shadow-lg">
                  {addr.name}
                </span>
              </div>

              {/* Card details */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 items-start text-xs text-slate-600 font-semibold mb-4 leading-relaxed">
                    <span className="text-base leading-none">📍</span>
                    <span>{addr.address}</span>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 to-transparent text-[#EA580C] px-4 py-2.5 rounded-r-xl border-l-4 border-[#F97316] font-bold text-xs inline-block mb-6 w-full shadow-sm">
                    💡 {addr.feature}
                  </div>

                  {/* Amenities */}
                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">WORKSPACE INCLUSIONS:</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {addr.amenities.map((amen, aIdx) => (
                      <span key={aIdx} className="text-[10px] font-extrabold bg-[#1A56DB]/5 text-[#1A56DB] px-3.5 py-1.5 rounded-full tracking-wide">
                        {amen}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Slab columns */}
                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">PLAN PRICING DETAILS:</h4>
                  <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50/70 p-4 rounded-3xl border-0">
                    <div className="text-center p-2">
                      <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Mailing</span>
                      <span className="text-base font-black text-gray-900">₹{addr.priceMail}</span>
                      <span className="text-[9px] text-gray-500 font-medium block">/mo</span>
                    </div>
                    <div className="text-center p-2 bg-blue-500/5 rounded-2xl">
                      <span className="text-[9px] font-bold text-blue-600 uppercase block mb-1">GST Reg</span>
                      <span className="text-base font-black text-[#1A56DB]">₹{addr.priceGST}</span>
                      <span className="text-[9px] text-gray-500 font-medium block">/mo</span>
                    </div>
                    <div className="text-center p-2">
                      <span className="text-[9px] font-bold text-orange-600 uppercase block mb-1">Incorp</span>
                      <span className="text-base font-black text-orange-600">₹{addr.priceIncorp}</span>
                      <span className="text-[9px] text-gray-500 font-medium block">/mo</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <a
                    href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
                    className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black text-center transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 border-0 shadow-sm"
                  >
                    <span>📞</span>
                    <span>Call Expert</span>
                  </a>
                  <button
                    onClick={() => navigate(`/virtual-office-${detectedCitySlug}/${addr.slug}`)}
                    className="py-3.5 bg-gradient-to-r from-[#1A56DB] to-[#1e40af] hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-xs font-black text-center transition-all cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95 border-0 flex items-center justify-center gap-1.5"
                  >
                    <span>View Photos & NOC</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map & Landmark Section */}
      <section className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md border-0">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-650 bg-orange-50 px-2 py-0.5 rounded">Landmarks</span>
              <h3 className="text-xl font-black text-gray-900 mt-4 mb-4">Locational Advantage</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6">
                All FilingBy centers in {defaultCity.name} are situated in premium class-A IT towers and commercial landmarks, offering extreme credibility to your stationery and invoice address.
              </p>

              <ul className="space-y-3">
                {[
                  "Within 500m of prominent Metro Stations",
                  "Dedicated visitor parking bays inside properties",
                  "Authorized commercial buildings with structural safety NOCs",
                  "Visible external building name boards for corporate audits"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-xs font-bold text-gray-750">
                    <span className="text-[#1A56DB]">📍</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const el = document.querySelector("form");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="mt-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-2xl transition-all cursor-pointer border-0 shadow-sm active:scale-95"
            >
              Get Landlord Consent Letters
            </button>
          </div>

          <div className="lg:col-span-8 bg-white rounded-3xl p-4 shadow-md flex flex-col h-[400px] border-0">
            <h4 className="text-[10px] font-black text-gray-900 mb-2 uppercase tracking-widest pl-2">Google Map Index Location</h4>
            <iframe
              src={defaultCity.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title={`Virtual office map in ${defaultCity.name}`}
              className="rounded-2xl flex-grow"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Compliance / SLA Banner */}
      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="bg-[#0F172A] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border-0 shadow-xl">
          <div className="space-y-2.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#F97316] bg-orange-450/20 border border-orange-500/20 px-3 py-1 rounded">Compliance Lock SLA</span>
            <h3 className="text-xl md:text-2xl font-black">Guaranteed GST Registration Or 100% Refund</h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed font-semibold">
              FilingBy is a CA-backed compliance platform. If your GST application gets rejected because of an address document deficiency, we will work with you to resolve it immediately. If it still fails, we refund your complete booking amount with no questions asked.
            </p>
          </div>
          <button
            onClick={() => navigate("/get-live-quote")}
            className="flex-shrink-0 px-8 py-4 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl text-xs font-black tracking-wider uppercase active:scale-95 transition-all shadow-md shadow-blue-500/20 cursor-pointer border-0"
          >
            Calculate Stamp NOC Charges
          </button>
        </div>
      </section>

      {/* Localized FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-3xl font-black text-center text-gray-900 mb-10">
          FAQs for Virtual Office in {defaultCity.name}
        </h2>
        <div className="space-y-4">
          {defaultCity.faqs.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-sm border-0 ${openFaq === index ? "ring-2 ring-blue-500/10 shadow-md" : "hover:shadow-md"}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none gap-4 border-0 bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === index ? "bg-[#1A56DB] text-white" : "bg-gray-150 text-gray-500"} p-1`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-gray-950 text-sm sm:text-base">{item.q}</span>
                </div>
                <div className={`w-5 h-5 text-[#1A56DB] flex-shrink-0 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 pl-16 animate-fadeInUp">
                  <p className="text-gray-655 text-xs sm:text-sm leading-relaxed font-semibold">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
