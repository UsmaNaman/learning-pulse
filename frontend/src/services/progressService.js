import api from './api';
import mockDataService from './mockDataService';

const progressService = {
  getUserProgress: async () => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const user = mockDataService.getCurrentUser();
      if (user && user.role === 'student') {
        const data = await mockDataService.getStudentDashboard(user.id);
        return { data };
      }
      return { data: null };
    }
    return api.get('/progress');
  },

  getLessonProgress: (lessonId) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.resolve({ data: { progress: 75, completed: true } });
    }
    return api.get(`/progress/lesson/${lessonId}`);
  },

  getCourseProgress: (courseId) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.resolve({ data: { progress: 68, lessonsCompleted: 24, totalLessons: 35 } });
    }
    return api.get(`/progress/course/${courseId}`);
  },

  updateProgress: (progressData) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.resolve({ data: { success: true } });
    }
    return api.post('/progress', progressData);
  },

  getDashboardStats: async () => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const user = mockDataService.getCurrentUser();
      if (user && user.role === 'instructor') {
        const data = await mockDataService.getInstructorDashboard();
        return { data };
      } else if (user && user.role === 'student') {
        const data = await mockDataService.getStudentDashboard(user.id);
        return { data };
      }
      return { data: null };
    }
    return api.get('/progress/dashboard');
  },

  getClassOverview: async () => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const data = await mockDataService.getInstructorDashboard();
      return { data };
    }
    return api.get('/progress/class-overview');
  },

  getStudentProgress: async (studentId) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const data = await mockDataService.getStudentProgress(studentId);
      return { data };
    }
    return api.get(`/progress/students/${studentId}`);
  },

  getLearningAnalytics: async () => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const dashboard = await mockDataService.getInstructorDashboard();
      return { data: dashboard.analytics };
    }
    return api.get('/progress/analytics');
  }
};

export default progressService;