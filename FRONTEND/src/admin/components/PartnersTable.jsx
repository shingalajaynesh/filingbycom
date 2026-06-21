import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

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

export default function PartnersTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { fetchPartners, updatePartnerStatus } = useAdminContext();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPartners();
      if (data.success) {
        setApplications(data.applications);
      } else {
        throw new Error(data.message || "Failed to load partner applications");
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Failed to load partner applications");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchPartners]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
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
    amenities: [],
    status: ""
  });
  const [modalUploading, setModalUploading] = useState(false);

  const openEditModal = (app) => {
    setEditForm({
      _id: app._id,
      spaceName: app.spaceName || "",
      ownerName: app.ownerName || "",
      email: app.email || "",
      mobile: app.mobile || "",
      city: app.city || "",
      spaceType: app.spaceType || "",
      deskCount: app.deskCount || "",
      address: app.address || "",
      price: app.price || "",
      image: app.image || "",
      images: app.images || (app.image ? [app.image] : []),
      priceGST: app.priceGST || app.price || "",
      priceIncorp: app.priceIncorp || (app.price ? String(Number(app.price) + 300) : ""),
      priceMail: app.priceMail || (app.price ? String(Math.max(100, Number(app.price) - 400)) : ""),
      descGST: app.descGST || "",
      descIncorp: app.descIncorp || "",
      descMail: app.descMail || "",
      description: app.description || "",
      amenities: app.amenities || [],
      status: app.status || "Pending"
    });
    setIsModalOpen(true);
  };

  const handleModalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setModalUploading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uploaderData = new FormData();
        uploaderData.append("image", file);

        const res = await axios.post(
          `${API_BASE_CLEANED}/admin/virtual-space/upload-image`,
          uploaderData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          }
        );

        if (res.data.success) {
          uploadedUrls.push(res.data.url);
        } else {
          toast.error(res.data.message || `Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setEditForm(prev => {
          const newImages = [...(prev.images || []), ...uploadedUrls];
          return {
            ...prev,
            images: newImages,
            image: newImages[0] || ""
          };
        });
        toast.success("Image(s) uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    } finally {
      setModalUploading(false);
      toast.dismiss(toastId);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Saving changes & syncing workspace...");
    try {
      const payload = {
        status: editForm.status,
        spaceName: editForm.spaceName,
        ownerName: editForm.ownerName,
        email: editForm.email,
        mobile: editForm.mobile,
        city: editForm.city,
        spaceType: editForm.spaceType,
        deskCount: editForm.deskCount ? Number(editForm.deskCount) : undefined,
        address: editForm.address,
        price: String(editForm.price),
        images: editForm.images,
        description: editForm.description,
        amenities: editForm.amenities,
        priceGST: String(editForm.priceGST),
        priceIncorp: String(editForm.priceIncorp),
        priceMail: String(editForm.priceMail),
        descGST: editForm.descGST || "",
        descIncorp: editForm.descIncorp || "",
        descMail: editForm.descMail || ""
      };

      const data = await updatePartnerStatus(editForm._id, payload);
      if (data.success) {
        toast.success("Workspace saved & synced successfully!", { id: toastId });
        setIsModalOpen(false);
        fetchApplications();
      } else {
        throw new Error(data.message || "Failed to update workspace");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating workspace", { id: toastId });
    }
  };

  const handleSync = async (item) => {
    const toastId = toast.loading("Syncing workspace with VirtualLocation...");
    try {
      const data = await updatePartnerStatus(item._id, {
        status: "Approved",
        spaceName: item.spaceName,
        ownerName: item.ownerName,
        email: item.email,
        mobile: item.mobile,
        city: item.city,
        spaceType: item.spaceType,
        deskCount: item.deskCount,
        address: item.address,
        price: item.price,
        images: item.images,
        description: item.description,
        amenities: item.amenities,
        priceGST: item.priceGST || item.price,
        priceIncorp: item.priceIncorp || String(Number(item.price) + 300),
        priceMail: item.priceMail || String(Math.max(100, Number(item.price) - 400))
      });
      if (data.success) {
        toast.success("Workspace synced successfully", { id: toastId });
        fetchApplications();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync workspace", { id: toastId });
    }
  };

  const handleQuickApprove = async (item) => {
    const toastId = toast.loading("Approving & syncing workspace...");
    try {
      const data = await updatePartnerStatus(item._id, {
        status: "Approved",
        spaceName: item.spaceName,
        ownerName: item.ownerName,
        email: item.email,
        mobile: item.mobile,
        city: item.city,
        spaceType: item.spaceType,
        deskCount: item.deskCount,
        address: item.address,
        price: item.price,
        images: item.images,
        description: item.description,
        amenities: item.amenities,
        priceGST: item.priceGST || item.price,
        priceIncorp: item.priceIncorp || String(Number(item.price) + 300),
        priceMail: item.priceMail || String(Math.max(100, Number(item.price) - 400))
      });
      if (data.success) {
        toast.success("Workspace approved & synced", { id: toastId });
        fetchApplications();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve workspace", { id: toastId });
    }
  };

  const handleQuickReject = async (item) => {
    if (!window.confirm("Are you sure you want to reject this onboarding application?")) return;
    const toastId = toast.loading("Rejecting application...");
    try {
      const data = await updatePartnerStatus(item._id, "Rejected");
      if (data.success) {
        toast.success("Workspace application rejected", { id: toastId });
        fetchApplications();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject workspace", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading landlord onboarding applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-650 font-medium">{error}</p>
        <button
          onClick={fetchApplications}
          className="mt-2 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredApplications = applications.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.spaceName || "").toLowerCase().includes(searchLower) ||
      (item.ownerName || "").toLowerCase().includes(searchLower) ||
      (item.email || "").toLowerCase().includes(searchLower) ||
      (item.mobile || "").toLowerCase().includes(searchLower) ||
      (item.city || "").toLowerCase().includes(searchLower) ||
      (item.spaceType || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="relative font-sans text-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Partner Workspace Onboardings</h2>
          <p className="text-sm text-gray-500">Commercial real estate space hosting applications</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-white text-gray-955"
            />
          </div>
          <button
            onClick={fetchApplications}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#1A56DB] border border-blue-200 hover:bg-blue-50 transition-colors bg-white cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Redesigned Admin Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-150">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Center Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Onboarding Contact</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Workspace Parameters</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-150">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm font-semibold">
                  {searchTerm ? `No applications found matching "${searchTerm}"` : "No applications found."}
                </td>
              </tr>
            ) : (
              filteredApplications.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm relative">
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} alt="Workspace" className="w-full h-full object-cover" />
                        ) : item.image ? (
                          <img src={item.image} alt="Workspace" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">No Image</div>
                        )}
                        {item.images && item.images.length > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] font-black px-1 py-0.2 rounded-md">
                            +{item.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-905 leading-snug">{item.spaceName}</div>
                        <div className="text-xs text-gray-550 mt-0.5">City: <span className="font-semibold text-gray-800">{item.city}</span></div>
                        <div className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-850">{item.ownerName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.email}</div>
                    <div className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1.5">
                      <span>📞 {item.mobile}</span>
                      <a
                        href={`https://wa.me/${item.mobile.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 hover:underline font-bold text-[10px]"
                      >
                        [WhatsApp]
                      </a>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 max-w-sm">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.spaceType}</span>
                        {item.deskCount ? (
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.deskCount} Desks</span>
                        ) : (
                          <span className="text-[10px] font-black text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Optional Cap</span>
                        )}
                      </div>
                      {item.address && (
                        <div className="text-xs text-gray-700 leading-tight">
                          <span className="font-bold text-gray-550">Address:</span> {item.address}
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-gray-550 italic leading-snug line-clamp-1" title={item.description}>
                          "{item.description}"
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Pricing details column showing Payout vs Public Seen price */}
                  <td className="px-6 py-4">
                    <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100/60 w-fit">
                      <div className="text-[10px] font-black text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded-full w-fit">
                        Payout: ₹{item.price || "N/A"}
                      </div>
                      <div className="text-[11px] text-gray-700 space-y-0.5 font-semibold pl-1.5">
                        <div>GST: <span className="font-bold text-blue-600">₹{item.priceGST || item.price || "N/A"}</span></div>
                        <div>Incorp: <span className="font-bold text-indigo-600">₹{item.priceIncorp || (item.price ? String(Number(item.price) + 300) : "N/A")}</span></div>
                        <div>Mail: <span className="font-bold text-purple-600">₹{item.priceMail || (item.price ? String(Math.max(100, Number(item.price) - 400)) : "N/A")}</span></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-black uppercase tracking-wider rounded-full ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-y-2">
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-bold bg-blue-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer w-24 text-center"
                      >
                        Review & Edit
                      </button>
                      <div className="flex gap-2">
                        {item.status === "Approved" ? (
                          <button
                            onClick={() => handleSync(item)}
                            className="text-green-600 hover:text-green-800 hover:underline font-bold bg-green-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Sync
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuickApprove(item)}
                            className="text-emerald-600 hover:text-emerald-800 hover:underline font-bold bg-emerald-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleQuickReject(item)}
                          className={`text-red-600 hover:text-red-800 hover:underline font-bold bg-red-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                            item.status === "Rejected" ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                          }`}
                          disabled={item.status === "Rejected"}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Premium Edit / Sync Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-fadeInUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#0F172A] to-[#1e40af] text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-black tracking-tight">Review & Edit Workspace Details</h3>
                <p className="text-xs text-gray-300">Configure partner share and actual public seen prices to sync with VirtualLocation</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleModalSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                  General Parameters
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Center/Space Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.spaceName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, spaceName: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">City / Region</label>
                    <input
                      type="text"
                      required
                      value={editForm.city}
                      onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Application Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Approved">Approved / Synced</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Space Layout Type</label>
                    <select
                      value={editForm.spaceType}
                      onChange={(e) => setEditForm(prev => ({ ...prev, spaceType: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    >
                      <option value="coworking">Coworking Space</option>
                      <option value="private-office">Private Commercial Office Building</option>
                      <option value="retail">Commercial Shopping Center / Complex</option>
                      <option value="other">Industrial Desk Area</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Desk Count Capacity (Optional)</label>
                    <input
                      type="number"
                      value={editForm.deskCount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, deskCount: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Landlord/Contact Person</label>
                    <input
                      type="text"
                      required
                      value={editForm.ownerName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, ownerName: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      required
                      value={editForm.mobile}
                      onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                  Pricing & Settlement Configurations (₹)
                </h4>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                  {/* Row 1: Settlement & GST Plan */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold text-orange-600 uppercase block mb-1">Partner Share (Payout)</label>
                      <input
                        type="number"
                        required
                        value={editForm.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditForm(prev => ({
                            ...prev,
                            price: val,
                            priceGST: prev.priceGST ? prev.priceGST : val,
                            priceIncorp: prev.priceIncorp ? prev.priceIncorp : val ? String(Number(val) + 300) : "",
                            priceMail: prev.priceMail ? prev.priceMail : val ? String(Math.max(100, Number(val) - 400)) : ""
                          }));
                        }}
                        className="w-full text-xs font-extrabold px-3 py-2 rounded-lg border border-orange-200 bg-white focus:ring-2 focus:ring-orange-500/20 outline-none text-orange-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">Public GST Price</label>
                      <input
                        type="number"
                        required
                        value={editForm.priceGST}
                        onChange={(e) => setEditForm(prev => ({ ...prev, priceGST: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-250 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">GST Plan Description</label>
                      <input
                        type="text"
                        value={editForm.descGST}
                        onChange={(e) => setEditForm(prev => ({ ...prev, descGST: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-250 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                        placeholder="e.g. Government NOC, utility bills, physical inspection support..."
                      />
                    </div>
                  </div>

                  {/* Row 2: Incorp Plan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">Public Incorp Price</label>
                      <input
                        type="number"
                        required
                        value={editForm.priceIncorp}
                        onChange={(e) => setEditForm(prev => ({ ...prev, priceIncorp: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-250 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">Incorp Plan Description</label>
                      <input
                        type="text"
                        value={editForm.descIncorp}
                        onChange={(e) => setEditForm(prev => ({ ...prev, descIncorp: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-250 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                        placeholder="e.g. ROC compliant NOC, Consent Letter, Board placement..."
                      />
                    </div>
                  </div>

                  {/* Row 3: Mail Plan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">Public Mail Price</label>
                      <input
                        type="number"
                        required
                        value={editForm.priceMail}
                        onChange={(e) => setEditForm(prev => ({ ...prev, priceMail: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-250 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-655 uppercase block mb-1">Mailing Plan Description</label>
                      <input
                        type="text"
                        value={editForm.descMail}
                        onChange={(e) => setEditForm(prev => ({ ...prev, descMail: e.target.value }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-250 bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900"
                        placeholder="e.g. Courier logging, scan & forward mail, receptionist..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Text content */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                  Details & Copywriting
                </h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Full Postal Address</label>
                  <textarea
                    required
                    rows="2"
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-650 uppercase block mb-1">Workspace Description</label>
                  <textarea
                    rows="3"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 resize-none"
                  />
                </div>
              </div>

              {/* Section 4: Amenities Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                  Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {DEFAULT_AMENITIES.map((amenity) => {
                    const isChecked = editForm.amenities.includes(amenity);
                    return (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setEditForm(prev => {
                              const current = prev.amenities || [];
                              const updated = current.includes(amenity)
                                ? current.filter(a => a !== amenity)
                                : [...current, amenity];
                              return { ...prev, amenities: updated };
                            });
                          }}
                          className="w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-blue-500/20"
                        />
                        {amenity}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Photos upload & edit */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                  Workspace Images (Direct Upload)
                </h4>
                
                {/* Thumbnails grid */}
                {editForm.images && editForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    {editForm.images.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-250">
                        <img src={url} alt={`Workspace img ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm(prev => {
                              const newImages = prev.images.filter((_, i) => i !== idx);
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
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">Cover</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add more trigger */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleModalImageUpload}
                    disabled={modalUploading}
                    className="hidden"
                    id="modal-images-upload-trigger"
                  />
                  <label
                    htmlFor="modal-images-upload-trigger"
                    className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 transition-all ${
                      modalUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-700">
                      {modalUploading ? "Uploading image..." : "+ Upload More Workspace Photos"}
                    </span>
                  </label>
                </div>
              </div>

            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={modalUploading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Save & Sync Workspace
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
