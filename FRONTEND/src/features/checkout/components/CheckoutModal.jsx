import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { m, AnimatePresence } from "framer-motion";
import { useOrderContext } from "../../../shared/context/OrderContext";
import { trackEvent } from "../../../shared/utils/gtm";

export default function CheckoutModal({ isOpen, onClose, service, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const { createRazorpayOrder, verifyPayment, createCashOrder } = useOrderContext();

  useEffect(() => {
    if (isOpen && service) {
      trackEvent("checkout_start", {
        service_id: service._id,
        service_name: service.name,
        price: service.basePrice
      });
    }
  }, [isOpen, service]);

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

      // Create Razorpay Order via Backend
      const orderDataResponse = await createRazorpayOrder(service._id);
      
      const orderData = orderDataResponse?.order || orderDataResponse;
      const keyId = orderDataResponse?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      const res = await loadRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FilingBy",
        description: service.name,
        order_id: orderData.id,
        handler: async function (response) {
          // Verify payment
          try {
            const verifyData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              serviceId: service._id,
            });
            if (verifyData.success) {
              toast.success("Payment successful! Order placed.");
              trackEvent("payment_success", {
                service_id: service._id,
                service_name: service.name,
                price: service.basePrice,
                payment_method: "online_razorpay",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id
              });
              onSuccess();
            } else {
              throw new Error(verifyData.message);
            }
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
            trackEvent("payment_failed", {
              service_id: service._id,
              service_name: service.name,
              price: service.basePrice,
              payment_method: "online_razorpay",
              error_message: err.message || "Payment verification failed"
            });
          }
        },
        theme: { color: "#1A56DB" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        trackEvent("payment_failed", {
          service_id: service._id,
          service_name: service.name,
          price: service.basePrice,
          payment_method: "online_razorpay",
          error_message: response.error.description || "Razorpay gateway payment failed"
        });
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

      const data = await createCashOrder(service._id);
      if (data.success) {
        toast.success("Order placed successfully! You can pay by cash later.");
        trackEvent("payment_success", {
          service_id: service._id,
          service_name: service.name,
          price: service.basePrice,
          payment_method: "cash"
        });
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
