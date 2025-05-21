import api from './api';

const assessmentService = {
  getAssessmentsByCourse: (courseId) => api.get(`/courses/${courseId}/assessments`),
  getAssessmentById: (id) => api.get(`/assessments/${id}`),
  createAssessment: (courseId, assessmentData) => api.post(`/courses/${courseId}/assessments`, assessmentData),
  updateAssessment: (id, assessmentData) => api.put(`/assessments/${id}`, assessmentData),
  deleteAssessment: (id) => api.delete(`/assessments/${id}`),
  // Add more assessment-related API calls as needed
};

export default assessmentService;