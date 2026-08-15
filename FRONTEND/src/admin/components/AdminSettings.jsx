import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { isValidImageUrl, optimizeCloudinaryUrl } from "../../shared/utils/cloudinary";

/**
 * Utility function to clean up raw image file names into human-readable brand or room titles.
 * E.g. "swiggy_brand_logo.png" -> "Swiggy"
 * E.g. "executive-meeting-room-1.jpg" -> "Executive Meeting Room 1"
 */
const cleanNameFromFileName = (fileName) => {
  if (!fileName) return "Item";
  // Remove file extension
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  // Replace underscores, dashes, dots, and common redundant keywords
  const clean = baseName
    .replace(/[-_.]+/g, " ")
    .replace(/\b(logo|brand|photo|image|office|workspace|img|pic|filingby|banner)\b/gi, "")
    .trim();
  // Capitalize words
  const words = (clean || baseName)
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ") || "Item";
};

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

  // Single Item Add States
  const [newLogo, setNewLogo] = useState({ name: "", imageUrl: "" });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ name: "", imageUrl: "" });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Bulk Upload States for Logos
  const [bulkUploadingLogos, setBulkUploadingLogos] = useState(false);
  const [bulkLogoProgress, setBulkLogoProgress] = useState({ current: 0, total: 0 });
  const [isDraggingLogos, setIsDraggingLogos] = useState(false);
  const bulkLogoInputRef = useRef(null);

  // Bulk Upload States for Office Photos
  const [bulkUploadingPhotos, setBulkUploadingPhotos] = useState(false);
  const [bulkPhotoProgress, setBulkPhotoProgress] = useState({ current: 0, total: 0 });
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const bulkPhotoInputRef = useRef(null);

  // Inline Editing State (id -> editing name)
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemName, setEditingItemName] = useState("");

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

  // ═════════════════════════════════════════════════════════════════
  // CLIENT LOGOS HANDLERS
  // ═════════════════════════════════════════════════════════════════

  const handleSingleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const toastId = toast.loading("Uploading logo to Cloudinary...");
    try {
      const res = await uploadImage(file);
      if (res.success && res.url) {
        setNewLogo(prev => ({ 
          ...prev, 
          imageUrl: res.url, 
          name: prev.name || cleanNameFromFileName(file.name) 
        }));
        toast.success("Logo uploaded successfully", { id: toastId });
      } else {
        toast.error(res.message || "Failed to upload logo", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading logo", { id: toastId });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddSingleLogo = () => {
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newLogo.name.trim(),
      imageUrl: newLogo.imageUrl
    };

    handleChange(key, [...currentList, newItem]);
    setNewLogo({ name: "", imageUrl: "" });
    const fileInput = document.getElementById("logo-file-picker");
    if (fileInput) fileInput.value = "";
    toast.success(`Added "${newItem.name}" to brand logos`);
  };

  // BULK UPLOAD LOGOS
  const handleBulkLogoFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith("image/"));
    if (!files.length) {
      toast.error("Please select valid image files (PNG, JPG, SVG, WEBP)");
      return;
    }

    setBulkUploadingLogos(true);
    setBulkLogoProgress({ current: 0, total: files.length });
    const toastId = toast.loading(`Uploading ${files.length} brand logo${files.length > 1 ? "s" : ""} in bulk...`);

    const newLogos = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const derivedName = cleanNameFromFileName(file.name);
      try {
        const res = await uploadImage(file);
        if (res.success && res.url) {
          newLogos.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 7)}`,
            name: derivedName,
            imageUrl: res.url
          });
          successCount++;
        } else {
          toast.error(`Failed to upload ${file.name}: ${res.message || "Error"}`);
        }
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        toast.error(`Error uploading ${file.name}`);
      }
      setBulkLogoProgress({ current: i + 1, total: files.length });
    }

    if (newLogos.length > 0) {
      const key = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
      const currentList = settings[key] || [];
      handleChange(key, [...currentList, ...newLogos]);
      toast.success(`Successfully uploaded and added ${successCount} brand logo${successCount > 1 ? "s" : ""}!`, { id: toastId });
    } else {
      toast.dismiss(toastId);
    }

    setBulkUploadingLogos(false);
    setBulkLogoProgress({ current: 0, total: 0 });
    if (bulkLogoInputRef.current) bulkLogoInputRef.current.value = "";
  };

  const handleRemoveLogo = (id) => {
    const key = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
    const currentList = settings[key] || [];
    const updatedList = currentList.filter(item => (item.id || item._id) !== id);
    handleChange(key, updatedList);
  };

  const handleClearAllLogos = () => {
    if (window.confirm("Are you sure you want to remove all configured brand logos?")) {
      const key = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
      handleChange(key, []);
      toast.success("All logos cleared");
    }
  };

  const handleMoveLogo = (index, direction) => {
    const key = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
    const currentList = [...(settings[key] || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIdx, 0, moved);
    handleChange(key, currentList);
  };

  // ═════════════════════════════════════════════════════════════════
  // OFFICE WORKSPACE PHOTOS HANDLERS
  // ═════════════════════════════════════════════════════════════════

  const handleSinglePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const toastId = toast.loading("Uploading photo to Cloudinary...");
    try {
      const res = await uploadImage(file);
      if (res.success && res.url) {
        setNewPhoto(prev => ({ 
          ...prev, 
          imageUrl: res.url,
          name: prev.name || cleanNameFromFileName(file.name)
        }));
        toast.success("Photo uploaded successfully", { id: toastId });
      } else {
        toast.error(res.message || "Failed to upload photo", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading photo", { id: toastId });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddSinglePhoto = () => {
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newPhoto.name.trim(),
      imageUrl: newPhoto.imageUrl
    };

    handleChange(key, [...currentList, newItem]);
    setNewPhoto({ name: "", imageUrl: "" });
    const fileInput = document.getElementById("photo-file-picker");
    if (fileInput) fileInput.value = "";
    toast.success(`Added "${newItem.name}" to workspace photos`);
  };

  // BULK UPLOAD OFFICE PHOTOS
  const handleBulkPhotoFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith("image/"));
    if (!files.length) {
      toast.error("Please select valid image files (PNG, JPG, WEBP)");
      return;
    }

    setBulkUploadingPhotos(true);
    setBulkPhotoProgress({ current: 0, total: files.length });
    const toastId = toast.loading(`Uploading ${files.length} workspace photo${files.length > 1 ? "s" : ""} in bulk...`);

    const newPhotos = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const derivedName = cleanNameFromFileName(file.name);
      try {
        const res = await uploadImage(file);
        if (res.success && res.url) {
          newPhotos.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 7)}`,
            name: derivedName,
            imageUrl: res.url
          });
          successCount++;
        } else {
          toast.error(`Failed to upload ${file.name}: ${res.message || "Error"}`);
        }
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        toast.error(`Error uploading ${file.name}`);
      }
      setBulkPhotoProgress({ current: i + 1, total: files.length });
    }

    if (newPhotos.length > 0) {
      const key = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
      const currentList = settings[key] || [];
      handleChange(key, [...currentList, ...newPhotos]);
      toast.success(`Successfully uploaded and added ${successCount} workspace photo${successCount > 1 ? "s" : ""}!`, { id: toastId });
    } else {
      toast.dismiss(toastId);
    }

    setBulkUploadingPhotos(false);
    setBulkPhotoProgress({ current: 0, total: 0 });
    if (bulkPhotoInputRef.current) bulkPhotoInputRef.current.value = "";
  };

  const handleRemovePhoto = (id) => {
    const key = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
    const currentList = settings[key] || [];
    const updatedList = currentList.filter(item => (item.id || item._id) !== id);
    handleChange(key, updatedList);
  };

  const handleClearAllPhotos = () => {
    if (window.confirm("Are you sure you want to remove all configured workspace photos?")) {
      const key = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
      handleChange(key, []);
      toast.success("All workspace photos cleared");
    }
  };

  const handleMovePhoto = (index, direction) => {
    const key = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
    const currentList = [...(settings[key] || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIdx, 0, moved);
    handleChange(key, currentList);
  };

  // ═════════════════════════════════════════════════════════════════
  // INLINE LABEL EDITING
  // ═════════════════════════════════════════════════════════════════

  const handleStartEditing = (item) => {
    setEditingItemId(item.id || item._id);
    setEditingItemName(item.name || "");
  };

  const handleSaveEditing = (key) => {
    if (!editingItemId) return;
    const currentList = settings[key] || [];
    const updated = currentList.map(item => {
      if ((item.id || item._id) === editingItemId) {
        return { ...item, name: editingItemName.trim() || item.name };
      }
      return item;
    });
    handleChange(key, updated);
    setEditingItemId(null);
    setEditingItemName("");
    toast.success("Label updated");
  };

  const handleCancelEditing = () => {
    setEditingItemId(null);
    setEditingItemName("");
  };

  // ═════════════════════════════════════════════════════════════════
  // SAVE FULL SETTINGS
  // ═════════════════════════════════════════════════════════════════

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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
        toast.success("Settings & Photos saved successfully!");
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

  const currentLogosKey = portal === "ca-portal" ? "ca_client_logos" : "vs_client_logos";
  const currentPhotosKey = portal === "ca-portal" ? "ca_office_photos" : "vs_office_photos";
  const activeLogos = settings[currentLogosKey] || [];
  const activePhotos = settings[currentPhotosKey] || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Banner */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold mb-2">
            {portal === "ca-portal" ? "💼 CA Portal" : "🏢 Virtual Office"} Management
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {portal === "ca-portal" ? "CA Portal Configuration & Media" : "Virtual Space Configuration & Media"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure contact info, announcement texts, bulk client brand logos, and bulk office workspace photos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="px-6 py-2.5 bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save All Settings</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-8 max-w-4xl">
        {/* ═════════════════════════════════════════════════════════════════
            TEXT & CONTACT SETTINGS
        ═════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
            <span>⚙️</span> General & Contact Parameters
          </h3>

          {portal === "ca-portal" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CA Portal Announcement */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>

              {/* CA Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>

              {/* CA WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  WhatsApp Direct URL
                </label>
                <input
                  type="url"
                  value={settings.ca_whatsapp_url}
                  onChange={(e) => handleChange("ca_whatsapp_url", e.target.value)}
                  placeholder="e.g. https://wa.me/917567126945"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                  required
                />
              </div>

              {/* CA Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>

              {/* CA Physical Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VS Announcement */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>

              {/* VS Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>

              {/* VS WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  WhatsApp Direct URL
                </label>
                <input
                  type="url"
                  value={settings.vs_whatsapp_url}
                  onChange={(e) => handleChange("vs_whatsapp_url", e.target.value)}
                  placeholder="e.g. https://wa.me/917567126945"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A56DB] text-sm text-gray-900 bg-white"
                  required
                />
              </div>

              {/* VS Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>

              {/* VS Corporate Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
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
              </div>
            </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            SECTION 1: CLIENT BRAND LOGOS (BULK + SINGLE UPLOAD)
        ═════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-gray-200 pt-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <span>🛡️</span> Client Brand Logos
                </h3>
                <span className="bg-blue-100 text-[#1A56DB] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {activeLogos.length} configured
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Displays in the scrolling ticker on the homepage and landing pages. Transparent PNG logos with low heights look best.
              </p>
            </div>

            {activeLogos.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllLogos}
                className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer self-start sm:self-auto"
              >
                Clear All Logos
              </button>
            )}
          </div>

          {/* BULK UPLOAD DROPZONE FOR LOGOS */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingLogos(true); }}
            onDragLeave={() => setIsDraggingLogos(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingLogos(false);
              handleBulkLogoFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDraggingLogos 
                ? "border-[#1A56DB] bg-blue-50/60 scale-[1.01]" 
                : "border-blue-200 bg-blue-50/20 hover:bg-blue-50/40 hover:border-blue-300"
            }`}
          >
            <input
              type="file"
              id="bulk-logo-file-picker"
              ref={bulkLogoInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleBulkLogoFiles(e.target.files)}
              disabled={bulkUploadingLogos}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-[#1A56DB] flex items-center justify-center text-2xl shadow-inner">
                {bulkUploadingLogos ? "⏳" : "📁"}
              </div>

              {bulkUploadingLogos ? (
                <div className="w-full max-w-xs space-y-2">
                  <p className="text-xs font-bold text-gray-800">
                    Uploading {bulkLogoProgress.current} of {bulkLogoProgress.total} logos...
                  </p>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1A56DB] transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.round((bulkLogoProgress.current / (bulkLogoProgress.total || 1)) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Please wait while files upload to Cloudinary</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Bulk Upload Multiple Brand Logos
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Drag &amp; drop multiple logo image files here, or click below to select all at once.
                    </p>
                    <p className="text-[11px] text-blue-600 font-medium mt-1">
                      💡 Brand names are automatically extracted from filenames and can be edited anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => bulkLogoInputRef.current?.click()}
                    disabled={bulkUploadingLogos}
                    className="px-5 py-2.5 bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>⚡ Choose Multiple Logo Files</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Current Logos Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Configured Logos ({activeLogos.length})
            </h4>

            {activeLogos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
                {activeLogos.map((logo, idx) => {
                  const logoId = logo.id || logo._id || `logo-${idx}`;
                  const isEditing = editingItemId === logoId;

                  return (
                    <div
                      key={logoId}
                      className="relative group bg-white border border-gray-200 p-3 rounded-xl flex flex-col items-center justify-between hover:shadow-md transition-all h-36"
                    >
                      {/* Move buttons & Delete button */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveLogo(idx, -1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1 transition-all cursor-pointer shadow-sm text-[10px]"
                            title="Move Left"
                          >
                            ◀
                          </button>
                        )}
                        {idx < activeLogos.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveLogo(idx, 1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1 transition-all cursor-pointer shadow-sm text-[10px]"
                            title="Move Right"
                          >
                            ▶
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveLogo(logoId)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-all cursor-pointer opacity-90 hover:opacity-100"
                          title="Remove Logo"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="h-14 flex items-center justify-center w-full mt-2">
                        {isValidImageUrl(logo.imageUrl) ? (
                          <img
                            src={optimizeCloudinaryUrl(logo.imageUrl)}
                            alt={logo.name}
                            className="h-full object-contain max-w-[110px]"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>

                      {/* Label with Inline Edit */}
                      <div className="w-full mt-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingItemName}
                              onChange={(e) => setEditingItemName(e.target.value)}
                              className="w-full text-[11px] font-bold px-1.5 py-0.5 border border-blue-400 rounded outline-none bg-blue-50/50"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEditing(currentLogosKey);
                                if (e.key === "Escape") handleCancelEditing();
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditing(currentLogosKey)}
                              className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer font-bold"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditing}
                              className="bg-gray-400 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-1 group/name">
                            <span
                              className="text-[11px] font-bold text-gray-800 truncate cursor-pointer hover:text-blue-600"
                              onClick={() => handleStartEditing(logo)}
                              title="Click to rename"
                            >
                              {logo.name || "Unnamed"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditing(logo)}
                              className="text-[10px] text-gray-400 hover:text-blue-600 opacity-0 group-hover/name:opacity-100 transition-opacity cursor-pointer shrink-0"
                              title="Rename"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-400 font-medium">
                No custom brand logos added. The site is currently using default brand logos.
              </div>
            )}
          </div>

          {/* Single Logo Add (Optional Helper) */}
          <details className="bg-slate-50 border border-gray-200 rounded-xl p-4 transition-all">
            <summary className="text-xs font-bold text-gray-700 uppercase cursor-pointer hover:text-blue-600 select-none">
              + Or Add a Single Logo with Custom Name
            </summary>
            <div className="mt-4 space-y-4">
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
                    onChange={handleSingleLogoUpload}
                    disabled={uploadingLogo}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                  />
                </div>
              </div>

              {isValidImageUrl(newLogo.imageUrl) && (
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-150 w-fit">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Uploaded Preview:</span>
                  <div className="h-8 max-w-[120px] flex items-center justify-center">
                    <img src={optimizeCloudinaryUrl(newLogo.imageUrl)} alt="Preview" className="h-full object-contain" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddSingleLogo}
                disabled={uploadingLogo || !newLogo.name.trim() || !newLogo.imageUrl}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                + Add Single Logo
              </button>
            </div>
          </details>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            SECTION 2: OFFICE WORKSPACE PHOTOS (BULK + SINGLE UPLOAD)
        ═════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-gray-200 pt-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <span>🏢</span> Office Workspace Photos
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {activePhotos.length} configured
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Displays in the auto-scrolling workspace gallery on the homepage and virtual office showcase. High-resolution horizontal photos (16:9 or 4:3) look best.
              </p>
            </div>

            {activePhotos.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllPhotos}
                className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer self-start sm:self-auto"
              >
                Clear All Photos
              </button>
            )}
          </div>

          {/* BULK UPLOAD DROPZONE FOR WORKSPACE PHOTOS */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingPhotos(true); }}
            onDragLeave={() => setIsDraggingPhotos(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingPhotos(false);
              handleBulkPhotoFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDraggingPhotos 
                ? "border-emerald-500 bg-emerald-50/60 scale-[1.01]" 
                : "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-300"
            }`}
          >
            <input
              type="file"
              id="bulk-photo-file-picker"
              ref={bulkPhotoInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleBulkPhotoFiles(e.target.files)}
              disabled={bulkUploadingPhotos}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center text-2xl shadow-inner">
                {bulkUploadingPhotos ? "⏳" : "🖼️"}
              </div>

              {bulkUploadingPhotos ? (
                <div className="w-full max-w-xs space-y-2">
                  <p className="text-xs font-bold text-gray-800">
                    Uploading {bulkPhotoProgress.current} of {bulkPhotoProgress.total} workspace photos...
                  </p>
                  <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.round((bulkPhotoProgress.current / (bulkPhotoProgress.total || 1)) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Please wait while photos upload to Cloudinary</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Bulk Upload Multiple Office Workspace Photos
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Drag &amp; drop multiple workspace photos here, or click below to select all at once.
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      💡 Room &amp; workspace titles are automatically generated from filenames and can be edited anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => bulkPhotoInputRef.current?.click()}
                    disabled={bulkUploadingPhotos}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>⚡ Choose Multiple Photo Files</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Current Photos Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Configured Workspace Photos ({activePhotos.length})
            </h4>

            {activePhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
                {activePhotos.map((photo, idx) => {
                  const photoId = photo.id || photo._id || `photo-${idx}`;
                  const isEditing = editingItemId === photoId;

                  return (
                    <div
                      key={photoId}
                      className="relative group bg-white border border-gray-200 p-2.5 rounded-2xl flex flex-col items-center justify-between hover:shadow-md transition-all h-48 overflow-hidden"
                    >
                      {/* Move buttons & Delete button */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, -1)}
                            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-all cursor-pointer shadow-sm text-[10px]"
                            title="Move Left"
                          >
                            ◀
                          </button>
                        )}
                        {idx < activePhotos.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, 1)}
                            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-all cursor-pointer shadow-sm text-[10px]"
                            title="Move Right"
                          >
                            ▶
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photoId)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-all cursor-pointer opacity-90 hover:opacity-100"
                          title="Remove Photo"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Photo Thumbnail */}
                      <div className="h-28 flex items-center justify-center w-full rounded-xl overflow-hidden bg-gray-100">
                        {isValidImageUrl(photo.imageUrl) ? (
                          <img
                            src={optimizeCloudinaryUrl(photo.imageUrl)}
                            alt={photo.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>

                      {/* Label with Inline Edit */}
                      <div className="w-full mt-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingItemName}
                              onChange={(e) => setEditingItemName(e.target.value)}
                              className="w-full text-[11px] font-bold px-1.5 py-0.5 border border-emerald-400 rounded outline-none bg-emerald-50/50"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEditing(currentPhotosKey);
                                if (e.key === "Escape") handleCancelEditing();
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditing(currentPhotosKey)}
                              className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer font-bold"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditing}
                              className="bg-gray-400 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-1 group/name">
                            <span
                              className="text-[11px] font-bold text-gray-800 truncate cursor-pointer hover:text-emerald-700"
                              onClick={() => handleStartEditing(photo)}
                              title="Click to rename"
                            >
                              {photo.name || "Unnamed Room"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditing(photo)}
                              className="text-[10px] text-gray-400 hover:text-emerald-700 opacity-0 group-hover/name:opacity-100 transition-opacity cursor-pointer shrink-0"
                              title="Rename"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-400 font-medium">
                No custom workspace photos added. The site is currently using default office photos.
              </div>
            )}
          </div>

          {/* Single Photo Add (Optional Helper) */}
          <details className="bg-slate-50 border border-gray-200 rounded-xl p-4 transition-all">
            <summary className="text-xs font-bold text-gray-700 uppercase cursor-pointer hover:text-emerald-700 select-none">
              + Or Add a Single Photo with Custom Title
            </summary>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase block">Photo Label / Room Name</label>
                  <input
                    type="text"
                    value={newPhoto.name}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Modern Co-Working Lounge"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white text-gray-900 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase block">Office Image File</label>
                  <input
                    type="file"
                    id="photo-file-picker"
                    accept="image/*"
                    onChange={handleSinglePhotoUpload}
                    disabled={uploadingPhoto}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                  />
                </div>
              </div>

              {isValidImageUrl(newPhoto.imageUrl) && (
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-150 w-fit">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Uploaded Preview:</span>
                  <div className="h-16 w-24 overflow-hidden rounded-md flex items-center justify-center">
                    <img src={optimizeCloudinaryUrl(newPhoto.imageUrl)} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddSinglePhoto}
                disabled={uploadingPhoto || !newPhoto.name.trim() || !newPhoto.imageUrl}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                + Add Single Photo
              </button>
            </div>
          </details>
        </div>

        {/* Bottom Save Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Remember to click <strong>Save All Settings</strong> to write all your changes and uploaded media to the live site.
          </p>

          <button
            type="submit"
            disabled={submitting || bulkUploadingLogos || bulkUploadingPhotos}
            className="w-full sm:w-auto px-8 py-3 bg-[#1A56DB] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
