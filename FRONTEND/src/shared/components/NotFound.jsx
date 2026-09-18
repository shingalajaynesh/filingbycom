import { useNavigate, Link } from "react-router-dom";
import SEO from "./SEO.jsx";
import { PortalCard, PortalPageShell } from "../../features/ca-portal/components/PortalPageShell.jsx";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="404 Page Not Found & Directory Guide | FilingBy.com"
        description="The page you requested could not be found. Use FilingBy's quick directory links to navigate to CA services, virtual offices, calculators, or blogs."
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
}
