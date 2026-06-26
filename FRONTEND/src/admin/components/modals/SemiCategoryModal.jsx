import React from 'react';

export default function SemiCategoryModal({
  isOpen,
  onClose,
  editingSemiService,
  semiFormData,
  handleSemiChange,
  handleSemiSubmit,
  mainServices,
  submitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {editingSemiService ? "Edit Semi-Category" : "Add New Semi-Category"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 cursor-pointer border-none bg-transparent">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">
          <form id="semi-service-form" onSubmit={handleSemiSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
              <select required name="mainService" value={semiFormData.mainService} onChange={handleSemiChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm">
                <option value="">-- Select Main Category --</option>
                {mainServices.map(main => (
                   <option key={main._id} value={main._id}>{main.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semi-Category Name</label>
              <input required type="text" name="name" value={semiFormData.name} onChange={handleSemiChange} placeholder="e.g. GST Registration" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Static Order</label>
              <input required type="number" name="order" value={semiFormData.order} onChange={handleSemiChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first within the main category.</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" name="isActive" id="semiIsActive" checked={semiFormData.isActive} onChange={handleSemiChange} className="w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-[#1A56DB]" />
              <label htmlFor="semiIsActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button type="submit" form="semi-service-form" disabled={submitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {submitting ? "Saving..." : "Save Semi-Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
