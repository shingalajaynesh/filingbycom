import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEO Component to inject dynamic meta-data, canonical URLs, OG and Twitter tags,
 * and JSON-LD structured data.
 * 
 * @param {Object} props
 * @param {string} props.title Page title
 * @param {string} props.description Page meta description
 * @param {string} [props.keywords] Page meta keywords
 * @param {string} [props.canonical] Canonical path (e.g. "/virtual-space")
 * @param {string} [props.ogType="website"] Open Graph type
 * @param {string} [props.ogImage="https://filingby.com/logo.jpeg"] Open Graph preview image
 * @param {boolean} [props.noindex=false] Whether search engine crawlers should skip indexing this page
 * @param {Object} [props.schema] Main JSON-LD schema object
 * @param {Array<Object>} [props.extraSchemas] Additional JSON-LD schema objects (FAQPage, Breadcrumbs, etc.)
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage = "https://filingby.com/logo.jpeg",
  noindex = false,
  schema = null,
  extraSchemas = []
}) {
  const siteUrl = "https://filingby.com";
  const path = canonical || "";
  const canonicalUrl = `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  // Combine schemas and filter out null/undefined ones
  const allSchemas = [schema, ...extraSchemas].filter(Boolean);

  return (
    <Helmet>
      {/* Title & Description */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots Indexing Control */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical Tag */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook / LinkedIn) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Render JSON-LD schemas */}
      {allSchemas.map((sch, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(sch)}
        </script>
      ))}
    </Helmet>
  );
}
