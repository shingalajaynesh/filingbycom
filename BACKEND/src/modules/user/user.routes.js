import express from "express";
import UserController from "./user.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import ServiceController from "../service/service.controller.js";
import OrderController from "../order/order.controller.js";
import SettingController from "../setting/setting.controller.js";

const router = express.Router();

// ── User Auth ────────────────────────────────────────────────────────────────
router.post("/register", authenticateToken, UserController.registerUser);
router.get("/check-user", authenticateToken, UserController.checkUser);
router.get("/profile", authenticateToken, UserController.getProfile);

// ── Services (Public) ────────────────────────────────────────────────────────
router.get("/settings", SettingController.getPublicSettings);
router.get("/services", ServiceController.getAllServices);
router.get("/main-services", ServiceController.getAllMainServices);

// ── Orders (Protected) ───────────────────────────────────────────────────────
router.post("/orders/razorpay", authenticateToken, OrderController.createRazorpayOrder);
router.post("/orders/verify", authenticateToken, OrderController.verifyOnlineOrder);
router.post("/orders/cash", authenticateToken, OrderController.createCashOrder);
router.get("/orders", authenticateToken, OrderController.getUserOrders);
router.delete("/orders/:id", authenticateToken, OrderController.deleteUserOrder);

export default router;

