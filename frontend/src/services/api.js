import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' 
    ? 'https://mern-todo-app-pj30.onrender.com/api' 
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(config => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const token = JSON.parse(userInfo).token;
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
