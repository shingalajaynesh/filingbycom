import crypto from "crypto";
import Razorpay from "razorpay";
import VirtualSpaceInquiry from "../../models/VirtualSpaceInquiry.model.js";
import PartnerApplication from "../../models/PartnerApplication.model.js";
import QuoteLead from "../../models/QuoteLead.model.js";
import VirtualOfficeOrder from "../../models/VirtualOfficeOrder.model.js";
import VirtualLocation from "../../models/VirtualLocation.model.js";
import User from "../../models/User.model.js";
import { generateInvoiceNumber } from "../../services/invoice.service.js";
import { locationCache } from "../../services/cache.service.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});


const initialSeedLocations = [
  {
    slug: "surat",
    name: "Surat",
    state: "Gujarat",
    tagline: "Ring Road, Adajan, Vesu & Varachha",
    rate: "999",
    image: "https://images.unsplash.com/photo-1609137144814-722c608f6575?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.818318182283!2d72.7842608!3d21.199321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04df1603504bf%3A0xe54ef48f86f7881c!2sAdajan%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Adajan Compliance Hub",
        slug: "adajan",
        address: "304, Prime Shoppers, Near Green Arcade, Adajan, Surat, Gujarat - 395009",
        feature: "Prime Commercial Hub, Direct Connectivity",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        priceGST: "999",
        priceIncorp: "1,299",
        priceMail: "599",
        amenities: ["High-speed Wi-Fi", "Courier Handling", "Meeting Rooms", "Professional Receptionist", "GST Officer Desk"],
        description: "Located in one of the most premium commercial areas of Surat, Adajan. Perfect for GST registration, company incorporation, and business correspondence.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.818318182283!2d72.7842608!3d21.199321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04df1603504bf%3A0xe54ef48f86f7881c!2sAdajan%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Vesu Business Center",
        slug: "vesu",
        address: "502, Rajhans VIP Plaza, VIP Road, Vesu, Surat, Gujarat - 395007",
        feature: "Premium VIP Road Landmark Address",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        priceGST: "1,099",
        priceIncorp: "1,399",
        priceMail: "649",
        amenities: ["Premium Address", "VIP Lounge Access", "Meeting Rooms", "Digital Mail Forwarding", "Name Board Placement"],
        description: "Located on the premium VIP Road in Vesu, Surat's fastest-growing business hub. Extremely credible address for startup registrations and trade licenses.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.127827878643!2d72.8250849!3d21.1458482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be051d3c874d6df%3A0xe54ef48f86f7881c!2sVesu%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "Is physical verification supported in Surat for GST registration?", a: "Yes, our representatives assist in managing site inspections at our Surat centers by arranging the physical desk and documentation." },
      { q: "Will I get a NOC and utility bill?", a: "Yes, we provide the complete legal documentation kit including the NOC, Utility Bill, Rent Agreement, and Consent Letter." }
    ]
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Bandra Kurla Complex, Andheri East & Nariman Point",
    rate: "1,299",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3770.835848243377!2d72.86475737597125!3d19.070941187085732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e6df3ab0b9%3A0xe54ef48f86f7881c!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "BKC Prestige Towers",
        slug: "bkc",
        address: "Bandra Kurla Complex, G Block, BKC Road, Bandra East, Mumbai - 400051",
        feature: "Grade-A Financial Hub Office Space",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        priceGST: "1,499",
        priceIncorp: "1,899",
        priceMail: "799",
        amenities: ["Premium BKC Address", "Luxury Boardrooms", "Corporate Lounge", "Reception Desk", "GST Inspection Support"],
        description: "The crown jewel of Mumbai financial hubs, BKC hosts top tier banks and global multinationals. Secure an address here to instantly elevate your business status.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835848243377!2d72.86475737597125!3d19.070941187085732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e6df3ab0b9%3A0xe54ef48f86f7881c!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "Do you support BMC/Commercial taxes verification in Mumbai?", a: "Yes, all municipal NOC standards and local tax requirements are fully satisfied by our Mumbai documentation." }
    ]
  }
];

class VirtualSpaceController {
  // ─── Public Marketing Enpoint Handlers ─────────────────────────────────────
  
