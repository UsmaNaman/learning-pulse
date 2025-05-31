import React from 'react';

/**
 * InfoList component displays a list of information items with optional icons
 * 
 * @param {string} title - The title of the list section
 * @param {Array} items - Array of items to display in the list
 * @param {React.ReactNode} titleIcon - Optional icon for the title
 * @param {string} emptyMessage - Message to display when the list is empty
 * @param {boolean} numbered - Whether to display numbered list (default: false)
 */
const InfoList = ({ 
  title, 
  items = [], 
  titleIcon, 
  emptyMessage = "No items to display",
  numbered = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        {titleIcon && <span className="mr-2 text-gray-500">{titleIcon}</span>}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li 
              key={item.id || index} 
              className="flex items-start"
            >
              {numbered && (
                <span className="flex items-center justify-center rounded-full bg-blue-100 text-blue-600 h-6 w-6 text-sm font-medium mr-3">
                  {index + 1}
                </span>
              )}
              
              {item.icon && (
                <span className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2">
                  {item.icon}
                </span>
              )}
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.title || item.label || item.text}
                </p>
                
                {item.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                )}
                
                {item.timestamp && (
                  <p className="text-xs text-gray-400 mt-1">
                    {item.timestamp}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfoList;