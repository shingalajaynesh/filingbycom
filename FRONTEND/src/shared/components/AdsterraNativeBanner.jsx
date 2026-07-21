import { useEffect, useRef, useId } from "react";

/**
 * AdsterraNativeBanner component mounts the asynchronous Adsterra Native Banner.
 * It manages script loading and cleanup to prevent duplicates on page navigation.
 * 
 * @param {Object} props
 * @param {string} [props.className] Optional extra styles
 * @param {string} [props.label="Sponsored"] Header text for the ad block
 */
export default function AdsterraNativeBanner({ className = "", label = "Sponsored" }) {
  const containerRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing children to prevent duplicates on hot-reload/remount
    containerRef.current.innerHTML = "";

    // Create the container element expected by the Adsterra script
    const targetDiv = document.createElement("div");
    targetDiv.id = "container-1022a16602aca928695f4d38db2cd23c";
    containerRef.current.appendChild(targetDiv);

    // Create and configure the script element
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl30468922.effectivecpmnetwork.com/1022a16602aca928695f4d38db2cd23c/invoke.js";

    containerRef.current.appendChild(script);

    return () => {
      // Clean up DOM on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <section
      aria-labelledby={titleId}
      className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${className}`.trim()}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
          {label}
        </h2>
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
          Partner Offer
        </span>
      </div>
      
      {/* Wrapper to hold dynamically injected Adsterra div and script */}
      <div ref={containerRef} className="w-full min-h-[120px] overflow-hidden rounded-2xl" />
    </section>
  );
}
