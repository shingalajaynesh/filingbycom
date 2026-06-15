/**
 * user.routes.js
 * Routes for user authentication, registration, and order management.
 */

import express from "express";
import registerUser from "./user.controller.js";
import checkUser from "./checkUser.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { getAllServices, getAllMainServices } from "../service/service.controller.js";
import {
  createRazorpayOrder,
  verifyOnlineOrder,
  createCashOrder,
  getUserOrders,
} from "../order/order.controller.js";

const router = express.Router();

// ── User Auth ────────────────────────────────────────────────────────────────
router.post("/register",    authenticateToken, registerUser);
router.get("/check-user",   authenticateToken, checkUser);

// ── Services (Public) ────────────────────────────────────────────────────────
import { getPublicSettings } from "../setting/setting.controller.js";
router.get("/settings", getPublicSettings);
router.get("/services", getAllServices);
router.get("/main-services", getAllMainServices);

// ── Orders (Protected) ───────────────────────────────────────────────────────
router.post("/orders/razorpay", authenticateToken, createRazorpayOrder);
router.post("/orders/verify",   authenticateToken, verifyOnlineOrder);
router.post("/orders/cash",     authenticateToken, createCashOrder);
router.get("/orders",           authenticateToken, getUserOrders);

export default router;
