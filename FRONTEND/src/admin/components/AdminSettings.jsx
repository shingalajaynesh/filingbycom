import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";

export default function AdminSettings({ portal }) {
  const { fetchAdminSettings, updateSettings, uploadImage } = useAdminContext();
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
    vs_contact_address: "402-405 Compliance Center Hub, Adajan, Surat, Gujarat - 395009",
    ca_client_logos: [],
    vs_client_logos: [],
    ca_office_photos: [],
    vs_office_photos: []
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

  const [newLogo, setNewLogo] = useState({ name: "", imageUrl: "" });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [newPhoto, setNewPhoto] = useState({ name: "", imageUrl: "" });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const toastId = toast.loading("Uploading photo to Cloudinary...");
    try {
      const res = await uploadImage(file);
      if (res.success) {
        setNewPhoto(prev => ({ ...prev, imageUrl: res.url }));
        toast.success("Photo uploaded successfully");
      } else {
        toast.error(res.message || "Failed to upload photo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading photo");
    } finally {
      setUploadingPhoto(false);
      toast.dismiss(toastId);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhoto.name.trim()) {
      toast.error("Please enter a photo label/name");
      return;
    }
    if (!newPhoto.imageUrl) {
      toast.error("Please upload a photo");
      return;
    }

    const key = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
    const currentList = settings[key] || [];
    
    const newItem = {
      id: Date.now().toString(),
      name: newPhoto.name.trim(),
      imageUrl: newPhoto.imageUrl
    };

    handleChange(key, [...currentList, newItem]);
    setNewPhoto({ name: "", imageUrl: "" });
    const fileInput = document.getElementById("photo-file-picker");
    if (fileInput) fileInput.value = "";
  };

  const handleRemovePhoto = (id) => {
    const key = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
    const currentList = settings[key] || [];
    const updatedList = currentList.filter(item => item.id !== id);
    handleChange(key, updatedList);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const toastId = toast.loading("Uploading logo to Cloudinary...");
    try {
      const res = await uploadImage(file);
      if (res.success) {
        setNewLogo(prev => ({ ...prev, imageUrl: res.url }));
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(res.message || "Failed to upload logo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading logo");
    } finally {
      setUploadingLogo(false);
      toast.dismiss(toastId);
    }
  };

  const handleAddLogo = () => {
    if (!newLogo.name.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (!newLogo.imageUrl) {
      toast.error("Please upload a logo image");
      return;
    }

    const key = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
    const currentList = settings[key] || [];
    
    const newItem = {
      id: Date.now().toString(),
      name: newLogo.name.trim(),
      imageUrl: newLogo.imageUrl
    };

    handleChange(key, [...currentList, newItem]);
    setNewLogo({ name: "", imageUrl: "" });
    const fileInput = document.getElementById("logo-file-picker");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveLogo = (id) => {
    const key = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
    const currentList = settings[key] || [];
    const updatedList = currentList.filter(item => item.id !== id);
    handleChange(key, updatedList);
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
              ca_contact_address: settings.ca_contact_address,
              ca_client_logos: settings.ca_client_logos || [],
              ca_office_photos: settings.ca_office_photos || []
            }
          : {
              vs_announcement_text: settings.vs_announcement_text,
              vs_contact_phone: settings.vs_contact_phone,
              vs_whatsapp_url: settings.vs_whatsapp_url,
              vs_contact_email: settings.vs_contact_email,
              vs_contact_address: settings.vs_contact_address,
              vs_client_logos: settings.vs_client_logos || [],
              vs_office_photos: settings.vs_office_photos || []
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
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-2xl shadow-sm gap-4 min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300">
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

        {/* Dynamic Client Logos Management Section */}
        <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>🛡️</span> Client Brand Logos (Marquee Ticker)
          </h3>
          <p className="text-xs text-gray-500">
            Configure the brands displayed in the 'Trusted By' scrolling banner. Transparent PNG logos with low heights are recommended.
          </p>

          {/* Current Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {(portal === "ca-portal" ? settings.ca_client_logos : settings.vs_client_logos)?.length > 0 ? (
              (portal === "ca-portal" ? settings.ca_client_logos : settings.vs_client_logos).map((logo) => (
                <div key={logo.id} className="relative group bg-white border border-gray-200 p-3 rounded-lg flex flex-col items-center justify-center gap-2 hover:shadow-sm transition-all h-28">
                  <div className="h-10 flex items-center justify-center w-full">
                    <img src={logo.imageUrl} alt={logo.name} className="h-full object-contain max-w-[120px]" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 text-center truncate w-full">{logo.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLogo(logo.id)}
                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-all cursor-pointer opacity-90 hover:opacity-100"
                    title="Remove Logo"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-xs text-gray-400 font-medium">
                No custom client logos configured. Falling back to default brand list.
              </div>
            )}
          </div>

          {/* Add Logo Form */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase">Add New Client Logo</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase block">Brand Name</label>
                <input
                  type="text"
                  value={newLogo.name}
                  onChange={(e) => setNewLogo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Swiggy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase block">Logo Image File</label>
                <input
                  type="file"
                  id="logo-file-picker"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                />
              </div>
            </div>

            {newLogo.imageUrl && (
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-150 w-fit">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Uploaded Preview:</span>
                <div className="h-8 max-w-[120px] flex items-center justify-center">
                  <img src={newLogo.imageUrl} alt="Preview" className="h-full object-contain" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddLogo}
              disabled={uploadingLogo || !newLogo.name.trim() || !newLogo.imageUrl}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              + Add Logo to List
            </button>
          </div>
        </div>

        {/* Dynamic Office Photos Management Section */}
        <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>🏢</span> Office Workspace Photos (Auto-Scroll Section)
          </h3>
          <p className="text-xs text-gray-500">
            Configure the photos displayed in the 'Our Workspaces' auto-scrolling section of the homepage.
          </p>

          {/* Current Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {(portal === "ca-portal" ? settings.ca_office_photos : settings.vs_office_photos)?.length > 0 ? (
              (portal === "ca-portal" ? settings.ca_office_photos : settings.vs_office_photos).map((photo) => (
                <div key={photo.id} className="relative group bg-white border border-gray-200 p-2 rounded-lg flex flex-col items-center justify-center gap-2 hover:shadow-sm transition-all h-36">
                  <div className="h-20 flex items-center justify-center w-full overflow-hidden rounded-md">
                    <img src={photo.imageUrl} alt={photo.name} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 text-center truncate w-full px-1">{photo.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-all cursor-pointer opacity-90 hover:opacity-100"
                    title="Remove Photo"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-xs text-gray-400 font-medium">
                No office photos configured. Falling back to default office list.
              </div>
            )}
          </div>

          {/* Add Photo Form */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase">Add New Office Photo</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase block">Photo Label / Room Name</label>
                <input
                  type="text"
                  value={newPhoto.name}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Modern Co-Working Lounge"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase block">Office Image File</label>
                <input
                  type="file"
                  id="photo-file-picker"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                />
              </div>
            </div>

            {newPhoto.imageUrl && (
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-150 w-fit">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Uploaded Preview:</span>
                <div className="h-16 w-24 overflow-hidden rounded-md flex items-center justify-center">
                  <img src={newPhoto.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddPhoto}
              disabled={uploadingPhoto || !newPhoto.name.trim() || !newPhoto.imageUrl}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              + Add Photo to List
            </button>
          </div>
        </div>

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
