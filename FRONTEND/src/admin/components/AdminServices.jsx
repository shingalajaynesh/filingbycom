import { useState, useEffect } from "react";
import { useAdminServices } from "../hooks/useAdminServices";
import { safeFetch } from "../../shared/utils/api";

const ICONS = [
  "building",
  "document",
  "trademark",
  "wallet",
  "handshake",
  "chart",
  "file",
  "globe",
  "receipt",
  "landmark",
  "scale",
];

export default function AdminServices({ portal, type = 'nav' }) {
  const { 
    services, mainServices, loading, error, refetch, 
    addService, updateService, deleteService,
    addMainService, updateMainService, deleteMainService 
  } = useAdminServices(portal);

  // Navbar limit settings state
  const [navbarLimit, setNavbarLimit] = useState(5);
  const [savingLimit, setSavingLimit] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const data = await safeFetch("/settings");
        if (data.success && data.settings?.navbar_category_limit !== undefined) {
          setNavbarLimit(data.settings.navbar_category_limit);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    if (type === 'nav') {
      fetchLimit();
    }
  }, [type]);

  const handleSaveLimit = async () => {
    setSavingLimit(true);
    try {
      await safeFetch("/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: "navbar_category_limit", value: Number(navbarLimit) }),
      });
      alert("Navbar category limit updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update navbar limit");
    } finally {
      setSavingLimit(false);
    }
  };

  // Forms state
  const [editingService, setEditingService] = useState(null);
  const [editingMainService, setEditingMainService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    order: 0,
    billingCycle: "Fixed",
    icon: "document",
    slug: "",
    tag: "",
    mainService: "",
    navSection: "",
    isActive: type === 'nav',
    isPopular: type === 'popular',
    documentsRequired: [""],
    processSteps: [""],
    faqs: [{ q: "", a: "" }],
  });

  const [mainFormData, setMainFormData] = useState({
    name: "",
    order: 0,
    isActive: true,
  });

  // --- Handlers for Main Service Modal ---
  const handleOpenMainModal = (main = null) => {
    if (main) {
      setEditingMainService(main);
      setMainFormData({
        name: main.name,
        order: main.order,
        isActive: main.isActive,
      });
    } else {
      setEditingMainService(null);
      setMainFormData({
        name: "",
        order: mainServices.length + 1,
        isActive: true,
      });
    }
    setIsMainModalOpen(true);
  };

  const handleCloseMainModal = () => {
    setIsMainModalOpen(false);
    setEditingMainService(null);
  };

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMainFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === "order" ? Number(value) : value),
    }));
  };

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    if (!mainFormData.name.trim()) {
      alert("Category Name is required");
      return;
    }
    setSubmitting(true);
    let res;
    if (editingMainService) {
      res = await updateMainService(editingMainService._id, mainFormData);
    } else {
      res = await addMainService(mainFormData);
    }
    if (res.success) {
      handleCloseMainModal();
    }
    setSubmitting(false);
  };

  const handleDeleteMain = async (id) => {
    if (window.confirm("Are you sure you want to delete this Category? Services inside it will lose their category.")) {
      await deleteMainService(id);
    }
  };

  // --- Handlers for Semi Service Modal ---
  const handleOpenModal = (service = null, defaultMainId = "") => {
    if (service) {
      setEditingService(service);
      setFormData({ 
        ...service,
        mainService: service.mainService?._id || service.mainService || "",
        documentsRequired: service.documentsRequired?.length ? service.documentsRequired : [""],
        processSteps: service.processSteps?.length ? service.processSteps : [""],
        faqs: service.faqs?.length ? service.faqs : [{ q: "", a: "" }],
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        basePrice: 0,
        order: 0,
        billingCycle: "Fixed",
        icon: "document",
        slug: "",
        tag: "",
        mainService: defaultMainId,
        navSection: "",
        isActive: type === 'nav',
        isPopular: type === 'popular',
        documentsRequired: [""],
        processSteps: [""],
        faqs: [{ q: "", a: "" }],
      });
    }
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === "basePrice" || name === "order" ? Number(value) : value),
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][key] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const addArrayItem = (field, defaultVal = "") => {
    setFormData({ ...formData, [field]: [...formData[field], defaultVal] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Service Name is required.");
      setActiveTab('basic');
      return;
    }
    if (!formData.slug.trim()) {
      alert("Slug is required (URL friendly).");
      setActiveTab('basic');
      return;
    }
    if (formData.basePrice === "" || formData.basePrice < 0) {
      alert("Valid Base Price is required.");
      setActiveTab('basic');
      return;
    }

    setSubmitting(true);
    
    const cleanedData = {
        ...formData,
        documentsRequired: formData.documentsRequired.filter(d => d.trim() !== ""),
        processSteps: formData.processSteps.filter(p => p.trim() !== ""),
        faqs: formData.faqs.filter(f => f.q.trim() !== "" && f.a.trim() !== "")
    };

    let res;
    if (editingService) {
      res = await updateService(editingService._id, cleanedData);
    } else {
      res = await addService(cleanedData);
    }
    if (res.success) {
      handleCloseModal();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={refetch} className="mt-2 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const displayServices = services.filter(s => type === 'nav' ? s.isActive !== false : s.isPopular === true);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {type === 'nav' ? 'Manage Navigation Services' : 'Manage Popular Services'}
          </h2>
          <p className="text-sm text-gray-500">
            {type === 'nav' 
              ? 'Manage categories and services as they appear in the static Navigation Bar.'
              : 'Add or edit services and manage their placement on the Homepage.'}
          </p>
        </div>
        <div className="flex gap-3">
          {type === 'nav' && (
            <button
              onClick={() => handleOpenMainModal()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#1A56DB] text-[#1A56DB] text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              + Add Category
            </button>
          )}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Service
          </button>
        </div>
      </div>

      {type === 'nav' && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Desktop Navbar Category Limit</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Set the maximum number of categories visible directly in the navigation bar. Additional active categories will automatically wrap under a "More" dropdown to prevent header layout breaking.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <input
              type="number"
              min="1"
              max="20"
              value={navbarLimit}
              onChange={(e) => setNavbarLimit(Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm text-center font-bold text-gray-900 bg-white"
            />
            <button
              onClick={handleSaveLimit}
              disabled={savingLimit}
              className="px-4 py-2 bg-[#1A56DB] text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {savingLimit ? "Saving..." : "Save Limit"}
            </button>
          </div>
        </div>
      )}

      {type === 'nav' ? (
        <div className="space-y-4">
          {mainServices.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm text-gray-500 text-sm">
              No categories found. Click "Add Category" to create one.
            </div>
          ) : (
            mainServices.map(main => {
              const semiServices = displayServices.filter(s => s.mainService?._id === main._id || s.mainService === main._id).sort((a,b) => (a.order || 0) - (b.order || 0));
              const isExpanded = expandedCategory === main._id;
              
              return (
                <div key={main._id} className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
                  <div className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <button 
                      className="flex-1 flex items-center gap-3 text-left"
                      onClick={() => setExpandedCategory(isExpanded ? null : main._id)}
                    >
                      <h3 className="text-md font-bold text-gray-900">{main.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                        Order: {main.order}
                      </span>
                      {!main.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                          Hidden
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-2">{semiServices.length} items</span>
                    </button>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleOpenMainModal(main)} className="text-xs font-bold text-blue-600 hover:underline">Edit Category</button>
                      <button onClick={() => handleDeleteMain(main._id)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                      <button onClick={() => setExpandedCategory(isExpanded ? null : main._id)}>
                        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={() => handleOpenModal(null, main._id)}
                          className="text-sm font-bold text-[#1A56DB] hover:underline flex items-center gap-1"
                        >
                          + Add Service to {main.name}
                        </button>
                      </div>
                      
                      {semiServices.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-4">No services in this category.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {semiServices.map((service) => (
                            <div key={service._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
                              <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleOpenModal(service)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(service._id)} className="text-red-500 hover:text-red-700" title="Delete">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                              <h4 className="font-bold text-gray-900 pr-12">{service.name}</h4>
                              <p className="text-xs text-gray-500 mb-2 truncate" title={service.slug}>{service.slug}</p>
                              
                              <div className="flex items-center justify-between text-sm mt-4">
                                <span className="font-medium text-gray-900">₹{service.basePrice?.toLocaleString("en-IN")}</span>
                                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">Order: {service.order || 0}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price & Cycle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayServices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                    No services found. Click "Add Service" to create one.
                  </td>
                </tr>
              ) : (
                displayServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      <div className="text-xs text-gray-500">{service.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.mainService?.name || "—"}</div>
                      <div className="text-xs text-gray-500">{service.navSection || "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>₹{service.basePrice?.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-gray-400">{service.billingCycle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        Popular
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(service)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL FOR MAIN SERVICE (CATEGORY) */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingMainService ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={handleCloseMainModal} className="text-gray-400 hover:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <form id="main-service-form" onSubmit={handleMainSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input required type="text" name="name" value={mainFormData.name} onChange={handleMainChange} placeholder="e.g. GST Services" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Static Order</label>
                  <input required type="number" name="order" value={mainFormData.order} onChange={handleMainChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the navigation bar.</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" name="isActive" id="mainIsActive" checked={mainFormData.isActive} onChange={handleMainChange} className="w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-[#1A56DB]" />
                  <label htmlFor="mainIsActive" className="text-sm font-medium text-gray-700">Active (Visible in Navigation)</label>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={handleCloseMainModal} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" form="main-service-form" disabled={submitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50">
                {submitting ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR SEMI SERVICE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button onClick={() => setActiveTab('basic')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB]' : 'text-gray-500 hover:text-gray-700'}`}>Basic Info</button>
              {type === 'nav' && (
                <button onClick={() => setActiveTab('nav')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'nav' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB]' : 'text-gray-500 hover:text-gray-700'}`}>Navigation Setup</button>
              )}
              {type === 'popular' && (
                <button onClick={() => setActiveTab('nav')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'nav' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB]' : 'text-gray-500 hover:text-gray-700'}`}>Placement Setup</button>
              )}
              <button onClick={() => setActiveTab('details')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB]' : 'text-gray-500 hover:text-gray-700'}`}>Documents & FAQs</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* BASIC INFO TAB */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
                      <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                        <input required type="number" name="basePrice" min="0" value={formData.basePrice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                        <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm">
                          <option value="Fixed">Fixed</option>
                          <option value="Month">Month</option>
                          <option value="Quarter">Quarter</option>
                          <option value="Year">Year</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <select name="icon" value={formData.icon} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm">
                          {ICONS.map((icon) => (
                            <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Optional)</label>
                        <input type="text" name="tag" placeholder="e.g. Most Popular" value={formData.tag} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* NAVIGATION/PLACEMENT SETUP TAB */}
                {activeTab === 'nav' && (
                  <div className="space-y-4">
                    {type === 'nav' && (
                      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div>
                          <h4 className="text-sm font-bold text-[#1A56DB]">Active in Navigation</h4>
                          <p className="text-xs text-blue-800">If toggled off, this service will not appear in the top navbar.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A56DB]"></div>
                        </label>
                      </div>
                    )}

                    {type === 'popular' && (
                      <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
                        <div>
                          <h4 className="text-sm font-bold text-orange-600">Featured as Popular Service</h4>
                          <p className="text-xs text-orange-800">If toggled on, this service appears in the Popular Services section on the homepage.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category (Main Service)</label>
                      <select name="mainService" value={formData.mainService} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm">
                        <option value="">-- No Category --</option>
                        {mainServices.map(main => (
                           <option key={main._id} value={main._id}>{main.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Static Order</label>
                      <input required type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                      <p className="text-xs text-gray-500 mt-1">Order this service appears inside its category dropdown.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nav Section (e.g. Registration)</label>
                      <input type="text" name="navSection" value={formData.navSection} onChange={handleChange} placeholder="Group heading inside the dropdown" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                    </div>
                  </div>
                )}

                {/* DETAILS & FAQS TAB */}
                {activeTab === 'details' && (
                  <div className="space-y-8">
                    
                    {/* Documents Required */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Documents Required</label>
                        <button type="button" onClick={() => addArrayItem('documentsRequired')} className="text-xs text-[#1A56DB] font-medium">+ Add Document</button>
                      </div>
                      <div className="space-y-2">
                        {formData.documentsRequired.map((doc, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={doc} onChange={(e) => handleArrayChange('documentsRequired', index, e.target.value)} placeholder={`Document ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                            <button type="button" onClick={() => removeArrayItem('documentsRequired', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Process Steps */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Process Steps</label>
                        <button type="button" onClick={() => addArrayItem('processSteps')} className="text-xs text-[#1A56DB] font-medium">+ Add Step</button>
                      </div>
                      <div className="space-y-2">
                        {formData.processSteps.map((step, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={step} onChange={(e) => handleArrayChange('processSteps', index, e.target.value)} placeholder={`Step ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                            <button type="button" onClick={() => removeArrayItem('processSteps', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FAQs */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">FAQs</label>
                        <button type="button" onClick={() => addArrayItem('faqs', { q: "", a: "" })} className="text-xs text-[#1A56DB] font-medium">+ Add FAQ</button>
                      </div>
                      <div className="space-y-4">
                        {formData.faqs.map((faq, index) => (
                          <div key={index} className="flex gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex-1 space-y-2">
                              <input type="text" value={faq.q} onChange={(e) => handleFaqChange(index, 'q', e.target.value)} placeholder="Question" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                              <textarea value={faq.a} onChange={(e) => handleFaqChange(index, 'a', e.target.value)} placeholder="Answer" rows="2" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                            </div>
                            <button type="button" onClick={() => removeArrayItem('faqs', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-md self-start">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A56DB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="service-form"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A56DB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A56DB] disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
