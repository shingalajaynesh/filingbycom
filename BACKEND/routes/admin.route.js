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
import {
  createService,
  updateService,
  deleteService,
} from "../controller/service.controller.js";

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

// Service Management
adminRouter.post("/admin/services", verifyAdmin, createService);
adminRouter.put("/admin/services/:id", verifyAdmin, updateService);
adminRouter.delete("/admin/services/:id", verifyAdmin, deleteService);

export default adminRouter;
