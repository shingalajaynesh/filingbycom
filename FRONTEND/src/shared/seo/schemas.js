/**
 * schemas.js
 * Central library for structured JSON-LD schemas.
 * Standardizes schema generation for search engine indexing.
 */

export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://filingby.com/#organization",
  "name": "FilingBy.com",
  "url": "https://filingby.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://filingby.com/logo.jpeg",
    "width": 200,
    "height": 60
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-75671-26945",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/filingby",
    "https://twitter.com/FilingByCom",
    "https://www.facebook.com/filingbycom"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://filingby.com/#website",
  "url": "https://filingby.com",
  "name": "FilingBy.com",
  "publisher": {
    "@id": "https://filingby.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://filingby.com/services/{search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-IN"
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://filingby.com/#localbusiness",
  "name": "FilingBy CA & Business Services",
  "image": "https://filingby.com/logo.jpeg",
  "telephone": "+91-75671-26945",
  "email": "support@filingby.com",
  "url": "https://filingby.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "301, Business Hub, CG Road",
    "addressLocality": "Ahmedabad",
    "addressRegion": "Gujarat",
    "postalCode": "380009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "23.0225",
    "longitude": "72.5714"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "19:00"
  },
  "priceRange": "$$"
};

export const homeReviewsSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "FilingBy.com CA & Virtual Office Services",
  "image": "https://filingby.com/logo.jpeg",
  "description": "GST Registration, Company Incorporation, ITR Filing, and Premium Virtual Office Addresses across India.",
  "brand": {
    "@type": "Brand",
    "name": "FilingBy"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1280",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const virtualOfficeSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Virtual Office Address for GST Registration & Mailing",
  "description": "Premium virtual business addresses across 28 states in India. Includes NOC, utility bills, and rent agreement for hassle-free GST registration & corporate mailing.",
  "provider": {
    "@id": "https://filingby.com/#organization"
  },
  "areaServed": "IN",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "999.00",
    "priceValidUntil": "2027-12-31",
    "valueAddedTaxIncluded": "false"
  }
};

/**
 * Generates FAQ Page schema dynamically from a list of questions & answers.
 * @param {Array<{q: string, a: string}>} faqs
 */
export function buildFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

/**
 * Generates BreadcrumbList schema dynamically.
 * @param {Array<{name: string, url: string}>} items
 */
export function buildBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `https://filingby.com${item.url.startsWith('/') ? '' : '/'}${item.url}` : undefined
    }))
  };
}

/**
 * Generates Service schema dynamically.
 * @param {Object} service
 * @param {string} service.name
 * @param {string} service.description
 * @param {string} [service.price]
 * @param {string} [service.url]
 */
export function buildServiceSchema({ name, description, price = "999.00", url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@id": "https://filingby.com/#organization"
    },
    "areaServed": "IN",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": price,
      "url": url ? `https://filingby.com${url.startsWith('/') ? '' : '/'}${url}` : undefined
    }
  };
}

/**
 * Generates City-specific Virtual Office LocalBusiness & Service schemas.
 * @param {string} cityName
 */
export function buildCityVirtualOfficeSchema(cityName) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Virtual Office ${cityName} — FilingBy`,
    "description": `Get premium virtual business address in ${cityName} for GST registration, company incorporation, and business mailing with NOC & utility bills.`,
    "image": "https://filingby.com/logo.jpeg",
    "telephone": "+91-75671-26945",
    "url": `https://filingby.com/virtual-office-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": cityName,
      "addressCountry": "IN"
    },
    "priceRange": "$$"
  };
}
