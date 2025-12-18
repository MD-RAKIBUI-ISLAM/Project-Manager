// src/components/layout/NotificationBell.jsx

import { Bell } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useNotifications } from '../../context/NotificationContext';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. Real-time Updates: এই সেকশনটি Socket.io বা Server-Sent Events (SSE) ব্যবহার করার জন্য উপযুক্ত।
 * ২. API Endpoints:
 * - GET /api/notifications (Fetch recent)
 * - PATCH /api/notifications/:id/read (Mark single as read)
 * - PATCH /api/notifications/read-all (Mark all as read)
 * ৩. Data Structure: প্রতিটি নোটিফিকেশনে 'link' (যেমন: /projects/1) এবং 'timestamp' থাকা আবশ্যক।
 */

function NotificationBell() {
    const { notifications, unreadCount, markAsRead, loading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // প্রদর্শনের জন্য সাম্প্রতিক ৫টি
    const recentNotifications = notifications.slice(0, 5);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleBellClick = () => {
        toggleDropdown();
        /** * @BACKEND_INTEGRATION:
         * বেল আইকন ক্লিক করলে 'PATCH /api/notifications/mark-seen' কল করা যেতে পারে
         * যাতে ডাটাবেজে এগুলোকে 'Seen' হিসেবে চিহ্নিত করা যায়।
         */
    };

    const handleNotificationClick = (id) => {
        markAsRead(id); // @BACKEND_CALL: PATCH /api/notifications/:id
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={handleBellClick}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition relative outline-none"
            >
                <Bell className="w-6 h-6" />

                {/* Unread Badge (Backend: unread_count field) */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    {loading && (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mx-auto" />
                        </div>
                    )}

                    {!loading && recentNotifications.length === 0 && (
                        <div className="p-8 text-center text-sm text-gray-400 italic">
                            No notifications yet.
                        </div>
                    )}

                    <div className="py-1 max-h-80 overflow-y-auto">
                        {recentNotifications.map((n) => (
                            <Link
                                key={n.id}
                                to={n.link}
                                onClick={() => handleNotificationClick(n.id)}
                                className={`block px-4 py-3 text-sm transition-colors border-l-4 ${
                                    n.is_read
                                        ? 'border-transparent text-gray-500 hover:bg-gray-50'
                                        : 'border-indigo-600 text-gray-900 font-semibold bg-indigo-50/30 hover:bg-indigo-50'
                                }`}
                            >
                                <p className="leading-tight">
                                    <span className="text-indigo-700">{n.actor}</span> {n.verb}{' '}
                                    <span className="font-bold text-gray-700">
                                        {n.relatedObject}
                                    </span>
                                </p>
                                <p className="text-[10px] mt-1.5 text-gray-400 flex items-center">
                                    {/* @BACKEND_TEAM: 'n.timestamp' ISO ফরম্যাটে হওয়া উচিত (যেমন: 2023-10-27T...) */}
                                    {new Date(n.timestamp).toLocaleDateString()} •{' '}
                                    {new Date(n.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50 text-center">
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold tracking-wide"
                            >
                                VIEW ALL ACTIVITY
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
