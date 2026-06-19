import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

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

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    try {
      const data = await updatePartnerStatus(id, newStatus);
      if (data.success) {
        toast.success(`Application updated to ${newStatus}`);
        fetchApplications();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      handleFrontendError(err, "Failed to update status");
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Partner Workspace Onboardings</h2>
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

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space Parameters</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                  {searchTerm ? `No applications found matching "${searchTerm}"` : "No applications found."}
                </td>
              </tr>
            ) : (
              filteredApplications.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex gap-3 items-start">
                      {item.image && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <img src={item.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-905">{item.spaceName}</div>
                        <div className="text-xs text-gray-500">City: <span className="font-semibold text-gray-800">{item.city}</span></div>
                        <div className="text-xs text-[#1A56DB] font-extrabold mt-1">Price: ₹{item.price || "999"}/mo</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.ownerName}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1.5">
                      <span>📞 {item.mobile}</span>
                      <a
                        href={`https://wa.me/${item.mobile.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-bold text-[10px]"
                      >
                        [WhatsApp]
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full capitalize">{item.spaceType}</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.deskCount} Desks</span>
                      </div>
                      {item.address && (
                        <div className="text-xs text-gray-800 leading-tight">
                          <span className="font-bold text-gray-600">Address:</span> {item.address}
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-gray-500 italic leading-snug line-clamp-2" title={item.description}>
                          "{item.description}"
                        </div>
                      )}
                      {item.amenities && item.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.amenities.map(amenity => (
                            <span key={amenity} className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${item.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                    <button
                      onClick={() => handleStatusChange(item._id, item.status, "Approved")}
                      className="text-green-600 hover:underline font-bold"
                    >
                      {item.status === "Approved" ? "Sync" : "Approve"}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleStatusChange(item._id, item.status, "Rejected")}
                      className={`text-red-650 hover:underline ${item.status === "Rejected" ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={item.status === "Rejected"}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
