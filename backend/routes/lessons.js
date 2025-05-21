const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const auth = require('../middleware/auth');

// @route   GET api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
router.get('/:id', lessonController.getLessonById);

// @route   PUT api/lessons/:id
// @desc    Update a lesson
// @access  Private (Course instructor only)
router.put('/:id', auth, lessonController.updateLesson);

// @route   DELETE api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Course instructor only)
router.delete('/:id', auth, lessonController.deleteLesson);

module.exports = router;