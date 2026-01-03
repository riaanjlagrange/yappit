import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 429) {
        // Rate limit exceeded
        const errorMessage =
          error.response.data.message || 'Too many requests. Please try again later.';
        return Promise.reject(new Error(errorMessage));
      } else if (error.response.data.message) {
        // Other API errors with a custom message
        return Promise.reject(new Error(error.response.data.message));
      } else {
        // Generic error
        return Promise.reject(new Error(`Request failed with status code ${error.response.status}`));
      }
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response received from server.'));
    } else {
      // Something else happened while setting up the request
      return Promise.reject(new Error('Error setting up the request.'));
    }
  },
);

export default api;
