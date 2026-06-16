import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUserContext } from '../../../shared/context/UserContext';

const defaultUser = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  
};

export default function ProfileCard() {
  const { getToken } = useAuth();
  const [user, setUser] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...defaultUser });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { profile, profileLoading } = useUserContext();

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setUser(profile);
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update initials when name changes
  useEffect(() => {
    const initials = user.firstName + " " + user.lastName;
    setUser(prev => ({ ...prev, initials }));
  }, [user.firstName, user.lastName]);

  const handleSave = (e) => {
    e.preventDefault(); 
    setUser({ ...formData });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

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
        <div className="w-20 h-20 rounded-full bg-[#1A56DB] text-white text-3xl font-extrabold flex items-center justify-center shadow-md select-none">
          {user.initials}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">
              {user.name}
            </h3>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-150">
              Enterprise Client
            </span>
          </div>
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
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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


          </div>

          <div className="pt-4 flex gap-2 justify-end border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all min-h-11 sm:min-h-[unset]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all min-h-11 sm:min-h-[unset]"
            >
              Save Changes
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
              {user.phone}
            </span>
          </div>




        </div>
      )}

    </div>
  );
}
