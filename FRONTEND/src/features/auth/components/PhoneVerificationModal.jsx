import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { m, AnimatePresence } from "framer-motion";
import { useUserContext } from "../../../shared/context/UserContext";

export default function PhoneVerificationModal({ isOpen, onClose, onSuccess }) {
  const { user } = useUser();
  const { syncUserToBackend } = useUserContext();
  
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [phoneResource, setPhoneResource] = useState(null);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

      // Create a phone number resource
      const resource = await user.createPhoneNumber({ phoneNumber: formattedPhone });
      
      // Send the SMS verification code
      await resource.prepareVerification();
      
      setPhoneResource(resource);
      setStep("otp");
    } catch (err) {
      console.error("Clerk send code failure:", err);
      
      // If phone number is already taken by the same user or exists in verified state
      if (err.message?.includes("already exists") || err.message?.includes("taken") || err.errors?.[0]?.code === "form_identifier_exists") {
        try {
          // Attempt to locate if it's already on the user's phoneNumbers list
          const existingPhone = user.phoneNumbers.find(p => p.phoneNumber === (phone.startsWith("+") ? phone : `+91${phone}`));
          if (existingPhone && existingPhone.verification.status === "verified") {
            // Already verified, sync and bypass
            const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
                phoneNumber: formattedPhone,
              },
            });
            await syncUserToBackend({
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.primaryEmailAddress?.emailAddress || "",
              phone: formattedPhone,
            });
            onSuccess();
            return;
          }
        } catch (innerErr) {
          console.error("Inner bypass failure:", innerErr);
        }
      }
      
      setError(err.message || "Failed to send verification code. Check if the number is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!phoneResource) {
        throw new Error("Verification session not found. Please start over.");
      }

      const verifiedResource = await phoneResource.attemptVerification({ code });
      
      if (verifiedResource.verification.status !== "verified") {
        throw new Error("Verification status failed. Please enter the correct OTP.");
      }

      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

      // Store phone number reference in user unsafeMetadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phoneNumber: formattedPhone,
        },
      });

      // Sync verified phone number to backend User database in MongoDB
      await syncUserToBackend({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: formattedPhone,
      });

      onSuccess();
    } catch (err) {
      console.error("Clerk verify code failure:", err);
      setError(err.message || "Invalid verification code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setCode("");
    setPhoneResource(null);
    setError("");
  };

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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Verify Your Phone Number
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We require phone verification to process your compliance filings and keep you updated.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {step === "phone" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3.5 text-gray-505 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#1A56DB] focus:ring-2 focus:ring-blue-150 transition-all bg-gray-50/50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full rounded-xl bg-[#1A56DB] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer min-h-11 flex items-center justify-center"
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Enter SMS OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit verification code"
                    className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-center font-bold tracking-[0.5em] outline-none focus:border-[#1A56DB] focus:ring-2 focus:ring-blue-150 transition-all bg-gray-50/50"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    disabled={loading}
                    className="flex-1 rounded-xl border border-gray-250 bg-white text-gray-700 font-semibold text-xs py-3 hover:bg-gray-50 transition-all cursor-pointer min-h-11"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="flex-1 rounded-xl bg-[#1A56DB] text-white font-bold text-xs uppercase tracking-wider py-3 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer min-h-11"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </div>
              </form>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
