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

// ── DNS RESOLUTION SETUP ─────────────────────────────────────────────────────
// Node's default resolver sometimes fails on MongoDB SRV records when DNS queries
// are blocked or misrouted by local providers. Overriding default DNS servers
// to Google Public DNS resolves connection timeouts.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

// ── GLOBAL EXPRESS MIDDLEWARE ────────────────────────────────────────────────
// CORS configuration to allow cross-origin resource requests from the React frontend.
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body parsers enabling Express to process JSON loads and incoming cookies.
app.use(express.json());
app.use(cookieParser());

// Clerk middleware automatically decodes and signs session JWTs for request.auth.
app.use(clerkMiddleware());

// ── ROUTE CONTROLLER REGISTRY ───────────────────────────────────────────────
// Mount modular routes for standard users and administrative actions.
app.use(router);
app.use(adminRouter);

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
  console.log(`🚀 Server running on port ${PORT}`);
});
