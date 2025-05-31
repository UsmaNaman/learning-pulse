const mongoose = require('mongoose');

const DataProcessingConsentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  consentVersion: {
    type: String,
    required: true,
    default: '1.0'
  },
  consentType: {
    type: String,
    enum: [
      'essential', // Required for service operation
      'analytics', // Performance and usage analytics
      'personalization', // Personalized learning recommendations
      'communication', // Educational communications
      'marketing' // Optional marketing communications
    ],
    required: true
  },
  consentGiven: {
    type: Boolean,
    required: true
  },
  consentDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  withdrawalDate: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  // Legal basis for processing
  legalBasis: {
    type: String,
    enum: [
      'consent', // User has given consent
      'contract', // Processing necessary for contract
      'legal_obligation', // Required by law
      'vital_interests', // Protecting vital interests
      'public_task', // Public task/official authority
      'legitimate_interests' // Legitimate interests
    ],
    required: true,
    default: 'consent'
  },
  // Data retention period
  retentionPeriod: {
    type: Number, // in days
    required: true,
    default: 2555 // 7 years for educational records
  },
  // Purpose of data processing
  processingPurpose: {
    type: [String],
    required: true,
    default: ['education', 'progress_tracking']
  },
  // Data categories being processed
  dataCategories: {
    type: [String],
    enum: [
      'personal_details', // Name, email
      'academic_data', // Scores, progress
      'usage_data', // How they use the platform
      'communication_data', // Messages, feedback
      'technical_data' // IP, browser info
    ],
    required: true
  }
});

// Compound indexes for GDPR compliance queries
DataProcessingConsentSchema.index({ user: 1, consentType: 1, consentDate: -1 });
DataProcessingConsentSchema.index({ consentDate: 1 }); // For retention cleanup
DataProcessingConsentSchema.index({ withdrawalDate: 1 }); // For withdrawn consents

// TTL index for automatic cleanup of old consent records
DataProcessingConsentSchema.index(
  { consentDate: 1 }, 
  { 
    expireAfterSeconds: 220752000, // 7 years
    partialFilterExpression: { withdrawalDate: { $exists: true } }
  }
);

module.exports = mongoose.model('DataProcessingConsent', DataProcessingConsentSchema);