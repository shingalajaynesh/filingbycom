import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  AuthenticateWithRedirectCallback,
  useAuth,
} from "@clerk/clerk-react";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
      <span className="animate-pulse">Loading secure session...</span>
    </div>
  );
}

/**
 * Custom hook to isolate CA Portal and Virtual Space Clerk auth states.
 * Re-routes or hides logged-in status if logged in from the opposite portal.
 */
export function usePortalAuth() {
  const { isLoaded, isSignedIn, ...rest } = useAuth();
  const location = useLocation();

  const isVirtualOfficeRoute =
    location.pathname === "/virtual-space" ||
    location.pathname === "/locations" ||
    location.pathname.startsWith("/virtual-office") ||
    location.pathname.startsWith("/partner") ||
    location.pathname === "/about-us" ||
    location.pathname === "/our-promise" ||
    location.pathname === "/customer-care" ||
    location.pathname === "/faq" ||
    location.pathname === "/get-live-quote" ||
    location.pathname === "/terms-conditions" ||
    location.pathname === "/default/refund" ||
    location.pathname === "/default/privacy-policy";

  const currentPortal = isVirtualOfficeRoute ? "virtual-space" : "ca-portal";
  let authPortal = localStorage.getItem("auth_portal");

  // Recovery fallback: if signed in but authPortal key is missing, bind to visited portal
  if (isSignedIn && !authPortal) {
    authPortal = currentPortal;
    localStorage.setItem("auth_portal", currentPortal);
  }

  const isPortalSignedIn = isSignedIn && authPortal === currentPortal;

  return {
    isLoaded,
    isSignedIn: isPortalSignedIn,
    ...rest
  };
}

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = usePortalAuth();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  return children;
}

export function PublicAuthRoute({ children }) {
  const { isLoaded, isSignedIn } = usePortalAuth();

  if (!isLoaded) return <LoadingScreen />;

  if (isSignedIn) {
    const justRegistered = sessionStorage.getItem("justRegistered") === "true";
    if (!justRegistered) {
      const lastPortal = sessionStorage.getItem("last_portal");
      const target = lastPortal === "virtual-space" ? "/virtual-office/dashboard" : "/dashboard";
      return <Navigate to={target} replace />;
    }
  }

  return children;
}

export function ClerkCallback() {
  const lastPortal = sessionStorage.getItem("last_portal") || "ca-portal";
  const target = lastPortal === "virtual-space" ? "/virtual-office/dashboard" : "/dashboard";

  useEffect(() => {
    localStorage.setItem("auth_portal", lastPortal);
  }, [lastPortal]);

  return (
    <AuthenticateWithRedirectCallback
      forceRedirectUrl={target}
      fallbackRedirectUrl={target}
    />
  );
}