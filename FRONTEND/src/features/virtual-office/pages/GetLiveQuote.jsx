import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import SEO from "../../../shared/components/SEO.jsx";
import { trackEvent } from "../../../shared/utils/gtm";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { useOrderContext } from "../../../shared/context/OrderContext.jsx";

export default function GetLiveQuote() {
  const navigate = useNavigate();
  const { locations, submitQuoteLead } = useSharedData();
  const { createVirtualRazorpayOrder, verifyVirtualPayment } = useOrderContext();
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    city: "",
    purpose: "",
    businessType: "",
    name: "",
    email: "",
    mobile: "",
  });

  const [priceEstimate, setPriceEstimate] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const availableCities = locations && locations.length > 0
    ? locations.map(loc => ({ name: loc.name, slug: loc.slug }))
    : [
      { name: "Surat", slug: "surat" },
      { name: "Mumbai", slug: "mumbai" }
    ];

  const calculateQuote = async () => {
    let base = 999;
    if (formData.purpose === "incorporation") base = 1299;
    if (formData.purpose === "gst") base = 1199;

    // Add business type weight
    if (formData.businessType === "pvt-ltd") base += 200;
    if (formData.businessType === "llp") base += 100;

    // Add city specific weights
    const metroCities = ["mumbai", "delhi", "bangalore"];
    if (formData.city && metroCities.includes(formData.city.toLowerCase())) {
      base += 300;
    }

    setSubmitting(true);
    try {
      const data = await submitQuoteLead({
        ...formData,
        estimatedPrice: base,
      });
      if (data.success) {
        setPriceEstimate(base);
        setStep(3);
        trackEvent("generate_lead", {
          form_name: "live_quote_wizard",
          city: formData.city,
          purpose: formData.purpose,
          business_type: formData.businessType,
          estimated_price: base
        });
      } else {
        toast.error(data.message || "Failed to calculate quote lead");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      toast.error("You must be logged in to proceed to checkout.");
      navigate("/login", { state: { from: "/get-live-quote" } });
      return;
    }

    try {
      setSubmitting(true);

      // Determine default address names based on city
      let addressName = `${formData.city} Business Suite`;
      if (formData.city.toLowerCase() === "surat") {
        addressName = "Adajan Compliance Hub";
      } else if (formData.city.toLowerCase() === "mumbai") {
        addressName = "BKC Prestige Towers";
      }

      // Create Razorpay Order via Backend
      const orderDataResponse = await createVirtualRazorpayOrder(priceEstimate);
      const keyId = orderDataResponse?.keyId;
      const keyOrder = orderDataResponse?.order;

      if (!keyOrder) {
        throw new Error("Failed to initialize payment gateway order details.");
      }

      trackEvent("checkout_start", {
        service_name: `Virtual Office Address - ${formData.city}`,
        price: priceEstimate,
        purpose: formData.purpose
      });

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setSubmitting(false);
        return;
      }

      const options = {
        key: keyId,
        amount: keyOrder.amount,
        currency: keyOrder.currency,
        name: "FilingBy",
        description: `Virtual Office Address booking for ${formData.city}`,
        order_id: keyOrder.id,
        handler: async function (response) {
          try {
            setSubmitting(true);
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              citySlug: formData.city.toLowerCase(),
              addressName,
              selectedPlan: formData.purpose,
              price: priceEstimate,
            };

            const data = await verifyVirtualPayment(verificationPayload);
            if (data.success) {
              toast.success("Payment successful! Leased address created on dashboard.");
              trackEvent("payment_success", {
                service_name: `Virtual Office Address - ${formData.city}`,
                price: priceEstimate,
                payment_method: "online_razorpay",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id
              });
              navigate("/virtual-office/dashboard");
            } else {
              toast.error(data.message || "Payment verification failed.");
              trackEvent("payment_failed", {
                service_name: `Virtual Office Address - ${formData.city}`,
                price: priceEstimate,
                payment_method: "online_razorpay",
                error_message: data.message || "Payment verification failed"
              });
            }
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Verification failed.");
            trackEvent("payment_failed", {
              service_name: `Virtual Office Address - ${formData.city}`,
              price: priceEstimate,
              payment_method: "online_razorpay",
              error_message: err.message || "Verification catch error"
            });
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.name || "",
          email: formData.email || "",
          contact: formData.mobile || "",
        },
        theme: {
          color: "#1A56DB",
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            toast.error("Payment cancelled by user.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        trackEvent("payment_failed", {
          service_name: `Virtual Office Address - ${formData.city}`,
          price: priceEstimate,
          payment_method: "online_razorpay",
          error_message: response.error.description || "Razorpay gateway payment failed"
        });
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred during checkout. Please try again.");
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16 flex items-center justify-center pt-24 px-4">
      <SEO
        title="Get a Live Virtual Office Quote — Instant Price Estimation | FilingBy"
        description="Calculate instant pricing for virtual office addresses in India. Get live quotes for GST registration, company incorporation, and mailing services in seconds."
        keywords="virtual office pricing calculator, virtual office cost India, VPOB address cost estimation"
        canonical="/get-live-quote"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "Get Quote", url: "/get-live-quote" }
        ])}
      />
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 md:p-8 animate-fadeInUp">

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100/50">
          <h2 className="text-lg font-black text-gray-900">Virtual Office Quote Calculator</h2>
          <span className="text-xs font-bold text-[#1A56DB] bg-blue-50 px-2.5 py-1 rounded-full">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Select Office Location & Purpose</h3>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Target City</label>
              <select
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900"
              >
                <option value="">Select Target City</option>
                {availableCities.map(c => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Usage Purpose</label>
              <select
                name="purpose"
                required
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900"
              >
                <option value="">Select Purpose</option>
                <option value="gst">GST Registration / VPOB</option>
                <option value="incorporation">Company Incorporation / Registrar Office</option>
                <option value="mailing">Business Address / Mail Forwarding Only</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Business Setup Type</label>
              <select
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900"
              >
                <option value="">Select Entity Type</option>
                <option value="pvt-ltd">Private Limited Company</option>
                <option value="llp">Limited Liability Partnership (LLP)</option>
                <option value="sole-prop">Sole Proprietorship</option>
                <option value="partnership">General Partnership</option>
              </select>
            </div>

            <button
              disabled={!formData.city || !formData.purpose || !formData.businessType}
              onClick={() => setStep(2)}
              className="w-full mt-6 py-3.5 bg-[#1A56DB] hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-blue-500/25"
            >
              Continue to Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Share Contact Details</h3>
            <p className="text-[11px] text-gray-400 font-medium">Pricing estimations are compiled instantly and a hard copy sample is shared on WhatsApp.</p>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Sameer Goel"
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="sameer@gmail.com"
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mobile No</label>
              <input
                type="tel"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="9999988888"
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-all text-xs tracking-wider uppercase"
              >
                Back
              </button>
              <button
                disabled={!formData.name || !formData.email || !formData.mobile || submitting}
                onClick={calculateQuote}
                className="flex-1 py-3.5 bg-[#F97316] hover:bg-orange-500 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/25 disabled:opacity-50"
              >
                {submitting ? "Calculating..." : "Calculate Live Estimate"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <span className="text-4xl">📊</span>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">Your Virtual Office Estimate</h3>
              <p className="text-xs text-gray-500">Based on selection: {formData.city} • {formData.businessType.toUpperCase()}</p>
            </div>

            <div className="bg-gray-50/60 rounded-2xl p-6 inline-block w-full">
              <span className="text-sm font-semibold text-gray-500">Estimated Slabs Starting From</span>
              <div className="text-4xl font-black text-[#1A56DB] mt-1">₹{priceEstimate}*<span className="text-xs font-semibold text-gray-500">/month</span></div>
              <p className="text-[10px] text-gray-400 mt-2">*Excludes government registry stamp duty & GST registration filing fees.</p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({ city: "", purpose: "", businessType: "", name: "", email: "", mobile: "" });
                }}
                className="w-full py-2 text-gray-500 text-xs font-semibold hover:underline"
              >
                Calculate Another Quote
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
