import { useUser } from '@clerk/clerk-react';
import StatsCards from './StatsCards';
import OrderList from './OrderList';
import QuickActions from './QuickActions';
import { useSharedData } from '../../../shared/context/SharedDataContext';

export default function DashboardOverview({ orders = [], setActiveTab, onOrderClick }) {
  const { user } = useUser();
  const { settings } = useSharedData();
  const userName = user?.firstName || 'User';

  // Count items for the welcome banner
  const pendingDocsCount = orders.filter(o => o.status === 'pending-docs').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const greeting = getGreeting();

  return (
    <div className="space-y-6">

      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1A56DB] to-[#1e40af] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-x-2">
            <span>{greeting},</span>
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">{userName}</span>
            <span>! 👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            You have {pendingDocsCount} pending document {pendingDocsCount === 1 ? 'upload' : 'uploads'}.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all text-center min-h-11 md:min-h-[unset] cursor-pointer"
          >
            View Orders
          </button>
          <button
            onClick={() => window.open(settings?.ca_whatsapp_url || "https://wa.me/917567126945", "_blank")}
            className="flex-1 md:flex-initial bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-center min-h-11 md:min-h-[unset] cursor-pointer"
          >
            Upload Documents
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <StatsCards orders={orders} />

      {/* 3. Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50 mb-4">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Recent Orders
            </h3>
            <span className="text-[10px] font-bold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded-full">
              Latest filings
            </span>
          </div>
          {/* Embedded OrderList showing only top 3 items */}
          <OrderList
            orders={orders.slice(0, 3)}
            onOrderClick={onOrderClick}
            hideFilters={true}
            onNewOrderClick={() => setActiveTab('new-order')}
          />
        </div>

        <div className="pt-4 border-t border-gray-55/40 mt-4 text-center">
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#1A56DB] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            View All Orders <span className="text-sm">→</span>
          </button>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <QuickActions onNavigate={setActiveTab} />
      </div>

    </div>
  );
}
