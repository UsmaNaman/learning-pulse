import api from './api';
import mockDataService from './mockDataService';

const userService = {
  register: (userData) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.reject(new Error('Registration not available in demo mode'));
    }
    return api.post('/users', userData);
  },
  
  login: async (credentials) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const result = await mockDataService.login(credentials.email, credentials.password);
      return { data: result };
    }
    return api.post('/users/login', credentials);
  },
  
  getCurrentUser: () => {
    if (window.location.hostname === 'usmanaman.github.io') {
      const user = mockDataService.getCurrentUser();
      return Promise.resolve({ data: user });
    }
    return api.get('/users/me');
  },
  
  updateProfile: (userData) => {
    if (window.location.hostname === 'usmanaman.github.io') {
      return Promise.resolve({ data: { success: true, message: 'Profile updated in demo mode' } });
    }
    return api.put('/users/profile', userData);
  }
};

export default userService;