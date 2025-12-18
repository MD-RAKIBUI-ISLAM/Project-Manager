import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
    const [activities, setActivities] = useState([
        // ডেমো ডেটা (টেস্ট করার জন্য)
        {
            id: 1,
            user: 'System',
            action: 'Project initialized',
            timestamp: new Date().toISOString()
        }
    ]);

    // যেকোনো জায়গা থেকে লগ যোগ করার ফাংশন
    const logActivity = useCallback((user, action, targetName = '') => {
        const newLog = {
            id: Date.now(),
            user,
            action,
            target: targetName, // যেমন: টাস্কের নাম বা আইডি
            timestamp: new Date().toISOString()
        };

        setActivities((prev) => [newLog, ...prev]);
    }, []);

    const value = useMemo(
        () => ({
            activities,
            logActivity
        }),
        [activities, logActivity]
    );

    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export const useActivity = () => useContext(ActivityContext);
