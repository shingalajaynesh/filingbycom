import { useState, useMemo } from 'react';
import { useSharedData } from '../../../shared/context/SharedDataContext';
import ServiceCard from '../../ca-portal/components/ServiceCard';

export default function NewOrderSection() {
  const { services, loading } = useSharedData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services
      .filter(s => s.isActive !== false)
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [services, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    if (!services) return ['All'];
    const cats = new Set(services.filter(s => s.isActive !== false).map(s => s.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [services]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Start a New Order</h2>
          <p className="mt-1 text-sm text-gray-500">Choose from our popular services and products below</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a service... (e.g. GST Registration, Pvt Ltd, Trademark)"
            className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 min-h-[44px]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A56DB] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-955'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid matching Popular Services */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map(service => (
            <ServiceCard key={service._id || service.slug} service={{...service, price: service.basePrice}} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-md mx-auto">
          <p className="text-4xl mb-3">🔍</p>
          <h4 className="font-bold text-gray-800">No services found</h4>
          <p className="text-gray-500 text-xs mt-1">
            Try adjusting your search criteria or category filter.
          </p>
        </div>
      )}
    </div>
  );
}
