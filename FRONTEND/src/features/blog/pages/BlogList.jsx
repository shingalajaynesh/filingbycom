import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { m } from "framer-motion";
import SEO from "../../../shared/components/SEO.jsx";
import BlogCard from "../components/BlogCard.jsx";
import AdSenseBlock from "../../../shared/components/AdSenseBlock.jsx";
import { buildBlogListingSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

const CATEGORIES = ["All", "GST", "Company Registration", "Virtual Office"];

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 9,
        };

        if (activeCategory !== "All") {
          params.category = activeCategory;
        }

        const currentSearch = searchParams.get("search");
        if (currentSearch) {
          params.search = currentSearch;
        }

        const res = await axios.get(`${API_BASE}/blogs`, { params });
        if (res.data.success) {
          setPosts(res.data.posts || []);
          setPagination(res.data.pagination || { page: 1, limit: 9, total: 0, pages: 1 });
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, currentPage, searchParams]);

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (searchQuery.trim()) {
      newParams.set("search", searchQuery.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 py-10 text-slate-900"
    >
      <SEO
        title="Knowledge Hub & Compliance Guides | FilingBy.com"
        description="Stay up to date with expert Chartered Accountant advice, tax guides, GST compliance rules, startup incorporation tips, and virtual office regulations in India."
        keywords="filingby blog, CA blog india, GST guide, company registration rules, tax compliance articles, startup guides india"
        canonical="/blog"
        schema={buildBlogListingSchema(posts)}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Knowledge Hub", url: "/blog" }
          ])
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A56DB] bg-blue-50 px-3.5 py-1.5 rounded-full">
            Topical Knowledge Hub
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Legal & Tax Compliance Made Simple
          </h1>
          <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
            Read expert guides and articles designed to help Indian startups, e-commerce sellers, and business owners navigate GST registration, company filings, and tax laws.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6 mb-8">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#1A56DB] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-250 bg-white py-2 pl-4 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#1A56DB] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1A56DB] cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>

        {/* Post Grid */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-4xl">📚</span>
            <h3 className="mt-4 text-base font-bold text-slate-900">No Articles Found</h3>
            <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">
              We couldn't find any articles matching your search criteria. Try changing filters or keyword search.
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchQuery("");
              }}
              className="mt-4 rounded-full bg-slate-100 border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <div key={post.slug} className="contents">
                  <BlogCard post={post} />
                  {index === 2 && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <AdSenseBlock
                        slot={import.meta.env.VITE_ADSENSE_BLOG_LIST_SLOT}
                        label="Knowledge Hub Sponsor"
                        className="border-dashed"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-full border border-slate-250 bg-white p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className="text-xs font-bold text-slate-500 tracking-wider">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-full border border-slate-250 bg-white p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </m.main>
  );
}
