import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useUserContext } from '../../../shared/context/UserContext';

export default function ProfileCard({ ordersCount = 0 }) {
  const { user: clerkUser, isLoaded } = useUser();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const { profile, fetchProfile, syncUserToBackend } = useUserContext();

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile && isLoaded && clerkUser) {
      const mergedProfile = {
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || clerkUser.fullName || "Client User",
        firstName: profile.firstName || clerkUser.firstName || "",
        lastName: profile.lastName || clerkUser.lastName || "",
        email: profile.email || clerkUser.primaryEmailAddress?.emailAddress || "",
        phone: profile.phone || clerkUser.unsafeMetadata?.phoneNumber || clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
        businessName: clerkUser.unsafeMetadata?.businessName || "",
        businessType: clerkUser.unsafeMetadata?.businessType || "Sole Proprietorship",
        gstNumber: clerkUser.unsafeMetadata?.gstNumber || "",
        panNumber: clerkUser.unsafeMetadata?.panNumber || "",
        memberSince: clerkUser.createdAt
          ? new Date(clerkUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : "January 2024",
        totalOrders: ordersCount,
        initials: (profile.firstName?.[0] || clerkUser.firstName?.[0] || "") + (profile.lastName?.[0] || clerkUser.lastName?.[0] || "") || "CU",
      };
      setUser(mergedProfile);
      setFormData(mergedProfile);
    }
  }, [profile, isLoaded, clerkUser, ordersCount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!clerkUser) return;
    setSaving(true);
    try {
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Update Clerk user details and unsafeMetadata
      await clerkUser.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...clerkUser.unsafeMetadata,
          phoneNumber: formData.phone,
          businessName: formData.businessName,
          businessType: formData.businessType,
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
        },
      });

      // Synchronize with the backend User database in MongoDB using context sync
      await syncUserToBackend({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
      });

      // Refresh local user profile context from database
      await fetchProfile();

      setUser({ ...formData, initials: (firstName[0] || "") + (lastName[0] || "") });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl mx-auto space-y-6">

      {/* Save Toast notification */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white font-semibold text-xs py-3.5 px-5 rounded-2xl shadow-xl z-50 animate-fade-in flex items-center gap-2">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Header Profile Area */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 pb-6 border-b border-gray-100">
        <div className="w-20 h-20 rounded-full bg-[#1A56DB] text-white text-3xl font-extrabold flex items-center justify-center shadow-md select-none animate-fade-in">
          {user.initials}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
            <h3 className="text-xl font-bold text-gray-900">
              {user.name}
            </h3>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-150">
              Enterprise Client
            </span>
          </div>
          {user.businessName && (
            <p className="text-sm font-semibold text-gray-500">
              {user.businessName}
            </p>
          )}
          <p className="text-xs text-gray-400">
            Member Since: {user.memberSince} • Total Orders: <span className="font-semibold text-gray-700">{user.totalOrders}</span>
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="border border-[#1A56DB] text-[#1A56DB] hover:bg-blue-50 font-bold text-xs py-2 px-5 rounded-full cursor-pointer transition-all min-h-11 sm:min-h-[unset] flex items-center justify-center"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Profile Details Area */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Entity Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership Firm">Partnership Firm</option>
                <option value="Private Limited Company">Private Limited Company</option>
                <option value="One Person Company (OPC)">One Person Company (OPC)</option>
                <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">GSTIN Details</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate PAN</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          <div className="pt-4 flex gap-2 justify-end border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-100 hover:bg-gray-250 disabled:opacity-50 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all min-h-11 sm:min-h-[unset]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all min-h-11 sm:min-h-[unset]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        /* Read-only details grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Email Address
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {user.email}
            </span>
          </div>

          <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Phone Number
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {user.phone || 'Not Provided'}
            </span>
          </div>

          <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Business Type
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {user.businessType}
            </span>
          </div>

          <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              GSTIN Details
            </span>
            <span className="text-sm font-bold text-gray-800 tracking-wide">
              {user.gstNumber || 'Not Provided'}
            </span>
          </div>

          <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Corporate PAN
            </span>
            <span className="text-sm font-bold text-gray-800 tracking-wide">
              {user.panNumber || 'Not Provided'}
            </span>
          </div>

          <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Member Account Created
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {user.memberSince}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
