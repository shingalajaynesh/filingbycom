import { useState, useEffect, useCallback } from "react";
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
  const [activeTab, setActiveTab] = useState("overview"); // overview, bookings, documents, mailbox, support, profile
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);

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

  const fetchOrders = useCallback(async () => {
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
  }, [fetchVirtualOrders, selectedOrderId]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOrder = orders.find((o) => o._id === selectedOrderId) || orders[0];

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

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setUploading(true);
      const data = await uploadVirtualDocuments(selectedOrder._id, kycForm);
      if (data.success) {
        toast.success("KYC Documents updated successfully!");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to update documents.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading documents.");
    } finally {
      setUploading(false);
    }
  };

  const getStepIndex = (status) => {
    const steps = ["Payment Received", "Documents Uploaded", "Rent Agreement Sent", "NOC Issued", "GST Approved"];
    return steps.indexOf(status);
  };

  const handleDownloadReceipt = (order) => {
    if (!order) return;

    const invoiceNum = order.invoiceNumber || `INV-VO-${order._id.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const invoiceD = order.invoiceDate ? new Date(order.invoiceDate) : new Date(order.createdAt || Date.now());
    const dateStr = invoiceD.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const clientName = clerkUser?.fullName || `${clerkUser?.firstName || "Client"} ${clerkUser?.lastName || ""}`.trim() || "Valued Client";
    const clientEmail = clerkUser?.primaryEmailAddress?.emailAddress || "N/A";
    const clientPhone = clerkUser?.primaryPhoneNumber?.phoneNumber || "N/A";

    const baseAmount = Math.round(order.price / 1.18);
    const gstAmount = order.price - baseAmount;

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
    const planName = planNames[order.selectedPlan] || "Virtual Office Leased Space";

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
              align-items: center;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo-section img {
              height: 96px;
              width: auto;
              display: block;
            }
            .invoice-title {
              text-align: right;
            }
            .invoice-title h1 {
              margin: 0;
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
            }
            .invoice-title p {
              margin: 4px 0 0 0;
              font-size: 13px;
              color: #64748b;
              font-weight: 500;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 30px;
              margin-bottom: 40px;
            }
            .detail-block h3 {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              margin: 0 0 8px 0;
              font-weight: 700;
            }
            .detail-block p {
              margin: 3px 0;
              font-size: 13px;
              font-weight: 500;
              color: #334155;
            }
            .detail-block .name {
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 6px;
            }
            .table-container {
              margin-bottom: 40px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th {
              background: #f8fafc;
              border-bottom: 2px solid #e2e8f0;
              text-align: left;
              padding: 12px 16px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #475569;
              font-weight: 700;
            }
            td {
              padding: 16px;
              font-size: 13px;
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
            }
            td.amount-col, th.amount-col {
              text-align: right;
            }
            .summary-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }
            .summary-table {
              width: 300px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 13px;
              color: #475569;
              font-weight: 500;
            }
            .summary-row.total {
              border-top: 2px solid #e2e8f0;
              padding-top: 12px;
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
            }
            .footer {
              border-top: 1px dashed #e2e8f0;
              padding-top: 20px;
              text-align: center;
              font-size: 11px;
              color: #64748b;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div class="logo-section">
                <img src="${window.location.origin}/logo.png" alt="Logo" />
              </div>
              <div class="invoice-title">
                <h1>TAX INVOICE</h1>
                <p>No: ${invoiceNum}</p>
              </div>
            </div>
            
            <div class="details-grid">
              <div class="detail-block">
                <h3>Billed By:</h3>
                <p class="name">FilingBy Solutions Private Limited</p>
                <p>${settings?.vs_contact_address || "402-405 Compliance Center Hub, Adajan, Surat, Gujarat - 395009"}</p>
                <p>Email: ${settings?.vs_contact_email || "support@filingby.com"}</p>
                <p>Phone: ${settings?.vs_contact_phone || "+91 75671 26945"}</p>
              </div>
              <div class="detail-block">
                <h3>Billed To:</h3>
                <p class="name">${clientName}</p>
                <p>Email: ${clientEmail}</p>
                <p>Phone: ${clientPhone}</p>
              </div>
              <div class="detail-block" style="text-align: right;">
                <h3>Invoice Details:</h3>
                <p>Date: ${dateStr}</p>
                <p>Payment Mode: Online (Razorpay)</p>
                <p>Payment ID: ${order.paymentId}</p>
              </div>
            </div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="amount-col">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>${planName}</strong><br/>
                      <span style="font-size: 11px; color: #64748b;">Rented Space: ${order.addressName} (${order.citySlug.toUpperCase()})</span>
                    </td>
                    <td class="amount-col">₹${baseAmount.toLocaleString("en-IN")}.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="summary-section">
              <div class="summary-table">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>₹${baseAmount.toLocaleString("en-IN")}.00</span>
                </div>
                <div class="summary-row">
                  <span>GST (18%):</span>
                  <span>₹${gstAmount.toLocaleString("en-IN")}.00</span>
                </div>
                <div class="summary-row total">
                  <span>Grand Total:</span>
                  <span>₹${order.price.toLocaleString("en-IN")}.00</span>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>This is a computer generated document and does not require a physical signature.</p>
              <p>Thank you for choosing FilingBy for your legal compliance needs.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCancelBooking = async (order) => {
    if (!order) return;
    const reason = window.prompt("Please tell us the reason for cancellation (required):");
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error("Cancellation reason is required.");
      return;
    }

    try {
      setLoading(true);
      const data = await cancelVirtualOrder(order._id, reason);
      if (data.success) {
        toast.success("Booking successfully cancelled.");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling booking.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase animate-pulse">Loading Workspace Dashboard...</span>
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

  const pendingDocsCount = orders.filter(o => o.complianceStatus === "Payment Received").length;
  const totalSpent = orders.reduce((sum, o) => sum + o.price, 0);
  const totalMails = orders.reduce((sum, o) => sum + (o.mailLogs?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 relative pb-12">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Horizontal Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-250">
          {[
            { id: "overview", label: "Overview", icon: "🏠" },
            { id: "bookings", label: "My Bookings", icon: "📋" },
            { id: "documents", label: "KYC Documents", icon: "📁" },
            { id: "mailbox", label: "Mailbox Scans", icon: "✉️" },
            { id: "support", label: "Support", icon: "🎧" },
            { id: "profile", label: "Profile", icon: "👤" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setViewingOrder(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#1A56DB] text-[#1A56DB]"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Back Button helper */}
        {activeTab !== "overview" && (
          <button
            onClick={() => {
              setActiveTab("overview");
              setViewingOrder(null);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A56DB] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
          >
            ← Back to Overview
          </button>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && !viewingOrder && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#1A56DB] to-[#1e40af] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-x-2">
                  <span>Welcome back,</span>
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    {clerkUser?.firstName || "Member"}
                  </span>
                  <span>! 👋</span>
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">
                  {pendingDocsCount > 0 
                    ? `You have ${pendingDocsCount} workspace booking awaiting KYC documents upload.` 
                    : "All your virtual spaces are in order."}
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all text-center cursor-pointer"
                >
                  View Bookings
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="flex-1 md:flex-initial bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-center cursor-pointer"
                >
                  Upload KYC
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Bookings", value: orders.length, color: "bg-blue-50 text-blue-600", icon: "🏢" },
                { label: "Rented Spaces", value: orders.filter(o => o.complianceStatus === "Active Workspace" || o.complianceStatus === "NOC Issued").length, color: "bg-green-50 text-green-600", icon: "📍" },
                { label: "Mail Deliveries", value: totalMails, color: "bg-orange-50 text-orange-600", icon: "✉️" },
                { label: "Total Investment", value: `₹${totalSpent.toLocaleString("en-IN")}`, color: "bg-indigo-50 text-indigo-600", icon: "💸" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} text-lg font-bold`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Bookings List Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-55">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Recent Workspace Bookings</h3>
                <span className="text-[10px] font-bold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded-full">
                  Virtual Office
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {orders.slice(0, 3).map((o) => (
                  <div key={o._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">{o.addressName}</h4>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        Plan: {o.selectedPlan} • City: {o.citySlug}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold bg-blue-50 text-[#1A56DB] px-2.5 py-1 rounded-full">
                        {o.complianceStatus}
                      </span>
                      <button
                        onClick={() => setViewingOrder(o)}
                        className="text-xs font-extrabold text-[#1A56DB] hover:underline cursor-pointer border-0 bg-transparent"
                      >
                        Track Status →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-bold text-[#1A56DB] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer border-0 bg-transparent"
                >
                  View All Rented Spaces <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS LIST VIEW & TRACKING TIMELINE ── */}
        {((activeTab === "bookings") || (activeTab === "overview" && viewingOrder)) && (
          <div className="space-y-6">
            {viewingOrder ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Workspace Detail Track
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">{viewingOrder.addressName}</h3>
                  </div>
                  <button
                    onClick={() => setViewingOrder(null)}
                    className="text-xs font-extrabold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Back to List
                  </button>
                </div>

                {/* Progress Stepper */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Compliance Timeline Progress:</h4>
                  <div className="relative pt-4">
                    <div className="absolute top-8 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden md:block" />
                    <div
                      className="absolute top-8 left-0 h-1 bg-[#1A56DB] -translate-y-1/2 z-0 transition-all duration-500 hidden md:block"
                      style={{ width: `${(getStepIndex(viewingOrder.complianceStatus) / 4) * 100}%` }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                      {[
                        { label: "Payment Received", desc: "Checkout paid verified" },
                        { label: "KYC Review", desc: "Profile documents logged" },
                        { label: "Agreement Drafting", desc: "Landlord stamp lease" },
                        { label: "Legal NOC Issuance", desc: "Consent papers signed" },
                        { label: "Active Workspace", desc: "GST & Audit verified" }
                      ].map((step, idx) => {
                        const curIdx = getStepIndex(viewingOrder.complianceStatus);
                        const isDone = idx < curIdx;
                        const isCurrent = idx === curIdx;
                        const isPending = idx > curIdx;
                        return (
                          <div key={idx} className="flex md:flex-col items-start md:items-center md:text-center gap-3 md:gap-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold md:mb-2 flex-shrink-0 ${
                              isDone ? "bg-green-600 text-white shadow-md" : isCurrent ? "bg-[#1A56DB] text-white ring-4 ring-blue-100" : "bg-white text-slate-400 border border-slate-200"
                            }`}>
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isPending ? "text-slate-400" : "text-slate-800"}`}>{step.label}</p>
                              <p className="text-[10px] text-slate-400 leading-normal">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Compliance Documents Download Grid */}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Official Certificates (Downloads):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "No Objection Certificate (NOC)", field: "nocFile", url: viewingOrder.complianceDocuments?.nocFile },
                      { label: "Electricity / Utility Bill", field: "utilityBillFile", url: viewingOrder.complianceDocuments?.utilityBillFile },
                      { label: "Stamped Rent Lease Agreement", field: "rentAgreementFile", url: viewingOrder.complianceDocuments?.rentAgreementFile },
                      { label: "Consent Letter Certificate", field: "consentLetterFile", url: viewingOrder.complianceDocuments?.consentLetterFile }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{doc.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Official landlord file logs</p>
                        </div>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1A56DB] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                            Pending Issue
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleDownloadReceipt(viewingOrder)}
                    className="bg-[#1A56DB] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 cursor-pointer"
                  >
                    Print Invoice Bill
                  </button>
                  {(viewingOrder.complianceStatus === "Payment Received" || viewingOrder.complianceStatus === "Documents Uploaded") && (
                    <button
                      onClick={() => handleCancelBooking(viewingOrder)}
                      className="bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Rented Workspace Locations</h3>
                    <p className="text-xs text-gray-500">Your registered company address leases</p>
                  </div>
                  <button
                    onClick={() => navigate("/get-live-quote")}
                    className="bg-[#1A56DB] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer"
                  >
                    Add Location +
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Center Address</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Rented City</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Plan Purpose</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-xs font-extrabold text-gray-900">{o.addressName}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">INV No: {o.invoiceNumber || "N/A"}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap capitalize text-xs text-gray-700">{o.citySlug}</td>
                          <td className="px-4 py-4 whitespace-nowrap capitalize text-xs text-gray-700">{o.selectedPlan}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-[10px] font-bold bg-blue-50 text-[#1A56DB] px-2 py-0.5 rounded-full">
                              {o.complianceStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                            <button
                              onClick={() => setViewingOrder(o)}
                              className="text-[#1A56DB] hover:underline cursor-pointer border-0 bg-transparent"
                            >
                              Track
                            </button>
                            <span>|</span>
                            <button
                              onClick={() => handleDownloadReceipt(o)}
                              className="text-gray-500 hover:underline cursor-pointer border-0 bg-transparent"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── KYC DOCUMENTS TAB ── */}
        {activeTab === "documents" && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <span className="text-4xl">📁</span>
                <h3 className="text-lg font-black text-gray-900">Upload KYC Verification Documents</h3>
                <p className="text-xs text-gray-500 leading-normal max-w-xs mx-auto">
                  Provide company records to draft legally compliant landlord Consent NOC letters and Stamp Lease agreements.
                </p>
              </div>

              {orders.length > 1 && (
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Active Booking Target</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                  >
                    {orders.map((o) => (
                      <option key={o._id} value={o._id}>
                        {o.addressName} ({o.citySlug.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <form onSubmit={handleKycSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Proposed Company/Trade Name</label>
                  <input
                    type="text"
                    required
                    value={kycForm.companyName}
                    onChange={(e) => setKycForm(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g. Verma Legal Solutions Private Limited"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">PAN Card Link/Number</label>
                    <input
                      type="text"
                      required
                      value={kycForm.panCard}
                      onChange={(e) => setKycForm(prev => ({ ...prev, panCard: e.target.value }))}
                      placeholder="Upload link / file log"
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => loadMockDocument("panCard", "https://www.filingby.com/mock/pan_card_doc.pdf")}
                      className="text-[9px] font-bold text-[#1A56DB] hover:underline mt-1 bg-transparent border-0"
                    >
                      [Auto Fill Sample]
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Aadhaar Card Link/Number</label>
                    <input
                      type="text"
                      required
                      value={kycForm.aadhaarCard}
                      onChange={(e) => setKycForm(prev => ({ ...prev, aadhaarCard: e.target.value }))}
                      placeholder="Upload link / file log"
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => loadMockDocument("aadhaarCard", "https://www.filingby.com/mock/aadhaar_card_doc.pdf")}
                      className="text-[9px] font-bold text-[#1A56DB] hover:underline mt-1 bg-transparent border-0"
                    >
                      [Auto Fill Sample]
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Director Photograph</label>
                    <input
                      type="text"
                      required
                      value={kycForm.photo}
                      onChange={(e) => setKycForm(prev => ({ ...prev, photo: e.target.value }))}
                      placeholder="Photo link / file log"
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Incorporation Cert (Optional)</label>
                    <input
                      type="text"
                      value={kycForm.incorporationCert}
                      onChange={(e) => setKycForm(prev => ({ ...prev, incorporationCert: e.target.value }))}
                      placeholder="Certificate link (if available)"
                      className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3.5 mt-2 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                  {uploading ? "Updating KYC Records..." : "Upload & Save KYC Details"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── MAILBOX SCANS TAB ── */}
        {activeTab === "mailbox" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-gray-100 gap-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Virtual Mailbox Deliveries Log</h3>
                  <p className="text-xs text-gray-500">Postal items and government couriers logged at your address</p>
                </div>
                {orders.length > 1 && (
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-250 bg-white"
                  >
                    {orders.map((o) => (
                      <option key={o._id} value={o._id}>
                        {o.addressName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedOrder && (!selectedOrder.mailLogs || selectedOrder.mailLogs.length === 0) ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  📬 No incoming mail items logged for this address yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Received Date</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sender</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Action Taken</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Attachment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {selectedOrder.mailLogs?.map((mail, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 text-xs text-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap">
                            {new Date(mail.dateReceived).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900">{mail.sender}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                              {mail.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">{mail.actionTaken}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-right font-bold">
                            {mail.attachmentUrl ? (
                              <a
                                href={mail.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1A56DB] hover:underline"
                              >
                                View File
                              </a>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUPPORT TAB ── */}
        {activeTab === "support" && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm space-y-4">
              <p className="text-5xl">🎧</p>
              <h3 className="text-xl font-bold text-gray-900">Virtual Office Compliance Support</h3>
              <p className="text-gray-550 text-sm leading-relaxed max-w-sm mx-auto">
                Need help with commercial tax inspections, physical audit verification desks, or lease renewals? Contact our dedicated compliance representative.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto pt-2">
                <button
                  onClick={() => window.open(settings?.ca_whatsapp_url || "https://wa.me/917567126945", "_blank")}
                  className="bg-green-600 text-white font-bold text-xs py-3.5 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-100"
                >
                  <span>💬</span> Contact WhatsApp Representative
                </button>
                <a
                  href={`tel:${settings?.vs_contact_phone?.replace(/\s+/g, '') || "+917567126945"}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition-all text-center"
                >
                  📞 Call support office
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1A56DB]/25">
                  <img
                    src={clerkUser?.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-905">
                    {clerkUser?.fullName || `${clerkUser?.firstName || "Client"} ${clerkUser?.lastName || ""}`.trim()}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Renter Profile • FilingBy Member</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email Address:</span>
                  <span>{clerkUser?.primaryEmailAddress?.emailAddress || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WhatsApp Mobile:</span>
                  <span>{clerkUser?.primaryPhoneNumber?.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rented Properties Count:</span>
                  <span className="text-[#1A56DB]">{orders.length} Spaces</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
