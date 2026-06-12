import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Home from "../pages/Home";
import ServicePage from "../pages/ServicePage";
import Login from "../components/Login";
import Register from "../components/Register";
import ClientDashboard from "../pages/ClientDashboard";
import DigitalCard from "../pages/DigitalCard";
import FloatingActions from "../components/FloatingActions";
import useSyncUser from "../hooks/useSyncUser";
import { ProtectedRoute, PublicAuthRoute, ClerkCallback } from "./RouteGuards";
import { AdminAuthProvider } from "../admin/context/AdminAuthContext";
import AdminRouteGuard from "../admin/AdminRouteGuard";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminDashboard from "../admin/pages/AdminDashboard";

// 1. Extract the 404 page into a tidy, reusable component
const NotFound = () => (
  <div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">
    404 - Page Not Found
  </div>
);

function AppRoutesContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle post-authentication user sync logic
  useSyncUser();

  // 2. Consolidate layout logic into a single array check for scalability
  const hideNavigationPaths = ["/login", "/register", "/card"];
  // Also hide Navigation for all /admin/* routes
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showNavigation = !hideNavigationPaths.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      {showNavigation && <Navigation />}
      {!isAdminRoute && <FloatingActions />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              {/* 3. Note on potential race condition below */}
              <Login onAuthenticated={() => navigate("/dashboard", { replace: true })} />
            </PublicAuthRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <Register onRegistered={() => navigate("/dashboard", { replace: true })} />
            </PublicAuthRoute>
          }
        />
        
        <Route path="/sso-callback" element={<ClerkCallback />} />
        <Route path="/card" element={<DigitalCard />} />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          }
        />
        
        {/* 4. Use the extracted component */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* AdminAuthProvider wraps everything so admin context is available everywhere */}
      <AdminAuthProvider>
        <AppRoutesContent />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}