const { Progress, Course, Lesson, Assessment } = require('../models');

// @route   GET api/progress
// @desc    Get all progress for a user
// @access  Private
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('course', 'title description level')
      .sort({ lastActivity: -1 });
    
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/progress/:courseId
// @desc    Get progress for a specific course
// @access  Private
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      user: req.user.id,
      course: req.params.courseId
    })
    .populate('course', 'title description lessons assessments')
    .populate('completedLessons', 'title order')
    .populate('completedAssessments.assessment', 'title type');
    
    if (!progress) {
      return res.status(404).json({ msg: 'Progress not found' });
    }

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/progress/lesson/:lessonId
// @desc    Mark a lesson as completed
// @access  Private
exports.completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    let progress = await Progress.findOne({ 
      user: req.user.id,
      course: lesson.course
    });

    // If no progress record exists, create one
    if (!progress) {
      const course = await Course.findById(lesson.course);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      progress = new Progress({
        user: req.user.id,
        course: lesson.course,
        completedLessons: [lesson._id],
        lastActivity: Date.now(),
        completionStatus: 'in-progress'
      });
    } else {
      // Check if lesson is already completed
      if (progress.completedLessons.includes(lesson._id)) {
        return res.status(400).json({ msg: 'Lesson already completed' });
      }

      // Add lesson to completed lessons
      progress.completedLessons.push(lesson._id);
      progress.lastActivity = Date.now();
      progress.completionStatus = 'in-progress';
    }

    // Calculate completion percentage
    const course = await Course.findById(lesson.course);
    progress.completionPercentage = 
      (progress.completedLessons.length / course.lessons.length) * 100;

    // Check if all lessons are completed
    if (progress.completedLessons.length === course.lessons.length) {
      progress.completionStatus = 'completed';
    }

    await progress.save();
    
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/progress/assessment/:assessmentId
// @desc    Submit an assessment
// @access  Private
exports.submitAssessment = async (req, res) => {
  try {
    const { answers, score } = req.body;
    
    const assessment = await Assessment.findById(req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }

    let progress = await Progress.findOne({ 
      user: req.user.id,
      course: assessment.course
    });

    // If no progress record exists, create one
    if (!progress) {
      const course = await Course.findById(assessment.course);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      progress = new Progress({
        user: req.user.id,
        course: assessment.course,
        completedAssessments: [{
          assessment: assessment._id,
          score,
          completedAt: Date.now()
        }],
        lastActivity: Date.now(),
        completionStatus: 'in-progress'
      });
    } else {
      // Check if assessment is already completed
      const existingAssessment = progress.completedAssessments.find(
        a => a.assessment.toString() === assessment._id.toString()
      );

      if (existingAssessment) {
        // Update existing assessment score
        existingAssessment.score = score;
        existingAssessment.completedAt = Date.now();
      } else {
        // Add assessment to completed assessments
        progress.completedAssessments.push({
          assessment: assessment._id,
          score,
          completedAt: Date.now()
        });
      }

      progress.lastActivity = Date.now();
    }

    await progress.save();
    
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/progress/analytics
// @desc    Get learning analytics for a user
// @access  Private
exports.getUserAnalytics = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('course', 'title level duration')
      .populate('completedAssessments.assessment', 'title type totalPoints');
    
    // Calculate total learning time
    const totalLearningTime = progress.reduce((total, p) => {
      // Calculate time based on completed lessons
      const course = p.course;
      return total + (course ? (course.duration || 0) * (p.completionPercentage / 100) : 0);
    }, 0);

    // Calculate assessment performance
    let assessmentsTaken = 0;
    let totalScore = 0;
    let assessmentsByType = {
      quiz: 0,
      assignment: 0,
      project: 0,
      exam: 0
    };

    progress.forEach(p => {
      p.completedAssessments.forEach(a => {
        assessmentsTaken++;
        totalScore += a.score || 0;
        
        if (a.assessment && a.assessment.type) {
          assessmentsByType[a.assessment.type]++;
        }
      });
    });

    const averageScore = assessmentsTaken > 0 ? totalScore / assessmentsTaken : 0;

    // Calculate course completion stats
    const coursesStarted = progress.length;
    const coursesCompleted = progress.filter(p => p.completionStatus === 'completed').length;
    const coursesByLevel = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    progress.forEach(p => {
      if (p.course && p.course.level) {
        coursesByLevel[p.course.level]++;
      }
    });

    res.json({
      totalLearningTime,
      assessmentPerformance: {
        assessmentsTaken,
        averageScore,
        assessmentsByType
      },
      courseProgress: {
        coursesStarted,
        coursesCompleted,
        coursesByLevel
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};