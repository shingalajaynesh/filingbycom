import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    seoTitle: {
      type: String,
      required: false,
      trim: true,
    },
    seoDescription: {
      type: String,
      required: false,
      trim: true,
    },
    seoKeywords: {
      type: String,
      required: false,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    icon: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ["Month", "Quarter", "Year", "Fixed"],
      default: "Fixed",
    },
    tag: {
      type: String,
      required: false,
    },
    portal: {
      type: String,
      required: true,
      enum: ["ca-portal", "virtual-space"],
      default: "ca-portal",
    },
    mainService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainService",
      required: false,
    },
    semiService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SemiService",
      required: false,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    navSection: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    processSteps: {
      type: [String],
      default: [],
    },
    faqs: [
      {
        q: { type: String, required: true },
        a: { type: String, required: true },
      }
    ],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
