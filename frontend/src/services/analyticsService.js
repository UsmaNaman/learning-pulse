import axios from 'axios';

class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageStartTime = Date.now();
    this.interactions = [];
    
    // Auto-send interactions every 30 seconds
    this.sendInterval = setInterval(() => {
      this.sendPendingInteractions();
    }, 30000);

    // Send interactions when page unloads
    window.addEventListener('beforeunload', () => {
      this.sendPendingInteractions();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackInteraction('page_blur', { timeSpent: this.getTimeOnPage() });
      } else {
        this.pageStartTime = Date.now();
        this.trackInteraction('page_focus');
      }
    });
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getTimeOnPage() {
    return Math.round((Date.now() - this.pageStartTime) / 1000);
  }

  async trackInteraction(type, metadata = {}) {
    const interaction = {
      interactionType: type,
      pageUrl: window.location.href,
      referrerUrl: document.referrer,
      metadata: {
        ...metadata,
        deviceType: this.getDeviceType(),
        browserInfo: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString()
      },
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    };

    this.interactions.push(interaction);

    // Send immediately for critical interactions
    const criticalInteractions = [
      'assessment_complete', 'quiz_complete', 'badge_earned', 
      'error_occurred', 'feedback_submit'
    ];
    
    if (criticalInteractions.includes(type)) {
      await this.sendPendingInteractions();
    }
  }

  async sendPendingInteractions() {
    if (this.interactions.length === 0) return;

    // Skip analytics in production GitHub Pages environment
    if (window.location.hostname === 'usmanaman.github.io') {
      this.interactions = []; // Clear interactions
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't track anonymous users

      await axios.post('http://localhost:5000/api/analytics/interactions', {
        interactions: this.interactions
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      this.interactions = []; // Clear sent interactions
    } catch (error) {
      console.warn('Failed to send analytics:', error);
      // Keep interactions for retry if it's a temporary network error
      if (this.interactions.length > 100) {
        this.interactions = this.interactions.slice(-50); // Keep only last 50
      }
    }
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  // Specific tracking methods for common interactions

  trackPageView() {
    this.pageStartTime = Date.now();
    this.trackInteraction('page_view', {
      loadTime: performance.now()
    });
  }

  trackButtonClick(buttonId, buttonText) {
    this.trackInteraction('button_click', {
      targetElement: buttonId,
      buttonText: buttonText
    });
  }

  trackResourceAccess(resourceId, resourceType, topicId) {
    this.trackInteraction('resource_access', {
      resourceId: resourceId,
      resourceType: resourceType,
      topicId: topicId,
      timeSpent: this.getTimeOnPage()
    });
  }

  trackVideoEvent(action, videoId, currentTime, duration) {
    this.trackInteraction(`video_${action}`, {
      resourceId: videoId,
      currentTime: currentTime,
      duration: duration,
      completionPercentage: duration > 0 ? (currentTime / duration) * 100 : 0
    });
  }

  trackQuizStart(quizId, topicId, bloomsLevel) {
    this.trackInteraction('quiz_start', {
      assessmentId: quizId,
      topicId: topicId,
      bloomsLevel: bloomsLevel
    });
  }

  trackQuizComplete(quizId, topicId, score, timeSpent, hintsUsed, bloomsLevel) {
    this.trackInteraction('quiz_complete', {
      assessmentId: quizId,
      topicId: topicId,
      score: score,
      timeSpent: timeSpent,
      hintsUsed: hintsUsed,
      bloomsLevel: bloomsLevel,
      success: score >= 70
    });
  }

  trackAssessmentStart(assessmentId, topicId, bloomsLevel) {
    this.trackInteraction('assessment_start', {
      assessmentId: assessmentId,
      topicId: topicId,
      bloomsLevel: bloomsLevel
    });
  }

  trackAssessmentComplete(assessmentId, topicId, score, timeSpent, hintsUsed, attemptNumber) {
    this.trackInteraction('assessment_complete', {
      assessmentId: assessmentId,
      topicId: topicId,
      score: score,
      timeSpent: timeSpent,
      hintsUsed: hintsUsed,
      attemptNumber: attemptNumber,
      success: score >= 70
    });
  }

  trackHintRequest(questionId, hintNumber, topicId) {
    this.trackInteraction('hint_request', {
      resourceId: questionId,
      hintsUsed: hintNumber,
      topicId: topicId
    });
  }

  trackFeedbackSubmit(feedbackType, rating, resourceId, topicId) {
    this.trackInteraction('feedback_submit', {
      feedbackType: feedbackType,
      rating: rating,
      resourceId: resourceId,
      topicId: topicId
    });
  }

  trackReflectionSubmit(topicId, reflectionData) {
    this.trackInteraction('reflection_submit', {
      topicId: topicId,
      confidenceLevel: reflectionData.confidence,
      timeSpent: this.getTimeOnPage()
    });
  }

  trackBadgeEarned(badgeId, badgeType) {
    this.trackInteraction('badge_earned', {
      badgeId: badgeId,
      badgeType: badgeType
    });
  }

  trackStreakAchieved(streakLength, streakType) {
    this.trackInteraction('streak_achieved', {
      streakLength: streakLength,
      streakType: streakType
    });
  }

  trackTopicComplete(topicId, finalScore, timeSpent) {
    this.trackInteraction('topic_complete', {
      topicId: topicId,
      score: finalScore,
      timeSpent: timeSpent,
      success: finalScore >= 70
    });
  }

  trackError(errorType, errorMessage, context) {
    this.trackInteraction('error_occurred', {
      errorType: errorType,
      errorMessage: errorMessage,
      context: context
    });
  }

  // Get analytics for current user
  async getUserAnalytics(timeframe = 30) {
    // Skip analytics in production GitHub Pages environment
    if (window.location.hostname === 'usmanaman.github.io') {
      return null;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await axios.get(`http://localhost:5000/api/analytics/user?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      return null;
    }
  }

  // Clean up resources
  destroy() {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
    }
    this.sendPendingInteractions();
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;