const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

// @route   GET api/assessments/:id
// @desc    Get assessment by ID
// @access  Public
router.get('/:id', assessmentController.getAssessmentById);

// @route   PUT api/assessments/:id
// @desc    Update an assessment
// @access  Private (Course instructor only)
router.put('/:id', auth, assessmentController.updateAssessment);

// @route   DELETE api/assessments/:id
// @desc    Delete an assessment
// @access  Private (Course instructor only)
router.delete('/:id', auth, assessmentController.deleteAssessment);

module.exports = router;