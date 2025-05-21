const mongoose = require('mongoose');

const SkillLevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
  },
  description: {
    type: String,
    required: true
  },
  requiredPoints: {
    type: Number,
    required: true
  },
  // KS3/GCSE curriculum alignment
  curriculumStage: {
    type: String,
    enum: ['KS3', 'KS4-GCSE', 'both'],
    required: true
  },
  // Learning objectives that should be mastered at this level
  learningObjectives: [{
    type: String
  }],
  // Recommended activities for students at this level
  recommendedActivities: [{
    type: String
  }],
  badgeImageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SkillLevel', SkillLevelSchema);