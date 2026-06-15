/**
 * AdminDashboard.jsx
 * Main admin panel layout.
 * Controls the active tab (orders / history) and renders the appropriate table.
 */

import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import OrdersTable from "../components/OrdersTable";
import HistoryTable from "../components/HistoryTable";
import AdminServices from "../components/AdminServices";
import InquiriesTable from "../components/InquiriesTable";
import PartnersTable from "../components/PartnersTable";
import QuotesTable from "../components/QuotesTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [currentPortal, setCurrentPortal] = useState("ca-portal");

  const handlePortalChange = (portal) => {
    setCurrentPortal(portal);
    setActiveTab("orders"); // Reset tab to prevent showing invalid tabs (e.g. history)
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top navigation */}
      <AdminNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentPortal={currentPortal}
        onPortalChange={handlePortalChange}
      />

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentPortal === "ca-portal" ? "CA Portal — " : "Virtual Space Admin — "}
            {activeTab === "orders"
              ? "Current Orders"
              : activeTab === "history"
              ? "Order History"
              : activeTab === "inquiries"
              ? "General Inquiries"
              : activeTab === "partners"
              ? "Partner Onboardings"
              : activeTab === "quotes"
              ? "Live Quote Leads"
              : "Manage Services"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "orders"
              ? "Manage active orders — update status and payment"
              : activeTab === "history"
              ? "Browse past completed orders"
              : activeTab === "inquiries"
              ? "Track landing page consultation requests"
              : activeTab === "partners"
              ? "Verify and onboard commercial workspaces"
              : activeTab === "quotes"
              ? "Inspect live quote calculator lead estimations"
              : "Manage services available on the homepage"}
          </p>
        </div>

        {/* Tab content */}
        {activeTab === "orders" && <OrdersTable portal={currentPortal} />}
        {activeTab === "history" && <HistoryTable portal={currentPortal} />}
        {activeTab === "inquiries" && <InquiriesTable />}
        {activeTab === "partners" && <PartnersTable />}
        {activeTab === "quotes" && <QuotesTable />}
        {activeTab === "services" && <AdminServices portal={currentPortal} />}
      </main>
    </div>
  );
}
