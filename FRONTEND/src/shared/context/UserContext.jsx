/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { trackEvent } from "../utils/gtm";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const UserContext = createContext(null);

let globalProfileFetchPromise = null;

export function UserProvider({ children }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const syncedUserIdRef = useRef(null);
  const isSyncingRef = useRef(false);
  const profileFetchedRef = useRef(false);

  const userId = user?.id;
  const userFirstName = user?.firstName;
  const userLastName = user?.lastName;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userPhone = user?.unsafeMetadata?.phoneNumber;

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const syncKey = userId ? `usr_sync_${userId}` : null;
  const isSynced = syncKey ? sessionStorage.getItem(syncKey) === "true" : false;

  // Reset fetch tracker when signed out
  useEffect(() => {
    if (!isSignedIn) {
      setProfile(null);
      profileFetchedRef.current = false;
    }
  }, [isSignedIn]);

  // 1. Sync User logic
  useEffect(() => {
    if (!isLoaded || !isUserLoaded || !isSignedIn || !userId) return;

    if (syncedUserIdRef.current === userId || isSynced) {
      syncedUserIdRef.current = userId;
      if (isAuthPage) {
        const lastPortal = sessionStorage.getItem("last_portal") || "ca-portal";
        const target = lastPortal === "virtual-space"
          ? (profile?.isPartner ? "/partner/dashboard" : "/virtual-office/dashboard")
          : "/dashboard";
        localStorage.setItem("auth_portal", lastPortal);
        navigate(target, { replace: true });
      }
      return;
    }

    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    const abortController = new AbortController();

    const syncWithBackend = async () => {
      try {
        const token = await getToken();
        if (!token) {
          isSyncingRef.current = false;
          return;
        }

        const payload = {
          firstName: userFirstName || "",
          lastName: userLastName || "",
          email: userEmail || "",
          phone: userPhone || "",
        };

        const res = await axios.post(`${API_BASE}/register`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          signal: abortController.signal
        });

        const resData = res.data;
        if (resData.success) {
          setProfile(resData.user);
        }

        if (abortController.signal.aborted) {
          isSyncingRef.current = false;
          return;
        }

        syncedUserIdRef.current = userId;
        if (syncKey) {
          sessionStorage.setItem(syncKey, "true");
        }
        isSyncingRef.current = false;

        const justRegistered = sessionStorage.getItem("justRegistered") === "true";

        if (justRegistered) {
          toast.success("Account created successfully! Please sign in.", { duration: 5000 });
          await signOut();
          sessionStorage.removeItem("justRegistered");
          navigate("/login", { replace: true });
        } else if (isAuthPage) {
          const provider = user?.externalAccounts?.[0]?.providerType || "email";
          trackEvent("login_success", { method: provider });
          const lastPortal = sessionStorage.getItem("last_portal") || "ca-portal";
          const target = lastPortal === "virtual-space"
            ? (resData.user?.isPartner ? "/partner/dashboard" : "/virtual-office/dashboard")
            : "/dashboard";
          localStorage.setItem("auth_portal", lastPortal);
          navigate(target, { replace: true });
        }
      } catch (err) {
        isSyncingRef.current = false;
        
        if (axios.isCancel(err) || err.name === 'AbortError') return;

        console.error("Failed in post-authentication flow:", err);

        const errorMessage = err.response?.data?.message || err.message || "Something went wrong.";
        const justRegistered = sessionStorage.getItem("justRegistered") === "true";

        if (justRegistered) {
          sessionStorage.removeItem("justRegistered");
          toast.error(errorMessage, { duration: 5000 });
          await signOut();
          navigate("/register", { replace: true });
        } else {
          toast.error(errorMessage || "Failed to sync your account. Please try again.", { duration: 4000 });
        }
      }
    };

    syncWithBackend();

    return () => {
      abortController.abort();
    };
  }, [
    isLoaded,
    isUserLoaded,
    isSignedIn,
    userId,
    userFirstName,
    userLastName,
    userEmail,
    userPhone,
    isSynced,
    getToken,
    signOut,
    navigate,
    isAuthPage,
    syncKey
  ]);

  // 2. Expose manual sync for Self-Sync
  const syncUserToBackend = useCallback(async (customPayload) => {
    const token = await getToken();
    if (!token) throw new Error("Session expired. Please log in again.");

    const payload = customPayload || {
      firstName: userFirstName || "",
      lastName: userLastName || "",
      email: userEmail || "",
      phone: userPhone || "",
    };

    try {
      const res = await axios.post(`${API_BASE}/register`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      const resData = res.data;
      if (!resData.success) {
        throw new Error(resData.message || "Failed to sync user data to database.");
      }
      return resData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to sync user data";
      throw new Error(errorMessage);
    }
  }, [getToken, userFirstName, userLastName, userEmail, userPhone]);

  // 3. Fetch Profile logic with robust auto-sync recovery
  const fetchProfile = useCallback(async (force = false) => {
    if (!isSignedIn) return;
    if (profileFetchedRef.current && !force) return;
    if (globalProfileFetchPromise) {
      return globalProfileFetchPromise;
    }

    setProfileLoading(true);

    globalProfileFetchPromise = (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const resData = res.data;
        if (resData.success) {
          setProfile(resData.user);
          profileFetchedRef.current = true;
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Auto-sync if profile is not found in database (404)
        if (err.response?.status === 404) {
          console.warn("Profile not found in database. Attempting self-sync...");
          if (syncKey) sessionStorage.removeItem(syncKey);
          syncedUserIdRef.current = null;
          
          try {
            const syncRes = await syncUserToBackend();
            if (syncRes && syncRes.success) {
              const token = await getToken();
              const retryRes = await axios.get(`${API_BASE}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              });
              if (retryRes.data.success) {
                setProfile(retryRes.data.user);
                if (syncKey) sessionStorage.setItem(syncKey, "true");
                syncedUserIdRef.current = userId;
                profileFetchedRef.current = true;
              }
            }
          } catch (syncErr) {
            console.error("Self-sync after profile 404 failed:", syncErr);
          }
        }
      } finally {
        setProfileLoading(false);
      }
    })();

    try {
      await globalProfileFetchPromise;
    } finally {
      globalProfileFetchPromise = null;
    }
  }, [getToken, isSignedIn, userId, syncKey, syncUserToBackend]);

  // Automatically fetch profile when user is signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchProfile();
    }
  }, [isSignedIn, fetchProfile]);

  // Provide context
  return (
    <UserContext.Provider value={{ profile, profileLoading, fetchProfile, syncUserToBackend }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used inside UserProvider");
  return context;
}
