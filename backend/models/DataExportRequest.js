const mongoose = require('mongoose');

const DataExportRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  requestDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  requestType: {
    type: String,
    enum: ['data_export', 'data_deletion', 'data_portability', 'access_request'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    required: true
  },
  completionDate: {
    type: Date,
    default: null
  },
  exportFormat: {
    type: String,
    enum: ['json', 'csv', 'pdf'],
    default: 'json'
  },
  // Which data categories to include
  dataCategories: {
    type: [String],
    enum: [
      'profile_data',
      'academic_progress',
      'assessment_results',
      'learning_activities',
      'interactions',
      'feedback',
      'consent_records'
    ],
    default: ['profile_data', 'academic_progress', 'assessment_results']
  },
  // File path for the exported data (stored securely)
  exportFilePath: {
    type: String,
    default: null
  },
  // Secure download token
  downloadToken: {
    type: String,
    default: null
  },
  downloadExpiry: {
    type: Date,
    default: null
  },
  // Request details
  requestReason: {
    type: String,
    maxlength: 500
  },
  // IP and user agent for audit trail
  requestIP: {
    type: String,
    required: true
  },
  requestUserAgent: {
    type: String,
    required: true
  },
  // Processing notes
  processingNotes: {
    type: String,
    maxlength: 1000
  }
});

// TTL index - automatically delete completed requests after 30 days
DataExportRequestSchema.index(
  { completionDate: 1 }, 
  { 
    expireAfterSeconds: 2592000, // 30 days
    partialFilterExpression: { status: 'completed' }
  }
);

// Index for efficient status queries
DataExportRequestSchema.index({ status: 1, requestDate: -1 });

module.exports = mongoose.model('DataExportRequest', DataExportRequestSchema);