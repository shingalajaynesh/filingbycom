/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const SharedDataContext = createContext(null);

export function SharedDataProvider({ children }) {
  const [services, setServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchSharedData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
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
        setServices(servicesData.services || []);
        setMainServices(mainServicesData.mainServices || []);
        setSettings(settingsData.settings || {});
        setLocations(locationsData.locations || []);
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
