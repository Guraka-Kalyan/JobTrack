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
    const appError = new Error();

    if (error.response) {
      // Backend returned an HTTP error response (e.g. 400, 404, 500)
      appError.statusCode = error.response.status;

      if (error.response.data) {
        if (error.response.data.fieldErrors) {
          // Format validation errors into a readable message
          const fieldErrors = Object.entries(error.response.data.fieldErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
          errorMessage = `Validation error: ${fieldErrors}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error (${error.response.status})`;
        }
      }
    } else if (error.request) {
      // Request was sent but no response received — server may be sleeping (Render free tier)
      // isNetworkError=true signals to the retry hook that this is safe to retry automatically.
      errorMessage =
        'Unable to reach the backend. The server may be starting up — please wait a moment.';
      appError.isNetworkError = true;
    } else {
      errorMessage = error.message;
    }

    appError.message = errorMessage;
    return Promise.reject(appError);
  }
);

export default api;
