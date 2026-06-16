import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchInquiries, updateInquiryStatus } = useAdminContext();

  const loadInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInquiries();
      if (data.success) {
        setInquiries(data.inquiries);
      } else {
        throw new Error(data.message || "Failed to load inquiries");
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    try {
      const data = await updateInquiryStatus(id, newStatus);
      if (data.success) {
        toast.success(`Inquiry updated to ${newStatus}`);
        loadInquiries();
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
        <p className="text-gray-500 text-sm font-medium">Loading inquiries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-650 font-medium">{error}</p>
        <button
          onClick={loadInquiries}
          onClick={loadInquiries}
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
          <h2 className="text-lg font-bold text-gray-900">Virtual Space Inquiries</h2>
          <p className="text-sm text-gray-500">General consultation leads from Virtual Space homepage</p>
        </div>
        <button
          onClick={loadInquiries}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#1A56DB] border border-blue-200 hover:bg-blue-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                  No inquiries found.
                </td>
              </tr>
            ) : (
              inquiries.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                    <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
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
                    <div className="text-xs font-bold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded-full w-fit mb-1">{item.purpose}</div>
                    <div className="text-sm font-medium text-gray-900">City: <span className="font-bold">{item.city}</span></div>
                    {item.message && <div className="text-xs text-gray-500 mt-1 max-w-sm truncate" title={item.message}>"{item.message}"</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${
                      item.status === "Closed"
                        ? "bg-gray-100 text-gray-800"
                        : item.status === "Contacted"
                        ? "bg-blue-100 text-[#1A56DB]"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                    <button
                      onClick={() => handleStatusChange(item._id, item.status, "Contacted")}
                      className={`text-[#1A56DB] hover:underline ${item.status === "Contacted" ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={item.status === "Contacted"}
                    >
                      Mark Contacted
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleStatusChange(item._id, item.status, "Closed")}
                      className={`text-gray-600 hover:underline ${item.status === "Closed" ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={item.status === "Closed"}
                    >
                      Close
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
