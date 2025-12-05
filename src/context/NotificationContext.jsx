import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'; // ✅ useMemo আমদানি করা হলো

import { fetchNotifications, markAllAsRead, markAsRead } from '../api/notificationAPI';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // নোটিফিকেশন ফেচ করার ফাংশন
    const loadNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchNotifications();
            const fetchedNotifications = response.data;

            setNotifications(fetchedNotifications);
            // Unread count গণনা (FR-19)
            const count = fetchedNotifications.filter((n) => !n.is_read).length;
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            // Optionally set error state here
        } finally {
            setLoading(false);
        }
    }, []);

    // একটি নোটিফিকেশনকে 'Read' হিসেবে চিহ্নিত করা (FR-18)
    const handleMarkAsRead = async (id) => {
        try {
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
            await markAllAsRead();
            setNotifications((prevNots) => prevNots.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    useEffect(() => {
        // Mock data loading on mount
        loadNotifications();
    }, [loadNotifications]);

    // ✅ FIX: useMemo ব্যবহার করে contextValue তৈরি করা হলো
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
    ); // ডিপেন্ডেন্সিগুলি যুক্ত করা হলো

    return (
        <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
    );
}

export default NotificationProvider;
