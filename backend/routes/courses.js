const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get('/', courseController.getAllCourses);

// @route   GET api/courses/search
// @desc    Search courses
// @access  Public
router.get('/search', courseController.searchCourses);

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', courseController.getCourseById);

// @route   POST api/courses
// @desc    Create a course
// @access  Private (Instructors only)
router.post('/', auth, courseController.createCourse);

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private (Course instructor only)
router.put('/:id', auth, courseController.updateCourse);

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private (Course instructor only)
router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;