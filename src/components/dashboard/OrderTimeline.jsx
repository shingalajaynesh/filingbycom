import React from 'react';

export default function OrderTimeline({ order, onClose }) {
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
    alert(`Downloading receipt for order ${order.id}...`);
  };

  const handleContactSupport = () => {
    alert(`Routing to Support. Please raise a ticket or call us for Order #${order.id}.`);
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
              Order Documents
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
            <button
              onClick={() => {
                alert("Please close this modal and go to 'Documents' tab or click upload to proceed.");
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              📤 Upload Required Documents
            </button>
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
