import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { m } from "framer-motion";
import SEO from "../../../shared/components/SEO.jsx";
import BlogCard from "../components/BlogCard.jsx";
import AdSenseBlock from "../../../shared/components/AdSenseBlock.jsx";
import AdsterraNativeBanner from "../../../shared/components/AdsterraNativeBanner.jsx";
import { buildBlogListingSchema, buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const CATEGORIES = [
  "All",
  "GST",
  "Company Registration",
  "LLP",
  "Trademark",
  "Income Tax",
  "TDS",
  "Virtual Office",
  "Startup India",
  "MSME",
  "FSSAI",
  "IEC",
  "ROC Compliance",
];

const READER_SECTIONS = [
  {
    title: "Start a new business",
    description: "Best for founders choosing the right structure, registration path, and first compliance setup.",
    categories: ["Company Registration", "LLP", "Startup India"],
    href: "/blog?category=Company%20Registration",
  },
  {
    title: "Run compliance properly",
    description: "Best for businesses handling GST, TDS, ROC filings, and recurring statutory deadlines.",
    categories: ["GST", "TDS", "ROC Compliance"],
    href: "/blog?category=GST",
  },
  {
    title: "Expand and formalise",
    description: "Best for MSMEs adding licences, registrations, and growth-readiness for new channels or exports.",
    categories: ["MSME", "FSSAI", "IEC"],
    href: "/blog?category=MSME",
  },
];

function getCategoryHref(category) {
  return category === "All" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`;
}

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });

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
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, currentPage, searchParams]);

  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);
  const latestPosts = useMemo(() => posts.slice(3), [posts]);

  const readingMinutes = useMemo(() => {
    return posts.reduce((total, post) => total + Number.parseInt(post.readTime || "0", 10), 0);
  }, [posts]);

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", "1");

    if (category === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", category);
    }

    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", "1");

    if (searchQuery.trim()) {
      nextParams.set("search", searchQuery.trim());
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", nextPage.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-slate-50 text-gray-900"
    >
      <SEO
        title="Knowledge Hub & Compliance Guides | FilingBy.com"
        description="Explore FilingBy's knowledge hub for GST, tax, registration, startup, and compliance guides written for Indian business owners, MSMEs, and founders."
        keywords="filingby blog, GST guides india, company registration articles, startup compliance blog, tax guides for businesses"
        canonical={currentPage > 1 ? `/blog?page=${currentPage}` : "/blog"}
        schema={buildBlogListingSchema(posts)}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Knowledge Hub", url: "/blog" },
          ]),
        ]}
      />

      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
                FilingBy Knowledge Hub
              </div>
              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Learn business compliance in simple language before you file, register, or decide.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">
                Practical explainers on GST, company registration, LLP, trademark, income tax, TDS, Startup India,
                MSME, FSSAI, IEC, ROC compliance, and virtual office matters for Indian business owners and founders.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-100">Editorial Snapshot</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{pagination.total || posts.length}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-blue-100">Articles</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{readingMinutes || 0}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-blue-100">Min Read</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{CATEGORIES.length - 1}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-blue-100">Topics</p>
                </div>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-5">
                <label htmlFor="knowledge-hub-search" className="sr-only">
                  Search guides
                </label>
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    id="knowledge-hub-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search GST, ROC, company registration, tax..."
                    className="w-full border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#1A56DB] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Browse by topic</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Find the right guide faster</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-gray-500">
              Use topics to narrow down registrations, tax filings, statutory compliance, business setup, and industry-specific approvals.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${
                  activeCategory === category
                    ? "bg-[#1A56DB] text-white shadow-sm"
                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1A56DB]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {READER_SECTIONS.map((section) => (
            <Link
              key={section.title}
              to={section.href}
              className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB] focus-visible:ring-offset-2"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Reader Path</p>
              <h2 className="mt-3 text-xl font-bold text-gray-900 transition group-hover:text-[#1A56DB]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{section.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {section.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1A56DB] transition group-hover:bg-blue-100"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A56DB] border-t-transparent" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Loading articles</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">No matching articles</p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Nothing matched that search</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Try a broader keyword or switch to another topic. This hub covers GST, company registration, tax, ROC,
              trademark, Startup India, MSME, and more.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
                setSearchQuery("");
              }}
              className="mt-6 rounded-full bg-[#1A56DB] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">
                  {activeCategory === "All" ? "Featured reading" : `${activeCategory} guides`}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Start with the most important articles first
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-gray-500">
                These articles are a good starting point if you want clarity before taking any filing or registration step.
              </p>
            </div>

            <div className="mt-8 grid items-start gap-6 lg:grid-cols-12">
              {featuredPosts[0] ? (
                <div className="self-start lg:col-span-7">
                  <BlogCard post={featuredPosts[0]} featured />
                </div>
              ) : null}

              <div className="grid self-start gap-6 lg:col-span-5">
                {featuredPosts.slice(1).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <AdSenseBlock
                slot={import.meta.env.VITE_ADSENSE_BLOG_LIST_SLOT}
                label="Knowledge Hub Sponsor"
                className="border-dashed"
              />
              <AdsterraNativeBanner label="Partner Banner" className="border-dashed" />
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Latest articles</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">Explore more practical guides</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-gray-500">
                Every article is written for non-lawyers who still need dependable, business-ready guidance.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {(latestPosts.length > 0 ? latestPosts : posts).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {pagination.pages > 1 ? (
              <div className="mt-14 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 transition hover:border-blue-200 hover:text-[#1A56DB] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>
                <span className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 transition hover:border-blue-200 hover:text-[#1A56DB] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </m.main>
  );
}
