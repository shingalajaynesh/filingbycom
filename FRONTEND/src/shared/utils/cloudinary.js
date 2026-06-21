/**
 * Optimizes a Cloudinary image URL by injecting auto-format and auto-quality parameters
 * to minimize bandwidth consumption and improve Largest Contentful Paint (LCP).
 * 
 * @param {string} url - The raw Cloudinary image URL
 * @returns {string} The optimized URL
 */
export function optimizeCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return url;
  
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // Avoid double transformations if format or quality is already specified
    if (url.includes("/f_auto") || url.includes("/q_auto")) {
      return url;
    }
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  
  return url;
}
