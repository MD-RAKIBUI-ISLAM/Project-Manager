// src/components/layout/Sidebar.jsx (FINAL FIX - Role Consistency)

import {
    Briefcase,
    ChevronRight,
    LayoutDashboard,
    ListTodo,
    Settings,
    Users,
    X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import TaskMasterLogo from '../../assets/sidebarlogo2.jpg';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { USER_ROLES } from '../../utils/constants'; // FIX 1: USER_ROLES কনস্ট্যান্ট আমদানি করা

// --- Global Nav Links Data ---
const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
    // requiredAdmin: true সেট করা আছে
    { name: 'User Management', path: '/admin/users', icon: Users, requiresAdmin: true }
];

// NavItem কম্পোনেন্ট
function NavItem({ link, isAdmin, closeSidebar }) {
    const location = useLocation();

    const isActive = location.pathname.startsWith(link.path);
    const classes = isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

    // যদি লিঙ্কটি Admin অ্যাক্সেস দাবি করে এবং ইউজার Admin না হয়, তবে লিঙ্কটি রেন্ডার হবে না
    if (link.requiresAdmin && !isAdmin) {
        return null;
    }

    return (
        <Link
            to={link.path}
            onClick={closeSidebar}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150 ${classes}`}
        >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
        </Link>
    );
}

// --- Sidebar কম্পোনেন্ট ---
function Sidebar() {
    const { user } = useAuth();
    const { isSidebarOpen, closeSidebar } = useSidebar();

    // FIX 2: isAdmin চেকটিকে শুধুমাত্র USER_ROLES.ADMIN এর জন্য সেট করা হলো।
    // এটি /admin/users রুটের সুরক্ষা নীতির সাথে সামঞ্জস্যপূর্ণ।
    const isAdmin = user?.role === USER_ROLES.ADMIN;

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-50 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        transition-transform duration-300 ease-in-out lg:static lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none`}
            >
                {/* Header / Close Button for Mobile */}
                <div className="flex items-center justify-between border-b border-gray-200 lg:justify-center">
                    <div className="flex items-center">
                        <img
                            src={TaskMasterLogo}
                            alt="TaskMaster Logo"
                            className="h-20 w-20 rounded-full" // লোগোর আকার সেট করা হলো
                        />
                        <h1 className="text-2xl font-bold text-indigo-700">TaskMaster</h1>
                    </div>{' '}
                    <button
                        type="button"
                        onClick={closeSidebar}
                        className="text-gray-500 lg:hidden hover:text-red-600"
                        aria-label="Close Menu"
                    >
                        <X className="h-10 w-10 pr-4" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => (
                        <NavItem
                            key={link.name}
                            link={link}
                            isAdmin={isAdmin}
                            closeSidebar={closeSidebar}
                        />
                    ))}
                </nav>

                {/* Footer / Settings Link */}
                <div className="p-4 border-t border-gray-200">
                    <Link
                        to="/settings"
                        onClick={closeSidebar}
                        className="flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                    >
                        <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Mobile Backdrop (Outside click to close) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}
        </>
    );
}

export default Sidebar;
