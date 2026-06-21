import { Link } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../../shared/utils/cloudinary.js";

export default function BlogCard({ post }) {
  const { title, slug, excerpt, category, readTime, publishedAt, author, image } = post;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
      <div>
        {/* Cover Image */}
        <Link to={`/blog/${slug}`} className="block overflow-hidden relative aspect-video bg-slate-100 border-b border-slate-50">
          {image ? (
            <img
              src={optimizeCloudinaryUrl(image)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-350 bg-slate-50">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        <div className="p-6 pb-0">
          {/* Category & Read Time */}
          <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A56DB]">
            <span className="rounded-full bg-blue-50 px-2.5 py-1">{category}</span>
            <span className="text-slate-400 font-medium lowercase italic">{readTime} min read</span>
          </div>

          {/* Title */}
          <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            <Link to={`/blog/${slug}`}>{title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Footer Meta Details */}
      <div className="p-6 pt-4 mt-6 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex flex-col">
          <span>By {author}</span>
          <span className="mt-0.5 text-slate-350">{formattedDate}</span>
        </div>
        
        <Link 
          to={`/blog/${slug}`} 
          className="inline-flex items-center gap-1 font-bold text-[#1A56DB] group-hover:gap-1.5 transition-all text-sm uppercase tracking-wider"
        >
          Read Post
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
