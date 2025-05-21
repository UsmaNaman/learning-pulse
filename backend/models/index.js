// models/index.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import models
const UserModel = require('./User');
const ActivityModel = require('./Activity');
const AssessmentModel = require('./Assessment');
const CourseModel = require('./Course');
const LearningPathModel = require('./LearningPath');
const LessonModel = require('./Lesson');
const ProgressModel = require('./Progress');
const SkillLevelModel = require('./SkillLevel');
const StudentProgressModel = require('./StudentProgress');

// Additional models defined inline
// Curriculum Topic Model
const TopicSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  curriculumReference: { type: String, required: true },
  description: { type: String, required: true },
  subtopics: [{
    name: { type: String, required: true },
    description: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Learning Resource Model
const ResourceSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // Video, Document, Interactive, etc.
  format: { type: String, required: true }, // File format or delivery method
  url: { type: String, required: true },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  subtopic: { type: String },
  difficultyLevel: { type: String, required: true },
  estimatedDuration: { type: Number, required: true }, // Minutes
  description: { type: String, required: true },
  author: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  userRatings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }]
});

// Assessment Model
const AssessmentSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // quiz, project, etc.
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  difficultyLevel: { type: String, required: true },
  estimatedTime: { type: Number, required: true }, // Minutes
  questions: [{
    questionText: { type: String, required: true },
    questionType: { type: String, required: true }, // multiple_choice, short_answer, etc.
    options: [String], // For multiple choice
    correctAnswer: { type: String, required: true },
    points: { type: Number, required: true }
  }],
  totalPoints: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Mastery Level Model
const MasteryLevelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  color: { type: String, required: true }, // For visual representation
  createdAt: { type: Date, default: Date.now }
});

// Student Progress Model
const ProgressSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  currentMasteryLevel: { type: Schema.Types.ObjectId, ref: 'MasteryLevel', required: true },
  targetMasteryLevel: { type: Schema.Types.ObjectId, ref: 'MasteryLevel', required: true },
  startDate: { type: Date, required: true },
  completionDate: { type: Date },
  lastAssessmentDate: { type: Date },
  score: { type: Number },
  progress: { type: Number, required: true }, // Percentage
  nextSteps: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Assessment Result Model
const AssessmentResultSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  dateCompleted: { type: Date, required: true },
  score: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  percentage: { type: Number, required: true },
  questionResults: [{
    question: { type: Number, required: true }, // Index of the question
    studentAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    pointsAwarded: { type: Number, required: true }
  }],
  timeSpent: { type: Number }, // Minutes
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Activity Log Model
const ActivityLogSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, required: true }, // resource_accessed, assessment_completed, etc.
  resourceId: { type: Schema.Types.ObjectId }, // Optional reference to resource/assessment
  timestamp: { type: Date, default: Date.now, required: true },
  timeSpent: { type: Number }, // Minutes
  completionStatus: { type: Boolean },
  notes: { type: String }
});

// Create additional models
const Topic = mongoose.model('Topic', TopicSchema);
const Resource = mongoose.model('Resource', ResourceSchema);
const MasteryLevel = mongoose.model('MasteryLevel', MasteryLevelSchema);
const AssessmentResult = mongoose.model('AssessmentResult', AssessmentResultSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

// Export models
module.exports = {
  User: UserModel,
  Activity: ActivityModel,
  Assessment: AssessmentModel,
  Course: CourseModel,
  LearningPath: LearningPathModel,
  Lesson: LessonModel,
  Progress: ProgressModel,
  SkillLevel: SkillLevelModel,
  StudentProgress: StudentProgressModel,
  Topic,
  Resource,
  MasteryLevel,
  AssessmentResult,
  ActivityLog
};
