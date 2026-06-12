import { useEffect, useState } from "react";

export default function FloatingActions() {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // React 18+ automatically bails out if the state boolean hasn't actually changed,
      // so this is safe to run on scroll without manually throttling it.
      setShowBackTop(window.scrollY > 300);
    };

    // 1. Passive Listener Optimization
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      // 2. CSS Mount/Unmount Animation & Accessibility Focus
      className={`fixed bottom-6 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 lg:right-6 lg:hidden ${
        showBackTop 
          ? "translate-y-0 opacity-100" 
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* 3. Replaced standard text '↑' with a crisp UI SVG icon */}
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}