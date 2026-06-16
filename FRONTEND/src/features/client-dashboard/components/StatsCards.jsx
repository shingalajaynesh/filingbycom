export default function StatsCards({ orders = [] }) {
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingDocsOrders = orders.filter(o => o.status === 'pending-docs').length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      color: "bg-blue-50 text-blue-600"
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: "bg-orange-50 text-orange-600"
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: "bg-green-50 text-green-600"
    },
    {
      label: "Documents Pending",
      value: pendingDocsOrders,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="12" y1="9" x2="12.01" y2="9"/>
        </svg>
      ),
      color: "bg-red-50 text-red-600"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
