const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true // Added indexing for performance
  },
  type: {
    type: String,
    enum: {
      values: ['quiz', 'assignment', 'project', 'exam'],
      message: 'Type must be one of: quiz, assignment, project, exam.' // Custom error message
    },
    default: 'quiz'
  },
  questions: {
    type: [{
      questionText: {
        type: String,
        required: true
      },
      bloomsLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      bloomsKeywords: [{
        type: String
      }],
      questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'coding', 'analysis', 'evaluation'],
        required: true
      },
      options: [{
        text: String,
        isCorrect: Boolean
      }],
      correctAnswer: String, // For non-multiple choice questions
      points: {
        type: Number,
        default: 1
      },
      feedback: {
        correct: String,
        incorrect: String,
        hint: String
      },
      scaffolding: {
        hintsAvailable: {
          type: Number,
          default: 0
        },
        examplesProvided: Boolean,
        processFeedback: Boolean
      }
    }],
    validate: {
      validator: function(value) {
        return value.length > 0; // Ensure at least one question exists
      },
      message: 'An assessment must have at least one question.'
    }
  },
  totalPoints: {
    type: Number,
    required: true
  },
  passingScore: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value <= this.totalPoints; // Ensure passingScore <= totalPoints
      },
      message: 'Passing score cannot exceed total points.'
    }
  },
  timeLimit: {
    type: Number, // in minutes
    required: true // Removed default and made it required
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update `updatedAt` field automatically
AssessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

AssessmentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
