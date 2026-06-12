/**
 * AdminRouteGuard.jsx
 * Protects admin dashboard routes. Redirects to /admin (login) if not authenticated.
 */

import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./context/AdminAuthContext";

export default function AdminRouteGuard({ children }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
