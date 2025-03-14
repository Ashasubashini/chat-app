import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://chat-app-server-lemon.vercel.app/api/',
    withCredentials: true,
    
});