import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

export default function GetLiveQuote() {
  const navigate = useNavigate();
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

  const calculateQuote = () => {
    let base = 999;
    if (formData.purpose === "incorporation") base = 1299;
    if (formData.purpose === "gst") base = 1199;
    
    // Add business type weight
    if (formData.businessType === "pvt-ltd") base += 200;
    if (formData.businessType === "llp") base += 100;
    
    // Add city specific weights
    const metroCities = ["mumbai", "delhi", "bangalore"];
    if (metroCities.includes(formData.city.toLowerCase())) {
      base += 300;
    }

    setPriceEstimate(base);
    setStep(3);
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
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8 animate-fadeInUp">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">Virtual Office Quote Calculator</h2>
          <span className="text-xs font-bold text-[#1A56DB] bg-blue-50 px-2.5 py-1 rounded-full">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Select Office Location & Purpose</h3>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Target City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Bangalore, Delhi, Noida"
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Usage Purpose</label>
              <select
                name="purpose"
                required
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
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
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
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
              className="w-full mt-6 py-3 bg-[#1A56DB] hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer"
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
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
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
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
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
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1A56DB]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-800 rounded-xl font-bold transition-all text-xs tracking-wider uppercase"
              >
                Back
              </button>
              <button
                disabled={!formData.name || !formData.email || !formData.mobile}
                onClick={calculateQuote}
                className="flex-1 py-3 bg-[#F97316] hover:bg-orange-500 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer"
              >
                Calculate Live Estimate
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

            <div className="bg-gray-50 rounded-2xl border border-gray-150 p-6 inline-block w-full">
              <span className="text-sm font-semibold text-gray-500">Estimated Slabs Starting From</span>
              <div className="text-4xl font-black text-[#1A56DB] mt-1">₹{priceEstimate}*<span className="text-xs font-semibold text-gray-500">/month</span></div>
              <p className="text-[10px] text-gray-400 mt-2">*Excludes government registry stamp duty & GST registration filing fees.</p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => {
                  alert("Redirecting to payment gateway / order confirmation...");
                  navigate("/dashboard");
                }}
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
