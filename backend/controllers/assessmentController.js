const { Assessment, Course } = require('../models');

// @route   GET api/courses/:courseId/assessments
// @desc    Get all assessments for a course
// @access  Public
exports.getAssessmentsByCourse = async (req, res) => {
  try {
    const assessments = await Assessment.find({ course: req.params.courseId });
    
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/assessments/:id
// @desc    Get assessment by ID
// @access  Public
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('course', 'title instructor');
    
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/courses/:courseId/assessments
// @desc    Create an assessment
// @access  Private (Course instructor only)
exports.createAssessment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to add assessments to this course' });
    }

    const {
      title,
      description,
      type,
      questions,
      totalPoints,
      passingScore,
      timeLimit
    } = req.body;

    const newAssessment = new Assessment({
      title,
      description,
      course: req.params.courseId,
      type: type || 'quiz',
      questions: questions || [],
      totalPoints,
      passingScore,
      timeLimit: timeLimit || 30
    });

    const assessment = await newAssessment.save();

    // Add assessment to course
    course.assessments.push(assessment._id);
    await course.save();

    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/assessments/:id
// @desc    Update an assessment
// @access  Private (Course instructor only)
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }

    const course = await Course.findById(assessment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to update this assessment' });
    }

    const {
      title,
      description,
      type,
      questions,
      totalPoints,
      passingScore,
      timeLimit
    } = req.body;

    // Build assessment object
    const assessmentFields = {};
    if (title) assessmentFields.title = title;
    if (description) assessmentFields.description = description;
    if (type) assessmentFields.type = type;
    if (questions) assessmentFields.questions = questions;
    if (totalPoints) assessmentFields.totalPoints = totalPoints;
    if (passingScore) assessmentFields.passingScore = passingScore;
    if (timeLimit) assessmentFields.timeLimit = timeLimit;
    
    assessmentFields.updatedAt = Date.now();

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: assessmentFields },
      { new: true }
    );

    res.json(updatedAssessment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/assessments/:id
// @desc    Delete an assessment
// @access  Private (Course instructor only)
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }

    const course = await Course.findById(assessment.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to delete this assessment' });
    }

    // Remove assessment from course
    course.assessments = course.assessments.filter(
      assessmentId => assessmentId.toString() !== req.params.id
    );
    await course.save();
    
    // Delete the assessment
    await assessment.remove();

    res.json({ msg: 'Assessment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.status(500).send('Server error');
  }
};