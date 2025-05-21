const { StudentProgress, User } = require('../models');
const { validationResult } = require('express-validator');

// @route   GET api/progress
// @desc    Get current student's progress
// @access  Private
exports.getMyProgress = async (req, res) => {
  try {
    const studentProgress = await StudentProgress.findOne({ student: req.user.id })
      .populate('enrolledPaths.learningPath', 'title description topic')
      .populate('completedActivities.activity', 'title activityType difficultyLevel');
      
    if (!studentProgress) {
      // Create a new progress record if none exists
      const newProgress = new StudentProgress({
        student: req.user.id
      });
      
      await newProgress.save();
      return res.json(newProgress);
    }
    
    res.json(studentProgress);
  } catch (err) {
    console.error('Error fetching student progress:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/progress/students/:id
// @desc    Get a specific student's progress (for teachers/admins)
// @access  Private (Teachers/Admins only)
exports.getStudentProgress = async (req, res) => {
  try {
    // Check if user is teacher or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view student progress' });
    }
    
    // Get the student's name for the response
    const student = await User.findById(req.params.id).select('name email');
    
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    const studentProgress = await StudentProgress.findOne({ student: req.params.id })
      .populate('enrolledPaths.learningPath', 'title description topic')
      .populate('completedActivities.activity', 'title activityType difficultyLevel');
      
    if (!studentProgress) {
      return res.status(404).json({ msg: 'Progress record not found for this student' });
    }
    
    res.json({
      student,
      progress: studentProgress
    });
  } catch (err) {
    console.error('Error fetching student progress:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(500).send('Server error');
  }
};

/**
 * Helper function to transform and combine activities and assessments into a recent activity list
 * @param {Object} progress - The student progress document with populated activities and assessments
 * @param {number} limit - Maximum number of recent items to return
 * @returns {Array} - Sorted array of recent activities
 */
const getRecentActivities = (progress, limit = 10) => {
  if (!progress) return [];
  
  // Extract and transform completed activities
  const activities = progress.completedActivities
    .filter(item => 
      // Skip items missing required data
      item.activity && 
      item.activity.title && 
      item.completedAt
    )
    .map(item => ({
      type: 'activity',
      title: item.activity.title,
      completedAt: item.completedAt,
      score: item.score,
      id: item.activity._id
    }));
  
  // Extract and transform assessment results
  const assessments = progress.assessmentResults
    .filter(item => 
      // Skip items missing required data
      item.assessment && 
      item.assessment.title && 
      item.completedAt
    )
    .map(item => ({
      type: 'assessment',
      title: item.assessment.title,
      completedAt: item.completedAt,
      score: item.score,
      id: item.assessment._id
    }));
  
  // Combine, sort by date (newest first), and limit results
  return [...activities, ...assessments]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, limit);
};

// @route   GET api/progress/dashboard
// @desc    Get dashboard stats for current student
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Get student progress with populated paths
    const studentProgress = await StudentProgress.findOne({ student: req.user.id })
      .populate('enrolledPaths.learningPath', 'title topic curriculumStage');
      
    // Handle case when no progress record exists
    if (!studentProgress) {
      return res.json({
        stats: {
          totalPoints: 0,
          skillLevel: 'beginner',
          activitiesCompleted: 0,
          pathsInProgress: 0,
          currentStreak: 0,
          strengths: [],
          strugglingTopics: [],
          badgesEarned: 0
        },
        recentActivity: []
      });
    }
    
    // Calculate dashboard stats
    const stats = {
      totalPoints: studentProgress.totalPoints,
      skillLevel: studentProgress.currentSkillLevel,
      activitiesCompleted: studentProgress.completedActivities.length,
      pathsInProgress: studentProgress.enrolledPaths.filter(p => p.status === 'in-progress').length,
      pathsCompleted: studentProgress.enrolledPaths.filter(p => p.status === 'completed').length,
      currentStreak: studentProgress.streak.currentStreak,
      longestStreak: studentProgress.streak.longestStreak,
      strengths: studentProgress.learningAnalytics?.strengths || [],
      strugglingTopics: studentProgress.learningAnalytics?.strugglingTopics || [],
      badgesEarned: studentProgress.badges.length,
      goalCompletionRate: studentProgress.selfRegulation?.goalCompletionRate || 0
    };
    
    // Get progress record with populated activity and assessment data
    const progressWithActivities = await StudentProgress.findOne({ student: req.user.id })
      .populate('completedActivities.activity', 'title activityType difficultyLevel')
      .populate('assessmentResults.assessment', 'title type');
    
    // Get recent activities using the helper function
    const recentActivity = getRecentActivities(progressWithActivities);
    
    // Return combined dashboard data
    res.json({
      stats,
      recentActivity
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/progress/learning-goal
// @desc    Add a new learning goal
// @access  Private
exports.addLearningGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, targetDate } = req.body;
  
  try {
    let studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      studentProgress = new StudentProgress({ student: req.user.id });
    }
    
    // Add new goal
    studentProgress.learningGoals.push({
      title,
      description,
      targetDate,
      dateCreated: Date.now()
    });
    
    // Update self-regulation stats
    if (!studentProgress.selfRegulation) {
      studentProgress.selfRegulation = {
        scheduledSessions: 0,
        completedScheduledSessions: 0,
        goalCompletionRate: 0,
        consistencyScore: 0
      };
    }
    
    studentProgress.selfRegulation.scheduledSessions += 1;
    
    await studentProgress.save();
    
    res.json(studentProgress);
  } catch (err) {
    console.error('Error adding learning goal:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/progress/learning-goal/:goalIndex
// @desc    Update a learning goal
// @access  Private
exports.updateLearningGoal = async (req, res) => {
  const { title, description, targetDate, isCompleted, progress } = req.body;
  const { goalIndex } = req.params;
  
  try {
    const studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      return res.status(404).json({ msg: 'Progress record not found' });
    }
    
    // Check if goal index is valid
    if (!studentProgress.learningGoals[goalIndex]) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Update goal fields
    if (title) studentProgress.learningGoals[goalIndex].title = title;
    if (description) studentProgress.learningGoals[goalIndex].description = description;
    if (targetDate) studentProgress.learningGoals[goalIndex].targetDate = targetDate;
    if (progress !== undefined) studentProgress.learningGoals[goalIndex].progress = progress;
    
    // Handle goal completion
    if (isCompleted !== undefined) {
      // If goal is being marked as completed for the first time
      if (isCompleted && !studentProgress.learningGoals[goalIndex].isCompleted) {
        // Update self-regulation stats
        studentProgress.selfRegulation.completedScheduledSessions += 1;
        
        // Calculate new goal completion rate
        const totalGoals = studentProgress.learningGoals.length;
        const completedGoals = studentProgress.learningGoals.filter(g => g.isCompleted || isCompleted).length;
        
        studentProgress.selfRegulation.goalCompletionRate = 
          Math.round((completedGoals / totalGoals) * 100);
      }
      
      studentProgress.learningGoals[goalIndex].isCompleted = isCompleted;
      
      // If completing, set progress to 100%
      if (isCompleted) {
        studentProgress.learningGoals[goalIndex].progress = 100;
      }
    }
    
    await studentProgress.save();
    
    res.json(studentProgress);
  } catch (err) {
    console.error('Error updating learning goal:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/progress/learning-goal/:goalIndex
// @desc    Delete a learning goal
// @access  Private
exports.deleteLearningGoal = async (req, res) => {
  const { goalIndex } = req.params;
  
  try {
    const studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      return res.status(404).json({ msg: 'Progress record not found' });
    }
    
    // Check if goal index is valid
    if (!studentProgress.learningGoals[goalIndex]) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Remove the goal
    studentProgress.learningGoals.splice(goalIndex, 1);
    
    // Update self-regulation stats if there are any goals left
    if (studentProgress.learningGoals.length > 0) {
      const completedGoals = studentProgress.learningGoals.filter(g => g.isCompleted).length;
      studentProgress.selfRegulation.goalCompletionRate = 
        Math.round((completedGoals / studentProgress.learningGoals.length) * 100);
    }
    
    await studentProgress.save();
    
    res.json(studentProgress);
  } catch (err) {
    console.error('Error deleting learning goal:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/progress/analytics
// @desc    Get detailed learning analytics
// @access  Private
exports.getLearningAnalytics = async (req, res) => {
  try {
    const studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      return res.status(404).json({ msg: 'Progress record not found' });
    }
    
    // Extract learning analytics
    const {
      learningAnalytics,
      completedActivities,
      assessmentResults,
      streak,
      totalPoints,
      currentSkillLevel,
      enrolledPaths,
      selfRegulation
    } = studentProgress;
    
    // Calculate additional analytics
    
    // Activity completion patterns (time of day)
    const activityTimePatterns = {
      morning: 0, // 5am-12pm
      afternoon: 0, // 12pm-5pm
      evening: 0, // 5pm-10pm
      night: 0 // 10pm-5am
    };
    
    completedActivities.forEach(activity => {
      const hour = new Date(activity.completedAt).getHours();
      
      if (hour >= 5 && hour < 12) {
        activityTimePatterns.morning += 1;
      } else if (hour >= 12 && hour < 17) {
        activityTimePatterns.afternoon += 1;
      } else if (hour >= 17 && hour < 22) {
        activityTimePatterns.evening += 1;
      } else {
        activityTimePatterns.night += 1;
      }
    });
    
    // Calculate preferred time based on most frequent
    let preferredTime = 'morning';
    let maxCount = activityTimePatterns.morning;
    
    if (activityTimePatterns.afternoon > maxCount) {
      preferredTime = 'afternoon';
      maxCount = activityTimePatterns.afternoon;
    }
    if (activityTimePatterns.evening > maxCount) {
      preferredTime = 'evening';
      maxCount = activityTimePatterns.evening;
    }
    if (activityTimePatterns.night > maxCount) {
      preferredTime = 'night';
    }
    
    // Activity type preferences
    const activityTypePreferences = {};
    
    completedActivities.forEach(activity => {
      if (activity.activity && activity.activity.activityType) {
        const type = activity.activity.activityType;
        activityTypePreferences[type] = (activityTypePreferences[type] || 0) + 1;
      }
    });
    
    // Assessment performance trends
    const assessmentTrends = assessmentResults.map(result => ({
      date: result.completedAt,
      score: result.score,
      timeSpent: result.timeSpent
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Combine all analytics
    const analytics = {
      progressSummary: {
        totalPoints,
        currentSkillLevel,
        activitiesCompleted: completedActivities.length,
        assessmentsCompleted: assessmentResults.length,
        pathsInProgress: enrolledPaths.filter(p => p.status === 'in-progress').length,
        pathsCompleted: enrolledPaths.filter(p => p.status === 'completed').length
      },
      activityPatterns: {
        timeDistribution: activityTimePatterns,
        preferredTime,
        activityTypePreferences
      },
      streakData: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        lastActivity: streak.lastActivityDate
      },
      performanceTrends: {
        assessmentScores: assessmentTrends,
        strengths: learningAnalytics?.strengths || [],
        strugglingTopics: learningAnalytics?.strugglingTopics || []
      },
      selfRegulationMetrics: selfRegulation || {
        scheduledSessions: 0,
        completedScheduledSessions: 0,
        goalCompletionRate: 0,
        consistencyScore: 0
      }
    };
    
    res.json(analytics);
  } catch (err) {
    console.error('Error getting learning analytics:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/progress/class-overview
// @desc    Get overview of entire class (for teachers)
// @access  Private (Teachers only)
exports.getClassOverview = async (req, res) => {
  try {
    // Check if user is teacher or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view class overview' });
    }
    
    // Get all students with student role
    const students = await User.find({ role: 'student' }).select('name email');
    
    // Get all progress records
    const allProgress = await StudentProgress.find()
      .populate('student', 'name email')
      .populate('enrolledPaths.learningPath', 'title topic');
    
    // Match progress to students and format data
    const classData = students.map(student => {
      const progress = allProgress.find(p => p.student && p.student._id.toString() === student._id.toString());
      
      if (!progress) {
        return {
          student: {
            id: student._id,
            name: student.name,
            email: student.email
          },
          progress: {
            skillLevel: 'beginner',
            totalPoints: 0,
            activitiesCompleted: 0,
            pathsInProgress: 0,
            pathsCompleted: 0,
            lastActive: null
          }
        };
      }
      
      return {
        student: {
          id: student._id,
          name: student.name,
          email: student.email
        },
        progress: {
          skillLevel: progress.currentSkillLevel,
          totalPoints: progress.totalPoints,
          activitiesCompleted: progress.completedActivities.length,
          pathsInProgress: progress.enrolledPaths.filter(p => p.status === 'in-progress').length,
          pathsCompleted: progress.enrolledPaths.filter(p => p.status === 'completed').length,
          lastActive: progress.lastActive
        }
      };
    });
    
    // Calculate class-wide statistics
    const classStats = {
      totalStudents: students.length,
      averagePoints: classData.reduce((sum, item) => sum + item.progress.totalPoints, 0) / students.length,
      skillLevelDistribution: {
        beginner: classData.filter(item => item.progress.skillLevel === 'beginner').length,
        intermediate: classData.filter(item => item.progress.skillLevel === 'intermediate').length,
        advanced: classData.filter(item => item.progress.skillLevel === 'advanced').length,
        expert: classData.filter(item => item.progress.skillLevel === 'expert').length
      },
      activeStudentsLast7Days: classData.filter(item => {
        if (!item.progress.lastActive) return false;
        const lastActive = new Date(item.progress.lastActive);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return lastActive >= sevenDaysAgo;
      }).length
    };
    
    res.json({
      classStats,
      students: classData
    });
  } catch (err) {
    console.error('Error getting class overview:', err.message);
    res.status(500).send('Server error');
  }
};