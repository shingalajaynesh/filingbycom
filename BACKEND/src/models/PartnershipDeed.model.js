import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["individual", "company"],
    required: true,
    default: "individual",
  },
  fullName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: function () {
      return this.type === "individual";
    },
  },
  companyName: {
    type: String,
    required: function () {
      return this.type === "company";
    },
  },
  address: {
    type: String,
    required: true,
  },
  profitSharePercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  isManagingPartner: {
    type: Boolean,
    default: false,
  },
  canOperateBankAccount: {
    type: Boolean,
    default: false,
  },
});

const partnershipDeedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessActivity: {
      type: String,
      required: true,
    },
    officeAddress: {
      type: String,
      required: true,
    },
    deedDate: {
      type: Date,
      required: true,
    },
    partners: {
      type: [partnerSchema],
      validate: {
        validator: function (val) {
          return val && val.length >= 2;
        },
        message: "A partnership deed must have at least 2 partners.",
      },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "bypassed"],
      default: "pending",
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
      index: true,
    },
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const PartnershipDeed = mongoose.model("PartnershipDeed", partnershipDeedSchema);
export default PartnershipDeed;
