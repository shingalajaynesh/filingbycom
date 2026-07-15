import Redirect from "../models/Redirect.model.js";
import logger from "../services/logger.service.js";

/**
 * Express middleware to intercept requests and perform dynamic 301/302 redirects
 * configured in the database via the CMS.
 */
export const redirectMiddleware = async (req, res, next) => {
  try {
    // Only intercept GET requests. Avoid interfering with API endpoints or static assets.
    if (req.method !== "GET" || req.path.startsWith("/api/") || req.path.includes(".")) {
      return next();
    }

    // Match both trailing slash and non-trailing slash versions
    const rawPath = req.path;
    const pathWithoutSlash = rawPath.replace(/\/$/, "");
    const normalizedPath = pathWithoutSlash.toLowerCase() || "/";

    // Query database for an active redirect rule matching the path
    const redirectRule = await Redirect.findOne({
      source: { $in: [normalizedPath, rawPath.toLowerCase()] },
      isActive: true
    }).lean();

    if (redirectRule) {
      logger.info(`Dynamic Redirect: Matches ${rawPath} -> Redirecting to ${redirectRule.destination} (${redirectRule.statusCode})`);
      
      // Preserve any query parameters if redirecting
      const queryStr = Object.keys(req.query).length > 0 ? req.url.substring(req.path.length) : "";
      const finalDestination = redirectRule.destination + queryStr;
      
      return res.redirect(redirectRule.statusCode || 301, finalDestination);
    }
  } catch (error) {
    logger.error(`Error checking dynamic redirects in middleware: ${error.message}`);
  }
  
  next();
};
