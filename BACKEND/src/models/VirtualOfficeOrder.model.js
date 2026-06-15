import mongoose from "mongoose";

const clientDocSchema = new mongoose.Schema({
  panCard: { type: String, default: "" }, // URL of uploaded file
  aadhaarCard: { type: String, default: "" },
  photo: { type: String, default: "" },
  companyName: { type: String, default: "" },
  incorporationCert: { type: String, default: "" },
});

const complianceDocsSchema = new mongoose.Schema({
  nocFile: { type: String, default: "" }, // Admin-uploaded official PDF NOC
  utilityBillFile: { type: String, default: "" }, // Admin-uploaded electricity bill
  rentAgreementFile: { type: String, default: "" }, // Stamped Rent Agreement
  consentLetterFile: { type: String, default: "" }, // Consent Letter
});

const mailLogSchema = new mongoose.Schema({
  dateReceived: { type: Date, default: Date.now },
  sender: { type: String, required: true },
  category: { type: String, enum: ["GST Department", "Income Tax", "Bank Courier", "General Courier", "Other"], required: true },
  actionTaken: { type: String, enum: ["Scanned & Emailed", "Forwarded", "Stored for Pickup"], default: "Scanned & Emailed" },
  attachmentUrl: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const verificationAuditSchema = new mongoose.Schema({
  dateScheduled: { type: Date, required: true },
  status: { type: String, enum: ["Scheduled", "Success", "Action Required", "Missed"], default: "Scheduled" },
  inspectorName: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const virtualOfficeOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    citySlug: {
      type: String, // "surat", "mumbai"
      required: true,
    },
    addressName: {
      type: String, // e.g., "Adajan Compliance Hub"
      required: true,
    },
    selectedPlan: {
      type: String,
      enum: ["gst", "incorporation", "mailing"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    complianceStatus: {
      type: String,
      enum: ["Payment Received", "Documents Uploaded", "Rent Agreement Sent", "NOC Issued", "GST Approved"],
      default: "Payment Received",
    },
    clientDocuments: clientDocSchema,
    complianceDocuments: complianceDocsSchema,
    mailLogs: [mailLogSchema],
    inspections: [verificationAuditSchema],
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Paid",
    },
    paymentId: { type: String, default: "" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deleteReason: {
      type: String,
    },
    invoiceNumber: {
      type: String,
      sparse: true,
      unique: true,
    },
    invoiceDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const VirtualOfficeOrder = mongoose.model("VirtualOfficeOrder", virtualOfficeOrderSchema);
export default VirtualOfficeOrder;
