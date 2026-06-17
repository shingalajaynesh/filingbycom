import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { m } from "framer-motion";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/blogs/${slug}`);
        if (res.data.success) {
          const fetchedPost = res.data.post;
          setPost(fetchedPost);
          
          // Fetch related posts from the same category
          try {
            const relatedRes = await axios.get(`${API_BASE}/blogs`, {
              params: { category: fetchedPost.category, limit: 3 }
            });
            if (relatedRes.data.success) {
              setRelatedPosts(
                (relatedRes.data.posts || []).filter((p) => p.slug !== slug)
              );
            }
          } catch (e) {
            console.error("Failed to load related posts:", e);
          }
        }
      } catch (err) {
        console.error("Failed to load blog details:", err);
        setError("Article not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Loading article details...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="mt-4 text-lg font-bold text-slate-900">{error || "Article Not Found"}</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-xs">
          The guide you are looking for might have been moved or deleted.
        </p>
        <Link
          to="/blog"
          className="mt-6 rounded-full bg-[#1A56DB] px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
        >
          Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  // Build JSON-LD structured Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://filingby.com/blog/${post.slug}#article`,
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.author || "FilingBy Legal Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FilingBy.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://filingby.com/logo.jpeg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://filingby.com/blog/${post.slug}`
    }
  };

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <m.div
      key={slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      <SEO
        title={`${post.metaTitle || post.title} | FilingBy.com`}
        description={post.metaDescription || post.excerpt}
        keywords={post.keywords || `${post.title.toLowerCase()}, filingby blog`}
        canonical={`/blog/${post.slug}`}
        schema={articleSchema}
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Knowledge Hub", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-blue-600">Knowledge Hub</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 line-clamp-1">{post.title}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-10">
          {/* Left Main Content */}
          <div className="lg:col-span-2">
            <m.article
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10"
            >
              {/* Category & Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[#1A56DB]">
                <span className="rounded-full bg-blue-50 px-3 py-1">{post.category}</span>
                <span className="text-slate-400 font-medium lowercase italic">{post.readTime} min read</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-medium">{formattedDate}</span>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
                {post.title}
              </h1>

              {/* Author Info */}
              <div className="mt-6 flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#1A56DB]">
                  FB
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Written by {post.author}</p>
                  <p className="text-[10px] text-slate-500">Legal & Corporate Compliance Advisory</p>
                </div>
              </div>

              {/* HTML Blog Content */}
              <div 
                className="mt-8 prose prose-slate max-w-none text-slate-650 text-sm sm:text-base leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 border-t border-slate-100 pt-6 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase mr-1 self-center">Tags:</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?search=${tag}`}
                      className="rounded-full bg-slate-150 border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 transition"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </m.article>
          </div>

          {/* Right Sidebar - Dynamic Conversion CTA */}
          <m.aside
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:sticky lg:top-24 lg:self-start space-y-6"
          >
            {/* Contextual Legal Registration Box */}
            <div className="rounded-3xl border border-[#1A56DB] bg-white p-6 shadow-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#1A56DB_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#1A56DB]">Assisted Compliance</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Need Help with {post.category}?
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Skip the complicated filings. Our qualified CA, CS, and corporate legal professionals process everything online with transparent pricing.
              </p>
              
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 w-full rounded-full bg-[#1A56DB] px-4 py-3 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer text-center"
              >
                Launch Application
              </button>
              
              <a
                href="https://wa.me/917567126945"
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center rounded-full border border-green-500 px-4 py-3 text-xs font-semibold text-green-600 hover:bg-green-50 transition"
              >
                WhatsApp Advisor
              </a>
            </div>

            {/* Quick Benefits Ticker */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Why Choose FilingBy</h4>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-[#1A56DB]">✓</span>
                  <span>100% Secure Data Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1A56DB]">✓</span>
                  <span>Direct CA/CS Desk Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1A56DB]">✓</span>
                  <span>Status Updates via WhatsApp/SMS</span>
                </div>
              </div>
            </div>
          </m.aside>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <m.section
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 border-t border-slate-200 pt-10"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">More from {post.category} Guides</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 3).map((item) => (
                <article
                  key={item.slug}
                  onClick={() => navigate(`/blog/${item.slug}`)}
                  className="rounded-2xl border border-slate-100 bg-white p-5 text-left transition hover:border-blue-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-[#1A56DB] uppercase tracking-wide">
                    Read Guide →
                  </p>
                </article>
              ))}
            </div>
          </m.section>
        )}
      </section>
    </m.div>
  );
}
