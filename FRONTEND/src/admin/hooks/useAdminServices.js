import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { safeFetch } from "../../shared/utils/api";

export function useAdminServices(portal = "ca-portal") {
  const [services, setServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data1, data2] = await Promise.all([
        safeFetch(`/services?portal=${portal}`),
        safeFetch(`/admin/main-services?portal=${portal}`, { credentials: "include" })
      ]);
      
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
      const data = await safeFetch("/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...serviceData, portal }),
      });
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
      const data = await safeFetch(`/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(serviceData),
      });
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
      const data = await safeFetch(`/admin/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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
      const resData = await safeFetch("/admin/main-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, portal }),
      });
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
      const resData = await safeFetch(`/admin/main-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
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
      const data = await safeFetch(`/admin/main-services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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
