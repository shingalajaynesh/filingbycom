/**
 * HistoryTable.jsx
 * Displays the list of completed orders (read-only, no action buttons).
 * Uses the useAdminOrders hook with filter="history".
 */

import { useState } from "react";
import { useAdminOrders } from "../hooks/useAdminOrders";
import OrderCard from "./OrderCard";

export default function HistoryTable({ portal }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { orders, loading, error, refetch, deleteOrder } = useAdminOrders("history", portal);

  const filteredOrders = orders.filter((order) => {
    if (startDate) {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (orderDate < start) return false;
    }
    if (endDate) {
      const orderDate = new Date(order.createdAt);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (orderDate > end) return false;
    }

    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const name = `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.toLowerCase();
    const email = (order.user?.email || "").toLowerCase();
    const phone = (order.user?.phone || "").toLowerCase();
    const serviceName = (order.service?.name || "").toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower) || serviceName.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-red-655 font-medium">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
        </div>
        <p className="text-gray-900 font-semibold text-lg">No completed orders yet</p>
        <p className="text-gray-500 text-sm">Completed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Order History</h2>
          <p className="text-sm text-gray-500">{orders.length} completed orders</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-550 uppercase">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1A56DB] outline-none bg-slate-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-550 uppercase">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1A56DB] outline-none bg-slate-50"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-slate-50"
            />
          </div>
          <button
            onClick={refetch}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#1A56DB] border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {filteredOrders.length === 0 && (searchTerm || startDate || endDate) ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 font-medium">No completed orders matching the filter criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onUpdateStatus={() => {}}
              onUpdatePayment={() => {}}
              onDelete={deleteOrder}
              readOnly={true}
            />
          ))
        )}
      </div>
    </div>
  );
}
