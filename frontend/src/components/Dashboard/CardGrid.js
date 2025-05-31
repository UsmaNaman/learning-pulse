import React from 'react';

/**
 * CardGrid component provides a responsive grid for card layouts
 * 
 * @param {React.ReactNode} children - Child components to render in the grid
 * @param {string} cols - Number of columns in different breakpoints (sm:md:lg)
 * @param {string} gap - Gap size between grid items (default: gap-6)
 * @param {string} className - Optional additional classes
 */
const CardGrid = ({ 
  children, 
  cols = "1 sm:2 lg:3",
  gap = "6", 
  className = "" 
}) => {
  // Parse the cols parameter to generate Tailwind grid classes
  const colClasses = cols.split(' ')
    .map(breakpoint => {
      const [screen, value] = breakpoint.includes(':') 
        ? breakpoint.split(':') 
        : ['', breakpoint];
      
      return `${screen ? screen + ':' : ''}grid-cols-${value}`;
    })
    .join(' ');

  return (
    <div className={`grid ${colClasses} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default CardGrid;