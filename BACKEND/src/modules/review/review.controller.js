import Review from "../../models/Review.model.js";
import Service from "../../models/Service.model.js";
import VirtualLocation from "../../models/VirtualLocation.model.js";
import mongoose from "mongoose";

class ReviewController {
  resolveReviewRelations = async ({ pageType, service, serviceSlug, virtualLocation, virtualLocationSlug, officeCenter, portal }) => {
    const relations = {
      pageType,
      portal: portal || "ca-portal",
      service: undefined,
      virtualLocation: undefined,
      officeCenter: undefined,
    };

    if (pageType === "service") {
      const serviceLookup = service || serviceSlug;

      if (!serviceLookup) {
        throw new Error("Service review requires a service reference.");
      }

      if (mongoose.Types.ObjectId.isValid(serviceLookup)) {
        relations.service = serviceLookup;
      } else {
        const serviceDoc = await Service.findOne({ slug: serviceLookup }).lean();
        if (!serviceDoc) {
          throw new Error("Service not found for this review.");
        }
        relations.service = serviceDoc._id;
      }
    }

    if (pageType === "location") {
      const locationLookup = virtualLocation || virtualLocationSlug;

      if (!locationLookup) {
        throw new Error("Location review requires a location reference.");
      }

      if (mongoose.Types.ObjectId.isValid(locationLookup)) {
        relations.virtualLocation = locationLookup;
      } else {
        const locationDoc = await VirtualLocation.findOne({ slug: locationLookup }).lean();
        if (!locationDoc) {
          throw new Error("Location not found for this review.");
        }
        relations.virtualLocation = locationDoc._id;
      }

      if (officeCenter) {
        relations.officeCenter = officeCenter;
      }
    }

    return relations;
  };

  // ─── Get Reviews (Public) ──────────────────────────────────────────────────
  getReviews = async (req, res) => {
    try {
      const { pageType, service, portal, virtualLocation, officeCenter } = req.query;
      const filter = { isActive: true };

      if (portal) {
        filter.portal = portal;
      }

      if (pageType) {
        filter.pageType = pageType;
      }

      if (pageType === "service" && service) {
        // If service is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(service)) {
          filter.service = service;
        } else {
          // Look up service by slug
          const serviceDoc = await Service.findOne({ slug: service }).lean();
          if (serviceDoc) {
            filter.service = serviceDoc._id;
          } else {
            // If service doesn't exist, return empty reviews
            return res.status(200).json({ success: true, reviews: [] });
          }
        }
      }

      if (pageType === "location") {
        if (virtualLocation) {
          filter.virtualLocation = virtualLocation;
        }
        if (officeCenter) {
          filter.officeCenter = officeCenter;
        }
      }

      const reviews = await Review.find(filter)
        .populate("service", "name slug")
        .populate("virtualLocation", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, reviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Submit Review (Public) ────────────────────────────────────────────────
  submitReview = async (req, res) => {
    try {
      const {
        authorName,
        businessName,
        rating,
        comment,
        pageType = "home",
        portal,
        service,
        serviceSlug,
        virtualLocation,
        virtualLocationSlug,
        officeCenter,
        initials,
        color,
      } = req.body;

      if (!authorName || !comment) {
        return res.status(400).json({ success: false, message: "Author Name and Comment are required." });
      }

      const relations = await this.resolveReviewRelations({
        pageType,
        service,
        serviceSlug,
        virtualLocation,
        virtualLocationSlug,
        officeCenter,
        portal,
      });

      const newReview = new Review({
        authorName,
        businessName,
        rating,
        comment,
        pageType,
        portal: relations.portal,
        service: relations.service,
        virtualLocation: relations.virtualLocation,
        officeCenter: relations.officeCenter,
        initials,
        color,
        isActive: false,
      });

      await newReview.save();

      const populatedReview = await Review.findById(newReview._id)
        .populate("service", "name slug portal")
        .populate("virtualLocation", "name slug");

      return res.status(201).json({
        success: true,
        review: populatedReview,
        message: "Thanks for your review. It has been submitted for approval.",
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  // ─── Get All Reviews (Admin Only) ──────────────────────────────────────────
  getAllReviewsAdmin = async (req, res) => {
    try {
      const { portal } = req.query;
      const filter = {};
      
      if (portal) {
        filter.portal = portal;
      }

      const reviews = await Review.find(filter)
        .populate("service", "name slug portal")
        .populate("virtualLocation", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, reviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Create Review (Admin Only) ────────────────────────────────────────────
  createReview = async (req, res) => {
    try {
      const { authorName, businessName, rating, comment, pageType, service, virtualLocation, officeCenter, isActive, portal, initials, color } = req.body;

      if (!authorName || !comment) {
        return res.status(400).json({ success: false, message: "Author Name and Comment are required." });
      }

      const newReview = new Review({
        authorName,
        businessName,
        rating,
        comment,
        pageType,
        portal: portal || "ca-portal",
        service: pageType === "service" ? service : undefined,
        virtualLocation: pageType === "location" ? virtualLocation : undefined,
        officeCenter: pageType === "location" ? officeCenter : undefined,
        isActive: isActive !== undefined ? isActive : true,
        initials,
        color,
      });

      await newReview.save();
      
      // Populate service info for the response
      const populatedReview = await Review.findById(newReview._id)
        .populate("service", "name slug portal")
        .populate("virtualLocation", "name slug");
      
      return res.status(201).json({ success: true, review: populatedReview });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Update Review (Admin Only) ────────────────────────────────────────────
  updateReview = async (req, res) => {
    try {
      const { id } = req.params;
      const { authorName, businessName, rating, comment, pageType, service, virtualLocation, officeCenter, isActive, portal, initials, color } = req.body;

      const updateData = {
        authorName,
        businessName,
        rating,
        comment,
        pageType,
        portal,
        service: pageType === "service" ? service : null,
        virtualLocation: pageType === "location" ? virtualLocation : null,
        officeCenter: pageType === "location" ? officeCenter : null,
        isActive,
        initials,
        color,
      };

      const review = await Review.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("service", "name slug portal")
      .populate("virtualLocation", "name slug");

      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }

      return res.status(200).json({ success: true, review });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Delete Review (Admin Only) ────────────────────────────────────────────
  deleteReview = async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findByIdAndDelete(id);

      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }

      return res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new ReviewController();
