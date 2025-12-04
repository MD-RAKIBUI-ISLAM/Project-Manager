// src/api/axiosClient.js

import axios from 'axios';

// এই URL-টি আপনার Django Backend API-এর বেস URL হতে হবে।
// এটি ডেভেলপমেন্টের জন্য সাধারণত http://127.0.0.1:8000/api/v1/ হবে।
const BASE_URL = 'http://127.0.0.1:8000/api/';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // যদি Django Session/Cookie ব্যবহার করা হয়
});

// রিকোয়েস্ট ইন্টারসেপ্টর (Request Interceptor):
// প্রতিটি রিকোয়েস্ট পাঠানোর আগে Auth টোকেন (যদি localStorage-এ থাকে) হেডার-এ যুক্ত করা।
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// রেসপন্স ইন্টারসেপ্টর (Response Interceptor):
// API থেকে আসা এরর বা 401 Unauthorized হ্যান্ডেল করা।
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // যদি 401 Error আসে এবং এটি Refresh Token Request না হয়:
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // এখানে Refresh Token logic যুক্ত হবে (যদি JWT ব্যবহার করেন)
            // আপাতত, টোকেন না থাকলে user-কে Logout করে Login page-এ redirect করা যেতে পারে।

            // console.error("Unauthorized request. Token might be expired.");
            // localStorage.removeItem('access_token');
            // window.location.href = '/login'; // এটি AuthContext হ্যান্ডেল করবে।

            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
