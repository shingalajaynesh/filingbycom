/**
 * AppRoutes.jsx
 * Core routing table and layout director.
 * - Declares public, user-authenticated, and admin-protected routes.
 * - Controls the visibility of CaPortal Navigation/Footer vs VirtualOffice Navigation/Footer.
 * - Integrates Clerk user profile state sync hook (useSyncUser).
 */

import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, useParams, Link } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef, useState, startTransition } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { initGTM, pushToDataLayer, trackEvent } from "../shared/utils/gtm";
import { preloadBlogDetailRoute, preloadBlogListRoute } from "../features/blog/blogData";

// ── FEATURE COMPONENT IMPORTS ────────────────────────────────────────────────
// ── CA Portal ──
import Navigation     from "../features/ca-portal/components/Navigation";
import Footer         from "../features/ca-portal/components/Footer";
import FloatingActions from "../features/ca-portal/components/FloatingActions";

import Home from "../features/ca-portal/pages/Home";
const ServicePage    = lazy(() => import("../features/ca-portal/pages/ServicePage"));
const DigitalCard    = lazy(() => import("../features/ca-portal/pages/DigitalCard"));
const BlogList       = lazy(() => preloadBlogListRoute());
const BlogDetail     = lazy(() => preloadBlogDetailRoute());
const GstCalculatorPage = lazy(() => import("../features/resources/pages/GstCalculatorPage"));
const IncomeTaxCalculatorPage = lazy(() => import("../features/resources/pages/IncomeTaxCalculatorPage"));
const RocToolsPage = lazy(() => import("../features/resources/pages/RocToolsPage"));
const CompanyRegistrationGuidesPage = lazy(() => import("../features/resources/pages/CompanyRegistrationGuidesPage"));
const TrademarkSearchPage = lazy(() => import("../features/resources/pages/TrademarkSearchPage"));
const LegalTemplatesPage = lazy(() => import("../features/resources/pages/LegalTemplatesPage"));
const ComparisonPage = lazy(() => import("../features/ca-portal/pages/ComparisonPage"));
const CalculatorPage = lazy(() => import("../features/ca-portal/pages/CalculatorPage"));
const LegalTemplateDetailsPage = lazy(() => import("../features/ca-portal/pages/LegalTemplatesPage"));
const TopicHubPage = lazy(() => import("../features/ca-portal/pages/TopicHubPage"));
const UserComplianceDashboard = lazy(() => import("../features/client-dashboard/pages/UserComplianceDashboard"));
const ComplianceToolsPage = lazy(() => import("../features/ca-portal/pages/ComplianceToolsPage"));
const AIAssistant = lazy(() => import("../features/ca-portal/components/AIAssistant"));

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
import { PortalCard, PortalPageShell } from "../features/ca-portal/components/PortalPageShell";

// ── Admin Control Room ──
import { ProtectedRoute, PublicAuthRoute, ClerkCallback } from "./RouteGuards";
import { AdminAuthProvider } from "../admin/context/AdminAuthContext";
import AdminRouteGuard from "../admin/AdminRouteGuard";
const AdminLogin      = lazy(() => import("../admin/pages/AdminLogin"));
const AdminDashboard  = lazy(() => import("../admin/pages/AdminDashboard"));
const HIDE_NAVIGATION_PATHS = ["/login", "/register", "/card"];

// ── 404 NOT FOUND ────────────────────────────────────────────────────────────
// Reusable boundary view for invalid routes.
// Reusable boundary view for invalid routes with premium modern aesthetics.
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Page Not Found | FilingBy.com"
        description="The page you are looking for does not exist."
        canonical="/404"
        noindex
      />
      <PortalPageShell
        badge="Page Boundary"
        title="This page could not be found"
        description="The link may be outdated, the route may have changed, or the page may no longer exist. Start from one of the main FilingBy sections below."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "404" }
        ]}
      >
        <PortalCard className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[#1A56DB]/5 text-5xl font-black text-[#1A56DB]">
            404
          </div>
          <h2 className="mt-6 text-2xl font-black text-slate-950">Lost in Compliance Space?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            The page you are looking for may have moved into a different part of the website. These sections are the best places to continue.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to="/"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-blue-200 hover:bg-white cursor-pointer"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#1A56DB]">CA Services</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Tax and compliance catalog</p>
              </div>
              <svg className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1A56DB]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            <Link
              to="/virtual-space"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-blue-200 hover:bg-white cursor-pointer"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#1A56DB]">Virtual Office</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Business addresses and desks</p>
              </div>
              <svg className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1A56DB]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            <Link
              to="/locations"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-blue-200 hover:bg-white cursor-pointer"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#1A56DB]">Locations Hub</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Find compliant offices</p>
              </div>
              <svg className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1A56DB]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            <Link
              to="/blog"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-blue-200 hover:bg-white cursor-pointer"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#1A56DB]">Knowledge Hub</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Compliance blogs and guides</p>
              </div>
              <svg className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1A56DB]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Go Back
            </button>
          </div>
        </PortalCard>
      </PortalPageShell>
    </>
  );
};

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

