import express from "express";
import verifyAdmin from "../../middleware/admin.middleware.js";
import { verifyUser } from "../../middleware/auth.middleware.js";
import VirtualSpaceController from "./virtual-space.controller.js";

const virtualSpaceRouter = express.Router();

// ─── Public Endpoints ────────────────────────────────────────────────────────
virtualSpaceRouter.post("/virtual-space/inquiries", VirtualSpaceController.createInquiry);
virtualSpaceRouter.post("/virtual-space/partner-onboarding", VirtualSpaceController.createPartnerApplication);
virtualSpaceRouter.post("/virtual-space/quotes", VirtualSpaceController.createQuoteLead);
virtualSpaceRouter.get("/virtual-space/locations", VirtualSpaceController.getLocations);
virtualSpaceRouter.get("/virtual-space/locations/:slug", VirtualSpaceController.getLocationBySlug);

// ─── Client Endpoints (Protected via verifyUser) ─────────────────────────────
virtualSpaceRouter.get("/virtual-space/orders", verifyUser, VirtualSpaceController.getUserVirtualOrders);
virtualSpaceRouter.post("/virtual-space/orders", verifyUser, VirtualSpaceController.createVirtualOrder);
virtualSpaceRouter.get("/virtual-space/orders/:id", verifyUser, VirtualSpaceController.getUserVirtualOrderById);
virtualSpaceRouter.post("/virtual-space/orders/:id/documents", verifyUser, VirtualSpaceController.uploadUserVirtualDocuments);
virtualSpaceRouter.delete("/virtual-space/orders/:id", verifyUser, VirtualSpaceController.deleteUserVirtualOrder);

// ─── Admin Endpoints (Protected via verifyAdmin) ─────────────────────────────
virtualSpaceRouter.get("/admin/virtual-space/inquiries", verifyAdmin, VirtualSpaceController.getInquiries);
virtualSpaceRouter.get("/admin/virtual-space/partner-onboarding", verifyAdmin, VirtualSpaceController.getPartnerApplications);
virtualSpaceRouter.get("/admin/virtual-space/quotes", verifyAdmin, VirtualSpaceController.getQuoteLeads);

virtualSpaceRouter.patch("/admin/virtual-space/inquiries/:id/status", verifyAdmin, VirtualSpaceController.updateInquiryStatus);
virtualSpaceRouter.patch("/admin/virtual-space/partner-onboarding/:id/status", verifyAdmin, VirtualSpaceController.updatePartnerStatus);
virtualSpaceRouter.patch("/admin/virtual-space/quotes/:id/status", verifyAdmin, VirtualSpaceController.updateQuoteStatus);

virtualSpaceRouter.post("/admin/virtual-space/locations", verifyAdmin, VirtualSpaceController.createLocation);
virtualSpaceRouter.put("/admin/virtual-space/locations/:id", verifyAdmin, VirtualSpaceController.updateLocation);
virtualSpaceRouter.delete("/admin/virtual-space/locations/:id", verifyAdmin, VirtualSpaceController.deleteLocation);

virtualSpaceRouter.get("/admin/virtual-space/orders", verifyAdmin, VirtualSpaceController.adminGetVirtualOrders);
virtualSpaceRouter.put("/admin/virtual-space/orders/:id", verifyAdmin, VirtualSpaceController.adminUpdateVirtualOrder);
virtualSpaceRouter.delete("/admin/virtual-space/orders/:id", verifyAdmin, VirtualSpaceController.deleteVirtualOrder);
virtualSpaceRouter.post("/admin/virtual-space/orders/:id/mail", verifyAdmin, VirtualSpaceController.adminAddMailLog);
virtualSpaceRouter.post("/admin/virtual-space/orders/:id/verification", verifyAdmin, VirtualSpaceController.adminAddVerificationAudit);

export default virtualSpaceRouter;
