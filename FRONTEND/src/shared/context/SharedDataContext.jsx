import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { safeFetch } from "../utils/api";

const SharedDataContext = createContext(null);

export function SharedDataProvider({ children }) {
  const [services, setServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [resServices, resMain, resSettings, resLocations] = await Promise.all([
        safeFetch('/services'),
        safeFetch('/main-services'),
        safeFetch('/settings').catch(() => ({ success: true, settings: {} })),
        safeFetch('/virtual-space/locations').catch(() => ({ success: true, locations: [] }))
      ]);

      if (resServices.success && resMain.success) {
        setServices(resServices.services);
        setMainServices(resMain.mainServices);
        setSettings(resSettings.settings || {});
        setLocations(resLocations.locations || []);
        setIsInitialized(true);
      }
    } catch (err) {
      console.error("Failed to load shared app data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return (
    <SharedDataContext.Provider value={{ services, mainServices, settings, locations, loading, isInitialized, refresh }}>
      {children}
    </SharedDataContext.Provider>
  );
}

export function useSharedData() {
  const context = useContext(SharedDataContext);
  if (!context) throw new Error("useSharedData must be used inside SharedDataProvider");
  return context;
}
