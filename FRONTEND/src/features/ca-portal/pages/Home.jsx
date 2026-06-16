import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search.jsx";
import PopularServices from "../components/PopularServices.jsx";
import SEO from "../../../shared/components/SEO.jsx";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { localBusinessSchema, websiteSchema, homeReviewsSchema, buildFaqSchema } from "../../../shared/seo/schemas.js";

const HOME_FAQS = [
  {
    q: "What documents are required for private limited company registration?",
    a: "You will need identity proof (PAN card, Aadhaar card/Passport) and address proof (Bank statement, Electricity bill) for directors, along with proof of registered office address (NOC, utility bill, rent agreement)."
  },
  {
    q: "How long does the GST registration process take?",
    a: "Normally, GST registration is processed and granted by the government within 3 to 7 working days, subject to proper document submissions."
  },
  {
    q: "Are there any hidden costs in filing services?",
    a: "No, FilingBy.com maintains a transparent fee structure. The price listed is final and includes professional assistance and government fee estimates."
  },
  {
    q: "Can I register a business if I work remotely?",
    a: "Yes, you can register a business from anywhere using our Virtual Office services. We provide valid business address credentials in 28 states across India."
  },
  {
    q: "What is the refund policy if my application gets rejected?",
    a: "If your application gets rejected due to validation errors on our side, we offer a full no-questions-asked refund policy. Your compliance satisfaction is our top priority."
  }
];

