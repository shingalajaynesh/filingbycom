import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildCityVirtualOfficeSchema, buildFaqSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

// Standard brand logos helper
function BrandLogo({ name }) {
  switch (name) {
    case "Swiggy":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-[9px] font-black">S</div>
          <span className="text-gray-800 font-extrabold text-xs tracking-tight">swiggy</span>
        </div>
      );
    case "Amazon":
      return (
        <div className="flex flex-col items-center leading-none select-none">
          <span className="text-gray-900 font-black text-xs lowercase">amazon</span>
          <svg className="w-6 h-1 text-orange-400 fill-current -mt-0.5" viewBox="0 0 50 10">
            <path d="M 0 0 Q 25 8 50 0 Q 45 4 40 4 Z" />
          </svg>
        </div>
      );
    case "Flipkart":
      return (
        <div className="flex items-center gap-1 select-none">
          <div className="w-4 h-4 bg-blue-600 text-yellow-400 flex items-center justify-center font-black text-[9px] rounded-sm">F</div>
          <span className="text-gray-800 font-bold text-xs tracking-tight">Flipkart</span>
        </div>
      );
    default:
      return <span className="text-gray-700 font-bold text-xs">{name}</span>;
  }
}

export default function VirtualOfficeCity() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    purpose: "",
    message: "",
  });

  const citySlug = city ? city.toLowerCase() : "delhi";

  // Data Map for Cities
  const cityInfo = {
    delhi: {
      name: "Delhi",
      tagline: "Connaught Place, Nehru Place & NSP",
      rate: "999",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "Connaught Place Executive Center", address: "Radial Road 2, Block-E, Connaught Place, New Delhi - 110001", feature: "Premium Central Delhi Business Hub" },
        { name: "Netaji Subhash Place Heights", address: "3rd Floor, NDM-2, Netaji Subhash Place, Pitampura, Delhi - 110034", feature: "Best for GST Registration & IT Startups" },
        { name: "Nehru Place Plaza", address: "5th Floor, Devika Tower, Nehru Place, New Delhi - 110019", feature: "Asia's Largest IT Market Address" },
      ],
      faqs: [
        { q: "Is physical verification supported in Delhi for GST registration?", a: "Yes. Our representative assists in managing site inspectors, providing the physical desk, files, and name board during verification visits at our Delhi centers." },
        { q: "Will I get a NOC and electricity bill?", a: "Yes, we provide a complete set of legal documents including a No Objection Certificate (NOC), Utility Bill, Rent Agreement, and Owner Consent Letter." },
      ]
    },
    mumbai: {
      name: "Mumbai",
      tagline: "Bandra Kurla Complex & Andheri East",
      rate: "1,299",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3770.835848243377!2d72.86475737597125!3d19.070941187085732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e6df3ab0b9%3A0xe54ef48f86f7881c!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "BKC Prestige Towers", address: "Bandra Kurla Complex, G Block, BKC Road, Bandra East, Mumbai - 400051", feature: "Grade-A Financial Hub Office Space" },
        { name: "Andheri Commercial Hub", address: "Off Kurla Road, Chakala, Andheri East, Mumbai - 400093", feature: "Close proximity to International Airport" },
        { name: "Nariman Point Business Chambers", address: "Mittal Towers, Nariman Point, Mumbai - 400021", feature: "Prime South Bombay Corporate Address" },
      ],
      faqs: [
        { q: "Do you support BMC/Commercial taxes verification in Mumbai?", a: "Yes, all municipal NOC standards and local tax requirements are fully satisfied by our Mumbai documentation." },
        { q: "Can we collect mail directly in BKC?", a: "Absolutely. Our reception team handles, logs, and forwards your mail digitally, or stores it for physical collection." },
      ]
    },
    bangalore: {
      name: "Bangalore",
      tagline: "Koramangala, Indiranagar & HSR Layout",
      rate: "999",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3888.5838520862024!2d77.61907777583685!3d12.934449887377595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae144e3e5c9b4f%3A0xf6708764b8bb6d!2sKoramangala%20Bangalore!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "Koramangala Startups Hub", address: "80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka - 560034", feature: "Heart of the Indian Startup Ecosystem" },
        { name: "HSR Layout Tech Vista", address: "17th Cross Road, Sector 6, HSR Layout, Bengaluru, Karnataka - 560102", feature: "Fastest growing commercial district" },
        { name: "MG Road Plaza", address: "MG Road, Trinity Circle Metro Complex, Bengaluru, Karnataka - 560001", feature: "Legacy Central Business District" },
      ],
      faqs: [
        { q: "Is this address acceptable for Karnataka commercial GST registration?", a: "Yes, 100%. We have registered over 1500+ firms under the local ward jurisdictions in Bengaluru." },
        { q: "What is the turnaround time for document dispatch in Bangalore?", a: "We email high-resolution PDFs of the NOC and bills within 24 hours, and dispatch hard copies through Speed Post immediately." },
      ]
    },
    chennai: {
      name: "Chennai",
      tagline: "Guindy, T-Nagar & OMR Tech Park",
      rate: "999",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3886.9943485740445!2d80.2206456758386!3d12.999677387317929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b91b7d598b%3A0x6b8ec4b967e80000!2sGuindy%20Chennai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "Guindy Industrial Chambers", address: "GST Road, Guindy, Chennai, Tamil Nadu - 600032", feature: "Gateway address for South Chennai" },
        { name: "OMR IT Highway Towers", address: "Old Mahabalipuram Road, Perungudi, Chennai - 600096", feature: "Perfect for IT and software services companies" },
      ],
      faqs: [
        { q: "Is corporate registration compliant with Tamil Nadu stamp act standards?", a: "Yes, our rent agreements are drawn on stamp papers in alignment with standard local authority criteria." },
      ]
    },
    hyderabad: {
      name: "Hyderabad",
      tagline: "Hitec City & Gachibowli Tech Corridor",
      rate: "999",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3806.166687440409!2d78.3794711759312!3d17.452206783446062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d179b%3A0xe54ef48f86f7881c!2sHITEC%20City!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "Hitec City Cyber Towers Complex", address: "Madhapur, Hitec City Phase II, Hyderabad, Telangana - 500081", feature: "Prestigious Tech Park Address" },
        { name: "Gachibowli Vista", address: "Financial District, Nanakramguda, Gachibowli, Hyderabad - 500032", feature: "Next to top global software multinationals" },
      ],
      faqs: [
        { q: "Can I register a foreign subsidiary company under this Hyderabad address?", a: "Yes. We host multiple international IT branches at our Madhapur centers and support the required consular approvals." },
      ]
    },
    noida: {
      name: "Noida",
      tagline: "Sector 62 & Noida-Greater Noida Expressway",
      rate: "999",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3502.2694768305084!2d77.36214707627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce563a32d1bb5%3A0x6b7fa15f8de50a21!2sSector%2062%20Noida!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "Sector 62 IT Park Plaza", address: "Block C, Sector 62, Noida, Uttar Pradesh - 201301", feature: "Spacious Tech Complex for Corporate Filings" },
        { name: "Noida Expressway Hub", address: "Sector 142, Noida-Greater Noida Expressway, Noida - 201305", feature: "Close connectivity to Metro & Delhi Border" },
      ],
      faqs: [
        { q: "Is physical verification assistance provided in UP?", a: "Absolutely. Noida authorities perform physical inspections regularly and our team actively coordinates verification desk slots." },
      ]
    },
    kolkata: {
      name: "Kolkata",
      tagline: "Salt Lake Sector V & Rajarhat New Town",
      rate: "999",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3684.2843468305084!2d88.43214707627464!3d22.572520775667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027563a32d1bb5%3A0x6b7fa15f8de50a21!2sSalt%20Lake%20Sector%20V!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      addresses: [
        { name: "Salt Lake Tech Heights", address: "Sector V, Salt Lake, Kolkata, West Bengal - 700091", feature: "Premier business and technology zone" },
        { name: "New Town Corporate Plaza", address: "Action Area 1, Rajarhat New Town, Kolkata - 700156", feature: "Modern, high-connectivity business center" },
      ],
      faqs: [
        { q: "Do you supply municipal trade license NOCs in Kolkata?", a: "Yes, our documents are fully compatible for obtaining municipal licenses from KMC or NKDA." },
      ]
    },
  };

  // Fallback for custom search/generic cities
  const defaultCity = {
    name: cityInfo[citySlug]?.name || (city ? city.charAt(0).toUpperCase() + city.slice(1) : "Selected City"),
    tagline: cityInfo[citySlug]?.tagline || "Premium business addresses",
    rate: cityInfo[citySlug]?.rate || "999",
    mapEmbed: cityInfo[citySlug]?.mapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: cityInfo[citySlug]?.addresses || [
      { name: "Premium Business Center", address: `Main High Street, Central Zone, ${city || "Selected City"}`, feature: "Premium commercial office address" },
      { name: "Tech Park Desk Space", address: `Sector Block, Tech Hub, ${city || "Selected City"}`, feature: "Perfect for tech startup registrations" },
    ],
    faqs: cityInfo[citySlug]?.faqs || [
      { q: "Will I get all required files for GST registration?", a: "Yes, we provide the Rent Agreement, NOC, and Utility Bill (Electricity/Water) to verify ownership of the property." },
      { q: "Is the price transparent?", a: "Absolutely. No hidden management charges or annual renewals. The price you see is all-inclusive." },
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title={`Virtual Office in ${defaultCity.name} — GST Address ₹${defaultCity.rate}/mo | FilingBy`}
        description={`Get a premium virtual office in ${defaultCity.name} for GST registration, company address, or ecommerce seller registration. Includes NOC, utility bills & rent agreement. Starting ₹${defaultCity.rate}/month.`}
        keywords={`virtual office ${defaultCity.name.toLowerCase()}, virtual office address ${defaultCity.name.toLowerCase()}, GST registration ${defaultCity.name.toLowerCase()}, business address ${defaultCity.name.toLowerCase()} India`}
        canonical={`/virtual-office-${citySlug}`}
        schema={buildCityVirtualOfficeSchema(defaultCity.name)}
        extraSchemas={[
          buildFaqSchema(defaultCity.faqs),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Virtual Office", url: "/virtual-space" },
            { name: "Locations", url: "/locations" },
            { name: defaultCity.name, url: `/virtual-office-${citySlug}` }
          ])
        ]}
      />
      {/* Mini top header */}
      <div className="bg-white border-b border-gray-100 py-3.5 sticky top-[28px] z-40">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <span className="font-extrabold text-gray-900 text-sm">Virtual Office in {defaultCity.name}</span>
          </div>
          <div className="flex gap-2">
            <a 
              href="tel:+917567126945" 
              className="text-xs font-bold text-gray-900 px-3.5 py-1.5 rounded-full border border-gray-300 hover:border-[#1A56DB] active:scale-95 transition-all"
            >
              📞 Call Now
            </a>
            <button 
              onClick={() => navigate("/locations")} 
              className="text-xs font-bold text-white bg-[#1A56DB] hover:bg-blue-700 px-3.5 py-1.5 rounded-full active:scale-95 transition-all cursor-pointer"
            >
              Other Locations
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0F172A] to-[#1A56DB] text-white pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Fold */}
          <div className="lg:col-span-7 space-y-6 animate-fadeInUp">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-400/20 text-orange-400 border border-orange-400/20">
              ₹{defaultCity.rate}/mo* Special Location Offer
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Premium Virtual Office in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{defaultCity.name}</span> <br />
              for GST & Company Registration
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Establish your company presence in {defaultCity.name} without physical lease overheads. Secure NOC, utility bill, and rent agreements instantly.
            </p>

            {/* Feature lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {[
                "100% Secure NOC & Bills",
                "Assisted Physical Verification",
                "Professional Mail Collection",
                "FilingBy Compliance Guarantee",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="text-green-400 font-extrabold">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Clients scrolling teaser */}
            <div className="pt-6 border-t border-white/10 max-w-lg">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-3">TRUSTED BY TEAMS FROM</p>
              <div className="flex gap-4 items-center">
                <BrandLogo name="Swiggy" />
                <BrandLogo name="Amazon" />
                <BrandLogo name="Flipkart" />
              </div>
            </div>
          </div>

          {/* Right Lead Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-gray-900 animate-float">
              <h3 className="text-lg font-black tracking-tight mb-2">Get Instant Pricing Quote</h3>
              <p className="text-xs text-gray-500 font-medium mb-4">Leave details below and receive document samples on WhatsApp.</p>
              
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <span className="text-4xl text-green-500">✅</span>
                  <h4 className="text-lg font-bold text-gray-900">Thank you! Request Received.</h4>
                  <p className="text-xs text-gray-500 font-medium">Our corporate executive will contact you in 5 minutes with local pricing slabs.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Amit Sharma"
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="amit@company.com"
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Mobile No</label>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9999988888"
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Requirement Purpose</label>
                    <select
                      name="purpose"
                      required
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
                    >
                      <option value="">Select Purpose</option>
                      <option value="gst">GST Registration</option>
                      <option value="incorporation">Company Incorporation</option>
                      <option value="mailing">Mailing Address Only</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer"
                  >
                    Request Free Call & Quote
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Local Address Listings */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A56DB] bg-blue-50 px-3 py-1 rounded-full">
            Available Hubs
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3">
            Premium Virtual Office Centers in {defaultCity.name}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Select an address for your official business credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Map Embed - Left side */}
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm h-[320px]">
            <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-widest">Map View</h4>
            <iframe
              src={defaultCity.mapEmbed}
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title={`Virtual office map in ${defaultCity.name}`}
              className="rounded-xl border border-gray-100"
            ></iframe>
          </div>

          {/* Center Address Cards - Right side */}
          <div className="lg:col-span-2 space-y-4">
            {defaultCity.addresses.map((addr, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1A56DB] font-extrabold text-sm">📍</span>
                    <h3 className="text-lg font-black text-gray-900">{addr.name}</h3>
                  </div>
                  <p className="text-gray-600 text-xs font-medium leading-relaxed max-w-xl pl-6">
                    {addr.address}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded pl-2">
                    {addr.feature}
                  </span>
                </div>
                
                <div className="flex-shrink-0 flex gap-2">
                  <a 
                    href="tel:+917567126945" 
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-full text-xs font-extrabold border border-gray-200 active:scale-95 transition-all text-center whitespace-nowrap"
                  >
                    Call Representative
                  </a>
                  <button 
                    onClick={() => navigate("/get-live-quote")}
                    className="px-4 py-2 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-full text-xs font-extrabold active:scale-95 transition-all text-center whitespace-nowrap cursor-pointer"
                  >
                    Select Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localized FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
        <h2 className="text-xl md:text-2xl font-black text-center text-gray-900 mb-8">
          FAQs for Virtual Office in {defaultCity.name}
        </h2>
        <div className="space-y-3">
          {defaultCity.faqs.map((item, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-5 py-4 font-bold text-gray-900 hover:text-[#1A56DB] flex justify-between items-center transition-colors text-sm"
              >
                <span>{item.q}</span>
                <span className="text-gray-400">{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-4 text-xs font-medium text-gray-600 leading-relaxed border-t border-gray-50 pt-2.5">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
