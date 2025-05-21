const { Course, Lesson, Assessment } = require('../models');

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .populate('instructor', 'name')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      })
      .populate('assessments');
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/courses
// @desc    Create a course
// @access  Private (Instructors only)
exports.createCourse = async (req, res) => {
  try {
    // Check if user is an instructor
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create courses' });
    }

    const {
      title,
      description,
      duration,
      level,
      tags
    } = req.body;

    const newCourse = new Course({
      title,
      description,
      instructor: req.user.id,
      duration,
      level,
      tags,
      published: false // Default to unpublished
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private (Course instructor only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to update this course' });
    }

    const {
      title,
      description,
      duration,
      level,
      tags,
      published
    } = req.body;

    // Build course object
    const courseFields = {};
    if (title) courseFields.title = title;
    if (description) courseFields.description = description;
    if (duration) courseFields.duration = duration;
    if (level) courseFields.level = level;
    if (tags) courseFields.tags = tags;
    if (published !== undefined) courseFields.published = published;
    
    courseFields.updatedAt = Date.now();

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: courseFields },
      { new: true }
    );

    res.json(updatedCourse);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private (Course instructor only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ msg: 'Not authorized to delete this course' });
    }

    // Delete lessons associated with the course
    await Lesson.deleteMany({ course: req.params.id });
    
    // Delete assessments associated with the course
    await Assessment.deleteMany({ course: req.params.id });
    
    // Delete the course
    await course.remove();

    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/courses/search
// @desc    Search courses
// @access  Public
exports.searchCourses = async (req, res) => {
  try {
    const { query, level, tags } = req.query;
    
    let searchQuery = { published: true };
    
    // Add text search if query parameter exists
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [query] } }
      ];
    }
    
    // Filter by level if provided
    if (level) {
      searchQuery.level = level;
    }
    
    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',');
      searchQuery.tags = { $in: tagArray };
    }
    
    const courses = await Course.find(searchQuery)
      .populate('instructor', 'name')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};