import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, properties, leads, ledger, support
  
  // Platform fee structure simulation parameter: 'percentage' or 'flat'
  const [feeStructure, setFeeStructure] = useState("percentage"); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication expired. Please log in again.");
        setLoading(false);
        return;
      }
      
      const [propsRes, leadsRes] = await Promise.all([
        axios.get(`${API_BASE}/virtual-space/partner/properties`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }).catch((err) => {
          console.error("Props fetch error:", err);
          return { data: { success: true, properties: [] } };
        }),
        axios.get(`${API_BASE}/virtual-space/partner/leads`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }).catch((err) => {
          console.error("Leads fetch error:", err);
          return { data: { success: true, leads: [] } };
        })
      ]);

      if (propsRes.data?.success) {
        setProperties(propsRes.data.properties || []);
      }
      if (leadsRes.data?.success) {
        setLeads(leadsRes.data.leads || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load partner dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute stats
  const approvedProps = properties.filter(p => p.status === "Approved");
  const pendingProps = properties.filter(p => p.status === "Pending");
  
  // Calculate earnings ledger based on active fee structure
  const getPayouts = () => {
    return leads.map(lead => {
      const gross = Number(lead.price) || 999;
      const fee = feeStructure === "percentage" 
        ? Math.round(gross * 0.15) // 15% Platform Commission
        : 199; // Flat flat-rate fee
      const net = gross - fee;
      return {
        ...lead,
        gross,
        fee,
        net
      };
    });
  };

  const payouts = getPayouts();
  const totalGross = payouts.reduce((sum, p) => sum + p.gross, 0);
  const totalFees = payouts.reduce((sum, p) => sum + p.fee, 0);
  const totalNet = payouts.reduce((sum, p) => sum + p.net, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase animate-pulse">Loading Partner Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative pb-12">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Horizontal Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-250">
          {[
            { id: "overview", label: "Overview", icon: "🏠" },
            { id: "properties", label: "My Properties", icon: "🏢" },
            { id: "leads", label: "Property Leads", icon: "👥" },
            { id: "ledger", label: "Fees & Ledger", icon: "📊" },
            { id: "support", label: "Support Desk", icon: "🎧" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#1A56DB] text-[#1A56DB]"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Back Button helper */}
        {activeTab !== "overview" && (
          <button
            onClick={() => setActiveTab("overview")}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A56DB] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
          >
            ← Back to Overview
          </button>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#1A56DB] to-[#1e40af] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-x-2">
                  <span>Partner Workspace Desk,</span>
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    {clerkUser?.firstName || "Host"}
                  </span>
                  <span>! 👋</span>
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">
                  {pendingProps.length > 0 
                    ? `You have ${pendingProps.length} property hosting applications undergoing audit review.` 
                    : "Your listed properties are active and synced."}
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab("properties")}
                  className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all text-center cursor-pointer"
                >
                  View Listings
                </button>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="flex-1 md:flex-initial bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-center cursor-pointer"
                >
                  Track Leads ({leads.length})
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Listed Spaces", value: properties.length, color: "bg-blue-50 text-blue-600", icon: "🏢" },
                { label: "Approved Centers", value: approvedProps.length, color: "bg-green-50 text-green-600", icon: "✓" },
                { label: "Property Leads", value: leads.length, color: "bg-orange-50 text-orange-600", icon: "👥" },
                { label: "Net Payouts", value: `₹${totalNet.toLocaleString("en-IN")}`, color: "bg-indigo-50 text-indigo-600", icon: "💸" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} text-lg font-bold`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Leads Widget */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-55">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Recent Enquiries & Bookings</h3>
                <span className="text-[10px] font-bold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded-full">
                  Real Estate Leads
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  👥 No leads received for your listings yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {leads.slice(0, 3).map((lead) => (
                    <div key={lead._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                          {lead.clientName}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            lead.complianceStatus === "Approved" 
                              ? "bg-green-50 text-green-700" 
                              : lead.complianceStatus === "Rejected" 
                              ? "bg-rose-50 text-rose-700" 
                              : "bg-blue-50 text-[#1A56DB]"
                          }`}>
                            {lead.complianceStatus || "Payment Received"}
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Space: {lead.spaceName} • Plan: {lead.plan.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg text-center"
                        >
                          Connect WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs font-bold text-[#1A56DB] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer border-0 bg-transparent"
                >
                  View All Leads <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROPERTIES TAB ── */}
        {activeTab === "properties" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Listed Office Properties</h3>
                <p className="text-xs text-gray-500 font-semibold">Your shared commercial real estate portfolios</p>
              </div>
              <button
                onClick={() => navigate("/partner-onboarding", { state: { forceForm: true } })}
                className="bg-[#1A56DB] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer"
              >
                Onboard Property +
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                🏢 No properties listed under this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Space Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">City</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Rent Price</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Capacity</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {properties.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50 text-xs">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-extrabold text-gray-900">{p.spaceName}</div>
                          <div className="text-[10px] text-gray-400 line-clamp-1">{p.address}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">{p.city}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">₹{p.price}/mo</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">{p.deskCount} Desks ({p.spaceType})</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span className={`px-2.5 py-1 inline-flex text-[10px] font-bold rounded-full ${
                            p.status === "Approved" ? "bg-green-50 text-green-700" : p.status === "Rejected" ? "bg-rose-50 text-rose-700" : "bg-yellow-50 text-yellow-750"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PROPERTY LEADS TAB ── */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Client Leads & Bookings</h3>
              <p className="text-xs text-gray-500">Clients who selected and paid for your address listings</p>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                👥 No leads received for your listings yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase"> Rented Space</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Selected Plan</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Registration Status</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Connect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50 text-xs">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-extrabold text-gray-900">{lead.clientName}</div>
                          <div className="text-[10px] text-gray-400">{lead.clientEmail} • {lead.clientPhone}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">{lead.spaceName}</td>
                        <td className="px-4 py-4 whitespace-nowrap capitalize text-gray-700">{lead.plan}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                          {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-[10px] font-bold rounded-full ${
                            lead.complianceStatus === "Approved" 
                              ? "bg-green-50 text-green-700" 
                              : lead.complianceStatus === "Rejected" 
                              ? "bg-rose-50 text-rose-700" 
                              : "bg-blue-50 text-[#1A56DB]"
                          }`}>
                            {lead.complianceStatus || "Payment Received"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
                          <a
                            href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline font-extrabold"
                          >
                            WhatsApp
                          </a>
                          <span className="text-gray-300">|</span>
                          <a
                            href={`tel:${lead.clientPhone}`}
                            className="text-[#1A56DB] hover:underline font-extrabold"
                          >
                            Call
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── FEES & LEDGER TAB ── */}
        {activeTab === "ledger" && (
          <div className="space-y-6">
            
            {/* Commission calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-gray-100 gap-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Platform Fees & Settlement Model</h3>
                  <p className="text-xs text-gray-500">Calculate platform commission deductions and payouts</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl items-center">
                  <button
                    onClick={() => setFeeStructure("percentage")}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      feeStructure === "percentage" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    15% Commission
                  </button>
                  <button
                    onClick={() => setFeeStructure("flat")}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      feeStructure === "flat" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    ₹199 Flat Rate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                <div className="text-center p-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Gross Client Rental</span>
                  <span className="text-xl font-black text-gray-900">₹{totalGross.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-center p-2 border-y sm:border-y-0 sm:border-x border-slate-200">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block mb-1">Platform Fee Deducted</span>
                  <span className="text-xl font-black text-orange-600">₹{totalFees.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-center p-2">
                  <span className="text-[10px] font-bold text-green-600 uppercase block mb-1">Net Partner Payout</span>
                  <span className="text-xl font-black text-green-600">₹{totalNet.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Payouts list */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Transactions Ledger</h3>
                <p className="text-xs text-gray-500">Rent transactions breakdown and net payouts settlement status</p>
              </div>

              {payouts.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  📊 No payouts generated yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Booking ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Property Space</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Gross Rental</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Platform Fee</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Net Payout</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {payouts.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 text-xs">
                          <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900">
                            VO-{p._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-700">{p.spaceName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-700 font-bold">₹{p.gross}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-orange-600 font-bold">-₹{p.fee}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-green-600 font-extrabold">₹{p.net}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                              Processed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUPPORT TAB ── */}
        {activeTab === "support" && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm space-y-4">
              <p className="text-5xl">🎧</p>
              <h3 className="text-xl font-bold text-gray-900">Partner Help Desk</h3>
              <p className="text-gray-550 text-sm leading-relaxed max-w-sm mx-auto">
                Need details regarding real estate documentation validation, payouts settlement cycles, or listing updates? Get in touch with our partnerships team.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto pt-2">
                <button
                  onClick={() => window.open("https://wa.me/917567126945", "_blank")}
                  className="bg-green-600 text-white font-bold text-xs py-3.5 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>💬</span> WhatsApp Partner Relations
                </button>
                <a
                  href="tel:+917567126945"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition-all text-center"
                >
                  📞 Call Partnerships Officer
                </a>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
