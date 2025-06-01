/**
 * Mock data service for GitHub Pages deployment
 * Provides hardcoded data for John Smith and Emily Jones
 */

// Create date helpers for activity timestamps
const today = new Date();
const getDateBefore = (daysAgo) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 12) + 8);
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

// Mock data for John Smith
const johnSmithData = {
  studentId: "john",
  studentName: "John Smith",
  overallProgress: 65,
  skills: [
    {
      id: "prog_fund",
      name: "Programming Fundamentals",
      mastery: 88,
      resources: [
        { 
          type: "video", 
          title: "Selection, Iteration & Sequence", 
          url: "https://youtu.be/t0VphK9cWgE?si=KJTMM38oX6exgmPg" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs", 
          url: "/worksheets/prog_fund_ws1.html" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs OCR – Year 10 Worksheet", 
          url: "/worksheets/programming_constructs_ocr_year10.html" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Python Programming", 
          url: "https://www.bbc.co.uk/bitesize/guides/zts8v9q/revision/4" 
        }
      ]
    },
    {
      id: "algorithms",
      name: "Algorithms",
      mastery: 75,
      resources: [
        { 
          type: "video", 
          title: "Searching & Sorting Algorithms", 
          url: "https://youtube.com/playlist?list=PLCiOXwirraUAzsy9tacd98LBTbj7cyFQV&si=qc69yJWHt6NwYAuf" 
        },
        { 
          type: "link", 
          title: "VisuAlgo: Sorting Algorithms", 
          url: "https://visualgo.net/en/sorting" 
        },
        { 
          type: "quiz", 
          title: "Algorithms End-of-Unit Quiz", 
          url: "/worksheets/algorithms_quiz.html" 
        }
      ]
    }
  ],
  recentActivity: [
    {
      type: "assessment",
      title: "Programming Fundamentals Quiz",
      completedAt: getDateBefore(1),
      score: 92,
      topicId: "prog_fund",
      topicName: "Programming Fundamentals"
    },
    {
      type: "activity",
      title: "Algorithms Practice",
      completedAt: getDateBefore(2),
      score: 80,
      topicId: "algorithms",
      topicName: "Algorithms"
    }
  ],
  insights: {
    strengths: ["Programming Fundamentals", "Algorithms"],
    areasForImprovement: ["Computer Networks", "Network Security"],
    lastActive: getDateBefore(1),
    activityCount: 2
  },
  badges: [
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Scored 90%+ on 5 quizzes',
      icon: '🧠',
      color: '#9c27b0',
      earnedDate: '2024-01-20'
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
};

// Mock data for Emily Jones - High Risk Student
const emilyJonesData = {
  studentId: "emily",
  studentName: "Emily Jones",
  overallProgress: 35,
  skills: [
    {
      id: "boolean_logic",
      name: "Boolean Logic",
      mastery: 25,
      resources: [
        { 
          type: "video", 
          title: "Boolean Logic & Truth Tables", 
          url: "https://youtu.be/jN9WtjyjXf4?si=MoYR8LJ570_daAHR" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Boolean Logic", 
          url: "https://www.bbc.co.uk/bitesize/guides/zjw8jty/revision/1" 
        },
        { 
          type: "quiz", 
          title: "Boolean Logic End-of-Unit Quiz", 
          url: "/worksheets/boolean_logic_quiz.html" 
        }
      ]
    },
    {
      id: "networks",
      name: "Computer Networks",
      mastery: 30,
      resources: [
        { 
          type: "video", 
          title: "Network Topologies & Protocols", 
          url: "https://youtube.com/playlist?list=PLCiOXwirraUBnOLZCIxrLTSuIfgvYeWj-&si=WuktcTOyqb08qYan" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Computer Networks", 
          url: "https://www.bbc.co.uk/bitesize/guides/zc6rcdm/revision/1" 
        },
        { 
          type: "quiz", 
          title: "Computer Networks End-of-Unit Quiz", 
          url: "/worksheets/networks_quiz.html" 
        }
      ]
    }
  ],
  recentActivity: [
    {
      type: "assessment",
      title: "Boolean Logic Quiz",
      completedAt: getDateBefore(8),
      score: 45,
      topicId: "boolean_logic",
      topicName: "Boolean Logic"
    },
    {
      type: "activity",
      title: "Networks Practice",
      completedAt: getDateBefore(12),
      score: 38,
      topicId: "networks",
      topicName: "Computer Networks"
    }
  ],
  insights: {
    strengths: ["Basic Programming Concepts"],
    areasForImprovement: ["Boolean Logic", "Computer Networks", "Data Representation", "Systems Architecture"],
    lastActive: getDateBefore(8),
    activityCount: 2
  },
  badges: [
    {
      id: 'first_login',
      title: 'Welcome Aboard!',
      description: 'Completed your first login',
      icon: '🎉',
      color: '#2196f3',
      earnedDate: '2024-01-10'
    }
  ]
};

// Mock instructor dashboard data
const instructorDashboardData = {
  instructor: {
    id: "instructor1",
    name: "Jane Smith",
    email: "jane@school.edu",
    role: "instructor",
    classGroups: ["CS-10A"],
    subjects: ["Computer Science"]
  },
  classStats: {
    totalStudents: 2,
    averageMastery: 50,
    activeStudentsThisWeek: 1,
    atRiskStudents: 1,
    classChallenges: [
      { name: "Boolean Logic", count: 2 },
      { name: "Computer Networks", count: 2 },
      { name: "Low Engagement", count: 1 }
    ],
    overallProgress: 50,
    skillLevelDistribution: {
      beginner: 1,
      intermediate: 0,
      advanced: 1,
      expert: 0
    },
    averagePoints: 620,
    activitiesPerWeek: 3.2,
    topPerformingTopics: [
      { name: "Programming Fundamentals", averageMastery: 88 },
      { name: "Algorithms", averageMastery: 75 }
    ],
    strugglingTopics: [
      { name: "Boolean Logic", averageMastery: 25 },
      { name: "Computer Networks", averageMastery: 30 }
    ],
    weeklyActivity: [
      { day: "Monday", count: 2 },
      { day: "Tuesday", count: 4 },
      { day: "Wednesday", count: 1 },
      { day: "Thursday", count: 5 },
      { day: "Friday", count: 3 },
      { day: "Saturday", count: 0 },
      { day: "Sunday", count: 1 }
    ],
    recentImprovement: -5
  },
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
        overallMastery: johnSmithData.overallProgress,
        totalPoints: 870,
        activitiesCompleted: johnSmithData.recentActivity.length,
        pathsInProgress: 2,
        pathsCompleted: 1,
        lastActive: johnSmithData.insights.lastActive,
        weeklyStreak: 3,
        riskLevel: "low",
        strengths: johnSmithData.insights.strengths,
        weaknesses: johnSmithData.insights.areasForImprovement,
        topicMastery: johnSmithData.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: johnSmithData.badges
      }
    },
    {
      student: {
        id: "emily",
        name: "Emily Jones",
        email: "emily.j@school.edu",
        avatar: "EJ",
        group: "CS-10A"
      },
      progress: {
        skillLevel: "Beginner",
        overallMastery: emilyJonesData.overallProgress,
        totalPoints: 280,
        activitiesCompleted: emilyJonesData.recentActivity.length,
        pathsInProgress: 2,
        pathsCompleted: 0,
        lastActive: emilyJonesData.insights.lastActive,
        weeklyStreak: 0,
        riskLevel: "high",
        strengths: emilyJonesData.insights.strengths,
        weaknesses: emilyJonesData.insights.areasForImprovement,
        topicMastery: emilyJonesData.skills.map(skill => ({
          topic: skill.name,
          mastery: skill.mastery
        })),
        badges: emilyJonesData.badges
      }
    }
  ],
  analytics: {
    topicPerformance: [
      { topic: "Programming Fundamentals", currentAvg: 88, previousAvg: 80, change: "+8%" },
      { topic: "Data Representation", currentAvg: 85, previousAvg: 78, change: "+7%" },
      { topic: "Systems Architecture", currentAvg: 68, previousAvg: 62, change: "+6%" },
      { topic: "Algorithms", currentAvg: 75, previousAvg: 71, change: "+4%" }
    ],
    activityTrends: {
      weeksActive: 4,
      weeklySubmissions: [8, 10, 12, 15],
      weeklyActiveStudents: [2, 2, 2, 2],
      improvedTopics: 4,
      decliningTopics: 0
    },
    interventionNeeded: [
      {
        student: "Emily Jones",
        reason: "Inactive for 8+ days, consistently low scores (25-30%) in Boolean Logic and Networks",
        suggestedAction: "Immediate 1:1 meeting, simplified learning materials, peer tutoring support"
      }
    ],
    positiveOutliers: [
      {
        student: "John Smith",
        achievement: "88% mastery in Programming Fundamentals, consistent improvement across topics"
      }
    ]
  }
};

