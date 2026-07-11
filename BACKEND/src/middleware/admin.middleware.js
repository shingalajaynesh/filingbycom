/**
 * verifyAdmin.js
 * Middleware to protect admin-only routes.
 * Validates the x-admin-token header against the ADMIN_SECRET env variable.
 */

import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Admin token missing" });
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: "Server configuration error: ADMIN_SECRET is not configured." });
  }

  try {
    jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired admin token" });
  }
};

export default verifyAdmin;
