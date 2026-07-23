import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("filingby_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const updateConsentMode = (granted) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied"
      });
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem("filingby_cookie_consent", "granted");
    updateConsentMode(true);
    setShowBanner(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem("filingby_cookie_consent", "denied");
    updateConsentMode(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-3xl shadow-2xl border border-slate-800 animate-fadeInUp">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍪</span>
          <h3 className="font-bold text-sm text-white">Cookie & Privacy Settings</h3>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-normal">
        We use essential cookies for site functionality and optional cookies (Google AdSense & Analytics) to measure performance and serve relevant ads. Review our{" "}
        <Link to="/default/privacy-policy" className="text-blue-400 underline font-semibold">Privacy Policy</Link>{" "}
        and{" "}
        <Link to="/default/cookie-policy" className="text-blue-400 underline font-semibold">Cookie Policy</Link>.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          onClick={handleAcceptAll}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
        >
          Accept All
        </button>
        <button
          onClick={handleRejectOptional}
          className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-full transition-all cursor-pointer active:scale-95"
        >
          Reject Optional
        </button>
      </div>
    </div>
  );
}
