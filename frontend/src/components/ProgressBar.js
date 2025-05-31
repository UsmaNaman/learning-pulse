import React from 'react';

/**
 * ProgressBar component displays a horizontal progress indicator with percentage
 * 
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} label - Label for the progress bar
 * @param {string} color - Optional color theme class for the progress bar (defaults to blue)
 * @param {string} size - Optional size variant ('sm', 'md', 'lg')
 * @param {string} className - Optional additional classes
 */
const ProgressBar = ({ 
  percentage, 
  label, 
  color = "bg-blue-500", 
  size = "md",
  className = ""
}) => {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, percentage));
  
  // Size variants
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };
  
  const heightClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-700">{validPercentage}%</span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div 
          className={`${color} rounded-full ${heightClass} transition-all duration-500 ease-out`}
          style={{ width: `${validPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;