/**
 * useAdminOrders.js
 * Custom hook to fetch orders and perform status/payment updates.
 * All API calls include the admin token from AdminAuthContext.
 */

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function useAdminOrders(filter = "active") {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const endpoint =
    filter === "history"
      ? `${API_BASE}/admin/orders/history`
      : `${API_BASE}/admin/orders/active`;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status (Pending / Document Verification / Complete)
  const updateOrderStatus = useCallback(
    async (orderId, orderStatus) => {
      try {
        const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ orderStatus }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        // Optimistically update the local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.order : o))
        );
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    []
  );

  // Update payment status (Paid / Unpaid)
  const updatePaymentStatus = useCallback(
    async (orderId, paymentStatus) => {
      try {
        const res = await fetch(`${API_BASE}/admin/orders/${orderId}/payment`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ paymentStatus }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.order : o))
        );
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    []
  );

  return { orders, loading, error, refetch: fetchOrders, updateOrderStatus, updatePaymentStatus };
}
