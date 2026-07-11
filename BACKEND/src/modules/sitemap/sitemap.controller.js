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
  getSitemap = async (req, res) => {
    try {
      const services = await Service.find({ isActive: { $ne: false } }).lean();
      const locations = await VirtualLocation.find().lean();
      const blogs = await BlogPost.find({ isPublished: true }).lean();

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Static Pages
      for (const path of STATIC_PAGES) {
        const changefreq = path === "" || path === "virtual-space" || path === "blog" ? "daily" : "weekly";
        const priority = path === "" || path === "virtual-space" ? "1.0" : "0.8";
        xml += `
  <url>
    <loc>https://filingby.com/${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }

      // Services
      for (const service of services) {
        xml += `
  <url>
    <loc>https://filingby.com/services/${service.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      // Virtual Office Locations (Cities and Areas)
      for (const loc of locations) {
        xml += `
  <url>
    <loc>https://filingby.com/virtual-office-${loc.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        if (loc.addresses && loc.addresses.length > 0) {
          for (const addr of loc.addresses) {
            xml += `
  <url>
    <loc>https://filingby.com/virtual-office-${loc.slug}/${addr.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
          }
        }
      }

      // Blogs
      for (const post of blogs) {
        const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : null;
        xml += `
  <url>
    <loc>https://filingby.com/blog/${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${lastMod ? `\n    <lastmod>${lastMod}</lastmod>` : ""}
  </url>`;
      }

      xml += `\n</urlset>`;

      res.header("Content-Type", "application/xml");
      return res.status(200).send(xml);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new SitemapController();
