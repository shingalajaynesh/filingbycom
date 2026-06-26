import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

export default function AdminReviews({ portal }) {
  const {
    reviews,
    services,
    fetchAdminReviews,
    addReview,
    updateReview,
    deleteReview,
    fetchServicesData,
    fetchAdminLocations,
  } = useAdminContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPageType, setFilterPageType] = useState("all");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    authorName: "",
    businessName: "",
    rating: 5,
    comment: "",
    pageType: "home",
    service: "",
    virtualLocation: "",
    officeCenter: "",
    initials: "",
    color: "",
    isActive: true,
  });

  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const promises = [
          fetchAdminReviews(portal),
          fetchServicesData(portal),
        ];
        if (portal === "virtual-space" && fetchAdminLocations) {
          promises.push(fetchAdminLocations());
        }
        const results = await Promise.all(promises);
        if (portal === "virtual-space" && results[2] && results[2].success) {
          setLocationsList(results[2].locations || []);
        }
        setLoading(false);
      } catch (err) {
        const msg = handleFrontendError(err, "Failed to load reviews", { silent: true });
        setError(msg);
        setLoading(false);
      }
    };
    initData();
  }, [fetchAdminReviews, fetchServicesData, fetchAdminLocations, portal]);

  const refetch = async () => {
    try {
      setError(null);
      setLoading(true);
      await fetchAdminReviews(portal);
      setLoading(false);
    } catch (err) {
      const msg = handleFrontendError(err, "Failed to reload reviews", { silent: true });
      setError(msg);
      setLoading(false);
    }
  };

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        authorName: review.authorName || "",
        businessName: review.businessName || "",
        rating: review.rating || 5,
        comment: review.comment || "",
        pageType: review.pageType || "home",
        service: review.service?._id || review.service || "",
        virtualLocation: review.virtualLocation?._id || review.virtualLocation || "",
        officeCenter: review.officeCenter || "",
        initials: review.initials || "",
        color: review.color || "",
        isActive: review.isActive !== undefined ? review.isActive : true,
      });
    } else {
      setEditingReview(null);
      setFormData({
        authorName: "",
        businessName: "",
        rating: 5,
        comment: "",
        pageType: "home",
        service: services[0]?._id || "",
        virtualLocation: locationsList[0]?._id || "",
        officeCenter: "",
        initials: "",
        color: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "rating"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.authorName.trim()) {
      toast.error("Author Name is required");
      return;
    }
    if (!formData.comment.trim()) {
      toast.error("Comment is required");
      return;
    }
    if (formData.pageType === "service" && !formData.service) {
      toast.error("Please select a service for this service-specific review");
      return;
    }
    if (formData.pageType === "location" && !formData.virtualLocation) {
      toast.error("Please select a location for this location-specific review");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      const payload = { ...formData, portal };
      if (payload.pageType === "home") {
        delete payload.service;
        delete payload.virtualLocation;
        delete payload.officeCenter;
      } else if (payload.pageType === "service") {
        delete payload.virtualLocation;
        delete payload.officeCenter;
      } else if (payload.pageType === "location") {
        delete payload.service;
      }

      if (editingReview) {
        res = await updateReview(editingReview._id, payload);
      } else {
        res = await addReview(payload);
      }

      if (res.success) {
        handleCloseModal();
      }
    } catch (err) {
      handleFrontendError(err, "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      try {
        await deleteReview(id);
      } catch (err) {
        handleFrontendError(err, "Failed to delete review", { showAlert: true });
      }
    }
  };

  const handleStatusToggle = async (review) => {
    try {
      const updatedStatus = !review.isActive;
      const res = await updateReview(review._id, {
        ...review,
        portal: review.portal || portal,
        service: review.service?._id || review.service || null,
        virtualLocation: review.virtualLocation?._id || review.virtualLocation || null,
        officeCenter: review.officeCenter || null,
        initials: review.initials || "",
        color: review.color || "",
        isActive: updatedStatus,
      });
      if (res.success) {
        toast.success(`Review ${updatedStatus ? "activated" : "deactivated"} successfully`);
      }
    } catch (err) {
      handleFrontendError(err, "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-650 font-semibold">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 px-5 py-2.5 rounded-lg bg-[#1A56DB] text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      (r.authorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.businessName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPageType =
      filterPageType === "all" || r.pageType === filterPageType;

    return matchesSearch && matchesPageType;
  });

  return (
    <div className="space-y-6">
      {/* Top action and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-white text-gray-900"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterPageType}
            onChange={(e) => setFilterPageType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-white text-gray-905 font-medium"
          >
            <option value="all">All Placement Types</option>
            <option value="home">Homepage reviews</option>
            <option value="service">Service Specific reviews</option>
            {portal === "virtual-space" && (
              <option value="location">Location / Office Center reviews</option>
            )}
          </select>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1A56DB] text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm border-0 cursor-pointer whitespace-nowrap"
        >
          <span>+ Add Client Review</span>
        </button>
      </div>

      {/* Reviews Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-550 uppercase tracking-wider">Client Info</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-550 uppercase tracking-wider">Rating & Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-550 uppercase tracking-wider">Placement</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-550 uppercase tracking-wider">Active Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-550 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                    No reviews found. Click "+ Add Client Review" to configure one.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{review.authorName}</div>
                      <div className="text-xs text-gray-450 font-medium">{review.businessName || "—"}</div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center text-yellow-400 mb-1">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                        {Array.from({ length: 5 - (review.rating || 5) }).map((_, i) => (
                          <span key={i} className="text-gray-300">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-650 italic line-clamp-2" title={review.comment}>
                        "{review.comment}"
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {review.pageType === "home" ? (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          🏠 Homepage
                        </span>
                      ) : review.pageType === "location" ? (
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            📍 Location Page
                          </span>
                          <div className="text-xs text-gray-600 font-semibold truncate max-w-[150px]" title={`${review.virtualLocation?.name || "Unknown City"} ${review.officeCenter ? `(${review.officeCenter})` : ""}`}>
                            {review.virtualLocation?.name || "Unassociated"} {review.officeCenter ? `— ${review.officeCenter}` : ""}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            ⚙️ Service Page
                          </span>
                          <div className="text-xs text-gray-600 font-semibold truncate max-w-[150px]" title={review.service?.name || "Unknown Service"}>
                            {review.service?.name || "Unassociated"}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(review)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          review.isActive ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            review.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                      <button
                        onClick={() => handleOpenModal(review)}
                        className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-650 hover:text-red-950 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-fadeInUp">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingReview ? "Edit Client Review" : "Configure New Client Review"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-650 focus:outline-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
              <form id="review-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Author Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Author Name *</label>
                  <input
                    required
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Business / Company */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Business Name & Designation (Optional)</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. CEO, Kumar Logistics"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Rating & Placement Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Star Rating</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-905 bg-white font-medium"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                      <option value="3">⭐⭐⭐ (3 stars)</option>
                      <option value="2">⭐⭐ (2 stars)</option>
                      <option value="1">⭐ (1 star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Placement Page Type</label>
                    <select
                      name="pageType"
                      value={formData.pageType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-905 bg-white font-medium"
                    >
                      <option value="home">Homepage reviews</option>
                      <option value="service">Service-specific page</option>
                      {portal === "virtual-space" && (
                        <option value="location">Location / Office Center page</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Associated Service Selection */}
                {formData.pageType === "service" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Associated Service *</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-905 bg-white font-medium"
                    >
                      <option value="">-- Choose Service --</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} ({service.portal})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Associated Location Selection */}
                {formData.pageType === "location" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Associated Location (City) *</label>
                      <select
                        name="virtualLocation"
                        value={formData.virtualLocation}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-905 bg-white font-medium"
                      >
                        <option value="">-- Choose City --</option>
                        {locationsList.map((loc) => (
                          <option key={loc._id} value={loc._id}>
                            {loc.name} ({loc.state})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Associated Office Center</label>
                      <select
                        name="officeCenter"
                        value={formData.officeCenter}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-905 bg-white font-medium"
                      >
                        <option value="">-- All Centers / City-Level --</option>
                        {locationsList.find(loc => loc._id === formData.virtualLocation)?.addresses?.map((addr) => (
                          <option key={addr.slug} value={addr.slug}>
                            {addr.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Virtual Space specific styling (Initials & Avatar Color) */}
                {portal === "virtual-space" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Client Avatar Initials (Optional)</label>
                      <input
                        type="text"
                        name="initials"
                        maxLength="2"
                        value={formData.initials}
                        onChange={handleChange}
                        placeholder="e.g. AB"
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Avatar Color Theme</label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-905 bg-white font-medium"
                      >
                        <option value="">-- Default Blue (bg-[#1A56DB]) --</option>
                        <option value="bg-blue-600">Blue (bg-blue-600)</option>
                        <option value="bg-emerald-600">Emerald (bg-emerald-600)</option>
                        <option value="bg-blue-700">Deep Blue (bg-blue-700)</option>
                        <option value="bg-indigo-650">Indigo (bg-indigo-650)</option>
                        <option value="bg-[#0E1528]">Dark Slate (bg-[#0E1528])</option>
                        <option value="bg-emerald-700">Deep Emerald (bg-emerald-700)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Client Feedback Comment */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Client Feedback Comment *</label>
                  <textarea
                    required
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Provide the client's detailed testimonial..."
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Active Toggle Switch */}
                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-[#1A56DB] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-gray-750 cursor-pointer select-none">
                    Publish immediately (Active)
                  </label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-750 hover:bg-gray-100 transition-colors bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="review-form"
                disabled={submitting}
                className="px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
