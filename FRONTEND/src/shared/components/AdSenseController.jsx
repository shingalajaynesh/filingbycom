import { useEffect } from "react";
import { useLocation } from "react-router-dom";
/**
 * AdSenseController monitors route changes in the SPA.
 * Ads are paused on every route change and only resumed by an AdSenseBlock
 * that is rendered inside approved publisher content.
 */
export default function AdSenseController() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.ADSENSE_ALLOWED = false;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.pauseAdRequests = 1;
    } catch (err) {
      console.warn("AdSense controller state sync warning:", err);
    }
  }, [location.pathname]);

  return null;
}
