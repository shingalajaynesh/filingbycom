import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";
import { useSharedData } from "../../../shared/context/SharedDataContext";
import { useUserContext } from "../../../shared/context/UserContext.jsx";

const API_BASE_CLEANED = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

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
    images: [],
    priceGST: "",
    priceIncorp: "",
    priceMail: "",
    descGST: "",
    descIncorp: "",
    descMail: "",
    description: "",
    amenities: []
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-fill plan prices based on base price if not manually edited
      if (name === "price") {
        if (!prev.priceGST) updated.priceGST = value;
        if (!prev.priceIncorp) updated.priceIncorp = value ? String(Number(value) + 300) : "";
        if (!prev.priceMail) updated.priceMail = value ? String(Math.max(100, Number(value) - 400)) : "";
      }
      return updated;
    });
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uploaderData = new FormData();
        uploaderData.append("image", file);

        const res = await axios.post(
          `${API_BASE_CLEANED}/virtual-space/upload-image`,
          uploaderData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );

        if (res.data.success) {
          uploadedUrls.push(res.data.url);
        } else {
          toast.error(res.data.message || `Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => {
          const newImages = [...(prev.images || []), ...uploadedUrls];
          return {
            ...prev,
            images: newImages,
            image: newImages[0] || ""
          };
        });
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading one or more images. Please try again.");
    } finally {
      setUploading(false);
      toast.dismiss(toastId);
    }
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
    if (!formData.images || formData.images.length < 4) {
      toast.error("Please upload a minimum of 4 workspace images.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        deskCount: formData.deskCount ? Number(formData.deskCount) : undefined,
        price: String(formData.price),
        priceGST: formData.priceGST ? String(formData.priceGST) : String(formData.price),
        priceIncorp: formData.priceIncorp ? String(formData.priceIncorp) : String(Number(formData.price) + 300),
        priceMail: formData.priceMail ? String(formData.priceMail) : String(Math.max(100, Number(formData.price) - 400)),
        descGST: formData.descGST || "",
        descIncorp: formData.descIncorp || "",
        descMail: formData.descMail || ""
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
          {formData.images && formData.images.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 border border-gray-150">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block animate-pulse">
                Uploaded Workspace Images ({formData.images.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 relative border border-gray-100 hover:scale-[1.02] transition-transform">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
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
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Space Desk Capacity (Optional)</label>
                  <input
                    type="number"
                    name="deskCount"
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

              {/* NEW: Price & Workspace Image Upload */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">Base Monthly Cost for Partner Share (₹)</label>
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

                {/* Plan Pricing & Descriptions Configuration */}
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <span className="text-[10px] font-black uppercase text-gray-500 block tracking-wider">
                    Plan Prices & Custom Descriptions (Optional Customization)
                  </span>
                  
                  {/* Plan 1: GST Registration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-gray-600 uppercase block mb-1">GST Desk Public Price (₹/mo)</label>
                      <input
                        type="number"
                        name="priceGST"
                        value={formData.priceGST}
                        onChange={handleInputChange}
                        placeholder="e.g. 999"
                        className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border-0 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-600 uppercase block mb-1">GST Plan Description</label>
                      <input
                        type="text"
                        name="descGST"
                        value={formData.descGST}
                        onChange={handleInputChange}
                        placeholder="e.g. Premium address with NOC, utility bills, inspection..."
                        className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border-0 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Plan 2: Company Incorporation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-gray-600 uppercase block mb-1">MCA/Incorp Public Price (₹/mo)</label>
                      <input
                        type="number"
                        name="priceIncorp"
                        value={formData.priceIncorp}
                        onChange={handleInputChange}
                        placeholder="e.g. 1299"
                        className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border-0 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-600 uppercase block mb-1">Incorp Plan Description</label>
                      <input
                        type="text"
                        name="descIncorp"
                        value={formData.descIncorp}
                        onChange={handleInputChange}
                        placeholder="e.g. ROC compliant NOC, Consent Letter, Board placement..."
                        className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border-0 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Plan 3: Mailing Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-gray-600 uppercase block mb-1">Mailing Address Public Price (₹/mo)</label>
                      <input
                        type="number"
                        name="priceMail"
                        value={formData.priceMail}
                        onChange={handleInputChange}
                        placeholder="e.g. 599"
                        className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border-0 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-600 uppercase block mb-1">Mailing Plan Description</label>
                      <input
                        type="text"
                        name="descMail"
                        value={formData.descMail}
                        onChange={handleInputChange}
                        placeholder="e.g. Courier logging, scan & forward mail, receptionist..."
                        className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border-0 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Workspace Photos (Minimum 4 images required)</label>
                  <div className="mt-2 space-y-4">
                    {/* Image Grid / Thumbnails */}
                    {formData.images && formData.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        {formData.images.map((imgUrl, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-150 border border-gray-200">
                            <img src={imgUrl} alt={`Workspace ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => {
                                  const newImages = prev.images.filter((_, i) => i !== index);
                                  return {
                                    ...prev,
                                    images: newImages,
                                    image: newImages.length > 0 ? newImages[0] : ""
                                  };
                                });
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm opacity-90 transition-all cursor-pointer"
                              title="Remove image"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">Cover</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Trigger Dropzone */}
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="onboarding-images-upload"
                      />
                      <label
                        htmlFor="onboarding-images-upload"
                        className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 transition-all ${
                          uploading ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-700">
                          {uploading ? "Uploading images..." : "Click to Upload Workspace Photos"}
                        </span>
                        <span className="text-[10px] text-gray-550 mt-1">PNG, JPG or WEBP up to 5MB</span>
                      </label>
                    </div>
                    {formData.images.length < 4 && (
                      <p className="text-[11px] font-semibold text-orange-500">
                        ⚠️ Please upload at least {4 - formData.images.length} more image{4 - formData.images.length > 1 ? "s" : ""} to complete registration.
                      </p>
                    )}
                  </div>
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
                disabled={submitting || uploading || formData.images.length < 4}
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
