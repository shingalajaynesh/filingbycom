import VirtualSpaceInquiry from "../../models/VirtualSpaceInquiry.model.js";
import PartnerApplication from "../../models/PartnerApplication.model.js";
import QuoteLead from "../../models/QuoteLead.model.js";

// ─── Public Endpoints ────────────────────────────────────────────────────────

// Create general inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, email, mobile, purpose, city, message } = req.body;
    if (!name || !email || !mobile || !purpose || !city) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const inquiry = await VirtualSpaceInquiry.create({
      name,
      email,
      mobile,
      purpose,
      city,
      message,
    });

    return res.status(201).json({ success: true, message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create partner application
export const createPartnerApplication = async (req, res) => {
  try {
    const { spaceName, ownerName, email, mobile, city, spaceType, deskCount } = req.body;
    if (!spaceName || !ownerName || !email || !mobile || !city || !spaceType || !deskCount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const application = await PartnerApplication.create({
      spaceName,
      ownerName,
      email,
      mobile,
      city,
      spaceType,
      deskCount: Number(deskCount),
    });

    return res.status(201).json({ success: true, message: "Partner application submitted successfully", application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create quote lead
export const createQuoteLead = async (req, res) => {
  try {
    const { city, purpose, businessType, name, email, mobile, estimatedPrice } = req.body;
    if (!city || !purpose || !businessType || !name || !email || !mobile || !estimatedPrice) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const lead = await QuoteLead.create({
      city,
      purpose,
      businessType,
      name,
      email,
      mobile,
      estimatedPrice: Number(estimatedPrice),
    });

    return res.status(201).json({ success: true, message: "Quote lead registered successfully", lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin Endpoints (Protected) ──────────────────────────────────────────────

// Get all inquiries
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await VirtualSpaceInquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all partner applications
export const getPartnerApplications = async (req, res) => {
  try {
    const applications = await PartnerApplication.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all quote leads
export const getQuoteLeads = async (req, res) => {
  try {
    const leads = await QuoteLead.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update inquiry status
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Contacted", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const inquiry = await VirtualSpaceInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    return res.status(200).json({ success: true, inquiry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update partner application status
export const updatePartnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await PartnerApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update quote lead status
export const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Contacted", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const lead = await QuoteLead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: "Quote lead not found" });
    }

    return res.status(200).json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
