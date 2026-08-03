import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { m } from "framer-motion";
import SEO from "../../../shared/components/SEO.jsx";
import { optimizeCloudinaryUrl } from "../../../shared/utils/cloudinary.js";
import BlogCard from "../components/BlogCard.jsx";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "../../../shared/seo/schemas.js";
import { resolveAuthorProfile, resolveReviewerProfile } from "../contentProfiles.js";
import {
  fetchBlogPost,
  fetchRelatedBlogPosts,
  getCachedBlogPost,
} from "../blogData.js";
import { getInitialBlogPayload, revealPrerenderShell } from "../../../shared/utils/prerender.js";


const categoryServiceMap = {
  GST: [
    { label: "GST Registration", href: "/services/gst-registration" },
    { label: "GST Return Filing", href: "/services/gst-return-filing" },
  ],
  "Company Registration": [
    { label: "Private Limited Company", href: "/services/private-limited-company" },
    { label: "LLP Registration", href: "/services/llp-registration" },
  ],
  LLP: [
    { label: "LLP Registration", href: "/services/llp-registration" },
    { label: "Private Limited Company", href: "/services/private-limited-company" },
  ],
  Trademark: [
    { label: "Trademark Registration", href: "/services/trademark-registration" },
    { label: "Trademark Objection Reply", href: "/services/trademark-objection" },
  ],
  "Income Tax": [
    { label: "ITR Filing", href: "/services/itr-filing" },
    { label: "Tax Audit", href: "/services/tax-audit" },
  ],
  TDS: [
    { label: "TDS Return Filing", href: "/services/tds-return-filing" },
    { label: "Talk to an Expert", href: "/dashboard" },
  ],
  "Virtual Office": [
    { label: "Virtual Office", href: "/virtual-space" },
    { label: "All Locations", href: "/locations" },
  ],
  "Startup India": [
    { label: "Private Limited Company", href: "/services/private-limited-company" },
    { label: "LLP Registration", href: "/services/llp-registration" },
  ],
  MSME: [
    { label: "MSME Registration", href: "/services/udyam-registration" },
    { label: "GST Registration", href: "/services/gst-registration" },
  ],
  FSSAI: [
    { label: "FSSAI Registration", href: "/services/fssai-registration" },
    { label: "GST Registration", href: "/services/gst-registration" },
  ],
  IEC: [
    { label: "IEC Registration", href: "/services/iec-registration" },
    { label: "GST Registration", href: "/services/gst-registration" },
  ],
  "ROC Compliance": [
    { label: "Private Limited Company", href: "/services/private-limited-company" },
    { label: "LLP Registration", href: "/services/llp-registration" },
  ],
};

