import ServiceCard from './ServiceCard.jsx';
import { popularServices } from '../data/services.js';

export default function PopularServices() {
    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-screen-xl">
                <div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
                        <p className="mt-1 text-sm text-gray-500">Most ordered services by Indian businesses</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {popularServices.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
