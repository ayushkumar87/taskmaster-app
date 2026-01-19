import axios from 'axios';

const API_URL = import.meta.env.DEV
    ? 'http://127.0.0.1:5000/api'
    : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api');

console.log("Using API_URL:", API_URL); // Debugging: Log the API URL being used

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
