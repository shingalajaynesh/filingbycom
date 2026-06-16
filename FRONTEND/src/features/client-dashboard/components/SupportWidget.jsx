import { useSharedData } from '../../../shared/context/SharedDataContext';

export default function SupportWidget() {
  const { settings } = useSharedData();

  const contactOptions = [
    {
      title: "WhatsApp Chat",
      value: "Chat on WhatsApp",
      detail: "Get instant assistance",
      icon: "💬",
      color: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
      onClick: () => window.open(settings?.ca_whatsapp_url || 'https://wa.me/917567126945', '_blank')
    },
    {
      title: "Call Helpline",
      value: settings?.ca_contact_phone || "+91 75671 26945",
      detail: "Mon-Sat, 9AM to 7PM",
      icon: "📞",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
      onClick: () => window.open(`tel:${(settings?.ca_contact_phone || "+91 75671 26945").replace(/\s+/g, '')}`)
    },
    {
      title: "Email Support",
      value: settings?.ca_contact_email || "support@filingby.com",
      detail: "Response within 24 hours",
      icon: "✉️",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
      onClick: () => window.open(`mailto:${settings?.ca_contact_email || "support@filingby.com"}`)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
          Get in Touch Instantly
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactOptions.map((opt, i) => (
            <div
              key={i}
              onClick={opt.onClick}
              className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col items-start text-left ${opt.color}`}
            >
              <span className="text-3xl mb-3">{opt.icon}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {opt.title}
              </p>
              <h4 className="font-bold text-sm sm:text-base mt-1">
                {opt.value}
              </h4>
              <p className="text-xs mt-1 opacity-75">
                {opt.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
