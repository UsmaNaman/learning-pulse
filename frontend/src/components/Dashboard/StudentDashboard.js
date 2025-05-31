import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import ViewToggle from '../ViewToggle';
import StudentSelector from '../StudentSelector';
import CardGrid from './CardGrid';
import MetricCard from '../MetricCard';
import ProgressBar from '../ProgressBar';
import InfoList from '../InfoList';

/**
 * StudentDashboard component provides a comprehensive dashboard for tracking student progress
 * 
 * @param {Object} student - Current student data
 * @param {Array} allStudents - Array of all available students for selection
 * @param {function} onStudentChange - Function to handle student selection change
 */
const StudentDashboard = ({ student, allStudents, onStudentChange }) => {
  const [activeView, setActiveView] = useState('progress');
  
  // View options for the toggle
  const viewOptions = [
    { id: 'progress', label: 'Progress' },
    { id: 'activities', label: 'Activities' },
    { id: 'assessments', label: 'Assessments' }
  ];
  
  // Mock data for demonstration (replace with actual data)
  const strengths = student?.strengths || [
    { id: 1, title: 'Algorithmic Thinking', description: 'Consistent high performance on problem-solving tasks' },
    { id: 2, title: 'Data Structures', description: 'Strong understanding of arrays and linked lists' },
    { id: 3, title: 'Frontend Development', description: 'Excellent work with React components' },
  ];
  
  const improvements = student?.improvements || [
    { id: 1, title: 'Database Design', description: 'Need more practice with normalization concepts' },
    { id: 2, title: 'Testing Methodologies', description: 'Improve test coverage and test-driven development' },
  ];
  
  const recentActivity = student?.recentActivity || [
    { id: 1, title: 'Completed React Hooks Module', timestamp: '2 days ago' },
    { id: 2, title: 'Submitted Algorithm Assignment', timestamp: '1 week ago' },
    { id: 3, title: 'Started Database Course', timestamp: '2 weeks ago' },
  ];

  return (
    <DashboardLayout
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Track progress and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <StudentSelector 
              students={allStudents} 
              selectedStudent={student?.id} 
              onSelectStudent={onStudentChange} 
            />
            <ViewToggle 
              activeView={activeView} 
              setActiveView={setActiveView} 
              views={viewOptions} 
            />
          </div>
        </div>
      }
    >
      {/* Top metrics row */}
      <CardGrid cols="1 sm:3" className="mb-6">
        <MetricCard 
          title="Overall Progress" 
          value={`${student?.overallProgress || 68}%`}
          subtitle="across all courses" 
        />
        <MetricCard 
          title="Courses Completed" 
          value={student?.completedCourses || 4} 
          subtitle="of 12 total" 
          valueColor="text-green-600"
        />
        <MetricCard 
          title="Time Spent This Week" 
          value={`${student?.weeklyHours || 12}h`} 
          subtitle="vs 10h avg" 
          valueColor="text-indigo-600"
        />
      </CardGrid>
      
      {/* Progress bars section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Topic Mastery</h2>
        <div className="space-y-4">
          <ProgressBar 
            percentage={student?.topicProgress?.frontend || 82} 
            label="Frontend Development" 
            color="bg-blue-500"
          />
          <ProgressBar 
            percentage={student?.topicProgress?.backend || 65} 
            label="Backend Development" 
            color="bg-green-500"
          />
          <ProgressBar 
            percentage={student?.topicProgress?.databases || 45} 
            label="Databases" 
            color="bg-yellow-500"
          />
          <ProgressBar 
            percentage={student?.topicProgress?.algorithms || 72} 
            label="Algorithms" 
            color="bg-purple-500"
          />
          <ProgressBar 
            percentage={student?.topicProgress?.testing || 38} 
            label="Testing" 
            color="bg-red-500"
          />
        </div>
      </div>
      
      {/* Bottom section with lists */}
      <CardGrid cols="1 md:2" className="mb-6">
        <InfoList 
          title="Strengths" 
          items={strengths}
        />
        <InfoList 
          title="Areas for Improvement" 
          items={improvements}
        />
      </CardGrid>
      
      {/* Recent activity section */}
      <InfoList 
        title="Recent Activity"
        items={recentActivity}
        numbered
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;