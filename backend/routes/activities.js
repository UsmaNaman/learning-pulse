const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// @route   POST api/activities
// @desc    Create a new learning activity
// @access  Private (Instructors/Admins only)
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('activityType', 'Activity type is required').isIn([
        'coding', 'quiz', 'reading', 'video', 'interactive', 'project', 'worksheet'
      ]),
      check('difficultyLevel', 'Difficulty level is required').isIn([
        'beginner', 'intermediate', 'advanced', 'expert'
      ]),
      check('curriculumStage', 'Curriculum stage is required').isIn(['KS3', 'KS4-GCSE', 'both']),
      check('estimatedDuration', 'Estimated duration is required').isNumeric(),
      check('learningObjectives', 'At least one learning objective is required').isArray({ min: 1 }),
      check('instructions', 'Instructions are required').not().isEmpty()
    ]
  ],
  activityController.createActivity
);

// @route   GET api/activities
// @desc    Get all activities
// @access  Public
router.get('/', activityController.getAllActivities);

// @route   GET api/activities/recommended
// @desc    Get personalized activity recommendations
// @access  Private
router.get('/recommended', auth, activityController.getRecommendedActivities);

// @route   GET api/activities/:id
// @desc    Get activity by ID
// @access  Public
router.get('/:id', activityController.getActivityById);

// @route   PUT api/activities/:id
// @desc    Update activity
// @access  Private (Creator or Admin only)
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('description', 'Description is required').optional().not().isEmpty(),
      check('activityType', 'Invalid activity type').optional().isIn([
        'coding', 'quiz', 'reading', 'video', 'interactive', 'project', 'worksheet'
      ]),
      check('difficultyLevel', 'Invalid difficulty level').optional().isIn([
        'beginner', 'intermediate', 'advanced', 'expert'
      ]),
      check('curriculumStage', 'Invalid curriculum stage').optional().isIn(['KS3', 'KS4-GCSE', 'both'])
    ]
  ],
  activityController.updateActivity
);

// @route   DELETE api/activities/:id
// @desc    Delete activity
// @access  Private (Creator or Admin only)
router.delete('/:id', auth, activityController.deleteActivity);

// @route   POST api/activities/:id/complete
// @desc    Mark activity as completed
// @access  Private
router.post(
  '/:id/complete',
  [
    auth,
    [
      check('timeSpent', 'Time spent is required').isNumeric(),
      check('score', 'Score must be a number').optional().isNumeric(),
      check('attempts', 'Attempts must be a number').optional().isNumeric(),
      check('hintsUsed', 'Hints used must be a number').optional().isNumeric()
    ]
  ],
  activityController.completeActivity
);

module.exports = router;