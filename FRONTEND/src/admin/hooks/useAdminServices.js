import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function useAdminServices(portal = "ca-portal") {
  const [services, setServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res1, res2] = await Promise.all([
        fetch(`${API_BASE}/services?portal=${portal}`),
        fetch(`${API_BASE}/admin/main-services?portal=${portal}`, { credentials: "include" }) // Assuming it's protected or make a public route if needed
      ]);
      const data1 = await res1.json();
      const data2 = await res2.json();
      
      if (!data1.success) throw new Error(data1.message);
      setServices(data1.services);

      if (data2.success) {
        setMainServices(data2.mainServices);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [portal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addService = async (serviceData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...serviceData, portal }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setServices((prev) => [data.service, ...prev]);
      toast.success("Service added successfully");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to add service");
      return { success: false, message: err.message };
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(serviceData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setServices((prev) => prev.map((s) => (s._id === id ? data.service : s)));
      toast.success("Service updated successfully");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to update service");
      return { success: false, message: err.message };
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted successfully");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to delete service");
      return { success: false, message: err.message };
    }
  };

  const addMainService = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/admin/main-services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, portal }),
      });
      const resData = await res.json();
      if (!resData.success) throw new Error(resData.message);
      setMainServices((prev) => [...prev, resData.mainService].sort((a,b) => a.order - b.order));
      toast.success("Main service added successfully");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to add main service");
      return { success: false, message: err.message };
    }
  };

  const updateMainService = async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/admin/main-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!resData.success) throw new Error(resData.message);
      setMainServices((prev) => prev.map((s) => (s._id === id ? resData.mainService : s)).sort((a,b) => a.order - b.order));
      toast.success("Main service updated successfully");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to update main service");
      return { success: false, message: err.message };
    }
  };

  const deleteMainService = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/main-services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setMainServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Main service deleted successfully");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to delete main service");
      return { success: false, message: err.message };
    }
  };

  return { 
    services, 
    mainServices,
    loading, 
    error, 
    refetch: fetchData, 
    addService, 
    updateService, 
    deleteService,
    addMainService,
    updateMainService,
    deleteMainService
  };
}
