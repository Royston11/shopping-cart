import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Login function
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        // Save the token in localStorage or sessionStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Re-throw to handle it at the component level or show an error message
    }
};

// Register function
export const register = async (name, email, password, userType) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, userType });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};
