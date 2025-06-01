import api from './api';
import mockDataService from './mockDataService';

const courseService = {
  getAllCourses: async () => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const data = await mockDataService.getCourses();
      return { data };
    }
    return api.get('/courses');
  },

  getCourseById: async (id) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const data = await mockDataService.getCourse(id);
      return { data };
    }
    return api.get(`/courses/${id}`);
  },

  createCourse: (courseData) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.reject(new Error('Course creation not available in demo mode'));
    }
    return api.post('/courses', courseData);
  },

  updateCourse: (id, courseData) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.resolve({ data: { success: true, message: 'Course updated in demo mode' } });
    }
    return api.put(`/courses/${id}`, courseData);
  },

  deleteCourse: (id) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.reject(new Error('Course deletion not available in demo mode'));
    }
    return api.delete(`/courses/${id}`);
  }
};

export default courseService;