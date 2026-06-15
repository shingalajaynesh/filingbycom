import mongoose from "mongoose";

const mainServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

const MainService = mongoose.model("MainService", mainServiceSchema);
export default MainService;