  // Submit general inquiry
  createInquiry = async (req, res) => {
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

  // Submit coworking/space partner request
  createPartnerApplication = async (req, res) => {
    try {
      const { spaceName, ownerName, email, mobile, city, spaceType, deskCount, address, price, image, description, amenities } = req.body;
      if (!spaceName || !ownerName || !email || !mobile || !city || !spaceType || !deskCount || !address || !price) {
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
        address,
        price,
        image: image || "",
        description: description || "",
        amenities: amenities || [],
      });

      return res.status(201).json({ success: true, message: "Partner application submitted successfully", application });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Register live calculator lead
  createQuoteLead = async (req, res) => {
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

  // ─── Dynamic Workspace Location Handlers ───────────────────────────────────

  // Retrieve list of cities/locations
  getLocations = async (req, res) => {
    try {
      const cached = locationCache.get("locations");
      if (cached) {
        return res.status(200).json({ success: true, locations: cached });
      }

      let locations = await VirtualLocation.find().lean();
      const hasDelhi = locations.some(l => l.slug === "delhi");
      
      if (locations.length === 0 || hasDelhi) {
        if (hasDelhi) {
          await VirtualLocation.deleteMany({ slug: "delhi" });
        }
        const currentLocs = await VirtualLocation.find().lean();
        const hasSurat = currentLocs.some(l => l.slug === "surat");
        const hasMumbai = currentLocs.some(l => l.slug === "mumbai");
        
        if (!hasSurat) {
          const suratData = initialSeedLocations.find(l => l.slug === "surat");
          if (suratData) await VirtualLocation.create(suratData);
        }
        if (!hasMumbai) {
          const mumbaiData = initialSeedLocations.find(l => l.slug === "mumbai");
          if (mumbaiData) await VirtualLocation.create(mumbaiData);
        }
        locations = await VirtualLocation.find().lean();
      }
      
      locationCache.set("locations", locations);
      return res.status(200).json({ success: true, locations });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Fetch single city location detail by slug
  getLocationBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const location = await VirtualLocation.findOne({ slug: slug.toLowerCase() }).lean();
      if (!location) {
        return res.status(404).json({ success: false, message: "Location not found" });
      }
      return res.status(200).json({ success: true, location });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create workspace location details
  createLocation = async (req, res) => {
    try {
      const { slug, name, state, tagline, rate, image, mapEmbed, addresses, faqs } = req.body;
      if (!slug || !name || !state) {
        return res.status(400).json({ success: false, message: "Slug, Name and State are required fields" });
      }

      const existing = await VirtualLocation.findOne({ slug: slug.toLowerCase() }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: "Location slug already exists" });
      }

      await VirtualLocation.create({
        slug: slug.toLowerCase(),
        name,
        state,
        tagline,
        rate,
        image,
        mapEmbed,
        addresses: addresses || [],
        faqs: faqs || [],
      });

      locationCache.clear();
      return res.status(201).json({ success: true, message: "Location created successfully", location });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update existing city workspace details
  updateLocation = async (req, res) => {
    try {
      const { id } = req.params;
      const { slug, name, state, tagline, rate, image, mapEmbed, addresses, faqs } = req.body;

      const location = await VirtualLocation.findByIdAndUpdate(
        id,
        {
          slug: slug ? slug.toLowerCase() : undefined,
          name,
          state,
          tagline,
          rate,
          image,
          mapEmbed,
          addresses,
          faqs,
        },
        { new: true, runValidators: true }
      );

      if (!location) {
        return res.status(404).json({ success: false, message: "Location not found" });
      }

      locationCache.clear();
      return res.status(200).json({ success: true, message: "Location updated successfully", location });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Remove city location details
  deleteLocation = async (req, res) => {
    try {
      const { id } = req.params;
      const location = await VirtualLocation.findByIdAndDelete(id);
      if (!location) {
        return res.status(404).json({ success: false, message: "Location not found" });
      }
      locationCache.clear();
      return res.status(200).json({ success: true, message: "Location deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Client Dashboard Orders / Bookings ───────────────────────────────────

  // Retrieve workspace bookings for logged-in user
  getUserVirtualOrders = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      const orders = await VirtualOfficeOrder.find({ user: user._id, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Retrieve detailed single workspace booking
  getUserVirtualOrderById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      const order = await VirtualOfficeOrder.findOne({ _id: id, user: user._id, isDeleted: { $ne: true } }).lean();
      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      return res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Handle checkout and creation of workspace orders
  createVirtualOrder = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      const { citySlug, addressName, selectedPlan, price } = req.body;
      if (!citySlug || !addressName || !selectedPlan || !price) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const invoiceNumber = await generateInvoiceNumber();
      const invoiceDate = new Date();

      const order = await VirtualOfficeOrder.create({
        user: user._id,
        citySlug: citySlug.toLowerCase(),
        addressName,
        selectedPlan,
        price: Number(price),
        complianceStatus: "Payment Received",
        paymentStatus: "Paid",
        paymentId: "pay_VO_" + Date.now(),
        invoiceNumber,
        invoiceDate,
        clientDocuments: {
          panCard: "",
          aadhaarCard: "",
          photo: "",
          companyName: "",
          incorporationCert: "",
        },
        complianceDocuments: {
          nocFile: "",
          utilityBillFile: "",
          rentAgreementFile: "",
          consentLetterFile: "",
        },
        mailLogs: [],
        inspections: []
      });

      return res.status(201).json({ success: true, message: "Virtual Office order placed successfully", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Upload/update user KYC documentation files
  uploadUserVirtualDocuments = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      const { panCard, aadhaarCard, photo, companyName, incorporationCert } = req.body;

      const order = await VirtualOfficeOrder.findOne({ _id: id, user: user._id, isDeleted: { $ne: true } });
      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      order.clientDocuments = {
        panCard: panCard !== undefined ? panCard : (order.clientDocuments?.panCard || ""),
        aadhaarCard: aadhaarCard !== undefined ? aadhaarCard : (order.clientDocuments?.aadhaarCard || ""),
        photo: photo !== undefined ? photo : (order.clientDocuments?.photo || ""),
        companyName: companyName !== undefined ? companyName : (order.clientDocuments?.companyName || ""),
        incorporationCert: incorporationCert !== undefined ? incorporationCert : (order.clientDocuments?.incorporationCert || ""),
      };

      if (order.complianceStatus === "Payment Received") {
        order.complianceStatus = "Documents Uploaded";
      }

      await order.save();
      return res.status(200).json({ success: true, message: "KYC Documents updated successfully", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Admin Controller Actions ──────────────────────────────────────────────

  // Fetch all inquiries submitted
  getInquiries = async (req, res) => {
    try {
      const inquiries = await VirtualSpaceInquiry.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, inquiries });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Fetch all coworker partner applications
  getPartnerApplications = async (req, res) => {
    try {
      const applications = await PartnerApplication.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Fetch all quote estimates leads
  getQuoteLeads = async (req, res) => {
    try {
      const leads = await QuoteLead.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, leads });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update inquiry follow up status
  updateInquiryStatus = async (req, res) => {
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

  // Update onboarding request status
  updatePartnerStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["Pending", "Approved", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }

      const application = await PartnerApplication.findById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }

      const oldStatus = application.status;
      application.status = status;
      await application.save();

      if (status === "Approved") {
        // Find or create VirtualLocation for this city
        const citySlug = application.city.toLowerCase().trim().replace(/\s+/g, "-");
        let location = await VirtualLocation.findOne({ slug: citySlug });
        if (!location) {
          location = await VirtualLocation.create({
            slug: citySlug,
            name: application.city.trim(),
            state: application.city.trim(),
            tagline: `Premium corporate address options in ${application.city.trim()}`,
            rate: application.price || "999",
            image: application.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            addresses: [],
            faqs: [
              { q: `Is physical verification supported in ${application.city.trim()}?`, a: `Yes, our representatives assist in managing site inspections at our ${application.city.trim()} centers by arranging the physical desk and documentation.` },
              { q: "Will I get a NOC and utility bill?", a: "Yes, we provide the complete legal documentation kit including the NOC, Utility Bill, Rent Agreement, and Consent Letter." }
            ]
          });
        }

        // Check if this address already exists under this city to avoid duplicates
        const addressSlug = application.spaceName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        const exists = location.addresses.some(addr => addr.slug === addressSlug);
        if (!exists) {
          const basePriceVal = Number(application.price) || 999;
          const priceGST = String(basePriceVal);
          const priceIncorp = String(basePriceVal + 300);
          const priceMail = String(Math.max(100, basePriceVal - 400));
          
          location.addresses.push({
            name: application.spaceName.trim(),
            slug: addressSlug,
            address: application.address.trim(),
            feature: `Onboarded Workspace (${application.spaceType})`,
            image: application.image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
            priceGST,
            priceIncorp,
            priceMail,
            amenities: application.amenities && application.amenities.length > 0 
              ? application.amenities 
              : ["High-speed Wi-Fi", "Courier Handling", "Meeting Rooms", "GST Officer Desk"],
            description: application.description || `Excellent prime commercial desk space at ${application.spaceName.trim()}. Suitable for virtual registration, company registration, and trade license processing.`,
            photos: [application.image].filter(Boolean)
          });
          
          await location.save();
          locationCache.clear();
        }
      }

      return res.status(200).json({ success: true, application });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update quote estimate follow up status
  updateQuoteStatus = async (req, res) => {
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

  // Fetch all virtual office address bookings
  adminGetVirtualOrders = async (req, res) => {
    try {
      const orders = await VirtualOfficeOrder.find({ isDeleted: { $ne: true } }).populate("user", "firstName lastName email phone").sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Update virtual office booking compliance/payment detail
  adminUpdateVirtualOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { complianceStatus, paymentStatus, nocFile, utilityBillFile, rentAgreementFile, consentLetterFile } = req.body;

      const order = await VirtualOfficeOrder.findOne({ _id: id, isDeleted: { $ne: true } });
      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      if (complianceStatus) order.complianceStatus = complianceStatus;
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
        if (paymentStatus === "Paid" && !order.invoiceNumber) {
          order.invoiceNumber = await generateInvoiceNumber();
          order.invoiceDate = new Date();
        }
      }

      if (!order.complianceDocuments) {
        order.complianceDocuments = {};
      }

      if (nocFile !== undefined) order.complianceDocuments.nocFile = nocFile;
      if (utilityBillFile !== undefined) order.complianceDocuments.utilityBillFile = utilityBillFile;
      if (rentAgreementFile !== undefined) order.complianceDocuments.rentAgreementFile = rentAgreementFile;
      if (consentLetterFile !== undefined) order.complianceDocuments.consentLetterFile = consentLetterFile;

      await order.save();
      return res.status(200).json({ success: true, message: "Booking updated successfully", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Record an incoming physical courier item
  adminAddMailLog = async (req, res) => {
    try {
      const { id } = req.params;
      const { sender, category, actionTaken, attachmentUrl, notes } = req.body;

      if (!sender || !category) {
        return res.status(400).json({ success: false, message: "Sender and category are required" });
      }

      const order = await VirtualOfficeOrder.findOne({ _id: id, isDeleted: { $ne: true } });
      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      order.mailLogs.push({
        sender,
        category,
        actionTaken: actionTaken || "Scanned & Emailed",
        attachmentUrl: attachmentUrl || "",
        notes: notes || "",
        dateReceived: new Date()
      });

      await order.save();
      return res.status(200).json({ success: true, message: "Mail log added successfully", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Log/schedule verification audits
  adminAddVerificationAudit = async (req, res) => {
    try {
      const { id } = req.params;
      const { dateScheduled, status, inspectorName, notes } = req.body;

      if (!dateScheduled) {
        return res.status(400).json({ success: false, message: "Date scheduled is required" });
      }

      const order = await VirtualOfficeOrder.findOne({ _id: id, isDeleted: { $ne: true } });
      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      order.inspections.push({
        dateScheduled: new Date(dateScheduled),
        status: status || "Scheduled",
        inspectorName: inspectorName || "",
        notes: notes || ""
      });

      await order.save();
      return res.status(200).json({ success: true, message: "Verification audit scheduled successfully", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Soft deletes a Virtual Office booking order with a reason note
  deleteVirtualOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: "A deletion reason is required." });
      }

      const order = await VirtualOfficeOrder.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        {
          isDeleted: true,
          deletedAt: new Date(),
          deleteReason: reason
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      return res.status(200).json({ success: true, message: "Booking successfully deleted", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // Client-initiated soft delete/cancel of their own Virtual Office order
  deleteUserVirtualOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const user = req.user; // verifyUser middleware sets req.user to local user DB profile

      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      const order = await VirtualOfficeOrder.findOne({ _id: id, user: user._id, isDeleted: { $ne: true } });
      if (!order) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      // Restrict cancellation to initial stages ("Payment Received" or "Documents Uploaded")
      if (order.complianceStatus !== "Payment Received" && order.complianceStatus !== "Documents Uploaded") {
        return res.status(400).json({ success: false, message: "Cannot cancel a booking that has progressed past document upload." });
      }

      order.isDeleted = true;
      order.deletedAt = new Date();
      order.deleteReason = reason || "Cancelled by client (mistake)";
      await order.save();

      return res.status(200).json({ success: true, message: "Booking successfully cancelled", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Razorpay Checkout Integration ──────────────────────────────────────────

  createVirtualRazorpayOrder = async (req, res) => {
    try {
      const { price } = req.body;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (!price) {
        return res.status(400).json({ success: false, message: "Price is required" });
      }

      const amount = Math.round(Number(price) * 100); // in paise

      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_vo_${Date.now()}`,
      };

      const keyId = process.env.RAZORPAY_KEY_ID;
      if (!keyId) {
        return res.status(500).json({ success: false, message: "Razorpay Key ID not configured on server" });
      }

      const order = await razorpay.orders.create(options);
      return res.status(200).json({ success: true, order, keyId });
    } catch (error) {
      console.error("Virtual Razorpay Order Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  verifyVirtualOnlineOrder = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, citySlug, addressName, selectedPlan, price } = req.body;
      const user = req.user;

      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return res.status(500).json({ success: false, message: "Razorpay Key Secret not configured on server" });
      }

      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
      }

      const invoiceNumber = await generateInvoiceNumber();
      const invoiceDate = new Date();

      // Create the order
      const newOrder = await VirtualOfficeOrder.create({
        user: user._id,
        citySlug: citySlug.toLowerCase(),
        addressName,
        selectedPlan,
        price: Number(price),
        complianceStatus: "Payment Received",
        paymentStatus: "Paid",
        paymentId: razorpay_payment_id,
        invoiceNumber,
        invoiceDate,
        clientDocuments: {
          panCard: "",
          aadhaarCard: "",
          photo: "",
          companyName: "",
          incorporationCert: "",
        },
        complianceDocuments: {
          nocFile: "",
          utilityBillFile: "",
          rentAgreementFile: "",
          consentLetterFile: "",
        },
        mailLogs: [],
        inspections: []
      });

      return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      console.error("Verify Virtual Order Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Partner Portal Handlers ───────────────────────────────────────────────

  getPartnerProperties = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const properties = await PartnerApplication.find({ email: user.email })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, properties });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getPartnerLeads = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // 1. Get properties submitted/owned by this user email
      const properties = await PartnerApplication.find({ email: user.email }).lean();
      
      // We only care about Approved properties for active leads/orders
      const approvedSpaceNames = properties
        .filter(p => p.status === "Approved")
        .map(p => p.spaceName.trim());

      if (approvedSpaceNames.length === 0) {
        return res.status(200).json({ success: true, leads: [] });
      }

      // 2. Query virtual office orders where addressName is one of the partner's spaceNames
      const orders = await VirtualOfficeOrder.find({
        addressName: { $in: approvedSpaceNames },
        isDeleted: { $ne: true }
      })
        .populate("user", "firstName lastName email phone")
        .sort({ createdAt: -1 })
        .lean();

      // 3. Map orders into dynamic Leads objects
      const leads = orders.map(order => ({
        _id: order._id,
        clientName: order.user ? `${order.user.firstName} ${order.user.lastName}`.trim() : "Valued Client",
        clientEmail: order.user ? order.user.email : "N/A",
        clientPhone: order.user ? order.user.phone || "N/A" : "N/A",
        spaceName: order.addressName,
        plan: order.selectedPlan,
        price: order.price,
        paymentStatus: order.paymentStatus,
        complianceStatus: order.complianceStatus,
        createdAt: order.createdAt,
        invoiceNumber: order.invoiceNumber
      }));

      return res.status(200).json({ success: true, leads });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new VirtualSpaceController();
