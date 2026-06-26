import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

import CategoryModal from "./modals/CategoryModal";
import SemiCategoryModal from "./modals/SemiCategoryModal";
import ServiceModal from "./modals/ServiceModal";
import CategoryList from "./lists/CategoryList";

export default function AdminServices({ portal, type = 'nav' }) {
  const { 
    services, mainServices, semiServices, loading, fetchServicesData,
    addService, updateService, deleteService,
    addMainService, updateMainService, deleteMainService,
    addSemiService, updateSemiService, deleteSemiService, reorderItems
  } = useAdminContext();

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServicesData(portal).catch(err => {
      const msg = handleFrontendError(err, "Failed to fetch services data", { silent: true });
      setError(msg);
    });
  }, [fetchServicesData, portal]);

  const refetch = () => {
    setError(null);
    fetchServicesData(portal).catch(err => {
      const msg = handleFrontendError(err, "Failed to fetch services data", { silent: true });
      setError(msg);
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSemiModalOpen, setIsSemiModalOpen] = useState(false);

  // Forms state
  const [editingService, setEditingService] = useState(null);
  const [editingMainService, setEditingMainService] = useState(null);
  const [editingSemiService, setEditingSemiService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: "", description: "", basePrice: 0, order: 1, billingCycle: "Fixed", icon: "document", slug: "", tag: "", mainService: "", semiService: "", navSection: "", isActive: type === 'nav', isPopular: type === 'popular', documentsRequired: [""], processSteps: [""], faqs: [{ q: "", a: "" }],
  });

  const [mainFormData, setMainFormData] = useState({
    name: "", order: 1, isActive: true,
  });

  const [semiFormData, setSemiFormData] = useState({
    name: "", mainService: "", order: 1, isActive: true,
  });

  // --- Handlers for Main Service Modal ---
  const handleOpenMainModal = (main = null) => {
    if (main) {
      setEditingMainService(main);
      setMainFormData({ name: main.name, order: main.order, isActive: main.isActive });
    } else {
      setEditingMainService(null);
      setMainFormData({ name: "", order: mainServices.length + 1, isActive: true });
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
    if (!mainFormData.name.trim()) return toast.error("Category Name is required");
    setSubmitting(true);
    try {
      const res = editingMainService 
        ? await updateMainService(editingMainService._id, mainFormData)
        : await addMainService(mainFormData, portal);
      if (res.success) {
        toast.success(editingMainService ? "Category updated successfully!" : "Category added successfully!");
        handleCloseMainModal();
      } else {
        toast.error(res.message || "Failed to save category");
      }
    } catch (err) {
      handleFrontendError(err, "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMain = async (id) => {
    if (window.confirm("Are you sure you want to delete this Category? Services inside it will lose their category.")) {
      try {
        await deleteMainService(id);
      } catch (err) {
        handleFrontendError(err, "Failed to delete category", { showAlert: true });
      }
    }
  };

  // --- Handlers for Semi Service Modal ---
  const handleOpenSemiModal = (semi = null, defaultMainId = "") => {
    if (semi) {
      setEditingSemiService(semi);
      setSemiFormData({
        name: semi.name, mainService: semi.mainService?._id || semi.mainService || "", order: semi.order, isActive: semi.isActive,
      });
    } else {
      setEditingSemiService(null);
      setSemiFormData({
        name: "", mainService: defaultMainId, order: semiServices.filter(s => s.mainService === defaultMainId).length + 1, isActive: true,
      });
    }
    setIsSemiModalOpen(true);
  };

  const handleCloseSemiModal = () => {
    setIsSemiModalOpen(false);
    setEditingSemiService(null);
  };

  const handleSemiChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSemiFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === "order" ? Number(value) : value),
    }));
  };

  const handleSemiSubmit = async (e) => {
    e.preventDefault();
    if (!semiFormData.name.trim() || !semiFormData.mainService) return toast.error("Name and Main Category are required");
    setSubmitting(true);
    try {
      const res = editingSemiService 
        ? await updateSemiService(editingSemiService._id, semiFormData)
        : await addSemiService(semiFormData, portal);
      if (res.success) {
        toast.success(editingSemiService ? "Semi-Category updated successfully!" : "Semi-Category added successfully!");
        handleCloseSemiModal();
      } else {
        toast.error(res.message || "Failed to save semi-category");
      }
    } catch (err) {
      handleFrontendError(err, "Failed to save semi-category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSemi = async (id) => {
    if (window.confirm("Are you sure you want to delete this Semi-Category? Services inside it will lose this association.")) {
      try {
        await deleteSemiService(id);
      } catch (err) {
        handleFrontendError(err, "Failed to delete semi-category", { showAlert: true });
      }
    }
  };

  // --- Handlers for Drag and Drop Reordering (Framer Motion) ---
  const handleReorderList = async (itemType, newList) => {
    // Assign new orders based on array index + 1 so it starts from 1
    const items = newList.map((item, i) => ({
      id: item._id,
      order: ++i
    }));

    setSubmitting(true);
    try {
      await reorderItems(itemType, items);
      await fetchServicesData(portal);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Handlers for Service Modal ---
  const handleOpenModal = (service = null, defaultMainId = "", defaultSemiId = "") => {
    if (service) {
      setEditingService(service);
      setFormData({ 
        ...service,
        mainService: service.mainService?._id || service.mainService || "",
        semiService: service.semiService?._id || service.semiService || "",
        documentsRequired: service.documentsRequired?.length ? service.documentsRequired : [""],
        processSteps: service.processSteps?.length ? service.processSteps : [""],
        faqs: service.faqs?.length ? service.faqs : [{ q: "", a: "" }],
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "", description: "", basePrice: 0, order: 1, billingCycle: "Fixed", icon: "document", slug: "", tag: "", mainService: defaultMainId, semiService: defaultSemiId, navSection: "", isActive: type === 'nav', isPopular: type === 'popular', documentsRequired: [""], processSteps: [""], faqs: [{ q: "", a: "" }],
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

  const addArrayItem = (field, defaultVal = "") => setFormData({ ...formData, [field]: [...formData[field], defaultVal] });
  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || formData.basePrice === "" || formData.basePrice < 0) {
      toast.error("Valid Name, Slug, and Base Price are required.");
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

    try {
      const res = editingService 
        ? await updateService(editingService._id, cleanedData)
        : await addService(cleanedData, portal);
      
      if (res.success) {
        toast.success(editingService ? "Service updated successfully!" : "Service added successfully!");
        handleCloseModal();
      } else {
        toast.error(res.message || "Failed to save service");
      }
    } catch (err) {
      handleFrontendError(err, "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
      } catch (err) {
        handleFrontendError(err, "Failed to delete service", { showAlert: true });
      }
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
        <button onClick={refetch} className="mt-2 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors border-none cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const displayServices = services.filter(s => {
    const matchesType = type === 'nav' ? s.isActive !== false : s.isPopular === true;
    if (!matchesType) return false;
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(searchLower) ||
      (s.slug || "").toLowerCase().includes(searchLower) ||
      (s.description || "").toLowerCase().includes(searchLower) ||
      (s.mainService?.name || "").toLowerCase().includes(searchLower)
    );
  });

  const uncategorizedServices = displayServices.filter(s => {
    const mainId = s.mainService?._id || s.mainService;
    return !mainId || !mainServices.some(m => m._id === mainId);
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-white text-gray-900"
            />
          </div>
          {type === 'nav' && (
            <button
              onClick={() => handleOpenMainModal()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#1A56DB] text-[#1A56DB] text-sm font-medium hover:bg-blue-50 transition-colors bg-white cursor-pointer"
            >
              + Add Category
            </button>
          )}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer border-0"
          >
            + Add Service
          </button>
        </div>
      </div>

      {type === 'nav' ? (
        <CategoryList 
          mainServices={mainServices.sort((a,b) => (a.order || 0) - (b.order || 0))}
          semiServices={semiServices}
          displayServices={displayServices}
          searchTerm={searchTerm}
          handleReorderMain={(newOrder) => handleReorderList('main', newOrder)}
          handleReorderSemi={(mainId, newOrder) => handleReorderList('semi', newOrder)}
          handleReorderService={(semiId, newOrder) => handleReorderList('service', newOrder)}
          handleOpenMainModal={handleOpenMainModal}
          handleDeleteMain={handleDeleteMain}
          handleOpenSemiModal={handleOpenSemiModal}
          handleDeleteSemi={handleDeleteSemi}
          handleOpenServiceModal={handleOpenModal}
          handleDeleteService={handleDelete}
        />
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
                      <button onClick={() => handleOpenModal(service)} className="text-blue-600 hover:text-blue-900 mr-4 border-none bg-transparent cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900 border-none bg-transparent cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {uncategorizedServices.length > 0 && type === 'nav' && (
        <div className="mt-4 border border-amber-200 rounded-lg shadow-sm bg-amber-50/10 overflow-hidden">
          <div className="w-full flex items-center justify-between p-4 bg-amber-50/20 hover:bg-amber-50/30 transition-colors">
            <h3 className="text-md font-bold text-amber-900 flex-1">Other Services (Uncategorized)</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
              Fallback Category
            </span>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uncategorizedServices.map((service) => (
                <div key={service._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleOpenModal(service)} className="text-blue-600 hover:text-blue-800 border-none bg-transparent cursor-pointer" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="text-red-500 hover:text-red-700 border-none bg-transparent cursor-pointer" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 pr-12">{service.name}</h4>
                  <p className="text-xs text-gray-500 mb-2 truncate" title={service.slug}>{service.slug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CategoryModal
        isOpen={isMainModalOpen}
        onClose={handleCloseMainModal}
        editingMainService={editingMainService}
        mainFormData={mainFormData}
        handleMainChange={handleMainChange}
        handleMainSubmit={handleMainSubmit}
        submitting={submitting}
      />

      <SemiCategoryModal
        isOpen={isSemiModalOpen}
        onClose={handleCloseSemiModal}
        editingSemiService={editingSemiService}
        semiFormData={semiFormData}
        handleSemiChange={handleSemiChange}
        handleSemiSubmit={handleSemiSubmit}
        mainServices={mainServices}
        submitting={submitting}
      />

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={type}
        editingService={editingService}
        formData={formData}
        handleChange={handleChange}
        handleArrayChange={handleArrayChange}
        handleFaqChange={handleFaqChange}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
        handleSubmit={handleSubmit}
        mainServices={mainServices}
        semiServices={semiServices}
        submitting={submitting}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
