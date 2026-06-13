import express from "express";
import verifyAdmin from "../../middleware/admin.middleware.js";
import {
  createInquiry,
  createPartnerApplication,
  createQuoteLead,
  getInquiries,
  getPartnerApplications,
  getQuoteLeads,
  updateInquiryStatus,
  updatePartnerStatus,
  updateQuoteStatus,
} from "./virtual-space.controller.js";

const virtualSpaceRouter = express.Router();

// ─── Public Endpoints ────────────────────────────────────────────────────────
virtualSpaceRouter.post("/virtual-space/inquiries", createInquiry);
virtualSpaceRouter.post("/virtual-space/partner-onboarding", createPartnerApplication);
virtualSpaceRouter.post("/virtual-space/quotes", createQuoteLead);

// ─── Admin Endpoints (Protected) ──────────────────────────────────────────────
virtualSpaceRouter.get("/admin/virtual-space/inquiries", verifyAdmin, getInquiries);
virtualSpaceRouter.get("/admin/virtual-space/partner-onboarding", verifyAdmin, getPartnerApplications);
virtualSpaceRouter.get("/admin/virtual-space/quotes", verifyAdmin, getQuoteLeads);

virtualSpaceRouter.patch("/admin/virtual-space/inquiries/:id/status", verifyAdmin, updateInquiryStatus);
virtualSpaceRouter.patch("/admin/virtual-space/partner-onboarding/:id/status", verifyAdmin, updatePartnerStatus);
virtualSpaceRouter.patch("/admin/virtual-space/quotes/:id/status", verifyAdmin, updateQuoteStatus);

export default virtualSpaceRouter;
