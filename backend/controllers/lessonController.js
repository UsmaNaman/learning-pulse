const { Lesson, Course } = require('../models');

// @route   GET api/courses/:courseId/lessons
// @desc    Get all lessons for a course
// @access  Public
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1 });
    
    res.json(lessons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title instructor');
    
    if (!lesson) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Lesson not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/courses/:courseId/lessons
// @desc    Create a lesson
// @access  Private (Course instructor only)
exports.createLesson = async (req, res) => {
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
      return res.status(403).json({ msg: 'Not authorized to add lessons to this course' });
    }

    const {
      title,
      description,
      content,
      order,
      duration,
      resources
    } = req.body;

    // Get current max order value
    const maxOrderLesson = await Lesson.findOne({ course: req.params.courseId })
      .sort({ order: -1 });
    
    const newOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;

    const newLesson = new Lesson({
      title,
      description,
      course: req.params.courseId,
      content,
      order: order || newOrder,
      duration,
      resources: resources || []
    });

    const lesson = await newLesson.save();

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/lessons/:id
// @desc    Update a lesson
// @access  Private (Course instructor only)
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to update this lesson' });
    }

    const {
      title,
      description,
      content,
      order,
      duration,
      resources
    } = req.body;

    // Build lesson object
    const lessonFields = {};
    if (title) lessonFields.title = title;
    if (description) lessonFields.description = description;
    if (content) lessonFields.content = content;
    if (order) lessonFields.order = order;
    if (duration) lessonFields.duration = duration;
    if (resources) lessonFields.resources = resources;
    
    lessonFields.updatedAt = Date.now();

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: lessonFields },
      { new: true }
    );

    res.json(updatedLesson);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Lesson not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Course instructor only)
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to delete this lesson' });
    }

    // Remove lesson from course
    course.lessons = course.lessons.filter(
      lessonId => lessonId.toString() !== req.params.id
    );
    await course.save();
    
    // Delete the lesson
    await lesson.remove();

    res.json({ msg: 'Lesson removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Lesson not found' });
    }
    res.status(500).send('Server error');
  }
};