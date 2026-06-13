import mongoose from "mongoose";

const virtualSpaceInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const VirtualSpaceInquiry = mongoose.model("VirtualSpaceInquiry", virtualSpaceInquirySchema);
export default VirtualSpaceInquiry;
