import { resolveAuthorProfile } from "../../features/blog/contentProfiles.js";

/**
 * schemas.js
 * Central library for structured JSON-LD schemas.
 * Standardizes schema generation for search engine indexing.
 */

const schemaConfig = {
  ca_contact_phone: "+91-75671-26945",
  ca_contact_email: "support@filingby.com",
  ca_contact_address: "",
  vs_contact_phone: "+91-75671-26945"
};

export function updateSchemaSettings(settings) {
  if (settings.ca_contact_phone) {
    schemaConfig.ca_contact_phone = settings.ca_contact_phone;
    orgSchema.contactPoint[0].telephone = settings.ca_contact_phone;
    localBusinessSchema.telephone = settings.ca_contact_phone;
  }
  if (settings.ca_contact_email) {
    schemaConfig.ca_contact_email = settings.ca_contact_email;
    localBusinessSchema.email = settings.ca_contact_email;
  }
  if (settings.ca_contact_address && settings.ca_contact_address.trim().length > 5) {
    schemaConfig.ca_contact_address = settings.ca_contact_address;
    if (localBusinessSchema.address) {
      localBusinessSchema.address.streetAddress = settings.ca_contact_address;
    }
  }
  if (settings.vs_contact_phone) {
    schemaConfig.vs_contact_phone = settings.vs_contact_phone;
  }
}

export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.filingby.com/#organization",
  "name": "FilingBy.com",
  "url": "https://www.filingby.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.filingby.com/logo.jpeg",
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
  "@id": "https://www.filingby.com/#website",
  "url": "https://www.filingby.com",
  "name": "FilingBy.com",
  "publisher": {
    "@id": "https://www.filingby.com/#organization"
  },
  "inLanguage": "en-IN"
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.filingby.com/#professionalservice",
  "name": "FilingBy CA & Business Services",
  "image": "https://www.filingby.com/logo.jpeg",
  "telephone": "+91-75671-26945",
  "email": "support@filingby.com",
  "url": "https://www.filingby.com",
  "priceRange": "₹₹",
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
  }
};

export const homeReviewsSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "FilingBy Corporate Compliance & Registration Services",
  "image": "https://www.filingby.com/logo.jpeg",
  "description": "GST Registration, Company Incorporation, ITR Filing assistance, and Virtual Office Addresses across India.",
  "provider": {
    "@type": "Organization",
    "name": "FilingBy",
    "url": "https://www.filingby.com"
  },
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "999.00",
    "priceValidUntil": "2027-12-31",
    "url": "https://www.filingby.com",
    "availability": "https://schema.org/InStock"
  }
};

export const virtualOfficeSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Virtual Office Address for GST Registration & Mailing",
  "description": "Virtual business addresses across prime commercial hubs in India. Includes NOC, utility bills, and rent agreement for GST registration and corporate mailing support.",
  "image": "https://www.filingby.com/logo.jpeg",
  "provider": {
    "@type": "Organization",
    "name": "FilingBy",
    "url": "https://www.filingby.com"
  },
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "999.00",
    "priceValidUntil": "2027-12-31",
    "url": "https://www.filingby.com/virtual-space",
    "availability": "https://schema.org/InStock"
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
      "item": item.url ? `https://www.filingby.com${item.url.startsWith('/') ? '' : '/'}${item.url}` : undefined
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
export function buildServiceSchema({ name, description, price = "999.00", url, image }) {
  const imageUrl = image || "https://www.filingby.com/logo.jpeg";
  const serviceUrl = url ? `https://www.filingby.com${url.startsWith('/') ? '' : '/'}${url}` : "https://www.filingby.com";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "image": imageUrl,
    "provider": {
      "@type": "Organization",
      "name": "FilingBy",
      "url": "https://www.filingby.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Corporate Compliance Services"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": price,
      "priceValidUntil": "2027-12-31",
      "url": serviceUrl,
      "availability": "https://schema.org/InStock"
    }
  };
}

export function buildBlogListingSchema(posts = []) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.filingby.com/blog#collection",
    "url": "https://www.filingby.com/blog",
    "name": "FilingBy Knowledge Hub",
    "description": "Guides on GST, company registration, tax filing, and virtual office compliance in India.",
    "isPartOf": {
      "@id": "https://www.filingby.com/#website"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.filingby.com/blog/${post.slug}`,
        "name": post.title
      }))
    }
  };
}

export function buildBlogPostingSchema(post) {
  if (!post) return null;

  const imageSource = post.featuredImage || post.image || "https://www.filingby.com/logo.jpeg";
  const authorProfile = resolveAuthorProfile(post);
  const keywords = [
    post.focusKeyword,
    ...(Array.isArray(post.secondaryKeywords) ? post.secondaryKeywords : []),
    ...(Array.isArray(post.tags) ? post.tags : [])
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://www.filingby.com/blog/${post.slug}#article`,
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.lastUpdated || post.updatedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": authorProfile.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "FilingBy.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.filingby.com/logo.jpeg"
      }
    },
    "image": [imageSource],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.filingby.com/blog/${post.slug}`
    },
    "keywords": keywords.join(", ")
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
    "image": "https://www.filingby.com/logo.jpeg",
    "telephone": schemaConfig.vs_contact_phone,
    "url": `https://www.filingby.com/virtual-office-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": cityName,
      "addressCountry": "IN"
    },
    "priceRange": "$$"
  };
}
