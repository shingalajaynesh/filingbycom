import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import SemiCategoryList from './SemiCategoryList';

export default function CategoryList({
  mainServices,
  semiServices,
  displayServices,
  searchTerm,
  handleReorderMain,
  handleReorderSemi,
  handleReorderService,
  handleOpenMainModal,
  handleDeleteMain,
  handleOpenSemiModal,
  handleDeleteSemi,
  handleOpenServiceModal,
  handleDeleteService
}) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  if (mainServices.length === 0) {
    return (
      <div className="p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm text-gray-500 text-sm">
        No categories found. Click "Add Category" to create one.
      </div>
    );
  }

  return (
    <Reorder.Group 
      axis="y" 
      values={mainServices} 
      onReorder={handleReorderMain}
      className="space-y-4 m-0 p-0 list-none"
    >
      {mainServices.map((main) => {
        const semis = semiServices
          .filter(s => s.mainService?._id === main._id || s.mainService === main._id)
          .sort((a,b) => (a.order || 0) - (b.order || 0));
        
        const allSvcsForMain = displayServices.filter(s => s.mainService?._id === main._id || s.mainService === main._id);
        const isExpanded = expandedCategory === main._id || (searchTerm && allSvcsForMain.length > 0);
        
        return (
          <Reorder.Item 
            key={main._id} 
            value={main}
            layout="position"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            transition={{ layout: { duration: isDragging ? 0.3 : 0 } }}
            className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden block"
          >
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
              <button 
                className="flex-1 flex items-center gap-3 text-left cursor-pointer border-none bg-transparent"
                onClick={() => setExpandedCategory(isExpanded ? null : main._id)}
              >
                <h3 className="text-md font-bold text-gray-900">{main.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                  Order: {main.order}
                </span>
                {!main.isActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                    Hidden
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-2">{semis.length} semi-categories</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="cursor-move text-gray-400 hover:text-gray-900 px-1" title="Drag to reorder">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                </div>
                <button onClick={() => handleOpenMainModal(main)} className="text-xs font-bold text-blue-600 hover:underline border-none bg-transparent cursor-pointer">Edit Category</button>
                <button onClick={() => handleDeleteMain(main._id)} className="text-xs font-bold text-red-600 hover:underline border-none bg-transparent cursor-pointer">Delete</button>
                <button onClick={() => setExpandedCategory(isExpanded ? null : main._id)} className="border-none bg-transparent cursor-pointer">
                  <svg className={`w-5 h-5 text-gray-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 border-t border-gray-200 bg-gray-50 cursor-auto">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => handleOpenSemiModal(null, main._id)}
                    className="text-sm font-bold text-[#1A56DB] hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
                  >
                    + Add Semi-Category
                  </button>
                </div>
                
                <SemiCategoryList 
                  main={main}
                  semis={semis}
                  displayServices={displayServices}
                  handleReorderSemi={handleReorderSemi}
                  handleReorderService={handleReorderService}
                  handleOpenSemiModal={handleOpenSemiModal}
                  handleDeleteSemi={handleDeleteSemi}
                  handleOpenServiceModal={handleOpenServiceModal}
                  handleDeleteService={handleDeleteService}
                />
              </div>
            )}
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}
