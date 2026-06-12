/**
 * admin.controller.js
 * Handles all admin panel operations:
 *  - Login with hardcoded credentials
 *  - Fetch all orders (active & historical)
 *  - Update order status (Pending → Document Verification → Complete)
 *  - Update payment status (mark cash order as Paid)
 */

import Order from "../models/Order.model.js";

import jwt from "jsonwebtoken";

// ─── Admin Login ────────────────────────────────────────────────────────────
export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "filingby@2024";

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.ADMIN_SECRET || "admin_secret_token", {
    expiresIn: "1d",
  });

  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
  });
};

// ─── Admin Check Auth ────────────────────────────────────────────────────────
export const checkAuth = (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ success: false, authenticated: false });
  }
  try {
    jwt.verify(token, process.env.ADMIN_SECRET || "admin_secret_token");
    return res.status(200).json({ success: true, authenticated: true });
  } catch (error) {
    return res.status(401).json({ success: false, authenticated: false });
  }
};

// ─── Admin Logout ───────────────────────────────────────────────────────────
export const adminLogout = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ─── Get All Orders ──────────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email phone")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Active Orders (not Complete) ───────────────────────────────────────
export const getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: { $ne: "Complete" } })
      .populate("user", "firstName lastName email phone")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Completed Orders (History) ─────────────────────────────────────────
export const getCompletedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Complete" })
      .populate("user", "firstName lastName email phone")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Order Status ─────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["Pending", "Document Verification", "Complete"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    )
      .populate("user", "firstName lastName email phone")
      .populate("service", "name");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Payment Status ───────────────────────────────────────────────────
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["Paid", "Unpaid"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    )
      .populate("user", "firstName lastName email phone")
      .populate("service", "name");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
