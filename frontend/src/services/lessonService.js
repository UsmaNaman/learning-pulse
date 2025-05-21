import api from './api';

const lessonService = {
  getLessonsByCourse: (courseId) => api.get(`/courses/${courseId}/lessons`),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  createLesson: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  updateLesson: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
  // Add more lesson-related API calls as needed
};

export default lessonService;