const serviceLinkMap = {
  "gst-registration": { label: "GST Registration", href: "/services/gst-registration" },
  "gst-return-filing": { label: "GST Return Filing", href: "/services/gst-return-filing" },
  "gst-filing": { label: "GST Filing", href: "/services/gst-return-filing" },
  "private-limited-company": { label: "Private Limited Company", href: "/services/private-limited-company" },
  "llp-registration": { label: "LLP Registration", href: "/services/llp-registration" },
  "trademark-registration": { label: "Trademark Registration", href: "/services/trademark-registration" },
  "trademark-objection": { label: "Trademark Objection Reply", href: "/services/trademark-objection" },
  "itr-filing": { label: "ITR Filing", href: "/services/itr-filing" },
  "tax-audit": { label: "Tax Audit", href: "/services/tax-audit" },
  "virtual-office": { label: "Virtual Office", href: "/virtual-space" },
  "virtual-space": { label: "Virtual Office", href: "/virtual-space" },
  "msme-registration": { label: "MSME Registration", href: "/services/udyam-registration" },
  "udyam-registration": { label: "MSME Registration", href: "/services/udyam-registration" },
  "fssai-registration": { label: "FSSAI Registration", href: "/services/fssai-registration" },
  "iec-registration": { label: "IEC Registration", href: "/services/iec-registration" },
  "tds-return-filing": { label: "TDS Return Filing", href: "/services/tds-return-filing" },
};

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function resolveResourceLabel(value) {
  if (value.startsWith("/blog?category=")) {
    const category = decodeURIComponent(value.split("=")[1] || "");
    return `${category} Guides`;
  }

  const explicit = {
    "/virtual-space": "Virtual Office Solutions",
    "/locations": "Virtual Office Locations",
    "/gst-calculator": "GST Calculator",
    "/income-tax-calculator": "Income Tax Calculator",
    "/trademark-search": "Trademark Search Tool",
    "/services/gst-registration": "GST Registration Service",
    "/services/gst-return-filing": "GST Return Filing Service",
    "/services/private-limited-company": "Private Limited Company Registration",
    "/services/llp-registration": "LLP Registration Service",
    "/services/trademark-registration": "Trademark Registration Service",
    "/services/trademark-objection": "Trademark Objection Reply Service",
    "/services/itr-filing": "ITR Filing Service",
    "/services/tax-audit": "Tax Audit Support",
    "/services/fssai-registration": "FSSAI Registration Service",
    "/services/iec-registration": "IEC Registration Service",
    "/services/udyam-registration": "MSME / Udyam Registration Service",
    "/services/msme-registration": "MSME / Udyam Registration Service",
    "/services/tds-return-filing": "TDS Return Filing Service",
  };

  if (explicit[value]) {
    return explicit[value];
  }

  return value
    .replace(/^\/+/, "")
    .replace(/[?=&%]+/g, " ")
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeTocEntry(item) {
  if (typeof item === "string") {
    return {
      text: item,
      id: item.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-"),
      level: 2,
    };
  }

  return item;
}

function buildMetaCards({ post, publishedDate, updatedDate, verifiedDate, sourceCount }) {
  return [
    { label: "Category", value: post.category || "Business compliance" },
    { label: "Reading time", value: post.readingTime || `${post.readTime} min read` },
    { label: "Last updated", value: updatedDate || publishedDate || "Recently updated" },
    { label: "Last verified", value: verifiedDate || updatedDate || publishedDate || "Editorial review" },
    { label: "Sources", value: `${sourceCount} reference${sourceCount === 1 ? "" : "s"}` },
  ];
}

function stripDuplicateArticleSections(htmlContent) {
  if (!htmlContent) return "";

  let cleaned = htmlContent.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "");

  const redundantSectionIds = [
    "faqs",
    "authoritative-references",
    "related-resources-and-services",
    "cta",
    "internal-links",
    "related-calculators-and-templates",
    "related-services",
  ];

  for (const sectionId of redundantSectionIds) {
    const sectionPattern = new RegExp(
      `<h2\\b[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?<\\/h2>[\\s\\S]*?(?=<h2\\b|$)`,
      "i"
    );
    cleaned = cleaned.replace(sectionPattern, "");
  }

  return cleaned.trim();
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const initialPayload = getInitialBlogPayload(slug);
  const initialPost = initialPayload?.post || getCachedBlogPost(slug);
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState(initialPayload?.relatedPosts || []);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchPostDetail = async () => {
      try {
        const fetchedPost = await fetchBlogPost(slug, {
          signal: controller.signal,
          force: Boolean(initialPayload?.post),
        });

        if (!isActive) {
          return;
        }

        setPost(fetchedPost);
        setError(null);
        setLoading(false);

        if (!initialPayload?.relatedPosts?.length && fetchedPost?.category) {
          const fetchedRelatedPosts = await fetchRelatedBlogPosts(
            fetchedPost.category,
            slug,
            4,
            controller.signal
          );
          if (isActive) {
            setRelatedPosts(fetchedRelatedPosts);
          }
        }
      } catch (requestError) {
        if (axios.isCancel(requestError) || requestError.name === "CanceledError" || requestError.name === "AbortError") {
          return;
        }

        console.error("Failed to load blog details:", requestError);
        if (isActive) {
          setError("Article not found or server error.");
          setLoading(false);
        }
      } finally {
        if (isActive && initialPayload?.post) {
          revealPrerenderShell();
        }
      }
    };

    setError(null);
    setRelatedPosts(initialPayload?.relatedPosts || []);

    if (initialPayload?.post) {
      setPost(initialPayload.post);
      setLoading(false);
      setError(null);
      revealPrerenderShell();
    } else {
      setPost(initialPost || null);
      setLoading(!initialPost);
    }

    fetchPostDetail();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [initialPayload, initialPost, slug]);

  useEffect(() => {
    if (post) {
      revealPrerenderShell();
    }
  }, [post]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A56DB] border-t-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading article details...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <span className="text-4xl">!</span>
        <h2 className="mt-4 text-lg font-bold text-slate-900">{error || "Article Not Found"}</h2>
        <p className="mt-2 max-w-xs text-xs text-slate-500">
          The guide you are looking for might have been moved or deleted.
        </p>
        <Link
          to="/blog"
          className="mt-6 rounded-full bg-[#1A56DB] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
        >
          Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  const articleSchema = buildBlogPostingSchema(post);
  const faqSchema = buildFaqSchema(post.faq || []);
  const authorProfile = resolveAuthorProfile(post);
  const reviewerProfile = resolveReviewerProfile(post);
  const publishedDate = formatDate(post.publishedAt || post.createdAt);
  const updatedDate = formatDate(post.lastUpdated || post.updatedAt || post.createdAt);
  const verifiedDate = formatDate(post.lastVerifiedAt);
  const coverImage = post.featuredImage || post.image;
  const cleanedContent = stripDuplicateArticleSections(post.content);
  const publicSources = post.sources?.length > 0 ? post.sources : post.references || [];
  const publicGallery = (post.imageGallery || []).filter((item) => item.url && item.alt && item.width && item.height);
  const tocEntries = (post.tableOfContents || []).map(normalizeTocEntry).filter(Boolean);
  const relatedServiceLinks = (post.relatedServices || []).map((slugKey) => serviceLinkMap[slugKey]).filter(Boolean);
  const fallbackLinks = categoryServiceMap[post.category] || [
    { label: "Explore Services", href: "/services/gst-registration" },
    { label: "Talk to an Expert", href: "/dashboard" },
  ];
  const ctaLinks = relatedServiceLinks.length > 0 ? relatedServiceLinks : fallbackLinks;
  const metaCards = buildMetaCards({
    post,
    publishedDate,
    updatedDate,
    verifiedDate,
    sourceCount: publicSources.length,
  });

  const relatedResourceLinks = [
    ...(post.topicHub ? [post.topicHub] : []),
    ...(post.internalLinks || []),
    ...(post.relatedCalculators || []),
    ...(post.relatedTemplates || []),
  ];

  return (
    <m.main
      key={slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-slate-50 text-gray-900"
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
          faqSchema,
        ].filter(Boolean)}
      />

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1A56DB] transition hover:bg-blue-100"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>

          <nav className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-[#1A56DB]">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[#1A56DB]">
              Blog
            </Link>
            <span>/</span>
            <span className="line-clamp-1 font-semibold text-slate-900">{post.title}</span>
          </nav>

          <div className="mt-6">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A56DB]">
              {post.category}
            </span>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
              {post.metaDescription || post.excerpt}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metaCards.map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#1A56DB]">
                  FB
                </div>
                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Author</p>
                    <p className="mt-2 text-sm font-bold text-gray-900">{authorProfile.name}</p>
                    <p className="mt-1 text-xs leading-6 text-gray-500">{authorProfile.bio}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Reviewed by</p>
                    <p className="mt-2 text-sm font-bold text-gray-900">
                      {reviewerProfile.prefix} {reviewerProfile.name}
                    </p>
                    {reviewerProfile.title ? <p className="mt-1 text-xs leading-6 text-gray-500">{reviewerProfile.title}</p> : null}
                    {reviewerProfile.experience ? (
                      <p className="mt-1 text-xs leading-6 text-gray-500">{reviewerProfile.experience}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A56DB]">Trust note</p>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                This guide is reviewed against cited sources, regulator guidance, and FilingBy editorial standards. It
                is educational content and should not replace personalised legal, tax, or accounting advice for your
                specific facts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            {coverImage ? (
              <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
                <div className="aspect-video bg-slate-50 md:aspect-[16/7]">
                  <img
                    src={optimizeCloudinaryUrl(coverImage)}
                    alt={post.imageAlt || post.title}
                    width={post.featuredImageWidth || undefined}
                    height={post.featuredImageHeight || undefined}
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : null}

            {post.keyTakeaways?.length > 0 ? (
              <section className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Key takeaways</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
                  {post.keyTakeaways.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 text-amber-600">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-8 rounded-[30px] border border-gray-100 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-9">
              <div
                className="prose prose-slate max-w-none text-[16px] leading-8 text-gray-700 prose-a:text-[#1A56DB] prose-a:no-underline hover:prose-a:underline [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:border-b [&_h2]:border-l-4 [&_h2]:border-b-gray-200 [&_h2]:border-l-[#1A56DB] [&_h2]:pb-5 [&_h2]:pl-5 [&_h2]:text-[2.2rem] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-gray-950 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.55rem] [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:text-gray-950 [&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-[1.2rem] [&_h4]:font-semibold [&_h4]:text-gray-950 [&_p]:my-6 [&_p]:text-[1.08rem] [&_p]:leading-9 [&_p]:text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-950 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-4 [&_ul]:pl-8 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-4 [&_ol]:pl-8 [&_li]:text-[1.05rem] [&_li]:leading-9 [&_li]:text-gray-600 [&_li::marker]:font-semibold [&_li::marker]:text-[#1A56DB] [&_blockquote]:my-8 [&_blockquote]:rounded-[24px] [&_blockquote]:border-l-4 [&_blockquote]:border-l-[#1A56DB] [&_blockquote]:bg-blue-50 [&_blockquote]:px-8 [&_blockquote]:py-7 [&_blockquote]:shadow-none [&_blockquote]:not-italic [&_blockquote_p]:my-0 [&_blockquote_p]:text-[1.08rem] [&_blockquote_p]:leading-9 [&_blockquote_p]:text-gray-700 [&_hr]:my-12 [&_hr]:border-gray-200 [&_table]:my-8 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-[22px] [&_table]:border [&_table]:border-gray-200 [&_table]:bg-white [&_thead]:bg-slate-50 [&_th]:border-b [&_th]:border-gray-200 [&_th]:px-5 [&_th]:py-4 [&_th]:text-left [&_th]:text-sm [&_th]:font-bold [&_th]:text-gray-900 [&_td]:border-b [&_td]:border-gray-200 [&_td]:px-5 [&_td]:py-5 [&_td]:text-[15px] [&_td]:leading-7 [&_td]:text-gray-600 [&_tr:last-child_td]:border-b-0 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-[22px] [&_pre]:border [&_pre]:border-gray-200 [&_pre]:bg-slate-50 [&_pre]:px-6 [&_pre]:py-5 [&_pre]:text-[15px] [&_pre]:leading-7 [&_.article-table]:block [&_.article-table]:w-full [&_.article-table]:overflow-x-auto [&_.article-table]:rounded-[22px]"
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
              />
            </div>

            {publicGallery.length > 0 ? (
              <section className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Article visuals</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Suggested diagrams and supporting visuals</h2>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-gray-500">
                    These image suggestions help the article feel more complete when used in production layouts.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {publicGallery.map((image, index) => (
                    <figure key={`${image.alt}-${index}`} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                      <div className="aspect-[4/3] bg-slate-50">
                        <img
                          src={optimizeCloudinaryUrl(image.url)}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <figcaption className="border-t border-gray-100 p-4">
                        <p className="text-sm font-semibold text-gray-900">{image.caption}</p>
                        <p className="mt-1 text-xs text-gray-500">{image.alt}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {post.faq?.length > 0 ? (
              <section className="mt-8 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">FAQs</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">Frequently asked questions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {post.faq.map((item) => (
                    <details key={item.q} className="px-6 py-5">
                      <summary className="cursor-pointer list-none pr-8 text-sm font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
                        {item.q}
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-gray-600">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {publicSources.length > 0 ? (
              <section className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Sources</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Authoritative references</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
                  These public sources help readers cross-check important rules, thresholds, forms, and process details.
                </p>

                <div className="mt-6 space-y-3">
                  {publicSources.map((reference) => (
                    <a
                      key={reference.url}
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-gray-100 bg-slate-50 px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <p className="text-sm font-bold text-gray-900">{reference.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {reference.organisation || reference.publisher}
                        {reference.accessedOn ? ` | Accessed ${reference.accessedOn}` : ""}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            {post.versionHistory?.length > 0 ? (
              <section className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Article history</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">What changed in this guide</h2>
                <div className="mt-5 space-y-3">
                  {post.versionHistory.map((entry, index) => (
                    <div key={`${entry.date}-${index}`} className="rounded-2xl border border-gray-100 bg-slate-50 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A56DB]">{entry.date}</p>
                      <p className="mt-2 text-sm leading-7 text-gray-700">{entry.change}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedResourceLinks.length > 0 ? (
              <section className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Related resources</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Continue your research</h2>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  These related pages help readers move from explanation to action without restarting their research.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {relatedResourceLinks.map((href) => (
                    <Link
                      key={href}
                      to={href}
                      className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-[#1A56DB] transition hover:bg-blue-100"
                    >
                      {resolveResourceLabel(href)}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8 rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Need help with this topic?</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Take the next practical step with FilingBy</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                If you want expert help instead of handling the next compliance step yourself, these are the most relevant FilingBy services for this topic.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {ctaLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="rounded-full bg-[#1A56DB] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-blue-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            {post.tags && post.tags.length > 0 ? (
              <section className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?search=${tag}`}
                      className="rounded-full border border-gray-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1A56DB]"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {tocEntries.length > 0 ? (
              <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#1A56DB]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
                      <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
                      <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <p className="text-[1.05rem] font-bold text-gray-950">On This Page</p>
                </div>

                <ul className="mt-5 space-y-3.5 text-[0.98rem] leading-7 text-gray-500">
                  {tocEntries.map((item) => (
                    <li key={item.id || item.text} className={item.level === 3 ? "pl-6" : ""}>
                      <a
                        href={`#${item.id}`}
                        className={`inline-flex gap-3 transition hover:text-[#1A56DB] ${
                          item.level === 2 ? "font-semibold text-gray-700" : "font-normal text-gray-500"
                        }`}
                      >
                        <span className={`mt-2 h-1.5 w-1.5 rounded-full ${item.level === 2 ? "bg-[#1A56DB]" : "bg-blue-200"}`} />
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Article details</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Focus keyword</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{post.focusKeyword || post.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Search intent</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{post.searchIntent || "Informational guide"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Published</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{publishedDate || updatedDate}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#1A56DB] bg-white p-5 shadow-md">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Assisted compliance</p>
              <h3 className="mt-2 text-xl font-bold text-gray-900">Need help with {post.category}?</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                FilingBy can help you understand documents, choose the right filing route, and handle the next compliance step properly.
              </p>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mt-5 w-full rounded-full bg-[#1A56DB] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
              >
                Launch Application
              </button>

              <a
                href="https://wa.me/917567126945"
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-green-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-green-600 transition hover:bg-green-50"
              >
                WhatsApp Advisor
              </a>
            </div>

          </aside>
        </div>

        {relatedPosts.length > 0 ? (
          <section className="mt-12 border-t border-gray-200 pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">More from this topic</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Continue reading {post.category} guides</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-gray-500">
                These articles are closely related to the same business or compliance decision area.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.slice(0, 3).map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </m.main>
  );
}
