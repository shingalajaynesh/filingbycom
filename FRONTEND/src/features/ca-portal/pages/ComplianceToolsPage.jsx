import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { PortalCard, PortalPageShell } from "../components/PortalPageShell.jsx";

export default function ComplianceToolsPage() {
  const { toolSlug } = useParams();
  const [funding, setFunding] = useState("no");
  const [founders, setFounders] = useState("2");
  const [quizResult, setQuizResult] = useState(null);
  const [turnover, setTurnover] = useState(2500000);
  const [interstate, setInterstate] = useState(false);
  const [gstResult, setGstResult] = useState(null);
  const [tmSearch, setTmSearch] = useState("");
  const [tmResult, setTmResult] = useState(null);

  const handleQuiz = (e) => {
    e.preventDefault();
    if (funding === "yes") {
      setQuizResult({ name: "Private Limited Company", slug: "private-limited-company", desc: "Usually the strongest fit for equity funding, ESOP planning, and formal investor readiness." });
    } else if (Number(founders) === 1) {
      setQuizResult({ name: "One Person Company (OPC)", slug: "one-person-company", desc: "Useful for solo founders who want a formal entity with limited liability." });
    } else {
      setQuizResult({ name: "Limited Liability Partnership (LLP)", slug: "llp-registration", desc: "Often a strong fit for lean service businesses with two or more founders." });
    }
  };

  const handleGst = (e) => {
    e.preventDefault();
    const limit = interstate ? 0 : 2000000;
    if (Number(turnover) >= limit || interstate) {
      setGstResult({ eligible: true, desc: "Based on this broad input, GST registration is likely required. The final answer still depends on the actual supply profile and category." });
    } else {
      setGstResult({ eligible: false, desc: "Registration may not be mandatory on turnover alone, but voluntary registration can still make commercial sense in some cases." });
    }
  };

  const handleTmFinder = (e) => {
    e.preventDefault();
    const clean = tmSearch.toLowerCase();
    let classNo = "Class 9";
    let desc = "Software, electronics, and digital products.";

    if (clean.includes("cloth") || clean.includes("shoe") || clean.includes("apparel")) {
      classNo = "Class 25";
      desc = "Clothing, footwear, and headwear.";
    } else if (clean.includes("food") || clean.includes("cafe") || clean.includes("hotel")) {
      classNo = "Class 43";
      desc = "Food, beverage, and accommodation services.";
    } else if (clean.includes("consult") || clean.includes("legal") || clean.includes("audit")) {
      classNo = "Class 45";
      desc = "Legal, personal, regulatory, and certain advisory services.";
    }

    setTmResult({ classNo, desc });
  };

  return (
    <>
      <SEO
        title="Interactive Compliance Selector and Planning Tools | FilingBy"
        description="Verify startup eligibility, trademark classes, and GST threshold direction using practical FilingBy planning tools."
        canonical={`/tools/${toolSlug}`}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Compliance Tools", url: `/tools/${toolSlug}` },
          ]),
        ]}
      />

      <PortalPageShell
        badge="Interactive Tool"
        title="Compliance Planning Tools"
        description="Use these quick selectors to estimate the right filing path before you move into full registration or expert review."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Tools" },
        ]}
      >
        {toolSlug === "structure-selector" ? (
          <PortalCard eyebrow="Interactive Selector" title="Business Structure Selector Quiz" description="Answer a few practical questions to narrow down the right entity route.">
            <form onSubmit={handleQuiz} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Do you plan to raise venture or angel funding?</label>
                <select value={funding} onChange={(e) => setFunding(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
                  <option value="no">No, mostly self-funded or debt-funded</option>
                  <option value="yes">Yes, I may raise equity funding</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Number of founders</label>
                <select value={founders} onChange={(e) => setFounders(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
                  <option value="1">Exactly 1 founder</option>
                  <option value="2">2 or more founders</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded-xl border-0 bg-[#1A56DB] py-3 text-xs font-bold text-white cursor-pointer hover:bg-blue-700">Find Best Structure</button>
            </form>

            {quizResult ? (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <span className="text-[10px] font-black uppercase text-slate-400">Recommended setup</span>
                <h3 className="mt-2 text-sm font-black text-slate-900">{quizResult.name}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">{quizResult.desc}</p>
                <Link to={`/services/${quizResult.slug}`} className="mt-3 inline-block text-xs font-black text-[#1A56DB] hover:underline">Open service page</Link>
              </div>
            ) : null}
          </PortalCard>
        ) : null}

        {toolSlug === "gst-eligibility" ? (
          <PortalCard eyebrow="Compliance Checker" title="GST Registration Eligibility Checker" description="Check the broad threshold logic before you prepare a GST application.">
            <form onSubmit={handleGst} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Estimated annual turnover (in INR)</label>
                <input type="number" value={turnover} onChange={(e) => setTurnover(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={interstate} onChange={(e) => setInterstate(e.target.checked)} id="interstate" />
                <label htmlFor="interstate" className="text-xs font-bold text-slate-500">Do you supply across state boundaries?</label>
              </div>
              <button type="submit" className="w-full rounded-xl border-0 bg-[#1A56DB] py-3 text-xs font-bold text-white cursor-pointer hover:bg-blue-700">Verify Eligibility</button>
            </form>

            {gstResult ? (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className={`text-sm font-black ${gstResult.eligible ? "text-amber-800" : "text-emerald-800"}`}>
                  {gstResult.eligible ? "GST registration likely required" : "GST registration may not be mandatory"}
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">{gstResult.desc}</p>
                <Link to="/services/gst-registration" className="mt-3 inline-block text-xs font-black text-[#1A56DB] hover:underline">Open GST service</Link>
              </div>
            ) : null}
          </PortalCard>
        ) : null}

        {toolSlug === "trademark-class" ? (
          <PortalCard eyebrow="Trademark Tool" title="Trademark Class Finder Lookup" description="Use a plain-language product or service description to get a quick class direction.">
            <form onSubmit={handleTmFinder} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Business description or product type</label>
                <input
                  type="text"
                  required
                  placeholder="For example: clothing shop, accounting app"
                  value={tmSearch}
                  onChange={(e) => setTmSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full rounded-xl border-0 bg-[#1A56DB] py-3 text-xs font-bold text-white cursor-pointer hover:bg-blue-700">Find Class</button>
            </form>

            {tmResult ? (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <span className="text-[10px] font-black uppercase text-slate-400">Suggested class</span>
                <h3 className="mt-2 text-sm font-black text-slate-900">{tmResult.classNo}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">{tmResult.desc}</p>
                <Link to="/services/trademark-registration" className="mt-3 inline-block text-xs font-black text-[#1A56DB] hover:underline">Open trademark service</Link>
              </div>
            ) : null}
          </PortalCard>
        ) : null}
      </PortalPageShell>
    </>
  );
}
