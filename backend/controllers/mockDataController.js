/**
 * Mock data controller for development and testing
 * Provides realistic student progress data based on OCR J277 specification
 */

// Import generated mock progress data with 14 days of realistic activities
const mockStudentProgress = require('../data/mockProgressData');

// Import the dedicated mock dashboards
const johnDashboard = require('../data/johnDashboard');
const instructorDashboard = require('../data/instructorDashboard');

// Create a combined students object with John's detailed dashboard
const students = { 
  john: johnDashboard,
  // Include the other students for the class overview
  ava: mockStudentProgress.ava,
  david: mockStudentProgress.david,
  fatima: mockStudentProgress.fatima,
  liam: mockStudentProgress.liam 
};

/**
 * Get mock dashboard data for a specific student
 * @route GET /api/mock/dashboard/:id
 * @param {string} id - Student ID (john, ava, david, fatima, liam)
 * @returns {Object} Student progress data
 */
exports.getMockDashboard = (req, res) => {
  const { id } = req.params;
  const lowercaseId = id.toLowerCase();
  
  // Get the student data from our combined students object
  const studentData = students[lowercaseId];
  
  if (!studentData) {
    return res.status(404).json({ 
      error: 'Student not found',
      message: 'No data available for the requested student ID',
      availableIds: Object.keys(students)
    });
  }
  
  // For John, return the pre-configured detailed dashboard
  if (lowercaseId === 'john') {
    return res.json(studentData);
  }
  
  // For other students, use the existing logic
  
  // Calculate overall progress based on skill masteries
  const totalMastery = studentData.skills.reduce((sum, skill) => sum + skill.mastery, 0);
  const overallProgress = Math.round(totalMastery / studentData.skills.length);
  
  // Determine strengths and areas for improvement
  const sortedSkills = [...studentData.skills].sort((a, b) => b.mastery - a.mastery);
  const strengths = sortedSkills.slice(0, 2).map(s => s.name);
  const weaknesses = sortedSkills.slice(-2).map(s => s.name);
  
  // Return enhanced student data
  res.json({
    studentId: id,
    studentName: studentData.studentName,
    overallProgress,
    skills: studentData.skills,
    recentActivity: studentData.recentActivity,
    insights: {
      strengths,
      areasForImprovement: weaknesses,
      lastActive: studentData.recentActivity[0]?.completedAt || null,
      activityCount: studentData.recentActivity.length
    },
    badges: studentData.badges || []
  });
};

/**
 * Get instructor dashboard data with detailed class information
 * @route GET /api/mock/instructor-dashboard
 * @returns {Object} Comprehensive instructor dashboard data
 */
exports.getInstructorDashboard = (req, res) => {
  res.json(instructorDashboard);
};

/**
 * Get class overview for teacher dashboard
 * @route GET /api/mock/class-overview
 * @returns {Object} Overview of all students' progress for teacher dashboard
 */
exports.getClassOverview = (req, res) => {
  try {
    // Calculate weekly streaks for all students
    const calculateWeeklyStreak = (activities) => {
      if (!activities || activities.length === 0) return 0;
      
      // Get the current date and the date 7 days ago
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      
      // Group activities by day in the past week
      const activityDays = new Set();
      activities.forEach(activity => {
        const activityDate = new Date(activity.completedAt);
        if (activityDate >= weekAgo && activityDate <= today) {
          const dayKey = activityDate.toISOString().split('T')[0]; // YYYY-MM-DD
          activityDays.add(dayKey);
        }
      });
      
      // Return the number of days with activity in the past week
      return activityDays.size;
    };
    
    // Generate class summary for each student
    const studentSummaries = Object.entries(students).map(([id, data]) => {
      // Calculate overall mastery
      const totalMastery = data.skills.reduce((sum, skill) => sum + skill.mastery, 0);
      const overallMastery = Math.round(totalMastery / data.skills.length);
      
      // Find weakest topics
      const sortedSkills = [...data.skills].sort((a, b) => a.mastery - b.mastery);
      const weakestTopics = sortedSkills.slice(0, 2);
      
      // Get the last activity date
      const lastActivityDate = data.recentActivity[0]?.completedAt || null;
      
      // Calculate weekly streak
      const weeklyStreak = calculateWeeklyStreak(data.recentActivity);
      
      // Determine risk level based on performance and engagement
      let riskLevel = 'low';
      if (overallMastery < 50 || weeklyStreak === 0) {
        riskLevel = 'high';
      } else if (overallMastery < 65 || weeklyStreak < 2) {
        riskLevel = 'medium';
      }
      
      return {
        studentId: id,
        studentName: data.studentName,
        overallMastery,
        weakestTopics: weakestTopics.map(topic => ({
          id: topic.id,
          name: topic.name,
          mastery: topic.mastery
        })),
        lastActive: lastActivityDate,
        weeklyStreak,
        riskLevel,
        activityCount: data.recentActivity.length
      };
    });
    
    // Sort students by risk level (high to low) and then by mastery (low to high)
    const sortedSummaries = studentSummaries.sort((a, b) => {
      const riskValues = { high: 3, medium: 2, low: 1 };
      const riskDiff = riskValues[b.riskLevel] - riskValues[a.riskLevel];
      return riskDiff !== 0 ? riskDiff : a.overallMastery - b.overallMastery;
    });
    
    // Calculate class-wide statistics
    const totalStudents = sortedSummaries.length;
    const averageMastery = Math.round(
      sortedSummaries.reduce((sum, student) => sum + student.overallMastery, 0) / totalStudents
    );
    const activeStudents = sortedSummaries.filter(student => student.weeklyStreak > 0).length;
    
    // Determine class skill levels
    const atRiskStudents = sortedSummaries.filter(student => student.riskLevel === 'high').length;
    
    // Topic analysis (find common weak topics)
    const topicWeaknesses = {};
    sortedSummaries.forEach(student => {
      student.weakestTopics.forEach(topic => {
        if (!topicWeaknesses[topic.id]) {
          topicWeaknesses[topic.id] = { name: topic.name, count: 0 };
        }
        topicWeaknesses[topic.id].count++;
      });
    });
    
    // Sort topics by frequency
    const commonWeakTopics = Object.values(topicWeaknesses)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    // Return the class overview
    res.json({
      classStats: {
        totalStudents,
        averageMastery,
        activeStudentsThisWeek: activeStudents,
        atRiskStudents,
        classChallenges: commonWeakTopics
      },
      students: sortedSummaries
    });
  } catch (err) {
    console.error('Error generating class overview:', err);
    res.status(500).json({ error: 'Error generating class overview' });
  }
};