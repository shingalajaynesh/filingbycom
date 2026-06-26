import { useState } from "react";

export default function PartnershipDeedForm({ formData, setFormData, onSaveDraft, onPay, disabled = false }) {
  const [saveStatus, setSaveStatus] = useState("");

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePartnerChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      partners: prev.partners.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addPartner = () => {
    const newPartner = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type: "individual",
      fullName: "",
      fatherName: "",
      companyName: "",
      address: "",
      profitSharePercent: 0,
      isManagingPartner: false,
      canOperateBankAccount: false,
    };
    setFormData((prev) => ({
      ...prev,
      partners: [...prev.partners, newPartner],
    }));
  };

  const removePartner = (id) => {
    if (formData.partners.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      partners: prev.partners.filter((p) => p.id !== id),
    }));
  };

  // Compute live profit share sum
  const totalShare = formData.partners.reduce(
    (sum, p) => sum + Number(p.profitSharePercent || 0),
    0
  );
  const isValidShare = Math.abs(totalShare - 100) < 0.01;

  const handleLocalSave = async () => {
    setSaveStatus("Saving draft...");
    const success = await onSaveDraft();
    if (success) {
      setSaveStatus("Draft saved!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Failed to save draft");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-250 p-6 md:p-8 shadow-sm space-y-6">
      {disabled && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-4 rounded-xl flex items-start gap-2.5">
          <span className="text-base">⚠️</span>
          <div>
            <p className="font-bold text-amber-900 text-sm">This deed is locked for editing</p>
            <p className="text-amber-700 font-medium mt-0.5">Payment has been completed. To draft and generate another partnership deed, please click the <strong>"Create New Deed"</strong> button at the top.</p>
          </div>
        </div>
      )}
      <fieldset disabled={disabled} className="border-0 p-0 m-0 min-w-0 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Business Information</h2>
          <p className="text-xs text-gray-500">Provide the fundamental details of your proposed partnership firm.</p>
        </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Business Name</label>
          <input
            type="text"
            required
            placeholder="e.g. RiseMicro Motion"
            value={formData.businessName}
            onChange={(e) => handleFieldChange("businessName", e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56DB] bg-slate-50/50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Deed Date</label>
          <input
            type="date"
            required
            value={formData.deedDate}
            onChange={(e) => handleFieldChange("deedDate", e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56DB] bg-slate-50/50"
          />
        </div>

        <div className="col-span-full space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Business Activity</label>
          <textarea
            required
            rows={2}
            placeholder="Provide a free-text description of your business activity (e.g. IT Software, Video Editing Services)"
            value={formData.businessActivity}
            onChange={(e) => handleFieldChange("businessActivity", e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56DB] bg-slate-50/50"
          />
        </div>

        <div className="col-span-full space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Principal Place of Business (Office Address)</label>
          <input
            type="text"
            required
            placeholder="Complete office address with pincode and state"
            value={formData.officeAddress}
            onChange={(e) => handleFieldChange("officeAddress", e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56DB] bg-slate-50/50"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-0.5">Partners Configuration</h2>
            <p className="text-xs text-gray-500">Configure details for each partner (minimum 2 partners required).</p>
          </div>
          <button
            type="button"
            onClick={addPartner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#1A56DB] hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <span>➕</span> Add Partner
          </button>
        </div>

        <div className="space-y-6">
          {formData.partners.map((partner, index) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl border border-gray-200 bg-slate-50/30 relative space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#1A56DB] uppercase bg-blue-50 px-3 py-1 rounded-full">
                  Partner #{index + 1}
                </span>
                {formData.partners.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePartner(partner.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-750 transition-all cursor-pointer"
                  >
                    🗑️ Remove Row
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-full flex gap-6 items-center">
                  <span className="text-xs font-bold text-gray-700 uppercase">Partner Type:</span>
                  <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${partner.id}`}
                      value="individual"
                      checked={partner.type === "individual"}
                      onChange={(e) => handlePartnerChange(partner.id, "type", e.target.value)}
                      className="accent-[#1A56DB]"
                    />
                    Individual
                  </label>
                  <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${partner.id}`}
                      value="company"
                      checked={partner.type === "company"}
                      onChange={(e) => handlePartnerChange(partner.id, "type", e.target.value)}
                      className="accent-[#1A56DB]"
                    />
                    Company Nominee
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full legal name"
                    value={partner.fullName}
                    onChange={(e) => handlePartnerChange(partner.id, "fullName", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
                  />
                </div>

                {partner.type === "individual" ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Father's Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Father's full name"
                      value={partner.fatherName}
                      onChange={(e) => handlePartnerChange(partner.id, "fatherName", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Transcodezy IT Solutions Private Limited"
                      value={partner.companyName}
                      onChange={(e) => handlePartnerChange(partner.id, "companyName", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
                    />
                  </div>
                )}

                <div className="col-span-full space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Residential Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Complete residential address"
                    value={partner.address}
                    onChange={(e) => handlePartnerChange(partner.id, "address", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Profit Share %</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g. 25.00"
                    value={partner.profitSharePercent || ""}
                    onChange={(e) => handlePartnerChange(partner.id, "profitSharePercent", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-start gap-4 sm:gap-8 items-start sm:items-center col-span-full pt-2">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={partner.isManagingPartner}
                      onChange={(e) => handlePartnerChange(partner.id, "isManagingPartner", e.target.checked)}
                      className="w-4 h-4 rounded text-[#1A56DB] focus:ring-[#1A56DB] accent-[#1A56DB]"
                    />
                    Is Managing Partner
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={partner.canOperateBankAccount}
                      onChange={(e) => handlePartnerChange(partner.id, "canOperateBankAccount", e.target.checked)}
                      className="w-4 h-4 rounded text-[#1A56DB] focus:ring-[#1A56DB] accent-[#1A56DB]"
                    />
                    Can Operate Bank Account
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-250 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Profit Share Sum Indicator */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-700 uppercase">Total Share Sum:</span>
          <span
            className={`text-sm font-black px-3 py-1 rounded-full ${
              isValidShare
                ? "bg-green-100 text-green-700"
                : "bg-red-50 text-red-600 animate-pulse border border-red-200"
            }`}
          >
            {totalShare.toFixed(2)}%
          </span>
          {!isValidShare && (
            <span className="text-xs text-red-500 font-semibold">Must equal 100%</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleLocalSave}
            className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            📂 Save Draft
          </button>
          <button
            type="button"
            disabled={!isValidShare}
            onClick={onPay}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center gap-1.5 ${
              isValidShare
                ? "bg-[#1A56DB] hover:bg-blue-700 active:scale-95 hover:shadow-lg cursor-pointer"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            💳 Proceed to Payment
          </button>
        </div>
      </div>
      </fieldset>
      {saveStatus && (
        <p className="text-center text-xs font-bold text-slate-500">{saveStatus}</p>
      )}
    </div>
  );
}
