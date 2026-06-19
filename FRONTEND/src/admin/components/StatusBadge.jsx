/**
 * StatusBadge.jsx
 * Displays a colored pill badge for order status or payment status.
 */

export default function StatusBadge({ value }) {
  const configs = {
    // Order statuses
    "Pending": {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-400",
    },
    "Document Verification": {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    "Pending Payment": {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500",
    },
    "Complete": {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    // Payment statuses
    "Paid": {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    "Unpaid": {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      dot: "bg-red-400",
    },
  };

  const cfg = configs[value] || {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {value}
    </span>
  );
}
