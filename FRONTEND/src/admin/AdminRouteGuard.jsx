/**
 * AdminRouteGuard.jsx
 * Protects admin dashboard routes. Redirects to /admin (login) if not authenticated.
 */

import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./context/AdminAuthContext";

export default function AdminRouteGuard({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
