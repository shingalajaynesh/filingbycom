import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    pageType: {
      type: String,
      required: true,
      enum: ["home", "service", "location"],
      default: "home",
      index: true,
    },
    portal: {
      type: String,
      required: true,
      enum: ["ca-portal", "virtual-space"],
      default: "ca-portal",
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: false,
      index: true,
    },
    virtualLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VirtualLocation",
      required: false,
      index: true,
    },
    officeCenter: {
      type: String,
      trim: true,
      required: false,
      index: true,
    },
    initials: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
