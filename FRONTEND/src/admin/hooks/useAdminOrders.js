/**
 * useAdminOrders.js
 * Custom hook to fetch orders and perform status/payment updates.
 * All API calls include the admin token from AdminAuthContext.
 */

import { useState, useEffect, useCallback } from "react";
import { safeFetch } from "../../shared/utils/api";

export function useAdminOrders(filter = "active", portal = "ca-portal") {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const endpoint =
    filter === "history"
      ? `/admin/orders/history?portal=${portal}`
      : `/admin/orders/active?portal=${portal}`;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch(endpoint, {
        credentials: "include",
      });
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
        const data = await safeFetch(`/admin/orders/${orderId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ orderStatus }),
        });

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
        const data = await safeFetch(`/admin/orders/${orderId}/payment`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ paymentStatus }),
        });

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

  // Soft delete order
  const deleteOrder = useCallback(
    async (orderId, reason) => {
      try {
        const data = await safeFetch(`/admin/orders/${orderId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason }),
        });

        // Optimistically remove the deleted order from the state
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    []
  );

  return { orders, loading, error, refetch: fetchOrders, updateOrderStatus, updatePaymentStatus, deleteOrder };
}
