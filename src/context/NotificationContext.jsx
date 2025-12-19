import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchNotifications, markAllAsRead, markAsRead } from '../api/notificationAPI';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // ১. ডাটা লোড করা (Read Action)
    const loadNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchNotifications();
            const fetchedData = response.data || [];
            setNotifications(fetchedData);
            setUnreadCount(fetchedData.filter((n) => !n.is_read).length);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ২. লোকাল নোটিফিকেশন তৈরি (Trigger Action - For Mock/Local)
    /**
     * @BACKEND_TEAM_NOTE:
     * বর্তমানে এটি ফ্রন্টএন্ডে স্টেট আপডেট করছে।
     * রিয়েল ব্যাকএন্ড আসার পর, যখনই কোনো ইউজার কমেন্ট বা প্রজেক্ট ডিলিট করবে,
     * সার্ভার Socket.io বা SSE এর মাধ্যমে ব্রাউজারে ডাটা পাঠাবে।
     * তখন এই ফাংশনটি সার্ভারের পাঠানো ডাটা রিসিভ করে স্টেটে পুশ করবে।
     */
    const addNotification = useCallback((actor, verb, relatedObject, link = '#') => {
        const newNotification = {
            id: Date.now(), // ব্যাকএন্ডে এটি ডাটাবেজ আইডি হবে
            actor,
            verb,
            relatedObject,
            link,
            timestamp: new Date().toISOString(),
            is_read: false
        };

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
    }, []);

    // ৩. নোটিফিকেশন পড়া হিসেবে মার্ক করা
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id); // API Call
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Notification update failed:', error);
        }
    };

    // ৪. সব নোটিফিকেশন পড়া হিসেবে মার্ক করা
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead(); // API Call
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Bulk update failed:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const value = useMemo(
        () => ({
            notifications,
            unreadCount,
            loading,
            addNotification, // এটি ব্যবহার করে অন্য ফাইল থেকে নোটিফিকেশন পাঠানো হবে
            markAsRead: handleMarkAsRead,
            markAllAsRead: handleMarkAllAsRead
        }),
        [notifications, unreadCount, loading, addNotification]
    );

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
