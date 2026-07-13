/**
 * AppRoutes.jsx
 * Core routing table and layout director.
 * - Declares public, user-authenticated, and admin-protected routes.
 * - Controls the visibility of CaPortal Navigation/Footer vs VirtualOffice Navigation/Footer.
 * - Integrates Clerk user profile state sync hook (useSyncUser).
 */

import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

// ── FEATURE COMPONENT IMPORTS ────────────────────────────────────────────────
// ── CA Portal ──
import Navigation     from "../features/ca-portal/components/Navigation";
import Footer         from "../features/ca-portal/components/Footer";
import FloatingActions from "../features/ca-portal/components/FloatingActions";

import Home from "../features/ca-portal/pages/Home";
const ServicePage    = lazy(() => import("../features/ca-portal/pages/ServicePage"));
const DigitalCard    = lazy(() => import("../features/ca-portal/pages/DigitalCard"));
const BlogList       = lazy(() => import("../features/blog/pages/BlogList"));
const BlogDetail     = lazy(() => import("../features/blog/pages/BlogDetail"));
const GstCalculatorPage = lazy(() => import("../features/resources/pages/GstCalculatorPage"));
const IncomeTaxCalculatorPage = lazy(() => import("../features/resources/pages/IncomeTaxCalculatorPage"));
const RocToolsPage = lazy(() => import("../features/resources/pages/RocToolsPage"));
const CompanyRegistrationGuidesPage = lazy(() => import("../features/resources/pages/CompanyRegistrationGuidesPage"));
const TrademarkSearchPage = lazy(() => import("../features/resources/pages/TrademarkSearchPage"));
const LegalTemplatesPage = lazy(() => import("../features/resources/pages/LegalTemplatesPage"));

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
const PartnerDashboard = lazy(() => import("../features/virtual-office/dashboard/PartnerDashboard"));

// ── Legal & Policies ──
const TermsConditions = lazy(() => import("../features/legal/pages/TermsConditions"));
const RefundPolicy    = lazy(() => import("../features/legal/pages/RefundPolicy"));
const PrivacyPolicy   = lazy(() => import("../features/legal/pages/PrivacyPolicy"));
const ContactUs       = lazy(() => import("../features/legal/pages/ContactUs"));

// ── Shared Data Context ──
import { SharedDataProvider } from "../shared/context/SharedDataContext";
import { UserProvider } from "../shared/context/UserContext";
import { OrderProvider } from "../shared/context/OrderContext";
import { AdminProvider } from "../shared/context/AdminContext";
import SEO from "../shared/components/SEO";
import ScrollToTop from "../shared/components/ScrollToTop";
import { orgSchema, websiteSchema } from "../shared/seo/schemas";

// ── Admin Control Room ──
import { ProtectedRoute, PublicAuthRoute, ClerkCallback } from "./RouteGuards";
import { AdminAuthProvider } from "../admin/context/AdminAuthContext";
import AdminRouteGuard from "../admin/AdminRouteGuard";
const AdminLogin      = lazy(() => import("../admin/pages/AdminLogin"));
const AdminDashboard  = lazy(() => import("../admin/pages/AdminDashboard"));

// ── 404 NOT FOUND ────────────────────────────────────────────────────────────
// Reusable boundary view for invalid routes.
const NotFound = () => (
  <>
    <SEO
      title="Page Not Found | FilingBy.com"
      description="The page you are looking for does not exist."
      canonical="/404"
      noindex
    />
    <div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-400">
      404 - Page Not Found
    </div>
  </>
);

function NoIndexRoute({ title, description, children }) {
  return (
    <>
      <SEO title={title} description={description} noindex />
      {children}
    </>
  );
}

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

// Dynamic router component to handle dynamic paths and fall back to 404
function GlobalDynamicRouter() {
  const currentPath = window.location.pathname;
  
  if (currentPath.startsWith("/virtual-office-")) {
    const segments = currentPath.split("/").filter(Boolean);
    // If we have an area path segment (e.g., /virtual-office-city/area)
    if (segments.length > 1) {
      return <VirtualOfficeArea />;
    }
    return <VirtualOfficeCity />;
  }
  
  return <NotFound />;
}

