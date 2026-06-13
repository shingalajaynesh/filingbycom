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
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;