import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { safeFetch } from "../utils/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const syncedUserIdRef = useRef(null);
  const isSyncingRef = useRef(false);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const syncKey = user ? `usr_sync_${user.id}` : null;
  const isSynced = syncKey ? sessionStorage.getItem(syncKey) === "true" : false;

  // 1. Sync User logic moved from useSyncUser.js
  useEffect(() => {
    if (!isLoaded || !isUserLoaded || !isSignedIn || !user) return;

    if (syncedUserIdRef.current === user.id || isSynced) {
      syncedUserIdRef.current = user.id;
      if (isAuthPage) {
        navigate("/dashboard", { replace: true });
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
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: user.unsafeMetadata?.phoneNumber || "",
        };

        const res = await safeFetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload)
        });

        if (abortController.signal.aborted) {
          isSyncingRef.current = false;
          return;
        }

        syncedUserIdRef.current = user.id;
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
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        isSyncingRef.current = false;
        
        if (err.name === 'AbortError') return;

        console.error("Failed in post-authentication flow:", err);

        const errorMessage = err.message || "Something went wrong.";
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
    user?.id,
    isSynced,
    getToken,
    signOut,
    navigate,
    isAuthPage,
    syncKey
  ]);

  // 2. Fetch Profile logic moved from ProfileCard.jsx
  const fetchProfile = useCallback(async () => {
    if (!isSignedIn) return;
    setProfileLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      const resData = await safeFetch("/profile", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (resData.success) {
        setProfile(resData.profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }, [getToken, isSignedIn]);

  // Automatically fetch profile when user is signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchProfile();
    }
  }, [isSignedIn, fetchProfile]);

  // 3. Expose manual sync for PhoneVerificationModal
  const syncUserToBackend = useCallback(async (customPayload) => {
    const token = await getToken();
    if (!token) throw new Error("Session expired. Please log in again.");

    const payload = customPayload || {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: user?.unsafeMetadata?.phoneNumber || "",
    };

    const resData = await safeFetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    });

    if (!resData.success) {
      throw new Error(resData.message || "Failed to sync user data to database.");
    }
    return resData;
  }, [getToken, user]);

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
