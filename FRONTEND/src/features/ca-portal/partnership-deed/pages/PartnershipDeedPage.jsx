import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import PartnershipDeedForm from "../components/PartnershipDeedForm";
import PartnershipDeedPreview from "../components/PartnershipDeedPreview";
import PartnershipDeedPayment from "../components/PartnershipDeedPayment";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

export default function PartnershipDeedPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [deed, setDeed] = useState(null);
  const [formData, setFormData] = useState({
    businessName: "",
    businessActivity: "",
    officeAddress: "",
    deedDate: new Date().toISOString().split("T")[0],
    partners: [
      { id: "1", type: "individual", fullName: "", fatherName: "", companyName: "", address: "", profitSharePercent: 50, isManagingPartner: true, canOperateBankAccount: true },
      { id: "2", type: "individual", fullName: "", fatherName: "", companyName: "", address: "", profitSharePercent: 50, isManagingPartner: false, canOperateBankAccount: false }
    ]
  });

  // Fetch recent drafts or created deeds on mount
  useEffect(() => {
    const fetchRecentDeed = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await axios.get(`${API_BASE}/api/partnership-deed`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data.success && res.data.deeds.length > 0) {
          const latestDeed = res.data.deeds[0];
          setDeed(latestDeed);
          
          // Map backend schema to include React unique client-side IDs
          const mappedPartners = latestDeed.partners.map((p) => ({
            ...p,
            id: p._id || Math.random().toString(),
          }));

          setFormData({
            id: latestDeed._id,
            businessName: latestDeed.businessName,
            businessActivity: latestDeed.businessActivity,
            officeAddress: latestDeed.officeAddress,
            deedDate: latestDeed.deedDate ? latestDeed.deedDate.split("T")[0] : "",
            partners: mappedPartners,
          });
        }
      } catch (err) {
        console.error("Failed to load recent drafts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDeed();
  }, [getToken]);

  const handleSaveDraft = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return false;
      }

      const payload = {
        id: formData.id,
        businessName: formData.businessName,
        businessActivity: formData.businessActivity,
        officeAddress: formData.officeAddress,
        deedDate: formData.deedDate,
        partners: formData.partners,
      };

      const res = await axios.post(`${API_BASE}/api/partnership-deed`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        const savedDeed = res.data.deed;
        setDeed(savedDeed);
        setFormData((prev) => ({ ...prev, id: savedDeed._id }));
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save draft");
      return false;
    }
  };

  const handleProceedToPayment = async () => {
    // Auto-save draft before proceeding to payment
    const saved = await handleSaveDraft();
    if (saved) {
      setShowPayment(true);
      toast.success("Draft saved. Proceeding to checkout...");
    }
  };

  const handlePaymentSuccess = (updatedDeed) => {
    setDeed(updatedDeed);
    setShowPayment(false);
    toast.success("Partnership Deed unlocked successfully!");
  };

  const handleStartNewDeed = () => {
    setDeed(null);
    setShowPayment(false);
    setFormData({
      businessName: "",
      businessActivity: "",
      officeAddress: "",
      deedDate: new Date().toISOString().split("T")[0],
      partners: [
        { id: "1", type: "individual", fullName: "", fatherName: "", companyName: "", address: "", profitSharePercent: 50, isManagingPartner: true, canOperateBankAccount: true },
        { id: "2", type: "individual", fullName: "", fatherName: "", companyName: "", address: "", profitSharePercent: 50, isManagingPartner: false, canOperateBankAccount: false }
      ]
    });
    toast.success("Started a new Partnership Deed form.");
  };

  const handleDownload = async () => {
    if (!deed || !deed._id) return;
    setDownloading(true);
    try {
      const token = await getToken();
      const res = await axios.get(`${API_BASE}/api/partnership-deed/${deed._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        withCredentials: true
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PartnershipDeed_${formData.businessName.replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download PDF. Please try again.");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isUnlocked = deed?.paymentStatus === "paid" || deed?.paymentStatus === "bypassed";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#1A56DB] hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            >
              ← Back to Client Dashboard
            </button>
            <h1 className="text-2xl font-black text-gray-900 mt-3">Partnership Deed Generator</h1>
            <p className="text-sm text-gray-500">Draft, preview, and generate legal Partnership Deeds instantaneously.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {deed && (
              <button
                onClick={handleStartNewDeed}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-gray-300 hover:bg-slate-50 text-gray-700 font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                ➕ Create New Deed
              </button>
            )}

            {isUnlocked && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>📥 Download Partnership Deed PDF</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Pane (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {showPayment && formData.id && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕ Cancel Payment
                  </button>
                </div>
                <PartnershipDeedPayment
                  deedId={formData.id}
                  amount={999}
                  onSuccess={handlePaymentSuccess}
                />
              </motion.div>
            )}

            {isUnlocked && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="text-base font-bold text-green-800">Your Partnership Deed is Unlocked!</h3>
                  <p className="text-xs text-green-700 mt-1">
                    You have paid for this document. You can download the high-fidelity PDF, or review the draft template. Editing is locked.
                  </p>
                </div>
              </div>
            )}

            <PartnershipDeedForm
              formData={formData}
              setFormData={setFormData}
              onSaveDraft={handleSaveDraft}
              onPay={handleProceedToPayment}
              disabled={isUnlocked}
            />
          </div>

          {/* Live Preview Pane (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <PartnershipDeedPreview formData={formData} />
          </div>
        </div>

      </div>
    </div>
  );
}
