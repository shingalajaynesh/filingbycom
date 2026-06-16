import { useState } from 'react';

const initialNotifications = [
  { id: 1, type: "order", message: "Your GST Registration is now In Progress", time: "2 hours ago", read: false, icon: "📋" },
  { id: 2, type: "document", message: "Please upload PAN Card for Order #FB003", time: "1 day ago", read: false, icon: "📁" },
  { id: 4, type: "completed", message: "LLP Registration completed! Download certificate", time: "3 days ago", read: true, icon: "✅" },
  { id: 5, type: "payment", message: "Payment of ₹6,999 received for Trademark", time: "5 days ago", read: true, icon: "💰" },
];

export default function NotificationPanel({ isOpen, onClose }) {
  const [list, setList] = useState(initialNotifications);

  if (!isOpen) return null;

  const markAllRead = () => {
    setList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = list.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop overlay to catch click outside */}
      <div
        className="fixed inset-0 z-[998]"
        onClick={onClose}
      />

      {/* Floating Panel */}
      <div className="absolute right-4 sm:right-6 md:right-10 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999] animate-fade-in-down max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-950 text-sm">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] font-bold text-[#1A56DB] hover:text-blue-700 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List items */}
        <div className="overflow-y-auto max-h-[350px] divide-y divide-gray-50 dashboard-scroll">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`flex gap-3 p-4 cursor-pointer transition-colors border-l-2 select-none ${item.read
                    ? 'bg-white border-transparent hover:bg-gray-50/50'
                    : 'bg-blue-50/60 border-blue-600 hover:bg-blue-50'
                  }`}
              >
                {/* Icon Circle */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${item.read ? 'bg-gray-100 text-gray-650' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {item.icon}
                </div>

                {/* Message & Time */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-normal ${item.read ? 'text-gray-600 font-medium' : 'text-gray-900 font-semibold'
                    }`}>
                    {item.message}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">
                    {item.time}
                  </p>
                </div>

                {/* Status Dot */}
                {!item.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 self-center" />
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs font-semibold">
              No notifications yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-2.5 text-center bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-700 py-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
