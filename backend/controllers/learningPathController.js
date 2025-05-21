const { LearningPath, StudentProgress } = require('../models');
const { validationResult } = require('express-validator');

// @route   POST api/learning-paths
// @desc    Create a new learning path
// @access  Private (Instructors/Admins only)
exports.createLearningPath = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check user role
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create learning paths' });
    }

    const newLearningPath = new LearningPath({
      ...req.body,
      creator: req.user.id
    });

    const learningPath = await newLearningPath.save();
    res.status(201).json(learningPath);
  } catch (err) {
    console.error('Error creating learning path:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/learning-paths
// @desc    Get all learning paths
// @access  Public
exports.getAllLearningPaths = async (req, res) => {
  try {
    const { topic, level, curriculumStage, isPublished = true } = req.query;
    
    // Build filter object
    const filter = { isPublished };
    
    if (topic) filter.topic = topic;
    if (level) filter['pathNodes.requiredSkillLevel'] = level;
    if (curriculumStage) filter.curriculumStage = curriculumStage;
    
    const learningPaths = await LearningPath.find(filter)
      .populate('creator', 'name')
      .sort({ createdAt: -1 });
      
    res.json(learningPaths);
  } catch (err) {
    console.error('Error fetching learning paths:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/learning-paths/:id
// @desc    Get learning path by ID
// @access  Public
exports.getLearningPathById = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id)
      .populate('creator', 'name')
      .populate({
        path: 'pathNodes.content',
        select: 'title description type duration'
      });
      
    if (!learningPath) {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    
    res.json(learningPath);
  } catch (err) {
    console.error('Error fetching learning path:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   PUT api/learning-paths/:id
// @desc    Update learning path
// @access  Private (Creator or Admin only)
exports.updateLearningPath = async (req, res) => {
  try {
    let learningPath = await LearningPath.findById(req.params.id);
    
    if (!learningPath) {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    
    // Check ownership or admin status
    if (learningPath.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this learning path' });
    }
    
    // Update the learning path
    const updatedFields = { ...req.body, updatedAt: Date.now() };
    learningPath = await LearningPath.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    
    res.json(learningPath);
  } catch (err) {
    console.error('Error updating learning path:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/learning-paths/:id
// @desc    Delete learning path
// @access  Private (Creator or Admin only)
exports.deleteLearningPath = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id);
    
    if (!learningPath) {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    
    // Check ownership or admin status
    if (learningPath.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this learning path' });
    }
    
    await learningPath.deleteOne();
    
    res.json({ msg: 'Learning path removed' });
  } catch (err) {
    console.error('Error deleting learning path:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/learning-paths/:id/enroll
// @desc    Enroll student in a learning path
// @access  Private
exports.enrollStudent = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id);
    
    if (!learningPath) {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    
    if (!learningPath.isPublished) {
      return res.status(400).json({ msg: 'Cannot enroll in an unpublished learning path' });
    }
    
    // Check if student is already enrolled
    let studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      // Create new progress record if none exists
      studentProgress = new StudentProgress({ student: req.user.id });
    }
    
    // Check if already enrolled in this path
    const alreadyEnrolled = studentProgress.enrolledPaths.some(
      path => path.learningPath.toString() === req.params.id
    );
    
    if (alreadyEnrolled) {
      return res.status(400).json({ msg: 'Already enrolled in this learning path' });
    }
    
    // Add learning path to enrolled paths
    studentProgress.enrolledPaths.push({
      learningPath: req.params.id,
      enrolledAt: Date.now(),
      lastActivity: Date.now()
    });
    
    await studentProgress.save();
    
    res.json({ msg: 'Successfully enrolled in learning path', progress: studentProgress });
  } catch (err) {
    console.error('Error enrolling student:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Learning path not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/learning-paths/recommended
// @desc    Get personalized learning path recommendations
// @access  Private
exports.getRecommendedPaths = async (req, res) => {
  try {
    // Get student's progress record
    const studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      // If no progress record, recommend beginner paths
      const beginnerPaths = await LearningPath.find({
        isPublished: true,
        'pathNodes.requiredSkillLevel': 'beginner'
      })
      .limit(5)
      .sort({ createdAt: -1 });
      
      return res.json(beginnerPaths);
    }
    
    // Get student's skill level
    const { currentSkillLevel } = studentProgress;
    
    // Get student's strengths from learning analytics
    const strengthTopics = studentProgress.learningAnalytics?.strengths?.map(s => s.topicName) || [];
    
    // Get enrolled path IDs to exclude them
    const enrolledPathIds = studentProgress.enrolledPaths.map(p => p.learningPath);
    
    // Find paths matching skill level and not already enrolled
    let recommendedPaths = await LearningPath.find({
      isPublished: true,
      'pathNodes.requiredSkillLevel': currentSkillLevel,
      _id: { $nin: enrolledPathIds }
    })
    .limit(10)
    .sort({ createdAt: -1 });
    
    // If any strength topics match, prioritize those
    if (strengthTopics.length > 0) {
      recommendedPaths = recommendedPaths.sort((a, b) => {
        const aMatchesStrength = strengthTopics.includes(a.topic);
        const bMatchesStrength = strengthTopics.includes(b.topic);
        
        if (aMatchesStrength && !bMatchesStrength) return -1;
        if (!aMatchesStrength && bMatchesStrength) return 1;
        return 0;
      });
    }
    
    // Get the top 5 recommendations
    recommendedPaths = recommendedPaths.slice(0, 5);
    
    res.json(recommendedPaths);
  } catch (err) {
    console.error('Error getting recommendations:', err.message);
    res.status(500).send('Server error');
  }
};