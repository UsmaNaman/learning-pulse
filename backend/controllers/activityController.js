const { Activity, StudentProgress } = require('../models');
const { validationResult } = require('express-validator');

// @route   POST api/activities
// @desc    Create a new learning activity
// @access  Private (Instructors/Admins only)
exports.createActivity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check user role
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create activities' });
    }

    const newActivity = new Activity({
      ...req.body,
      creator: req.user.id
    });

    const activity = await newActivity.save();
    res.status(201).json(activity);
  } catch (err) {
    console.error('Error creating activity:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/activities
// @desc    Get all activities with filtering
// @access  Public
exports.getAllActivities = async (req, res) => {
  try {
    const { 
      activityType, 
      difficultyLevel, 
      curriculumStage,
      search,
      isPublished = true 
    } = req.query;
    
    // Build filter object
    const filter = { isPublished };
    
    if (activityType) filter.activityType = activityType;
    if (difficultyLevel) filter.difficultyLevel = difficultyLevel;
    if (curriculumStage) filter.curriculumStage = curriculumStage;
    
    // Text search if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const activities = await Activity.find(filter)
      .populate('creator', 'name')
      .sort({ createdAt: -1 });
      
    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/activities/:id
// @desc    Get activity by ID
// @access  Public
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('creator', 'name')
      .populate('learningPaths', 'title');
      
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (err) {
    console.error('Error fetching activity:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   PUT api/activities/:id
// @desc    Update activity
// @access  Private (Creator or Admin only)
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    
    // Check ownership or admin status
    if (activity.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this activity' });
    }
    
    // Update the activity
    const updatedFields = { ...req.body, updatedAt: Date.now() };
    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    
    res.json(activity);
  } catch (err) {
    console.error('Error updating activity:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/activities/:id
// @desc    Delete activity
// @access  Private (Creator or Admin only)
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    
    // Check ownership or admin status
    if (activity.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this activity' });
    }
    
    await activity.deleteOne();
    
    res.json({ msg: 'Activity removed' });
  } catch (err) {
    console.error('Error deleting activity:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/activities/:id/complete
// @desc    Mark activity as completed
// @access  Private
exports.completeActivity = async (req, res) => {
  try {
    const { 
      score = null, 
      timeSpent, 
      attempts = 1,
      hintsUsed = 0
    } = req.body;
    
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    
    // Get or create progress record
    let studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      studentProgress = new StudentProgress({ student: req.user.id });
    }
    
    // Add to completed activities
    const completionData = {
      activity: req.params.id,
      completedAt: Date.now(),
      score,
      timeSpent,
      attempts,
      hintsUsed
    };
    
    // Check if already completed, and update instead if it is
    const activityIndex = studentProgress.completedActivities.findIndex(
      a => a.activity.toString() === req.params.id
    );
    
    if (activityIndex !== -1) {
      // Update existing record
      studentProgress.completedActivities[activityIndex] = {
        ...studentProgress.completedActivities[activityIndex],
        ...completionData,
        // Increment attempts
        attempts: (studentProgress.completedActivities[activityIndex].attempts || 0) + 1
      };
    } else {
      // Add new completion record
      studentProgress.completedActivities.push(completionData);
      
      // Add points from activity
      studentProgress.totalPoints += activity.pointsAwarded || 0;
      
      // Update streak
      const today = new Date().toDateString();
      const lastActivityDate = studentProgress.streak.lastActivityDate 
        ? new Date(studentProgress.streak.lastActivityDate).toDateString()
        : null;
        
      if (lastActivityDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastActivityDate === yesterdayString) {
          // Increment streak
          studentProgress.streak.currentStreak += 1;
          
          // Update longest streak if needed
          if (studentProgress.streak.currentStreak > studentProgress.streak.longestStreak) {
            studentProgress.streak.longestStreak = studentProgress.streak.currentStreak;
          }
        } else if (lastActivityDate !== today) {
          // Reset streak
          studentProgress.streak.currentStreak = 1;
        }
        
        studentProgress.streak.lastActivityDate = new Date();
      }
    }
    
    // Update last activity timestamp
    studentProgress.lastActive = Date.now();
    
    // Check if skill level should be updated based on points
    await updateSkillLevel(studentProgress);
    
    await studentProgress.save();
    
    res.json({ 
      msg: 'Activity completed', 
      progress: studentProgress,
      pointsEarned: activity.pointsAwarded || 0
    });
  } catch (err) {
    console.error('Error completing activity:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/activities/recommended
// @desc    Get personalized activity recommendations
// @access  Private
exports.getRecommendedActivities = async (req, res) => {
  try {
    // Get student's progress record
    const studentProgress = await StudentProgress.findOne({ student: req.user.id });
    
    if (!studentProgress) {
      // If no progress, recommend beginner activities
      const beginnerActivities = await Activity.find({
        isPublished: true,
        difficultyLevel: 'beginner'
      })
      .limit(5)
      .sort({ createdAt: -1 });
      
      return res.json(beginnerActivities);
    }
    
    // Get student's skill level and learning preferences
    const { currentSkillLevel } = studentProgress;
    const preferredActivityTypes = studentProgress.learningAnalytics?.learningPreferences?.preferredActivityTypes || [];
    
    // Get struggling topics to prioritize
    const strugglingTopics = studentProgress.learningAnalytics?.strugglingTopics?.map(t => t.topicName) || [];
    
    // Get already completed activity IDs
    const completedActivityIds = studentProgress.completedActivities.map(a => a.activity);
    
    // Find activities matching skill level and not already completed
    let filter = {
      isPublished: true,
      difficultyLevel: currentSkillLevel,
      _id: { $nin: completedActivityIds }
    };
    
    // If there are preferred activity types, include them in filter
    if (preferredActivityTypes.length > 0) {
      filter.activityType = { $in: preferredActivityTypes };
    }
    
    let recommendedActivities = await Activity.find(filter)
      .limit(10)
      .sort({ createdAt: -1 });
    
    // If there are struggling topics, prioritize activities that address them
    if (strugglingTopics.length > 0 && recommendedActivities.length > 0) {
      recommendedActivities = recommendedActivities.sort((a, b) => {
        // Check if activity's learning objectives match any struggling topics
        const aAddressesStruggle = a.learningObjectives.some(
          obj => strugglingTopics.some(topic => obj.includes(topic))
        );
        const bAddressesStruggle = b.learningObjectives.some(
          obj => strugglingTopics.some(topic => obj.includes(topic))
        );
        
        if (aAddressesStruggle && !bAddressesStruggle) return -1;
        if (!aAddressesStruggle && bAddressesStruggle) return 1;
        return 0;
      });
    }
    
    // Get the top 5 recommendations
    recommendedActivities = recommendedActivities.slice(0, 5);
    
    res.json(recommendedActivities);
  } catch (err) {
    console.error('Error getting activity recommendations:', err.message);
    res.status(500).send('Server error');
  }
};

// Helper function to update skill level based on points
async function updateSkillLevel(studentProgress) {
  try {
    // Define point thresholds for each level
    const levelThresholds = {
      beginner: 0,
      intermediate: 500,
      advanced: 1500,
      expert: 3000
    };
    
    // Get current points
    const { totalPoints } = studentProgress;
    
    // Determine appropriate skill level
    let newSkillLevel = 'beginner';
    
    if (totalPoints >= levelThresholds.expert) {
      newSkillLevel = 'expert';
    } else if (totalPoints >= levelThresholds.advanced) {
      newSkillLevel = 'advanced';
    } else if (totalPoints >= levelThresholds.intermediate) {
      newSkillLevel = 'intermediate';
    }
    
    // Update skill level if it has changed
    if (newSkillLevel !== studentProgress.currentSkillLevel) {
      studentProgress.currentSkillLevel = newSkillLevel;
      
      // If implementing badges, could add level-up badge here
      studentProgress.badges.push({
        name: `${newSkillLevel.charAt(0).toUpperCase() + newSkillLevel.slice(1)} Level`,
        description: `Reached ${newSkillLevel} level in the learning journey`,
        imageUrl: `/badges/${newSkillLevel}.png`,
        earnedOn: Date.now()
      });
    }
    
    return studentProgress;
  } catch (err) {
    console.error('Error updating skill level:', err);
    throw err;
  }
}