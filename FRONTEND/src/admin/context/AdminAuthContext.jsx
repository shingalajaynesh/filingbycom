/**
 * AdminAuthContext.jsx
 * Provides admin authentication state across the admin panel.
 * Relies on HTTP-only cookie JWT validated by the backend.
 */

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(() => window.location.pathname.startsWith("/admin"));
  const [hasChecked, setHasChecked] = useState(false);
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/check-auth`, {
        withCredentials: true,
      });
      const data = res.data;
      setIsAuthenticated(data.success && data.authenticated);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      if (!isAuthenticated && !hasChecked) {
        setLoading(true);
        checkAuth().then(() => setHasChecked(true));
      }
    } else {
      setHasChecked(false);
    }
  }, [location.pathname, isAuthenticated, hasChecked, checkAuth]);

  const login = useCallback(async (username, password) => {
    const res = await axios.post(`${API_BASE}/admin/login`, { username, password }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const data = res.data;
    if (data.success) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: data.message || "Invalid credentials" };
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/admin/logout`, {}, {
        withCredentials: true,
      });
    } catch (e) {
      console.error("Logout failed", e);
    }
    setIsAuthenticated(false);
    setHasChecked(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
