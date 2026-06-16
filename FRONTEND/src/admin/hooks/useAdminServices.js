import { useState, useEffect, useCallback } from "react";
import { useAdminContext } from "../../shared/context/AdminContext";

export function useAdminServices(portal = "ca-portal") {
  const { 
    services, 
    mainServices, 
    fetchServicesData: contextFetchServicesData, 
    addService: contextAddService, 
    updateService: contextUpdateService, 
    deleteService: contextDeleteService,
    addMainService: contextAddMainService,
    updateMainService: contextUpdateMainService,
    deleteMainService: contextDeleteMainService
  } = useAdminContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await contextFetchServicesData(portal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [portal, contextFetchServicesData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addService = async (serviceData) => {
    return await contextAddService(serviceData, portal);
  };

  const updateService = async (id, serviceData) => {
    return await contextUpdateService(id, serviceData);
  };

  const deleteService = async (id) => {
    return await contextDeleteService(id);
  };

  const addMainService = async (data) => {
    return await contextAddMainService(data, portal);
  };

  const updateMainService = async (id, data) => {
    return await contextUpdateMainService(id, data);
  };

  const deleteMainService = async (id) => {
    return await contextDeleteMainService(id);
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
