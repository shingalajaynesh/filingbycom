import React from 'react';

export default function CategoryModal({
  isOpen,
  onClose,
  editingMainService,
  mainFormData,
  handleMainChange,
  handleMainSubmit,
  submitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {editingMainService ? "Edit Category" : "Add New Category"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 cursor-pointer border-none bg-transparent">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">
          <form id="main-service-form" onSubmit={handleMainSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input required type="text" name="name" value={mainFormData.name} onChange={handleMainChange} placeholder="e.g. GST Services" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Static Order</label>
              <input required type="number" name="order" value={mainFormData.order} onChange={handleMainChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the navigation bar.</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" name="isActive" id="mainIsActive" checked={mainFormData.isActive} onChange={handleMainChange} className="w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-[#1A56DB]" />
              <label htmlFor="mainIsActive" className="text-sm font-medium text-gray-700">Active (Visible in Navigation)</label>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button type="submit" form="main-service-form" disabled={submitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {submitting ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
