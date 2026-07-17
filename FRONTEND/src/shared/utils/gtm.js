/**
 * Google Tag Manager (GTM) Utility
 * Handles dynamic script injection, data layer pushes, and custom event tracking.
 */

// Initialize GTM container dynamically
export function initGTM(containerId) {
  if (typeof window === "undefined" || !containerId) return;

  // Prevent duplicate script execution
  if (window.GTM_INITIALIZED) return;
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${containerId}"]`)) {
    window.GTM_INITIALIZED = true;
    window.dataLayer = window.dataLayer || [];
    return;
  }
  window.GTM_INITIALIZED = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js"
  });

  const firstScript = document.getElementsByTagName("script")[0];
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
  
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

// Push generic objects safely to the dataLayer without breaking SSR
export function pushToDataLayer(data) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

// Track custom user events while enforcing privacy and PII protection rules
export function trackEvent(eventName, eventParams = {}) {
  // Enforce PII sanitization strictly before pushing to GTM dataLayer
  const sanitizedParams = sanitizePII(eventParams);

  pushToDataLayer({
    event: eventName,
    ...sanitizedParams
  });
}

// Helper to filter out sensitive PII keys (Full Name, Email, Phone, PAN, Aadhaar, Card, Password, OTP, etc.)
function sanitizePII(params) {
  if (!params || typeof params !== "object") return params;

  const PII_KEYS_BLACKLIST = [
    "name", "fullname", "email", "phone", "phonenumber", "mobile", 
    "password", "otp", "pan", "aadhaar", "address", "street", "city", 
    "zip", "postalcode", "documents", "bank", "card", "token", "clerkid",
    "cvv", "cardnumber", "accountnumber"
  ];

  const sanitized = {};
  for (const [key, value] of Object.entries(params)) {
    const keyLower = key.toLowerCase().replace(/[^a-z]/g, "");
    if (PII_KEYS_BLACKLIST.some(piiKey => keyLower.includes(piiKey))) {
      // Omit PII entirely to ensure absolute compliance with security rules
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}
