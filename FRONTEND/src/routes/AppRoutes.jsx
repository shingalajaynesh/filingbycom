/**
 * AppRoutes.jsx
 * Core routing table and layout director.
 * - Declares public, user-authenticated, and admin-protected routes.
 * - Controls the visibility of CaPortal Navigation/Footer vs VirtualOffice Navigation/Footer.
 * - Integrates Clerk user profile state sync hook (useSyncUser).
 */

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

// ── FEATURE COMPONENT IMPORTS ────────────────────────────────────────────────
// ── CA Portal ──
import Navigation     from "../features/ca-portal/components/Navigation";
import Footer         from "../features/ca-portal/components/Footer";
import FloatingActions from "../features/ca-portal/components/FloatingActions";
import Home           from "../features/ca-portal/pages/Home";
import ServicePage    from "../features/ca-portal/pages/ServicePage";
import DigitalCard    from "../features/ca-portal/pages/DigitalCard";

// ── Virtual Office ──
import VirtualOfficeNavigation from "../features/virtual-office/components/VirtualOfficeNavigation";
import VirtualSpace            from "../features/virtual-office/pages/VirtualSpace";
import Locations               from "../features/virtual-office/pages/Locations";
import VirtualOfficeCity       from "../features/virtual-office/pages/VirtualOfficeCity";
import EcommerceOffice         from "../features/virtual-office/pages/EcommerceOffice";
import AboutUs                 from "../features/virtual-office/pages/AboutUs";
import OurPromise              from "../features/virtual-office/pages/OurPromise";
import CustomerCare            from "../features/virtual-office/pages/CustomerCare";
import FaqPage                 from "../features/virtual-office/pages/FaqPage";
import GetLiveQuote            from "../features/virtual-office/pages/GetLiveQuote";
import PartnerOnboarding       from "../features/virtual-office/pages/PartnerOnboarding";

// ── Auth & Session ──
import Login    from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";

// ── Client Dashboard ──
import ClientDashboard from "../features/client-dashboard/pages/ClientDashboard";

// ── Legal & Policies ──
import TermsConditions from "../features/legal/pages/TermsConditions";
import RefundPolicy    from "../features/legal/pages/RefundPolicy";
import PrivacyPolicy   from "../features/legal/pages/PrivacyPolicy";

// ── Shared Hook Utilities ──
import useSyncUser from "../shared/hooks/useSyncUser";

// ── Admin Control Room ──
import { ProtectedRoute, PublicAuthRoute, ClerkCallback } from "./RouteGuards";
import { AdminAuthProvider } from "../admin/context/AdminAuthContext";
import AdminRouteGuard from "../admin/AdminRouteGuard";
import AdminLogin      from "../admin/pages/AdminLogin";
import AdminDashboard  from "../admin/pages/AdminDashboard";

// ── 404 NOT FOUND ────────────────────────────────────────────────────────────
// Reusable boundary view for invalid routes.
const NotFound = () => (
  <div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">
    404 - Page Not Found
  </div>
);

/**
 * AppRoutesContent component handles layout determinations and path routing.
 * Evaluates path structures to conditionally render matching navigation bars.
 */
function AppRoutesContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync logged-in Clerk profile states with local databases automatically.
  useSyncUser();

  // 2. Consolidate layout logic into a single array check for scalability
  const isVirtualOfficeRoute =
    location.pathname === "/virtual-space" ||
    location.pathname === "/locations" ||
    location.pathname.startsWith("/virtual-office") ||
    location.pathname === "/about-us" ||
    location.pathname === "/our-promise" ||
    location.pathname === "/customer-care" ||
    location.pathname === "/faq" ||
    location.pathname === "/get-live-quote" ||
    location.pathname === "/partner-onboarding" ||
    location.pathname === "/terms-conditions" ||
    location.pathname === "/default/refund" ||
    location.pathname === "/default/privacy-policy";

  const hideNavigationPaths = ["/login", "/register", "/card"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showCANavigation = !isVirtualOfficeRoute && !hideNavigationPaths.includes(location.pathname) && !isAdminRoute;
  const showVirtualOfficeNavigation = isVirtualOfficeRoute && !isAdminRoute;

  return (
    <>
      {showCANavigation && <Navigation />}
      {showVirtualOfficeNavigation && <VirtualOfficeNavigation />}
      {!isAdminRoute && <FloatingActions />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/virtual-space" element={<VirtualSpace />} />
        
        {/* Cloned Pages for address.co */}
        <Route path="/locations" element={<Locations />} />
        <Route path="/virtual-office/:city" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-delhi" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-mumbai" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-bangalore" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-chennai" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-hyderabad" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-noida" element={<VirtualOfficeCity />} />
        <Route path="/virtual-office-kolkata" element={<VirtualOfficeCity />} />
        
        <Route path="/virtual-office-ecommerce" element={<EcommerceOffice />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-promise" element={<OurPromise />} />
        <Route path="/customer-care" element={<CustomerCare />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/get-live-quote" element={<GetLiveQuote />} />
        <Route path="/partner-onboarding" element={<PartnerOnboarding />} />
        
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/default/refund" element={<RefundPolicy />} />
        <Route path="/default/privacy-policy" element={<PrivacyPolicy />} />
        
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

      {!isAdminRoute && <Footer />}
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