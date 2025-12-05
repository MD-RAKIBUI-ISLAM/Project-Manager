// --- MOCK DATA ---
const mockNotifications = [
    {
        id: 1,
        actor: 'Bob Johnson',
        verb: 'completed',
        relatedObject: 'Setup React Frontend',
        link: '/tasks/1',
        timestamp: '2025-12-05T10:00:00Z',
        is_read: false
    },
    {
        id: 2,
        actor: 'Alice Smith',
        verb: 'assigned you to',
        relatedObject: 'Implement Auth Pages',
        link: '/tasks/2',
        timestamp: '2025-12-05T09:30:00Z',
        is_read: false
    },
    {
        id: 3,
        actor: 'Eve Adams',
        verb: 'updated',
        relatedObject: 'Design Task API Model',
        link: '/tasks/3',
        timestamp: '2025-12-04T18:00:00Z',
        is_read: true
    }
];
// --- END MOCK DATA ---

// ✅ ESLint error ঠিক করার জন্য ব্লক বডি ব্যবহার করা হলো, যাতে কোনো কিছু ইমপ্লিসিটলি রিটার্ন না হয়।
const delay = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

// Mock function to fetch notifications (FR-16, FR-17)
export const fetchNotifications = async () => {
    // API Call: return axiosClient.get('/notifications');

    // 1-second delay for simulation
    await delay(500);
    return { data: mockNotifications };
};

// Mock function to mark a notification as read (FR-18)
export const markAsRead = async (notificationId) => {
    // API Call: return axiosClient.post(`/notifications/${notificationId}/read`);
    console.log(`Mock API: Marking notification ${notificationId} as read.`);
    await delay(300);
    return { success: true, id: notificationId };
};

// Mock function to mark all notifications as read
export const markAllAsRead = async () => {
    // API Call: return axiosClient.post('/notifications/mark_all_read');
    console.log('Mock API: Marking all notifications as read.');
    await delay(300);
    return { success: true };
};
