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
import LeadsTable from "../components/LeadsTable";
import PartnersTable from "../components/PartnersTable";
import AdminLocations from "../components/AdminLocations";
import AdminVirtualBookings from "../components/AdminVirtualBookings";
import AdminSettings from "../components/AdminSettings";
import AdminBlogs from "../components/AdminBlogs";
import AdminReviews from "../components/AdminReviews";

export default function AdminDashboard() {
  const [currentPortal, setCurrentPortal] = useState(() => {
    return localStorage.getItem("admin_current_portal") || "ca-portal";
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "orders";
  });

  const handlePortalChange = (portal) => {
    setCurrentPortal(portal);
    localStorage.setItem("admin_current_portal", portal);
    // Default to "orders" tab when switching portal to prevent showing invalid tabs
    setActiveTab("orders");
    localStorage.setItem("admin_active_tab", "orders");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("admin_active_tab", tab);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top navigation */}
      <AdminNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentPortal={currentPortal}
        onPortalChange={handlePortalChange}
      />

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 md:py-8">
        {/* Page heading */}
        <div className="mb-5 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {currentPortal === "ca-portal" ? "CA Portal — " : "Virtual Space Admin — "}
             {activeTab === "orders"
              ? "Current Orders"
              : activeTab === "history"
              ? "Order History"
              : activeTab === "leads"
              ? "Leads (Inquiries & Quotes)"
              : activeTab === "partners"
              ? "Partner Onboardings"
              : activeTab === "locations"
              ? "Manage Virtual Office Locations"
              : activeTab === "nav-services"
              ? "Manage Navigation Services"
              : activeTab === "popular-services"
              ? "Manage Popular Services"
              : activeTab === "blogs"
              ? "Manage Blogs & Knowledge Base"
              : activeTab === "reviews"
              ? "Manage Reviews & Testimonials"
              : activeTab === "settings"
              ? "Portal Settings"
              : "Portal Settings"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeTab === "orders"
              ? "Manage active orders — update status and payment"
              : activeTab === "history"
              ? "Browse past completed orders"
              : activeTab === "leads"
              ? "Track landing page consultation requests and live calculator quotes in one place"
              : activeTab === "partners"
              ? "Verify and onboard commercial workspaces"
              : activeTab === "locations"
              ? "Configure cities, states, workspaces, map pins, pricing, and FAQ items dynamically"
              : activeTab === "nav-services"
              ? "Manage services that appear in the navigation bar dropdowns"
              : activeTab === "popular-services"
              ? "Manage services that appear on the homepage Popular Services section"
              : activeTab === "blogs"
              ? "Write, edit, publish, and delete compliance articles to build topical authority"
              : activeTab === "reviews"
              ? "Publish, edit, approve, and delete customer reviews for homepage and service pages"
              : activeTab === "settings"
              ? "Manage configuration fields and text components dynamically"
              : "Manage configuration fields and text components dynamically"}
          </p>
        </div>

        {/* Tab content */}
        {activeTab === "orders" && (
          currentPortal === "virtual-space" ? (
            <AdminVirtualBookings />
          ) : (
            <OrdersTable portal={currentPortal} />
          )
        )}
        {activeTab === "history" && <HistoryTable portal={currentPortal} />}
        {activeTab === "leads" && <LeadsTable />}
        {activeTab === "partners" && <PartnersTable />}
        {activeTab === "locations" && <AdminLocations />}
        {activeTab === "nav-services" && <AdminServices portal={currentPortal} type="nav" />}
        {activeTab === "popular-services" && <AdminServices portal={currentPortal} type="popular" />}
        {activeTab === "blogs" && <AdminBlogs />}
        {activeTab === "reviews" && <AdminReviews portal={currentPortal} />}
        {activeTab === "settings" && <AdminSettings portal={currentPortal} />}
      </main>
    </div>
  );
}
