import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

export default function PartnershipDeedPayment({ deedId, amount = 999, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to proceed.");
        setLoading(false);
        return;
      }

      // Step 1: Request backend to create Razorpay Order for this deed
      const orderRes = await axios.post(
        `${API_BASE}/api/partnership-deed/${deedId}/pay`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to initiate payment");
      }

      const { order, keyId } = orderRes.data;

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // Step 3: Trigger Razorpay checkout modal
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "FilingBy",
        description: "Partnership Deed Generation Fee",
        order_id: order.id,
        handler: async function (response) {
          setLoading(true);
          try {
            // Step 4: Verify payment in backend
            const verifyRes = await axios.post(
              `${API_BASE}/api/partnership-deed/${deedId}/pay`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful! Partnership Deed unlocked.");
              onSuccess(verifyRes.data.deed);
            } else {
              throw new Error(verifyRes.data.message || "Verification failed");
            }
          } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#1A56DB" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handleBypassPayment = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to proceed.");
        setLoading(false);
        return;
      }

      const toastId = toast.loading("Bypassing payment and generating PDF...");
      const timestamp = Date.now();
      const verifyRes = await axios.post(
        `${API_BASE}/api/partnership-deed/${deedId}/pay`,
        {
          razorpay_order_id: `mock_order_${timestamp}`,
          razorpay_payment_id: `mock_payment_${timestamp}`,
          razorpay_signature: `mock_signature_${timestamp}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.dismiss(toastId);
      if (verifyRes.data.success) {
        toast.success("Payment bypassed successfully (Test Mode)!");
        onSuccess(verifyRes.data.deed);
      } else {
        throw new Error(verifyRes.data.message || "Bypass failed");
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || err.message || "Payment bypass failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1A56DB] flex items-center justify-center mx-auto text-xl">
        💳
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Purchase Partnership Deed</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Unlock standard high-quality PDF downloads of your legal partnership deed for a one-time filing fee of ₹{amount}.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="px-8 py-3 bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
              Processing...
            </>
          ) : (
            `Unlock & Generate PDF (₹${amount})`
          )}
        </button>

        {window.location.hostname === "localhost" && (
          <button
            onClick={handleBypassPayment}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-750 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            ⚙️ Bypass Payment (Test)
          </button>
        )}
      </div>
    </div>
  );
}
