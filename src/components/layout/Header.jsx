// src/components/layout/Header.jsx (Updated for Sleek Design)

import { LogOut, Menu, Search, User } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import NotificationBell from './NotificationBell'; // NotificationBell কম্পোনেন্ট আমদানি

function Header() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
            {/* --- 1. Mobile Menu Toggle Button & Search --- */}
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="text-gray-500 lg:hidden focus:outline-none p-1 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition"
                    aria-label="Toggle Menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Search Bar Placeholder */}
                <div className="relative hidden sm:block">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects, or users..."
                        className="py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64 text-sm transition"
                    />
                </div>
            </div>

            {/* --- 2. User Info and Actions (Unified Block) --- */}
            {/* ✅ নতুন ডিজাইন: নোটিফিকেশন, ইউজার ডিটেইলস এবং লগআউট একটি পরিষ্কার ব্লকে */}
            <div className="flex items-center space-x-3">
                {/* 2.1. Notification Bell */}
                <NotificationBell />

                {/* 2.2. User Profile/Avatar (Grouped for better visual flow) */}
                <div className="flex items-center bg-gray-50 p-1.5 pl-3 rounded-full hover:bg-gray-100 transition duration-150 cursor-pointer">
                    {/* User Name and Role */}
                    <div className="hidden sm:block text-right pr-3 border-r border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 leading-none">
                            {user?.full_name || 'Project Manager'}
                        </p>
                        <p className="text-xs text-gray-500 leading-none mt-1">
                            {user?.role || 'Admin'}
                        </p>
                    </div>

                    {/* User Icon (Avatar Style) */}
                    {/* H-8 W-8 আইকনের বদলে H-7 W-7 করা হলো এবং ব্যাকগ্রাউন্ড কালার ব্যবহার করা হলো */}
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-500 text-white ml-3 mr-1 flex-shrink-0">
                        <User className="h-5 w-5" />
                    </div>
                </div>

                {/* 2.3. Logout Button (Cleaner look) */}
                <button
                    type="button"
                    onClick={logout}
                    className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition duration-150"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}

export default Header;
