import express from "express";
import verifyAdmin from "../lib/verifyAdmin.js";
import {
  adminLogin,
  checkAuth,
  adminLogout,
  getAllOrders,
  getActiveOrders,
  getCompletedOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

// Public — no admin token required
adminRouter.post("/admin/login", adminLogin);
adminRouter.get("/admin/check-auth", checkAuth);
adminRouter.post("/admin/logout", adminLogout);

// Protected — require admin token
adminRouter.get("/admin/orders", verifyAdmin, getAllOrders);
adminRouter.get("/admin/orders/active", verifyAdmin, getActiveOrders);
adminRouter.get("/admin/orders/history", verifyAdmin, getCompletedOrders);
adminRouter.patch("/admin/orders/:id/status", verifyAdmin, updateOrderStatus);
adminRouter.patch("/admin/orders/:id/payment", verifyAdmin, updatePaymentStatus);

export default adminRouter;
