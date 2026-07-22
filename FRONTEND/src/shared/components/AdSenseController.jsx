import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * List of routes where Google-served ads MUST be suppressed
 * to comply with Google AdSense Inventory Value policy (screens without publisher-content).
 */
const NON_PUBLISHER_CONTENT_ROUTES = [
  "/login",
  "/register",
  "/sso-callback",
  "/dashboard",
  "/virtual-office/dashboard",
  "/partner/dashboard",
  "/card",
  "/404",
];

function isNonContentRoute(pathname) {
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/dashboard")) return true;
  if (NON_PUBLISHER_CONTENT_ROUTES.includes(pathname)) return true;
  return false;
}

/**
 * AdSenseController monitors route changes in the SPA.
 * If the user navigates to a utility/auth/dashboard screen without publisher content,
 * it pauses Google Auto Ads requests and sets window.ADSENSE_ALLOWED = false.
 * On public publisher content pages, it allows ads.
 */
export default function AdSenseController() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isNonContent = isNonContentRoute(location.pathname);
    window.ADSENSE_ALLOWED = !isNonContent;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      if (isNonContent) {
        // Pause AdSense auto-ad requests on non-content screens
        window.adsbygoogle.pauseAdRequests = 1;
      } else {
        // Resume AdSense ad requests on publisher content pages
        window.adsbygoogle.pauseAdRequests = 0;
      }
    } catch (err) {
      console.warn("AdSense controller state sync warning:", err);
    }
  }, [location.pathname]);

  return null;
}
