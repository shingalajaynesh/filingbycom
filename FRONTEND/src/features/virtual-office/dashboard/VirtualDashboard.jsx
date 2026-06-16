import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useOrderContext } from "../../../shared/context/OrderContext.jsx";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";

export default function VirtualDashboard() {
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const { fetchVirtualOrders, uploadVirtualDocuments, cancelVirtualOrder } = useOrderContext();
  const { settings } = useSharedData();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, compliance, mailbox, audits, support
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // KYC upload form states
  const [uploading, setUploading] = useState(false);
  const [kycForm, setKycForm] = useState({
    panCard: "",
    aadhaarCard: "",
    photo: "",
    companyName: "",
    incorporationCert: "",
  });

  const [notification, setNotification] = useState({ type: "", message: "" });

  // Fetch bookings
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchVirtualOrders();
      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length > 0 && !selectedOrderId) {
          setSelectedOrderId(data.orders[0]._id);
        }
      } else {
        setError(data.message || "Failed to load virtual office bookings.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOrder = orders.find((o) => o._id === selectedOrderId) || orders[0];

  // Set form values when order changes
  useEffect(() => {
    if (selectedOrder) {
      setKycForm({
        panCard: selectedOrder.clientDocuments?.panCard || "",
        aadhaarCard: selectedOrder.clientDocuments?.aadhaarCard || "",
        photo: selectedOrder.clientDocuments?.photo || "",
        companyName: selectedOrder.clientDocuments?.companyName || "",
        incorporationCert: selectedOrder.clientDocuments?.incorporationCert || "",
      });
    }
  }, [selectedOrder]);

  // Handle KYC submit
  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setUploading(true);
      const data = await uploadVirtualDocuments(selectedOrder._id, kycForm);
      if (data.success) {
        setNotification({ type: "success", message: "KYC Documents updated successfully!" });
        // Refresh orders to fetch latest status
        fetchOrders();
      } else {
        setNotification({ type: "error", message: data.message || "Failed to update documents." });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Error uploading documents." });
    } finally {
      setUploading(false);
      setTimeout(() => setNotification({ type: "", message: "" }), 5000);
    }
  };

  // Helper to determine active step index in compliance stepper
  const getStepIndex = (status) => {
    const steps = ["Payment Received", "Documents Uploaded", "Rent Agreement Sent", "NOC Issued", "GST Approved"];
    return steps.indexOf(status);
  };

  // Pre-configured mock uploads helper
  const loadMockDocument = (field, mockUrl) => {
    setKycForm(prev => ({
      ...prev,
      [field]: mockUrl
    }));
  };

  const handleDownloadReceipt = () => {
    if (!selectedOrder) return;

    const invoiceNum = selectedOrder.invoiceNumber || `INV-VO-${selectedOrder._id.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const invoiceD = selectedOrder.invoiceDate ? new Date(selectedOrder.invoiceDate) : new Date(selectedOrder.createdAt || Date.now());
    const dateStr = invoiceD.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const clientName = clerkUser?.fullName || `${clerkUser?.firstName || "Client"} ${clerkUser?.lastName || ""}`.trim() || "Valued Client";
    const clientEmail = clerkUser?.primaryEmailAddress?.emailAddress || "N/A";
    const clientPhone = clerkUser?.primaryPhoneNumber?.phoneNumber || "N/A";

    const baseAmount = Math.round(selectedOrder.price / 1.18);
    const gstAmount = selectedOrder.price - baseAmount;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download/print the invoice.");
      return;
    }

    const planNames = {
      gst: "GST Registration / VPOB Plan",
      incorporation: "Company Incorporation Plan",
      mailing: "Business Address & Mailing Plan"
    };
    const planName = planNames[selectedOrder.selectedPlan] || "Virtual Office Leased Space";

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoiceNum}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 40px;
              line-height: 1.5;
            }
            .invoice-card {
              max-w: 800px;
              margin: 0 auto;
              background: #fff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-b: 2px solid #f1f5f9;
              padding-bottom: 30px;
              margin-bottom: 40px;
            }
            .logo-area h1 {
              font-size: 28px;
              font-weight: 800;
              color: #1e3a8a;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .logo-area span {
              color: #f59e0b;
            }
            .logo-area p {
              margin: 4px 0 0 0;
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
            }
            .invoice-details {
              text-align: right;
            }
            .invoice-details h2 {
              font-size: 24px;
              font-weight: 800;
              margin: 0;
              color: #0f172a;
            }
            .invoice-details p {
              margin: 5px 0 0 0;
              font-size: 13px;
              color: #64748b;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .info-block h3 {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              margin-bottom: 12px;
              font-weight: 700;
            }
            .info-block p {
              margin: 4px 0;
              font-size: 14px;
              color: #334155;
            }
            .info-block .name {
              font-weight: 700;
              color: #0f172a;
            }
            .table-container {
              margin-bottom: 40px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              text-align: left;
            }
            th {
              background: #f8fafc;
              padding: 14px 16px;
              font-size: 11px;
              text-transform: uppercase;
              font-weight: 700;
              color: #475569;
              border-bottom: 2px solid #e2e8f0;
            }
            td {
              padding: 16px;
              font-size: 14px;
              color: #334155;
              border-bottom: 1px solid #f1f5f9;
            }
            .totals {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            }
            .totals-table {
              width: 300px;
            }
            .totals-table td {
              padding: 8px 16px;
              font-size: 14px;
              border: none;
            }
            .totals-table .grand-total {
              font-weight: 800;
              font-size: 16px;
              color: #1e3a8a;
              border-top: 2px solid #f1f5f9;
              padding-top: 12px;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              margin-top: 10px;
            }
            .status-paid {
              background: #ecfdf5;
              color: #047857;
            }
            .status-unpaid {
              background: #fff7ed;
              color: #c2410c;
            }
            .footer {
              border-top: 2px solid #f1f5f9;
              padding-top: 30px;
              margin-top: 60px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div class="logo-area">
                <h1>Filing<span>By</span>.com</h1>
                <p>Tax & Corporate Compliance Solutions</p>
              </div>
              <div class="invoice-details">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> ${invoiceNum}</p>
                <p><strong>Date:</strong> ${dateStr}</p>
                <span class="status-badge ${selectedOrder.paymentStatus === 'Paid' ? 'status-paid' : 'status-unpaid'}">
                  ${selectedOrder.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid / Pending'}
                </span>
              </div>
            </div>

            <div class="grid-2">
              <div class="info-block">
                <h3>Billed By</h3>
                <p class="name">FilingBy Solutions Private Limited</p>
                <p>${settings?.vs_contact_address || "402-405 Compliance Center Hub, Adajan, Surat, Gujarat - 395009"}</p>
                <p>${settings?.vs_contact_email || "support@filingby.com"} | ${settings?.vs_contact_phone || "+91 75671 26945"}</p>
              </div>
              <div class="info-block">
                <h3>Billed To</h3>
                <p class="name">${clientName}</p>
                <p>Email: ${clientEmail}</p>
                <p>Phone: ${clientPhone}</p>
                <p>Registered Member</p>
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 600; color: #0f172a;">
                      ${planName}
                      <span style="display: block; font-size: 11px; font-weight: normal; color: #64748b; margin-top: 4px;">
                        Location: ${selectedOrder.addressName} (${selectedOrder.citySlug.toUpperCase()})
                      </span>
                    </td>
                    <td>1</td>
                    <td style="text-align: right;">₹${baseAmount.toLocaleString("en-IN")}</td>
                    <td style="text-align: right; font-weight: 600;">₹${baseAmount.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="totals">
              <table class="totals-table">
                <tr>
                  <td>Subtotal:</td>
                  <td style="text-align: right;">₹${baseAmount.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>GST (18%):</td>
                  <td style="text-align: right;">₹${gstAmount.toLocaleString("en-IN")}</td>
                </tr>
                <tr class="grand-total">
                  <td>Grand Total:</td>
                  <td style="text-align: right;">₹${selectedOrder.price.toLocaleString("en-IN")}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>Thank you for choosing FilingBy.com for your legal compliance needs.</p>
              <p style="margin-top: 5px; font-size: 10px; color: #cbd5e1;">This is a computer-generated invoice and requires no physical signature.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCancelBooking = async () => {
    if (!selectedOrder) return;
    const reason = prompt("Why do you want to cancel this booking? (e.g. Created by mistake)");
    if (reason === null) return; // User cancelled prompt
    if (!reason.trim()) {
      toast.error("A cancellation reason is required.");
      return;
    }

    try {
      setLoading(true);
      const data = await cancelVirtualOrder(selectedOrder._id, reason);
      if (data.success) {
        setNotification({ type: "success", message: "Booking cancelled successfully!" });
        // Fetch bookings again
        await fetchOrders();
      } else {
        setNotification({ type: "error", message: data.message || "Failed to cancel booking." });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Error cancelling booking." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification({ type: "", message: "" }), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#1A56DB] border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500 tracking-wider uppercase animate-pulse">Loading Workspace Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-[#1A56DB] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            🏢
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Active Workspaces Found</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
            You don't have any registered Virtual Office bookings under this account yet. Purchase a virtual address to unlock compliance tracking, official document downloads, mailbox delivery logs, and inspection management.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/get-live-quote")}
              className="bg-[#1A56DB] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95 cursor-pointer"
            >
              Get Instant Price Quote
            </button>
            <button
              onClick={() => navigate("/locations")}
              className="bg-slate-100 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              Browse Office Locations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stepper values
  const complianceSteps = [
    { label: "Payment Verification", desc: "Order details received" },
    { label: "KYC Review", desc: "Verify profile records" },
    { label: "Agreement Drafting", desc: "Stamping official lease" },
    { label: "Legal NOC Issuance", desc: "Consent letters signed" },
    { label: "Active Workspace", desc: "GST & Business verified" },
  ];

  const currentStepIdx = getStepIndex(selectedOrder.complianceStatus);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800">
      {/* Dashboard Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1f3b] via-[#15315e] to-[#0a1628] text-white py-12 px-4 md:px-8 border-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-blue-500/20 text-blue-300 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-blue-400/20">
              Workspace Compliance Desk
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-3">
              Hello, {clerkUser?.firstName || "Member"}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Manage legal compliance checklists, view scan couriers, schedule tax agent audits, and download official PDF agreements.
            </p>
          </div>

          {/* Selector for Multiple Rented Spaces */}
          {orders.length > 1 && (
            <div className="flex flex-col gap-1.5 min-w-[240px]">
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Switch Office Address
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="bg-[#122849]/60 text-white font-semibold text-xs border border-slate-700/50 rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:bg-[#122849] transition-all"
              >
                {orders.map((o) => (
                  <option key={o._id} value={o._id} className="bg-[#0f2340]">
                    {o.addressName} ({o.citySlug.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Side Menu Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/60 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "compliance", label: "Compliance & KYC", icon: "🛡️" },
                { id: "mailbox", label: "Mailbox Scans", icon: "✉️" },
                { id: "audits", label: "Tax Inspections", icon: "🔍" },
                { id: "support", label: "WhatsApp Support", icon: "💬" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer w-full text-left ${activeTab === tab.id
                      ? "bg-[#1A56DB]/5 text-[#1A56DB]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl p-5 border border-blue-100/40 hidden lg:block">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Address</span>
              <h4 className="font-extrabold text-slate-800 text-sm mt-1.5 leading-tight">{selectedOrder.addressName}</h4>
              <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">
                City: {selectedOrder.citySlug.charAt(0).toUpperCase() + selectedOrder.citySlug.slice(1)} | Plan: {selectedOrder.selectedPlan.toUpperCase()}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-blue-100/60 pt-3 text-[11px] font-bold text-slate-600">
                <span>Compliance:</span>
                <span className="text-[#1A56DB]">{selectedOrder.complianceStatus}</span>
              </div>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-3 space-y-6">

            {/* Global notification banner */}
            {notification.message && (
              <div
                className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${notification.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}
              >
                <span>{notification.type === "success" ? "✅" : "❌"}</span>
                {notification.message}
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">

                {/* Visual Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  {/* Card 1: Mail Scans count */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mailbox Deliveries</span>
                      <p className="text-3xl font-black text-slate-900 mt-1">{selectedOrder.mailLogs?.length || 0}</p>
                      <button onClick={() => setActiveTab("mailbox")} className="text-[10px] font-bold text-[#1A56DB] hover:underline mt-2 inline-block">
                        View scan files →
                      </button>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-[#1A56DB] rounded-xl flex items-center justify-center text-xl">✉️</div>
                  </div>

                  {/* Card 2: Next Inspection */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tax Inspections</span>
                      <p className="text-lg font-extrabold text-slate-900 mt-2">
                        {selectedOrder.inspections?.length > 0
                          ? `${new Date(selectedOrder.inspections[selectedOrder.inspections.length - 1].dateScheduled).toLocaleDateString("en-IN")}`
                          : "None Scheduled"}
                      </p>
                      <button onClick={() => setActiveTab("audits")} className="text-[10px] font-bold text-[#1A56DB] hover:underline mt-2.5 inline-block">
                        Check checklist guidelines →
                      </button>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">🔍</div>
                  </div>

                  {/* Card 3: Payments */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payment Status</span>
                      <p className="text-xl font-black text-[#047857] mt-2">
                        {selectedOrder.paymentStatus === "Paid" ? "💰 Verified" : "⚠️ Pending"}
                      </p>
                      {selectedOrder.paymentStatus === "Paid" && (
                        <button
                          onClick={handleDownloadReceipt}
                          className="text-[10px] font-bold text-[#1A56DB] hover:underline mt-2 inline-block cursor-pointer bg-transparent border-0 p-0 text-left outline-none"
                        >
                          Download Receipt →
                        </button>
                      )}
                      {selectedOrder.paymentStatus !== "Paid" && (
                        <span className="text-[9px] font-semibold text-slate-400 block mt-2">
                          ID: {selectedOrder.paymentId || "Direct Booking"}
                        </span>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">💸</div>
                  </div>
                </div>

                {/* Compliance Stepper Header */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">Address Compliance Progress</h3>
                    <span className="text-[10px] font-bold text-white bg-[#1A56DB] px-3 py-1 rounded-full">
                      {selectedOrder.complianceStatus}
                    </span>
                  </div>

                  {/* The Horizontal Stepper */}
                  <div className="relative pt-4">
                    <div className="absolute top-8 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden md:block" />
                    <div
                      className="absolute top-8 left-0 h-1 bg-[#1A56DB] -translate-y-1/2 z-0 transition-all duration-500 hidden md:block"
                      style={{ width: `${(currentStepIdx / (complianceSteps.length - 1)) * 100}%` }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                      {complianceSteps.map((step, idx) => {
                        const isDone = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const isPending = idx > currentStepIdx;

                        return (
                          <div key={idx} className="flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-0">
                            {/* Dot indicator */}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 md:mb-3 flex-shrink-0 ${isDone
                                  ? "bg-[#1A56DB] text-white shadow-md shadow-blue-100"
                                  : isCurrent
                                    ? "bg-[#1A56DB] text-white ring-4 ring-blue-100"
                                    : "bg-white text-slate-400 border-2 border-slate-200"
                                }`}
                            >
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isPending ? "text-slate-400" : "text-slate-800"}`}>
                                {step.label}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 rounded-3xl border border-blue-100/40 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">Need to Rent Another Location?</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Scale your GST registrations across Surat or Mumbai instantly.</p>
                  </div>
                  <button
                    onClick={() => navigate("/get-live-quote")}
                    className="bg-[#1A56DB] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    Add Address +
                  </button>
                </div>

                {/* Cancellation row */}
                {(selectedOrder.complianceStatus === "Payment Received" || selectedOrder.complianceStatus === "Documents Uploaded") && (
                  <div className="bg-rose-50/35 p-6 rounded-3xl border border-rose-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-rose-955 text-sm leading-tight">Cancel this Booking?</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">If you made this workspace booking by mistake, you can cancel it here.</p>
                    </div>
                    <button
                      onClick={handleCancelBooking}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* COMPLIANCE & KYC TAB */}
            {activeTab === "compliance" && (
              <div className="space-y-6">

                {/* 1. Official Files Issuance Downloads */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Official Compliance Documents</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Download official government permission certificates and lease logs uploaded by our legal team.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "No Objection Certificate (NOC)",
                        field: "nocFile",
                        desc: "Authorized letter of consent from landlord",
                        fileUrl: selectedOrder.complianceDocuments?.nocFile,
                      },
                      {
                        name: "Utility/Electricity Bill",
                        field: "utilityBillFile",
                        desc: "Latest utility log showing proof of address",
                        fileUrl: selectedOrder.complianceDocuments?.utilityBillFile,
                      },
                      {
                        name: "Stamped Rent Agreement",
                        field: "rentAgreementFile",
                        desc: "Registered rental lease contract PDF",
                        fileUrl: selectedOrder.complianceDocuments?.rentAgreementFile,
                      },
                      {
                        name: "Consent Letter",
                        field: "consentLetterFile",
                        desc: "Signed verification authority dispatch letter",
                        fileUrl: selectedOrder.complianceDocuments?.consentLetterFile,
                      },
                    ].map((doc, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{doc.desc}</p>
                        </div>
                        {doc.fileUrl ? (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer"
                          >
                            ⬇️ Download
                          </a>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                            ⏳ Processing
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. KYC Documents Upload Form */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Upload KYC Verification Records</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Submit your corporate legal files to verify compliance.</p>
                  </div>

                  <form onSubmit={handleKycSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Company Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Registered Company Name</label>
                        <input
                          type="text"
                          value={kycForm.companyName}
                          onChange={(e) => setKycForm({ ...kycForm, companyName: e.target.value })}
                          placeholder="e.g. Acme Corporation Pvt Ltd"
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-all"
                        />
                      </div>

                      {/* PAN Card URL */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                          <span>PAN Card Document URL</span>
                          <button type="button" onClick={() => loadMockDocument("panCard", "https://filingby.com/mock/pan_card.pdf")} className="text-[9px] text-blue-500 lowercase underline hover:text-blue-700">Seed sample</button>
                        </label>
                        <input
                          type="text"
                          value={kycForm.panCard}
                          onChange={(e) => setKycForm({ ...kycForm, panCard: e.target.value })}
                          placeholder="Paste document link or file URL"
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-all"
                        />
                      </div>

                      {/* Aadhaar Card URL */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                          <span>Aadhaar Card Document URL</span>
                          <button type="button" onClick={() => loadMockDocument("aadhaarCard", "https://filingby.com/mock/aadhaar_card.pdf")} className="text-[9px] text-blue-500 lowercase underline hover:text-blue-700">Seed sample</button>
                        </label>
                        <input
                          type="text"
                          value={kycForm.aadhaarCard}
                          onChange={(e) => setKycForm({ ...kycForm, aadhaarCard: e.target.value })}
                          placeholder="Paste document link or file URL"
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-all"
                        />
                      </div>

                      {/* Photo URL */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                          <span>Passport Photo URL</span>
                          <button type="button" onClick={() => loadMockDocument("photo", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300")} className="text-[9px] text-blue-500 lowercase underline hover:text-blue-700">Seed sample</button>
                        </label>
                        <input
                          type="text"
                          value={kycForm.photo}
                          onChange={(e) => setKycForm({ ...kycForm, photo: e.target.value })}
                          placeholder="Paste picture link or file URL"
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-all"
                        />
                      </div>

                      {/* Incorporation Cert URL */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                          <span>Certificate of Incorporation (COI) URL</span>
                          <button type="button" onClick={() => loadMockDocument("incorporationCert", "https://filingby.com/mock/coi_cert.pdf")} className="text-[9px] text-blue-500 lowercase underline hover:text-blue-700">Seed sample</button>
                        </label>
                        <input
                          type="text"
                          value={kycForm.incorporationCert}
                          onChange={(e) => setKycForm({ ...kycForm, incorporationCert: e.target.value })}
                          placeholder="Required for incorporation plan - paste certificate file URL"
                          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#1A56DB] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-[#1A56DB] hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer w-full"
                    >
                      {uploading ? "Updating Profile..." : "Submit KYC Documents"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* MAILBOX LOG TAB */}
            {activeTab === "mailbox" && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-900">Courier Mailbox Delivery Scans</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Official couriers received at your virtual office address. We scan all legal items instantly and email you a digital file.
                  </p>
                </div>

                {!selectedOrder.mailLogs || selectedOrder.mailLogs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-3xl mb-2">📬</p>
                    <p className="text-xs font-bold text-slate-700">Mailbox Empty</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Any government letters or commercial couriers delivered to this desk will be registered and displayed here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          <th className="py-3 px-4">Date Received</th>
                          <th className="py-3 px-4">Sender</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Action Taken</th>
                          <th className="py-3 px-4 text-right">Attachment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.mailLogs.map((mail, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-xs">
                            <td className="py-4 px-4 font-semibold text-slate-600">
                              {new Date(mail.dateReceived).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-800">{mail.sender}</td>
                            <td className="py-4 px-4">
                              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md">
                                {mail.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-500">{mail.actionTaken}</td>
                            <td className="py-4 px-4 text-right">
                              {mail.attachmentUrl ? (
                                <a
                                  href={mail.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1A56DB] hover:underline font-bold text-[11px]"
                                >
                                  📄 View Scan File
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[10px] font-medium italic">No scan</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VERIFICATION AUDITS TAB */}
            {activeTab === "audits" && (
              <div className="space-y-6">

                {/* Audit Checklist Guide */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 space-y-4">
                  <h3 className="text-base font-black text-slate-900">GST Verification Audit Checklist</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    When a GST officer makes a physical verification visit to your virtual office location, we ensure standard compliance. Please review the checklist required for approval:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {[
                      { t: "Company Name Board Placement", d: "A physical name board containing your company legal title and GSTIN is mounted at the entrance." },
                      { t: "KYC Documents File Drawer", d: "A dedicated physical files cabinet keeping copies of your COI, NOC, PAN, and director IDs ready." },
                      { t: "Authorized Representative", d: "Our local center receptionist represents you and answers standard queries." },
                      { t: "Physical Desk Allocation", d: "A physical table/seat marked for your company records verification." },
                    ].map((c, i) => (
                      <div key={i} className="p-4 bg-slate-50/60 rounded-2xl flex items-start gap-3">
                        <span className="text-emerald-600 text-sm mt-0.5">✅</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.t}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{c.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit logs history */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Audit History & Schedules</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Timeline of physical inspect visits by tax department GST agents.</p>
                  </div>

                  {!selectedOrder.inspections || selectedOrder.inspections.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-3xl mb-2">🔍</p>
                      <p className="text-xs font-bold text-slate-700">No Audits Logged Yet</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Once the GST department schedules a physical verification visit, details will be registered here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedOrder.inspections.map((insp, idx) => (
                        <div key={idx} className="p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-slate-800">
                                {new Date(insp.dateScheduled).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span
                                className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${insp.status === "Success"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : insp.status === "Scheduled"
                                      ? "bg-blue-50 text-blue-700"
                                      : insp.status === "Action Required"
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-rose-50 text-rose-700"
                                  }`}
                              >
                                {insp.status}
                              </span>
                            </div>
                            {insp.inspectorName && (
                              <p className="text-[11px] font-bold text-slate-500">
                                Inspector: <span className="text-slate-800">{insp.inspectorName}</span>
                              </p>
                            )}
                            {insp.notes && <p className="text-[10px] text-slate-400 italic">Notes: {insp.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === "support" && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/80 text-center max-w-lg mx-auto space-y-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  💬
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Legal Compliance Support Desk</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Connect directly with our dedicated compliance receptionist for any questions related to mail forwarding, name boards, local GST audit checklists, or billing inquiries.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 p-4 rounded-2xl border border-emerald-100/40 text-left">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Office Representative Details</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">Mrs. Sharma (Surat / Mumbai Center Hub)</p>
                  <p className="text-[10px] text-slate-400">Response time: Usually within 15 minutes during business hours</p>
                </div>

                <button
                  onClick={() => {
                    const waBase = settings?.vs_whatsapp_url || "https://wa.me/917567126945";
                    const separator = waBase.includes("?") ? "&" : "?";
                    window.open(`${waBase}${separator}text=Hello,%20I%20have%20an%20active%20virtual%20office%20order%20ID%20${selectedOrder._id}.%20Need%20assistance.`, "_blank");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-8 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-green-100 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  Start WhatsApp Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
