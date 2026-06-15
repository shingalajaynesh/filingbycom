import { useState } from 'react';
import ServiceCard from './ServiceCard.jsx';
import { useSharedData } from '../../../shared/context/SharedDataContext';

export default function PopularServices() {
    const { services, loading } = useSharedData();
    const [showAll, setShowAll] = useState(false);

    const popularServices = services ? services.filter(s => s.isPopular === true && s.isActive !== false) : [];

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-screen-xl">
                <div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
                        <p className="mt-1 text-sm text-gray-500">Most ordered services by Indian businesses</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
                    </div>
                ) : popularServices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No services currently available.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                            {(showAll ? popularServices : popularServices.slice(0, 8)).map((service) => (
                                <ServiceCard key={service._id || service.slug} service={{...service, price: service.basePrice}} />
                            ))}
                        </div>
                        {popularServices.length > 8 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="border-2 border-[#1A56DB] text-[#1A56DB] rounded-full px-8 py-2.5 font-bold text-sm hover:bg-blue-50 transition-all cursor-pointer active:scale-95"
                                >
                                    {showAll ? "Show Less" : "Show All Services"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