// Mock user authentication data
const mockUsers = {
  john: {
    id: "john",
    name: "John Smith",
    email: "john.s@school.edu",
    role: "student",
    avatar: "JS"
  },
  emily: {
    id: "emily",
    name: "Emily Jones",
    email: "emily.j@school.edu",
    role: "student",
    avatar: "EJ"
  },
  instructor: {
    id: "instructor1",
    name: "Jane Smith",
    email: "jane@school.edu",
    role: "instructor",
    avatar: "UA"
  }
};

// Mock courses data
const mockCourses = [
  {
    id: "ocr-j277",
    title: "OCR J277 Computer Science",
    description: "Complete GCSE Computer Science curriculum following OCR J277 specification",
    instructor: "Jane Smith",
    enrolledStudents: 2,
    totalLessons: 35,
    completedLessons: 24,
    estimatedDuration: "36 weeks",
    difficulty: "Intermediate",
    topics: [
      "Programming Fundamentals",
      "Data Representation", 
      "Systems Architecture",
      "Algorithms",
      "Boolean Logic",
      "Network Security"
    ]
  }
];

class MockDataService {
  constructor() {
    this.isGitHubPages = window.location.hostname === 'usmanaman.github.io';
  }

  // Authentication methods
  async login(email, password) {
    if (!this.isGitHubPages) return null;

    // Mock login logic
    const user = Object.values(mockUsers).find(u => u.email === email);
    if (user && password === 'demo123') {
      const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    }
    throw new Error('Invalid credentials');
  }

