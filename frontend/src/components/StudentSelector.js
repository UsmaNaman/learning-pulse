import React from 'react';

/**
 * StudentSelector component provides a dropdown for selecting students
 * 
 * @param {Array} students - Array of student objects with id and name properties
 * @param {string|number} selectedStudent - ID of the currently selected student
 * @param {function} onSelectStudent - Function to handle student selection
 * @param {React.ReactNode} icon - Optional icon to display with the selector
 */
const StudentSelector = ({ 
  students, 
  selectedStudent, 
  onSelectStudent,
  icon
}) => {
  return (
    <div className="relative max-w-xs">
      <div className="flex items-center">
        {icon && (
          <div className="mr-2 text-gray-500">
            {icon}
          </div>
        )}
        <select
          value={selectedStudent}
          onChange={(e) => onSelectStudent(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 
            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
            rounded-lg shadow-sm transition-all duration-200
            bg-white text-gray-700"
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default StudentSelector;