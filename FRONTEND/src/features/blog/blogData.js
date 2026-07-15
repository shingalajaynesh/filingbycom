import axios from "axios";
import { getInitialBlogPayload } from "../../shared/utils/prerender.js";

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const postCache = new Map();
const postRequestCache = new Map();
const relatedRequestCache = new Map();

function normalizePostSummary(post) {
  if (!post) {
    return post;
  }

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    image: post.image || post.featuredImage,
    focusKeyword: post.focusKeyword,
  };
}

export function getCachedBlogPost(slug) {
  if (!slug) {
    return null;
  }

  return postCache.get(slug) || getInitialBlogPayload(slug)?.post || null;
}

export function primeBlogPost(post) {
  if (!post?.slug) {
    return null;
  }

  postCache.set(post.slug, post);
  return post;
}

export async function fetchBlogPost(slug, options = {}) {
  const { signal, force = false } = options;
  if (!slug) {
    return null;
  }

  if (!force) {
    const cached = getCachedBlogPost(slug);
    if (cached) {
      return cached;
    }
  }

  if (!force && postRequestCache.has(slug)) {
    return postRequestCache.get(slug);
  }

  const request = axios
    .get(`${API_BASE}/blogs/${slug}`, { signal })
    .then((response) => {
      if (!response.data?.success || !response.data?.post) {
        throw new Error("Blog post not found");
      }

      return primeBlogPost(response.data.post);
    })
    .finally(() => {
      postRequestCache.delete(slug);
    });

  postRequestCache.set(slug, request);
  return request;
}

export async function fetchRelatedBlogPosts(category, excludeSlug, limit = 4, signal) {
  if (!category) {
    return [];
  }

  const requestKey = `${category}:${excludeSlug || ""}:${limit}`;
  if (relatedRequestCache.has(requestKey)) {
    return relatedRequestCache.get(requestKey);
  }

  const request = axios
    .get(`${API_BASE}/blogs`, {
      params: { category, limit },
      signal,
    })
    .then((response) => {
      if (!response.data?.success) {
        return [];
      }

      return (response.data.posts || [])
        .filter((item) => item.slug !== excludeSlug)
        .map(normalizePostSummary);
    })
    .finally(() => {
      relatedRequestCache.delete(requestKey);
    });

  relatedRequestCache.set(requestKey, request);
  return request;
}

export function preloadBlogDetailRoute() {
  return import("./pages/BlogDetail.jsx");
}

export function preloadBlogListRoute() {
  return import("./pages/BlogList.jsx");
}

export function prefetchBlogPost(slug) {
  return Promise.allSettled([
    preloadBlogDetailRoute(),
    fetchBlogPost(slug).catch(() => null),
  ]);
}
