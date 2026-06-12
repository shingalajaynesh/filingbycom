import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useAdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setServices(data.services);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const addService = async (serviceData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(serviceData),
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

  return { services, loading, error, refetch: fetchServices, addService, updateService, deleteService };
}
