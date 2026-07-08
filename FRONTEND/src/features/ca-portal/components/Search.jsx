import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedData } from '../../../shared/context/SharedDataContext';

export default function Search() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const { services } = useSharedData();

    const filtered = useMemo(() => {
        if (!searchQuery || !services) return [];
        return services
            .filter(s => s.isActive !== false)
            .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );
    }, [searchQuery, services]);

    useEffect(() => {
        const handleClick = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            sessionStorage.setItem("dashboard_search_query", query);
            navigate('/dashboard', { state: { tab: 'new-order' } });
        }
    };

    return (
        <form onSubmit={handleSearchSubmit} className="search-container relative mx-auto w-full max-w-2xl rounded-2xl bg-white p-2 shadow-2xl">
            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="text"
                    placeholder="Search services... e.g. GST Registration, Trademark, ITR Filing"
                    className="w-full rounded-xl px-4 py-3 text-sm text-gray-700 outline-none sm:rounded-l-xl"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowResults(e.target.value.length > 1);
                    }}
                />
                <button type="submit" className="w-full rounded-xl bg-[#1A56DB] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 sm:w-auto">Search</button>
            </div>

            {showResults && filtered.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mx-auto mt-2 w-full max-w-2xl overflow-y-auto rounded-2xl bg-white text-left shadow-2xl">
                    {filtered.slice(0, 6).map((service) => (
                        <button
                            key={service.slug}
                            type="button"
                            onClick={() => navigate(`/services/${service.slug}`)}
                            className="flex w-full items-center justify-between border-b border-gray-50 px-5 py-3 text-left transition-colors hover:bg-blue-50"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-800">{service.name}</p>
                                <p className="text-xs text-gray-400">{service.category}</p>
                            </div>
                            <span className="text-sm font-semibold text-[#1A56DB]">₹{service.basePrice?.toLocaleString("en-IN") || '—'}</span>
                        </button>
                    ))}
                </div>
            )}
        </form>
    );
}
