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
        {
          name: "Delhi",
          slug: "delhi",
          count: 24,
          price: "999",
          image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Connaught Place", slug: "connaughtplace" },
            { name: "Nehru Place", slug: "nehruplace" },
            { name: "NSP Pitam Pura", slug: "pitampura" },
            { name: "Ramesh Nagar", slug: "rameshnagar" }
          ],
        },
        {
          name: "Noida",
          slug: "noida",
          count: 12,
          price: "999",
          image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Sector 62", slug: "sector-62" },
            { name: "Sector 63", slug: "sector-63" },
            { name: "Noida Expressway", slug: "noida-expressway" }
          ],
        },
        {
          name: "Gurugram",
          slug: "gurugram",
          count: 18,
          price: "1,199",
          image: "https://images.unsplash.com/photo-1598977123418-45f04b615e0e?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Golf Course Road", slug: "golf-course-road" },
            { name: "Cyber City", slug: "cyber-city" },
            { name: "Sohna Road", slug: "sohna-road" }
          ],
        },
      ],
    },
    {
      state: "Karnataka",
      cities: [
        {
          name: "Bangalore",
          slug: "bangalore",
          count: 32,
          price: "999",
          image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Koramangala", slug: "koramangala" },
            { name: "Indiranagar", slug: "indiranagar" },
            { name: "MG Road", slug: "mg-road" },
            { name: "HSR Layout", slug: "hsr-layout" },
            { name: "Whitefield", slug: "whitefield" }
          ],
        },
      ],
    },
    {
      state: "Maharashtra",
      cities: [
        {
          name: "Mumbai",
          slug: "mumbai",
          count: 28,
          price: "1,299",
          image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "BKC", slug: "bkc" },
            { name: "Andheri East", slug: "andheri-east" },
            { name: "Nariman Point", slug: "nariman-point" },
            { name: "Vashi", slug: "vashi" }
          ],
        },
        {
          name: "Pune",
          slug: "pune",
          count: 14,
          price: "999",
          image: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Hinjewadi", slug: "hinjewadi" },
            { name: "Kharadi", slug: "kharadi" },
            { name: "Baner", slug: "baner" }
          ],
        },
      ],
    },
    {
      state: "Tamil Nadu",
      cities: [
        {
          name: "Chennai",
          slug: "chennai",
          count: 16,
          price: "999",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Guindy", slug: "guindy" },
            { name: "OMR", slug: "omr" },
            { name: "T-Nagar", slug: "t-nagar" },
            { name: "Anna Salai", slug: "anna-salai" }
          ],
        },
      ],
    },
    {
      state: "Telangana",
      cities: [
        {
          name: "Hyderabad",
          slug: "hyderabad",
          count: 20,
          price: "999",
          image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Hitec City", slug: "hitec-city" },
            { name: "Gachibowli", slug: "gachibowli" },
            { name: "Jubilee Hills", slug: "jubilee-hills" }
          ],
        },
      ],
    },
    {
      state: "West Bengal",
      cities: [
        {
          name: "Kolkata",
          slug: "kolkata",
          count: 11,
          price: "999",
          image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "Salt Lake Sector V", slug: "salt-lake-sector-v" },
            { name: "Rajarhat New Town", slug: "rajarhat-new-town" },
            { name: "Park Street", slug: "park-street" }
          ],
        },
      ],
    },
    {
      state: "Gujarat",
      cities: [
        {
          name: "Ahmedabad",
          slug: "ahmedabad",
          count: 8,
          price: "999",
          image: "https://images.unsplash.com/photo-1609137144814-722c608f6575?auto=format&fit=crop&w=800&q=80",
          addresses: [
            { name: "S.G. Highway", slug: "sg-highway" },
            { name: "Ashram Road", slug: "ashram-road" },
            { name: "Gift City", slug: "gift-city" }
          ],
        },
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
    city.addresses.some(addr => addr.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
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
      
      {/* Hero Header Section */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Glow orbs & Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fadeInUp">
          <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
            FilingBy Directory
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-5 mb-6 leading-tight text-white">
            Premium Virtual Office Addresses <br />
            <span className="text-[#F97316]">Across All Major Cities in India</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-10 max-w-2xl mx-auto font-medium">
            Get instant NOC, utility bills, and rental agreements for company incorporation or GST registration in any state. Select your city to explore active centers.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto bg-white rounded-2xl p-1.5 shadow-2xl flex items-center border border-white/10 backdrop-blur-md">
            <span className="pl-4 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by city, state, or specific area (e.g. Ramesh Nagar, BKC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-450 focus:outline-none text-xs font-semibold"
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-screen-xl mx-auto px-4 mt-16">
        {searchQuery ? (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span>Search Results</span>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {filteredCities.length} match{filteredCities.length !== 1 && "es"}
              </span>
            </h2>
            {filteredCities.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-150 p-16 text-center max-w-md mx-auto">
                <span className="text-5xl block mb-4">🏢</span>
                <p className="text-gray-900 font-extrabold text-lg">No virtual office spaces found</p>
                <p className="text-gray-500 text-xs mt-1">We couldn't find any centers matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-6 py-2.5 bg-[#1A56DB] text-white rounded-full font-bold hover:bg-blue-700 active:scale-95 transition-all text-xs cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Reset Search Query
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCities.map((city) => (
                  <div
                    key={city.slug}
                    className="bg-white rounded-3xl border border-gray-150 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image block */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={city.image} 
                          alt={`Virtual Office in ${city.name}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full shadow-sm">
                          Starting ₹{city.price}/mo
                        </span>
                        <span className="absolute bottom-4 left-4 text-white font-black text-xl drop-shadow-md">
                          {city.name}
                        </span>
                        <span className="absolute bottom-4 right-4 text-[10px] font-bold text-white bg-blue-600/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          {city.count} centers
                        </span>
                      </div>
                      
                      {/* Address list */}
                      <div className="p-6">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {city.state}
                        </span>
                        <h4 className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mt-4 mb-2">Popular Sub-Locations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {city.addresses.map((addr) => (
                            <button
                              key={addr.slug}
                              onClick={() => navigate(`/virtual-office-${city.slug}/${addr.slug}`)}
                              className="text-[10px] bg-gray-100 hover:bg-[#1A56DB] text-gray-700 hover:text-white rounded-lg px-2.5 py-1.5 font-bold transition-colors cursor-pointer border-0"
                            >
                              {addr.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 mt-2">
                      <button
                        onClick={() => navigate(`/virtual-office-${city.slug}`)}
                        className="w-full py-3 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 group-hover:shadow-lg shadow-blue-500/10 cursor-pointer"
                      >
                        <span>Explore All Spaces</span>
                        <span className="group-hover:translate-x-1.5 transition-transform">➔</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {statesData.map((stateGroup) => (
              <div key={stateGroup.state}>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 border-l-4 border-[#1A56DB] pl-4 mb-8">
                  {stateGroup.state} Region
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stateGroup.cities.map((city) => (
                    <div
                      key={city.slug}
                      className="bg-white rounded-3xl border border-gray-150 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image block */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={city.image} 
                            alt={`Virtual Office in ${city.name}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider text-orange-655 bg-orange-50 px-3 py-1 rounded-full shadow-sm">
                            Starting ₹{city.price}/mo
                          </span>
                          <span className="absolute bottom-4 left-4 text-white font-black text-xl drop-shadow-md">
                            {city.name}
                          </span>
                          <span className="absolute bottom-4 right-4 text-[10px] font-bold text-white bg-blue-600/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            {city.count} Centers
                          </span>
                        </div>
                        
                        {/* Address list */}
                        <div className="p-6">
                          <h4 className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mb-2.5">Available Areas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {city.addresses.map((addr) => (
                              <button
                                key={addr.slug}
                                onClick={() => navigate(`/virtual-office-${city.slug}/${addr.slug}`)}
                                className="text-[10px] bg-gray-100 hover:bg-[#1A56DB] text-gray-700 hover:text-white rounded-lg px-2.5 py-1.5 font-bold transition-colors cursor-pointer border-0"
                              >
                                {addr.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0 mt-2">
                        <button
                          onClick={() => navigate(`/virtual-office-${city.slug}`)}
                          className="w-full py-3 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 group-hover:shadow-lg shadow-blue-500/10 cursor-pointer"
                        >
                          <span>Explore Office Hubs</span>
                          <span className="group-hover:translate-x-1.5 transition-transform">➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Support and Guarantee Section */}
      <section className="max-w-screen-xl mx-auto px-4 mt-24">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] rounded-3xl p-8 md:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-15 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/15 border border-orange-400/20 px-3.5 py-1.5 rounded-full">
                Guaranteed Approval
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Don't see your desired location?
              </h2>
              <p className="text-gray-350 text-sm md:text-base max-w-xl font-medium">
                We are constantly expanding. If you need a virtual office address in a specific town, tier-2/tier-3 city, or state not listed here, get in touch immediately. We will arrange legal compliance addresses for you.
              </p>
            </div>
            <div className="flex flex-wrap lg:justify-end gap-4">
              <a 
                href="tel:+917567126945"
                className="px-7 py-3.5 bg-[#F97316] hover:bg-orange-500 rounded-full font-bold active:scale-95 transition-all text-xs tracking-wider uppercase text-center shadow-lg shadow-orange-500/25"
              >
                Call Support
              </a>
              <button 
                onClick={() => navigate("/get-live-quote")}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full font-bold active:scale-95 transition-all text-xs tracking-wider uppercase text-center text-white cursor-pointer"
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
