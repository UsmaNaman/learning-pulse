import React from 'react';

/**
 * MetricCard component displays a key metric inside a clean, shadowed card
 * 
 * @param {string} title - The title of the metric
 * @param {string|number} value - The value to display prominently
 * @param {string} subtitle - Optional smaller text below the value
 * @param {React.ReactNode} icon - Optional icon component to display
 * @param {string} bgColor - Optional background color class (defaults to white)
 * @param {string} valueColor - Optional text color class for the value
 */
const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  bgColor = "bg-white",
  valueColor = "text-blue-600" 
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={`mt-2 flex items-baseline`}>
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            {subtitle && (
              <span className="ml-2 text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;