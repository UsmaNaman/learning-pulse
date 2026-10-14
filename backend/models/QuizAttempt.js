const mongoose = require('mongoose');

// Topics that record quiz attempts, keyed by the id the lesson page sends.
// Add an entry here when a new interactive lesson starts saving scores.
const TRACKED_TOPICS = {
  binary: 'Data Representation',
  algorithms: 'Algorithms'
};

// One row per completed lesson quiz — the raw evidence behind mastery and risk
const QuizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    enum: {
      values: Object.keys(TRACKED_TOPICS),
      message: 'Topic must be one of: ' + Object.keys(TRACKED_TOPICS).join(', ')
    },
    required: true
  },
  // Percentage score for the quiz (0–100)
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  // Highest Bloom's level answered correctly (1 Remember → 5 Evaluate)
  bloomsLevel: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

QuizAttemptSchema.index({ student: 1, topic: 1, completedAt: -1 });

const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);

module.exports = QuizAttempt;
module.exports.TRACKED_TOPICS = TRACKED_TOPICS;
