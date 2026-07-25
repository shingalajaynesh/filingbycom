/**
 * Checks if a string is a valid HTTP/HTTPS/data/blob image URL or root path.
 * Prevents plain text (e.g. lorem ipsum) from being rendered as relative image URLs.
 * 
 * @param {string} url - The URL candidate
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("/")
  );
}

/**
 * Optimizes a Cloudinary image URL by injecting auto-format and auto-quality parameters
 * to minimize bandwidth consumption and improve Largest Contentful Paint (LCP).
 * 
 * @param {string} url - The raw Cloudinary image URL
 * @param {string} fallback - Fallback URL if invalid
 * @returns {string} The optimized URL or fallback
 */
export function optimizeCloudinaryUrl(url, fallback = "") {
  if (!isValidImageUrl(url)) return fallback;
  
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // Avoid double transformations if format or quality is already specified
    if (url.includes("/f_auto") || url.includes("/q_auto")) {
      return url;
    }
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  
  return url;
}

