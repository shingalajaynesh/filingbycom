import { useState } from "react";

export default function CalculatorLayout({ type }) {
  // 1. HRA Calculator State
  const [hraSalary, setHraSalary] = useState(50000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [hraRent, setHraRent] = useState(15000);
  const [isMetro, setIsMetro] = useState(true);
  const [hraResult, setHraResult] = useState(null);

  // 2. TDS Calculator State
  const [tdsAmount, setTdsAmount] = useState(100000);
  const [tdsSection, setTdsSection] = useState("194J");
  const [tdsResult, setTdsResult] = useState(null);

  // 3. Depreciation Calculator State
  const [assetCost, setAssetCost] = useState(500000);
  const [salvageValue, setSalvageValue] = useState(50000);
  const [usefulLife, setUsefulLife] = useState(5);
  const [depResult, setDepResult] = useState(null);

  // Handlers
  const calculateHra = (e) => {
    e.preventDefault();
    const basic = Number(hraSalary);
    const rent = Number(hraRent);
    const received = Number(hraReceived);
    
    // 3 Conditions for HRA exemption:
    // 1. Actual HRA received
    // 2. Rent paid minus 10% of basic salary
    // 3. 50% of basic (for metro) or 40% (for non-metro)
    const cond1 = received;
    const cond2 = Math.max(0, rent - basic * 0.1);
    const cond3 = basic * (isMetro ? 0.5 : 0.4);

    const exempt = Math.round(Math.min(cond1, cond2, cond3));
    const taxable = Math.max(0, received - exempt);

    setHraResult({ exempt, taxable });
  };

  const calculateTds = (e) => {
    e.preventDefault();
    const amt = Number(tdsAmount);
    let rate = 0.1; // Default 10%
    let sectionName = "Sec 194J - Professional Services";

    if (tdsSection === "194C") {
      rate = 0.02; // 2% for contractors
      sectionName = "Sec 194C - Contractor Payments";
    } else if (tdsSection === "194I") {
      rate = 0.075; // 7.5% for rent (machinery/building)
      sectionName = "Sec 194I - Rent Payments";
    }

    const deducted = Math.round(amt * rate);
    const net = amt - deducted;

    setTdsResult({ deducted, net, rate: rate * 100, sectionName });
  };

  const calculateDepreciation = (e) => {
    e.preventDefault();
    const cost = Number(assetCost);
    const salvage = Number(salvageValue);
    const life = Number(usefulLife);

    // Straight-line method: (Cost - Salvage) / Life
    const slm = Math.round((cost - salvage) / life);
    // Written Down Value (WDV) simple approximation (20% WDV rate):
    const wdvRate = 0.2;
    const wdvYear1 = Math.round(cost * wdvRate);

    setDepResult({ slm, wdvYear1, wdvRate: wdvRate * 100 });
  };

  return (
    <div className="space-y-6">
      {/* 1. HRA Calculator Card */}
      {type === "hra" && (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">HRA Exemption Calculator (Sec 10(13A))</h2>
          <form onSubmit={calculateHra} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Basic Salary (Monthly)</label>
              <input type="number" value={hraSalary} onChange={(e) => setHraSalary(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">HRA Received (Monthly)</label>
              <input type="number" value={hraReceived} onChange={(e) => setHraReceived(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Actual Rent Paid (Monthly)</label>
              <input type="number" value={hraRent} onChange={(e) => setHraRent(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} id="metro" />
              <label htmlFor="metro" className="text-xs text-slate-500 font-bold">Living in Metro City (Delhi, Mumbai, Kolkata, Chennai)</label>
            </div>
            <button type="submit" className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold border-0 cursor-pointer">Calculate HRA Exemption</button>
          </form>

          {hraResult && (
            <div className="mt-6 p-5 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="flex justify-between text-xs"><span className="text-slate-500">Exempt HRA (Tax-Free):</span><strong className="text-emerald-700">₹{hraResult.exempt.toLocaleString("en-IN")}</strong></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Taxable HRA:</span><strong className="text-red-700">₹{hraResult.taxable.toLocaleString("en-IN")}</strong></div>
            </div>
          )}
        </div>
      )}

      {/* 2. TDS Calculator Card */}
      {type === "tds" && (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">TDS (Tax Deducted at Source) Calculator</h2>
          <form onSubmit={calculateTds} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Total Payment Amount</label>
              <input type="number" value={tdsAmount} onChange={(e) => setTdsAmount(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Select Payment Section</label>
              <select value={tdsSection} onChange={(e) => setTdsSection(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs bg-white">
                <option value="194J">Sec 194J - Professional/Technical Fees (10%)</option>
                <option value="194C">Sec 194C - Contractor/Sub-Contractor (2%)</option>
                <option value="194I">Sec 194I - Rent on Land/Building (7.5%)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold border-0 cursor-pointer">Calculate TDS Deductions</button>
          </form>

          {tdsResult && (
            <div className="mt-6 p-5 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="flex justify-between text-xs"><span className="text-slate-500">TDS Section Applied:</span><span className="font-bold text-slate-700">{tdsResult.sectionName}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">TDS Rate:</span><span className="font-bold text-slate-700">{tdsResult.rate}%</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Deducted TDS Amount:</span><strong className="text-red-700">₹{tdsResult.deducted.toLocaleString("en-IN")}</strong></div>
              <div className="flex justify-between text-xs border-t border-slate-200 pt-2"><span className="text-slate-900 font-bold">Net Payable Amount:</span><strong className="text-blue-600">₹{tdsResult.net.toLocaleString("en-IN")}</strong></div>
            </div>
          )}
        </div>
      )}

      {/* 3. Depreciation Calculator Card */}
      {type === "depreciation" && (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Asset Depreciation Calculator</h2>
          <form onSubmit={calculateDepreciation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Asset Acquisition Cost</label>
              <input type="number" value={assetCost} onChange={(e) => setAssetCost(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Estimated Salvage/Scrap Value</label>
              <input type="number" value={salvageValue} onChange={(e) => setSalvageValue(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Useful Life of Asset (Years)</label>
              <input type="number" value={usefulLife} onChange={(e) => setUsefulLife(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs" />
            </div>
            <button type="submit" className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold border-0 cursor-pointer">Calculate Asset Depreciation</button>
          </form>

          {depResult && (
            <div className="mt-6 p-5 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="flex justify-between text-xs"><span className="text-slate-500">Straight-Line Method (SLM) Annual:</span><strong className="text-slate-800">₹{depResult.slm.toLocaleString("en-IN")}/yr</strong></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">WDV Method Year 1 (at {depResult.wdvRate}%):</span><strong className="text-slate-800">₹{depResult.wdvYear1.toLocaleString("en-IN")}/yr</strong></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
