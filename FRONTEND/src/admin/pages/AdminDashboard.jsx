/**
 * AdminDashboard.jsx
 * Main admin panel layout.
 * Controls the active tab (orders / history) and renders the appropriate table.
 */

import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import OrdersTable from "../components/OrdersTable";
import HistoryTable from "../components/HistoryTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top navigation */}
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "orders" ? "Current Orders" : "Order History"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "orders"
              ? "Manage active orders — update status and payment"
              : "Browse past completed orders"}
          </p>
        </div>

        {/* Tab content */}
        {activeTab === "orders" ? <OrdersTable /> : <HistoryTable />}
      </main>
    </div>
  );
}
