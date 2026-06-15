import { safeFetch } from "../../../shared/utils/api";

class VirtualOfficeService {
  // ─── Public Marketing Endpoints ──────────────────────────────────────────

  /**
   * Submits a general inquiry request.
   * @param {Object} payload - { name, email, mobile, purpose, city, message }
   */
  async createInquiry(payload) {
    return safeFetch("/virtual-space/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Submits partner onboarding application.
   * @param {Object} payload - { spaceName, ownerName, email, mobile, city, spaceType, deskCount }
   */
  async createPartnerApplication(payload) {
    return safeFetch("/virtual-space/partner-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Submits a quote lead estimation check.
   * @param {Object} payload - { city, purpose, businessType, name, email, mobile, estimatedPrice }
   */
  async createQuoteLead(payload) {
    return safeFetch("/virtual-space/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  // ─── Client Endpoints ──────────────────────────────────────────────────────

  /**
   * Fetches all virtual office orders for the logged-in client.
   * @param {string} token - Clerk authorization token
   */
  async getUserOrders(token) {
    return safeFetch("/virtual-space/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }

  /**
   * Fetches single virtual office order by ID for the logged-in client.
   * @param {string} token - Clerk authorization token
   * @param {string} id - Booking order ID
   */
  async getUserOrderById(token, id) {
    return safeFetch(`/virtual-space/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }

  /**
   * Creates a new virtual office lease booking order.
   * @param {string} token - Clerk authorization token
   * @param {Object} payload - { citySlug, addressName, selectedPlan, price }
   */
  async createVirtualOrder(token, payload) {
    return safeFetch("/virtual-space/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Uploads/updates client KYC files for a booking.
   * @param {string} token - Clerk authorization token
   * @param {string} id - Booking order ID
   * @param {Object} documents - { panCard, aadhaarCard, photo, companyName, incorporationCert }
   */
  async uploadUserDocuments(token, id, documents) {
    return safeFetch(`/virtual-space/orders/${id}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(documents),
    });
  }

  // ─── Admin Endpoints ───────────────────────────────────────────────────────

  /**
   * Fetches all Virtual Office orders for administrative view.
   */
  async adminGetOrders() {
    return safeFetch("/admin/virtual-space/orders", {
      credentials: "include",
    });
  }

  /**
   * Updates booking compliance status and attaches official documents.
   * @param {string} id - Booking order ID
   * @param {Object} payload - { complianceStatus, paymentStatus, nocFile, utilityBillFile, rentAgreementFile, consentLetterFile }
   */
  async adminUpdateOrder(id, payload) {
    return safeFetch(`/admin/virtual-space/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Logs an incoming mail delivery at a leased space.
   * @param {string} id - Booking order ID
   * @param {Object} mailItem - { sender, category, actionTaken, attachmentUrl, notes }
   */
  async adminAddMailLog(id, mailItem) {
    return safeFetch(`/admin/virtual-space/orders/${id}/mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(mailItem),
    });
  }

  /**
   * Schedules or updates a tax officer physical audit inspection.
   * @param {string} id - Booking order ID
   * @param {Object} auditDetails - { dateScheduled, status, inspectorName, notes }
   */
  async adminAddVerificationAudit(id, auditDetails) {
    return safeFetch(`/admin/virtual-space/orders/${id}/verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(auditDetails),
    });
  }
}

export default new VirtualOfficeService();
