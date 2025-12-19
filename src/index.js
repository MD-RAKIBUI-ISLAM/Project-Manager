// src/index.js

import './index.css'; // Tailwind CSS এবং গ্লোবাল স্টাইল

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
// NotificationProvider ডিফল্ট এক্সপোর্ট (যেমনটি আমরা তৈরি করেছিলাম)
import { NotificationProvider } from './context/NotificationContext';
// ✅ FIX: SidebarProvider এখন নেমড এক্সপোর্ট হিসেবে আমদানি করা হয়েছে
import { SidebarProvider } from './context/SidebarContext';

// React Query ক্লায়েন্ট সেটআপ
const queryClient = new QueryClient();

// React 18+ সিনট্যাক্স ব্যবহার করে রুট রেন্ডার করা
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {/* ✅ SidebarProvider ব্যবহার করা হলো */}
                    <SidebarProvider>
                        <NotificationProvider>
                            <App />
                        </NotificationProvider>
                    </SidebarProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
