import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import DashboardOverview from '../components/DashboardOverview';
import OrderList from '../components/OrderList';
import SupportWidget from '../components/SupportWidget';
import ProfileCard from '../components/ProfileCard';
import OrderTimeline from '../components/OrderTimeline';
import NotificationPanel from '../components/NotificationPanel';
import NewOrderSection from '../components/NewOrderSection';

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

const ReferralCard = () => (
  <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 
                  max-w-md mx-auto">
    <p className="text-5xl mb-4">🎁</p>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Refer & Earn ₹500</h2>
    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
      Share your referral code. Earn ₹500 for every friend who orders.
    </p>
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl 
                    p-5 mb-5 border border-blue-100">
      <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Your Referral Code</p>
      <p className="text-3xl font-bold text-[#1A56DB] tracking-widest">RAJESH50</p>
    </div>
    <button
      onClick={() => {
        navigator.clipboard.writeText('RAJESH50');
        alert("Referral code 'RAJESH50' copied to clipboard!");
      }}
      className="bg-[#1A56DB] text-white px-8 py-3 rounded-full font-bold 
                 text-sm hover:bg-blue-700 transition-all active:scale-95 
                 hover:shadow-lg hover:shadow-blue-200 w-full"
    >
      📋 Copy Code
    </button>
  </div>
);

export default function ClientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || 'overview'
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleServiceSelect = (slug) => {
    navigate(`/services/${slug}`);
  };

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const res = await fetch(`${API_BASE}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          // Map backend orders to frontend format
          const mappedOrders = data.orders.map(o => ({
            id: o._id,
            service: o.service?.name || "Unknown Service",
            category: o.service?.tag || "Service",
            status: o.orderStatus === "Pending" ? "pending-docs" : o.orderStatus === "Complete" ? "completed" : "in-progress",
            amount: o.amount,
            date: new Date(o.createdAt).toISOString().split('T')[0],
            assignedTo: "Processing Team",
            progress: o.orderStatus === "Pending" ? 20 : o.orderStatus === "Complete" ? 100 : 60,
            paymentType: o.paymentType,
            paymentStatus: o.paymentStatus,
            invoiceNumber: o.invoiceNumber,
            invoiceDate: o.invoiceDate,
            steps: [
              { label: "Order Placed", done: true, date: new Date(o.createdAt).toLocaleDateString() },
              { label: "Documents Received", done: o.orderStatus !== "Pending", date: null },
              { label: "Processing", done: o.orderStatus !== "Pending", date: null },
              { label: "Certificate Delivered", done: o.orderStatus === "Complete", date: null },
            ]
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
            {activeTab === 'overview' && <DashboardOverview orders={orders} setActiveTab={setActiveTab} onOrderClick={setSelectedOrder} />}
            {activeTab === 'orders' && <OrderList orders={orders} onOrderClick={setSelectedOrder} />}
            {activeTab === 'documents' && <DocumentSection />}
            {activeTab === 'support' && <SupportWidget />}
            {activeTab === 'profile' && <ProfileCard />}
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
          onCancelSuccess={(cancelledId) => {
            setOrders(prev => prev.filter(o => o.id !== cancelledId));
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
