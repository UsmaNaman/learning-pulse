const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// @route   POST /api/analytics/interactions
// @desc    Log user interactions
// @access  Private
router.post('/interactions', auth, analyticsController.logInteractions);

// @route   GET /api/analytics/user
// @desc    Get user analytics
// @access  Private
router.get('/user', auth, analyticsController.getUserAnalytics);

// @route   GET /api/analytics/class
// @desc    Get class analytics (teachers only)
// @access  Private (Teacher/Admin)
router.get('/class', auth, analyticsController.getClassAnalytics);

// @route   GET /api/analytics/user/:userId/timeline
// @desc    Get user interaction timeline
// @access  Private (Self or Teacher/Admin)
router.get('/user/:userId/timeline', auth, analyticsController.getUserTimeline);

// @route   GET /api/analytics/resources/popular
// @desc    Get popular resources analytics
// @access  Private
router.get('/resources/popular', auth, analyticsController.getPopularResources);

// @route   GET /api/analytics/engagement
// @desc    Get engagement metrics
// @access  Private
router.get('/engagement', auth, analyticsController.getEngagementMetrics);

module.exports = router;