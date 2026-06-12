/**
 * verifyAdmin.js
 * Middleware to protect admin-only routes.
 * Validates the x-admin-token header against the ADMIN_SECRET env variable.
 */

import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Admin token missing" });
  }

  try {
    jwt.verify(token, process.env.ADMIN_SECRET || "admin_secret_token");
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired admin token" });
  }
};

export default verifyAdmin;
