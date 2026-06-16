import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";

export default function AdminSettings({ portal }) {
  const { fetchAdminSettings, updateSettings } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Settings state dictionary
  const [settings, setSettings] = useState({
    ca_announcement_text: "🎉 Get 15% OFF | Code: FILING15",
    ca_contact_phone: "+91 75671 26945",
    ca_whatsapp_url: "https://wa.me/917567126945",
    ca_contact_email: "support@filingby.com",
    ca_contact_address: "3rd Floor, Business Center, New Delhi, India",
    vs_announcement_text: "🎉 Special Offer: Virtual Office starting at just ₹999/month — Limited slots!",
    vs_contact_phone: "+91 75671 26945",
    vs_whatsapp_url: "https://wa.me/917567126945",
    vs_contact_email: "support@filingby.com",
    vs_contact_address: "402-405 Compliance Center Hub, Adajan, Surat, Gujarat - 395009"
  });

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminSettings();
        if (data.success && data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings
          }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [fetchAdminSettings, portal]);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Build request body with batch settings update
      const payload = {
        settings: portal === "ca-portal" 
          ? {
              ca_announcement_text: settings.ca_announcement_text,
              ca_contact_phone: settings.ca_contact_phone,
              ca_whatsapp_url: settings.ca_whatsapp_url,
              ca_contact_email: settings.ca_contact_email,
              ca_contact_address: settings.ca_contact_address
            }
          : {
              vs_announcement_text: settings.vs_announcement_text,
              vs_contact_phone: settings.vs_contact_phone,
              vs_whatsapp_url: settings.vs_whatsapp_url,
              vs_contact_email: settings.vs_contact_email,
              vs_contact_address: settings.vs_contact_address
            }
      };

      const data = await updateSettings(payload);
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-150 rounded-2xl shadow-sm gap-4 min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-250 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">
          {portal === "ca-portal" ? "💼 CA Portal Configuration" : "🏢 Virtual Space Configuration"}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Customize contact links, announcement text, and display parameters. Changes are stored dynamically.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6 max-w-2xl">
        {portal === "ca-portal" ? (
          <>
            {/* CA Portal Announcement */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={settings.ca_announcement_text}
                onChange={(e) => handleChange("ca_announcement_text", e.target.value)}
                placeholder="e.g. 🎉 Get 15% OFF | Code: FILING15"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Visible at the very top of the CA portal header layout.
              </p>
            </div>

            {/* CA Portal Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Support Phone Number
              </label>
              <input
                type="text"
                value={settings.ca_contact_phone}
                onChange={(e) => handleChange("ca_contact_phone", e.target.value)}
                placeholder="e.g. +91 75671 26945"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Dynamic helpline phone number used globally in anchors and text labels.
              </p>
            </div>

            {/* CA Portal WhatsApp */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                WhatsApp API URL
              </label>
              <input
                type="url"
                value={settings.ca_whatsapp_url}
                onChange={(e) => handleChange("ca_whatsapp_url", e.target.value)}
                placeholder="e.g. https://wa.me/917567126945"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Full WhatsApp click-to-chat redirect link (including Country Code).
              </p>
            </div>

            {/* CA Portal Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Support Email Address
              </label>
              <input
                type="email"
                value={settings.ca_contact_email}
                onChange={(e) => handleChange("ca_contact_email", e.target.value)}
                placeholder="e.g. support@filingby.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Helpline/info email displayed in contact links and footer details.
              </p>
            </div>

            {/* CA Portal Physical Address */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Physical Office Address
              </label>
              <textarea
                value={settings.ca_contact_address}
                onChange={(e) => handleChange("ca_contact_address", e.target.value)}
                placeholder="e.g. 3rd Floor, Business Center, New Delhi, India"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white resize-none"
                rows="2"
                required
              />
              <p className="text-[11px] text-gray-400">
                Physical location text rendered in footer maps and corporate info.
              </p>
            </div>


          </>
        ) : (
          <>
            {/* VS Announcement */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={settings.vs_announcement_text}
                onChange={(e) => handleChange("vs_announcement_text", e.target.value)}
                placeholder="e.g. 🎉 Special Offer: Virtual Office starting at just ₹999/month!"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Visible at the top of the Virtual Office headers.
              </p>
            </div>

            {/* VS Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Support Phone Number
              </label>
              <input
                type="text"
                value={settings.vs_contact_phone}
                onChange={(e) => handleChange("vs_contact_phone", e.target.value)}
                placeholder="e.g. +91 75671 26945"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Support helpline number used in header labels and dial actions.
              </p>
            </div>

            {/* VS WhatsApp */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                WhatsApp API URL
              </label>
              <input
                type="url"
                value={settings.vs_whatsapp_url}
                onChange={(e) => handleChange("vs_whatsapp_url", e.target.value)}
                placeholder="e.g. https://wa.me/917567126945"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Full WhatsApp click-to-chat link for Virtual Space enquiries.
              </p>
            </div>

            {/* VS Support Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Support Email Address
              </label>
              <input
                type="email"
                value={settings.vs_contact_email}
                onChange={(e) => handleChange("vs_contact_email", e.target.value)}
                placeholder="e.g. support@filingby.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                required
              />
              <p className="text-[11px] text-gray-400">
                Support email for virtual office leasing questions and inquiries.
              </p>
            </div>

            {/* VS Corporate Address */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">
                Corporate Billed-By Address
              </label>
              <textarea
                value={settings.vs_contact_address}
                onChange={(e) => handleChange("vs_contact_address", e.target.value)}
                placeholder="e.g. 402-405 Compliance Center Hub, Adajan, Surat, Gujarat - 395009"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white resize-none"
                rows="2"
                required
              />
              <p className="text-[11px] text-gray-400">
                The address shown as the 'Billed By' vendor on the customer receipt invoice.
              </p>
            </div>
          </>
        )}

        <div className="border-t border-gray-100 pt-5 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#1A56DB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-blue-150 active:scale-98 cursor-pointer flex items-center gap-2"
          >
            {submitting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? "Saving changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
