const UserInteraction = require('../models/UserInteraction');

class AnalyticsService {
  
  /**
   * Log a user interaction
   */
  static async logInteraction(userId, sessionId, interactionData) {
    try {
      const interaction = new UserInteraction({
        user: userId,
        sessionId,
        ...interactionData,
        timestamp: new Date()
      });
      
      await interaction.save();
      return interaction;
    } catch (error) {
      console.error('Error logging interaction:', error);
      throw error;
    }
  }

  /**
   * Get user activity analytics
   */
  static async getUserAnalytics(userId, timeframe = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const interactions = await UserInteraction.find({
        user: userId,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: -1 });

      return {
        totalInteractions: interactions.length,
        dailyActivity: this.groupByDay(interactions),
        mostUsedResources: this.getMostUsedResources(interactions),
        timeSpentByTopic: this.getTimeSpentByTopic(interactions),
        assessmentPerformance: this.getAssessmentPerformance(interactions),
        engagementMetrics: this.getEngagementMetrics(interactions)
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  /**
   * Get class-wide analytics for teachers
   */
  static async getClassAnalytics(userIds, timeframe = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const interactions = await UserInteraction.find({
        user: { $in: userIds },
        timestamp: { $gte: startDate }
      }).populate('user', 'name email');

      return {
        totalStudents: userIds.length,
        activeStudents: this.getActiveStudents(interactions),
        classEngagement: this.getClassEngagement(interactions),
        popularResources: this.getMostUsedResources(interactions),
        strugglingTopics: this.getStrugglingTopics(interactions),
        timeDistribution: this.getTimeDistribution(interactions)
      };
    } catch (error) {
      console.error('Error getting class analytics:', error);
      throw error;
    }
  }

  /**
   * Group interactions by day
   */
  static groupByDay(interactions) {
    const daily = {};
    
    interactions.forEach(interaction => {
      const day = interaction.timestamp.toISOString().split('T')[0];
      if (!daily[day]) {
        daily[day] = {
          date: day,
          interactions: 0,
          timeSpent: 0,
          uniqueTopics: new Set()
        };
      }
      
      daily[day].interactions++;
      daily[day].timeSpent += interaction.metadata?.timeSpent || 0;
      
      if (interaction.metadata?.topicId) {
        daily[day].uniqueTopics.add(interaction.metadata.topicId);
      }
    });

    // Convert Set to array length
    Object.values(daily).forEach(day => {
      day.uniqueTopics = day.uniqueTopics.size;
    });

    return Object.values(daily).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Get most accessed resources
   */
  static getMostUsedResources(interactions) {
    const resourceCount = {};
    
    interactions
      .filter(i => i.interactionType === 'resource_access' && i.metadata?.resourceId)
      .forEach(interaction => {
        const resourceId = interaction.metadata.resourceId;
        if (!resourceCount[resourceId]) {
          resourceCount[resourceId] = {
            resourceId,
            count: 0,
            totalTimeSpent: 0,
            topicId: interaction.metadata?.topicId
          };
        }
        resourceCount[resourceId].count++;
        resourceCount[resourceId].totalTimeSpent += interaction.metadata?.timeSpent || 0;
      });

    return Object.values(resourceCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Get time spent by topic
   */
  static getTimeSpentByTopic(interactions) {
    const topicTime = {};
    
    interactions
      .filter(i => i.metadata?.topicId && i.metadata?.timeSpent)
      .forEach(interaction => {
        const topicId = interaction.metadata.topicId;
        if (!topicTime[topicId]) {
          topicTime[topicId] = {
            topicId,
            totalTime: 0,
            sessionCount: 0
          };
        }
        topicTime[topicId].totalTime += interaction.metadata.timeSpent;
        topicTime[topicId].sessionCount++;
      });

    return Object.values(topicTime)
      .map(topic => ({
        ...topic,
        averageTime: topic.totalTime / topic.sessionCount
      }))
      .sort((a, b) => b.totalTime - a.totalTime);
  }

  /**
   * Get assessment performance analytics
   */
  static getAssessmentPerformance(interactions) {
    const assessments = interactions.filter(i => 
      i.interactionType === 'assessment_complete' || i.interactionType === 'quiz_complete'
    );

    if (assessments.length === 0) {
      return {
        averageScore: 0,
        totalAssessments: 0,
        bloomsLevelPerformance: {},
        improvementTrend: []
      };
    }

    const scores = assessments.map(a => a.metadata?.score || 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Group by Bloom's level
    const bloomsPerformance = {};
    assessments.forEach(assessment => {
      const bloomsLevel = assessment.metadata?.bloomsLevel;
      if (bloomsLevel) {
        if (!bloomsPerformance[bloomsLevel]) {
          bloomsPerformance[bloomsLevel] = {
            scores: [],
            count: 0
          };
        }
        bloomsPerformance[bloomsLevel].scores.push(assessment.metadata.score || 0);
        bloomsPerformance[bloomsLevel].count++;
      }
    });

    // Calculate averages for each Bloom's level
    Object.keys(bloomsPerformance).forEach(level => {
      const data = bloomsPerformance[level];
      data.average = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    });

    return {
      averageScore: Math.round(averageScore),
      totalAssessments: assessments.length,
      bloomsLevelPerformance: bloomsPerformance,
      improvementTrend: this.calculateTrend(assessments)
    };
  }

  /**
   * Calculate engagement metrics
   */
  static getEngagementMetrics(interactions) {
    const sessions = this.groupBySessions(interactions);
    
    const metrics = {
      averageSessionLength: 0,
      totalSessions: sessions.length,
      bounceRate: 0, // Sessions with only 1 interaction
      returnRate: 0, // Sessions on different days
      deepEngagement: 0 // Sessions with > 10 interactions
    };

    if (sessions.length === 0) return metrics;

    const sessionLengths = sessions.map(s => s.duration);
    metrics.averageSessionLength = sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;

    const singleInteractionSessions = sessions.filter(s => s.interactions.length === 1).length;
    metrics.bounceRate = (singleInteractionSessions / sessions.length) * 100;

    const deepEngagementSessions = sessions.filter(s => s.interactions.length > 10).length;
    metrics.deepEngagement = (deepEngagementSessions / sessions.length) * 100;

    return metrics;
  }

  /**
   * Group interactions by session
   */
  static groupBySessions(interactions) {
    const sessions = {};
    
    interactions.forEach(interaction => {
      const sessionId = interaction.sessionId;
      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          sessionId,
          interactions: [],
          startTime: interaction.timestamp,
          endTime: interaction.timestamp
        };
      }
      
      sessions[sessionId].interactions.push(interaction);
      
      if (interaction.timestamp < sessions[sessionId].startTime) {
        sessions[sessionId].startTime = interaction.timestamp;
      }
      if (interaction.timestamp > sessions[sessionId].endTime) {
        sessions[sessionId].endTime = interaction.timestamp;
      }
    });

    // Calculate duration for each session
    return Object.values(sessions).map(session => ({
      ...session,
      duration: (session.endTime - session.startTime) / 1000 // in seconds
    }));
  }

  /**
   * Get active students count
   */
  static getActiveStudents(interactions) {
    const activeUsers = new Set();
    interactions.forEach(interaction => {
      if (interaction.user) {
        activeUsers.add(interaction.user._id.toString());
      }
    });
    return activeUsers.size;
  }

  /**
   * Get class engagement metrics
   */
  static getClassEngagement(interactions) {
    const userSessions = {};
    
    interactions.forEach(interaction => {
      const userId = interaction.user._id.toString();
      const sessionId = interaction.sessionId;
      
      if (!userSessions[userId]) {
        userSessions[userId] = new Set();
      }
      userSessions[userId].add(sessionId);
    });

    const sessionsPerUser = Object.values(userSessions).map(sessions => sessions.size);
    
    return {
      averageSessionsPerUser: sessionsPerUser.length > 0 
        ? sessionsPerUser.reduce((a, b) => a + b, 0) / sessionsPerUser.length 
        : 0,
      totalSessions: sessionsPerUser.reduce((a, b) => a + b, 0),
      activeUsers: Object.keys(userSessions).length
    };
  }

  /**
   * Get struggling topics (topics with low success rates)
   */
  static getStrugglingTopics(interactions) {
    const topicPerformance = {};
    
    interactions
      .filter(i => i.metadata?.topicId && i.metadata?.success !== undefined)
      .forEach(interaction => {
        const topicId = interaction.metadata.topicId;
        if (!topicPerformance[topicId]) {
          topicPerformance[topicId] = {
            topicId,
            attempts: 0,
            successes: 0
          };
        }
        
        topicPerformance[topicId].attempts++;
        if (interaction.metadata.success) {
          topicPerformance[topicId].successes++;
        }
      });

    return Object.values(topicPerformance)
      .map(topic => ({
        ...topic,
        successRate: (topic.successes / topic.attempts) * 100
      }))
      .filter(topic => topic.successRate < 60) // Topics with < 60% success rate
      .sort((a, b) => a.successRate - b.successRate);
  }

  /**
   * Get time distribution across different activities
   */
  static getTimeDistribution(interactions) {
    const distribution = {
      video: 0,
      quiz: 0,
      worksheet: 0,
      coding: 0,
      other: 0
    };

    interactions
      .filter(i => i.metadata?.timeSpent)
      .forEach(interaction => {
        const timeSpent = interaction.metadata.timeSpent;
        
        if (interaction.interactionType.includes('video')) {
          distribution.video += timeSpent;
        } else if (interaction.interactionType.includes('quiz') || interaction.interactionType.includes('assessment')) {
          distribution.quiz += timeSpent;
        } else if (interaction.metadata?.resourceId?.includes('worksheet')) {
          distribution.worksheet += timeSpent;
        } else if (interaction.interactionType.includes('coding')) {
          distribution.coding += timeSpent;
        } else {
          distribution.other += timeSpent;
        }
      });

    return distribution;
  }

  /**
   * Calculate improvement trend
   */
  static calculateTrend(assessments) {
    if (assessments.length < 2) return [];
    
    const sortedAssessments = assessments
      .filter(a => a.metadata?.score !== undefined)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return sortedAssessments.map((assessment, index) => ({
      date: assessment.timestamp.toISOString().split('T')[0],
      score: assessment.metadata.score,
      trend: index > 0 ? assessment.metadata.score - sortedAssessments[index - 1].metadata.score : 0
    }));
  }
}

module.exports = AnalyticsService;