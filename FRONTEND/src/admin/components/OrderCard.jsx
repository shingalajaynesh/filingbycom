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

const ORDER_STATUSES = ["Pending", "Document Verification", "Complete"];

export default function OrderCard({ order, onUpdateStatus, onUpdatePayment, readOnly = false }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {user.phone}
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
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updatingStatus}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                    orderStatus === status
                      ? status === "Complete"
                        ? "bg-green-600 text-white border-green-600"
                        : status === "Document Verification"
                        ? "bg-[#1A56DB] text-white border-[#1A56DB]"
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

          {/* Mark as Paid button — only for Cash + Unpaid + not readOnly */}
          {!readOnly && paymentType === "Cash" && paymentStatus === "Unpaid" && (
            <button
              onClick={handleMarkPaid}
              disabled={updatingPayment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
