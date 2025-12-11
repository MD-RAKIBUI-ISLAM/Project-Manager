// src/components/layout/Header.jsx (Updated for Sleek Design)

import { LogOut, Menu, Search, User } from 'lucide-react';
import { useMemo } from 'react'; // useMemo আমদানি করা হলো

import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { mockProjectMembers } from '../../utils/constants'; // ✅ mockProjectMembers আমদানি করা হলো
import NotificationBell from './NotificationBell';

function Header() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();

    // 1. লগইন করা ইউজারের সম্পূর্ণ ডেটা খুঁজে বের করা (ছবি সহ)
    const loggedInMemberData = useMemo(() => {
        if (user && user.id) {
            // useAuth থেকে পাওয়া user.id দিয়ে mockProjectMembers থেকে সম্পূর্ণ ডেটা খুঁজে নেওয়া
            return mockProjectMembers.find((member) => member.id === user.id);
        }
        return null;
    }, [user]);

    // প্রদর্শনের জন্য ডেটা নির্ধারণ
    const displayName = loggedInMemberData?.name || user?.full_name || 'User Name';
    const displayRole = loggedInMemberData?.role || user?.role || 'Role';
    const displayImage = loggedInMemberData?.image; // ছবি (যদি থাকে)

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
            <div className="flex items-center space-x-3">
                {/* 2.1. Notification Bell */}
                <NotificationBell />

                {/* 2.2. User Profile/Avatar (Grouped for better visual flow) */}
                <div className="flex items-center bg-gray-50 p-1.5 pl-3 rounded-full hover:bg-gray-100 transition duration-150 cursor-pointer">
                    {/* User Name and Role (ডায়নামিক ডেটা) */}
                    <div className="hidden sm:block text-right pr-3 border-r border-gray-200">
                        <p className="text-sm uppercase font-semibold text-gray-800 leading-none">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 leading-none mt-1">{displayRole}</p>
                    </div>

                    {/* User Image/Icon (Avatar Style) */}
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-500 text-white ml-3 mr-1 flex-shrink-0 overflow-hidden">
                        {displayImage ? (
                            // ✅ যদি ছবি পাওয়া যায়, তবে তা প্রদর্শন করবে
                            <img
                                src={displayImage}
                                alt={displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            // যদি ছবি না পাওয়া যায়, তবে ডিফল্ট ইউজার আইকন দেখাবে
                            <User className="h-5 w-5" />
                        )}
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
