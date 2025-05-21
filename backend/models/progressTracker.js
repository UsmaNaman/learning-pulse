// models/progressTracker.js
const mongoose = require('mongoose');

const progressTrackerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  moduleProgress: [
    {
      moduleId: String,
      startDate: Date,
      completionDate: Date,
      completionPercentage: Number,
      // Add other fields from our schema design
    }
  ],
  // Add other fields from our schema design
});

module.exports = mongoose.model('ProgressTracker', progressTrackerSchema);
