import express from "express";
import verifyAdmin from "../../middleware/admin.middleware.js";
import AdminController from "./admin.controller.js";
import ServiceController from "../service/service.controller.js";
import SettingController from "../setting/setting.controller.js";

const adminRouter = express.Router();

// ── Auth (Public) ─────────────────────────────────────────────────────────────
adminRouter.post("/admin/login",       AdminController.adminLogin);
adminRouter.get("/admin/check-auth",   AdminController.checkAuth);
adminRouter.post("/admin/logout",      AdminController.adminLogout);

// ── Orders (Protected) ────────────────────────────────────────────────────────
adminRouter.get("/admin/orders",                verifyAdmin, AdminController.getAllOrders);
adminRouter.get("/admin/orders/active",         verifyAdmin, AdminController.getActiveOrders);
adminRouter.get("/admin/orders/history",        verifyAdmin, AdminController.getCompletedOrders);
adminRouter.patch("/admin/orders/:id/status",   verifyAdmin, AdminController.updateOrderStatus);
adminRouter.patch("/admin/orders/:id/payment",  verifyAdmin, AdminController.updatePaymentStatus);
adminRouter.delete("/admin/orders/:id",         verifyAdmin, AdminController.deleteOrder);

// ── Services (Protected) ──────────────────────────────────────────────────────
adminRouter.post("/admin/services",       verifyAdmin, ServiceController.createService);
adminRouter.put("/admin/services/:id",    verifyAdmin, ServiceController.updateService);
adminRouter.delete("/admin/services/:id", verifyAdmin, ServiceController.deleteService);

adminRouter.post("/admin/services/reorder", verifyAdmin, ServiceController.reorderItems);

// ── Semi Services (Protected) ─────────────────────────────────────────────────
adminRouter.post("/admin/semi-services",       verifyAdmin, ServiceController.createSemiService);
adminRouter.put("/admin/semi-services/:id",    verifyAdmin, ServiceController.updateSemiService);
adminRouter.delete("/admin/semi-services/:id", verifyAdmin, ServiceController.deleteSemiService);

// ─── Main Services (Protected) ──────────────────────────────────────────────
adminRouter.post("/admin/settings",           verifyAdmin, SettingController.updateSettings);
adminRouter.get("/admin/main-services",       verifyAdmin, ServiceController.getAllMainServices);
adminRouter.post("/admin/main-services",      verifyAdmin, ServiceController.createMainService);
adminRouter.put("/admin/main-services/:id",   verifyAdmin, ServiceController.updateMainService);
adminRouter.delete("/admin/main-services/:id",verifyAdmin, ServiceController.deleteMainService);

export default adminRouter;
