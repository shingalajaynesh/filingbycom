import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function PhoneVerificationModal({ isOpen, onClose, onSuccess }) {
  const { user } = useUser();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter Code
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneResource, setPhoneResource] = useState(null);

  if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Ensure phone starts with country code
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      
      const resource = await user.createPhoneNumber({ phoneNumber: formattedPhone });
      await resource.prepareVerification();
      
      setPhoneResource(resource);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Failed to send verification code. Ensure phone number is valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const verified = await phoneResource.attemptVerification({ code });
      if (verified.verification.status === "verified") {
        onSuccess();
      } else {
        setError("Invalid verification code.");
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {step === 1 ? "Verify Your Phone Number" : "Enter Verification Code"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === 1 
            ? "We need your phone number to proceed with the service request and keep you updated." 
            : `A verification code was sent to ${phone}.`}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 ? (
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
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#1A56DB] focus:ring-[#1A56DB] sm:text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 4}
              className="w-full rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
