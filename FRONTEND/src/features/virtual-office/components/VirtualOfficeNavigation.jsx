import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useUserContext } from "../../../shared/context/UserContext.jsx";
import { usePortalAuth } from "../../../routes/RouteGuards.jsx";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 22V12h6v10M3 9h18M9 3v6M15 3v6" />
  </svg>
);
const ShoppingCartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 9.09 19.79 19.79 0 01.88.4 2 2 0 012.86.02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
  </svg>
);
const HelpCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const HandshakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
  </svg>
);

// ─── City links fallback ──────────────────────────────────────────────────────
const fallbackCities = [
  { label: "Surat", path: "/virtual-office-surat" },
  { label: "Mumbai", path: "/virtual-office-mumbai" },
];

// ─── Company dropdown links ────────────────────────────────────────────────────
const companyLinks = [
  { icon: UsersIcon, label: "About Us", path: "/about-us", desc: "Our story & mission" },
  { icon: HeartIcon, label: "Our Promise", path: "/our-promise", desc: "What we guarantee to you" },
  { icon: HandshakeIcon, label: "Partner With Us", path: "/partner-onboarding", desc: "Become a FilingBy partner" },
];

export default function VirtualOfficeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { services, mainServices, locations, settings } = useSharedData();
  const { isSignedIn } = usePortalAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { profile } = useUserContext();

  const [navData, setNavData] = useState([]);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuCities = locations && locations.length > 0
    ? locations.map(loc => ({ label: loc.name, path: `/virtual-office-${loc.slug}` }))
    : fallbackCities;

  // Process dynamic services for virtual-space
  useEffect(() => {
    if (!services || services.length === 0 || !mainServices || mainServices.length === 0) {
      return;
    }

    const navMap = {};
    mainServices
      .filter(m => m.isActive !== false && m.portal === "virtual-space")
      .forEach(main => {
        navMap[main._id] = {
          id: main._id,
          label: main.name,
          order: main.order || 0,
          sections: {}
        };
      });

    services
      .filter(s => s.isActive !== false && s.portal === "virtual-space")
      .forEach(service => {
        const mainId = service.mainService?._id || service.mainService;
        const section = service.navSection || 'General';

        if (mainId && navMap[mainId]) {
          if (!navMap[mainId].sections[section]) {
            navMap[mainId].sections[section] = { heading: section, items: [] };
          }
          navMap[mainId].sections[section].items.push({
            label: service.name,
            slug: service.slug,
            order: service.order || 0
          });
        }
      });

    const formattedNavData = Object.values(navMap)
      .sort((a, b) => a.order - b.order)
      .map(cat => ({
        ...cat,
        sections: Object.values(cat.sections).map(sec => ({
          ...sec,
          items: sec.items.sort((a, b) => a.order - b.order)
        }))
      }));

    setNavData(formattedNavData);
  }, [services, mainServices]);

  // Navbar scroll effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [mobileOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.profile-dropdown-wrapper')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const dummyUser = {
    name: "User",
    initials: "U",
    email: "",
    business: "Client",
  };

  const currentUser = user ? {
    name: user.fullName || "User",
    initials: getInitials(user.firstName, user.lastName),
    email: user.primaryEmailAddress?.emailAddress || "",
    business: "Client",
  } : dummyUser;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  const goto = (path) => {
    navigate(path);
    setMobileOpen(false);
    setOpen(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#1A56DB] to-[#0a1628] py-1.5 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-center">
          <p className="text-white text-[11px] font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis">
            {settings?.vs_announcement_text || "🎉 Special Offer: Virtual Office starting at just ₹999/month — Limited slots!"}
          </p>
        </div>
      </div>

      {/* Nav container */}
      <div className="w-full px-4 sm:px-6 min-[1500px]:px-8">
        
        {/* DESKTOP ROW (lg/1024px and above) */}
        <div className="hidden lg:flex items-center h-14 w-full gap-4">
          
          {/* COL 1: Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => goto("/virtual-space")} className="flex items-center bg-blue-50 rounded-xl px-3 py-1.5 hover:bg-blue-100 transition-colors border-none cursor-pointer">
              <span className="text-xl font-extrabold text-[#1A56DB]">FilingBy</span>
              <span className="text-xl font-extrabold text-[#F97316]">.com</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-md bg-[#1A56DB] text-white text-[9px] font-black uppercase tracking-wider">Virtual Office</span>
            </button>
          </div>

          {/* COL 2: Centered dynamic navigation links */}
          <nav className="flex-1 min-w-0 flex items-center justify-center overflow-visible">
            <ul className="flex items-center list-none m-0 p-0 flex-nowrap gap-0.5">
              
              {/* Dynamic Database categories */}
              {navData.map((category) => (
                <li
                  key={category.id}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setOpen(category.id)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer text-[14px] font-bold ${
                      open === category.id
                        ? 'text-[#1A56DB] bg-blue-50'
                        : 'text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50'
                    }`}
                  >
                    {category.label}
                    <ChevronDownIcon />
                  </button>

                  {open === category.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 z-[999] pt-1">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5" style={{ minWidth: '420px', maxWidth: '600px' }}>
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(category.sections.length, 3)}, 1fr)` }}>
                          {category.sections.map((section) => (
                            <div key={section.heading}>
                              <p className="text-sm font-bold text-gray-905 uppercase tracking-widest mb-2 px-2">
                                {section.heading}
                              </p>
                              <ul className="space-y-0.5 list-none p-0 m-0">
                                {section.items.map((item) => (
                                  <li key={item.slug}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (item.slug.startsWith('/')) {
                                          goto(item.slug);
                                        } else {
                                          goto(`/services/${item.slug}`);
                                        }
                                      }}
                                      className="w-full text-left text-[14px] text-gray-800 font-medium hover:text-[#1A56DB] hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 group cursor-pointer"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-350 flex-shrink-0 group-hover:bg-[#1A56DB] transition-colors" />
                                      {item.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}

              {/* Static: Locations Dropdown */}
              <li
                className="relative flex-shrink-0"
                onMouseEnter={() => setOpen('locations')}
                onMouseLeave={() => setOpen(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer text-[14px] font-bold ${
                    open === 'locations' || isActive('/locations')
                      ? 'text-[#1A56DB] bg-blue-50'
                      : 'text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50'
                  }`}
                >
                  <MapPinIcon />
                  Locations
                  <ChevronDownIcon />
                </button>

                {open === 'locations' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 z-[999] pt-1">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-64 animate-fadeInUp">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">Cities</p>
                      {menuCities.map(city => (
                        <button key={city.path} onClick={() => goto(city.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border-0 bg-transparent group ${
                            isActive(city.path) ? "bg-blue-50 text-[#1A56DB]" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 transition-colors ${
                            isActive(city.path) ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#1A56DB]"
                          }`}>
                            <MapPinIcon />
                          </div>
                          {city.label}
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#1A56DB]"><ChevronRightIcon /></div>
                        </button>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => goto("/locations")}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#1A56DB] hover:bg-blue-50 transition-all border-none bg-transparent cursor-pointer"
                        >
                          View All Locations
                          <ChevronRightIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Static: E-Commerce link */}
              <li className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => goto("/virtual-office-ecommerce")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer text-[14px] font-bold ${
                    isActive("/virtual-office-ecommerce")
                      ? 'text-[#1A56DB] bg-blue-50'
                      : 'text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50'
                  }`}
                >
                  <ShoppingCartIcon />
                  E-Commerce Address
                </button>
              </li>

              {/* Static: FAQs link */}
              <li className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => goto("/faq")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer text-[14px] font-bold ${
                    isActive("/faq")
                      ? 'text-[#1A56DB] bg-blue-50'
                      : 'text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50'
                  }`}
                >
                  <HelpCircleIcon />
                  FAQs
                </button>
              </li>

              {/* Static: Company dropdown */}
              <li
                className="relative flex-shrink-0"
                onMouseEnter={() => setOpen('company')}
                onMouseLeave={() => setOpen(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer text-[14px] font-bold ${
                    open === 'company' || companyLinks.some(c => isActive(c.path))
                      ? 'text-[#1A56DB] bg-blue-50'
                      : 'text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50'
                  }`}
                >
                  Company
                  <ChevronDownIcon />
                </button>

                {open === 'company' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 z-[999] pt-1">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-64 animate-fadeInUp">
                      {companyLinks.map(item => (
                        <button key={item.path} onClick={() => goto(item.path)}
                          className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-sm transition-all border-0 bg-transparent cursor-pointer group ${
                            isActive(item.path) ? "bg-blue-50 text-[#1A56DB]" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1.5 flex-shrink-0 mt-0.5 transition-colors ${
                            isActive(item.path) ? "bg-blue-100 text-[#1A56DB]" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#1A56DB]"
                          }`}>
                            <item.icon />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold leading-tight">{item.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5 leading-none">{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>

            </ul>
          </nav>

          {/* COL 3: Right side profile or login */}
          <div className="flex-shrink-0 flex items-center gap-2">
            
            {/* Contact Call button */}
            <a href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:border-[#1A56DB] hover:text-[#1A56DB] rounded-full px-3.5 py-2.5 transition-all"
            >
              <PhoneIcon />
              <span className="hidden xl:inline">{settings?.vs_contact_phone || "+91 75671 26945"}</span>
              <span className="xl:hidden">Call Us</span>
            </a>

            {/* Free Quote CTA */}
            <button onClick={() => goto("/get-live-quote")}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#F97316] hover:bg-orange-500 rounded-full px-4 py-2.5 transition-all active:scale-95 hover:shadow-lg hover:shadow-orange-205 cursor-pointer border-0"
            >
              <QuoteIcon />
              Free Quote
            </button>

            {/* Transition back to CA site */}
            <button
              onClick={() => goto("/")}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1A56DB] bg-blue-50 border border-blue-200 hover:bg-[#1A56DB] hover:text-white hover:border-[#1A56DB] rounded-full px-3.5 py-2.5 transition-all duration-200 active:scale-95 cursor-pointer group"
              title="Go to FilingBy CA Services"
            >
              <div className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"><ArrowLeftIcon /></div>
              <span>CA Site</span>
            </button>

            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goto(profile?.isPartner ? "/partner/dashboard" : "/virtual-office/dashboard")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1A56DB] rounded-full px-3.5 py-2.5 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Dashboard
                </button>

                {/* Profile dropdown */}
                <div
                  className="relative profile-dropdown-wrapper"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-full hover:bg-gray-50 pl-1 pr-2 py-1 transition-all border-none bg-transparent cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A56DB] to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                      {currentUser.initials}
                    </div>
                    <span className="text-xs font-semibold text-gray-900 max-w-[80px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDownIcon />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full z-[999] pt-1">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-56">
                        <div className="bg-gradient-to-br from-[#0a1628] to-[#1A56DB] p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                              {currentUser.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-bold text-sm truncate">
                                {currentUser.name}
                              </p>
                              <p className="text-blue-205 text-[10px] truncate">
                                {currentUser.business}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          {profile?.isClient !== false && (
                            <button
                              onClick={() => goto("/virtual-office/dashboard")}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50 rounded-xl transition-colors text-left border-none bg-transparent cursor-pointer"
                            >
                              <span>🏠</span> Dashboard overview
                            </button>
                          )}
                          {profile?.isPartner && (
                            <button
                              onClick={() => goto("/partner/dashboard")}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50 rounded-xl transition-colors text-left border-none bg-transparent cursor-pointer"
                            >
                              <span>🤝</span> Partner dashboard
                            </button>
                          )}
                          <div className="border-t border-gray-100 my-1.5" />
                          <button
                            onClick={() => signOut(() => navigate("/virtual-space"))}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-left border-none bg-transparent cursor-pointer"
                          >
                            <span>🚪</span> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <button
                onClick={() => goto("/login")}
                className="text-[14px] font-bold text-gray-900 border border-gray-300 rounded-full px-3.5 py-2 hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all bg-transparent cursor-pointer whitespace-nowrap"
              >
                Login
              </button>
            )}

          </div>

        </div>

        {/* MOBILE ROW (below lg/1024px) */}
        <div className="flex lg:hidden items-center justify-between h-14 w-full">
          {/* Logo */}
          <button onClick={() => goto("/virtual-space")} className="flex items-center bg-blue-50 rounded-xl px-2.5 py-1 hover:bg-blue-100 transition-colors border-none cursor-pointer">
            <span className="text-md font-extrabold text-[#1A56DB]">FilingBy</span>
            <span className="text-md font-extrabold text-[#F97316]">.com</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-[#1A56DB] text-white text-[8px] font-black uppercase tracking-wider">VO</span>
          </button>

          {/* Right Hamburger & Quick login */}
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <button onClick={() => goto(profile?.isPartner ? "/partner/dashboard" : "/virtual-office/dashboard")} className="text-xs font-bold text-white bg-[#1A56DB] rounded-full px-3.5 py-1.5 hover:bg-blue-700 transition-all border-none">
                Portal
              </button>
            ) : (
              <button onClick={() => goto("/login")} className="text-xs font-bold text-gray-700 border border-gray-300 rounded-full px-3.5 py-1.5 hover:border-[#1A56DB] transition-all bg-transparent">
                Login
              </button>
            )}

            {/* Hamburger button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 top-[88px] bg-black/20 z-[997] lg:hidden animate-fadeIn" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-[88px] left-0 right-0 bottom-0 bg-white z-[998] overflow-y-auto lg:hidden">
            <div className="px-4 py-3 space-y-1">
              
              {/* Dynamic categories accordion */}
              {navData.map((category) => (
                <div key={category.id} className="border-b border-gray-100">
                  <button
                    className="w-full flex items-center justify-between px-3 py-3.5 font-bold text-base text-gray-900 hover:text-[#1A56DB] transition-colors border-none bg-transparent cursor-pointer text-left"
                    onClick={() => setMobileOpenCategory(mobileOpenCategory === category.id ? null : category.id)}
                  >
                    <span>{category.label}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${mobileOpenCategory === category.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileOpenCategory === category.id && (
                    <div className="pb-3 bg-gray-50 rounded-xl mx-1 mb-2 px-3 pt-2">
                      {category.sections.map((section) => (
                        <div key={section.heading} className="mb-3">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 mt-2">
                            {section.heading}
                          </p>
                          {section.items.map((item) => (
                            <button
                              type="button"
                              onClick={() => {
                                if (item.slug.startsWith('/')) {
                                  goto(item.slug);
                                } else {
                                  goto(`/services/${item.slug}`);
                                }
                              }}
                              className="w-full text-left text-sm text-gray-800 font-medium hover:text-[#1A56DB] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Locations mobile link */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileOpenCategory(mobileOpenCategory === 'loc' ? null : 'loc')}
                  className="w-full flex items-center justify-between px-3 py-3.5 font-bold text-base text-gray-900 hover:text-[#1A56DB] transition-colors border-none bg-transparent cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">🏢 Locations</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${mobileOpenCategory === 'loc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileOpenCategory === 'loc' && (
                  <div className="pb-3 bg-gray-50 rounded-xl mx-1 mb-2 px-3 pt-2">
                    {menuCities.map(city => (
                      <button key={city.path} onClick={() => goto(city.path)}
                        className="w-full text-left text-sm text-gray-800 font-medium hover:text-[#1A56DB] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        {city.label}
                      </button>
                    ))}
                    <button onClick={() => goto("/locations")}
                      className="w-full text-left text-sm font-bold text-[#1A56DB] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                    >
                      All Locations →
                    </button>
                  </div>
                )}
              </div>

              {/* E-Commerce mobile link */}
              <div className="border-b border-gray-100">
                <button onClick={() => goto("/virtual-office-ecommerce")}
                  className="w-full flex items-center justify-between px-3 py-3.5 font-bold text-base text-gray-900 hover:bg-slate-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                >
                  <span className="flex items-center gap-2">🛍️ E-Commerce Sellers</span>
                  <ChevronRightIcon />
                </button>
              </div>

              {/* FAQs mobile link */}
              <div className="border-b border-gray-100">
                <button onClick={() => goto("/faq")}
                  className="w-full flex items-center justify-between px-3 py-3.5 font-bold text-base text-gray-900 hover:bg-slate-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                >
                  <span className="flex items-center gap-2">❓ FAQs</span>
                  <ChevronRightIcon />
                </button>
              </div>

              {/* Company mobile list */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileOpenCategory(mobileOpenCategory === 'comp' ? null : 'comp')}
                  className="w-full flex items-center justify-between px-3 py-3.5 font-bold text-base text-gray-900 hover:text-[#1A56DB] transition-colors border-none bg-transparent cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">👥 Company</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${mobileOpenCategory === 'comp' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileOpenCategory === 'comp' && (
                  <div className="pb-3 bg-gray-50 rounded-xl mx-1 mb-2 px-3 pt-2">
                    {companyLinks.map(item => (
                      <button key={item.path} onClick={() => goto(item.path)}
                        className="w-full text-left text-sm text-gray-800 font-medium hover:text-[#1A56DB] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Action Buttons */}
              <div className="pt-4 pb-6 space-y-3 mt-4 border-t border-gray-150">
                <button onClick={() => goto("/get-live-quote")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#F97316] rounded-xl hover:bg-orange-600 transition-colors shadow-md border-none cursor-pointer"
                >
                  Get Free Quote
                </button>
                <button onClick={() => goto("/")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#1A56DB] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Back to CA Site
                </button>
                {isSignedIn && (
                  <>
                    {profile?.isClient !== false && (
                      <button onClick={() => goto("/virtual-office/dashboard")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-950 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-none cursor-pointer"
                      >
                        🏠 Dashboard Overview
                      </button>
                    )}
                    {profile?.isPartner && (
                      <button onClick={() => goto("/partner/dashboard")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-950 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-none cursor-pointer"
                      >
                        🤝 Partner Dashboard
                      </button>
                    )}
                    <button onClick={() => signOut(() => navigate("/virtual-space"))}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors border-none cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </>
      )}

    </header>
  );
}
