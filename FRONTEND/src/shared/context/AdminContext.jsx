import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // State for admin data
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);

  // Fetch Orders
  const fetchOrders = useCallback(async (filter, portal) => {
    const endpoint = filter === "history"
      ? `/admin/orders/history?portal=${portal}`
      : `/admin/orders/active?portal=${portal}`;

    try {
      const res = await axios.get(`${API_BASE}${endpoint}`, { withCredentials: true });
      const data = res.data;
      if (filter === "history") {
        setHistoryOrders(data.orders);
      } else {
        setActiveOrders(data.orders);
      }
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch orders");
    }
  }, []);

  // Update Order Status
  const updateOrderStatus = useCallback(async (orderId, orderStatus) => {
    try {
      const res = await axios.patch(`${API_BASE}/admin/orders/${orderId}/status`, { orderStatus }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      // Optimistically update
      setActiveOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      setHistoryOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }, []);

  // Update Payment Status
  const updatePaymentStatus = useCallback(async (orderId, paymentStatus) => {
    try {
      const res = await axios.patch(`${API_BASE}/admin/orders/${orderId}/payment`, { paymentStatus }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      setActiveOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      setHistoryOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }, []);

  // Delete Order
  const deleteOrder = useCallback(async (orderId, reason) => {
    try {
      await axios.delete(`${API_BASE}/admin/orders/${orderId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        data: { reason },
      });
      setActiveOrders(prev => prev.filter(o => o._id !== orderId));
      setHistoryOrders(prev => prev.filter(o => o._id !== orderId));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }, []);

  // Fetch Services
  const fetchServicesData = useCallback(async (portal) => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`${API_BASE}/services?portal=${portal}`),
        axios.get(`${API_BASE}/admin/main-services?portal=${portal}`, { withCredentials: true })
      ]);
      const data1 = res1.data;
      const data2 = res2.data;
      
      setServices(data1.services || []);
      if (data2.success) {
        setMainServices(data2.mainServices || []);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch services");
    }
  }, []);

  // Add Service
  const addService = useCallback(async (serviceData, portal) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/services`, { ...serviceData, portal }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      setServices(prev => [data.service, ...prev]);
      toast.success("Service added successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to add service";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // Update Service
  const updateService = useCallback(async (id, serviceData) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/services/${id}`, serviceData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = res.data;
      setServices(prev => prev.map(s => s._id === id ? data.service : s));
      toast.success("Service updated successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update service";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // Delete Service
  const deleteService = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE}/admin/services/${id}`, {
        withCredentials: true,
      });
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success("Service deleted successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete service";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // Add Main Service
  const addMainService = useCallback(async (serviceData, portal) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/main-services`, { ...serviceData, portal }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const resData = res.data;
      setMainServices(prev => [...prev, resData.mainService].sort((a,b) => a.order - b.order));
      toast.success("Main service added successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to add main service";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // Update Main Service
  const updateMainService = useCallback(async (id, serviceData) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/main-services/${id}`, serviceData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const resData = res.data;
      setMainServices(prev => prev.map(s => s._id === id ? resData.mainService : s).sort((a,b) => a.order - b.order));
      toast.success("Main service updated successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update main service";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // Delete Main Service
  const deleteMainService = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE}/admin/main-services/${id}`, {
        withCredentials: true,
      });
      setMainServices(prev => prev.filter(s => s._id !== id));
      toast.success("Main service deleted successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete main service";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  return (
    <AdminContext.Provider value={{
      activeOrders,
      historyOrders,
      services,
      mainServices,
      fetchOrders,
      updateOrderStatus,
      updatePaymentStatus,
      deleteOrder,
      fetchServicesData,
      addService,
      updateService,
      deleteService,
      addMainService,
      updateMainService,
      deleteMainService
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used inside AdminProvider");
  return context;
}
