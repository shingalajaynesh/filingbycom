import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

export default function AdminVirtualBookings() {
  const { adminGetVirtualOrders, adminUpdateVirtualOrder, adminDeleteVirtualOrder, adminAddMailLog, adminAddVerificationAudit } = useAdminContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog/Form selections
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Status and Document update states
  const [updating, setUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({
    complianceStatus: "",
    paymentStatus: "",
    nocFile: "",
    utilityBillFile: "",
    rentAgreementFile: "",
    consentLetterFile: "",
  });

  // Mail Log form states
  const [mailForm, setMailForm] = useState({
    sender: "",
    category: "GST Department",
    actionTaken: "Scanned & Emailed",
    attachmentUrl: "",
    notes: "",
  });

  // Audit Inspection form states
  const [auditForm, setAuditForm] = useState({
    dateScheduled: "",
    status: "Scheduled",
    inspectorName: "",
    notes: "",
  });

  const [notif, setNotif] = useState({ type: "", message: "" });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminGetVirtualOrders();
      if (data.success) {
        setBookings(data.orders);
        if (data.orders.length > 0 && !selectedBookingId) {
          setSelectedBookingId(data.orders[0]._id);
        }
      } else {
        setError(data.message || "Failed to retrieve virtual office bookings.");
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Failed to fetch bookings", { silent: true });
      setError(msg || "Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }, [adminGetVirtualOrders, selectedBookingId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const name = `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}`.toLowerCase();
    const email = (booking.user?.email || "").toLowerCase();
    const phone = (booking.user?.phone || "").toLowerCase();
    const city = (booking.citySlug || "").toLowerCase();
    const address = (booking.addressName || "").toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower) || city.includes(searchLower) || address.includes(searchLower);
  });

  const selectedBooking = bookings.find((b) => b._id === selectedBookingId) || filteredBookings[0] || bookings[0];

  // Sync status form fields when selected booking changes
  useEffect(() => {
    if (selectedBooking) {
      setStatusForm({
        complianceStatus: selectedBooking.complianceStatus || "Payment Received",
        paymentStatus: selectedBooking.paymentStatus || "Paid",
        nocFile: selectedBooking.complianceDocuments?.nocFile || "",
        utilityBillFile: selectedBooking.complianceDocuments?.utilityBillFile || "",
        rentAgreementFile: selectedBooking.complianceDocuments?.rentAgreementFile || "",
        consentLetterFile: selectedBooking.complianceDocuments?.consentLetterFile || "",
      });
    }
  }, [selectedBooking]);

  // Update compliance status / documents
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      setUpdating(true);
      const data = await adminUpdateVirtualOrder(selectedBooking._id, statusForm);
      if (data.success) {
        setNotif({ type: "success", message: "Booking compliance parameters updated!" });
        fetchBookings();
      } else {
        setNotif({ type: "error", message: data.message || "Failed to update booking." });
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Error updating booking status", { silent: true });
      setNotif({ type: "error", message: msg || "Error updating booking." });
    } finally {
      setUpdating(false);
      setTimeout(() => setNotif({ type: "", message: "" }), 5000);
    }
  };

  // Add courier log
  const handleMailSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!mailForm.sender) {
      toast.error("Please provide the courier sender's name.");
      return;
    }
    try {
      setUpdating(true);
      const data = await adminAddMailLog(selectedBooking._id, mailForm);
      if (data.success) {
        setNotif({ type: "success", message: "Incoming mail scan successfully logged!" });
        setMailForm({
          sender: "",
          category: "GST Department",
          actionTaken: "Scanned & Emailed",
          attachmentUrl: "",
          notes: "",
        });
        fetchBookings();
      } else {
        setNotif({ type: "error", message: data.message || "Failed to log mail." });
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Error adding mail scan log", { silent: true });
      setNotif({ type: "error", message: msg || "Error adding mail scan log." });
    } finally {
      setUpdating(false);
      setTimeout(() => setNotif({ type: "", message: "" }), 5000);
    }
  };

  // Schedule inspector audit
  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!auditForm.dateScheduled) {
      toast.error("Please specify the scheduled date for the audit.");
      return;
    }
    try {
      setUpdating(true);
      const data = await adminAddVerificationAudit(selectedBooking._id, auditForm);
      if (data.success) {
        setNotif({ type: "success", message: "Tax verification audit scheduled!" });
        setAuditForm({
          dateScheduled: "",
          status: "Scheduled",
          inspectorName: "",
          notes: "",
        });
        fetchBookings();
      } else {
        setNotif({ type: "error", message: data.message || "Failed to schedule audit." });
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Error scheduling verification audit", { silent: true });
      setNotif({ type: "error", message: msg || "Error scheduling audit." });
    } finally {
      setUpdating(false);
      setTimeout(() => setNotif({ type: "", message: "" }), 5000);
    }
  };

  // Quick seed URLs helper
  const seedAdminFile = (field, seedUrl) => {
    setStatusForm(prev => ({
      ...prev,
      [field]: seedUrl
    }));
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    const reason = prompt("Why are you soft deleting this virtual office booking? Please specify a reason note:");
    if (reason === null) return; // user cancelled
    if (!reason.trim()) {
      toast.error("Deletion reason note is required.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this virtual office booking? It will be hidden from all dashboards.")) {
      try {
        setUpdating(true);
        const data = await adminDeleteVirtualOrder(selectedBooking._id, reason);
        if (data.success) {
          setNotif({ type: "success", message: "Virtual booking deleted successfully." });
          setSelectedBookingId("");
          fetchBookings();
        } else {
          setNotif({ type: "error", message: data.message || "Failed to delete booking." });
        }
      } catch (err) {
        const msg = handleFrontendError(err, "Error soft-deleting virtual space booking", { silent: true });
        setNotif({ type: "error", message: msg || "Error deleting booking." });
      } finally {
        setUpdating(false);
        setTimeout(() => setNotif({ type: "", message: "" }), 5000);
      }
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading virtual bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-3xl border border-slate-100/80 shadow-sm max-w-xl mx-auto">
        <p className="text-red-655 font-bold">Failed to load virtual space bookings</p>
        <p className="text-xs text-gray-400">{error}</p>
        <button onClick={fetchBookings} className="bg-[#1A56DB] text-white text-xs font-bold px-4 py-2 rounded-xl mt-2">
          Retry Sync
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100/85 p-8 max-w-lg mx-auto shadow-sm">
        <p className="text-5xl mb-4">📭</p>
        <h3 className="text-lg font-bold text-gray-900">No Virtual Bookings Available</h3>
        <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
          There are no customers currently leasing active Virtual Office addresses in Mumbai or Surat. As soon as a client checks out, their booking record will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Notifications */}
      {notif.message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            notif.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          <span>{notif.type === "success" ? "✅" : "⚠️"}</span>
          {notif.message}
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Bookings list selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100/60 flex flex-col max-h-[70vh]">
            <div className="flex flex-col gap-3 mb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                Bookings ({filteredBookings.length})
              </h3>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-1.5 overflow-y-auto pr-1">
              {filteredBookings.length === 0 && searchTerm ? (
                <div className="text-center py-8 text-gray-500 text-xs font-medium">
                  No bookings found matching "{searchTerm}"
                </div>
              ) : (
                filteredBookings.map((booking) => {
                const isActive = booking._id === selectedBookingId;
                return (
                  <button
                    key={booking._id}
                    onClick={() => setSelectedBookingId(booking._id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border-0 flex flex-col gap-1 cursor-pointer ${
                      isActive
                        ? "bg-blue-50/70 border-l-4 border-l-[#1A56DB]"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 leading-none">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </span>
                      <span className="text-[9px] font-bold bg-[#1A56DB]/10 text-[#1A56DB] px-2 py-0.5 rounded-full capitalize">
                        {booking.citySlug}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 line-clamp-1">{booking.addressName}</span>
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mt-2 border-t border-slate-100/80 pt-2">
                      <span>{booking.selectedPlan.toUpperCase()} Plan</span>
                      <span className="text-amber-600">{booking.complianceStatus}</span>
                    </div>
                  </button>
                );
              }))}
            </div>
          </div>
        </div>

        {/* Right columns: Active selected booking controls panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBooking && (
            <div className="space-y-6">
              
              {/* Selected Booking Header details */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Leased Space Detail</span>
                    <h2 className="text-lg font-black text-slate-900 mt-1">{selectedBooking.addressName}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Client ID: {selectedBooking.user?._id} | Email: {selectedBooking.user?.email} | Phone: {selectedBooking.user?.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
                    <div className="bg-[#1A56DB] text-white px-3.5 py-1.5 rounded-full text-xs font-bold select-none text-center">
                      {selectedBooking.complianceStatus}
                    </div>
                    <button
                      onClick={handleDeleteBooking}
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-red-200 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="Soft delete booking"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Booking
                    </button>
                  </div>
                </div>

                {/* 1. Client Uploaded KYC Files verification */}
                <div className="pt-6 space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Client KYC Files Submissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {[
                      { label: "Company Legal Name", val: selectedBooking.clientDocuments?.companyName || "Awaiting submission" },
                      { label: "PAN Card PDF File", val: selectedBooking.clientDocuments?.panCard, isUrl: true },
                      { label: "Aadhaar Card PDF File", val: selectedBooking.clientDocuments?.aadhaarCard, isUrl: true },
                      { label: "Passport Photo File", val: selectedBooking.clientDocuments?.photo, isUrl: true },
                      { label: "Incorporation Certificate File", val: selectedBooking.clientDocuments?.incorporationCert, isUrl: true },
                    ].map((item, index) => (
                      <div key={index} className="p-3 bg-slate-50/50 rounded-xl flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{item.label}</p>
                          <p className="font-semibold text-slate-800 mt-1 truncate">
                            {item.isUrl && item.val ? "document_submitted.pdf" : item.val}
                          </p>
                        </div>
                        {item.isUrl && item.val ? (
                          <a
                            href={item.val}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer"
                          >
                            👁️ View File
                          </a>
                        ) : (
                          item.isUrl && (
                            <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">
                              pending
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Update status and Legal PDFs upload form */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Update Compliance & Attach PDFs</h3>
                
                <form onSubmit={handleStatusSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Compliance Status selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Compliance Stepper Status</label>
                      <select
                        value={statusForm.complianceStatus}
                        onChange={(e) => setStatusForm({ ...statusForm, complianceStatus: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      >
                        <option value="Payment Received">Payment Received</option>
                        <option value="Documents Uploaded">Documents Uploaded</option>
                        <option value="Rent Agreement Sent">Rent Agreement Sent</option>
                        <option value="NOC Issued">NOC Issued</option>
                        <option value="GST Approved">GST Approved</option>
                      </select>
                    </div>

                    {/* Payment Status selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Verification Status</label>
                      <select
                        value={statusForm.paymentStatus}
                        onChange={(e) => setStatusForm({ ...statusForm, paymentStatus: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>

                    {/* NOC PDF upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                        <span>No Objection Certificate (NOC) URL</span>
                        <button type="button" onClick={() => seedAdminFile("nocFile", "https://filingby.com/legal/noc_signed_adajan.pdf")} className="text-[9px] text-[#1A56DB] underline">Seed Sample NOC</button>
                      </label>
                      <input
                        type="text"
                        value={statusForm.nocFile}
                        onChange={(e) => setStatusForm({ ...statusForm, nocFile: e.target.value })}
                        placeholder="Paste URL of Admin signed NOC PDF file"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Utility bill PDF upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                        <span>Utility / Electricity Bill URL</span>
                        <button type="button" onClick={() => seedAdminFile("utilityBillFile", "https://filingby.com/legal/utility_bill_electricity.pdf")} className="text-[9px] text-[#1A56DB] underline">Seed Sample Bill</button>
                      </label>
                      <input
                        type="text"
                        value={statusForm.utilityBillFile}
                        onChange={(e) => setStatusForm({ ...statusForm, utilityBillFile: e.target.value })}
                        placeholder="Paste URL of electricity bill PDF file"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Rent Agreement PDF upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                        <span>Rent Agreement Lease URL</span>
                        <button type="button" onClick={() => seedAdminFile("rentAgreementFile", "https://filingby.com/legal/lease_agreement_signed.pdf")} className="text-[9px] text-[#1A56DB] underline">Seed Lease PDF</button>
                      </label>
                      <input
                        type="text"
                        value={statusForm.rentAgreementFile}
                        onChange={(e) => setStatusForm({ ...statusForm, rentAgreementFile: e.target.value })}
                        placeholder="Paste URL of stamped Lease Agreement PDF"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Consent Letter PDF upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                        <span>Consent Letter URL</span>
                        <button type="button" onClick={() => seedAdminFile("consentLetterFile", "https://filingby.com/legal/consent_letter.pdf")} className="text-[9px] text-[#1A56DB] underline">Seed Consent PDF</button>
                      </label>
                      <input
                        type="text"
                        value={statusForm.consentLetterFile}
                        onChange={(e) => setStatusForm({ ...statusForm, consentLetterFile: e.target.value })}
                        placeholder="Paste URL of Consent Letter PDF file"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-[#1A56DB] text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-200 cursor-pointer"
                  >
                    {updating ? "Saving Changes..." : "Save Compliance Details"}
                  </button>
                </form>
              </div>

              {/* 3. Log incoming couriers mailbox scan form */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Log Incoming Courier Delivery</h3>
                
                <form onSubmit={handleMailSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Sender */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Sender / Courier Agent</label>
                      <input
                        type="text"
                        value={mailForm.sender}
                        onChange={(e) => setMailForm({ ...mailForm, sender: e.target.value })}
                        placeholder="e.g. GST Ward 4 Inspector, BlueDart"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Courier Category</label>
                      <select
                        value={mailForm.category}
                        onChange={(e) => setMailForm({ ...mailForm, category: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      >
                        <option value="GST Department">GST Department</option>
                        <option value="Income Tax">Income Tax</option>
                        <option value="Bank Courier">Bank Courier</option>
                        <option value="General Courier">General Courier</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Action Taken */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Action Dispatch Status</label>
                      <select
                        value={mailForm.actionTaken}
                        onChange={(e) => setMailForm({ ...mailForm, actionTaken: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      >
                        <option value="Scanned & Emailed">Scanned & Emailed</option>
                        <option value="Forwarded">Forwarded</option>
                        <option value="Stored for Pickup">Stored for Pickup</option>
                      </select>
                    </div>

                    {/* Scan Attachment URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Scan File PDF/Image URL</label>
                      <input
                        type="text"
                        value={mailForm.attachmentUrl}
                        onChange={(e) => setMailForm({ ...mailForm, attachmentUrl: e.target.value })}
                        placeholder="Paste scan file attachment link (if any)"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Courier Contents Summary</label>
                      <input
                        type="text"
                        value={mailForm.notes}
                        onChange={(e) => setMailForm({ ...mailForm, notes: e.target.value })}
                        placeholder="e.g. GST registration show-cause letter, bank checkbook delivery"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-[#1A56DB] text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-200 cursor-pointer"
                  >
                    {updating ? "Logging courier..." : "Log Courier Scan"}
                  </button>
                </form>
              </div>

              {/* 4. Schedule inspector physical audit visits form */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Schedule GST Officer Audit Visit</h3>
                
                <form onSubmit={handleAuditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Date Scheduled */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Date</label>
                      <input
                        type="date"
                        value={auditForm.dateScheduled}
                        onChange={(e) => setAuditForm({ ...auditForm, dateScheduled: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Inspector Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tax Inspector Name</label>
                      <input
                        type="text"
                        value={auditForm.inspectorName}
                        onChange={(e) => setAuditForm({ ...auditForm, inspectorName: e.target.value })}
                        placeholder="e.g. Officer D.K. Pathak"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    {/* Status selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Visit Result Status</label>
                      <select
                        value={auditForm.status}
                        onChange={(e) => setAuditForm({ ...auditForm, status: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Success">Success</option>
                        <option value="Action Required">Action Required</option>
                        <option value="Missed">Missed</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Audit Result Notes</label>
                      <input
                        type="text"
                        value={auditForm.notes}
                        onChange={(e) => setAuditForm({ ...auditForm, notes: e.target.value })}
                        placeholder="e.g. All documents verified, waiting for GSTIN approval"
                        className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-[#1A56DB] text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-200 cursor-pointer"
                  >
                    {updating ? "Registering schedule..." : "Schedule Verification Audit"}
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
