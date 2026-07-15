import Service from "../../models/Service.model.js";
import VirtualLocation from "../../models/VirtualLocation.model.js";
import BlogPost from "../../models/BlogPost.model.js";

const STATIC_PAGES = [
  "",
  "virtual-space",
  "locations",
  "ecommerce-office",
  "about-us",
  "our-promise",
  "customer-care",
  "faq",
  "get-live-quote",
  "blog",
  "gst-calculator",
  "income-tax-calculator",
  "roc-tools",
  "company-registration-guides",
  "trademark-search",
  "legal-templates",
];

class SitemapController {
  // GET /sitemap.xml
  getSitemap = async (req, res) => {
    try {
      const services = await Service.find({ isActive: { $ne: false } }).lean();
      const locations = await VirtualLocation.find().lean();
      const blogs = await BlogPost.find({ isPublished: true }).lean();

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

      // Static Pages
      for (const path of STATIC_PAGES) {
        const changefreq = path === "" || path === "virtual-space" || path === "blog" ? "daily" : "weekly";
        const priority = path === "" || path === "virtual-space" ? "1.0" : "0.8";
        xml += `
  <url>
    <loc>https://www.filingby.com/${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }

      // Services
      for (const service of services) {
        xml += `
  <url>
    <loc>https://www.filingby.com/services/${service.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      // Virtual Office Locations (Cities and Areas)
      for (const loc of locations) {
        xml += `
  <url>
    <loc>https://www.filingby.com/virtual-office-${loc.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        if (loc.addresses && loc.addresses.length > 0) {
          for (const addr of loc.addresses) {
            xml += `
  <url>
    <loc>https://www.filingby.com/virtual-office-${loc.slug}/${addr.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
          }
        }
      }

      // Blogs with embedded image details
      for (const post of blogs) {
        const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : null;
        xml += `
  <url>
    <loc>https://www.filingby.com/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${lastMod ? `\n    <lastmod>${lastMod}</lastmod>` : ""}`;
        
        if (post.image) {
          xml += `
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>`;
        }
        
        xml += `
  </url>`;
      }

      xml += `\n</urlset>`;

      res.header("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /image-sitemap.xml
  getImageSitemap = async (req, res) => {
    try {
      const blogs = await BlogPost.find({ isPublished: true, image: { $exists: true, $ne: "" } }).lean();

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

      for (const post of blogs) {
        xml += `
  <url>
    <loc>https://www.filingby.com/blog/${post.slug}</loc>
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>
  </url>`;
      }

      xml += `\n</urlset>`;

      res.header("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /robots.txt
  getRobotsTxt = async (req, res) => {
    try {
      const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /virtual-office/dashboard/
Disallow: /partner/dashboard/
Disallow: /sso-callback/

Sitemap: https://www.filingby.com/sitemap.xml
Sitemap: https://www.filingby.com/image-sitemap.xml
`;
      res.header("Content-Type", "text/plain");
      return res.status(200).send(robots);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /feed.xml (RSS Feed)
  getRSSFeed = async (req, res) => {
    try {
      const blogs = await BlogPost.find({ isPublished: true })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(20)
        .lean();

      let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FilingBy Knowledge Hub</title>
    <link>https://www.filingby.com/blog</link>
    <description>Expert Chartered Accountant advice, tax guides, GST compliance rules, and virtual office regulations in India.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.filingby.com/feed.xml" rel="self" type="application/rss+xml" />`;

      for (const post of blogs) {
        const postLink = `https://www.filingby.com/blog/${post.slug}`;
        const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
        xml += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postLink}</link>
      <guid isPermaLink="true">${postLink}</guid>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200).replace(/<[^>]*>/g, "") + "..."}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.image ? `<enclosure url="${post.image}" length="0" type="image/jpeg" />` : ""}
    </item>`;
      }

      xml += `\n  </channel>\n</rss>`;

      res.header("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new SitemapController();
