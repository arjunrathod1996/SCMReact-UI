// api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${localStorage.getItem('token')}`
//   }
// });

// export default api;

// src/api/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        // Add other default headers if necessary
    }
});

// Optionally, you can add a request interceptor to include auth headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // or however you manage your token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;

