import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { m, AnimatePresence } from "framer-motion";
import { useUserContext } from "../../../shared/context/UserContext";

export default function PhoneVerificationModal({ isOpen, onClose, onSuccess }) {
  const { user } = useUser();
  const { syncUserToBackend } = useUserContext();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // We handle early return using AnimatePresence now
  // if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Ensure phone starts with country code
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      
      // Update user unsafeMetadata to save phone number
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phoneNumber: formattedPhone,
        },
      });

      // Synchronize with the backend User database in MongoDB
      await syncUserToBackend({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: formattedPhone,
      });
      
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save phone number.");
    } finally {
      setLoading(false);
    }
  };

  // handleVerifyCode removed since OTP verification is not used

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <m.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative"
          >
            <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Verify Your Phone Number
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          We need your phone number to proceed with the service request and keep you updated.
        </p>
 
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
 
        <form onSubmit={handleSendCode}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-gray-300 px-3 py-2 focus:border-[#1A56DB] focus:ring-[#1A56DB] sm:text-sm outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
