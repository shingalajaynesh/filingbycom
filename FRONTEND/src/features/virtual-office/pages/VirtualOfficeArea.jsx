import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function VirtualOfficeArea() {
  const { city, area } = useParams();
  const navigate = useNavigate();

  // Extract city and area slug from route
  const currentPath = window.location.pathname;
  let citySlug = city ? city.toLowerCase() : "delhi";
  let areaSlug = area ? area.toLowerCase() : "rameshnagar";

  // Parse path formats like `/virtual-office-delhi/rameshnagar`
  if (!city) {
    const match = currentPath.match(/\/virtual-office-([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/);
    if (match) {
      citySlug = match[1].toLowerCase();
      areaSlug = match[2].toLowerCase();
    }
  }

  const [activePhoto, setActivePhoto] = useState(0);
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

  const cityNames = {
    delhi: "Delhi",
    mumbai: "Mumbai",
    bangalore: "Bangalore",
    noida: "Noida",
    chennai: "Chennai",
    hyderabad: "Hyderabad",
    kolkata: "Kolkata",
    pune: "Pune",
    ahmedabad: "Ahmedabad",
    gurugram: "Gurugram"
  };

  const cityName = cityNames[citySlug] || (citySlug.charAt(0).toUpperCase() + citySlug.slice(1));

  // Pre-fill target city on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      city: cityName,
      message: `Inquiry for ${areaSlug.toUpperCase()} center in ${cityName}.`
    }));
  }, [cityName, areaSlug]);

  // Area Workspace Database
  const areaData = {
    rameshnagar: {
      name: "Ramesh Nagar Hub",
      address: "Main Ring Road, Metro Pillar No. 370, Ramesh Nagar, New Delhi - 110015",
      priceGST: "999",
      priceIncorp: "1,299",
      priceMail: "599",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.127827878643!2d77.1350849!3d28.6558482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03923ff8c691%3A0xe54ef48f86f7881c!2sRamesh%20Nagar%20Metro%20Station!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      photos: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Located in one of the most accessible retail and commercial markets of West Delhi, the Ramesh Nagar Hub is right adjacent to the Ramesh Nagar Metro Station (Blue Line). Perfect for e-commerce sellers requiring GST addresses, trading firms, and legal setups."
    },
    connaughtplace: {
      name: "Connaught Place Executive Center",
      address: "Radial Road 2, Block-E, Connaught Place, New Delhi - 110001",
      priceGST: "1,199",
      priceIncorp: "1,499",
      priceMail: "699",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      photos: [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Establish your corporate presence at Connaught Place, the premier central business district of the national capital. This Grade-A center provides high credibility for correspondence, visiting cards, and formal bank documentation."
    },
    pitampura: {
      name: "Netaji Subhash Place Heights",
      address: "3rd Floor, NDM-2, Netaji Subhash Place, Pitampura, Delhi - 110034",
      priceGST: "999",
      priceIncorp: "1,299",
      priceMail: "599",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.191637772412!2d77.1507746!3d28.6943831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03d3c874d6df%3A0xe54ef48f86f7881c!2sNetaji%20Subhash%20Place!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      photos: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Netaji Subhash Place is the leading commercial complex in North-West Delhi. Heavily favored by IT, software developers, logistics firms, and chartered accountancy agencies for compliance registrations."
    },
    bkc: {
      name: "BKC Prestige Towers",
      address: "Bandra Kurla Complex, G Block, BKC Road, Bandra East, Mumbai - 400051",
      priceGST: "1,499",
      priceIncorp: "1,899",
      priceMail: "799",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835848243377!2d72.86475737597125!3d19.070941187085732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e6df3ab0b9%3A0xe54ef48f86f7881c!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      photos: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
      ],
      description: "The crown jewel of Mumbai financial hubs, BKC hosts top tier banks and global multinationals. Secure an address here to instantly elevate your business status."
    },
    koramangala: {
      name: "Koramangala Startups Hub",
      address: "80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka - 560034",
      priceGST: "999",
      priceIncorp: "1,299",
      priceMail: "599",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5838520862024!2d77.61907777583685!3d12.934449887377595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae144e3e5c9b4f%3A0xf6708764b8bb6d!2sKoramangala%20Bangalore!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      photos: [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Located in the epicentre of the Indian tech ecosystem. Very popular with venture backed companies, SaaS providers, and consulting firms requiring Karnataka VPOB filings."
    }
  };

  const selectedArea = areaData[areaSlug] || {
    name: `${areaSlug.charAt(0).toUpperCase() + areaSlug.slice(1)} Workspace`,
    address: `Commercial Street, Sector Block, ${cityName} - 100001`,
    priceGST: "999",
    priceIncorp: "1,299",
    priceMail: "599",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%2520Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80"
    ],
    description: `A premium business center offering physical desk, documents (NOC, utilities, rent agreement) suitable for obtaining GST licenses and registering companies in ${cityName}.`
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${API_BASE}/virtual-space/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || "Failed to submit inquiry");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO
        title={`Virtual Office in ${selectedArea.name}, ${cityName} | FilingBy`}
        description={`Get NOC & bills for GST and Company registration at ${selectedArea.name}, ${cityName}. Direct representative support, premium interior photos, starting ₹${selectedArea.priceGST}/mo.`}
        keywords={`virtual office ${areaSlug}, virtual office ${cityName}, GST address ${areaSlug}, VPOB ${cityName}`}
        canonical={`/virtual-office-${citySlug}/${areaSlug}`}
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "Locations", url: "/locations" },
          { name: cityName, url: `/virtual-office-${citySlug}` },
          { name: selectedArea.name, url: `/virtual-office-${citySlug}/${areaSlug}` }
        ])}
      />

      {/* Header / Breadcrumbs */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-28 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto relative z-10 space-y-4">
          <nav className="text-xs text-gray-300 font-bold flex flex-wrap gap-2 items-center mb-4 select-none">
            <span className="cursor-pointer hover:text-white" onClick={() => navigate("/")}>Home</span>
            <span>➔</span>
            <span className="cursor-pointer hover:text-white" onClick={() => navigate("/locations")}>Locations</span>
            <span>➔</span>
            <span className="cursor-pointer hover:text-white" onClick={() => navigate(`/virtual-office-${citySlug}`)}>{cityName}</span>
            <span>➔</span>
            <span className="text-[#F97316] font-black">{selectedArea.name}</span>
          </nav>

          <span className="text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-blue-500/25 text-blue-200 border border-blue-400/20">
            Center ID: FB-{areaSlug.toUpperCase().slice(0, 4)}
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {selectedArea.name} — <span className="text-[#F97316]">Virtual Office Space</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-350 max-w-2xl font-semibold leading-relaxed">
            📍 {selectedArea.address}
          </p>
        </div>
      </section>

      {/* Details Grid */}
      <section className="max-w-screen-xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Gallery Block */}
            <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-900 px-2 uppercase tracking-wide">Workspace Photographs</h3>
              
              <div className="relative h-96 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                <img 
                  src={selectedArea.photos[activePhoto]} 
                  alt="Workspace interior" 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-4 right-4 text-[10px] font-black bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                  Photo {activePhoto + 1} of {selectedArea.photos.length}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {selectedArea.photos.map((ph, index) => (
                  <div 
                    key={index}
                    onClick={() => setActivePhoto(index)}
                    className={`h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activePhoto === index ? "border-[#1A56DB] opacity-100 scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={ph} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Plan list */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 border-l-4 border-[#1A56DB] pl-3 mb-4">About the Business Center</h3>
              <p className="text-gray-655 text-xs md:text-sm font-semibold leading-relaxed">
                {selectedArea.description}
              </p>
              
              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {[
                  { name: "Structural Integrity NOC", desc: "Fire safety and building clearance papers verified" },
                  { name: "Officer Verification Ready", desc: "Dedicated physical verification room with files logged" },
                  { name: "Digital Correspondence", desc: "Letters scanned and instantly forwarded to client WhatsApp/Email" },
                  { name: "Nameboard Placement", desc: "Printed layout board installed in lobby index list" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="text-green-500 font-extrabold text-sm">✓</span>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Packages */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 border-l-4 border-[#1A56DB] pl-3 mb-6">Service Packages & Pricing</h3>
              
              <div className="space-y-6">
                {[
                  {
                    title: "GST Registration Package",
                    price: selectedArea.priceGST,
                    badge: "Best Value",
                    inclusions: ["Government NOC for GST filings", "Electricity & utility bills proof", "Stamped Rent Agreement", "Physical officer inspection spot", "Dedicated representative assistance"]
                  },
                  {
                    title: "Business Address & Mail Package",
                    price: selectedArea.priceMail,
                    badge: "Professional",
                    inclusions: ["Premium mailing address for site/cards", "Courier handling & logging", "Scan & Forward digital updates", "Access to meeting spots (Chargeable)"]
                  },
                  {
                    title: "MCA Company Incorporation",
                    price: selectedArea.priceIncorp,
                    badge: "Corporate",
                    inclusions: ["ROC compliant NOC from land owner", "Director proof utility copy", "Consent Letter & structural NOCs", "Board placement in lobby"]
                  }
                ].map((plan, pIdx) => (
                  <div key={pIdx} className="border border-gray-150 rounded-2xl p-6 hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-gray-900">{plan.title}</h4>
                        <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{plan.badge}</span>
                      </div>
                      
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {plan.inclusions.map((inc, iIdx) => (
                          <li key={iIdx} className="text-[10px] text-gray-500 font-semibold flex items-center gap-1.5">
                            <span className="text-[#1A56DB] text-xs">⚡</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex-shrink-0 text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 space-y-2">
                      <span className="text-xs text-gray-500 block font-bold">Pricing starting from</span>
                      <div className="flex items-baseline gap-1 md:justify-end">
                        <span className="text-2xl font-black text-gray-900">₹{plan.price}</span>
                        <span className="text-xs text-gray-500 font-medium">/month</span>
                      </div>
                      <span className="text-[9px] text-gray-400 block font-semibold">(Billed annually, GST extra)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Lead capture form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-md space-y-5">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">Active Rep Assigned</span>
                <h3 className="text-base font-black text-gray-900 mt-2">Get Instant Legal NOC Draft</h3>
                <p className="text-[10px] text-gray-500 font-medium">Leave details to receive document copies on WhatsApp.</p>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <span className="text-4xl block">🎉</span>
                  <h4 className="text-base font-black text-gray-900">Representative Notified</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Draft files for {selectedArea.name} are being prepared. Check your mobile phone.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder=" Rahul Sharma"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rahul@company.com"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Mobile No</label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="9999988888"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Purpose</label>
                    <select
                      name="purpose"
                      required
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none cursor-pointer"
                    >
                      <option value="">Select Purpose</option>
                      <option value="gst">GST Registration</option>
                      <option value="incorporation">Company Registration</option>
                      <option value="mailing">Mail Address Only</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer border-0 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? "Submitting Inquiry..." : "Confirm & Send WhatsApp NOC"}
                  </button>
                </form>
              )}
            </div>

            {/* Document details box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest pl-1 border-l-3 border-orange-500">Legal Documents List</h4>
              <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                With every purchase, FilingBy provides a full package of compliance paperwork required by state departments:
              </p>
              
              <ul className="space-y-2 pl-2">
                {[
                  "NOC from building owner / structural layout",
                  "Registered rent agreement on stamp paper",
                  "Electricity/Water bill showing tax credentials",
                  "Owner Consent certificate of usage"
                ].map((doc, idx) => (
                  <li key={idx} className="text-[10px] font-bold text-gray-700 flex gap-2">
                    <span className="text-orange-500">📄</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Location Map */}
            <div className="bg-white rounded-3xl p-4 border border-gray-150 shadow-sm h-72 flex flex-col justify-between">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest pl-2 mb-2">Google Map Location</h4>
              <iframe
                src={selectedArea.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title={`Map of ${selectedArea.name}`}
                className="rounded-2xl flex-grow"
              ></iframe>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
