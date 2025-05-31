import React from 'react';

/**
 * DashboardLayout component provides a responsive grid layout for dashboard components
 * 
 * @param {React.ReactNode} children - Child components to render in the layout
 * @param {React.ReactNode} header - Optional header component
 * @param {React.ReactNode} sidebar - Optional sidebar component
 * @param {string} className - Optional additional classes for the main content area
 */
const DashboardLayout = ({ 
  children, 
  header, 
  sidebar,
  className = ""
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header area */}
      {header && (
        <header className="bg-white shadow-sm z-10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {header}
          </div>
        </header>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar (if provided) */}
          {sidebar && (
            <aside className="w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
              {sidebar}
            </aside>
          )}

          {/* Main content area */}
          <main className={`flex-1 ${className}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;