import React from 'react';
import { Reorder } from 'framer-motion';

export default function ServiceList({
  services,
  handleReorder,
  handleOpenModal,
  handleDelete
}) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-sm text-gray-500 mb-2">No individual services found in this category.</p>
      </div>
    );
  }

  return (
    <Reorder.Group 
      axis="y" 
      values={services} 
      onReorder={handleReorder}
      className="grid grid-cols-1 xl:grid-cols-2 gap-4 m-0 p-0 list-none"
    >
      {services.map((service) => (
        <Reorder.Item 
          key={service._id} 
          value={service}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group cursor-default"
        >
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Drag Handle built-in natively into the whole card for framer motion by default, but we can have an explicit handle by adding a dragListener wrapper. Since we didn't specify one, the whole item is draggable. */}
            <div className="cursor-move p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" title="Drag to reorder">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
            </div>
            <button onClick={() => handleOpenModal(service)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer border-none bg-transparent" title="Edit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onClick={() => handleDelete(service._id)} className="p-1 text-red-500 hover:bg-red-50 rounded-md cursor-pointer border-none bg-transparent" title="Delete">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div className="min-w-0 pr-24 pointer-events-none">
              <h4 className="font-bold text-gray-900 truncate">{service.name}</h4>
              <p className="text-[11px] text-gray-500 truncate" title={service.slug}>{service.slug}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 pointer-events-none">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-[#1A56DB] text-sm">₹{service.basePrice?.toLocaleString("en-IN")}</span>
              <span className="text-[10px] text-gray-400 font-medium">/{service.billingCycle}</span>
            </div>
            <span className="text-gray-500 text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">Order: {service.order || 0}</span>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
