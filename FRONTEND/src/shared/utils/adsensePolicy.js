/**
 * Google-served ads are only allowed on routes with substantial publisher content.
 * Keep this as an allowlist so new utility, auth, dashboard, redirect, or thin pages
 * do not accidentally become monetized.
 */
export function isAdSenseEligibleRoute(pathname) {
  return pathname === "/blog" || pathname.startsWith("/blog/");
}
