const mongoose = require('mongoose');

const LearningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Main topic or subject area
  topic: {
    type: String,
    required: true
  },
  // Curriculum alignment
  curriculumStage: {
    type: String,
    enum: ['KS3', 'KS4-GCSE', 'both'],
    required: true
  },
  // The different nodes/steps in the learning path
  pathNodes: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    // The type of content in this node
    nodeType: {
      type: String,
      enum: ['lesson', 'assessment', 'activity', 'resource'],
      required: true
    },
    // Reference to actual content
    content: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'pathNodes.contentModel'
    },
    // The model to look up the content in
    contentModel: {
      type: String,
      enum: ['Lesson', 'Assessment', 'Activity'],
      required: function() {
        return this.nodeType !== 'resource';
      }
    },
    // For external resource links
    resourceUrl: {
      type: String,
      required: function() {
        return this.nodeType === 'resource';
      }
    },
    // Required skill level to access this node
    requiredSkillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    // Points earned for completing this node
    pointsValue: {
      type: Number,
      default: 10
    },
    // Next nodes that can be unlocked after this one
    nextNodes: [{
      type: Number // Index of next node in the pathNodes array
    }],
    // Is this node required for path completion?
    isRequired: {
      type: Boolean,
      default: true
    },
    // Metadata for teaching approaches
    teachingApproaches: {
      supportsFormativeAssessment: {
        type: Boolean,
        default: false
      },
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
      authenticLearning: {
        type: String,
        enum: ['application', 'real-world', 'project-based', 'simulation', 'none'],
        default: 'none'
      },
      cognitiveDifficulty: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    },
    // Estimated completion time in minutes
    estimatedTime: {
      type: Number,
      required: true
    }
  }],
  // Creator of the learning path
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Tags for searching
  tags: [{
    type: String
  }],
  // Is this path published and available to students?
  isPublished: {
    type: Boolean,
    default: false
  },
  // Flexible pacing settings
  pacing: {
    // Teacher-defined pace parameters
    expectedDuration: {
      type: Number, // Total expected days to complete the learning path
      required: true,
      default: 30
    },
    minPace: {
      type: Number, // Minimum nodes per week
      required: true,
      default: 2
    },
    maxTimePerNode: {
      type: Number, // Maximum days per node
      required: true,
      default: 7
    },
    syncPoints: [{
      nodeIndex: Number, // Index of node that requires synchronization
      syncDate: Date // Scheduled date for synchronized learning
    }],
    // Allow teacher override of pacing
    allowTeacherAdjustment: {
      type: Boolean,
      default: true
    }
  },
  // Checkpoints for teacher intervention
  checkpoints: [{
    nodeIndex: Number, // Path node where checkpoint occurs
    description: String,
    // Types: automatic (system flags for intervention), scheduled (regular review), milestone (key achievement)
    type: {
      type: String,
      enum: ['automatic', 'scheduled', 'milestone'],
      default: 'automatic'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LearningPath', LearningPathSchema);