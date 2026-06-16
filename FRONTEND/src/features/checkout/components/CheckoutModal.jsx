import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { m, AnimatePresence } from "framer-motion";
import { safeFetch } from "../../../shared/utils/api";

export default function CheckoutModal({ isOpen, onClose, service, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  // We handle early return using AnimatePresence now
  // if (!isOpen || !service) return null;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayOnline = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to proceed.");
        setLoading(false);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey === "test_key" || razorpayKey.includes("placeholder")) {
        // Run simulated payment for local development
        const loadingToast = toast.loading("Simulating online payment...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        try {
          const verifyData = await safeFetch("/orders/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: "order_mock_" + Date.now(),
              razorpay_payment_id: "pay_mock_" + Date.now(),
              razorpay_signature: "mock_signature",
              serviceId: service._id,
            }),
          });
          toast.dismiss(loadingToast);
          if (verifyData.success) {
            toast.success("Simulated payment successful! Order placed.");
            onSuccess();
          } else {
            throw new Error(verifyData.message);
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error(err.message || "Payment verification failed");
        }
        return;
      }

      const res = await loadRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // Create Razorpay Order via Backend
      const orderData = await safeFetch("/orders/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ serviceId: service._id }),
      });
      if (!orderData.success) throw new Error(orderData.message);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "test_key", // Will fallback if backend handles validation mostly
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "FilingBy",
        description: service.name,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify payment
          try {
            const activeToken = await getToken();
            const verifyData = await safeFetch("/orders/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeToken}`,
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                serviceId: service._id,
              }),
            });
            if (verifyData.success) {
              toast.success("Payment successful! Order placed.");
              onSuccess();
            } else {
              throw new Error(verifyData.message);
            }
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
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
      toast.error(error.message || "Failed to initiate online payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePayCash = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to proceed.");
        setLoading(false);
        return;
      }

      const data = await safeFetch("/orders/cash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ serviceId: service._id }),
      });
      if (data.success) {
        toast.success("Order placed successfully! You can pay by cash later.");
        onSuccess();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to place cash order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && service && (
        <m.div 
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <m.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative text-center"
          >
            <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          ✕
        </button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1A56DB]">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Request</h2>
        <p className="text-sm text-gray-500 mb-6">
          You are requesting <strong>{service.name}</strong> for ₹{service.basePrice}. Please select your preferred payment method.
        </p>
 
        <div className="space-y-3">
          <button
            onClick={handlePayOnline}
            disabled={loading}
            className="w-full rounded-xl bg-[#1A56DB] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Pay Online Now"}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-gray-500">OR</span>
            </div>
          </div>
 
          <button
            onClick={handlePayCash}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Pay Cash Later"}
          </button>
        </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
