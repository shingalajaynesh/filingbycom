/**
 * AdminNavbar.jsx
 * Top navigation bar for the admin panel.
 * Contains the FilingBy.com logo, tab navigation (Orders / History), and logout.
 */

import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminNavbar({ activeTab, onTabChange }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin", { replace: true });
  };

  const tabs = [
    { id: "orders", label: "Orders" },
    { id: "history", label: "History" },
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
                    : "text-gray-600 hover:text-[#1A56DB] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-1.5 rounded-md text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent transition-colors flex-shrink-0"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
