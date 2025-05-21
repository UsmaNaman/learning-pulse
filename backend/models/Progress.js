const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  completedAssessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    score: Number,
    completedAt: Date
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  completionStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  }
});

module.exports = mongoose.model('Progress', ProgressSchema);