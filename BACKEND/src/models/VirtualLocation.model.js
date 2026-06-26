import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  address: { type: String, required: true },
  feature: { type: String, default: "" },
  image: { type: String, default: "" },
  priceGST: { type: String, default: "999" },
  priceIncorp: { type: String, default: "1,299" },
  priceMail: { type: String, default: "599" },
  descGST: { type: String, default: "" },
  descIncorp: { type: String, default: "" },
  descMail: { type: String, default: "" },
  amenities: [String],
  description: { type: String, default: "" },
  mapEmbed: { type: String, default: "" },
  photos: [String],
  partnerApplicationId: { type: String, default: "" },
});

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true },
});

const virtualLocationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      default: "",
    },
    rate: {
      type: String,
      default: "999",
    },
    image: {
      type: String,
      default: "",
    },
    mapEmbed: {
      type: String,
      default: "",
    },
    addresses: [addressSchema],
    faqs: [faqSchema],
  },
  { timestamps: true }
);

const VirtualLocation = mongoose.model("VirtualLocation", virtualLocationSchema);
export default VirtualLocation;
