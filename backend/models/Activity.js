const mongoose = require('mongoose');

/**
 * Activity model representing both digital learning activities and authentic learning tasks
 * that bridge digital content with real-world applications.
 */
const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Type of activity
  activityType: {
    type: String,
    enum: [
      // Digital activity types
      'coding', 'quiz', 'reading', 'video', 'interactive', 'worksheet',
      // Authentic learning types
      'project', 'real_world_application', 'problem_based', 'collaborative', 
      'portfolio', 'community', 'experiment'
    ],
    required: true
  },
  // Is this an authentic learning task?
  isAuthenticTask: {
    type: Boolean,
    default: false
  },
  // Difficulty level (tiered learning support)
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner',
    required: true
  },
  // Curriculum references
  curriculumStage: {
    type: String,
    enum: ['KS3', 'KS4-GCSE', 'both'],
    required: true
  },
  // Duration in minutes
  estimatedDuration: {
    type: Number,
    required: true
  },
  // Learning objectives
  learningObjectives: [{
    type: String,
    required: true
  }],
  // Instructions
  instructions: {
    type: String,
    required: true
  },
  // For coding activities
  codingActivityDetails: {
    starterCode: String,
    language: {
      type: String,
      enum: ['python', 'javascript', 'java', 'scratch', 'html', 'css', 'sql']
    },
    testCases: [{
      input: String,
      expectedOutput: String,
      isHidden: {
        type: Boolean,
        default: false
      }
    }],
    hints: [{
      text: String,
      pointCost: {
        type: Number,
        default: 0
      }
    }]
  },
  // For quiz activities (quick knowledge checks)
  quizDetails: {
    questions: [{
      questionText: String,
      questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'matching']
      },
      options: [{
        text: String,
        isCorrect: Boolean
      }],
      correctAnswer: String,
      explanation: String,
      points: {
        type: Number,
        default: 1
      }
    }],
    passingScore: {
      type: Number,
      default: 70
    }
  },
  // For interactive or multimedia activities
  resourceDetails: {
    resourceType: {
      type: String,
      enum: ['video', 'simulation', 'game', 'weblink']
    },
    url: String,
    embedCode: String,
    interactivityLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  // For worksheet/document activities
  documentDetails: {
    fileUrl: String,
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'image', 'markdown']
    }
  },
  // Points awarded for completing the activity
  pointsAwarded: {
    type: Number,
    default: 10
  },
  // Creator of the activity
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // References to learning paths this activity belongs to
  learningPaths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath'
  }],
  // Pedagogical principles alignment
  pedagogicalPrinciples: {
    supportsCognitiveLoad: {
      type: Boolean,
      default: false
    }, 
    // ZPD alignment with more detailed structure
    zpdAlignment: {
      level: {
        type: String,
        enum: ['foundational', 'instructional', 'challenge'],
        default: 'instructional'
      },
      scaffoldingLevel: {
        type: String,
        enum: ['high', 'medium', 'low', 'none'],
        default: 'medium'
      },
      teacherInterventionRecommended: {
        type: Boolean,
        default: false
      }
    },
    teacherFacilitation: {
      type: String,
      enum: ['high', 'medium', 'low', 'none'],
      default: 'medium',
      description: 'Level of teacher involvement recommended'
    },
    supportsFormativeAssessment: {
      type: Boolean,
      default: false
    }
  },
  // For authentic learning tasks
  authenticTaskDetails: {
    // Connection to real-world context
    realWorldContext: String,
    // Expected outcomes and deliverables
    deliverables: [{
      name: String,
      description: String,
      format: String,
    }],
    // Teacher guidance for authentic task implementation
    teacherGuidance: String,
    // Reflection prompts for students
    reflectionPrompts: [String],
    // Connection to digital learning content
    connectionToDigitalContent: String
  },
  // Tags for search and filtering
  tags: [{
    type: String
  }],
  // Is this activity published?
  isPublished: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Activity', ActivitySchema);