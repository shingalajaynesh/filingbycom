/**
 * admin.routes.js
 * Routes for admin panel — login, order management, service CRUD.
 */

import express from "express";
import verifyAdmin from "../../middleware/admin.middleware.js";
import {
  adminLogin,
  checkAuth,
  adminLogout,
  getAllOrders,
  getActiveOrders,
  getCompletedOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "./admin.controller.js";
import {
  createService,
  updateService,
  deleteService,
} from "../service/service.controller.js";

const adminRouter = express.Router();

// ── Auth (Public) ─────────────────────────────────────────────────────────────
adminRouter.post("/admin/login",       adminLogin);
adminRouter.get("/admin/check-auth",   checkAuth);
adminRouter.post("/admin/logout",      adminLogout);

// ── Orders (Protected) ────────────────────────────────────────────────────────
adminRouter.get("/admin/orders",                verifyAdmin, getAllOrders);
adminRouter.get("/admin/orders/active",         verifyAdmin, getActiveOrders);
adminRouter.get("/admin/orders/history",        verifyAdmin, getCompletedOrders);
adminRouter.patch("/admin/orders/:id/status",   verifyAdmin, updateOrderStatus);
adminRouter.patch("/admin/orders/:id/payment",  verifyAdmin, updatePaymentStatus);

// ── Services (Protected) ──────────────────────────────────────────────────────
adminRouter.post("/admin/services",       verifyAdmin, createService);
adminRouter.put("/admin/services/:id",    verifyAdmin, updateService);
adminRouter.delete("/admin/services/:id", verifyAdmin, deleteService);

export default adminRouter;
