import api from './api';

const progressService = {
  getUserProgress: () => api.get('/progress'),
  getLessonProgress: (lessonId) => api.get(`/progress/lesson/${lessonId}`),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  updateProgress: (progressData) => api.post('/progress', progressData),
  getDashboardStats: () => api.get('/progress/dashboard'),
  getClassOverview: () => api.get('/progress/class-overview'),
  getStudentProgress: (studentId) => api.get(`/progress/students/${studentId}`),
  getLearningAnalytics: () => api.get('/progress/analytics')
};

export default progressService;