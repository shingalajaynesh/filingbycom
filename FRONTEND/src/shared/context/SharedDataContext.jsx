/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { updateSchemaSettings } from "../seo/schemas";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const SharedDataContext = createContext(null);

export function SharedDataProvider({ children }) {
  const [services, setServices] = useState(() => {
    try {
      const cached = localStorage.getItem("shared_services");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  
  const [mainServices, setMainServices] = useState(() => {
    try {
      const cached = localStorage.getItem("shared_mainServices");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem("shared_settings");
      const parsed = cached ? JSON.parse(cached) : {};
      updateSchemaSettings(parsed);
      return parsed;
    } catch {
      return {};
    }
  });
  
  const [locations, setLocations] = useState(() => {
    try {
      const cached = localStorage.getItem("shared_locations");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem("shared_services");
    } catch {
      return true;
    }
  });

  const [isInitialized, setIsInitialized] = useState(() => {
    try {
      return !!localStorage.getItem("shared_services");
    } catch {
      return false;
    }
  });

  const fetchSharedData = useCallback(async (silent = false) => {
    let hasCache = false;
    try {
      hasCache = !!localStorage.getItem("shared_services");
    } catch {
      // Cache reading failed, default to false
    }

    if (!silent && !hasCache) setLoading(true);
    try {
      const [servicesRes, mainServicesRes, settingsRes, locationsRes] = await Promise.all([
        axios.get(`${API_BASE}/services`).catch(() => ({ data: { services: [] } })),
        axios.get(`${API_BASE}/main-services`).catch(() => ({ data: { mainServices: [] } })),
        axios.get(`${API_BASE}/settings`).catch(() => ({ data: { success: true, settings: {} } })),
        axios.get(`${API_BASE}/virtual-space/locations`).catch(() => ({ data: { success: true, locations: [] } }))
      ]);

      const servicesData = servicesRes.data;
      const mainServicesData = mainServicesRes.data;
      const settingsData = settingsRes.data;
      const locationsData = locationsRes.data;

      if (servicesData.success !== false && mainServicesData.success !== false) {
        const freshServices = servicesData.services || [];
        const freshMainServices = mainServicesData.mainServices || [];
        const freshSettings = settingsData.settings || {};
        const freshLocations = locationsData.locations || [];

        setServices(freshServices);
        setMainServices(freshMainServices);
        setSettings(freshSettings);
        setLocations(freshLocations);
        
        // Update SEO schemas dynamically
        updateSchemaSettings(freshSettings);
        
        try {
          localStorage.setItem("shared_services", JSON.stringify(freshServices));
          localStorage.setItem("shared_mainServices", JSON.stringify(freshMainServices));
          localStorage.setItem("shared_settings", JSON.stringify(freshSettings));
          localStorage.setItem("shared_locations", JSON.stringify(freshLocations));
        } catch (e) {
          console.warn("Failed to write to localStorage:", e);
        }

        setIsInitialized(true);
      }
    } catch (err) {
      console.error("Failed to fetch shared data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSharedData();
  }, [fetchSharedData]);

  const refresh = useCallback(() => {
    return fetchSharedData(true);
  }, [fetchSharedData]);

  const submitInquiry = useCallback(async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/inquiries`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit inquiry");
    }
  }, []);

  const submitPartnerApplication = useCallback(async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/partner-onboarding`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit application");
    }
  }, []);

  const submitQuoteLead = useCallback(async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/quotes`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit quote");
    }
  }, []);



  return (
    <SharedDataContext.Provider value={{ 
      services, 
      mainServices, 
      settings,
      locations, 
      loading, 
      isInitialized,
      refresh,
      submitInquiry,
      submitPartnerApplication,
      submitQuoteLead
    }}>
      {children}
    </SharedDataContext.Provider>
  );
}

export function useSharedData() {
  const context = useContext(SharedDataContext);
  if (!context) throw new Error("useSharedData must be used within SharedDataProvider");
  return context;
}
