/**
 * service.controller.js
 * Handles CRUD operations for Services.
 */

import Service from "../models/Service.model.js";

// ─── Get All Services (Public) ──────────────────────────────────────────────
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, services });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Service (Admin) ─────────────────────────────────────────────────
export const createService = async (req, res) => {
  try {
    const { name, description, priceText, basePrice, icon, billingCycle, slug, tag } = req.body;

    // Check if slug already exists
    const existing = await Service.findOne({ slug });
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
    });

    await service.save();
    return res.status(201).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Service (Admin) ─────────────────────────────────────────────────
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priceText, basePrice, icon, billingCycle, slug, tag } = req.body;

    // If updating slug, check if another service has the new slug
    if (slug) {
      const existing = await Service.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Another service with this slug already exists" });
      }
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { name, description, priceText, basePrice, icon, billingCycle, slug, tag },
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
export const deleteService = async (req, res) => {
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
