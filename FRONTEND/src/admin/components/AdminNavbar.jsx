import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminNavbar({ activeTab, onTabChange, currentPortal, onPortalChange }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.portal-dropdown-wrapper')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin", { replace: true });
  };

  const tabs = currentPortal === "ca-portal"
    ? [
        { id: "orders", label: "Orders" },
        { id: "history", label: "History" },
        { id: "nav-services", label: "Navigation Services" },
        { id: "popular-services", label: "Popular Services" },
        { id: "settings", label: "Settings" },
      ]
    : [
        { id: "orders", label: "Orders" },
        { id: "inquiries", label: "Inquiries" },
        { id: "partners", label: "Partners" },
        { id: "quotes", label: "Quotes" },
        { id: "locations", label: "Locations" },
        { id: "nav-services", label: "Navigation Services" },
        { id: "popular-services", label: "Popular Services" },
        { id: "settings", label: "Settings" },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="bg-[#1A56DB] py-1.5">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-center">
          <p className="text-white text-xs font-medium tracking-wide">
            Admin Control Panel &nbsp;·&nbsp; FilingBy.com
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center rounded-md px-2 py-1.5 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <span className="text-xl font-extrabold text-[#1A56DB]">FilingBy</span>
            <span className="text-xl font-extrabold text-[#F97316]">.com</span>
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline-flex items-center px-2 py-1 rounded text-[#1A56DB] bg-blue-50 text-xs font-bold tracking-wider mr-2 border border-blue-100">
              ADMIN
            </span>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#1A56DB] text-white"
                    : "text-gray-650 hover:text-[#1A56DB] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Portal Switch Dropdown */}
            <div className="relative portal-dropdown-wrapper">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{currentPortal === "ca-portal" ? "💼 CA Portal" : "🏢 Virtual Space"}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[999]">
                  <button
                    onClick={() => {
                      onPortalChange("ca-portal");
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm text-left font-bold ${
                      currentPortal === "ca-portal"
                        ? "bg-blue-50 text-[#1A56DB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    💼 CA Portal
                  </button>
                  <button
                    onClick={() => {
                      onPortalChange("virtual-space");
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm text-left font-bold ${
                      currentPortal === "virtual-space"
                        ? "bg-blue-50 text-[#1A56DB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    🏢 Virtual Space Admin
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-1.5 rounded-md text-sm font-semibold text-gray-650 hover:text-red-650 hover:bg-red-50 border border-transparent transition-colors flex-shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
