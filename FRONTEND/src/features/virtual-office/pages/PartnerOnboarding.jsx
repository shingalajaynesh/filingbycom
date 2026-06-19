import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext";
import { useUserContext } from "../../../shared/context/UserContext.jsx";

const DEFAULT_AMENITIES = [
  "High-speed Wi-Fi",
  "Courier Handling",
  "Meeting Rooms",
  "Professional Receptionist",
  "GST Officer Desk",
  "Digital Mail Forwarding",
  "Name Board Placement",
  "VIP Lounge Access"
];

export default function PartnerOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUserContext();

  useEffect(() => {
    if (profile?.isPartner && !location.state?.forceForm) {
      navigate("/partner/dashboard", { replace: true });
    }
  }, [profile, navigate, location.state]);

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    spaceName: "",
    ownerName: "",
    email: "",
    mobile: "",
    city: "",
    spaceType: "",
    deskCount: "",
    address: "",
    price: "",
    image: "",
    description: "",
    amenities: []
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const { submitPartnerApplication } = useSharedData();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address.trim()) {
      toast.error("Address is required.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid monthly price.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        deskCount: Number(formData.deskCount) || 10,
        price: String(formData.price)
      };

      const data = await submitPartnerApplication(payload);
      if (data.success) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit onboarding application");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <SEO
        title="Partner Onboarding — Monetize Commercial Properties | FilingBy"
        description="Onboard your commercial space, coworking center, or vacant office as a FilingBy virtual office host. Monetize unused locations and generate steady passive yields."
        keywords="coworking partner program, monetize commercial space, virtual office provider registration, passive real estate income India"
        canonical="/partner-onboarding"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Virtual Office", url: "/virtual-space" },
          { name: "Partner Onboarding", url: "/partner-onboarding" }
        ])}
      />
      {/* Header Fold */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1A56DB] to-[#1e40af] text-white pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fadeInUp">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-400/20 text-orange-400 border border-orange-400/20">
            FilingBy Partner Program
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Monetize Your Coworking or Commercial Space
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            List your space in our directory and earn passive rental revenue by hosting virtual offices for registered company addresses.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left column info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-4">
            <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">Why Partner with Us?</h3>
            <ul className="space-y-4">
              {[
                { title: "Consistent Rental Yields", desc: "No tenant vacancy risks. Earn monthly margins from multiple registered corporate accounts." },
                { title: "Zero Marketing Costs", desc: "We manage customer acquisition, sales follow-ups, and payment collection." },
                { title: "Dashboard Integration", desc: "Track incoming packages, schedule physical audits, and review agreements instantly." },
                { title: "Instant Publishing", desc: "Once approved by our admin, your property is dynamically added as a location on our website immediately." },
              ].map((benefit) => (
                <li key={benefit.title} className="flex gap-3">
                  <span className="text-green-500 font-extrabold">✓</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{benefit.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{benefit.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Preview Block */}
          {formData.image && (
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2 border border-gray-150">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property Image Preview</span>
              <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 relative">
                <img
                  src={formData.image}
                  alt="Property Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right column form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8">
          <h3 className="text-lg font-black tracking-tight mb-2">Register Your Workspace</h3>
          <p className="text-xs text-gray-500 font-medium mb-6">Provide workspace parameters to verify listing slots.</p>
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <span className="text-4xl text-green-500">🏢</span>
              <h4 className="text-xl font-bold text-gray-900">Application Submitted!</h4>
              <p className="text-xs text-gray-500 font-medium">Our channel onboard manager will inspect your property layout digitally and request verification files within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Workspace / Center Name</label>
                  <input
                    type="text"
                    name="spaceName"
                    required
                    value={formData.spaceName}
                    onChange={handleInputChange}
                    placeholder="e.g. Innovate Coworking"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">City / Region</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangalore"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Onboarding Contact Person</label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ajay Jaynesh"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Mobile No</label>
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
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@coworking.com"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Space Desk Capacity</label>
                  <input
                    type="number"
                    name="deskCount"
                    required
                    value={formData.deskCount}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Space Type */}
              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Property Layout Type</label>
                <select
                  name="spaceType"
                  required
                  value={formData.spaceType}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900"
                >
                  <option value="">Select Space Type</option>
                  <option value="coworking">Coworking Space</option>
                  <option value="private-office">Private Commercial Office Building</option>
                  <option value="retail">Commercial Shopping Center / Complex</option>
                  <option value="other">Industrial Desk Area</option>
                </select>
              </div>

              {/* NEW: Price & Image URL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Monthly Cost for GST Desk (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 999"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Workspace Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Paste a direct image link (optional)"
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* NEW: Full Postal Address */}
              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Full Postal Address (for NOC/GST)</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Include floor number, building name, street address, and pin code"
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>

              {/* NEW: Workspace Description */}
              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Workspace Description (Features & Benefits)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your workspace location, proximity to transport, and any surrounding landmarks"
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border-0 bg-gray-100/60 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>

              {/* NEW: Amenities Checklist */}
              <div>
                <label className="text-[10px] font-bold text-gray-650 uppercase block mb-2">Amenities Checklist</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-150">
                  {DEFAULT_AMENITIES.map((amenity) => {
                    const isChecked = formData.amenities.includes(amenity);
                    return (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAmenityChange(amenity)}
                          className="w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-[#1A56DB]/20"
                        />
                        {amenity}
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#F97316] hover:bg-orange-500 text-white rounded-xl font-bold transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "Submitting Application..." : "Submit Onboarding Application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