function DeferredAIAssistant() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const enable = () => {
      startTransition(() => {
        setShouldRender(true);
      });
    };

    if ("requestIdleCallback" in window) {
      const callbackId = window.requestIdleCallback(enable, { timeout: 2500 });
      return () => window.cancelIdleCallback(callbackId);
    }

    const timeoutId = window.setTimeout(enable, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <AIAssistant />
    </Suspense>
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
  const isFirstRender = useRef(true);

  // Initialize GTM once globally if VITE_GTM_ID env exists
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (gtmId) {
      initGTM(gtmId);
    }
  }, []);

  // Track virtual page views on route change (excluding first load to prevent double pageviews)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (import.meta.env.VITE_GTM_ID) {
      pushToDataLayer({
        event: "virtual_page_view",
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }
  }, [location.pathname, location.search]);

  // Global click tracker for contact, phone, email, external link, and download clicks
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = (target.innerText || target.getAttribute("aria-label") || "").trim();

      // 1. WhatsApp Clicks
      if (href.includes("wa.me") || href.includes("whatsapp.com") || href.includes("api.whatsapp.com")) {
        trackEvent("whatsapp_click", {
          link_url: href,
          button_text: text || "WhatsApp"
        });
      }
      // 2. Phone Clicks
      else if (href.startsWith("tel:")) {
        trackEvent("phone_click", {
          phone_number: href.replace("tel:", ""),
          button_text: text || "Call"
        });
      }
      // 3. Email Clicks
      else if (href.startsWith("mailto:")) {
        trackEvent("email_click", {
          email_address: href.replace("mailto:", ""),
          button_text: text || "Email"
        });
      }
      // 4. File Downloads
      else if (href.includes("/download") || href.endsWith(".pdf") || href.endsWith(".doc") || href.endsWith(".docx") || target.hasAttribute("download")) {
        trackEvent("file_download", {
          file_url: href,
          file_name: text || href.split("/").pop()
        });
      }
      // 5. External Link Clicks
      else if (href.startsWith("http") && !href.includes("filingby.com") && !href.includes(window.location.hostname)) {
        trackEvent("external_link_click", {
          link_url: href,
          link_text: text || "External Link"
        });
      }
      // 6. Generic CTA Clicks (Apply Now, Get Started, Talk to Expert, Get Quote, Book Now)
      else if (text) {
        const lowerText = text.toLowerCase();
        if (
          lowerText.includes("apply now") || 
          lowerText.includes("get started") || 
          lowerText.includes("talk to expert") || 
          lowerText.includes("get quote") || 
          lowerText.includes("book now")
        ) {
          trackEvent("service_cta_click", {
            button_name: text,
            page_path: window.location.pathname
          });
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

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

  const isAdminRoute = location.pathname.startsWith("/admin");
  const showCANavigation = !isVirtualOfficeRoute && !HIDE_NAVIGATION_PATHS.includes(location.pathname) && !isAdminRoute;
  const showVirtualOfficeNavigation = isVirtualOfficeRoute && !isAdminRoute;
  const showGlobalFooter = !isAdminRoute && !HIDE_NAVIGATION_PATHS.includes(location.pathname) && location.pathname !== "/dashboard" && location.pathname !== "/virtual-office/dashboard" && location.pathname !== "/partner/dashboard";

  // Track last visited portal to direct login/register redirects
  useEffect(() => {
    if (isVirtualOfficeRoute) {
      sessionStorage.setItem("last_portal", "virtual-space");
    } else if (!HIDE_NAVIGATION_PATHS.includes(location.pathname) && !isAdminRoute) {
      sessionStorage.setItem("last_portal", "ca-portal");
    }
  }, [location.pathname, isVirtualOfficeRoute, isAdminRoute]);

  return (
    <LazyMotion features={domAnimation} strict>
      <SEO schema={orgSchema} extraSchemas={[websiteSchema]} />
      {showCANavigation && <Navigation />}
      {showVirtualOfficeNavigation && <VirtualOfficeNavigation />}
      {!isAdminRoute && <FloatingActions />}
      {!isAdminRoute && <DeferredAIAssistant />}
      
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
          <Route path="/compare/:slug1-vs-:slug2" element={<ComparisonPage />} />
          <Route path="/calculators/:calcSlug" element={<CalculatorPage />} />
          <Route path="/templates" element={<Navigate to="/legal-templates" replace />} />
          <Route path="/templates/:slug" element={<LegalTemplateDetailsPage />} />
          <Route path="/hubs/:hubSlug" element={<TopicHubPage />} />
          <Route path="/dashboard/compliance" element={<UserComplianceDashboard />} />
          <Route path="/tools/:toolSlug" element={<ComplianceToolsPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/virtual-space" element={<VirtualSpace />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          
          {/* Cloned Pages for address.co */}
          <Route path="/locations" element={<Locations />} />
          <Route path="/virtual-office/:city" element={<VirtualOfficeCity />} />
          <Route path="/virtual-office/:city/:area" element={<VirtualOfficeArea />} />
          <Route path="/virtual-office-:city" element={<VirtualOfficeCity />} />
          <Route path="/virtual-office-:city/:area" element={<VirtualOfficeArea />} />
          

          <Route path="/ecommerce-office" element={<EcommerceOffice />} />
          <Route path="/virtual-office-ecommerce" element={<Navigate to="/ecommerce-office" replace />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-promise" element={<OurPromise />} />
          <Route path="/customer-care" element={<CustomerCare />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
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
          <Route path="/digital-card" element={<Navigate to="/card" replace />} />
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
