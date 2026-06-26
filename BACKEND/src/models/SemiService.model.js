import mongoose from "mongoose";

const semiServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mainService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainService",
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

const SemiService = mongoose.model("SemiService", semiServiceSchema);
export default SemiService;
