import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState("basic"); // basic, workspaces, faqs
  const [searchTerm, setSearchTerm] = useState("");

  const { fetchAdminLocations, saveLocation, deleteLocation: deleteLocAPI } = useAdminContext();

  // Form state for location (city level)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    state: "",
    tagline: "",
    rate: "999",
    image: "",
    mapEmbed: "",
    addresses: [],
    faqs: [],
  });

  // Active address being added/edited inside the city modal
  const [activeAddressIdx, setActiveAddressIdx] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "",
    slug: "",
    address: "",
    feature: "",
    image: "",
    priceGST: "999",
    priceIncorp: "1,299",
    priceMail: "599",
    amenitiesStr: "",
    description: "",
    mapEmbed: "",
    photosStr: "",
  });

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminLocations();
      if (data.success) {
        setLocations(data.locations || []);
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Failed to fetch locations");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAdminLocations]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleOpenModal = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name || "",
        slug: location.slug || "",
        state: location.state || "",
        tagline: location.tagline || "",
        rate: location.rate || "999",
        image: location.image || "",
        mapEmbed: location.mapEmbed || "",
        addresses: location.addresses || [],
        faqs: location.faqs || [],
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        slug: "",
        state: "",
        tagline: "",
        rate: "999",
        image: "",
        mapEmbed: "",
        addresses: [],
        faqs: [],
      });
    }
    setActiveFormTab("basic");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      slug: name === "name" ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : (name === "slug" ? value.toLowerCase().replace(/[^a-z0-9-]+/g, "") : prev.slug),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || !formData.state.trim()) {
      toast.error("City Name, Slug, and State are required fields");
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = !!editingLocation;
      const id = editingLocation ? editingLocation._id : null;

      const res = await saveLocation(isEdit, id, formData);

      if (res.success) {
        toast.success(isEdit ? "City updated successfully!" : "City added successfully!");
        handleCloseModal();
        fetchLocations();
      } else {
        toast.error(res.message || "Failed to save location");
      }
    } catch (err) {
      handleFrontendError(err, "Failed to save location");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location? All nested offices/spaces will be permanently removed.")) {
      return;
    }
    try {
      const res = await deleteLocAPI(id);
      if (res.success) {
        toast.success("Location deleted successfully!");
        fetchLocations();
      } else {
        toast.error(res.message || "Failed to delete location");
      }
    } catch (err) {
      handleFrontendError(err, "Failed to delete location");
    }
  };

  // --- FAQS MANAGMENT HANDLERS ---
  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { q: "", a: "" }]
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // --- WORKSPACE (ADDRESS) MANAGMENT HANDLERS ---
  const handleOpenAddressModal = (index = null) => {
    if (index !== null) {
      setActiveAddressIdx(index);
      const addr = formData.addresses[index];
      setAddressData({
        name: addr.name || "",
        slug: addr.slug || "",
        address: addr.address || "",
        feature: addr.feature || "",
        image: addr.image || "",
        priceGST: addr.priceGST || "999",
        priceIncorp: addr.priceIncorp || "1,299",
        priceMail: addr.priceMail || "599",
        amenitiesStr: addr.amenities ? addr.amenities.join(", ") : "",
        description: addr.description || "",
        mapEmbed: addr.mapEmbed || "",
        photosStr: addr.photos ? addr.photos.join(", ") : "",
      });
    } else {
      setActiveAddressIdx(null);
      setAddressData({
        name: "",
        slug: "",
        address: "",
        feature: "",
        image: "",
        priceGST: "999",
        priceIncorp: "1,299",
        priceMail: "599",
        amenitiesStr: "High-speed Wi-Fi, Courier Handling, Meeting Rooms, GST Site Audit",
        description: "",
        mapEmbed: "",
        photosStr: "",
      });
    }
    setIsAddressModalOpen(true);
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value,
      slug: name === "name" ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : (name === "slug" ? value.toLowerCase().replace(/[^a-z0-9-]+/g, "") : prev.slug),
    }));
  };

  const handleSaveAddress = () => {
    if (!addressData.name.trim() || !addressData.address.trim()) {
      toast.error("Workspace Name and Full Address are required!");
      return;
    }

    const compiledAddress = {
      name: addressData.name,
      slug: addressData.slug,
      address: addressData.address,
      feature: addressData.feature,
      image: addressData.image,
      priceGST: addressData.priceGST,
      priceIncorp: addressData.priceIncorp,
      priceMail: addressData.priceMail,
      amenities: addressData.amenitiesStr.split(",").map(s => s.trim()).filter(Boolean),
      description: addressData.description,
      mapEmbed: addressData.mapEmbed,
      photos: addressData.photosStr.split(",").map(s => s.trim()).filter(Boolean),
    };

    setFormData(prev => {
      const updated = [...prev.addresses];
      if (activeAddressIdx !== null) {
        updated[activeAddressIdx] = compiledAddress;
      } else {
        updated.push(compiledAddress);
      }
      return { ...prev, addresses: updated };
    });

    setIsAddressModalOpen(false);
  };

  const handleRemoveAddress = (index) => {
    if (window.confirm("Remove this office space center?")) {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }));
    }
  };

  const filteredLocations = locations.filter(loc => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (loc.name || "").toLowerCase().includes(searchLower) ||
      (loc.slug || "").toLowerCase().includes(searchLower) ||
      (loc.state || "").toLowerCase().includes(searchLower) ||
      (loc.tagline || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-gray-900">Virtual Office Locations & Spaces</h3>
          <p className="text-xs text-gray-400 mt-1">Configure physical workspaces and cities dynamically</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-white text-gray-950"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4.5 py-2.5 bg-[#1A56DB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-blue-500/10 border-0 whitespace-nowrap"
          >
            + Add New City
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-semibold text-sm">Loading locations...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 font-semibold text-sm">{error}</div>
      ) : locations.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-semibold text-sm">No locations found. Add your first city to get started.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">City / Area Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Starting Rate</th>
                <th className="py-3.5 px-4 text-center">Centers Count</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 text-sm font-semibold">
                    No locations found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc) => (
                <tr key={loc._id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {loc.image && (
                        <img src={loc.image} alt={loc.name} className="w-10 h-10 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                      )}
                      <div>
                        <span className="font-extrabold text-sm text-gray-900 block">{loc.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium line-clamp-1 max-w-xs">{loc.tagline}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-500">/{loc.slug}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full">{loc.state}</span>
                  </td>
                  <td className="py-4 px-4 font-black text-xs text-gray-800">₹{loc.rate}/mo</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-black bg-slate-100 text-slate-700 rounded-md">
                      {loc.addresses ? loc.addresses.length : 0} centers
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(loc)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg cursor-pointer border-0 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(loc._id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg cursor-pointer border-0 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* Primary City Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fadeInUp">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-base font-black text-gray-900">
                  {editingLocation ? `Edit City Details: ${formData.name}` : "Create New Location (City)"}
                </h4>
                <p className="text-xs text-gray-400 font-medium">Configure landing assets and workspaces for this region.</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-900 font-bold text-lg cursor-pointer border-0 bg-transparent"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {[
                { id: "basic", label: "1. Basic Details" },
                { id: "workspaces", label: `2. Office Centers (${formData.addresses.length})` },
                { id: "faqs", label: `3. Localized FAQs (${formData.faqs.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`py-3 px-4 text-xs font-bold border-b-2 -mb-[1px] transition-colors cursor-pointer ${activeFormTab === tab.id ? "border-[#1A56DB] text-[#1A56DB]" : "border-transparent text-gray-450 hover:text-gray-900"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content container */}
            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">

              {/* Tab 1: Basic Details */}
              {activeFormTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">City Name*</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Surat"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">URL Path Slug* (e.g. /virtual-office-surat)</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. surat"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">State Name*</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Gujarat"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Starting Price Slab (INR)*</label>
                    <input
                      type="text"
                      name="rate"
                      required
                      value={formData.rate}
                      onChange={handleInputChange}
                      placeholder="e.g. 999"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Tagline / Area Sub-labels</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      placeholder="e.g. Ring Road, Adajan, VIP Road & Vesu"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/photo-xxx"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Google Maps Embed Embed URL (Index Location)</label>
                    <input
                      type="text"
                      name="mapEmbed"
                      value={formData.mapEmbed}
                      onChange={handleInputChange}
                      placeholder="https://www.google.com/maps/embed?pb=xxx"
                      className="w-full text-xs font-semibold px-4.5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Workspaces List */}
              {activeFormTab === "workspaces" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs font-bold text-gray-700">Office Centers Directory</h5>
                    <button
                      type="button"
                      onClick={() => handleOpenAddressModal()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer border-0"
                    >
                      + Add Workspace Center
                    </button>
                  </div>

                  {formData.addresses.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-semibold">
                      No office centers added for this city yet. Add one to show on local landing search lists.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.addresses.map((addr, aIdx) => (
                        <div key={aIdx} className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="font-extrabold text-sm text-gray-900 block">{addr.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium block">/{addr.slug}</span>
                            <span className="text-[10px] text-gray-500 font-semibold block leading-relaxed line-clamp-2">📍 {addr.address}</span>
                            <span className="text-[10px] text-blue-700 font-black block">Price starts: ₹{addr.priceGST}/mo</span>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenAddressModal(aIdx)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-gray-250 text-[10px] font-bold rounded"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAddress(aIdx)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border-0 text-[10px] font-bold rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Localized FAQs */}
              {activeFormTab === "faqs" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs font-bold text-gray-700">FAQ Pairs</h5>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer border-0"
                    >
                      + Add FAQ Pair
                    </button>
                  </div>

                  {formData.faqs.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-semibold">
                      No localized FAQs configured for this city.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.faqs.map((faq, fIdx) => (
                        <div key={fIdx} className="bg-slate-50 p-4 rounded-2xl border border-gray-180 relative space-y-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(fIdx)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-black text-xs border-0 bg-transparent cursor-pointer"
                          >
                            ✕ Remove
                          </button>
                          <div>
                            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Question</label>
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => handleFaqChange(fIdx, "q", e.target.value)}
                              placeholder="e.g. Is physical verification supported here?"
                              className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Answer</label>
                            <textarea
                              rows="2"
                              value={faq.a}
                              onChange={(e) => handleFaqChange(fIdx, "a", e.target.value)}
                              placeholder="e.g. Yes, we provide standard physical verification rooms..."
                              className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </form>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4.5 py-3 bg-white hover:bg-gray-100 text-gray-900 border border-gray-250 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer border-0 shadow-md shadow-blue-500/10"
              >
                {submitting ? "Saving location..." : "Save Location"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Secondary Address/Workspace modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-fadeInUp">

            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-black text-gray-900">
                  {activeAddressIdx !== null ? `Edit Workspace Center: ${addressData.name}` : "Add New Office Center / Workspace"}
                </h4>
                <p className="text-xs text-gray-400 font-medium">Configure pricing, amenities and gallery for this center.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 font-bold text-lg cursor-pointer border-0 bg-transparent"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Center Name*</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={addressData.name}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. Ramesh Nagar Hub"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Center Slug* (e.g. /rameshnagar)</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={addressData.slug}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. rameshnagar"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Full Physical Address*</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={addressData.address}
                  onChange={handleAddressInputChange}
                  placeholder="Main Ring Road, Metro Pillar No. 370, Ramesh Nagar, New Delhi - 110015"
                  className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Workspace Feature/Highlight Tag</label>
                <input
                  type="text"
                  name="feature"
                  value={addressData.feature}
                  onChange={handleAddressInputChange}
                  placeholder="e.g. Premium Central-West Hub, Direct Metro Connectivity"
                  className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Mail Price/mo (₹)</label>
                  <input
                    type="text"
                    name="priceMail"
                    value={addressData.priceMail}
                    onChange={handleAddressInputChange}
                    placeholder="599"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">GST Price/mo (₹)</label>
                  <input
                    type="text"
                    name="priceGST"
                    value={addressData.priceGST}
                    onChange={handleAddressInputChange}
                    placeholder="999"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Incorp Price/mo (₹)</label>
                  <input
                    type="text"
                    name="priceIncorp"
                    value={addressData.priceIncorp}
                    onChange={handleAddressInputChange}
                    placeholder="1299"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Inclusions / Amenities (comma separated)</label>
                <input
                  type="text"
                  name="amenitiesStr"
                  value={addressData.amenitiesStr}
                  onChange={handleAddressInputChange}
                  placeholder="Wi-Fi, Courier sorting, Meeting rooms"
                  className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Center Description / Info paragraph</label>
                <textarea
                  name="description"
                  rows="3"
                  value={addressData.description}
                  onChange={handleAddressInputChange}
                  placeholder="Describe building layout, metro access, inspector verification desk..."
                  className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Center Cover Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={addressData.image}
                    onChange={handleAddressInputChange}
                    placeholder="https://images.unsplash.com/photo-xxx"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Google Maps Embed URL</label>
                  <input
                    type="text"
                    name="mapEmbed"
                    value={addressData.mapEmbed}
                    onChange={handleAddressInputChange}
                    placeholder="https://www.google.com/maps/embed?pb=xxx"
                    className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Gallery Image URLs (comma separated)</label>
                <textarea
                  name="photosStr"
                  rows="2"
                  value={addressData.photosStr}
                  onChange={handleAddressInputChange}
                  placeholder="https://image1.com, https://image2.com"
                  className="w-full text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A56DB]/25 transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-250 text-xs font-bold rounded-xl"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveAddress}
                className="px-5 py-2 bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl border-0 shadow-md shadow-blue-500/10"
              >
                Apply Workspace
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
