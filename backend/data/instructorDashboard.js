/**
 * Mock instructor dashboard data 
 * Shows class overview, student progress, and detailed analytics
 */

// Import student data to build the class overview
const johnData = require('./johnDashboard');
const mockProgressData = require('./mockProgressData');

// Create a comprehensive class overview
const instructorDashboard = {
  instructor: {
    id: "instructor1",
    name: "Usman Akram",
    email: "smith@school.edu",
    role: "instructor",
    classGroups: ["CS-10A", "CS-10B", "CS-11A"],
    subjects: ["Computer Science"]
  },
  
  // Class overview statistics
  classStats: {
    totalStudents: 5,
    averageMastery: 62,
    activeStudentsThisWeek: 4,
    atRiskStudents: 2,
    classChallenges: [
      { name: "Computer Networks", count: 3 },
      { name: "Network Security", count: 3 },
      { name: "Memory and Storage", count: 2 }
    ],
    overallProgress: 65,
    skillLevelDistribution: {
      beginner: 1,
      intermediate: 2,
      advanced: 1,
      expert: 1
    },
    averagePoints: 735,
    activitiesPerWeek: 5.8,
    topPerformingTopics: [
      { name: "Programming Fundamentals", averageMastery: 84 },
      { name: "Algorithms", averageMastery: 72 }
    ],
    strugglingTopics: [
      { name: "Computer Networks", averageMastery: 38 },
      { name: "Network Security", averageMastery: 42 }
    ],
    weeklyActivity: [
      { day: "Monday", count: 8 },
      { day: "Tuesday", count: 12 },
      { day: "Wednesday", count: 7 },
      { day: "Thursday", count: 15 },
      { day: "Friday", count: 6 },
      { day: "Saturday", count: 3 },
      { day: "Sunday", count: 4 }
    ],
    recentImprovement: 12 // Percentage improvement in last 2 weeks
  },
  
  // Course statistics
  courseStats: [
    {
      id: "ocr-j277",
      title: "OCR J277 Computer Science",
      enrolledStudents: 5,
      averageProgress: 68,
      lessonsCompleted: 24,
      totalLessons: 35,
      topics: [
        { name: "Systems Architecture", progress: 72 },
        { name: "Memory and Storage", progress: 59 },
        { name: "Computer Networks", progress: 42 },
        { name: "Network Security", progress: 45 },
        { name: "Programming Fundamentals", progress: 85 },
        { name: "Data Representation", progress: 64 },
        { name: "Algorithms", progress: 74 },
        { name: "Ethical, Legal & Cultural Issues", progress: 63 }
      ],
      topStudents: ["John Smith", "Ava Johnson"],
      studentsAtRisk: ["Liam Wilson"]
    },
    {
      id: "python-prog",
      title: "Python Programming Essentials",
      enrolledStudents: 4,
      averageProgress: 74,
      lessonsCompleted: 12,
      totalLessons: 15,
      topics: [
        { name: "Variables and Data Types", progress: 88 },
        { name: "Control Structures", progress: 82 },
        { name: "Functions", progress: 76 },
        { name: "Lists and Dictionaries", progress: 69 },
        { name: "File Handling", progress: 58 }
      ],
      topStudents: ["John Smith", "Fatima Ahmed"],
      studentsAtRisk: []
    },
    {
      id: "web-dev",
      title: "Web Development Fundamentals",
      enrolledStudents: 3,
      averageProgress: 55,
      lessonsCompleted: 8,
      totalLessons: 18,
      topics: [
        { name: "HTML Basics", progress: 78 },
        { name: "CSS Styling", progress: 65 },
        { name: "JavaScript Intro", progress: 42 },
        { name: "Responsive Design", progress: 36 }
      ],
      topStudents: ["Ava Johnson"],
      studentsAtRisk: ["David Chen", "Liam Wilson"]
    }
  ],
  
  // Detailed student data for the class
  students: [
    {
      student: {
        id: "john",
        name: "John Smith",
        email: "john.s@school.edu",
        avatar: "JS",
        group: "CS-10A"
      },
      progress: {
        skillLevel: "Advanced",
        overallMastery: johnData.overallProgress,
        totalPoints: 870,
        activitiesCompleted: johnData.recentActivity.length,
        pathsInProgress: 2,
        pathsCompleted: 1,
        lastActive: johnData.insights.lastActive,
        weeklyStreak: 3,
        riskLevel: "low",
        strengths: johnData.insights.strengths,
        weaknesses: johnData.insights.areasForImprovement,
        topicMastery: johnData.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: [
          {
            id: 'first_login',
            title: 'Welcome Aboard!',
            description: 'Completed your first login',
            icon: '🎉',
            color: '#2196f3',
            earnedDate: '2024-01-15'
          },
          {
            id: 'quiz_master',
            title: 'Quiz Master',
            description: 'Scored 90%+ on 5 quizzes',
            icon: '🧠',
            color: '#9c27b0',
            earnedDate: '2024-01-20'
          },
          {
            id: 'blooms_climber',
            title: "Bloom's Climber",
            description: 'Reached Analyze level in any topic',
            icon: '🏔️',
            color: '#4caf50',
            earnedDate: '2024-01-22'
          },
          {
            id: 'perfectionist',
            title: 'Perfectionist',
            description: 'Achieved 100% on any assessment',
            icon: '💯',
            color: '#ffc107',
            earnedDate: '2024-01-18'
          }
        ]
      }
    },
    {
      student: {
        id: "ava",
        name: "Ava Johnson",
        email: "ava.j@school.edu",
        avatar: "AJ",
        group: "CS-10A"
      },
      progress: {
        skillLevel: "Expert",
        overallMastery: mockProgressData.ava.overallProgress,
        totalPoints: 945,
        activitiesCompleted: mockProgressData.ava.recentActivity.length,
        pathsInProgress: 1,
        pathsCompleted: 2,
        lastActive: mockProgressData.ava.insights.lastActive,
        weeklyStreak: 5,
        riskLevel: "low",
        strengths: mockProgressData.ava.insights.strengths,
        weaknesses: mockProgressData.ava.insights.areasForImprovement,
        topicMastery: mockProgressData.ava.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: [
          {
            id: 'first_login',
            title: 'Welcome Aboard!',
            description: 'Completed your first login',
            icon: '🎉',
            color: '#2196f3',
            earnedDate: '2024-01-10'
          },
          {
            id: 'week_warrior',
            title: 'Week Warrior',
            description: 'Active for 7 consecutive days',
            icon: '⚡',
            color: '#ff9800',
            earnedDate: '2024-01-17'
          },
          {
            id: 'quiz_master',
            title: 'Quiz Master',
            description: 'Scored 90%+ on 5 quizzes',
            icon: '🧠',
            color: '#9c27b0',
            earnedDate: '2024-01-19'
          },
          {
            id: 'blooms_climber',
            title: "Bloom's Climber",
            description: 'Reached Analyze level in any topic',
            icon: '🏔️',
            color: '#4caf50',
            earnedDate: '2024-01-14'
          },
          {
            id: 'code_ninja',
            title: 'Code Ninja',
            description: 'Completed 10 coding challenges',
            icon: '🥷',
            color: '#607d8b',
            earnedDate: '2024-01-25'
          },
          {
            id: 'perfectionist',
            title: 'Perfectionist',
            description: 'Achieved 100% on any assessment',
            icon: '💯',
            color: '#ffc107',
            earnedDate: '2024-01-16'
          },
          {
            id: 'speed_learner',
            title: 'Speed Learner',
            description: 'Completed 3 activities in one day',
            icon: '💨',
            color: '#f44336',
            earnedDate: '2024-01-21'
          }
        ]
      }
    },
    {
      student: {
        id: "david",
        name: "David Chen",
        email: "david.c@school.edu",
        avatar: "DC",
        group: "CS-11B"
      },
      progress: {
        skillLevel: "Intermediate",
        overallMastery: mockProgressData.david.overallProgress,
        totalPoints: 670,
        activitiesCompleted: mockProgressData.david.recentActivity.length,
        pathsInProgress: 3,
        pathsCompleted: 0,
        lastActive: mockProgressData.david.insights.lastActive,
        weeklyStreak: 2,
        riskLevel: "medium",
        strengths: mockProgressData.david.insights.strengths,
        weaknesses: mockProgressData.david.insights.areasForImprovement,
        topicMastery: mockProgressData.david.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: [
          {
            id: 'first_login',
            title: 'Welcome Aboard!',
            description: 'Completed your first login',
            icon: '🎉',
            color: '#2196f3',
            earnedDate: '2024-01-14'
          },
          {
            id: 'blooms_climber',
            title: "Bloom's Climber",
            description: 'Reached Analyze level in any topic',
            icon: '🏔️',
            color: '#4caf50',
            earnedDate: '2024-01-22'
          }
        ]
      }
    },
    {
      student: {
        id: "fatima",
        name: "Fatima Ahmed",
        email: "fatima.a@school.edu",
        avatar: "FA",
        group: "CS-10A"
      },
      progress: {
        skillLevel: "Advanced",
        overallMastery: mockProgressData.fatima.overallProgress,
        totalPoints: 810,
        activitiesCompleted: mockProgressData.fatima.recentActivity.length,
        pathsInProgress: 1,
        pathsCompleted: 1,
        lastActive: mockProgressData.fatima.insights.lastActive,
        weeklyStreak: 4,
        riskLevel: "low",
        strengths: mockProgressData.fatima.insights.strengths,
        weaknesses: mockProgressData.fatima.insights.areasForImprovement,
        topicMastery: mockProgressData.fatima.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: [
          {
            id: 'first_login',
            title: 'Welcome Aboard!',
            description: 'Completed your first login',
            icon: '🎉',
            color: '#2196f3',
            earnedDate: '2024-01-12'
          },
          {
            id: 'week_warrior',
            title: 'Week Warrior',
            description: 'Active for 7 consecutive days',
            icon: '⚡',
            color: '#ff9800',
            earnedDate: '2024-01-19'
          },
          {
            id: 'quiz_master',
            title: 'Quiz Master',
            description: 'Scored 90%+ on 5 quizzes',
            icon: '🧠',
            color: '#9c27b0',
            earnedDate: '2024-01-24'
          },
          {
            id: 'blooms_climber',
            title: "Bloom's Climber",
            description: 'Reached Analyze level in any topic',
            icon: '🏔️',
            color: '#4caf50',
            earnedDate: '2024-01-20'
          },
          {
            id: 'code_ninja',
            title: 'Code Ninja',
            description: 'Completed 10 coding challenges',
            icon: '🥷',
            color: '#607d8b',
            earnedDate: '2024-01-26'
          },
          {
            id: 'reflection_guru',
            title: 'Reflection Guru',
            description: 'Submitted 5 learning reflections',
            icon: '🧘',
            color: '#795548',
            earnedDate: '2024-01-23'
          }
        ]
      }
    },
    {
      student: {
        id: "liam",
        name: "Liam Wilson",
        email: "liam.w@school.edu",
        avatar: "LW",
        group: "CS-11B"
      },
      progress: {
        skillLevel: "Beginner",
        overallMastery: mockProgressData.liam.overallProgress,
        totalPoints: 380,
        activitiesCompleted: mockProgressData.liam.recentActivity.length,
        pathsInProgress: 2,
        pathsCompleted: 0,
        lastActive: mockProgressData.liam.insights.lastActive,
        weeklyStreak: 0,
        riskLevel: "high",
        strengths: mockProgressData.liam.insights.strengths,
        weaknesses: mockProgressData.liam.insights.areasForImprovement,
        topicMastery: mockProgressData.liam.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: [
          {
            id: 'first_login',
            title: 'Welcome Aboard!',
            description: 'Completed your first login',
            icon: '🎉',
            color: '#2196f3',
            earnedDate: '2024-01-16'
          }
        ]
      }
    }
  ],
  
  // Analytics for performance trends
  analytics: {
    topicPerformance: [
      { topic: "Systems Architecture", currentAvg: 68, previousAvg: 62, change: "+6%" },
      { topic: "Memory and Storage", currentAvg: 55, previousAvg: 52, change: "+3%" },
      { topic: "Computer Networks", currentAvg: 35, previousAvg: 31, change: "+4%" },
      { topic: "Network Security", currentAvg: 30, previousAvg: 28, change: "+2%" },
      { topic: "Programming Fundamentals", currentAvg: 88, previousAvg: 80, change: "+8%" },
      { topic: "Data Representation", currentAvg: 62, previousAvg: 58, change: "+4%" },
      { topic: "Algorithms", currentAvg: 75, previousAvg: 71, change: "+4%" },
      { topic: "Ethical, Legal & Cultural Issues", currentAvg: 60, previousAvg: 55, change: "+5%" }
    ],
    activityTrends: {
      weeksActive: 14,
      weeklySubmissions: [15, 18, 12, 20, 17, 22, 24, 18, 16, 21, 25, 28, 30, 32],
      weeklyActiveStudents: [3, 3, 4, 5, 4, 4, 5, 3, 4, 5, 5, 5, 5, 5],
      improvedTopics: 7,
      decliningTopics: 1
    },
    interventionNeeded: [
      {
        student: "Liam Wilson",
        reason: "No activity in 7 days, consistently low scores in key topics",
        suggestedAction: "1:1 meeting and targeted exercises for Network and Security topics"
      }
    ],
    positiveOutliers: [
      {
        student: "John Smith",
        achievement: "90%+ mastery in Programming Fundamentals, consistent improvement in all topics"
      },
      {
        student: "Ava Johnson",
        achievement: "Perfect 5-day weekly streak, strong performance across all topics"
      }
    ]
  }
};

module.exports = instructorDashboard;