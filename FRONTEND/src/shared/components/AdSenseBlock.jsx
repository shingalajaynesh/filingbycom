import { useEffect, useId, useRef } from "react";

export default function AdSenseBlock({
  slot,
  format = "auto",
  className = "",
  style = {},
  label = "Sponsored"
}) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT || "ca-pub-6303291083449043";
  const adRef = useRef(null);
  const pushedRef = useRef(false);
  const titleId = useId();

  useEffect(() => {
    if (!slot || !client || pushedRef.current || !adRef.current || typeof window === "undefined") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch (error) {
      console.error("AdSense failed to initialize:", error);
    }
  }, [client, slot]);

  if (!slot || !client || (typeof window !== "undefined" && window.ADSENSE_ALLOWED === false)) {
    return null;
  }

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
          Advertisement
        </span>
      </div>

      <ins
        ref={adRef}
        className="adsbygoogle block min-h-[120px] w-full overflow-hidden rounded-2xl"
        style={{ display: "block", ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </section>
  );
}
