import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";

// Simple Levenshtein distance check for spelling mistake suggestions
function getFuzzyDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export default function SmartSearchPanel({ onClose }) {
  const { services } = useSharedData();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popular] = useState([
    { name: "GST Registration", path: "/services/gst-registration" },
    { name: "Private Limited Company Setup", path: "/services/private-limited-company" },
    { name: "HRA Tax Exemption Calculator", path: "/calculators/hra" },
    { name: "Mutual Non-Disclosure Agreement (NDA)", path: "/templates/nda" }
  ]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }

    const keyword = val.toLowerCase().trim();
    if (!services || services.length === 0) return;

    // Filter backend services based on keyword contains OR fuzzy matching
    const matched = services.filter(s => {
      const matchName = s.name.toLowerCase().includes(keyword);
      const matchCat = s.category?.toLowerCase().includes(keyword);
      const fuzzyMatch = getFuzzyDistance(s.name, val) <= 3; // Typo tolerance check
      return (matchName || matchCat || fuzzyMatch) && s.isActive !== false;
    });

    setResults(matched.slice(0, 5));
  };

  const handleSaveRecent = (name, path) => {
    const updated = [{ name, path }, ...recent.filter(item => item.name !== name)].slice(0, 3);
    setRecent(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[70vh]">
        
        {/* Search Header Form */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            placeholder="Search registrations, calculators, templates..."
            className="flex-1 text-slate-800 text-sm font-bold border-none outline-none focus:ring-0 focus:ring-offset-0 bg-transparent"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-extrabold text-sm cursor-pointer border-none bg-transparent"
          >
            Close ✕
          </button>
        </div>

        {/* Suggestion & Results Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-left">
          {query.trim().length > 0 ? (
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-3">Matched compliance Services</span>
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/services/${item.slug}`}
                      onClick={() => handleSaveRecent(item.name, `/services/${item.slug}`)}
                      className="block p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 transition-all"
                    >
                      <span className="text-xs font-black text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-[#1A56DB] font-bold mt-1 block">Category: {item.category || "General Services"}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium">No direct matching registrations found. Try search keywords like 'GST' or 'Company'.</p>
              )}
            </div>
          ) : (
            <>
              {/* Popular Searches */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2.5">Popular Searches</span>
                <div className="flex flex-wrap gap-2">
                  {popular.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => handleSaveRecent(item.name, item.path)}
                      className="px-3.5 py-2 bg-slate-50 border border-slate-100 hover:border-blue-500 rounded-full text-xs font-bold text-slate-700 hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recent.length > 0 && (
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2.5">Recent Searches</span>
                  <div className="space-y-2">
                    {recent.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={onClose}
                        className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 hover:text-blue-600"
                      >
                        <span>🕒 {item.name}</span>
                        <span>➔</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
