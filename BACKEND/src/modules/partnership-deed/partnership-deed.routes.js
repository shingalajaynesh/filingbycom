import express from "express";
import PartnershipDeedController from "./partnership-deed.controller.js";
import { verifyUser } from "../../middleware/auth.middleware.js";
import verifyAdmin from "../../middleware/admin.middleware.js";

const partnershipDeedRouter = express.Router();

// ─── Client Endpoints (Protected via verifyUser) ─────────────────────────────
partnershipDeedRouter.post("/api/partnership-deed", verifyUser, PartnershipDeedController.saveDraft);
partnershipDeedRouter.get("/api/partnership-deed", verifyUser, PartnershipDeedController.getUserDeeds);
partnershipDeedRouter.post("/api/partnership-deed/:id/preview", verifyUser, PartnershipDeedController.getPreview);
partnershipDeedRouter.post("/api/partnership-deed/:id/pay", verifyUser, PartnershipDeedController.pay);
partnershipDeedRouter.get("/api/partnership-deed/:id/download", verifyUser, PartnershipDeedController.download);

// ─── Admin Endpoints (Protected via verifyAdmin) ────────────────────────────
partnershipDeedRouter.get("/api/admin/partnership-deed", verifyAdmin, PartnershipDeedController.getAllDeeds);
partnershipDeedRouter.post("/api/admin/partnership-deed/:id/bypass-payment", verifyAdmin, PartnershipDeedController.bypassPayment);

export default partnershipDeedRouter;

