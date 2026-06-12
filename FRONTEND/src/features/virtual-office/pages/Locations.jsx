import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function Locations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const statesData = [
    {
      state: "Delhi NCR",
      cities: [
        { name: "Delhi", slug: "delhi", count: 24, addresses: ["Connaught Place", "Nehru Place", "NSP Pitam Pura", "Dwarka"] },
        { name: "Noida", slug: "noida", count: 12, addresses: ["Sector 62", "Sector 63", "Noida Expressway"] },
        { name: "Gurugram", slug: "gurugram", count: 18, addresses: ["Golf Course Road", "Cyber City", "Sohna Road"] },
      ],
    },
    {
      state: "Karnataka",
      cities: [
        { name: "Bangalore", slug: "bangalore", count: 32, addresses: ["Koramangala", "Indiranagar", "MG Road", "HSR Layout", "Whitefield"] },
      ],
    },
    {
      state: "Maharashtra",
      cities: [
        { name: "Mumbai", slug: "mumbai", count: 28, addresses: ["Bandra Kurla Complex (BKC)", "Andheri East", "Nariman Point", "Vashi"] },
        { name: "Pune", slug: "pune", count: 14, addresses: ["Hinjewadi", "Kharadi", "Baner"] },
      ],
    },
    {
      state: "Tamil Nadu",
      cities: [
        { name: "Chennai", slug: "chennai", count: 16, addresses: ["Guindy", "OMR", "T-Nagar", "Anna Salai"] },
      ],
    },
    {
      state: "Telangana",
      cities: [
        { name: "Hyderabad", slug: "hyderabad", count: 20, addresses: ["Hitec City", "Gachibowli", "Jubilee Hills"] },
      ],
    },
    {
      state: "West Bengal",
      cities: [
        { name: "Kolkata", slug: "kolkata", count: 11, addresses: ["Salt Lake Sector V", "Rajarhat New Town", "Park Street"] },
      ],
    },
    {
      state: "Gujarat",
      cities: [
        { name: "Ahmedabad", slug: "ahmedabad", count: 8, addresses: ["S.G. Highway", "Ashram Road", "Gift City"] },
      ],
    },
  ];

  // Flatten cities for lookup
  const allCities = statesData.flatMap(stateGroup => 
    stateGroup.cities.map(city => ({
      ...city,
      state: stateGroup.state
    }))
  );

  const filteredCities = allCities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.addresses.some(addr => addr.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="Virtual Office Locations in India — All Major Cities | FilingBy"
        description="Find virtual office locations across Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune and 100+ cities in India. Premium business addresses for GST registration starting ₹999/month."
        keywords="virtual office locations India, virtual office cities India, virtual office Delhi Mumbai Bangalore, business address India"
        canonical="/locations"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "Locations", url: "/locations" }
        ])}
      />
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 relative overflow-hidden">
        {/* Glow orbs & Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            FilingBy Directory
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-4 mb-6 leading-tight text-white">
            Virtual Office Locations <br />
            <span className="text-[#F97316]">Across All Major Cities in India</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Register your company or secure a GST number anywhere in India. Select a city below to view available business centers.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto bg-white rounded-2xl p-1.5 shadow-xl flex items-center">
            <span className="pl-4 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by city, state, or area (e.g. Koramangala)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-xs font-semibold"
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-screen-xl mx-auto px-4 mt-12">
        {searchQuery ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Search Results ({filteredCities.length} cities found)
            </h2>
            {filteredCities.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <span className="text-4xl">🏢</span>
                <p className="text-gray-500 font-semibold mt-3 text-lg">No virtual office spaces found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-[#1A56DB] text-white rounded-full font-bold hover:bg-blue-700 active:scale-95 transition-all text-sm cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => (
                  <div
                    key={city.slug}
                    onClick={() => navigate(`/virtual-office-${city.slug}`)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-50/30 transition-all duration-300 p-6 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                          {city.state}
                        </span>
                        <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {city.count} centers
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1A56DB] transition-colors">
                        Virtual Office in {city.name}
                      </h3>
                      <p className="text-gray-500 text-xs font-medium mt-2 line-clamp-2">
                        Premium addresses including: {city.addresses.join(", ")}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A56DB] mt-6 group-hover:translate-x-1.5 transition-transform">
                      <span>Explore Spaces</span>
                      <span>➔</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {statesData.map((stateGroup) => (
              <div key={stateGroup.state}>
                <h2 className="text-xl font-extrabold text-gray-900 border-l-4 border-[#1A56DB] pl-3 mb-6">
                  {stateGroup.state} Region
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stateGroup.cities.map((city) => (
                    <div
                      key={city.slug}
                      onClick={() => navigate(`/virtual-office-${city.slug}`)}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-50/30 transition-all duration-300 p-6 cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Starting ₹999/mo
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {city.count} Centers
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1A56DB] transition-colors">
                          {city.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {city.addresses.map((addr) => (
                            <span key={addr} className="text-[10px] bg-gray-100 text-gray-650 rounded px-2 py-0.5 font-semibold">
                              {addr}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs font-bold text-[#1A56DB] mt-6 group-hover:translate-x-1 transition-transform">
                        <span>View Spaces</span>
                        <span>➔</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee banner */}
      <section className="max-w-screen-xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-15 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-400/15 border border-orange-400/20 px-3 py-1 rounded-full">
                Guaranteed Approval
              </span>
              <h2 className="text-2xl md:text-3xl font-black">
                Need an address in a different city or state?
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl">
                We are actively adding shared workspaces and business centers across all states in India. Get in touch with our representative for custom requests.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end gap-4">
              <a 
                href="tel:+917567126945"
                className="px-6 py-3 bg-[#F97316] hover:bg-orange-500 rounded-full font-bold active:scale-95 transition-all text-sm text-center shadow-lg shadow-orange-500/20"
              >
                Call Support
              </a>
              <button 
                onClick={() => navigate("/get-live-quote")}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full font-bold active:scale-95 transition-all text-sm text-center text-white"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
