import axios from 'axios';

// Configure axios base URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Set base URL for all axios requests
axios.defaults.baseURL = API_URL;

// Add response interceptor for better error handling
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axios;
