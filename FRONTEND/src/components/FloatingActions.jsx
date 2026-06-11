import { useEffect, useState } from "react";

export default function FloatingActions() {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-white shadow-lg transition-all hover:bg-blue-700 lg:right-6 lg:hidden"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
}