// Brand logo renderer helper for visual brand logo display
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
    case "Myntra":
      return (
        <div className="flex items-center gap-1 select-none">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-xs tracking-wider">M</span>
          <span className="text-gray-700 font-semibold text-[10px] tracking-wider uppercase">Myntra</span>
        </div>
      );
    case "Meesho":
      return (
        <div className="flex items-center gap-1 select-none">
          <span className="text-pink-650 font-black text-xs tracking-tight lowercase">meesho</span>
        </div>
      );
    case "JioMart":
      return (
        <div className="flex items-center gap-1 select-none">
          <div className="w-4 h-4 rounded bg-blue-700 flex items-center justify-center text-white text-[8px] font-extrabold">J</div>
          <span className="text-blue-900 font-bold text-xs">JioMart</span>
        </div>
      );
    case "Blinkit":
      return (
        <div className="flex items-center gap-1 bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black text-[10px] uppercase tracking-tight select-none">
          <span>blinkit</span>
          <span className="text-[8px]">⚡</span>
        </div>
      );
    case "Zepto":
      return (
        <div className="flex items-center gap-1 text-purple-700 font-black text-xs lowercase tracking-tighter select-none">
          <span>zepto</span>
          <span className="text-[10px]">🚀</span>
        </div>
      );
    case "Saregama":
      return (
        <div className="flex items-center gap-1 select-none">
          <span className="text-sm leading-none">🎵</span>
          <span className="text-gray-800 font-bold text-[10px] uppercase tracking-wider">saregama</span>
        </div>
      );
    case "Relaxo":
      return (
        <div className="flex items-center gap-1 text-blue-600 font-bold italic tracking-wide text-[10px] select-none">
          <span>RELAXO</span>
        </div>
      );
    case "Aramex":
      return (
        <div className="flex items-center gap-1 text-red-650 font-black tracking-tight text-[10px] uppercase select-none">
          <span>aramex</span>
        </div>
      );
    case "HTC":
      return (
        <div className="flex items-center gap-1 text-green-600 font-bold tracking-widest text-[10px] uppercase select-none">
          <span>htc</span>
        </div>
      );
    default:
      return <span className="text-gray-700 font-bold text-xs">{name}</span>;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const { settings } = useSharedData();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <SEO
        title="FilingBy.com — CA Services Online | GST, Company Registration, Trademark, ITR Filing India"
        description="FilingBy.com is India's trusted digital CA, CS, and legal compliance platform. Get expert assistance with GST registration, PVT LTD incorporation, trademark filing, ITR filings, and virtual office addresses. 100% online."
        keywords="GST registration online, private limited company registration India, trademark filing, income tax return filing, virtual office India, professional tax registration, startup business setup"
        canonical="/"
        schema={localBusinessSchema}
        extraSchemas={[websiteSchema, homeReviewsSchema, buildFaqSchema(HOME_FAQS)]}
      />
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-12 text-white  sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur">
            🇮🇳 India's Trusted Legal & Compliance Platform
          </div>
          <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Start, Manage & Grow Your Business
          </h1>
          <p className="mx-auto mb-8 max-w-2xl px-2 text-sm text-blue-100 sm:text-base md:text-lg">
            Expert CA & CS assisted services for GST, Company Registration,
            Trademark, ITR Filing & 100+ more compliance services — 100% online.
          </p>

          <Search />

          <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-4 sm:max-w-2xl sm:grid-cols-4 sm:gap-6">
            {["50,000+", "4.9★", "100+", "10+"].map((value, idx) => (
              <div key={value} className="text-center text-white">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-blue-200">
                  {
                    [
                      "Happy Clients",
                      "Google Rating",
                      "Services",
                      "Years Experience",
                    ][idx]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand logo ticker section */}
      <section className="bg-gray-50 py-10 overflow-hidden border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Trusted by startup founders and leading Indian brands
          </p>
          <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-16 before:bg-gradient-to-r before:from-gray-50 before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-16 after:bg-gradient-to-l after:from-gray-50 after:to-transparent after:z-10">
            <div className="flex animate-ticker whitespace-nowrap">
              {[
                "Swiggy", "Saregama", "Relaxo", "Aramex", "HTC", "Flipkart",
                "Amazon", "Myntra", "Meesho", "JioMart", "Blinkit", "Zepto"
              ].map((logo, index) => (
                <div
                  key={`logo-1-${index}`}
                  className="bg-white rounded-xl px-6 py-3 border border-gray-100 text-sm font-bold text-gray-550 flex-shrink-0 mx-2 shadow-sm"
                >
                  <BrandLogo name={logo} />
                </div>
              ))}
              {[
                "Swiggy", "Saregama", "Relaxo", "Aramex", "HTC", "Flipkart",
                "Amazon", "Myntra", "Meesho", "JioMart", "Blinkit", "Zepto"
              ].map((logo, index) => (
                <div
                  key={`logo-2-${index}`}
                  className="bg-white rounded-xl px-6 py-3 border border-gray-100 text-sm font-bold text-gray-550 flex-shrink-0 mx-2 shadow-sm"
                >
                  <BrandLogo name={logo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
        <PopularServices />
      </section>
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-1 text-sm text-gray-500">
            Simple, fast and fully online from start to finish
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              [
                "📝",
                "Fill the Form",
                "Share your basic details and select your service online in minutes.",
              ],
              [
                "📤",
                "Upload Documents",
                "Securely upload required documents from anywhere.",
              ],
              [
                "✅",
                "Get It Done",
                "Our expert CA/CS team processes and delivers your certificate.",
              ],
            ].map(([icon, title, desc]) => (
              <article
                key={title}
                className="mx-auto max-w-xs text-center md:max-w-none"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl sm:h-16 sm:w-16">
                  {icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Office Teaser Section */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1530] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & Action */}
              <div className="space-y-6 lg:col-span-7 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Premium Compliance Address
                </span>
                
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Establish a Professional Presence with a <span className="text-[#F97316]">Virtual Office</span>
                </h3>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Skip the expensive commercial leases. Secure a premium, legal business address across any of the 28 states in India. Perfect for GST registration, company mailing, or seller registration with 100% compliant documentation.
                </p>

                {/* Structured Checkmarks List */}
                <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Official NOC & Utility Bills</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>100% GST Registry Approved</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Courier & Mail Handling</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Starting at ₹999/month</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate('/virtual-space')}
                    className="w-full sm:w-auto bg-[#F97316] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 cursor-pointer text-center min-h-[48px] inline-flex items-center justify-center gap-2"
                  >
                    <span>Explore Virtual Space</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Column: Premium Compliance Panel */}
              <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
                <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur p-6 shadow-xl relative overflow-hidden">
                  {/* Glowing tag */}
                  <div className="absolute right-0 top-0 bg-gradient-to-l from-green-500 to-emerald-400 text-slate-950 font-extrabold text-[10px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
                    Ready to Use
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 22V12h6v10" />
                        <path d="M3 9h18" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">Elite Business Center</h4>
                      <p className="text-xs text-slate-400">Commercial Business Address</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* State Selector Preview */}
                    <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-semibold">
                        <span>Selected State</span>
                        <span className="text-green-400 font-bold">● Available</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-white font-semibold">
                        <span>Delhi NCR, India</span>
                        <span className="text-slate-400 text-xs">Change State</span>
                      </div>
                    </div>

                    {/* Deliverables checklist */}
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="text-emerald-400 text-sm">✓</span>
                        <div>
                          <p className="font-semibold text-white">NOC & Agreement</p>
                          <p className="text-[10px] text-slate-400">Owner authorization NOC for GST validation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="text-emerald-400 text-sm">✓</span>
                        <div>
                          <p className="font-semibold text-white">Electricity Bill</p>
                          <p className="text-[10px] text-slate-400">Recent utility bill matching the exact address</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="text-emerald-400 text-sm">✓</span>
                        <div>
                          <p className="font-semibold text-white">Desk Space & Signage</p>
                          <p className="text-[10px] text-slate-400">Physical representation for physical verification visits</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Upgraded Why Choose Us Section */}
      <section className="bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="mx-auto max-w-screen-xl text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full text-[#60a5fa] bg-blue-500/10 border border-blue-500/20">
            FilingBy Trust Factor
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-4 mb-10">
            Why 50,000+ Businesses Trust FilingBy
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Expert CA & CS Team",
                desc: "Qualified corporate professionals with 10+ years of legal & compliance experience.",
                bg: "bg-blue-500/10",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Fast Processing",
                desc: "Most service orders and applications filed within 24 to 72 business hours.",
                bg: "bg-green-500/10",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                ),
                title: "Transparent Pricing",
                desc: "Fixed upfront fees with absolutely zero hidden charges or surprises — ever.",
                bg: "bg-purple-500/10",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "100% Secure & Private",
                desc: "Industrial-grade database encryption safeguarding all client company data.",
                bg: "bg-orange-500/10",
              },
            ].map((item, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-950/20 hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  {item.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-white sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-screen-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              [
                "⭐⭐⭐⭐⭐",
                "FilingBy handled our GST registration and company incorporation seamlessly. Highly professional team!",
                "Rahul Mehta",
                "Mehta Enterprises",
              ],
              [
                "⭐⭐⭐⭐⭐",
                "Got our trademark registered in just 3 days. The process was completely online and hassle-free.",
                "Priya Sharma",
                "PS Fashion Studio",
              ],
              [
                "⭐⭐⭐⭐⭐",
                "Their CA team files our monthly GST returns on time every month. No stress, no penalties!",
                "Vikram Patel",
                "Patel Trading Co.",
              ],
            ].map(([stars, quote, name, biz]) => (
              <article
                key={name}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm sm:p-6"
              >
                <p className="mb-4 text-yellow-400">{stars}</p>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 italic">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#1A56DB]">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500">{biz}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-gray-50 py-14 sm:py-16 border-t border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-200 text-gray-700">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {HOME_FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden hover:border-[#1A56DB] transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer min-h-[44px] focus:outline-none"
                >
                  <span className="font-bold text-gray-900 text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <span className={`text-[#1A56DB] font-bold text-xl flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 animate-fadeInUp">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#1A56DB] to-[#1e40af] px-4 py-12 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Ready to Start Your Business Journey?
          </h2>
          <p className="mb-8 text-blue-100">
            Join 50,000+ entrepreneurs who trust FilingBy.com
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A56DB] sm:w-auto sm:px-8"
            >
              Get Started Free
            </button>
            <a
              href={`tel:${settings?.ca_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
              className="w-full rounded-full border-2 border-white px-6 py-3 text-sm font-medium text-white sm:w-auto sm:px-8 flex items-center justify-center cursor-pointer"
            >
              Talk to Expert
            </a>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-5 z-50 group">
        <div className="pointer-events-none absolute bottom-16 right-0 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          💬 Chat with us!
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
        </div>
        <a
          href={settings?.ca_whatsapp_url ? `${settings.ca_whatsapp_url}?text=Hi%2C%20I%20need%20help%20with%20a%20service%20on%20FilingBy.com` : "https://wa.me/917567126945?text=Hi%2C%20I%20need%20help%20with%20a%20service%20on%20FilingBy.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-blob-btn flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110"
          title="Chat with us on WhatsApp"
        >
          <svg
            viewBox="0 0 32 32"
            className="wa-icon-ring h-7 w-7 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.75 3.047 9.383L1.05 30.91l5.7-1.824A15.93 15.93 0 0016.004 32C24.828 32 32 24.822 32 16S24.828 0 16.004 0zm9.28 22.617c-.385 1.086-1.91 1.988-3.13 2.25-.834.178-1.922.32-5.586-1.2-4.688-1.963-7.71-6.72-7.945-7.027-.223-.308-1.883-2.508-1.883-4.781 0-2.273 1.19-3.383 1.61-3.816.386-.4.84-.5 1.12-.5l.808.016c.26.01.613-.098.96.73.386.89 1.313 3.164 1.43 3.393.115.23.19.5.038.808-.15.307-.225.497-.446.766-.224.27-.47.603-.672.81-.224.228-.457.476-.196.932.26.457 1.157 1.908 2.484 3.09 1.707 1.524 3.145 1.996 3.6 2.22.457.222.724.186.99-.112.27-.298 1.154-1.348 1.462-1.81.307-.46.614-.385 1.034-.23.42.154 2.677 1.263 3.134 1.492.457.228.762.342.873.53.11.185.11 1.073-.275 2.16z" />
          </svg>
        </a>
      </div>
    </main>
  );
}
