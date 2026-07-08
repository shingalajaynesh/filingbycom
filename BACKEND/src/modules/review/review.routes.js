import express from "express";
import verifyAdmin from "../../middleware/admin.middleware.js";
import ReviewController from "./review.controller.js";

const reviewRouter = express.Router();

// ── Public Routes ────────────────────────────────────────────────────────────
reviewRouter.get("/reviews", ReviewController.getReviews);
reviewRouter.post("/reviews", ReviewController.submitReview);

// ── Protected Admin Routes ───────────────────────────────────────────────────
reviewRouter.get("/admin/reviews", verifyAdmin, ReviewController.getAllReviewsAdmin);
reviewRouter.post("/admin/reviews", verifyAdmin, ReviewController.createReview);
reviewRouter.put("/admin/reviews/:id", verifyAdmin, ReviewController.updateReview);
reviewRouter.delete("/admin/reviews/:id", verifyAdmin, ReviewController.deleteReview);

export default reviewRouter;
