const mongoose = require('mongoose');

const UserInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  interactionType: {
    type: String,
    enum: [
      'page_view', 'button_click', 'resource_access', 'quiz_start', 
      'quiz_complete', 'assessment_start', 'assessment_complete',
      'video_play', 'video_pause', 'video_complete', 'worksheet_download',
      'hint_request', 'feedback_submit', 'reflection_submit',
      'badge_earned', 'streak_achieved', 'topic_complete'
    ],
    required: true,
    index: true
  },
  targetElement: {
    type: String, // CSS selector or element ID
    required: false
  },
  pageUrl: {
    type: String,
    required: true
  },
  referrerUrl: {
    type: String,
    required: false
  },
  metadata: {
    // Flexible object for storing interaction-specific data
    topicId: String,
    resourceId: String,
    assessmentId: String,
    score: Number,
    timeSpent: Number, // in seconds
    hintsUsed: Number,
    attemptNumber: Number,
    bloomsLevel: Number,
    difficulty: String,
    success: Boolean,
    errorMessage: String,
    deviceType: String,
    browserInfo: String,
    screenResolution: String,
    clickPosition: {
      x: Number,
      y: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // For analytics and performance tracking
  loadTime: {
    type: Number, // in milliseconds
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false,
    // Note: Hash this for GDPR compliance
  }
});

// Compound indexes for common queries
UserInteractionSchema.index({ user: 1, timestamp: -1 });
UserInteractionSchema.index({ user: 1, interactionType: 1, timestamp: -1 });
UserInteractionSchema.index({ sessionId: 1, timestamp: 1 });

// TTL index - automatically delete interactions older than 2 years for GDPR compliance
UserInteractionSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 }); // 2 years

module.exports = mongoose.model('UserInteraction', UserInteractionSchema);