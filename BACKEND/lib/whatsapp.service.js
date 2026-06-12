/**
 * whatsapp.service.js
 * Utility to send WhatsApp messages to the admin.
 */

import dotenv from "dotenv";
dotenv.config();

/**
 * Send a WhatsApp notification to the Admin.
 * 
 * @param {Object} data 
 * @param {Object} data.user - User details (firstName, lastName, phone, email)
 * @param {Object} data.service - Service details (name, price)
 * @param {Object} data.order - Order details (amount, paymentType, paymentStatus, _id)
 */
export const sendAdminWhatsAppNotification = async ({ user, service, order }) => {
  try {
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "+917567126945";

    const messageBody = `🚨 *New Order Received!* 🚨
    
*Service Details:*
- Name: ${service.name}
- Price: ₹${order.amount}

*Customer Details:*
- Name: ${user.firstName} ${user.lastName}
- Phone: ${user.phone}
- Email: ${user.email}

*Payment Info:*
- Method: ${order.paymentType}
- Status: ${order.paymentStatus}
- Order ID: ${order._id}

Log in to the Admin Panel to manage this request.`;

    // Mock sending for now, until actual provider (Twilio/Meta) is configured
    console.log("=========================================");
    console.log(`[WhatsApp Service] Sending message to ${adminPhone}`);
    console.log(messageBody);
    console.log("=========================================");

    // NOTE: To implement Twilio or Meta Cloud API, you would make an axios post here.
    // e.g. using Twilio:
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({ body: messageBody, from: 'whatsapp:+14155238886', to: `whatsapp:${adminPhone}` });

  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error.message);
  }
};
