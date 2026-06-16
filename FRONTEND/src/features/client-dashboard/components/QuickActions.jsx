import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: "📋", label: "New GST Filing", color: "bg-green-50 hover:bg-green-100/80 text-green-700 border-green-100", tab: null, slug: "gst-registration" },
  { icon: "💰", label: "File ITR", color: "bg-blue-50 hover:bg-blue-100/80 text-blue-700 border-blue-100", tab: null, slug: "itr-1-filing" },
  { icon: "🏢", label: "Register Company", color: "bg-purple-50 hover:bg-purple-100/80 text-purple-700 border-purple-100", tab: null, slug: "private-limited-company" },
  { icon: "™️", label: "Trademark", color: "bg-orange-50 hover:bg-orange-100/80 text-orange-700 border-orange-100", tab: null, slug: "trademark-registration" },
  { icon: "📁", label: "Upload Docs", color: "bg-yellow-50 hover:bg-yellow-100/80 text-yellow-800 border-yellow-100", tab: "documents", slug: null },
  { icon: "🎧", label: "Get Support", color: "bg-red-50 hover:bg-red-100/80 text-red-700 border-red-100", tab: "support", slug: null },
];

export default function QuickActions({ onNavigate }) {
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if (action.slug) {
      navigate(`/services/${action.slug}`);
    } else if (action.tab === 'documents') {
      window.open("https://wa.me/917567126945", "_blank");
    } else if (action.tab && onNavigate) {
      onNavigate(action.tab);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 text-sm sm:text-base">
        Quick Services & Actions
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleActionClick(action)}
            className={`${action.color} border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-95 hover:shadow-md cursor-pointer min-h-24`}
          >
            <span className="text-2xl sm:text-3xl filter drop-shadow-sm select-none">
              {action.icon}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-center leading-tight tracking-wide">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
