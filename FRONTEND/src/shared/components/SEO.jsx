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
 * @param {string} [props.ogImage="https://www.filingby.com/logo.jpeg"] Open Graph preview image
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
  ogImage = "https://www.filingby.com/logo.jpeg",
  noindex = false,
  schema = null,
  extraSchemas = []
}) {
  const siteUrl = "https://www.filingby.com";
  const path = canonical !== undefined ? canonical : (typeof window !== "undefined" ? window.location.pathname : "");
  const canonicalUrl = path
    ? (path.startsWith("http://") || path.startsWith("https://") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`)
    : null;
  const resolvedTitle = title || "FilingBy.com | CA, Tax & Virtual Office Services";
  const resolvedDescription =
    description ||
    "Expert-assisted GST registration, company incorporation, tax filing, and virtual office services across India.";
  const resolvedImage = ogImage || "https://www.filingby.com/logo.jpeg";

  // Combine schemas and filter out null/undefined ones
  const allSchemas = [schema, ...extraSchemas].filter(Boolean);

  return (
    <Helmet>
      {/* Title & Description */}
      <html lang="en" />
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="FilingBy.com" />
      <meta name="theme-color" content="#1A56DB" />

      {/* Robots Indexing Control */}
      {noindex ? (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        </>
      )}

      {/* Canonical Tag */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph (Facebook / LinkedIn) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="FilingBy.com" />
      <meta property="og:locale" content="en_IN" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={resolvedImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@FilingByCom" />
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* Render JSON-LD schemas */}
      {allSchemas.map((sch, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(sch)}
        </script>
      ))}
    </Helmet>
  );
}
