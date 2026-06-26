import React from 'react';

const ICONS = [
  "building",
  "document",
  "trademark",
  "wallet",
  "handshake",
  "chart",
  "file",
  "globe",
  "receipt",
  "landmark",
  "scale",
];

export default function ServiceModal({
  isOpen,
  onClose,
  type,
  editingService,
  formData,
  handleChange,
  handleArrayChange,
  handleFaqChange,
  addArrayItem,
  removeArrayItem,
  handleSubmit,
  mainServices,
  semiServices,
  submitting,
  activeTab,
  setActiveTab
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {editingService ? "Edit Service" : "Add New Service"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 cursor-pointer border-none bg-transparent">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button onClick={() => setActiveTab('basic')} className={`px-4 py-3 text-sm font-medium border-none cursor-pointer ${activeTab === 'basic' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB] bg-white' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>Basic Info</button>
          {type === 'nav' && (
            <button onClick={() => setActiveTab('nav')} className={`px-4 py-3 text-sm font-medium border-none cursor-pointer ${activeTab === 'nav' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB] bg-white' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>Navigation Setup</button>
          )}
          {type === 'popular' && (
            <button onClick={() => setActiveTab('nav')} className={`px-4 py-3 text-sm font-medium border-none cursor-pointer ${activeTab === 'nav' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB] bg-white' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>Placement Setup</button>
          )}
          <button onClick={() => setActiveTab('details')} className={`px-4 py-3 text-sm font-medium border-none cursor-pointer ${activeTab === 'details' ? 'border-b-2 border-[#1A56DB] text-[#1A56DB] bg-white' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>Documents & FAQs</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
                  <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                    <input required type="number" name="basePrice" min="0" value={formData.basePrice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                    <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm">
                      <option value="Fixed">Fixed</option>
                      <option value="Month">Month</option>
                      <option value="Quarter">Quarter</option>
                      <option value="Year">Year</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select name="icon" value={formData.icon} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm">
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Optional)</label>
                    <input type="text" name="tag" placeholder="e.g. Most Popular" value={formData.tag} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION/PLACEMENT SETUP TAB */}
            {activeTab === 'nav' && (
              <div className="space-y-4">
                {type === 'nav' && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A56DB]">Active in Navigation</h4>
                      <p className="text-xs text-blue-800">If toggled off, this service will not appear in the top navbar.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A56DB]"></div>
                    </label>
                  </div>
                )}

                {type === 'popular' && (
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <div>
                      <h4 className="text-sm font-bold text-orange-600">Featured as Popular Service</h4>
                      <p className="text-xs text-orange-800">If toggled on, this service appears in the Popular Services section on the homepage.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category (Main Service)</label>
                  <select name="mainService" value={formData.mainService} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm">
                    <option value="">-- No Category --</option>
                    {mainServices.map(main => (
                       <option key={main._id} value={main._id}>{main.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semi-Category</label>
                  <select name="semiService" value={formData.semiService} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm">
                    <option value="">-- No Semi-Category --</option>
                    {semiServices.filter(s => s.mainService?._id === formData.mainService || s.mainService === formData.mainService).map(semi => (
                       <option key={semi._id} value={semi._id}>{semi.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Static Order</label>
                  <input required type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Order this service appears inside its category dropdown.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nav Section (e.g. Registration)</label>
                  <input type="text" name="navSection" value={formData.navSection} onChange={handleChange} placeholder="Group heading inside the dropdown" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] focus:border-[#1A56DB] sm:text-sm" />
                </div>
              </div>
            )}

            {/* DETAILS & FAQS TAB */}
            {activeTab === 'details' && (
              <div className="space-y-8">
                
                {/* Documents Required */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Documents Required</label>
                    <button type="button" onClick={() => addArrayItem('documentsRequired')} className="text-xs text-[#1A56DB] font-medium border-none bg-transparent cursor-pointer">+ Add Document</button>
                  </div>
                  <div className="space-y-2">
                    {formData.documentsRequired.map((doc, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={doc} onChange={(e) => handleArrayChange('documentsRequired', index, e.target.value)} placeholder={`Document ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                        <button type="button" onClick={() => removeArrayItem('documentsRequired', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md border-none cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Process Steps</label>
                    <button type="button" onClick={() => addArrayItem('processSteps')} className="text-xs text-[#1A56DB] font-medium border-none bg-transparent cursor-pointer">+ Add Step</button>
                  </div>
                  <div className="space-y-2">
                    {formData.processSteps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={step} onChange={(e) => handleArrayChange('processSteps', index, e.target.value)} placeholder={`Step ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                        <button type="button" onClick={() => removeArrayItem('processSteps', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md border-none cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">FAQs</label>
                    <button type="button" onClick={() => addArrayItem('faqs', { q: "", a: "" })} className="text-xs text-[#1A56DB] font-medium border-none bg-transparent cursor-pointer">+ Add FAQ</button>
                  </div>
                  <div className="space-y-4">
                    {formData.faqs.map((faq, index) => (
                      <div key={index} className="flex gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex-1 space-y-2">
                          <input type="text" value={faq.q} onChange={(e) => handleFaqChange(index, 'q', e.target.value)} placeholder="Question" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                          <textarea value={faq.a} onChange={(e) => handleFaqChange(index, 'a', e.target.value)} placeholder="Answer" rows="2" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A56DB] sm:text-sm" />
                        </div>
                        <button type="button" onClick={() => removeArrayItem('faqs', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-md self-start border-none cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A56DB] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="service-form"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A56DB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A56DB] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Saving..." : "Save Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
