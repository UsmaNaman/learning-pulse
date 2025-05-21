const mongoose = require('mongoose');

const StudentProgressSchema = new mongoose.Schema({
  // Reference to student user
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Current skill level
  currentSkillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  // Total points earned across all learning activities
  totalPoints: {
    type: Number,
    default: 0
  },
  // Learning paths the student is enrolled in
  enrolledPaths: [{
    // Reference to learning path
    learningPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath'
    },
    // Progress in this learning path
    progress: {
      type: Number, // percentage
      default: 0
    },
    // Status of this learning path
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    // Completed nodes in this path
    completedNodes: [{
      nodeIndex: Number,
      completedAt: {
        type: Date,
        default: Date.now
      },
      score: Number,
      // Time spent on this node (minutes)
      timeSpent: Number
    }],
    // Next recommended node for this student
    recommendedNextNode: {
      type: Number, // Index in the path's nodes array
      default: 0
    },
    // When the student enrolled in this path
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    // Last activity in this path
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }],
  // Activities the student has completed
  completedActivities: [{
    // Reference to activity
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    },
    // When the student completed this activity
    completedAt: {
      type: Date,
      default: Date.now
    },
    // Score earned (if applicable)
    score: Number,
    // Time spent on this activity (minutes)
    timeSpent: Number,
    // Attempts made before completion
    attempts: {
      type: Number,
      default: 1
    },
    // Hints used
    hintsUsed: {
      type: Number,
      default: 0
    },
    // For authentic learning tasks
    authenticTaskDetails: {
      // Teacher evaluation
      teacherEvaluation: {
        score: Number,
        feedback: String,
        evaluatedAt: Date
      },
      // Student reflection (for authentic tasks)
      reflection: String,
      // Evidence of completion (files, links, etc.)
      evidence: [{
        type: String,
        description: String,
        url: String
      }],
      // Real-world application demonstrated
      applicationContext: String
    }
  }],
  // Assessment results
  assessmentResults: [{
    // Reference to assessment
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    // When the assessment was taken
    completedAt: {
      type: Date,
      default: Date.now
    },
    // Overall score
    score: Number,
    // Time spent (minutes)
    timeSpent: Number,
    // Detailed responses
    responses: [{
      questionIndex: Number,
      response: String,
      isCorrect: Boolean,
      pointsEarned: Number
    }]
  }],
  // Learning analytics for personalization
  learningAnalytics: {
    // Topics the student is struggling with
    strugglingTopics: [{
      topicName: String,
      assessmentScores: [Number],
      avgScore: Number,
      remedialResourcesViewed: {
        type: Number,
        default: 0
      }
    }],
    // Topics the student is excelling in
    strengths: [{
      topicName: String,
      assessmentScores: [Number],
      avgScore: Number
    }],
    // Pace of learning (avg time to complete activities compared to expected time)
    learningPace: {
      type: String,
      enum: ['slower', 'average', 'faster'],
      default: 'average'
    },
    // Learning style preferences, determined from activity pattern analysis
    learningPreferences: {
      preferredActivityTypes: [{
        type: String,
        enum: [
          // Digital activity types
          'coding', 'quiz', 'reading', 'video', 'interactive', 'worksheet',
          // Authentic learning types
          'project', 'real_world_application', 'problem_based', 'collaborative', 
          'portfolio', 'community', 'experiment'
        ]
      }],
      preferredDifficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      },
      preferredTimeOfDay: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night']
      }
    }
  },
  // Student-set goals
  learningGoals: [{
    title: String,
    description: String,
    targetDate: Date,
    isCompleted: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number, // percentage
      default: 0
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  }],
  // Activity streak (gamification)
  streak: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date
  },
  // Badges earned
  badges: [{
    name: String,
    description: String,
    imageUrl: String,
    earnedOn: {
      type: Date,
      default: Date.now
    }
  }],
  // Last activity timestamp
  lastActive: {
    type: Date,
    default: Date.now
  },
  // Self-regulation metrics
  selfRegulation: {
    // Number of self-scheduled sessions
    scheduledSessions: {
      type: Number,
      default: 0
    },
    // Number of completed self-scheduled sessions
    completedScheduledSessions: {
      type: Number,
      default: 0
    },
    // Goal completion rate
    goalCompletionRate: {
      type: Number, // percentage
      default: 0
    },
    // Study consistency score (0-100)
    consistencyScore: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Add index for efficient querying
StudentProgressSchema.index({ student: 1 });
StudentProgressSchema.index({ 'enrolledPaths.learningPath': 1 });

module.exports = mongoose.model('StudentProgress', StudentProgressSchema);