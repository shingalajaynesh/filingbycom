import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M3 9h18M9 3v6M15 3v6"/>
  </svg>
);
const ShoppingCartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 9.09 19.79 19.79 0 01.88.4 2 2 0 012.86.02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
  </svg>
);
const HelpCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const HandshakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
  </svg>
);
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
  </svg>
);

// ─── City links for dropdown ──────────────────────────────────────────────────
const cities = [
  { label: "Delhi / NCR", path: "/virtual-office/delhi" },
  { label: "Mumbai",       path: "/virtual-office/mumbai" },
  { label: "Bangalore",   path: "/virtual-office/bangalore" },
  { label: "Hyderabad",   path: "/virtual-office/hyderabad" },
  { label: "Chennai",     path: "/virtual-office/chennai" },
  { label: "Kolkata",     path: "/virtual-office/kolkata" },
  { label: "Noida",       path: "/virtual-office/noida" },
];

// ─── Company dropdown links ────────────────────────────────────────────────────
const companyLinks = [
  { icon: UsersIcon,    label: "About Us",         path: "/about-us",          desc: "Our story & mission" },
  { icon: HeartIcon,    label: "Our Promise",      path: "/our-promise",       desc: "What we guarantee to you" },
  { icon: HandshakeIcon,label: "Partner With Us",  path: "/partner-onboarding",desc: "Become a FilingBy partner" },
];

