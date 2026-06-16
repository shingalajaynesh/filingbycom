/**
 * useAdminOrders.js
 * Custom hook to fetch orders and perform status/payment updates.
 * Wraps AdminContext to provide local loading state and component-level API.
 */

import { useState, useEffect, useCallback } from "react";
import { useAdminContext } from "../../shared/context/AdminContext";

export function useAdminOrders(filter = "active", portal = "ca-portal") {
  const { 
    activeOrders, 
    historyOrders, 
    fetchOrders: contextFetchOrders, 
    updateOrderStatus, 
    updatePaymentStatus, 
    deleteOrder 
  } = useAdminContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await contextFetchOrders(filter, portal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, portal, contextFetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const orders = filter === "history" ? historyOrders : activeOrders;

  return { 
    orders, 
    loading, 
    error, 
    refetch: fetchOrders, 
    updateOrderStatus, 
    updatePaymentStatus, 
    deleteOrder 
  };
}
