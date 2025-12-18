// src/components/layout/Header.jsx

import { LogOut, Menu, Search, User } from 'lucide-react';
import { useMemo } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { mockProjectMembers } from '../../utils/constants';
import NotificationBell from './NotificationBell';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. ইউজার প্রোফাইল: বর্তমানে ইউজার ডাটা (Name, Role, Image) 'mockProjectMembers' থেকে ফিল্টার করা হচ্ছে।
 * রিয়েল এপিআই-এর ক্ষেত্রে 'AuthContext'-এর 'user' অবজেক্টেই এই সব ডাটা (যেমন: user.avatar_url) থাকা উচিত।
 * ২. সার্চ অপারেশন: সার্চ ইনপুটটি বর্তমানে কেবল স্ট্যাটিক। এর জন্য একটি 'Debounced' API কল (GET /api/search?q=...) প্রয়োজন।
 */

function Header() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();

    // @BACKEND_INTEGRATION: API থেকে সরাসরি user.image/user.full_name আসলে এই useMemo লজিকটি আর লাগবে না।
    const loggedInMemberData = useMemo(() => {
        if (user && user.id) {
            return mockProjectMembers.find((member) => member.id === user.id);
        }
        return null;
    }, [user]);

    const displayName = loggedInMemberData?.name || user?.full_name || 'User Name';
    const displayRole = loggedInMemberData?.role || user?.role || 'Role';
    const displayImage = loggedInMemberData?.image;

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

                {/* Global Search */}
                <div className="relative hidden sm:block">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        /* @BACKEND_CALL: onChange={handleSearch} -> GET /api/v1/search */
                        placeholder="Search tasks, projects, or users..."
                        className="py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64 text-sm transition"
                    />
                </div>
            </div>

            {/* --- 2. User Info and Actions --- */}
            <div className="flex items-center space-x-3">
                {/* Notification: নোটিফিকেশন এপিআই রিয়েল-টাইম (Socket.io/SSE) হওয়া বাঞ্ছনীয় */}
                <NotificationBell />

                {/* User Profile Info */}
                <div className="flex items-center bg-gray-50 p-1.5 pl-3 rounded-full hover:bg-gray-100 transition duration-150 cursor-pointer">
                    <div className="hidden sm:block text-right pr-3 border-r border-gray-200">
                        <p className="text-sm uppercase font-semibold text-gray-800 leading-none">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 leading-none mt-1">{displayRole}</p>
                    </div>

                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-500 text-white ml-3 mr-1 flex-shrink-0 overflow-hidden border border-gray-100">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5" />
                        )}
                    </div>
                </div>

                {/* Logout: ব্যাকএন্ডে টোকেন ইনভ্যালিডেট করার জন্য লগআউট বাটন */}
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
