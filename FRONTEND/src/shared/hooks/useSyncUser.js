import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// 1. Static values outside the hook
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function useSyncUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const syncedUserIdRef = useRef(null);
  const isSyncingRef = useRef(false);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const syncKey = user ? `usr_sync_${user.id}` : null;
  const isSynced = syncKey ? sessionStorage.getItem(syncKey) === "true" : false;

  useEffect(() => {
    // 2. Early returns
    if (!isLoaded || !isUserLoaded || !isSignedIn || !user) return;

    // If already synced, handle redirect on auth pages and skip API calls
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

        // 3. Axios automatically handles JSON.stringify and throws on non-2xx status codes
        await axios.post(`${BACKEND_URL}/register`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: abortController.signal,
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
        
        // 4. Use Axios's built-in cancellation checker
        if (axios.isCancel(err)) return;

        console.error("Failed in post-authentication flow:", err);

        // 5. Safely extract error messages from the Axios error object
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
    user?.id,
    isSynced,
    getToken,
    signOut,
    navigate,
    isAuthPage,
  ]);
}