import mongoose from "mongoose";

const redirectSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    statusCode: {
      type: Number,
      default: 301,
      enum: [301, 302, 307, 308],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Redirect = mongoose.model("Redirect", redirectSchema);
export default Redirect;
