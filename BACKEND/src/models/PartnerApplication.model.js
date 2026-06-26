import mongoose from "mongoose";

const partnerApplicationSchema = new mongoose.Schema(
  {
    spaceName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
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
    city: {
      type: String,
      required: true,
      trim: true,
    },
    spaceType: {
      type: String,
      required: true,
    },
    deskCount: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    priceGST: {
      type: String,
      default: "",
    },
    priceIncorp: {
      type: String,
      default: "",
    },
    priceMail: {
      type: String,
      default: "",
    },
    descGST: {
      type: String,
      default: "",
    },
    descIncorp: {
      type: String,
      default: "",
    },
    descMail: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    amenities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const PartnerApplication = mongoose.model("PartnerApplication", partnerApplicationSchema);
export default PartnerApplication;
