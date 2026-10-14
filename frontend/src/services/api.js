import axios from 'axios';

// Create an axios instance with base settings
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Not using withCredentials since we're using token-based auth
  withCredentials: false,
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Expired or invalid login — clear it and go to the login page.
      // PUBLIC_URL keeps the /learning-pulse prefix; without it the router renders nothing.
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = `${process.env.PUBLIC_URL}/login`;
    }
    return Promise.reject(error);
  }
);

export default api;