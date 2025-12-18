import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchNotifications, markAllAsRead, markAsRead } from '../api/notificationAPI';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. REAL-TIME UPDATES: Currently, notifications are fetched on mount. Consider using Socket.io or Server-Sent Events (SSE)
 * to push new notifications to the client in real-time.
 * 2. ENDPOINTS:
 * - GET /api/notifications : Fetch list of notifications for the logged-in user.
 * - PATCH /api/notifications/:id/read : Mark a specific notification as read.
 * - PATCH /api/notifications/read-all : Mark all notifications as read for the user.
 */

function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // নোটিফিকেশন ফেচ করার ফাংশন
    const loadNotifications = useCallback(async () => {
        setLoading(true);
        try {
            // BACKEND TEAM: Ensure this API returns an array of notification objects with an 'is_read' boolean.
            const response = await fetchNotifications();
            const fetchedNotifications = response.data;

            setNotifications(fetchedNotifications);

            // Unread count গণনা
            const count = fetchedNotifications.filter((n) => !n.is_read).length;
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // একটি নোটিফিকেশনকে 'Read' হিসেবে চিহ্নিত করা
    const handleMarkAsRead = async (id) => {
        try {
            // BACKEND TEAM: Update 'is_read' status to TRUE in the database for this specific notification ID.
            await markAsRead(id);
            setNotifications((prevNots) =>
                prevNots.map((n) => (n.id === id && !n.is_read ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // সব নোটিফিকেশনকে 'Read' হিসেবে চিহ্নিত করা
    const handleMarkAllAsRead = async () => {
        try {
            // BACKEND TEAM: Update 'is_read' status to TRUE for all notifications belonging to the current user.
            await markAllAsRead();
            setNotifications((prevNots) => prevNots.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        // BACKEND TEAM: If using Socket.io, initialize listener here:
        // socket.on('new_notification', (data) => { setNotifications(prev => [data, ...prev]); });
    }, [loadNotifications]);

    const contextValue = useMemo(
        () => ({
            notifications,
            unreadCount,
            loading,
            loadNotifications,
            markAsRead: handleMarkAsRead,
            markAllAsRead: handleMarkAllAsRead
        }),
        [notifications, unreadCount, loading, loadNotifications]
    );

    return (
        <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
    );
}

export default NotificationProvider;
