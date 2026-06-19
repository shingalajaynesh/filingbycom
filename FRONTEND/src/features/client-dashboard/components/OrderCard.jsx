
export default function OrderCard({ order, onClick }) {
  if (!order) return null;

  const statusStyles = {
    'completed':       { bg: 'bg-green-100 text-green-700 border-green-200',      label: 'Completed' },
    'in-progress':     { bg: 'bg-blue-100 text-blue-700 border-blue-200',         label: 'In Progress' },
    'pending-docs':    { bg: 'bg-red-100 text-red-700 border-red-200',            label: 'Pending Docs' },
    'under-review':    { bg: 'bg-purple-100 text-purple-700 border-purple-200',   label: 'Under Review' },
    'pending-payment': { bg: 'bg-indigo-100 text-indigo-700 border-indigo-200',   label: 'Pending Payment' },
    'cancelled':       { bg: 'bg-gray-100 text-gray-500 border-gray-200',         label: 'Cancelled' }
  };

  const paymentStatusStyles = {
    'Paid':    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Paid' },
    'paid':    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Paid' },
    'Unpaid':  { bg: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500',     label: 'Unpaid' },
    'unpaid':  { bg: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500',     label: 'Unpaid' },
    'Pending': { bg: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-400',   label: 'Payment Pending' },
    'pending': { bg: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-400',   label: 'Payment Pending' },
    'Failed':  { bg: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500',     label: 'Payment Failed' },
    'failed':  { bg: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500',     label: 'Payment Failed' },
  };

  const currentStatus = statusStyles[order.status] || { bg: 'bg-gray-100 text-gray-600 border-gray-200', label: order.status };
  const paymentInfo = order.paymentStatus
    ? (paymentStatusStyles[order.paymentStatus] || { bg: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400', label: order.paymentStatus })
    : null;

  // Format date nicely
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer flex flex-col justify-between h-full group"
    >
      <div>
        {/* Row 1: Service Name + Order Status */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#1A56DB] transition-colors leading-snug">
            {order.service}
          </h4>
          <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border ${currentStatus.bg} whitespace-nowrap`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Row 2: Category + Amount */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-gray-400 font-medium">{order.category}</span>
          <span className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-lg">
            ₹{order.amount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Row 3: Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-[#1A56DB] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${order.progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] font-medium text-gray-500">{order.progress}% complete</span>
            {order.assignedTo && (
              <span className="text-[11px] text-gray-400">
                Assigned: <span className="font-medium text-gray-600">{order.assignedTo}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Placed date, Payment status + Pay Online, View Details */}
      <div className="flex justify-between items-end pt-3 border-t border-gray-50 mt-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-gray-400">
            Placed: <span className="font-medium text-gray-600">{formatDate(order.date)}</span>
          </span>

          {/* Payment Status Badge + Pay Online button */}
          {paymentInfo && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border w-fit ${paymentInfo.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${paymentInfo.dot} shrink-0`} />
                {paymentInfo.label}
              </span>
            </div>
          )}
        </div>

        <span className="text-xs font-semibold text-[#1A56DB] hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View Details <span className="text-sm">→</span>
        </span>
      </div>
    </div>
  );
}
