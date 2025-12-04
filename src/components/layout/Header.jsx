// src/components/layout/Header.jsx (Updated for Toggle Button)

import { LogOut, Menu, Search, User } from 'lucide-react'; // Menu icon import করুন

import { useSidebar } from '../../context/SidebarContext'; // <--- useSidebar hook আমদানি করুন
import useAuth from '../../hooks/useAuth';

function Header() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar(); // <--- toggleSidebar ফাংশন আনা হলো

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-md">
            {/* --- 1. Mobile Menu Toggle Button --- */}
            <div className="flex items-center space-x-3">
                <button
                    type="button"
                    onClick={toggleSidebar} // টগল ফাংশন কল করা হলো
                    className="text-gray-500 lg:hidden focus:outline-none hover:text-indigo-600"
                    aria-label="Toggle Menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Search Bar Placeholder */}
                <Search className="h-5 w-5 text-gray-400 hidden sm:block" />
                <input
                    type="text"
                    placeholder="Search tasks, projects, or users..."
                    className="p-2 border-none focus:ring-0 focus:outline-none w-64 text-sm hidden sm:block"
                />
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
                {/* User Name and Role */}
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-800">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Guest'}</p>
                </div>

                {/* User Icon */}
                <User className="h-8 w-8 text-indigo-600 rounded-full bg-indigo-100 p-1" />

                {/* Logout Button */}
                <button
                    type="button"
                    onClick={logout}
                    className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition duration-150"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}

export default Header;
