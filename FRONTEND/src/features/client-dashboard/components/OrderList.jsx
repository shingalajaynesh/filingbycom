import { useState } from 'react';
import OrderCard from './OrderCard';

export default function OrderList({ orders = [], onOrderClick, hideFilters = false, onNewOrderClick }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');

  // Filter tabs definition
  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending Docs' }
  ];

  // Filtering and Sorting Logic
  const displayed = orders
    .filter(o => {
      if (hideFilters) return true; // disable filter tab checks in compact mode
      if (filter === 'all') return true;
      if (filter === 'active') return ['in-progress', 'under-review', 'pending-payment'].includes(o.status);
      if (filter === 'completed') return o.status === 'completed';
      if (filter === 'pending') return o.status === 'pending-docs';
      return true;
    })
    .filter(o => {
      if (hideFilters) return true; // disable search checks in compact mode
      return o.service.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sort === 'latest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Search & Sort Controls Header */}
      {!hideFilters && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders by service or ID (e.g. GST, FB001)..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 min-h-11 sm:min-h-[unset]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
              Sort By:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-11 sm:min-h-[unset] cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Tabs scrollbar-hide */}
      {!hideFilters && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-11 flex items-center justify-center cursor-pointer ${filter === tab.id
                  ? 'bg-[#1A56DB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              {tab.label}
              {/* Custom badges inside filters for count */}
              {tab.id !== 'all' && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                  {tab.id === 'active' && orders.filter(o => ['in-progress', 'under-review', 'pending-payment'].includes(o.status)).length}
                  {tab.id === 'completed' && orders.filter(o => o.status === 'completed').length}
                  {tab.id === 'pending' && orders.filter(o => o.status === 'pending-docs').length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Orders Grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((order) => (
            <div key={order.id} className="h-full">
              <OrderCard
                order={order}
                onClick={() => onOrderClick && onOrderClick(order)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center justify-center max-w-md mx-auto mt-8">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-3xl mb-4 animate-bounce">
            📋
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No orders found
          </h3>
          {orders.length === 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
                You haven't placed any orders yet. Start compliance today!
              </p>
              <button
                onClick={onNewOrderClick}
                className="bg-[#1A56DB] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all cursor-pointer min-h-11 shadow-md shadow-blue-500/10"
              >
                Place New Order
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
                We couldn't find any orders matching your search query or selected filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
                className="bg-[#1A56DB] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all cursor-pointer min-h-11 shadow-md shadow-blue-500/10"
              >
                Reset Filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
