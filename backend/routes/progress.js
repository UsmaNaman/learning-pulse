const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const progressController = require('../controllers/progressController');
const studentProgressController = require('../controllers/studentProgressController');
const quizAttemptController = require('../controllers/quizAttemptController');
const { TRACKED_TOPICS } = require('../models/QuizAttempt');

// Legacy routes
// @route   GET api/progress/:courseId
// @desc    Get progress for a specific course
// @access  Private
router.get('/course/:courseId', auth, progressController.getCourseProgress);

// @route   POST api/progress/lesson/:lessonId
// @desc    Mark a lesson as completed
// @access  Private
router.post('/lesson/:lessonId', auth, progressController.completeLesson);

// @route   POST api/progress/assessment/:assessmentId
// @desc    Submit an assessment
// @access  Private
router.post('/assessment/:assessmentId', auth, progressController.submitAssessment);

// New enhanced routes
// @route   GET api/progress
// @desc    Get current student's progress
// @access  Private
router.get('/', auth, studentProgressController.getMyProgress);

// @route   GET api/progress/dashboard
// @desc    Get dashboard stats for current student
// @access  Private
router.get('/dashboard', auth, studentProgressController.getDashboardStats);

// @route   GET api/progress/analytics
// @desc    Get detailed learning analytics
// @access  Private
router.get('/analytics', auth, studentProgressController.getLearningAnalytics);

// @route   GET api/progress/class-overview
// @desc    Get overview of entire class (for teachers)
// @access  Private (Teachers only)
router.get('/class-overview', auth, studentProgressController.getClassOverview);

// @route   POST api/progress/attempts
// @desc    Record a completed lesson quiz
// @access  Private (Students only)
router.post(
  '/attempts',
  [
    auth,
    [
      check('topic', 'Topic must be one of: ' + Object.keys(TRACKED_TOPICS).join(', ')).isIn(Object.keys(TRACKED_TOPICS)),
      check('score', 'Score must be a whole number from 0 to 100').isInt({ min: 0, max: 100 }).toInt(),
      check('bloomsLevel', "Bloom's level must be a whole number from 1 to 5").isInt({ min: 1, max: 5 }).toInt()
    ]
  ],
  quizAttemptController.recordAttempt
);

// @route   GET api/progress/teacher-dashboard
// @desc    Class overview built from real quiz attempts
// @access  Private (Teachers only)
router.get('/teacher-dashboard', auth, quizAttemptController.getTeacherDashboard);

// @route   GET api/progress/students/:id
// @desc    Get a specific student's progress (for teachers/admins)
// @access  Private (Teachers/Admins only)
router.get('/students/:id', auth, studentProgressController.getStudentProgress);

// @route   POST api/progress/learning-goal
// @desc    Add a new learning goal
// @access  Private
router.post(
  '/learning-goal',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('targetDate', 'Target date must be a valid date').isISO8601().toDate()
    ]
  ],
  studentProgressController.addLearningGoal
);

// @route   PUT api/progress/learning-goal/:goalIndex
// @desc    Update a learning goal
// @access  Private
router.put('/learning-goal/:goalIndex', auth, studentProgressController.updateLearningGoal);

// @route   DELETE api/progress/learning-goal/:goalIndex
// @desc    Delete a learning goal
// @access  Private
router.delete('/learning-goal/:goalIndex', auth, studentProgressController.deleteLearningGoal);

// @route   GET api/progress/mock-dashboard
// @desc    Return mock data for student dashboard
// @access  Public (temporary)
router.get('/mock-dashboard', (req, res) => {
  res.json({
    studentName: 'Alex Johnson',
    overallProgress: 72,
    averageQuizScore: 78,
    lastActivity: '2025-05-15',
    modules: [
      { name: 'Programming Fundamentals', mastery: 85 },
      { name: 'Data Representation', mastery: 64 },
      { name: 'Algorithms', mastery: 70 }
    ],
    goals: [
      { title: 'Revise Loops', targetDate: '2025-05-21', completed: false },
      { title: 'Improve Binary Conversion', targetDate: '2025-05-23', completed: true }
    ],
    streak: 4, // e.g., days in a row studied
    pulse: '💓 Healthy'
  });
});

module.exports = router;
