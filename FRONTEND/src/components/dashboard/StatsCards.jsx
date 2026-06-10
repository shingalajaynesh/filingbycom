import React from 'react';

export default function StatsCards({ orders = [] }) {
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingDocsOrders = orders.filter(o => o.status === 'pending-docs').length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: "📋",
      color: "bg-blue-50 text-blue-600",
      trend: "+2 this month",
      trendUp: true
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: "⏳",
      color: "bg-orange-50 text-orange-600",
      trend: "In progress",
      trendUp: null
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: "✅",
      color: "bg-green-50 text-green-600",
      trend: "All done",
      trendUp: true
    },
    {
      label: "Documents Pending",
      value: pendingDocsOrders,
      icon: "📁",
      color: "bg-red-50 text-red-600",
      trend: "Action needed",
      trendUp: false
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} text-lg font-bold`}>
              {stat.icon}
            </div>
            {stat.trend && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stat.trendUp === true
                  ? 'bg-green-50 text-green-700'
                  : stat.trendUp === false
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                {stat.trendUp === true && '↑ '}
                {stat.trendUp === false && '↓ '}
                {stat.trend}
              </span>
            )}
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
