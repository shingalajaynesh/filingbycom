import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAdminContext } from "../../shared/context/AdminContext";
import { handleFrontendError } from "../../shared/utils/errorHandler";

export default function LeadsTable() {
  const [inquiries, setInquiries] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadTypeFilter, setLeadTypeFilter] = useState("all"); // all, inquiry, quote
  const [statusFilter, setStatusFilter] = useState("all"); // all, Pending, Contacted, Closed

  const { fetchInquiries, fetchQuotes, updateInquiryStatus, updateQuoteStatus } = useAdminContext();

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [inqData, quoteData] = await Promise.all([
        fetchInquiries(),
        fetchQuotes()
      ]);
      
      if (inqData.success) {
        setInquiries(inqData.inquiries || []);
      } else {
        throw new Error(inqData.message || "Failed to load inquiries");
      }

      if (quoteData.success) {
        setQuotes(quoteData.leads || []);
      } else {
        throw new Error(quoteData.message || "Failed to load quote leads");
      }
    } catch (err) {
      const msg = handleFrontendError(err, "Failed to load leads");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchInquiries, fetchQuotes]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleStatusChange = async (id, type, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    try {
      let data;
      if (type === "inquiry") {
        data = await updateInquiryStatus(id, newStatus);
      } else {
        data = await updateQuoteStatus(id, newStatus);
      }

      if (data.success) {
        toast.success(`Lead updated to ${newStatus}`);
        loadLeads();
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err) {
      handleFrontendError(err, "Failed to update lead status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading leads data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <p className="text-red-655 font-medium">{error}</p>
        <button
          onClick={loadLeads}
          className="mt-2 px-4 py-2 rounded-md bg-[#1A56DB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer border-none"
        >
          Retry
        </button>
      </div>
    );
  }

  // Combine inquiries and quotes into a single list
  const combinedLeads = [
    ...inquiries.map(item => ({ ...item, leadType: "inquiry" })),
    ...quotes.map(item => ({ ...item, leadType: "quote" }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredLeads = combinedLeads.filter(item => {
    // Type filter
    if (leadTypeFilter !== "all" && item.leadType !== leadTypeFilter) return false;
    
    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) return false;

    // Search term
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(searchLower) ||
      (item.email || "").toLowerCase().includes(searchLower) ||
      (item.mobile || "").toLowerCase().includes(searchLower) ||
      (item.city || "").toLowerCase().includes(searchLower) ||
      (item.purpose || "").toLowerCase().includes(searchLower) ||
      (item.businessType || "").toLowerCase().includes(searchLower) ||
      (item.message || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      {/* Filters & Header block */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Virtual Space Leads & Calculator Quotes</h2>
          <p className="text-sm text-gray-500">Track and manage general inquires and quote calculator estimations in one unified space</p>
        </div>
        
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Search */}
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

          {/* Lead Type dropdown */}
          <select
            value={leadTypeFilter}
            onChange={(e) => setLeadTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-gray-800"
          >
            <option value="all">All Lead Sources</option>
            <option value="inquiry">General Inquiries</option>
            <option value="quote">Quote Calculator</option>
          </select>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB] text-gray-800"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>

          <button
            onClick={loadLeads}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#1A56DB] border border-blue-200 hover:bg-blue-50 transition-colors bg-white cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location & Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimate Price / Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                  No matching leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Name and contacts */}
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

                  {/* City and source */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">City: <span className="font-extrabold">{item.city}</span></div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase mt-1.5 ${
                      item.leadType === "inquiry"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-purple-50 text-purple-700 border border-purple-100"
                    }`}>
                      {item.leadType === "inquiry" ? "📥 General Form" : "🧮 Calculator"}
                    </span>
                  </td>

                  {/* Pricing / message details */}
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded-full w-fit mb-1">{item.purpose}</div>
                    {item.leadType === "quote" ? (
                      <div className="space-y-0.5">
                        <div className="text-xs text-purple-800 font-semibold">Biz Type: {item.businessType}</div>
                        <div className="text-sm font-bold text-gray-900">Estimated: <span className="text-[#1A56DB]">₹{item.estimatedPrice}</span>/mo</div>
                      </div>
                    ) : (
                      item.message && (
                        <div className="text-xs text-gray-500 mt-1 max-w-sm truncate" title={item.message}>
                          "{item.message}"
                        </div>
                      )
                    )}
                  </td>

                  {/* Timestamp */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* Status Badge */}
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

                  {/* Action links */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                    <button
                      onClick={() => handleStatusChange(item._id, item.leadType, item.status, "Contacted")}
                      className={`text-[#1A56DB] hover:underline ${item.status === "Contacted" ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={item.status === "Contacted"}
                    >
                      Mark Contacted
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleStatusChange(item._id, item.leadType, item.status, "Closed")}
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
