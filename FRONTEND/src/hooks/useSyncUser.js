import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useSyncUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const syncedUserIdRef = useRef(null);
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (
      !isLoaded ||
      !isUserLoaded ||
      !isSignedIn ||
      !user ||
      syncedUserIdRef.current === user.id
    ) {
      return;
    }

    let isCancelled = false;

    const syncUser = async () => {
      const token = await getToken();

      if (!token) {
        return;
      }

      const backendUrl = (
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
      ).replace(/\/$/, "");
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: user.unsafeMetadata?.phoneNumber || "",
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message ||
            "Failed to sync authenticated user with the backend",
        );
      }

      syncedUserIdRef.current = user.id;

      if (!isCancelled && isAuthPage) {
        navigate("/dashboard", { replace: true });
      }
    };

    syncUser().catch((err) => {
      console.error("Failed in post-authentication flow:", err);
    });

    return () => {
      isCancelled = true;
    };
  }, [
    getToken,
    isAuthPage,
    isLoaded,
    isSignedIn,
    isUserLoaded,
    navigate,
    user,
  ]);
}
