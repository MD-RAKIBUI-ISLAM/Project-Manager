// src/components/auth/PrivateRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

/**
 * Role-Based Private Route Component
 * এই কম্পোনেন্টটি ইউজার লগইন করেছে কিনা এবং তার প্রয়োজনীয় রোল আছে কিনা তা পরীক্ষা করে।
 * * @param {object} props - কম্পোনেন্ট প্রপস
 * @param {React.ReactNode} props.children - রুট এর ভেতরে থাকা কম্পোনেন্ট
 * @param {string} [props.requiredRole] - এই রুটটি অ্যাক্সেস করার জন্য প্রয়োজনীয় রোল (যেমন: 'Admin')
 */
function PrivateRoute({ children, requiredRole }) {
    // AuthContext থেকে ইউজার ডেটা এবং লোডিং স্টেট অ্যাক্সেস করা
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. লোডিং স্টেট হ্যান্ডল করা
    if (loading) {
        // লোডিং চলাকালীন একটি ডিফল্ট লোডিং টেক্সট দেখানো
        return <div className="p-8 text-center text-gray-500">Loading access...</div>;
    }

    // 2. অথেন্টিকেশন চেক
    // যদি user অবজেক্ট না থাকে (লগইন করা না থাকে), তাহলে তাকে /login পেজে পাঠিয়ে দেওয়া
    if (!user) {
        // state-এ from: location যোগ করা হলো যাতে লগইনের পর ইউজার আবার এই পেজটিতে ফিরে আসতে পারে
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. রোল চেক (যদি requiredRole সেট করা থাকে)
    if (requiredRole && user.role !== requiredRole) {
        console.warn(`Access Denied: User role is ${user.role}, required role is ${requiredRole}`);
        // রোল না মিললে /dashboard পেজে রিডাইরেক্ট করা
        return <Navigate to="/dashboard" replace />;
    }

    // 4. সব শর্ত পূরণ হলে শিশুদের (Children) রেন্ডার করা
    return children;
}

export default PrivateRoute;
