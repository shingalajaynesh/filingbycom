import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { safeFetch } from "../../shared/utils/api";

export default function PartnersTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch("/admin/virtual-space/partner-onboarding", {
        credentials: "include",
      });
      if (data.success) {
        setApplications(data.applications);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to load partner applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    try {
      const data = await safeFetch(`/admin/virtual-space/partner-onboarding/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (data.success) {
        setApplications((prev) => prev.map((item) => (item._id === id ? data.application : item)));
        toast.success(`Application updated to ${newStatus}`);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Partner Workspace Onboardings</h2>
          <p className="text-sm text-gray-500">Commercial real estate space hosting applications</p>
        </div>
        <button
          onClick={fetchApplications}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#1A56DB] border border-blue-200 hover:bg-blue-50 transition-colors"
        >
          Refresh
        </button>
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
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item.spaceName}</div>
                    <div className="text-xs text-gray-500">City: <span className="font-semibold text-gray-800">{item.city}</span></div>
                    <div className="text-xs text-gray-400 mt-1">
                      Submitted: {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full w-fit capitalize">{item.spaceType}</div>
                    <div className="text-xs font-semibold text-gray-700 mt-1.5">Capacity: <span className="font-bold">{item.deskCount} Desks</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${
                      item.status === "Approved"
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
                      className={`text-green-600 hover:underline ${item.status === "Approved" ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={item.status === "Approved"}
                    >
                      Approve
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
