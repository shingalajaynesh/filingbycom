import { Navigate } from "react-router-dom";
import {
  AuthenticateWithRedirectCallback,
  useAuth,
} from "@clerk/clerk-react";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
      Loading secure session...
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function PublicAuthRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function ClerkCallback() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    />
  );
}
