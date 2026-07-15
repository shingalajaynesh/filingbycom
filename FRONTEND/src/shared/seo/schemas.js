/**
 * schemas.js
 * Central library for structured JSON-LD schemas.
 * Standardizes schema generation for search engine indexing.
 */

const schemaConfig = {
  ca_contact_phone: "+91-75671-26945",
  ca_contact_email: "support@filingby.com",
  ca_contact_address: "3rd Floor, Business Center, New Delhi, India",
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
  if (settings.ca_contact_address) {
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
  "@type": "LocalBusiness",
  "@id": "https://www.filingby.com/#localbusiness",
  "name": "FilingBy CA & Business Services",
  "image": "https://www.filingby.com/logo.jpeg",
  "telephone": "+91-75671-26945",
  "email": "support@filingby.com",
  "url": "https://www.filingby.com",
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
  "image": "https://www.filingby.com/logo.jpeg",
  "description": "GST Registration, Company Incorporation, ITR Filing, and Premium Virtual Office Addresses across India.",
  "brand": {
    "@type": "Brand",
    "name": "FilingBy"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "999.00",
    "priceValidUntil": "2027-12-31",
    "url": "https://www.filingby.com",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "INR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "IN"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 1,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 3,
          "unitCode": "DAY"
        }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "IN",
      "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1280",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Aman Sharma"
      },
      "datePublished": "2026-03-10",
      "reviewBody": "Extremely reliable CA services. They handled my private limited company incorporation very quickly.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ]
};

export const virtualOfficeSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Virtual Office Address for GST Registration & Mailing",
  "description": "Premium virtual business addresses across 28 states in India. Includes NOC, utility bills, and rent agreement for hassle-free GST registration & corporate mailing.",
  "image": "https://www.filingby.com/logo.jpeg",
  "brand": {
    "@type": "Brand",
    "name": "FilingBy"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "999.00",
    "priceValidUntil": "2027-12-31",
    "url": "https://www.filingby.com/virtual-space",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "INR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "IN"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 1,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 3,
          "unitCode": "DAY"
        }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "IN",
      "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "845"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Vikram Singh"
      },
      "datePublished": "2026-02-18",
      "reviewBody": "Got my GST registration done using their virtual office address. Smooth documentation and prompt delivery of NOC.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ]
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
    "@type": "Product",
    "name": name,
    "description": description,
    "image": imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "FilingBy"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": price,
      "priceValidUntil": "2027-12-31",
      "url": serviceUrl,
      "availability": "https://schema.org/InStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "124"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rajesh Kumar"
        },
        "datePublished": "2026-01-15",
        "reviewBody": "Excellent CA services. Quick and very professional onboarding process.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ]
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

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://www.filingby.com/blog/${post.slug}#article`,
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.author || "FilingBy Legal Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FilingBy.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.filingby.com/logo.jpeg"
      }
    },
    "image": post.image ? [post.image] : ["https://www.filingby.com/logo.jpeg"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.filingby.com/blog/${post.slug}`
    },
    "keywords": Array.isArray(post.tags) ? post.tags.join(", ") : post.tags
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
