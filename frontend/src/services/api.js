import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Centralized response error extractor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
      // Backend returned an error response (e.g. 400, 404, 500)
      if (error.response.data) {
        if (error.response.data.fieldErrors) {
          // Format validation errors into a friendly message
          const fieldErrors = Object.entries(error.response.data.fieldErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
          errorMessage = `Validation error: ${fieldErrors}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g. backend server is down)
      errorMessage = 'Unable to reach backend server. Please verify Spring Boot is running on port 8080.';
    } else {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
