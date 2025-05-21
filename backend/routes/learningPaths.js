const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const learningPathController = require('../controllers/learningPathController');
const auth = require('../middleware/auth');

// @route   POST api/learning-paths
// @desc    Create a new learning path
// @access  Private (Instructors/Admins only)
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('topic', 'Topic is required').not().isEmpty(),
      check('curriculumStage', 'Curriculum stage is required').isIn(['KS3', 'KS4-GCSE', 'both']),
      check('pathNodes', 'Learning path must contain at least one node').isArray({ min: 1 })
    ]
  ],
  learningPathController.createLearningPath
);

// @route   GET api/learning-paths
// @desc    Get all learning paths
// @access  Public
router.get('/', learningPathController.getAllLearningPaths);

// @route   GET api/learning-paths/recommended
// @desc    Get personalized learning path recommendations
// @access  Private
router.get('/recommended', auth, learningPathController.getRecommendedPaths);

// @route   GET api/learning-paths/:id
// @desc    Get learning path by ID
// @access  Public
router.get('/:id', learningPathController.getLearningPathById);

// @route   PUT api/learning-paths/:id
// @desc    Update learning path
// @access  Private (Creator or Admin only)
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('description', 'Description is required').optional().not().isEmpty(),
      check('topic', 'Topic is required').optional().not().isEmpty(),
      check('curriculumStage', 'Invalid curriculum stage').optional().isIn(['KS3', 'KS4-GCSE', 'both'])
    ]
  ],
  learningPathController.updateLearningPath
);

// @route   DELETE api/learning-paths/:id
// @desc    Delete learning path
// @access  Private (Creator or Admin only)
router.delete('/:id', auth, learningPathController.deleteLearningPath);

// @route   POST api/learning-paths/:id/enroll
// @desc    Enroll student in a learning path
// @access  Private
router.post('/:id/enroll', auth, learningPathController.enrollStudent);

module.exports = router;