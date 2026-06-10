import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navData } from '../data/navigation';

export default function Navigation() {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = location.pathname.startsWith('/dashboard');

  const dummyUser = {
    name: "Rajesh Kumar",
    initials: "RK",
    email: "rajesh@example.com",
    business: "Rajesh Enterprises",
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.profile-dropdown-wrapper')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Mega menu edge detection style logic
  const getMegaMenuStyle = (index) => {
    if (index <= 1) {
      return { left: '0', right: 'auto', transform: 'none' };
    }
    if (index >= navData.length - 2) {
      return { left: 'auto', right: '0', transform: 'none' };
    }
    return { left: '50%', transform: 'translateX(-50%)' };
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#1A56DB] to-[#0a1628] py-1.5 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-center">
          <p className="text-white text-[11px] font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis">
            🎉 Get 15% OFF | Code: <span className="font-extrabold underline">FILING15</span>
          </p>
        </div>
      </div>

      {/* Nav container — FULL WIDTH layout */}
      <div className="w-full px-4 sm:px-6 min-[1500px]:px-8">

        {/* DESKTOP ROW (1500px and above) */}
        <div className="hidden min-[1500px]:flex items-center h-14 w-full gap-4">

          {/* COL 1: Logo — fixed LEFT, never moves */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center bg-blue-50 rounded-xl px-3 py-1.5 hover:bg-blue-100 transition-colors">
              <span className="text-xl font-extrabold text-[#1A56DB]">FilingBy</span>
              <span className="text-xl font-extrabold text-[#F97316]">.com</span>
            </a>
          </div>

          {/* COL 2: Nav Items — CENTERED, takes all remaining space */}
          <nav className="hidden min-[1500px]:flex flex-1 items-center justify-center overflow-visible">
            <ul className="flex items-center list-none m-0 p-0 flex-nowrap gap-0.5">
              {navData.map((category, index) => (
                <li
                  key={category.id}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setOpen(category.id)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer text-[11.5px] font-bold ${open === category.id
                      ? 'text-[#1A56DB] bg-blue-50'
                      : 'text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50'
                      }`}
                  >
                    {category.label}
                    <svg className="w-3 h-3 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mega Menu Dropdown — invisible bridge */}
                  {open === category.id && (
                    <div
                      className="absolute top-full z-[999]"
                      style={{
                        ...getMegaMenuStyle(index),
                        paddingTop: '4px',
                      }}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5" style={{ minWidth: '420px', maxWidth: '680px' }}>
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(category.sections.length, 3)}, 1fr)` }}>
                          {category.sections.map((section) => (
                            <div key={section.heading}>
                              <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-2 px-2">
                                {section.heading}
                              </p>
                              <ul className="space-y-0.5">
                                {section.items.map((item) => (
                                  <li key={item.slug}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigate(`/services/${item.slug}`);
                                        setOpen(null);
                                        setMobileOpen(false);
                                        setMobileOpenCategory(null);
                                      }}
                                      className="w-full text-left text-[12px] text-gray-800 font-medium hover:text-[#1A56DB] hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 group cursor-pointer z-[1000]"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 group-hover:bg-[#1A56DB] transition-colors" />
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
            </ul>
          </nav>

          {/* COL 3: Right side profile or login — fixed RIGHT, never moves */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* New Order */}
                <button
                  onClick={() => navigate('/services/gst-registration')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-[#F97316] rounded-full px-3.5 py-1.5 hover:bg-orange-500 transition-all whitespace-nowrap hover:shadow-lg hover:shadow-orange-200 active:scale-95"
                >
                  + New Order
                </button>

                {/* Profile dropdown container */}
                <div
                  className="relative profile-dropdown-wrapper"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-full hover:bg-gray-50 pl-1 pr-2 py-1 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A56DB] to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                      {dummyUser.initials}
                    </div>
                    <span className="text-xs font-semibold text-gray-900 max-w-[80px] truncate">
                      {dummyUser.name.split(' ')[0]}
                    </span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full z-[999]" style={{ paddingTop: '6px' }}>
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-56">
                        <div className="bg-gradient-to-br from-[#0a1628] to-[#1A56DB] p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                              {dummyUser.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-bold text-sm truncate">
                                {dummyUser.name}
                              </p>
                              <p className="text-blue-200 text-[10px] truncate">
                                {dummyUser.business}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          {[
                            { icon: "🏠", label: "Dashboard", tab: "overview" },
                            { icon: "📋", label: "My Orders", tab: "orders" },
                            { icon: "🎧", label: "Support", tab: "support" },
                            { icon: "👤", label: "My Profile", tab: "profile" },
                            { icon: "🎁", label: "Refer & Earn", tab: "referral" },
                          ].map((item) => (
                            <button
                              key={item.tab}
                              onClick={() => {
                                navigate('/dashboard', { state: { tab: item.tab } });
                                setProfileOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-900 hover:text-[#1A56DB] hover:bg-blue-50 rounded-xl transition-colors text-left"
                            >
                              <span className="text-base">{item.icon}</span>
                              {item.label}
                            </button>
                          ))}

                          <div className="border-t border-gray-100 my-1.5" />

                          <button
                            onClick={() => {
                              navigate('/');
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-650 hover:text-red-705 hover:bg-red-50 rounded-xl transition-colors text-left"
                          >
                            <span className="text-base">🚪</span>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[11px] font-bold text-gray-900 border border-gray-300 rounded-full px-3.5 py-1.5 hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-[11px] font-bold text-white bg-[#1A56DB] rounded-full px-3.5 py-1.5 hover:bg-blue-700 transition-all whitespace-nowrap hover:shadow-lg hover:shadow-blue-200"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>

        {/* MOBILE ROW (below 1500px) */}
        <div className="flex min-[1500px]:hidden items-center justify-between h-14 w-full px-4">

          {/* LEFT: Logo */}
          <a href="/" className="flex items-center bg-blue-50 rounded-xl px-3 py-1.5">
            <span className="text-lg font-bold text-[#1A56DB]">FilingBy</span>
            <span className="text-lg font-bold text-[#F97316]">.com</span>
          </a>

          {/* RIGHT: Profile + Hamburger */}
          <div className="flex items-center gap-2">

            {/* Show avatar if logged in */}
            {isLoggedIn && (
              <div className="relative profile-dropdown-wrapper">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A56DB] to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md"
                >
                  {dummyUser.initials}
                </button>

                {/* Mobile profile dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999]">
                    {/* User header */}
                    <div className="bg-gradient-to-br from-[#0a1628] to-[#1A56DB] p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 flex-shrink-0">
                          {dummyUser.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">
                            {dummyUser.name}
                          </p>
                          <p className="text-blue-200 text-[10px] truncate">
                            {dummyUser.business}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown links */}
                    <div className="p-2">
                      {[
                        { icon: "🏠", label: "Dashboard", tab: "overview" },
                        { icon: "📋", label: "My Orders", tab: "orders" },
                        { icon: "🎧", label: "Support", tab: "support" },
                        { icon: "👤", label: "My Profile", tab: "profile" },
                        { icon: "🎁", label: "Refer & Earn", tab: "referral" },
                      ].map((item) => (
                        <button
                          key={item.tab}
                          onClick={() => {
                            navigate('/dashboard', { state: { tab: item.tab } });
                            setProfileOpen(false);
                            setMobileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1A56DB] hover:bg-blue-50 rounded-xl transition-colors text-left"
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => {
                          navigate('/');
                          setProfileOpen(false);
                          setMobileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:text-red-655 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <span>🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show Login button if NOT logged in on mobile */}
            {!isLoggedIn && (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold text-white bg-[#1A56DB] rounded-full px-4 py-2 hover:bg-blue-700 transition-all active:scale-95"
              >
                Login
              </button>
            )}

            {/* Hamburger — always visible on mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
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
          {/* Backdrop */}
          <div className="fixed inset-0 top-[88px] bg-black/20 z-[997] min-[1500px]:hidden" onClick={() => setMobileOpen(false)} />

          {/* Menu panel */}
          <div className="fixed top-[88px] left-0 right-0 bottom-0 bg-white z-[998] overflow-y-auto min-[1500px]:hidden">
            <div className="px-4 py-3 space-y-1">
              {navData.map((category) => (
                <div key={category.id} className="border-b border-gray-100">
                  <button
                    className="w-full flex items-center justify-between px-3 py-3.5 font-bold text-base text-gray-900 hover:text-[#1A56DB] transition-colors"
                    onClick={() => setMobileOpenCategory(mobileOpenCategory === category.id ? null : category.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </span>
                    <svg className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${mobileOpenCategory === category.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileOpenCategory === category.id && (
                    <div className="pb-3 bg-gray-50 rounded-xl mx-1 mb-2 px-3 pt-2">
                      {category.sections.map((section) => (
                        <div key={section.heading} className="mb-3">
                          <p className="text-[10px] font-bold text-gray-750 uppercase tracking-widest mb-1.5 mt-2">
                            {section.heading}
                          </p>
                          {section.items.map((item) => (
                            <button
                              type="button"
                              onClick={() => {
                                navigate(`/services/${item.slug}`);
                                setMobileOpen(false);
                                setMobileOpenCategory(null);
                              }}
                              className="w-full text-left text-sm text-gray-800 font-medium hover:text-[#1A56DB] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 min-h-[44px]"
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

              {isLoggedIn && (
                <div className="pt-4 pb-6 space-y-3 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => {
                      navigate('/services/gst-registration');
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#F97316] rounded-xl hover:bg-orange-600 transition-colors shadow-md active:scale-95 cursor-pointer"
                  >
                    + New Order
                  </button>
                  <button
                    onClick={() => {
                      navigate('/');
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded-xl transition-colors active:scale-95 cursor-pointer"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
