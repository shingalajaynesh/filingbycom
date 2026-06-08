import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navData } from '../data/navigation.js';

export default function Navigation() {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center rounded-xl bg-blue-50 px-3 py-1.5">
              <span className="text-xl font-bold text-[#1A56DB]">FilingBy</span>
              <span className="text-xl font-bold text-[#F97316]">.com</span>
            </a>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <ul className="m-0 flex list-none items-center p-0">
              {navData.map((category) => (
                <li
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setOpen(category.id)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <button
                    className={`flex items-center gap-1 rounded-full px-2.5 py-2 text-[11.5px] font-medium whitespace-nowrap transition-all duration-150 ${open === category.id ? 'bg-blue-50 text-[#1A56DB]' : 'text-gray-600 hover:bg-blue-50 hover:text-[#1A56DB]'}`}
                  >
                    {category.label}
                    <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {open === category.id && (
                    <div className="absolute left-1/2 top-full z-[999] -translate-x-1/2" style={{ paddingTop: '4px' }}>
                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl" style={{ minWidth: '480px', maxWidth: '700px' }}>
                        <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${Math.min(category.sections.length, 3)}, 1fr)` }}>
                          {category.sections.map((section) => (
                            <div key={section.heading}>
                              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{section.heading}</p>
                              <ul className="space-y-0.5">
                                {section.items.map((item) => (
                                  <li key={item.slug}>
                                    <button
                                      onClick={() => {
                                        navigate(`/services/${item.slug}`);
                                        setOpen(null);
                                      }}
                                      className="w-full rounded-lg px-2 py-1.5 text-left text-[12px] text-gray-600 transition-colors duration-100 hover:bg-blue-50 hover:text-[#1A56DB]"
                                    >
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

          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="hidden rounded-full border border-gray-300 px-4 py-1.5 text-[12px] font-medium text-gray-700 transition-all hover:border-blue-500 hover:text-blue-600 lg:block"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hidden rounded-full bg-[#1A56DB] px-4 py-1.5 text-[12px] font-medium text-white transition-all hover:bg-blue-700 lg:block whitespace-nowrap"
            >
              Get Started
            </button>

            <button
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-[998] overflow-y-auto bg-white lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navData.map((category) => (
              <div key={category.id} className="border-b border-gray-100">
                <button
                  className="flex w-full items-center justify-between px-3 py-3 font-semibold text-gray-800 hover:text-blue-600"
                  onClick={() => setMobileOpenCategory(mobileOpenCategory === category.id ? null : category.id)}
                >
                  <span>{category.icon} {category.label}</span>
                  <svg className={`h-4 w-4 transition-transform ${mobileOpenCategory === category.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileOpenCategory === category.id && (
                  <div className="space-y-1 pb-3">
                    {category.sections.map((section) => (
                      <div key={section.heading} className="px-3">
                        <p className="mt-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{section.heading}</p>
                        {section.items.map((item) => (
                          <button
                            key={item.slug}
                            onClick={() => {
                              navigate(`/services/${item.slug}`);
                              setMobileOpen(false);
                              setMobileOpenCategory(null);
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-4 pb-8">
              <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-medium">Login</button>
              <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="flex-1 rounded-full bg-[#1A56DB] py-2.5 text-sm font-medium text-white">Get Started</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

