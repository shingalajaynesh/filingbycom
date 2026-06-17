/**
 * server.js
 * Primary bootstrap entry point for the FilingBy Express.js backend.
 * - Instantiates the Express application.
 * - Resolves Atlas SRV resolution concerns using Custom DNS mapping.
 * - Mounts security middleware (CORS, parsers, cookies, Clerk sessions).
 * - Establishes Mongoose DB connectivity.
 * - Boots up the HTTP server listener.
 */

import dns from "node:dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./src/config/db.config.js";
import router from "./src/modules/user/user.routes.js";
import adminRouter from "./src/modules/admin/admin.routes.js";
import virtualSpaceRouter from "./src/modules/virtual-space/virtual-space.routes.js";
import blogRouter from "./src/modules/blog/blog.routes.js";
import logger from "./src/services/logger.service.js";
import { requestLogger } from "./src/middleware/logger.middleware.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import compression from "compression";
import { globalErrorHandler } from "./src/middleware/error.middleware.js";



// ── DNS RESOLUTION SETUP ─────────────────────────────────────────────────────
// Node's default resolver sometimes fails on MongoDB SRV records when DNS queries
// are blocked or misrouted by local providers. Overriding default DNS servers
// to Google Public DNS resolves connection timeouts.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

// Enforce environment configuration security checks on boot
const requiredEnv = [
  "MONGODB_URI",
  "CLERK_SECRET_KEY",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "ADMIN_SECRET"
];

// In production, FRONTEND_URL is required to prevent CORS failures
if (process.env.NODE_ENV === "production") {
  requiredEnv.push("FRONTEND_URL");
}

for (const key of requiredEnv) {
  if (!process.env[key]) {
    logger.error(`FATAL CONFIGURATION ERROR: Missing environment variable [${key}].`);
    process.exit(1);
  }
}

const app = express();

// Compress all responses
app.use(compression());


// CORS configuration to allow cross-origin resource requests from the React frontend.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.replace(/\/$/, ""));

const allowedDomains = allowedOrigins.map(url => url.replace(/^https?:\/\/(www\.)?/, ""));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const originNormalized = origin.replace(/\/$/, "");
    const domainNormalized = originNormalized.replace(/^https?:\/\/(www\.)?/, "");
    
    const isAllowed = allowedOrigins.includes(originNormalized) || 
                      allowedDomains.includes(domainNormalized) ||
                      /^https?:\/\/localhost(:\d+)?$/.test(originNormalized) ||
                      /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(originNormalized) ||
                      originNormalized.endsWith(".vercel.app");
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Apply security headers via helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Apply rate limiting on API requests to defend against DoS/brute-force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 300 : 5000, // Relax bounds locally for dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Bypass rate limiting for localhost development and non-production environments
    if (process.env.NODE_ENV !== "production") return true;
    const ip = req.ip || req.connection?.remoteAddress || "";
    return ip === "::1" || ip === "127.0.0.1" || ip.includes("127.0.0.1");
  },
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});
app.use(limiter);

// Body parsers enabling Express to process JSON loads and incoming cookies.
app.use(express.json());
app.use(cookieParser());

// Request logger middleware
app.use(requestLogger);

// Clerk middleware automatically decodes and signs session JWTs for request.auth.
app.use(clerkMiddleware());

// ── ROUTE CONTROLLER REGISTRY ───────────────────────────────────────────────
// Mount modular routes for standard users and administrative actions.
app.use(router);
app.use(adminRouter);
app.use(virtualSpaceRouter);
app.use(blogRouter);

// Centralized error handling middleware
app.use(globalErrorHandler);

// ── MONGOOSE DATABASE CONNECTIVITY ──────────────────────────────────────────
// Establish socket connections to the MongoDB Atlas cluster.
connectDB();

// ── API STATUS MONITOR ──────────────────────────────────────────────────────
// Simple service monitor mapping.
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FilingBy API is running" });
});

// ── HTTP LISTENER INITIALIZATION ────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  
  // ── PREVENT RENDER COLD START / SLEEP ──
  // Render's free tier spins down the backend after 15 minutes of inactivity.
  // Pinging the public URL every 10 minutes keeps the instance awake.
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    logger.info(`Self-pinger initialized targeting: ${RENDER_URL}`);
    setInterval(() => {
      fetch(RENDER_URL)
        .then((res) => {
          logger.info(`Self-ping to ${RENDER_URL} completed with status: ${res.status}`);
        })
        .catch((err) => {
          logger.error(`Self-ping to ${RENDER_URL} failed:`, err);
        });
    }, 10 * 60 * 1000); // Every 10 minutes
  }
});
