import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardOverview from '../components/DashboardOverview';
import OrderList from '../components/OrderList';
import SupportWidget from '../components/SupportWidget';
import ProfileCard from '../components/ProfileCard';
import OrderTimeline from '../components/OrderTimeline';
import NotificationPanel from '../components/NotificationPanel';
import NewOrderSection from '../components/NewOrderSection';
import { useOrderContext } from '../../../shared/context/OrderContext';

const DocumentSection = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-lg mx-auto">
    <p className="text-5xl mb-4">📁</p>
    <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Documents</h3>
    <p className="text-gray-505 text-sm mb-6 leading-relaxed">
      Please send your documents directly to our expert CA/CS processing team on WhatsApp. Mention your order details or registered email.
    </p>
    <button
      onClick={() => window.open("https://wa.me/917567126945", "_blank")}
      className="bg-green-600 text-white font-bold text-sm px-8 py-3 rounded-full hover:bg-green-700 transition-all active:scale-95 hover:shadow-lg hover:shadow-green-200 flex items-center justify-center gap-2 mx-auto cursor-pointer"
    >
      <span>💬</span> Share on WhatsApp
    </button>
  </div>
);

// ReferralCard component deleted since it was unused and commented out.


export default function ClientDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || 'overview'
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const { orders, ordersLoading: loading, fetchOrders } = useOrderContext();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 relative">


      {/* Main dashboard content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Horizontal tabs navigation */}
        {!loading && (
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-250">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'orders', label: 'My Orders', icon: '📋' },
              { id: 'documents', label: 'Documents', icon: '📁' },
              { id: 'new-order', label: 'New Order', icon: '➕' },
              { id: 'support', label: 'Support', icon: '🎧' },
              { id: 'profile', label: 'Profile', icon: '👤' }
              // { id: 'referral', label: 'Referral', icon: '🎁' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                    ? 'border-[#1A56DB] text-[#1A56DB]'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab !== 'overview' && (
              <button
                onClick={() => setActiveTab('overview')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1A56DB] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
              >
                ← Back to Overview
              </button>
            )}
            {activeTab === 'overview' && <DashboardOverview orders={orders} setActiveTab={setActiveTab} onOrderClick={setSelectedOrder} />}
            {activeTab === 'orders' && <OrderList orders={orders} onOrderClick={setSelectedOrder} />}
            {activeTab === 'documents' && <DocumentSection />}
            {activeTab === 'support' && <SupportWidget />}
            {activeTab === 'profile' && <ProfileCard ordersCount={orders.length} />}
            {/* {activeTab === 'referral' && <ReferralCard />} */}
            {activeTab === 'new-order' && <NewOrderSection />}
          </div>
        )}
      </main>

      {/* Order Detail Slider / Modal */}
      {selectedOrder && (
        <OrderTimeline
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelSuccess={() => {
            fetchOrders();
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Floating Notifications Panel Dropdown */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </div>
  );
}
