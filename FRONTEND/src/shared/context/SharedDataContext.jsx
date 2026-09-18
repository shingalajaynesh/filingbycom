/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { updateSchemaSettings } from "../seo/schemas";
import { FALLBACK_SERVICES } from "../../features/ca-portal/data/fallbackServices.js";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const SharedDataContext = createContext(null);

let globalFetchPromise = null;

export function SharedDataProvider({ children }) {
  const [services, setServices] = useState(() => {
    try {
      const cached = localStorage.getItem("shared_services");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
        // Legacy empty cache detected - purge immediately
        localStorage.removeItem("shared_services");
      }
      return FALLBACK_SERVICES;
    } catch {
      try { localStorage.removeItem("shared_services"); } catch {}
      return FALLBACK_SERVICES;
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

  const [semiServices, setSemiServices] = useState(() => {
    try {
      const cached = localStorage.getItem("shared_semiServices");
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
      const cached = localStorage.getItem("shared_services");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return false;
      }
      return false; // Fallback services are immediately available!
    } catch {
      return false;
    }
  });

  const [isInitialized, setIsInitialized] = useState(true);

  const fetchSharedData = useCallback(async (silent = false) => {
    if (globalFetchPromise) {
      return globalFetchPromise;
    }

    if (!silent) setLoading(false); // Do not blank the screen because fallback is available

    globalFetchPromise = (async () => {
      try {
        const [servicesRes, mainServicesRes, semiServicesRes, settingsRes, locationsRes] = await Promise.all([
          axios.get(`${API_BASE}/services`).catch((err) => {
            console.warn("API /services call failed, retaining fallback/cached services:", err.message);
            return null;
          }),
          axios.get(`${API_BASE}/main-services`).catch(() => null),
          axios.get(`${API_BASE}/semi-services`).catch(() => null),
          axios.get(`${API_BASE}/settings`).catch(() => null),
          axios.get(`${API_BASE}/virtual-space/locations`).catch(() => null)
        ]);

        // 1. Process Services: Only replace if valid non-empty array returned
        if (servicesRes?.data?.success !== false && Array.isArray(servicesRes?.data?.services) && servicesRes.data.services.length > 0) {
          const freshServices = servicesRes.data.services;
          setServices(freshServices);
          try {
            localStorage.setItem("shared_services", JSON.stringify(freshServices));
          } catch (e) {
            console.warn("Failed to write shared_services to localStorage:", e);
          }
        } else {
          // If API failed, timed out, or returned empty array:
          // NEVER overwrite with [] and NEVER save [] to localStorage!
          // If localStorage has an empty array from a previous bug, purge it immediately.
          try {
            const cached = localStorage.getItem("shared_services");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length === 0) {
                localStorage.removeItem("shared_services");
              }
            }
          } catch {
            // ignore
          }
        }

        // 2. Process Main Services
        if (mainServicesRes?.data?.success !== false && Array.isArray(mainServicesRes?.data?.mainServices) && mainServicesRes.data.mainServices.length > 0) {
          const freshMainServices = mainServicesRes.data.mainServices;
          setMainServices(freshMainServices);
          try {
            localStorage.setItem("shared_mainServices", JSON.stringify(freshMainServices));
          } catch (e) {
            console.warn("Failed to write mainServices:", e);
          }
        }

        // 3. Process Semi Services
        if (semiServicesRes?.data?.success !== false && Array.isArray(semiServicesRes?.data?.semiServices) && semiServicesRes.data.semiServices.length > 0) {
          const freshSemiServices = semiServicesRes.data.semiServices;
          setSemiServices(freshSemiServices);
          try {
            localStorage.setItem("shared_semiServices", JSON.stringify(freshSemiServices));
          } catch (e) {
            console.warn("Failed to write semiServices:", e);
          }
        }

        // 4. Process Settings
        if (settingsRes?.data?.success !== false && settingsRes?.data?.settings) {
          const freshSettings = settingsRes.data.settings;
          setSettings(freshSettings);
          updateSchemaSettings(freshSettings);
          try {
            localStorage.setItem("shared_settings", JSON.stringify(freshSettings));
          } catch (e) {
            console.warn("Failed to write settings:", e);
          }
        }

        // 5. Process Locations
        if (locationsRes?.data?.success !== false && Array.isArray(locationsRes?.data?.locations) && locationsRes.data.locations.length > 0) {
          const freshLocations = locationsRes.data.locations;
          setLocations(freshLocations);
          try {
            localStorage.setItem("shared_locations", JSON.stringify(freshLocations));
          } catch (e) {
            console.warn("Failed to write locations:", e);
          }
        }

        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to fetch shared data:", err);
      } finally {
        setLoading(false);
      }
    })();

    try {
      await globalFetchPromise;
    } finally {
      globalFetchPromise = null;
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
      semiServices,
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
