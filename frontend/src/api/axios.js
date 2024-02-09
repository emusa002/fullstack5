import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optionally, add request and response interceptors
axiosInstance.interceptors.request.use(request => {
    // Modify request configuration here if needed
    return request;
}, error => {
    // Handle request error here
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    // Modify response data here if needed
    return response;
}, error => {
    // Handle response error here
    return Promise.reject(error);
});

export default axiosInstance;
