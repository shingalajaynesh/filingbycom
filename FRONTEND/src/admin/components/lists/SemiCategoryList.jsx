import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import ServiceList from './ServiceList';

export default function SemiCategoryList({
  main,
  semis,
  displayServices,
  handleReorderSemi,
  handleReorderService,
  handleOpenSemiModal,
  handleDeleteSemi,
  handleOpenServiceModal,
  handleDeleteService
}) {
  const [expandedSemiCategory, setExpandedSemiCategory] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!semis || semis.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
        No semi-categories found. Click "Add Semi-Category" to create one.
      </div>
    );
  }

  return (
    <Reorder.Group 
      axis="y" 
      values={semis} 
      onReorder={(newOrder) => handleReorderSemi(main._id, newOrder)}
      className="space-y-3 m-0 p-0 list-none mt-2"
    >
      {semis.map((semi) => {
        const svcs = displayServices
          .filter(s => s.semiService?._id === semi._id || s.semiService === semi._id)
          .sort((a,b) => (a.order || 0) - (b.order || 0));
          
        return (
          <Reorder.Item 
            key={semi._id} 
            value={semi}
            layout="position"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            transition={{ layout: { duration: isDragging ? 0.3 : 0 } }}
            className="border border-gray-200 hover:border-blue-300 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
          >
              <div className="w-full bg-white px-5 py-4 flex items-center justify-between">
                <button 
                  onClick={() => setExpandedSemiCategory(expandedSemiCategory === semi._id ? null : semi._id)}
                  className="flex-1 text-left flex items-center gap-4 cursor-pointer border-none bg-transparent"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-[16px]">{semi.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Order: {semi.order || 0}</span>
                      <span className="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{svcs.length} Individual Services</span>
                      {!semi.isActive && (
                        <span className="text-[11px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                  </div>
                </button>
                <div className="flex items-center gap-4 pl-4">
                  <div className="flex items-center gap-1.5">
                    {/* Reorder handle */}
                    <div className="cursor-move p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg" title="Drag to reorder">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                    </div>
                    <button onClick={() => handleOpenSemiModal(semi)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer border-none bg-transparent" title="Edit">✎</button>
                    <button onClick={() => handleDeleteSemi(semi._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer border-none bg-transparent" title="Delete">🗑</button>
                  </div>
                  <button onClick={() => setExpandedSemiCategory(expandedSemiCategory === semi._id ? null : semi._id)} className={`cursor-pointer w-8 h-8 border-none rounded-full bg-gray-50 flex items-center justify-center ${expandedSemiCategory === semi._id ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {expandedSemiCategory === semi._id && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/80 cursor-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-bold text-gray-700 text-sm">Individual Services</h5>
                    <button onClick={() => handleOpenServiceModal(null, main._id, semi._id)} className="text-[12px] font-bold text-white hover:bg-blue-700 bg-[#1A56DB] px-3.5 py-2 rounded-lg shadow-sm cursor-pointer border-none transition-colors">
                      + Add Service
                    </button>
                  </div>
                  
                  <ServiceList 
                    services={svcs} 
                    handleReorder={(newOrder) => handleReorderService(semi._id, newOrder)}
                    handleOpenModal={(svc) => handleOpenServiceModal(svc, main._id, semi._id)}
                    handleDelete={handleDeleteService}
                  />
                </div>
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    
  );
}
