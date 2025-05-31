const AnalyticsService = require('../services/analyticsService');
const UserInteraction = require('../models/UserInteraction');

const analyticsController = {
  
  // Log user interactions
  async logInteractions(req, res) {
    try {
      const userId = req.user.id;
      const { interactions } = req.body;

      if (!interactions || !Array.isArray(interactions)) {
        return res.status(400).json({ message: 'Invalid interactions data' });
      }

      const savedInteractions = [];

      for (const interactionData of interactions) {
        try {
          const interaction = await AnalyticsService.logInteraction(
            userId,
            interactionData.sessionId,
            {
              interactionType: interactionData.interactionType,
              targetElement: interactionData.targetElement,
              pageUrl: interactionData.pageUrl,
              referrerUrl: interactionData.referrerUrl,
              metadata: interactionData.metadata,
              loadTime: interactionData.loadTime,
              userAgent: req.get('User-Agent'),
              ipAddress: this.hashIP(req.ip) // Hash IP for privacy
            }
          );
          savedInteractions.push(interaction);
        } catch (error) {
          console.error('Error saving individual interaction:', error);
        }
      }

      res.json({
        message: 'Interactions logged successfully',
        count: savedInteractions.length
      });
    } catch (error) {
      console.error('Error logging interactions:', error);
      res.status(500).json({ message: 'Failed to log interactions' });
    }
  },

  // Get user analytics
  async getUserAnalytics(req, res) {
    try {
      const userId = req.user.id;
      const timeframe = parseInt(req.query.timeframe) || 30;

      const analytics = await AnalyticsService.getUserAnalytics(userId, timeframe);

      res.json(analytics);
    } catch (error) {
      console.error('Error getting user analytics:', error);
      res.status(500).json({ message: 'Failed to get user analytics' });
    }
  },

  // Get class analytics (for teachers)
  async getClassAnalytics(req, res) {
    try {
      // Verify user is a teacher/instructor
      if (req.user.role !== 'instructor' && req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Teacher role required.' });
      }

      const { studentIds } = req.query;
      const timeframe = parseInt(req.query.timeframe) || 30;

      let userIds;
      if (studentIds) {
        userIds = Array.isArray(studentIds) ? studentIds : studentIds.split(',');
      } else {
        // If no specific students requested, get all students (demo implementation)
        const User = require('../models/User');
        const students = await User.find({ role: 'student' }).select('_id');
        userIds = students.map(s => s._id);
      }

      const analytics = await AnalyticsService.getClassAnalytics(userIds, timeframe);

      res.json(analytics);
    } catch (error) {
      console.error('Error getting class analytics:', error);
      res.status(500).json({ message: 'Failed to get class analytics' });
    }
  },

  // Get interaction timeline for a specific user (for detailed analysis)
  async getUserTimeline(req, res) {
    try {
      const userId = req.params.userId;
      const timeframe = parseInt(req.query.timeframe) || 7;

      // Check if requesting user has permission to view this data
      if (req.user.id !== userId && req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const interactions = await UserInteraction.find({
        user: userId,
        timestamp: { $gte: startDate }
      })
      .sort({ timestamp: -1 })
      .limit(1000) // Limit to prevent huge responses
      .select('-ipAddress -userAgent'); // Exclude sensitive data

      res.json({
        interactions,
        totalCount: interactions.length,
        timeframe,
        startDate,
        endDate: new Date()
      });
    } catch (error) {
      console.error('Error getting user timeline:', error);
      res.status(500).json({ message: 'Failed to get user timeline' });
    }
  },

  // Get popular resources analytics
  async getPopularResources(req, res) {
    try {
      const timeframe = parseInt(req.query.timeframe) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const popularResources = await UserInteraction.aggregate([
        {
          $match: {
            interactionType: 'resource_access',
            timestamp: { $gte: startDate },
            'metadata.resourceId': { $exists: true }
          }
        },
        {
          $group: {
            _id: '$metadata.resourceId',
            count: { $sum: 1 },
            totalTimeSpent: { $sum: '$metadata.timeSpent' },
            topicId: { $first: '$metadata.topicId' },
            resourceType: { $first: '$metadata.resourceType' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 20
        }
      ]);

      res.json(popularResources);
    } catch (error) {
      console.error('Error getting popular resources:', error);
      res.status(500).json({ message: 'Failed to get popular resources' });
    }
  },

  // Get engagement metrics for dashboard
  async getEngagementMetrics(req, res) {
    try {
      const timeframe = parseInt(req.query.timeframe) || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const metrics = await UserInteraction.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              user: "$user"
            },
            interactions: { $sum: 1 },
            timeSpent: { $sum: "$metadata.timeSpent" }
          }
        },
        {
          $group: {
            _id: "$_id.date",
            uniqueUsers: { $sum: 1 },
            totalInteractions: { $sum: "$interactions" },
            totalTimeSpent: { $sum: "$timeSpent" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      res.json(metrics);
    } catch (error) {
      console.error('Error getting engagement metrics:', error);
      res.status(500).json({ message: 'Failed to get engagement metrics' });
    }
  },

  // Helper method to hash IP addresses for privacy
  hashIP(ip) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default_salt').digest('hex');
  }
};

module.exports = analyticsController;