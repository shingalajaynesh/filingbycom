import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import OrderList from '../components/dashboard/OrderList';
import SupportWidget from '../components/dashboard/SupportWidget';
import ProfileCard from '../components/dashboard/ProfileCard';
import OrderTimeline from '../components/dashboard/OrderTimeline';
import NotificationPanel from '../components/dashboard/NotificationPanel';

const dummyOrders = [
  {
    id: "FB001",
    service: "GST Registration",
    category: "GST Services",
    status: "completed",
    amount: 999,
    date: "2025-06-01",
    assignedTo: "CA Priya Sharma",
    progress: 100,
    steps: [
      { label: "Order Placed", done: true, date: "01 Jun" },
      { label: "Documents Received", done: true, date: "02 Jun" },
      { label: "Processing", done: true, date: "03 Jun" },
      { label: "Govt Filing Done", done: true, date: "04 Jun" },
      { label: "Certificate Delivered", done: true, date: "05 Jun" },
    ]
  },
  {
    id: "FB002",
    service: "Trademark Registration",
    category: "Trademark & IP",
    status: "in-progress",
    amount: 6999,
    date: "2025-06-03",
    assignedTo: "CS Anita Verma",
    progress: 45,
    steps: [
      { label: "Order Placed", done: true, date: "03 Jun" },
      { label: "Documents Received", done: true, date: "04 Jun" },
      { label: "Application Filed", done: false, date: null },
      { label: "Govt Approval", done: false, date: null },
      { label: "Certificate Delivered", done: false, date: null },
    ]
  },
  {
    id: "FB003",
    service: "Private Limited Company",
    category: "Company Registration",
    status: "pending-docs",
    amount: 6999,
    date: "2025-06-04",
    assignedTo: "CA Rahul Mehta",
    progress: 20,
    steps: [
      { label: "Order Placed", done: true, date: "04 Jun" },
      { label: "Documents Received", done: false, date: null },
      { label: "DSC Application", done: false, date: null },
      { label: "MCA Filing", done: false, date: null },
      { label: "Certificate Delivered", done: false, date: null },
    ]
  },
  {
    id: "FB004",
    service: "ITR-3 Filing",
    category: "Income Tax",
    status: "under-review",
    amount: 999,
    date: "2025-06-05",
    assignedTo: "CA Sunita Patel",
    progress: 65,
    steps: [
      { label: "Order Placed", done: true, date: "05 Jun" },
      { label: "Documents Received", done: true, date: "06 Jun" },
      { label: "ITR Preparation", done: true, date: "07 Jun" },
      { label: "Client Review", done: false, date: null },
      { label: "Filed & Acknowledged", done: false, date: null },
    ]
  },
  {
    id: "FB005",
    service: "ROC Annual Filing",
    category: "MCA/ROC",
    status: "completed",
    amount: 2999,
    date: "2025-05-20",
    assignedTo: "CS Vijay Kumar",
    progress: 100,
    steps: [
      { label: "Order Placed", done: true, date: "20 May" },
      { label: "Documents Received", done: true, date: "21 May" },
      { label: "Filing Prepared", done: true, date: "23 May" },
      { label: "MCA Portal Filed", done: true, date: "25 May" },
      { label: "Acknowledgement Received", done: true, date: "27 May" },
    ]
  },
];

const DocumentSection = ({ orders }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
    <p className="text-4xl mb-3">📁</p>
    <h3 className="text-lg font-bold text-gray-900 mb-2">Documents</h3>
    <p className="text-gray-500 text-sm mb-4">
      Upload and manage documents for your active orders
    </p>
    <div className="space-y-3 max-w-md mx-auto">
      {orders.filter(o => o.status === 'pending-docs').map(order => (
        <div key={order.id} 
             className="flex items-center justify-between bg-red-50 
                        border border-red-100 rounded-xl p-4">
          <div className="text-left flex-1 min-w-0 mr-3">
            <p className="text-sm font-semibold text-gray-800 truncate">{order.service}</p>
            <p className="text-xs text-red-500 font-medium">Documents required</p>
          </div>
          <button className="bg-[#1A56DB] text-white text-xs font-semibold 
                             px-4 py-2 rounded-full hover:bg-blue-700 
                             transition-all active:scale-95 whitespace-nowrap">
            Upload
          </button>
        </div>
      ))}
      {orders.filter(o => o.status === 'pending-docs').length === 0 && (
        <p className="text-green-600 font-medium text-sm">
          ✅ No pending document uploads
        </p>
      )}
    </div>
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
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || 'overview'
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 relative">


      {/* Main dashboard content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <DashboardOverview orders={dummyOrders} setActiveTab={setActiveTab} />}
        {activeTab === 'orders' && <OrderList orders={dummyOrders} onOrderClick={setSelectedOrder} />}
        {activeTab === 'documents' && <DocumentSection orders={dummyOrders} />}
        {activeTab === 'support' && <SupportWidget />}
        {activeTab === 'profile' && <ProfileCard />}
        {activeTab === 'referral' && <ReferralCard />}
      </main>

      {/* Order Detail Slider / Modal */}
      {selectedOrder && (
        <OrderTimeline 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
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
