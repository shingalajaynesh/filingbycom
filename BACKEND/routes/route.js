import express from "express";
import registerUser from "../controller/registerUser.controller.js";
import checkUser from "../controller/checkUser.controller.js";
import { authenticateToken } from "../lib/verifyToken.js";
import { getAllServices } from "../controller/service.controller.js";
import { 
  createRazorpayOrder, 
  verifyOnlineOrder, 
  createCashOrder, 
  getUserOrders 
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/register", authenticateToken, registerUser);
router.get("/check-user", authenticateToken, checkUser);

// Public routes
router.get("/services", getAllServices);

// Protected order routes
router.post("/orders/razorpay", authenticateToken, createRazorpayOrder);
router.post("/orders/verify", authenticateToken, verifyOnlineOrder);
router.post("/orders/cash", authenticateToken, createCashOrder);
router.get("/orders", authenticateToken, getUserOrders);

export default router;