  getCurrentUser() {
    if (!this.isGitHubPages) return null;
    
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Student data methods
  async getStudentDashboard(studentId) {
    if (!this.isGitHubPages) return null;

    if (studentId === 'john') return johnSmithData;
    if (studentId === 'emily') return emilyJonesData;
    return null;
  }

  async getStudentProgress(studentId) {
    if (!this.isGitHubPages) return null;
    
    return this.getStudentDashboard(studentId);
  }

  // Instructor data methods
  async getInstructorDashboard() {
    if (!this.isGitHubPages) return null;
    
    return instructorDashboardData;
  }

  async getStudentList() {
    if (!this.isGitHubPages) return null;
    
    return instructorDashboardData.students;
  }

  // Course data methods
  async getCourses() {
    if (!this.isGitHubPages) return null;
    
    return mockCourses;
  }

  async getCourse(courseId) {
    if (!this.isGitHubPages) return null;
    
    return mockCourses.find(c => c.id === courseId);
  }

  // Progress data methods
  async updateProgress(studentId, topicId, progress) {
    if (!this.isGitHubPages) return null;
    
    // Mock update - just return success
    return { success: true, message: 'Progress updated' };
  }

  // Assessment methods
  async submitAssessment(assessmentData) {
    if (!this.isGitHubPages) return null;
    
    return { 
      success: true, 
      score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
      feedback: 'Great work! Keep practicing.'
    };
  }
}

// Create singleton instance
const mockDataService = new MockDataService();

export default mockDataService;