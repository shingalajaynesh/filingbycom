import Service from "../../models/Service.model.js";
import MainService from "../../models/MainService.model.js";

class ServiceController {
  // ─── Get All Main Services (Public) ─────────────────────────────────────────
  getAllMainServices = async (req, res) => {
    try {
      const { portal } = req.query;
      const filter = portal ? { portal } : {};
      const mainServices = await MainService.find(filter).sort({ order: 1, createdAt: -1 }).lean();
      return res.status(200).json({ success: true, mainServices });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Create Main Service (Admin) ────────────────────────────────────────────
  createMainService = async (req, res) => {
    try {
      const { name, order, isActive, portal } = req.body;
      const existing = await MainService.findOne({ name }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: "MainService with this name already exists" });
      }
      const mainService = new MainService({ name, order, isActive, portal });
      await mainService.save();
      return res.status(201).json({ success: true, mainService });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Update Main Service (Admin) ────────────────────────────────────────────
  updateMainService = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, order, isActive, portal } = req.body;
      if (name) {
        const existing = await MainService.findOne({ name, _id: { $ne: id } }).lean();
        if (existing) {
          return res.status(400).json({ success: false, message: "Another MainService with this name already exists" });
        }
      }
      const mainService = await MainService.findByIdAndUpdate(
        id,
        { name, order, isActive, portal },
        { new: true, runValidators: true }
      );
      if (!mainService) return res.status(404).json({ success: false, message: "MainService not found" });
      return res.status(200).json({ success: true, mainService });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Delete Main Service (Admin) ────────────────────────────────────────────
  deleteMainService = async (req, res) => {
    try {
      const { id } = req.params;
      const mainService = await MainService.findByIdAndDelete(id);
      if (!mainService) return res.status(404).json({ success: false, message: "MainService not found" });
      // Also consider unlinking or deleting associated services? Let's just return for now.
      return res.status(200).json({ success: true, message: "MainService deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get All Services (Public) ──────────────────────────────────────────────
  getAllServices = async (req, res) => {
    try {
      const { portal } = req.query;
      const filter = portal ? { portal } : {};
      const services = await Service.find(filter)
        .populate("mainService")
        .sort({ order: 1, createdAt: -1 })
        .lean();
      return res.status(200).json({ success: true, services });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Create Service (Admin) ─────────────────────────────────────────────────
  createService = async (req, res) => {
    try {
      const { 
        name, description, priceText, basePrice, icon, billingCycle, slug, tag, portal,
        mainService, order, navSection, isActive, isPopular, documentsRequired, processSteps, faqs
      } = req.body;

      // Check if slug already exists
      const existing = await Service.findOne({ slug }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: "Service with this slug already exists" });
      }

      const service = new Service({
        name,
        description,
        priceText,
        basePrice,
        icon,
        billingCycle,
        slug,
        tag,
        portal,
        mainService,
        order,
        navSection, 
        isActive, 
        isPopular,
        documentsRequired, 
        processSteps, 
        faqs
      });

      await service.save();
      return res.status(201).json({ success: true, service });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Update Service (Admin) ─────────────────────────────────────────────────
  updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        name, description, priceText, basePrice, icon, billingCycle, slug, tag, portal,
        mainService, order, navSection, isActive, isPopular, documentsRequired, processSteps, faqs
      } = req.body;

      // If updating slug, check if another service has the new slug
      if (slug) {
        const existing = await Service.findOne({ slug, _id: { $ne: id } }).lean();
        if (existing) {
          return res.status(400).json({ success: false, message: "Another service with this slug already exists" });
        }
      }

      const service = await Service.findByIdAndUpdate(
        id,
        { 
          name, description, priceText, basePrice, icon, billingCycle, slug, tag, portal,
          mainService, order, navSection, isActive, isPopular, documentsRequired, processSteps, faqs
        },
        { new: true, runValidators: true }
      );

      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }

      return res.status(200).json({ success: true, service });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Delete Service (Admin) ─────────────────────────────────────────────────
  deleteService = async (req, res) => {
    try {
      const { id } = req.params;

      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }

      return res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new ServiceController();
