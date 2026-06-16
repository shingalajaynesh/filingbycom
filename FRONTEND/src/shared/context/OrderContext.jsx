import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!isSignedIn) return;
    setOrdersLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      const data = res.data;

      if (data.success) {
        const mappedOrders = data.orders.map(o => ({
          id: o._id,
          service: o.service?.name || "Unknown Service",
          category: o.service?.tag || "Service",
          status: o.orderStatus === "Pending" ? "pending-docs" : o.orderStatus === "Complete" ? "completed" : "in-progress",
          amount: o.amount,
          date: new Date(o.createdAt).toISOString().split('T')[0],
          assignedTo: "Processing Team",
          progress: o.orderStatus === "Pending" ? 20 : o.orderStatus === "Complete" ? 100 : 60,
          paymentType: o.paymentType,
          paymentStatus: o.paymentStatus,
          invoiceNumber: o.invoiceNumber,
          invoiceDate: o.invoiceDate,
          steps: [
            { label: "Order Placed", done: true, date: new Date(o.createdAt).toLocaleDateString() },
            { label: "Documents Received", done: o.orderStatus !== "Pending", date: null },
            { label: "Processing", done: o.orderStatus !== "Pending", date: null },
            { label: "Certificate Delivered", done: o.orderStatus === "Complete", date: null },
          ]
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      fetchOrders();
    }
  }, [isSignedIn, fetchOrders]);

  const fetchOrderById = useCallback(async (orderId) => {
    try {
      const token = await getToken();
      if (!token) return null;
      const res = await axios.get(`${API_BASE}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      const data = res.data;
      if (data.success) {
        return data.order;
      }
      return null;
    } catch (err) {
      console.error(`Failed to fetch order ${orderId}:`, err);
      return null;
    }
  }, [getToken]);

  const createRazorpayOrder = useCallback(async (serviceId) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.post(`${API_BASE}/orders/razorpay`, { serviceId }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      const data = res.data;
      if (!data.success) throw new Error(data.message || "Failed to create order");
      return data.order;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create order";
      throw new Error(errorMessage);
    }
  }, [getToken]);

  const verifyPayment = useCallback(async (paymentDetails) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.post(`${API_BASE}/orders/verify`, paymentDetails, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      const data = res.data;
      if (!data.success) throw new Error(data.message || "Payment verification failed");
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Payment verification failed";
      throw new Error(errorMessage);
    }
  }, [getToken]);

  const createCashOrder = useCallback(async (serviceId) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.post(`${API_BASE}/orders/cash`, { serviceId }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      const data = res.data;
      if (!data.success) throw new Error(data.message || "Failed to create cash order");
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create cash order";
      throw new Error(errorMessage);
    }
  }, [getToken]);

  const cancelOrder = useCallback(async (orderId, reason) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.delete(`${API_BASE}/orders/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
        data: { reason }
      });
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to cancel order";
      throw new Error(errorMessage);
    }
  }, [getToken]);

  // --- Virtual Space Orders ---
  const fetchVirtualOrders = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.get(`${API_BASE}/virtual-space/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch virtual orders");
    }
  }, [getToken]);

  const createVirtualOrder = useCallback(async (payload) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/orders`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to create virtual order");
    }
  }, [getToken]);

  const fetchVirtualOrderById = useCallback(async (orderId) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.get(`${API_BASE}/virtual-space/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch virtual order");
    }
  }, [getToken]);

  const uploadVirtualDocuments = useCallback(async (orderId, formData) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/orders/${orderId}/documents`, formData, {
        headers: { Authorization: `Bearer ${token}` }, // don't set content-type for FormData
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to upload documents");
    }
  }, [getToken]);

  const cancelVirtualOrder = useCallback(async (orderId, reason) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication required");
    try {
      const res = await axios.delete(`${API_BASE}/virtual-space/orders/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
        data: { reason }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to cancel virtual order");
    }
  }, [getToken]);

  return (
    <OrderContext.Provider value={{ 
      orders, 
      ordersLoading, 
      fetchOrders, 
      fetchOrderById,
      createRazorpayOrder,
      verifyPayment,
      createCashOrder,
      cancelOrder,
      fetchVirtualOrders,
      createVirtualOrder,
      fetchVirtualOrderById,
      uploadVirtualDocuments,
      cancelVirtualOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrderContext must be used inside OrderProvider");
  return context;
}
