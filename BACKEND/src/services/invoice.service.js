import Order from "../models/Order.model.js";
import VirtualOfficeOrder from "../models/VirtualOfficeOrder.model.js";
import logger from "./logger.service.js";

/**
 * Generates a sequential invoice number in the format FB-INV-YYYY-XXXX.
 * Counts all paid orders and virtual office orders to guarantee a unique, sequential number.
 * @returns {Promise<string>}
 */
export async function generateInvoiceNumber() {
  try {
    const currentYear = new Date().getFullYear();
    const orderCount = await Order.countDocuments({ paymentStatus: "Paid" });
    const virtualOrderCount = await VirtualOfficeOrder.countDocuments({ paymentStatus: "Paid" });
    const sequence = orderCount + virtualOrderCount + 1;
    const invoiceNum = `FB-INV-${currentYear}-${String(sequence).padStart(4, "0")}`;
    logger.info(`Generated invoice number: ${invoiceNum} (sequence: ${sequence})`);
    return invoiceNum;
  } catch (error) {
    logger.error("Error generating invoice number:", error);
    // Fallback in case of database errors to ensure system doesn't crash
    return `FB-INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  }
}
