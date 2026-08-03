/**
 * Google-served ads are only allowed on routes with substantial publisher content.
 * Keep this as an allowlist so new utility, auth, dashboard, redirect, or thin pages
 * do not accidentally become monetized.
 */
export function isAdSenseEligibleRoute(pathname) {
  return /^\/blog\/[^/?#]+\/?$/.test(pathname);
}

export function hasSubstantialPublisherContent(htmlContent, minimumWords = 700) {
  if (!htmlContent) {
    return false;
  }

  const text = htmlContent
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return false;
  }

  return text.split(/\s+/).length >= minimumWords;
}