// Helper to redirect legacy Shopify product URLs dynamically to services
function RedirectToService() {
  const { slug } = useParams();
  return <Navigate to={`/services/${slug}`} replace />;
}

/**
 * AppRoutesContent component handles layout determinations and path routing.
 * Evaluates path structures to conditionally render matching navigation bars.
 */
function AppRoutesContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync logged-in Clerk profile states with local databases automatically.
  // Now handled by UserProvider inside AppRoutes


  // 2. Consolidate layout logic into a single array check for scalability
  const isVirtualOfficeRoute =
    location.pathname === "/virtual-space" ||
    location.pathname === "/locations" ||
    location.pathname === "/ecommerce-office" ||
    location.pathname.startsWith("/virtual-office") ||
    location.pathname.startsWith("/partner") ||
    location.pathname === "/about-us" ||
    location.pathname === "/our-promise" ||
    location.pathname === "/customer-care" ||
    location.pathname === "/contact-us" ||
    location.pathname === "/contact" ||
    location.pathname === "/faq" ||
    location.pathname === "/get-live-quote" ||
    location.pathname === "/terms-conditions" ||
    location.pathname === "/default/refund" ||
    location.pathname === "/default/privacy-policy";

  const hideNavigationPaths = ["/login", "/register", "/card"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showCANavigation = !isVirtualOfficeRoute && !hideNavigationPaths.includes(location.pathname) && !isAdminRoute;
  const showVirtualOfficeNavigation = isVirtualOfficeRoute && !isAdminRoute;
  const showGlobalFooter = !isAdminRoute && !hideNavigationPaths.includes(location.pathname) && location.pathname !== "/dashboard" && location.pathname !== "/virtual-office/dashboard" && location.pathname !== "/partner/dashboard";

  // Track last visited portal to direct login/register redirects
  useEffect(() => {
    if (isVirtualOfficeRoute) {
      sessionStorage.setItem("last_portal", "virtual-space");
    } else if (!hideNavigationPaths.includes(location.pathname) && !isAdminRoute) {
      sessionStorage.setItem("last_portal", "ca-portal");
    }
  }, [location.pathname, isVirtualOfficeRoute, isAdminRoute]);

  return (
    <LazyMotion features={domAnimation} strict>
      <SEO schema={orgSchema} extraSchemas={[websiteSchema]} />
      {showCANavigation && <Navigation />}
      {showVirtualOfficeNavigation && <VirtualOfficeNavigation />}
      {!isAdminRoute && <FloatingActions />}
      
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Legacy Shopify page redirects */}
          <Route path="/pages/csr-audit" element={<Navigate to="/services/csr-registration" replace />} />
          <Route path="/pages/trust-compliance" element={<Navigate to="/services/trust-registration" replace />} />
          <Route path="/pages/trust-audit" element={<Navigate to="/services/trust-registration" replace />} />
          <Route path="/pages/moa-amendment-public-private-limited" element={<Navigate to="/services/moa-amendment" replace />} />
          <Route path="/pages/pan-card" element={<Navigate to="/services/tan-registration" replace />} />
          <Route path="/pages/private-limited-company-winding-up" element={<Navigate to="/services/pvt-winding-up" replace />} />
          <Route path="/pages/ngo-compliance" element={<Navigate to="/services/trust-registration" replace />} />
          <Route path="/pages/llp-compliance" element={<Navigate to="/services/roc-annual-filing-llp" replace />} />
          <Route path="/pages/start-application" element={<Navigate to="/register" replace />} />
          <Route path="/pages/apeda-registration" element={<Navigate to="/services/apeda-registration" replace />} />
          <Route path="/pages/tan-card" element={<Navigate to="/services/tan-registration" replace />} />
          <Route path="/pages/ngo-registration" element={<Navigate to="/services/trust-registration" replace />} />
          <Route path="/pages/salary-return-filing" element={<Navigate to="/services/itr-1-filing" replace />} />
          <Route path="/pages/gst-audit" element={<Navigate to="/services/gst-audit" replace />} />
          <Route path="/pages/about-us" element={<AboutUs />} />
          <Route path="/pages/terms-conditions" element={<TermsConditions />} />
          <Route path="/pages/privacy-policy" element={<Navigate to="/default/privacy-policy" replace />} />
          <Route path="/pages/refund-policy" element={<Navigate to="/default/refund" replace />} />
          <Route path="/pages/partnership-firm-return" element={<Navigate to="/services/partnership-firm" replace />} />
          <Route path="/pages/indian-subsidiary-registration" element={<Navigate to="/services/indian-subsidiary" replace />} />
          <Route path="/pages/income-tax-audit" element={<Navigate to="/services/tax-audit" replace />} />

          {/* Shopify endpoints redirects */}
          <Route path="/account" element={<Navigate to="/dashboard" replace />} />
          <Route path="/cart" element={<Navigate to="/dashboard" replace />} />
          <Route path="/search" element={<Navigate to="/dashboard" replace />} />

          {/* Legacy Shopify products catch-all */}
          <Route path="/products/:slug" element={<RedirectToService />} />

          {/* Obsolete Shopify internal tracking/assets routes */}
          <Route path="/wpm" element={<Navigate to="/" replace />} />
          <Route path="/b" element={<Navigate to="/" replace />} />
          <Route path="/cdn" element={<Navigate to="/" replace />} />
          <Route path="/v1/produce" element={<Navigate to="/" replace />} />
          <Route path="/%24%7Bt%7D" element={<Navigate to="/" replace />} />
          <Route path="/$%7Bt%7D" element={<Navigate to="/" replace />} />
          <Route path="/${t}" element={<Navigate to="/" replace />} />

          <Route path="/" element={<Home />} />
          <Route path="/gst-calculator" element={<GstCalculatorPage />} />
          <Route path="/income-tax-calculator" element={<IncomeTaxCalculatorPage />} />
          <Route path="/roc-tools" element={<RocToolsPage />} />
          <Route path="/company-registration-guides" element={<CompanyRegistrationGuidesPage />} />
          <Route path="/trademark-search" element={<TrademarkSearchPage />} />
          <Route path="/legal-templates" element={<LegalTemplatesPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/virtual-space" element={<VirtualSpace />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          
          {/* Cloned Pages for address.co */}
          <Route path="/locations" element={<Locations />} />
          <Route path="/virtual-office/:city" element={<VirtualOfficeCity />} />
          <Route path="/virtual-office/:city/:area" element={<VirtualOfficeArea />} />
          

          <Route path="/ecommerce-office" element={<EcommerceOffice />} />
          <Route path="/virtual-office-ecommerce" element={<Navigate to="/ecommerce-office" replace />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-promise" element={<OurPromise />} />
          <Route path="/customer-care" element={<CustomerCare />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/get-live-quote" element={<GetLiveQuote />} />
          <Route
            path="/partner-onboarding"
            element={
              <ProtectedRoute>
                <PartnerOnboarding />
              </ProtectedRoute>
            }
          />
          
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
            path="/partner/dashboard"
            element={
              <ProtectedRoute>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/login"
            element={
              <NoIndexRoute title="Login | FilingBy.com" description="Login to your FilingBy account.">
                <PublicAuthRoute>
                  {/* 3. Note on potential race condition below */}
                  <Login onAuthenticated={() => navigate("/dashboard", { replace: true })} />
                </PublicAuthRoute>
              </NoIndexRoute>
            }
          />
          
          <Route
            path="/register"
            element={
              <NoIndexRoute title="Register | FilingBy.com" description="Create your FilingBy account.">
                <PublicAuthRoute>
                  <Register onRegistered={() => navigate("/dashboard", { replace: true })} />
                </PublicAuthRoute>
              </NoIndexRoute>
            }
          />
          
          <Route path="/sso-callback" element={<ClerkCallback />} />
          <Route
            path="/card"
            element={
              <NoIndexRoute title="Digital Card | FilingBy.com" description="FilingBy digital business card.">
                <DigitalCard />
              </NoIndexRoute>
            }
          />

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
          <Route path="*" element={<GlobalDynamicRouter />} />
        </Routes>
      </Suspense>

      {showGlobalFooter && <Footer />}
    </LazyMotion>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* AdminAuthProvider wraps everything so admin context is available everywhere */}
      <AdminAuthProvider>
        <AdminProvider>
          <UserProvider>
            <OrderProvider>
              <SharedDataProvider>
                <AppRoutesContent />
              </SharedDataProvider>
            </OrderProvider>
          </UserProvider>
        </AdminProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
