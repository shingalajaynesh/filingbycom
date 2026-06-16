import { useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import { useOrderContext } from '../../../shared/context/OrderContext';
import { useSharedData } from '../../../shared/context/SharedDataContext';

export default function OrderTimeline({ order, onClose, onCancelSuccess }) {
  const { user: clerkUser } = useUser();
  const { cancelOrder } = useOrderContext();
  const [cancelling, setCancelling] = useState(false);
  const { settings } = useSharedData();
  if (!order) return null;

  const statusStyles = {
    'completed': { bg: 'bg-green-100 text-green-700 border-green-200', label: 'Completed' },
    'in-progress': { bg: 'bg-blue-100 text-blue-700 border-blue-200', label: 'In Progress' },
    'pending-docs': { bg: 'bg-red-100 text-red-700 border-red-200', label: 'Pending Docs' },
    'under-review': { bg: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Under Review' },
    'cancelled': { bg: 'bg-gray-100 text-gray-500 border-gray-200', label: 'Cancelled' }
  };

  const currentStatus = statusStyles[order.status] || { bg: 'bg-gray-100 text-gray-600 border-gray-200', label: order.status };

  const handleDownloadReceipt = () => {
    // Use stored invoice details, or generate fallback for legacy orders
    const invoiceNum = order.invoiceNumber || `INV-${order.id.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const invoiceD = order.invoiceDate ? new Date(order.invoiceDate) : new Date(order.date || Date.now());
    const dateStr = invoiceD.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    
    const clientName = clerkUser?.fullName || `${clerkUser?.firstName || "Client"} ${clerkUser?.lastName || ""}`.trim() || "Valued Client";
    const clientEmail = clerkUser?.primaryEmailAddress?.emailAddress || "N/A";
    const clientPhone = clerkUser?.primaryPhoneNumber?.phoneNumber || "N/A";

    const baseAmount = Math.round(order.amount / 1.18);
    const gstAmount = order.amount - baseAmount;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download/print the invoice.");
      return;
    }

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
                <span class="status-badge ${order.paymentStatus === 'Paid' ? 'status-paid' : 'status-unpaid'}">
                  ${order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid / Pending'}
                </span>
              </div>
            </div>

            <div class="grid-2">
              <div class="info-block">
                <h3>Billed By</h3>
                <p class="name">FilingBy Solutions Private Limited</p>
                <p>${settings?.ca_contact_address || "3rd Floor, Business Center, New Delhi, India"}</p>
                <p>${settings?.ca_contact_email || "support@filingby.com"} | ${settings?.ca_contact_phone || "+91 75671 26945"}</p>
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
                      ${order.service}
                      <span style="display: block; font-size: 11px; font-weight: normal; color: #64748b; margin-top: 4px;">
                        Category: ${order.category}
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
                  <td style="text-align: right;">₹${order.amount.toLocaleString("en-IN")}</td>
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

  const handleContactSupport = () => {
    toast(`Routing to Support. Please raise a ticket or call us for Order #${order.id}.`, { icon: 'ℹ️' });
  };

  const handleCancelOrder = async () => {
    const reason = prompt("Why do you want to cancel this order? (e.g. Created by mistake)");
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error("A cancellation reason is required.");
      return;
    }

    try {
      setCancelling(true);
      const data = await cancelOrder(order.id, reason);
      if (data.success) {
        toast.success("Order cancelled successfully.");
        if (onCancelSuccess) {
          onCancelSuccess(order.id);
        }
      } else {
        toast.error(data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling order.");
    } finally {
      setCancelling(false);
    }
  };

  // Extract initials for CA avatar
  const getInitials = (name) => {
    if (!name) return 'CA';
    const clean = name.replace(/^(CA|CS|Advocate)\s+/i, '');
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Mock list of uploaded docs for illustration
  const mockDocs = [
    { name: 'PAN_Card.pdf', size: '245 KB', date: '02 Jun 2025' },
    { name: 'Aadhaar_Card.pdf', size: '1.2 MB', date: '02 Jun 2025' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-all duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl z-10 sidebar-transition flex flex-col justify-between">

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded">
              Order ID: {order.id}
            </span>
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl mt-1">
              {order.service}
            </h3>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-xs text-gray-400 font-medium">
                {order.category}
              </span>
              <span className="text-gray-300">•</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentStatus.bg}`}>
                {currentStatus.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center w-8 h-8"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div className="space-y-6 flex-1">
          {/* Progress bar */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Overall Progress</span>
              <span>{order.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#1A56DB] h-2 rounded-full progress-bar"
                style={{ width: `${order.progress}%`, '--progress': `${order.progress}%` }}
              />
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4 tracking-wide">
              TRACK FILING STATUS
            </h4>
            <div className="space-y-0.5 pl-2">
              {order.steps.map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Connector line */}
                  {i < order.steps.length - 1 && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-full -ml-[1px]
                                    ${step.done ? 'bg-[#1A56DB]' : 'bg-gray-200'}`} />
                  )}
                  {/* Circle */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                  z-10 font-semibold text-xs border-2 ${step.done
                      ? 'bg-[#1A56DB] border-[#1A56DB] text-white shadow-sm'
                      : 'bg-white border-gray-300 text-gray-400'}`}>
                    {step.done ? '✓' : (i + 1)}
                  </div>
                  {/* Content */}
                  <div className="pb-8">
                    <p className={`font-semibold text-sm leading-snug ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.date && <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned CA details */}
          {order.assignedTo && (
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
                {getInitials(order.assignedTo)}
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-[#1A56DB] bg-blue-50 px-1.5 py-0.5 rounded">
                  ASSIGNED PROFESSIONAL
                </span>
                <h5 className="font-bold text-gray-950 text-sm mt-1 leading-none">
                  {order.assignedTo}
                </h5>
                <p className="text-xs text-gray-500 mt-1">
                  Verified Chartered Accountant / Specialist
                </p>
              </div>
            </div>
          )}

          {/* Documents Section */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-3 tracking-wide uppercase">
              Documents Submitted
            </h4>

            {order.status === 'pending-docs' ? (
              <div className="bg-red-50/50 border border-dashed border-red-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-red-700 font-medium mb-2">
                  ⚠️ Action Required: Documents are pending for this order.
                </p>
                <p className="text-[11px] text-gray-500 mb-3">
                  Please upload the required files to start the filing process.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mockDocs.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📄</span>
                      <div>
                        <p className="font-semibold text-gray-800">{doc.name}</p>
                        <p className="text-[10px] text-gray-400">{doc.size} • Uploaded {doc.date}</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full text-[10px]">
                      ✓ Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons footer */}
        <div className="border-t border-gray-100 pt-4 mt-6 flex flex-col gap-2">
          {order.status === 'pending-docs' && (
            <>
              <button
                onClick={() => {
                  window.open(settings?.ca_whatsapp_url || "https://wa.me/917567126945", "_blank");
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                💬 Upload Required Documents on WhatsApp
              </button>

              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-3 px-4 rounded-xl border border-rose-200 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
              >
                ❌ {cancelling ? "Cancelling Order..." : "Cancel Order (Created by mistake)"}
              </button>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs py-3 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            >
              📥 Download Receipt
            </button>
            <button
              onClick={handleContactSupport}
              className="flex-1 bg-[#1A56DB] hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              🎧 Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