export default function VirtualOfficeNavigation() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [locationOpen,    setLocationOpen]    = useState(false);
  const [companyOpen,     setCompanyOpen]     = useState(false);
  const [mobileSection,   setMobileSection]   = useState(null);
  const [scrolled,        setScrolled]        = useState(false);

  const locationRef = useRef(null);
  const companyRef  = useRef(null);

  // Scroll lock when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  // Navbar scroll effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
      if (companyRef.current  && !companyRef.current.contains(e.target))  setCompanyOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  const goto     = (path) => { navigate(path); setMobileOpen(false); setLocationOpen(false); setCompanyOpen(false); };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/8" : "bg-white"} border-b border-gray-100`}>

      {/* ── Announcement Bar ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#1A56DB] to-[#0a1628] py-1.5">
        <p className="text-white text-[11px] font-semibold text-center">
          🎉 Special Offer: Virtual Office starting at just <span className="font-extrabold underline decoration-dotted">₹999/month</span> — Limited slots!
        </p>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => goto("/virtual-space")} className="flex items-center gap-2 flex-shrink-0 group cursor-pointer border-none bg-transparent p-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1A56DB] to-[#0f2351] flex items-center justify-center text-white p-1.5 group-hover:scale-105 transition-transform shadow-md">
            <BuildingIcon />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black text-gray-900 leading-tight">
              FilingBy<span className="text-[#F97316]">.com</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#1A56DB] uppercase">Virtual Office</span>
          </div>
        </button>

        {/* ── Desktop Nav ───────────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">

          {/* Home */}
          <button onClick={() => goto("/virtual-space")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive("/virtual-space") && location.pathname === "/virtual-space" ? "bg-blue-50 text-[#1A56DB]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
            <div className="w-3.5 h-3.5"><HomeIcon /></div>
            Home
          </button>

          {/* Locations dropdown */}
          <div ref={locationRef} className="relative">
            <button onClick={() => { setLocationOpen(o => !o); setCompanyOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${locationOpen || isActive("/locations") || isActive("/virtual-office") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
              <div className="w-3.5 h-3.5"><MapPinIcon /></div>
              Locations
              <div className={`transition-transform duration-200 ${locationOpen ? "rotate-180" : ""}`}><ChevronDownIcon /></div>
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-2 z-50 animate-fadeInUp">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">Cities</p>
                {cities.map(city => (
                  <button key={city.path} onClick={() => goto(city.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${isActive(city.path) ? "bg-blue-50 text-[#1A56DB]" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 transition-colors ${isActive(city.path) ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#1A56DB]"}`}>
                      <MapPinIcon />
                    </div>
                    {city.label}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#1A56DB]"><ChevronRightIcon /></div>
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={() => goto("/locations")}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#1A56DB] hover:bg-blue-50 transition-all cursor-pointer">
                    View All Locations
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* E-Commerce */}
          <button onClick={() => goto("/virtual-office-ecommerce")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive("/virtual-office-ecommerce") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
            <div className="w-3.5 h-3.5"><ShoppingCartIcon /></div>
            E-Commerce
          </button>

          {/* Customer Care */}
          <button onClick={() => goto("/customer-care")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive("/customer-care") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
            <div className="w-3.5 h-3.5"><PhoneIcon /></div>
            Support
          </button>

          {/* FAQ */}
          <button onClick={() => goto("/faq")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive("/faq") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
            <div className="w-3.5 h-3.5"><HelpCircleIcon /></div>
            FAQs
          </button>

          {/* Company dropdown */}
          <div ref={companyRef} className="relative">
            <button onClick={() => { setCompanyOpen(o => !o); setLocationOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${companyOpen || isActive("/about-us") || isActive("/our-promise") || isActive("/partner-onboarding") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
              <div className="w-3.5 h-3.5"><UsersIcon /></div>
              Company
              <div className={`transition-transform duration-200 ${companyOpen ? "rotate-180" : ""}`}><ChevronDownIcon /></div>
            </button>

            {companyOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-2 z-50 animate-fadeInUp">
                {companyLinks.map(item => (
                  <button key={item.path} onClick={() => goto(item.path)}
                    className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-sm transition-all cursor-pointer group ${isActive(item.path) ? "bg-blue-50 text-[#1A56DB]" : "text-gray-700 hover:bg-gray-50"}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 flex-shrink-0 mt-0.5 transition-colors ${isActive(item.path) ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#1A56DB]"}`}>
                      <item.icon />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold leading-tight">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={() => goto("/get-live-quote")}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#F97316] hover:bg-orange-50 transition-all cursor-pointer">
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5"><QuoteIcon /></div>
                      Get Live Quote
                    </span>
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ── Right Actions ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Phone */}
          <a href="tel:+917567126945"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:border-[#1A56DB] hover:text-[#1A56DB] rounded-full px-3.5 py-2 transition-all">
            <div className="w-3.5 h-3.5"><PhoneIcon /></div>
            <span className="hidden xl:inline">+91 75671 26945</span>
            <span className="xl:hidden">Call</span>
          </a>

          {/* Quote CTA */}
          <button onClick={() => goto("/get-live-quote")}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white bg-[#F97316] hover:bg-orange-500 rounded-full px-4 py-2.5 transition-all active:scale-95 hover:shadow-lg hover:shadow-orange-200 cursor-pointer">
            <div className="w-3.5 h-3.5"><QuoteIcon /></div>
            Free Quote
          </button>

          {/* ── BACK TO CA WEBSITE BUTTON ── */}
          <button
            onClick={() => goto("/")}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#1A56DB] bg-blue-50 border border-blue-200 hover:bg-[#1A56DB] hover:text-white hover:border-[#1A56DB] rounded-full px-3.5 py-2.5 transition-all duration-200 active:scale-95 cursor-pointer group"
            title="Go to FilingBy CA Services"
          >
            <div className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"><ArrowLeftIcon /></div>
            <span>CA Website</span>
          </button>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} className="p-2 lg:hidden rounded-xl hover:bg-gray-100 transition-colors">
            {mobileOpen ? (
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 top-[108px] bg-black/30 z-[997] lg:hidden" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="fixed top-[108px] left-0 right-0 bottom-0 bg-white z-[998] overflow-y-auto lg:hidden">
            <div className="px-4 py-4 space-y-1">

              {/* Home */}
              <button onClick={() => goto("/virtual-space")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-bold text-sm rounded-2xl transition-all ${location.pathname === "/virtual-space" ? "bg-blue-50 text-[#1A56DB]" : "text-gray-900 hover:bg-gray-50"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 ${location.pathname === "/virtual-space" ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500"}`}><HomeIcon /></div>
                Virtual Office Home
                <div className="ml-auto text-gray-300"><ChevronRightIcon /></div>
              </button>

              {/* Locations accordion */}
              <div>
                <button onClick={() => setMobileSection(mobileSection === "loc" ? null : "loc")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-sm rounded-2xl text-gray-900 hover:bg-gray-50 transition-all">
                  <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center p-1.5"><MapPinIcon /></div>
                  Locations
                  <div className={`ml-auto text-gray-400 transition-transform duration-200 ${mobileSection === "loc" ? "rotate-90" : ""}`}><ChevronRightIcon /></div>
                </button>
                {mobileSection === "loc" && (
                  <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-blue-100">
                    {cities.map(city => (
                      <button key={city.path} onClick={() => goto(city.path)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${isActive(city.path) ? "text-[#1A56DB] bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}>
                        <div className="w-4 h-4 text-gray-400"><MapPinIcon /></div>
                        {city.label}
                      </button>
                    ))}
                    <button onClick={() => goto("/locations")}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-[#1A56DB] rounded-xl hover:bg-blue-50 transition-all">
                      All Locations →
                    </button>
                  </div>
                )}
              </div>

              {/* E-Commerce */}
              <button onClick={() => goto("/virtual-office-ecommerce")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-bold text-sm rounded-2xl transition-all ${isActive("/virtual-office-ecommerce") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-900 hover:bg-gray-50"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 ${isActive("/virtual-office-ecommerce") ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500"}`}><ShoppingCartIcon /></div>
                For E-Commerce Sellers
                <div className="ml-auto text-gray-300"><ChevronRightIcon /></div>
              </button>

              {/* Customer Care */}
              <button onClick={() => goto("/customer-care")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-bold text-sm rounded-2xl transition-all ${isActive("/customer-care") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-900 hover:bg-gray-50"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 ${isActive("/customer-care") ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500"}`}><PhoneIcon /></div>
                Customer Support
                <div className="ml-auto text-gray-300"><ChevronRightIcon /></div>
              </button>

              {/* FAQ */}
              <button onClick={() => goto("/faq")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-bold text-sm rounded-2xl transition-all ${isActive("/faq") ? "bg-blue-50 text-[#1A56DB]" : "text-gray-900 hover:bg-gray-50"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 ${isActive("/faq") ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500"}`}><HelpCircleIcon /></div>
                FAQs
                <div className="ml-auto text-gray-300"><ChevronRightIcon /></div>
              </button>

              {/* Company accordion */}
              <div>
                <button onClick={() => setMobileSection(mobileSection === "co" ? null : "co")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 font-bold text-sm rounded-2xl text-gray-900 hover:bg-gray-50 transition-all">
                  <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center p-1.5"><UsersIcon /></div>
                  Company
                  <div className={`ml-auto text-gray-400 transition-transform duration-200 ${mobileSection === "co" ? "rotate-90" : ""}`}><ChevronRightIcon /></div>
                </button>
                {mobileSection === "co" && (
                  <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-blue-100">
                    {companyLinks.map(item => (
                      <button key={item.path} onClick={() => goto(item.path)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${isActive(item.path) ? "text-[#1A56DB] bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}>
                        <div className="w-4 h-4 text-gray-400"><item.icon /></div>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Policies */}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 pb-2">Policies</p>
                {[
                  { label: "Terms & Conditions", path: "/terms-conditions", icon: FileTextIcon },
                  { label: "Refund Policy",       path: "/default/refund",   icon: FileTextIcon },
                  { label: "Privacy Policy",      path: "/default/privacy-policy", icon: FileTextIcon },
                ].map(p => (
                  <button key={p.path} onClick={() => goto(p.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium">
                    <div className="w-4 h-4 text-gray-400"><p.icon /></div>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* CTA section */}
              <div className="pt-4 pb-6 space-y-3 border-t border-gray-100 mt-4">
                <button onClick={() => goto("/get-live-quote")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-[#F97316] rounded-2xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 cursor-pointer">
                  <div className="w-4 h-4"><QuoteIcon /></div>
                  Get Free Quote
                </button>

                {/* ── BACK TO CA WEBSITE (mobile) ── */}
                <button onClick={() => goto("/")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-[#1A56DB] bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 transition-all active:scale-95 cursor-pointer">
                  <ArrowLeftIcon />
                  Back to CA Website (FilingBy)
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
