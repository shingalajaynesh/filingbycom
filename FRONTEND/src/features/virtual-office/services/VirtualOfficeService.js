import axios from "axios";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

class VirtualOfficeService {
  // ─── Public Marketing Endpoints ──────────────────────────────────────────

  /**
   * Submits a general inquiry request.
   * @param {Object} payload - { name, email, mobile, purpose, city, message }
   */
  async createInquiry(payload) {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/inquiries`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to create inquiry");
    }
  }

  /**
   * Submits partner onboarding application.
   * @param {Object} payload - { spaceName, ownerName, email, mobile, city, spaceType, deskCount }
   */
  async createPartnerApplication(payload) {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/partner-onboarding`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit partner application");
    }
  }

  /**
   * Submits a quote lead estimation check.
   * @param {Object} payload - { city, purpose, businessType, name, email, mobile, estimatedPrice }
   */
  async createQuoteLead(payload) {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/quotes`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to submit quote lead");
    }
  }

  // ─── Client Endpoints ──────────────────────────────────────────────────────

  /**
   * Fetches all virtual office orders for the logged-in client.
   * @param {string} token - Clerk authorization token
   */
  async getUserOrders(token) {
    try {
      const res = await axios.get(`${API_BASE}/virtual-space/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch user orders");
    }
  }

  /**
   * Fetches single virtual office order by ID for the logged-in client.
   * @param {string} token - Clerk authorization token
   * @param {string} id - Booking order ID
   */
  async getUserOrderById(token, id) {
    try {
      const res = await axios.get(`${API_BASE}/virtual-space/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch user order");
    }
  }

  /**
   * Creates a new virtual office lease booking order.
   * @param {string} token - Clerk authorization token
   * @param {Object} payload - { citySlug, addressName, selectedPlan, price }
   */
  async createVirtualOrder(token, payload) {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/orders`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to create virtual order");
    }
  }

  /**
   * Uploads/updates client KYC files for a booking.
   * @param {string} token - Clerk authorization token
   * @param {string} id - Booking order ID
   * @param {Object} documents - { panCard, aadhaarCard, photo, companyName, incorporationCert }
   */
  async uploadUserDocuments(token, id, documents) {
    try {
      const res = await axios.post(`${API_BASE}/virtual-space/orders/${id}/documents`, documents, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to upload documents");
    }
  }

  // ─── Admin Endpoints ───────────────────────────────────────────────────────

  /**
   * Fetches all Virtual Office orders for administrative view.
   */
  async adminGetOrders() {
    try {
      const res = await axios.get(`${API_BASE}/admin/virtual-space/orders`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to fetch admin orders");
    }
  }

  /**
   * Updates booking compliance status and attaches official documents.
   * @param {string} id - Booking order ID
   * @param {Object} payload - { complianceStatus, paymentStatus, nocFile, utilityBillFile, rentAgreementFile, consentLetterFile }
   */
  async adminUpdateOrder(id, payload) {
    try {
      const res = await axios.put(`${API_BASE}/admin/virtual-space/orders/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to update admin order");
    }
  }

  /**
   * Logs an incoming mail delivery at a leased space.
   * @param {string} id - Booking order ID
   * @param {Object} mailItem - { sender, category, actionTaken, attachmentUrl, notes }
   */
  async adminAddMailLog(id, mailItem) {
    try {
      const res = await axios.post(`${API_BASE}/admin/virtual-space/orders/${id}/mail`, mailItem, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to add mail log");
    }
  }

  /**
   * Schedules or updates a tax officer physical audit inspection.
   * @param {string} id - Booking order ID
   * @param {Object} auditDetails - { dateScheduled, status, inspectorName, notes }
   */
  async adminAddVerificationAudit(id, auditDetails) {
    try {
      const res = await axios.post(`${API_BASE}/admin/virtual-space/orders/${id}/verification`, auditDetails, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to add verification audit");
    }
  }

  /**
   * Soft deletes a Virtual Office booking order with a reason note.
   * @param {string} id - Booking order ID
   * @param {string} reason - The delete reason note
   */
  async adminDeleteOrder(id, reason) {
    try {
      const res = await axios.delete(`${API_BASE}/admin/virtual-space/orders/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        data: { reason },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to delete admin order");
    }
  }

  /**
   * Client-initiated soft deletes/cancels of their own Virtual Office booking.
   * @param {string} token - Clerk authorization token
   * @param {string} id - Booking order ID
   * @param {string} reason - The cancel reason note
   */
  async cancelUserOrder(token, id, reason) {
    try {
      const res = await axios.delete(`${API_BASE}/virtual-space/orders/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        data: { reason },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Failed to cancel user order");
    }
  }
}

export default new VirtualOfficeService();
