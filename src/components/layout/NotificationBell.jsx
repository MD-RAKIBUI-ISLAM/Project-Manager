import { Bell } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useNotifications } from '../../context/NotificationContext';

function NotificationBell() {
    const { notifications, unreadCount, markAsRead, loading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // শুধু সাম্প্রতিক 5টি নোটিফিকেশন দেখানোর জন্য ফিল্টার
    const recentNotifications = notifications.slice(0, 5);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // Due to the scope, we will omit the outside click logic for brevity.

    const handleBellClick = () => {
        toggleDropdown();
        // Option to mark all *displayed* items as read when the bell is opened
    };

    // ✅ FIX: 'link' প্যারামিটারটি সরিয়ে দেওয়া হলো, কারণ এটি ফাংশনের ভেতরে ব্যবহৃত হচ্ছে না।
    const handleNotificationClick = (id) => {
        markAsRead(id);
        setIsOpen(false);
        // Navigate to the link (will be handled by Link component)
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={handleBellClick}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition relative"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {/* Unread Badge (FR-19) */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-30">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>

                    {loading && (
                        <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                    )}

                    {!loading && recentNotifications.length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No new notifications.
                        </div>
                    )}

                    <div className="py-1 max-h-72 overflow-y-auto">
                        {recentNotifications.map((n) => (
                            <Link
                                key={n.id}
                                to={n.link} // Link to related task/project (FR-17)
                                // ✅ onClick এ শুধু id পাস করা হচ্ছে
                                onClick={() => handleNotificationClick(n.id)}
                                className={`block px-4 py-3 text-sm transition ${
                                    n.is_read
                                        ? 'text-gray-500 hover:bg-gray-50'
                                        : 'text-gray-700 font-medium bg-indigo-50 hover:bg-indigo-100'
                                }`}
                            >
                                <p>
                                    <span className="font-semibold">{n.actor}</span> {n.verb}{' '}
                                    <span className="text-indigo-600">{n.relatedObject}</span>
                                </p>
                                <p className="text-xs mt-1 text-gray-400">
                                    {new Date(n.timestamp).toLocaleTimeString()}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* Footer Link */}
                    {notifications.length > 0 && (
                        <div className="p-2 border-t text-center">
                            <Link
                                to="/notifications" // Full Notification Page Link
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                See All Notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
