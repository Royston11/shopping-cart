import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the request headers if needed
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming the JWT token is saved in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle any errors globally if needed
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API call error:", error);
    return Promise.reject(error);
  }
);

export default instance;
