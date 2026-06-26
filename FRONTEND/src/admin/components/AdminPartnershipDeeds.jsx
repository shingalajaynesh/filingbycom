import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

export default function AdminPartnershipDeeds() {
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchDeeds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/admin/partnership-deed`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setDeeds(res.data.deeds);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch deeds records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeeds();
  }, []);

  const handleBypass = async (deedId) => {
    if (!window.confirm("Are you sure you want to bypass payment and generate the Partnership Deed PDF? This will log an audit entry.")) return;
    
    setActionLoadingId(deedId);
    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/partnership-deed/${deedId}/bypass-payment`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Payment bypassed and PDF generated successfully!");
        fetchDeeds();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to bypass payment");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDownload = async (deedId, businessName) => {
    setActionLoadingId(deedId);
    try {
      const res = await axios.get(`${API_BASE}/api/partnership-deed/${deedId}/download`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PartnershipDeed_${businessName.replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err) {
      toast.error("Failed to download file. Please check if it was generated.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredDeeds = deeds.filter((deed) => {
    const searchLower = searchTerm.toLowerCase();
    const bizName = (deed.businessName || "").toLowerCase();
    const userEmail = (deed.userId?.email || "").toLowerCase();
    const userName = `${deed.userId?.firstName || ""} ${deed.userId?.lastName || ""}`.toLowerCase();
    return bizName.includes(searchLower) || userEmail.includes(searchLower) || userName.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading deeds...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div>
          <h2 className="text-sm font-black text-gray-800 uppercase">Partnership Deeds ({filteredDeeds.length})</h2>
          <p className="text-xs text-gray-500 mt-0.5">Audit customer configurations and trigger manual payment bypasses.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search deeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] bg-slate-55/30"
          />
        </div>
      </div>

      {/* Deeds Grid / Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-550 uppercase tracking-wider">
              <th className="p-4">Customer Details</th>
              <th className="p-4">Business & Activity</th>
              <th className="p-4">Deed Date</th>
              <th className="p-4 text-center">Payment Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeeds.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 font-medium">
                  No partnership deeds records found
                </td>
              </tr>
            ) : (
              filteredDeeds.map((deed) => {
                const totalShares = deed.partners.reduce((sum, p) => sum + Number(p.profitSharePercent || 0), 0);
                const isShareValid = Math.abs(totalShares - 100) < 0.01;

                return (
                  <tr key={deed._id} className="border-b border-gray-150 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">
                        {deed.userId?.firstName || "Unknown"} {deed.userId?.lastName || ""}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{deed.userId?.email || ""}</div>
                      <div className="text-xs text-gray-500">{deed.userId?.phone || ""}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-black text-gray-800 uppercase">M/S. {deed.businessName}</div>
                      <div className="text-xs text-gray-550 mt-0.5 truncate max-w-xs">{deed.businessActivity}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1">
                        {deed.partners.length} Partners · Profit Shares: {totalShares.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-xs font-semibold text-gray-700">
                      {deed.deedDate ? new Date(deed.deedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                          deed.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : deed.paymentStatus === "bypassed"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {deed.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {deed.paymentStatus === "pending" ? (
                          <button
                            onClick={() => handleBypass(deed._id)}
                            disabled={actionLoadingId === deed._id || !isShareValid}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all active:scale-95 ${
                              isShareValid
                                ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                : "bg-gray-300 cursor-not-allowed text-gray-500"
                            }`}
                            title={!isShareValid ? "Profit share sum must equal 100% to bypass" : "Bypass payment"}
                          >
                            {actionLoadingId === deed._id ? "Processing..." : "Bypass Pay"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDownload(deed._id, deed.businessName)}
                            disabled={actionLoadingId === deed._id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-green-600 hover:bg-green-750 transition-all active:scale-95 cursor-pointer"
                          >
                            {actionLoadingId === deed._id ? "Loading..." : "Download PDF"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
