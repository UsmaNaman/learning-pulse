import React from 'react';

/**
 * ViewToggle component provides buttons for switching between different views
 * 
 * @param {string} activeView - Current active view
 * @param {function} setActiveView - Function to update the active view
 * @param {Array} views - Array of view objects with id and label properties
 */
const ViewToggle = ({ activeView, setActiveView, views }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => setActiveView(view.id)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${activeView === view.id 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
            }
          `}
        >
          {view.icon && <span className="mr-2">{view.icon}</span>}
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;