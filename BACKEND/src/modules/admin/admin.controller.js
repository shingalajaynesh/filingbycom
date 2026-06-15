import Order from "../../models/Order.model.js";
import jwt from "jsonwebtoken";
import { generateInvoiceNumber } from "../../services/invoice.service.js";

class AdminController {
  // ─── Admin Login ────────────────────────────────────────────────────────────
  adminLogin = (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_SECRET = process.env.ADMIN_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_SECRET) {
      return res.status(500).json({ success: false, message: "Server configuration error: Admin credentials/secret are not configured." });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ role: "admin" }, ADMIN_SECRET, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  };

  // ─── Admin Check Auth ────────────────────────────────────────────────────────
  checkAuth = (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({ success: false, authenticated: false });
    }
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: "Server configuration error: ADMIN_SECRET is not configured." });
    }
    try {
      jwt.verify(token, secret);
      return res.status(200).json({ success: true, authenticated: true });
    } catch (error) {
      return res.status(401).json({ success: false, authenticated: false });
    }
  };

  // ─── Admin Logout ───────────────────────────────────────────────────────────
  adminLogout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  };

  // ─── Get All Orders ──────────────────────────────────────────────────────────
  getAllOrders = async (req, res) => {
    try {
      const { portal } = req.query;
      let orders = await Order.find({ isDeleted: { $ne: true } })
        .populate("user", "firstName lastName email phone")
        .populate("service", "name portal")
        .sort({ createdAt: -1 });

      if (portal) {
        orders = orders.filter((o) => (o.service?.portal || "ca-portal") === portal);
      }

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get Active Orders (not Complete) ───────────────────────────────────────
  getActiveOrders = async (req, res) => {
    try {
      const { portal } = req.query;
      let orders = await Order.find({ isDeleted: { $ne: true }, orderStatus: { $ne: "Complete" } })
        .populate("user", "firstName lastName email phone")
        .populate("service", "name portal")
        .sort({ createdAt: -1 });

      if (portal) {
        orders = orders.filter((o) => (o.service?.portal || "ca-portal") === portal);
      }

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get Completed Orders (History) ─────────────────────────────────────────
  getCompletedOrders = async (req, res) => {
    try {
      const { portal } = req.query;
      let orders = await Order.find({ isDeleted: { $ne: true }, orderStatus: "Complete" })
        .populate("user", "firstName lastName email phone")
        .populate("service", "name portal")
        .sort({ createdAt: -1 });

      if (portal) {
        orders = orders.filter((o) => (o.service?.portal || "ca-portal") === portal);
      }

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Update Order Status ─────────────────────────────────────────────────────
  updateOrderStatus = async (req, res) => {
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
  updatePaymentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const validStatuses = ["Paid", "Unpaid"];
      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: "Invalid payment status" });
      }

      const order = await Order.findById(id)
        .populate("user", "firstName lastName email phone")
        .populate("service", "name");

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      order.paymentStatus = paymentStatus;
      if (paymentStatus === "Paid" && !order.invoiceNumber) {
        order.invoiceNumber = await generateInvoiceNumber();
        order.invoiceDate = new Date();
      }

      await order.save();

      return res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Delete Order (Soft Delete) ──────────────────────────────────────────────
  deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: "A deletion reason is required." });
      }

      const order = await Order.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
          deleteReason: reason
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({ success: true, message: "Order successfully deleted", order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new AdminController();
