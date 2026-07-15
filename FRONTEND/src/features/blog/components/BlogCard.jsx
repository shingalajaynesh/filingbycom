import { Link } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../../shared/utils/cloudinary.js";

function formatDate(dateValue) {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogCard({ post, featured = false }) {
  const {
    title,
    slug,
    excerpt,
    category,
    readTime,
    readingTime,
    publishedAt,
    updatedAt,
    author,
    image,
    focusKeyword,
  } = post;

  const publishedLabel = formatDate(publishedAt);
  const updatedLabel = formatDate(updatedAt);
  const readLabel = readingTime || `${readTime || 8} min read`;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md ${
        featured ? "" : "h-full"
      }`}
    >
      <Link
        to={`/blog/${slug}`}
        className={`relative block overflow-hidden bg-slate-100 ${featured ? "aspect-[16/10]" : "aspect-video"}`}
      >
        {image ? (
          <img
            src={optimizeCloudinaryUrl(image)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A56DB] shadow-sm">
            {category}
          </span>
          {focusKeyword ? (
            <span className="rounded-full bg-[#0F172A]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              {focusKeyword}
            </span>
          ) : null}
        </div>
      </Link>

      <div className={`flex flex-col ${featured ? "p-6" : "flex-1 p-6"}`}>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>{readLabel}</span>
          {publishedLabel ? <span>{publishedLabel}</span> : null}
          {updatedLabel && updatedLabel !== publishedLabel ? <span>Updated {updatedLabel}</span> : null}
        </div>

        <h3
          className={`mt-4 font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#1A56DB] ${
            featured ? "text-[2rem] sm:text-[2.15rem]" : "text-xl"
          }`}
        >
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>

        <p className={`mt-3 text-gray-600 ${featured ? "text-sm leading-6" : "text-sm leading-6"}`}>{excerpt}</p>

        <div className={featured ? "pt-6" : "mt-auto pt-6"}>
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{author || "FilingBy Editorial Desk"}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Reviewed practical guide</p>
              </div>

              <Link
                to={`/blog/${slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] transition-all group-hover:gap-3"
              >
                Read more
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
