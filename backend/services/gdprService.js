const User = require('../models/User');
const UserInteraction = require('../models/UserInteraction');
const DataProcessingConsent = require('../models/DataProcessingConsent');
const DataExportRequest = require('../models/DataExportRequest');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class GDPRService {
  
  /**
   * Record user consent for data processing
   */
  static async recordConsent(userId, consentData, requestInfo) {
    try {
      const consent = new DataProcessingConsent({
        user: userId,
        consentType: consentData.consentType,
        consentGiven: consentData.consentGiven,
        consentVersion: consentData.version || '1.0',
        legalBasis: consentData.legalBasis || 'consent',
        dataCategories: consentData.dataCategories || ['personal_details', 'academic_data'],
        processingPurpose: consentData.processingPurpose || ['education', 'progress_tracking'],
        ipAddress: this.hashIP(requestInfo.ip),
        userAgent: requestInfo.userAgent
      });

      await consent.save();
      return consent;
    } catch (error) {
      console.error('Error recording consent:', error);
      throw error;
    }
  }

  /**
   * Withdraw consent for specific data processing
   */
  static async withdrawConsent(userId, consentType, requestInfo) {
    try {
      const consent = await DataProcessingConsent.findOne({
        user: userId,
        consentType: consentType,
        consentGiven: true,
        withdrawalDate: null
      }).sort({ consentDate: -1 });

      if (!consent) {
        throw new Error('No active consent found for this type');
      }

      consent.withdrawalDate = new Date();
      await consent.save();

      // Record new consent record showing withdrawal
      const withdrawalConsent = new DataProcessingConsent({
        user: userId,
        consentType: consentType,
        consentGiven: false,
        consentVersion: consent.consentVersion,
        legalBasis: consent.legalBasis,
        dataCategories: consent.dataCategories,
        processingPurpose: consent.processingPurpose,
        ipAddress: this.hashIP(requestInfo.ip),
        userAgent: requestInfo.userAgent
      });

      await withdrawalConsent.save();
      return withdrawalConsent;
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      throw error;
    }
  }

  /**
   * Check if user has given consent for specific data processing
   */
  static async hasConsent(userId, consentType) {
    try {
      const consent = await DataProcessingConsent.findOne({
        user: userId,
        consentType: consentType,
        consentGiven: true,
        withdrawalDate: null
      }).sort({ consentDate: -1 });

      return !!consent;
    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  }

  /**
   * Get all user consent records
   */
  static async getUserConsents(userId) {
    try {
      const consents = await DataProcessingConsent.find({
        user: userId
      }).sort({ consentDate: -1 });

      return consents;
    } catch (error) {
      console.error('Error getting user consents:', error);
      throw error;
    }
  }

  /**
   * Export all user data (GDPR Article 20 - Right to Data Portability)
   */
  static async exportUserData(userId, requestInfo, dataCategories = ['all']) {
    try {
      // Create export request record
      const exportRequest = new DataExportRequest({
        user: userId,
        requestType: 'data_export',
        dataCategories: dataCategories,
        requestIP: this.hashIP(requestInfo.ip),
        requestUserAgent: requestInfo.userAgent,
        downloadToken: crypto.randomBytes(32).toString('hex'),
        downloadExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      await exportRequest.save();

      // Collect all user data
      const userData = await this.collectUserData(userId, dataCategories);

      // Generate export file
      const exportPath = await this.generateExportFile(userId, userData, exportRequest.downloadToken);
      
      exportRequest.status = 'completed';
      exportRequest.completionDate = new Date();
      exportRequest.exportFilePath = exportPath;
      await exportRequest.save();

      return {
        requestId: exportRequest._id,
        downloadToken: exportRequest.downloadToken,
        downloadExpiry: exportRequest.downloadExpiry,
        dataExported: Object.keys(userData)
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  /**
   * Collect all user data for export
   */
  static async collectUserData(userId, dataCategories) {
    const userData = {};

    try {
      // Always include basic profile data
      const user = await User.findById(userId).select('-password');
      userData.profile = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registeredOn: user.registeredOn,
        lastActive: user.lastActive,
        preferences: user.preferences,
        exportDate: new Date().toISOString()
      };

      if (dataCategories.includes('all') || dataCategories.includes('interactions')) {
        // User interactions (last 2 years for performance)
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        
        userData.interactions = await UserInteraction.find({
          user: userId,
          timestamp: { $gte: twoYearsAgo }
        }).select('-ipAddress').sort({ timestamp: -1 });
      }

      if (dataCategories.includes('all') || dataCategories.includes('consent_records')) {
        // Consent records
        userData.consents = await DataProcessingConsent.find({
          user: userId
        }).sort({ consentDate: -1 });
      }

      // Add more data categories as needed...

      return userData;
    } catch (error) {
      console.error('Error collecting user data:', error);
      throw error;
    }
  }

  /**
   * Generate export file
   */
  static async generateExportFile(userId, userData, downloadToken) {
    try {
      const exportDir = path.join(process.cwd(), 'exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      const filename = `user_data_${userId}_${downloadToken}.json`;
      const filepath = path.join(exportDir, filename);

      // Add metadata
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          userId: userId,
          dataCategories: Object.keys(userData),
          gdprCompliant: true,
          version: '1.0'
        },
        data: userData
      };

      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
      return filepath;
    } catch (error) {
      console.error('Error generating export file:', error);
      throw error;
    }
  }

  /**
   * Delete user data (GDPR Article 17 - Right to Erasure)
   */
  static async deleteUserData(userId, requestInfo) {
    try {
      // Create deletion request record
      const deletionRequest = new DataExportRequest({
        user: userId,
        requestType: 'data_deletion',
        requestIP: this.hashIP(requestInfo.ip),
        requestUserAgent: requestInfo.userAgent
      });

      await deletionRequest.save();

      // Anonymize or delete user data
      await this.anonymizeUserData(userId);

      deletionRequest.status = 'completed';
      deletionRequest.completionDate = new Date();
      deletionRequest.processingNotes = 'User data anonymized/deleted according to GDPR requirements';
      await deletionRequest.save();

      return deletionRequest;
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }

  /**
   * Anonymize user data while preserving analytical value
   */
  static async anonymizeUserData(userId) {
    try {
      // Anonymize user profile
      await User.findByIdAndUpdate(userId, {
        name: 'Deleted User',
        email: `deleted_${Date.now()}@example.com`,
        password: 'deleted',
        preferences: {},
        lastActive: null
      });

      // Anonymize interactions - keep for analytics but remove identifying info
      await UserInteraction.updateMany(
        { user: userId },
        { 
          $unset: { 
            ipAddress: 1,
            userAgent: 1,
            'metadata.personalData': 1
          }
        }
      );

      // Delete consent records (no longer needed)
      await DataProcessingConsent.deleteMany({ user: userId });

      console.log(`User data anonymized for user ID: ${userId}`);
    } catch (error) {
      console.error('Error anonymizing user data:', error);
      throw error;
    }
  }

  /**
   * Clean up old data according to retention policies
   */
  static async performDataRetentionCleanup() {
    try {
      const now = new Date();
      
      // Delete old interactions (older than 2 years)
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      
      const deletedInteractions = await UserInteraction.deleteMany({
        timestamp: { $lt: twoYearsAgo }
      });

      // Delete old export files
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const expiredRequests = await DataExportRequest.find({
        status: 'completed',
        completionDate: { $lt: thirtyDaysAgo }
      });

      for (const request of expiredRequests) {
        if (request.exportFilePath && fs.existsSync(request.exportFilePath)) {
          fs.unlinkSync(request.exportFilePath);
        }
      }

      await DataExportRequest.deleteMany({
        status: 'completed',
        completionDate: { $lt: thirtyDaysAgo }
      });

      console.log(`Data retention cleanup completed:`, {
        deletedInteractions: deletedInteractions.deletedCount,
        deletedExportRequests: expiredRequests.length
      });

      return {
        deletedInteractions: deletedInteractions.deletedCount,
        deletedExportRequests: expiredRequests.length
      };
    } catch (error) {
      console.error('Error performing data retention cleanup:', error);
      throw error;
    }
  }

  /**
   * Hash IP address for privacy
   */
  static hashIP(ip) {
    return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'default_salt')).digest('hex');
  }

  /**
   * Get data processing summary for transparency
   */
  static async getDataProcessingSummary(userId) {
    try {
      const consents = await DataProcessingConsent.find({
        user: userId,
        withdrawalDate: null
      }).sort({ consentDate: -1 });

      const activeConsents = consents.reduce((acc, consent) => {
        if (!acc[consent.consentType] || consent.consentDate > acc[consent.consentType].consentDate) {
          acc[consent.consentType] = consent;
        }
        return acc;
      }, {});

      return {
        activeConsents: Object.values(activeConsents),
        dataCategories: [...new Set(Object.values(activeConsents).flatMap(c => c.dataCategories))],
        processingPurposes: [...new Set(Object.values(activeConsents).flatMap(c => c.processingPurpose))],
        legalBases: [...new Set(Object.values(activeConsents).map(c => c.legalBasis))],
        retentionPeriods: Object.values(activeConsents).map(c => ({
          consentType: c.consentType,
          retentionDays: c.retentionPeriod
        }))
      };
    } catch (error) {
      console.error('Error getting data processing summary:', error);
      throw error;
    }
  }
}

module.exports = GDPRService;