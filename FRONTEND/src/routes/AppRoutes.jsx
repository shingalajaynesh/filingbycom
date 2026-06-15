/**
 * AppRoutes.jsx
 * Core routing table and layout director.
 * - Declares public, user-authenticated, and admin-protected routes.
 * - Controls the visibility of CaPortal Navigation/Footer vs VirtualOffice Navigation/Footer.
 * - Integrates Clerk user profile state sync hook (useSyncUser).
 */

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// ── FEATURE COMPONENT IMPORTS ────────────────────────────────────────────────
// ── CA Portal ──
import Navigation     from "../features/ca-portal/components/Navigation";
import Footer         from "../features/ca-portal/components/Footer";
import FloatingActions from "../features/ca-portal/components/FloatingActions";

const Home           = lazy(() => import("../features/ca-portal/pages/Home"));
const ServicePage    = lazy(() => import("../features/ca-portal/pages/ServicePage"));
const DigitalCard    = lazy(() => import("../features/ca-portal/pages/DigitalCard"));

// ── Virtual Office ──
import VirtualOfficeNavigation from "../features/virtual-office/components/VirtualOfficeNavigation";
const VirtualSpace            = lazy(() => import("../features/virtual-office/pages/VirtualSpace"));
const Locations               = lazy(() => import("../features/virtual-office/pages/Locations"));
const VirtualOfficeCity       = lazy(() => import("../features/virtual-office/pages/VirtualOfficeCity"));
const VirtualOfficeArea       = lazy(() => import("../features/virtual-office/pages/VirtualOfficeArea"));
const EcommerceOffice         = lazy(() => import("../features/virtual-office/pages/EcommerceOffice"));
const AboutUs                 = lazy(() => import("../features/virtual-office/pages/AboutUs"));
const OurPromise              = lazy(() => import("../features/virtual-office/pages/OurPromise"));
const CustomerCare            = lazy(() => import("../features/virtual-office/pages/CustomerCare"));
const FaqPage                 = lazy(() => import("../features/virtual-office/pages/FaqPage"));
const GetLiveQuote            = lazy(() => import("../features/virtual-office/pages/GetLiveQuote"));
const PartnerOnboarding       = lazy(() => import("../features/virtual-office/pages/PartnerOnboarding"));

// ── Auth & Session ──
const Login    = lazy(() => import("../features/auth/components/Login"));
const Register = lazy(() => import("../features/auth/components/Register"));

// ── Client Dashboard ──
const ClientDashboard = lazy(() => import("../features/client-dashboard/pages/ClientDashboard"));
const VirtualDashboard = lazy(() => import("../features/virtual-office/dashboard/VirtualDashboard"));

// ── Legal & Policies ──
const TermsConditions = lazy(() => import("../features/legal/pages/TermsConditions"));
const RefundPolicy    = lazy(() => import("../features/legal/pages/RefundPolicy"));
const PrivacyPolicy   = lazy(() => import("../features/legal/pages/PrivacyPolicy"));

// ── Shared Hook Utilities ──
import useSyncUser from "../shared/hooks/useSyncUser";

// ── Shared Data Context ──
import { SharedDataProvider } from "../shared/context/SharedDataContext";

// ── Admin Control Room ──
import { ProtectedRoute, PublicAuthRoute, ClerkCallback } from "./RouteGuards";
import { AdminAuthProvider } from "../admin/context/AdminAuthContext";
import AdminRouteGuard from "../admin/AdminRouteGuard";
const AdminLogin      = lazy(() => import("../admin/pages/AdminLogin"));
const AdminDashboard  = lazy(() => import("../admin/pages/AdminDashboard"));

// ── 404 NOT FOUND ────────────────────────────────────────────────────────────
// Reusable boundary view for invalid routes.
const NotFound = () => (
  <div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">
    404 - Page Not Found
  </div>
);

// ── ROUTE LOADER ────────────────────────────────────────────────────────────
function RouteLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase animate-pulse">Loading page...</span>
      </div>
    </div>
  );
}

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

  const showBackButton =
    location.pathname !== "/" &&
    location.pathname !== "/virtual-space" &&
    location.pathname !== "/dashboard" &&
    location.pathname !== "/virtual-office/dashboard" &&
    !isAdminRoute;

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {showBackButton && (
        <div className="fixed bottom-6 left-6 z-[9999] print:hidden">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4.5 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-2xl border border-slate-700/60 transition-all duration-200 active:scale-95 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            ← Back
          </button>
        </div>
      )}
      {showCANavigation && <Navigation />}
      {showVirtualOfficeNavigation && <VirtualOfficeNavigation />}
      {!isAdminRoute && <FloatingActions />}
      
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/virtual-space" element={<VirtualSpace />} />
          
          {/* Cloned Pages for address.co */}
          <Route path="/locations" element={<Locations />} />
          <Route path="/virtual-office/:city" element={<VirtualOfficeCity />} />
          <Route path="/virtual-office-surat" element={<VirtualOfficeCity />} />
          <Route path="/virtual-office-mumbai" element={<VirtualOfficeCity />} />
          
          {/* Specific Business Centers / Area Subpages */}
          <Route path="/virtual-office-surat/:area" element={<VirtualOfficeArea />} />
          <Route path="/virtual-office-mumbai/:area" element={<VirtualOfficeArea />} />
          <Route path="/virtual-office/:city/:area" element={<VirtualOfficeArea />} />
          
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
            path="/virtual-office/dashboard"
            element={
              <ProtectedRoute>
                <VirtualDashboard />
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
      </Suspense>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* AdminAuthProvider wraps everything so admin context is available everywhere */}
      <AdminAuthProvider>
        <SharedDataProvider>
          <AppRoutesContent />
        </SharedDataProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}