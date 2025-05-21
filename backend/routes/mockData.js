const express = require('express');
const router = express.Router();
const mockDataController = require('../controllers/mockDataController');

/**
 * @route   GET api/mock/dashboard/:id
 * @desc    Get mock dashboard data for a specific student
 * @access  Public (for development purposes)
 */
router.get('/dashboard/:id', mockDataController.getMockDashboard);

/**
 * @route   GET api/mock/class-overview
 * @desc    Get class overview for teacher dashboard showing student progress at a glance
 * @access  Public (for development purposes)
 */
router.get('/class-overview', mockDataController.getClassOverview);

/**
 * @route   GET api/mock/instructor-dashboard
 * @desc    Get comprehensive instructor dashboard with detailed class and student data
 * @access  Public (for development purposes)
 */
router.get('/instructor-dashboard', mockDataController.getInstructorDashboard);

module.exports = router;