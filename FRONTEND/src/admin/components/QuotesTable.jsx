import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

export default function QuotesTable() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { fetchQuotes, updateQuoteStatus } = useAdminContext();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuotes();
      if (data.success) {
        setLeads(data.leads);
      } else {
        throw new Error(data.message || "Failed to load quote leads");
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Failed to load quote leads");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchQuotes]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    try {
      const data = await updateQuoteStatus(id, newStatus);
      if (data.success) {
        toast.success(`Lead status updated to ${newStatus}`);
        fetchLeads();
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
        <p className="text-gray-500 text-sm font-medium">Loading live quote calculations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-red-650 font-medium">{error}</p>
        <button
          onClick={fetchLeads}
          className="mt-2 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredLeads = leads.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(searchLower) ||
      (item.email || "").toLowerCase().includes(searchLower) ||
      (item.mobile || "").toLowerCase().includes(searchLower) ||
      (item.city || "").toLowerCase().includes(searchLower) ||
      (item.purpose || "").toLowerCase().includes(searchLower) ||
      (item.businessType || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Live Quote Leads</h2>
          <p className="text-sm text-gray-500">Estimates generated from the Quote Calculator tool</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent bg-white text-gray-955"
            />
          </div>
          <button
            onClick={fetchLeads}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimate Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                  {searchTerm ? `No quote calculations found matching "${searchTerm}"` : "No quote calculations found."}
                </td>
              </tr>
            ) : (
              filteredLeads.map((item) => (
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
                    <div className="text-sm font-medium text-gray-900">City: <span className="font-bold">{item.city}</span></div>
                    <div className="text-xs text-gray-550 flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-blue-50 text-[#1A56DB] px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">{item.purpose}</span>
                      <span className="bg-purple-50 text-purple-750 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">{item.businessType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-black text-[#1A56DB]">₹{item.estimatedPrice}*</div>
                    <span className="text-[10px] text-gray-400">/month</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${item.status === "Closed"
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
