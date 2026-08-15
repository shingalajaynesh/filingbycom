import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../../shared/components/SEO.jsx";
import { buildBreadcrumbSchema } from "../../../shared/seo/schemas.js";

const CALENDAR_EVENTS = [
  { tax: "GST Return GSTR-1", due: "11th of Every Month", status: "Monthly", type: "GST" },
  { tax: "GST Return GSTR-3B", due: "20th of Every Month", status: "Monthly", type: "GST" },
  { tax: "TDS Payment Deposit", due: "7th of Every Month", status: "Monthly", type: "TDS" },
  { tax: "ITR Filing (Corporate)", due: "31st October, 2026", status: "Annual", type: "Income Tax" },
  { tax: "ITR Filing (Individual/Partnership)", due: "31st July, 2026", status: "Annual", type: "Income Tax" },
  { tax: "ROC Annual Returns (Form MGT-7)", due: "29th November, 2026", status: "Annual", type: "ROC" },
  { tax: "ROC Balance Sheets (Form AOC-4)", due: "30th October, 2026", status: "Annual", type: "ROC" }
];

export default function UserComplianceDashboard() {
  const [reminders, setReminders] = useState([
    { id: 1, text: "GST GSTR-3B filing for current quarter", done: false },
    { id: 2, text: "Form AOC-4 Company ROC upload preparation", done: true }
  ]);

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Personalized Business Compliance Dashboard | FilingBy"
        description="Manage your corporate filings, GST return schedules, tax calendars, and compliance documents in your personalized FilingBy business management dashboard."
        canonical="/dashboard/compliance"
        extraSchemas={[
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Dashboard", url: "/dashboard/compliance" }
          ])
        ]}
      />

      <section className="max-w-4xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Compliance Cockpit</h1>
            <p className="text-xs text-slate-500 mt-1">Monitor filings, ROC returns, and secure bookmarked tools.</p>
          </div>
          <Link
            to="/get-live-quote"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-750 text-white rounded-full text-xs font-bold transition-all border-none"
          >
            Assign Dedicated CA
          </Link>
        </div>

        {/* Due Date Calendar Grid */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-1">Tax Due Date Calendar (AY 2026-27)</h2>
          <p className="text-xs text-slate-400 mb-5">Ensure timely filings to prevent penal late fees under Section 234F.</p>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 font-black text-slate-800">Tax Type</th>
                  <th className="p-4 font-black text-slate-800">Compliance Form</th>
                  <th className="p-4 font-black text-slate-800">Due Date</th>
                  <th className="p-4 font-black text-slate-800 text-right">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {CALENDAR_EVENTS.map((e, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-none">
                    <td className="p-4 font-bold text-slate-700">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black ${
                        e.type === "GST" ? "bg-green-150 text-green-800" :
                        e.type === "ROC" ? "bg-purple-150 text-purple-800" :
                        "bg-blue-150 text-blue-800"
                      }`}>{e.type}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-bold">{e.tax}</td>
                    <td className="p-4 text-slate-500 font-medium">{e.due}</td>
                    <td className="p-4 text-slate-500 font-medium text-right">{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Items & Checklist Columns */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Action Checklist */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4">My Compliance Checklist</h3>
            <div className="space-y-3">
              {reminders.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={() => toggleReminder(r.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-slate-350"
                  />
                  <span className={`text-xs font-medium text-slate-700 ${r.done ? "line-through text-slate-400" : ""}`}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4">Saved Tools & Templates</h3>
            <div className="space-y-2">
              <Link to="/gst-calculator" className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 text-xs font-bold text-slate-700 hover:text-blue-600">
                <span>📊 Dynamic GST Calculator</span>
                <span>➔</span>
              </Link>
              <Link to="/templates/nda" className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 text-xs font-bold text-slate-700 hover:text-blue-600">
                <span>📄 Mutual NDA Agreement Template</span>
                <span>➔</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Warning */}
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div>
            <h4 className="text-xs font-black text-amber-950">Important Notice regarding Late filing Fees</h4>
            <p className="text-[11px] text-amber-900 mt-1 leading-relaxed font-medium">Under MCA guidelines, late filing fees of ₹100 per day apply for delays in AOC-4 and MGT-7 filings. Income Tax delay penalty starts from ₹1,000 up to ₹5,000 under Section 234F.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
