import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetFiles = [
  join(__dirname, "../../FRONTEND/src/shared/seo/schemas.js"),
  join(__dirname, "../../FRONTEND/src/shared/components/SEO.jsx"),
  join(__dirname, "../scripts/generateSitemap.js"),
  join(__dirname, "../src/modules/sitemap/sitemap.controller.js"),
  join(__dirname, "../../FRONTEND/scripts/prerender.js"),
  join(__dirname, "../../FRONTEND/public/robots.txt")
];

const migrate = () => {
  console.log("Starting domain canonicalization migration (non-WWW -> WWW)...");
  
  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf8");
    
    // Replace all occurrences of https://filingby.com but make sure we don't end up with https://www.www.filingby.com
    // Use regex to look behind or match exactly.
    // Replace "https://filingby.com" with "https://www.filingby.com" (if not already prefixed by www.)
    const beforeLength = content.length;
    
    // Use regex to replace filingby.com with www.filingby.com unless it's already www.filingby.com
    content = content.replace(/https:\/\/(?!www\.)filingby\.com/g, "https://www.filingby.com");

    if (content.length !== beforeLength || content.includes("https://www.filingby.com")) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Successfully migrated: ${filePath}`);
    } else {
      console.log(`No changes needed for: ${filePath}`);
    }
  }

  console.log("Domain canonicalization migration completed successfully!");
};

migrate();
