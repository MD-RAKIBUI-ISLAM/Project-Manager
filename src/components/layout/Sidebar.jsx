// src/layout/Sidebar.jsx

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

import TaskMasterLogo from '../../assets/sidebarlogo.jpg';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. RBAC (Role-Based Access Control): 'isAdmin' ফ্ল্যাগটি 'AuthContext' থেকে আসছে।
 * ব্যাকএন্ড থেকে ইউজার অবজেক্টে 'role' প্রপার্টি নিশ্চিত করতে হবে (e.g., role: 'admin' or 'member')।
 * ২. Navigation Config: ভবিষ্যতে মেনু আইটেমগুলো ব্যাকএন্ড থেকে ডাইনামিকালি পাঠানো হলে (GET /api/navigation)
 * এই হার্ডকোডেড 'navLinks' অ্যারেটি রিপ্লেস করা যাবে।
 */

const baseNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Our Members', path: '/members', icon: Users },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: ListTodo }
];

function NavItem({ link, isAdmin, closeSidebar }) {
    const location = useLocation();
    const isActive = location.pathname.startsWith(link.path);

    const classes = isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

    // @BACKEND_LOGIC: নির্দিষ্ট রাউটের জন্য ব্যাকএন্ড পারমিশন চেক করা থাকলে এখানে আরও কন্ডিশন যোগ করা যাবে।
    if (link.requiresAdmin && !isAdmin) return null;
    if (link.requiresNonAdmin && isAdmin) return null;

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

function Sidebar() {
    // AuthContext থেকে সরাসরি স্টেট নেওয়া হচ্ছে যা এপিআই রেসপন্সের ওপর নির্ভরশীল
    const { isAdmin, loading } = useAuth();
    const { isSidebarOpen, closeSidebar } = useSidebar();

    const navLinks = [
        ...baseNavLinks,
        isAdmin
            ? { name: 'User Management', path: '/admin/users', icon: Users, requiresAdmin: true }
            : { name: 'Team Members', path: '/team', icon: Users, requiresNonAdmin: true }
    ];

    /**
     * @BACKEND_INTEGRATION:
     * এপিআই থেকে ইউজার ডাটা ফেচ করার সময় 'loading' ট্রু থাকবে।
     * এটি নিশ্চিত করে যে ভুল রোল (Role) নিয়ে মেনু রেন্ডার হবে না।
     */
    if (loading) {
        return (
            <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 animate-pulse" />
        );
    }

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-50 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        transition-transform duration-300 ease-in-out lg:static lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 lg:justify-center p-2">
                    <div className="flex items-center">
                        <img
                            src={TaskMasterLogo}
                            alt="TaskMaster Logo"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        <h1 className="text-xl font-bold text-indigo-700 ml-2">TaskMaster</h1>
                    </div>
                    <button
                        type="button"
                        onClick={closeSidebar}
                        className="text-gray-500 lg:hidden p-2"
                        aria-label="Close Menu"
                    >
                        <X className="h-8 w-8" />
                    </button>
                </div>

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

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}
        </>
    );
}

export default Sidebar;
