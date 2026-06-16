import { useNavigate } from 'react-router-dom';
import ServiceIcon from '../../../shared/components/icons/ServiceIcon.jsx';

export default function ServiceCard({ service }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/services/${service.slug}`)}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-6 w-full h-[260px] flex flex-col justify-between"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1A56DB] via-blue-500 to-cyan-400" />
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1A56DB] ring-1 ring-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <ServiceIcon name={service.icon} />
                </div>
                {service.tag ? (
                    <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-700">
                        {service.tag}
                    </span>
                ) : (
                    <span className="h-7" />
                )}
            </div>
            <div className="space-y-2 flex-1">
                <p className="text-base font-semibold leading-snug text-gray-900 sm:text-lg line-clamp-1">{service.name}</p>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{service.description}</p>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Starting at</p>
                    <p className="mt-1 text-xl font-bold text-[#1A56DB]">₹{service.price}{service.billingCycle === "Fixed" ? "" : "/" + service.billingCycle}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors group-hover:text-[#1A56DB]">
                    View details
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M13 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </button>
    );
}
