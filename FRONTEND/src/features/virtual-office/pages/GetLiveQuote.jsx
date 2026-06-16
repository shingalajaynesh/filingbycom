import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext.jsx";
import { useOrderContext } from "../../../shared/context/OrderContext.jsx";

export default function GetLiveQuote() {
  const navigate = useNavigate();
  const { locations, submitQuoteLead } = useSharedData();
  const { createVirtualOrder } = useOrderContext();
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
      } else {
        alert(data.message || "Failed to calculate quote lead");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert("You must be logged in to proceed to checkout.");
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

      const data = await createVirtualOrder({
        citySlug: formData.city.toLowerCase(),
        addressName,
        selectedPlan: formData.purpose,
        price: priceEstimate,
      });

      if (data.success) {
        alert("Payment successful! Leased address created on dashboard.");
        navigate("/virtual-office/dashboard");
      } else {
        alert(data.message || "Failed to complete checkout.");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred during checkout. Please try again.");
    } finally {
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
        description="Use our interactive virtual office quote calculator to get instant estimates for GST registration and company incorporation addresses in India."
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
