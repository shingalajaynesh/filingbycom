/**
 * OrderCard.jsx
 * Displays a single order row with:
 *  - Client info (name, email, phone)
 *  - Service name & amount
 *  - Order status action buttons (Pending / Document Verification / Complete)
 *  - Payment status display + Mark as Paid button for cash orders
 */

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["Pending", "Document Verification", "Pending Payment", "Complete"];

export default function OrderCard({ order, onUpdateStatus, onUpdatePayment, onDelete, readOnly = false }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { user, service, amount, orderStatus, paymentType, paymentStatus, createdAt, _id } = order;

  const clientName = user
    ? `${user.firstName} ${user.lastName}`
    : "Unknown Client";

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleStatusChange = async (newStatus) => {
    if (newStatus === orderStatus || updatingStatus) return;

    if (newStatus === "Complete") {
      setIsCompleting(true);
      // Let the animation play before removing it from active
      setTimeout(async () => {
        setUpdatingStatus(true);
        const result = await onUpdateStatus(_id, newStatus);
        if (!result.success) {
          toast.error(result.message || "Failed to update status");
          setIsCompleting(false); // revert if failed
        }
        setUpdatingStatus(false);
      }, 1000);
      return;
    }

    setUpdatingStatus(true);
    const result = await onUpdateStatus(_id, newStatus);
    if (!result.success) toast.error(result.message || "Failed to update status");
    setUpdatingStatus(false);
  };

  const handleMarkPaid = async () => {
    if (updatingPayment) return;
    setUpdatingPayment(true);
    const result = await onUpdatePayment(_id, "Paid");
    if (result.success) {
      toast.success("Payment marked as Paid");
    } else {
      toast.error(result.message || "Failed to update payment");
    }
    setUpdatingPayment(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const reason = prompt("Why are you soft deleting this order? Please specify a reason note:");
    if (reason === null) return; // user cancelled
    if (!reason.trim()) {
      toast.error("Deletion reason note is required.");
      return;
    }

    if (confirm("Are you sure you want to delete this order? It will be hidden from all client and admin dashboards.")) {
      const result = await onDelete(_id, reason);
      if (result.success) {
        toast.success("Order deleted successfully.");
      } else {
        toast.error(result.message || "Failed to delete order");
      }
    }
  };

  return (
    <div className={`relative bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-700 ease-in-out ${isCompleting ? "scale-95 opacity-0 border-green-500 shadow-xl z-50 translate-x-4" : "border-gray-200 scale-100 opacity-100"
      }`}>
      {/* Complete Animation Overlay */}
      {isCompleting && (
        <div className="absolute inset-0 bg-green-500 flex items-center justify-center z-50 transition-all duration-300">
          <span className="text-white text-2xl font-black flex items-center gap-2 animate-bounce shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Order Completed!
          </span>
        </div>
      )}

      {/* Card header */}
      <div className="bg-[#1A56DB] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "?"}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{clientName}</p>
            <p className="text-blue-100 text-[11px] truncate">{user?.email || "—"}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold text-base">₹{amount?.toLocaleString("en-IN")}</p>
          <p className="text-blue-100 text-[10px]">{formattedDate}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-4">
        {/* Client details row */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          {user?.phone && (
            <span className="flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {user.phone}
              <a
                href={`https://wa.me/${user.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 ml-1.5 px-2 py-0.5 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 rounded border border-green-200 transition-colors text-[10px] font-bold cursor-pointer"
                title="Chat with client on WhatsApp"
              >
                <svg viewBox="0 0 32 32" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.75 3.047 9.383L1.05 30.91l5.7-1.824A15.93 15.93 0 0016.004 32C24.828 32 32 24.822 32 16S24.828 0 16.004 0zm9.28 22.617c-.385 1.086-1.91 1.988-3.13 2.25-.834.178-1.922.32-5.586-1.2-4.688-1.963-7.71-6.72-7.945-7.027-.223-.308-1.883-2.508-1.883-4.781 0-2.273 1.19-3.383 1.61-3.816.386-.4.84-.5 1.12-.5l.808.016c.26.01.613-.098.96.73.386.89 1.313 3.164 1.43 3.393.115.23.19.5.038.808-.15.307-.225.497-.446.766-.224.27-.47.603-.672.81-.224.228-.457.476-.196.932.26.457 1.157 1.908 2.484 3.09 1.707 1.524 3.145 1.996 3.6 2.22.457.222.724.186.99-.112.27-.298 1.154-1.348 1.462-1.81.307-.46.614-.385 1.034-.23.42.154 2.677 1.263 3.134 1.492.457.228.762.342.873.53.11.185.11 1.073-.275 2.16z" />
                </svg>
                WhatsApp
              </a>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span className="font-semibold text-gray-800">{service?.name || "—"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            {paymentType}
          </span>
        </div>

        {/* Order Status Controls */}
        {!readOnly && (
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Order Status
            </p>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.filter(s => orderStatus !== "Complete" || s === "Complete").map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updatingStatus}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${orderStatus === status
                      ? status === "Complete"
                        ? "bg-green-600 text-white border-green-600"
                        : status === "Document Verification"
                          ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                          : status === "Pending Payment"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-yellow-500 text-white border-yellow-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#1A56DB] hover:text-[#1A56DB]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingStatus && orderStatus !== status ? (
                    <span className="animate-pulse">{status}</span>
                  ) : (
                    status
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Read-only status for history */}
        {readOnly && (
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status:</p>
            <StatusBadge value={orderStatus} />
          </div>
        )}

        {/* Payment Status */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payment:</p>
            {paymentType === "Online" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-green-50 border border-green-200 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Paid (Online)
              </span>
            ) : (
              <StatusBadge value={paymentStatus} />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Delete button (only if onDelete is supplied) */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors border border-red-200 cursor-pointer"
                title="Soft delete order"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}

            {/* Mark as Paid button — only for Cash + Unpaid + not readOnly */}
            {!readOnly && paymentType === "Cash" && paymentStatus === "Unpaid" && (
              <button
                onClick={handleMarkPaid}
                disabled={updatingPayment}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {updatingPayment ? (
                  <span className="animate-pulse">Updating...</span>
                ) : (
                  <>Mark as Paid</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
