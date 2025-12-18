import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CommentContext = createContext();

const initialComments = {
    1: [
        {
            id: 1,
            user: 'Bob Johnson',
            text: 'Frontend structure with Tailwind is initialized.',
            time: '2025-12-08T10:00:00Z'
        }
    ],
    2: [
        {
            id: 2,
            user: 'Alice Smith',
            text: 'Please ensure input validation is handled correctly.',
            time: '2025-12-08T11:30:00Z'
        }
    ]
};

export function CommentProvider({ children }) {
    const [taskComments, setTaskComments] = useState(initialComments);

    // useCallback ব্যবহার করা হয়েছে যাতে ফাংশনটির রেফারেন্স পরিবর্তন না হয়
    const addComment = useCallback((taskId, newComment) => {
        setTaskComments((prev) => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), newComment]
        }));
    }, []);

    // useMemo ব্যবহার করে value অবজেক্টটিকে মেমোইজ করা হয়েছে
    // এটি কেবল তখনই আপডেট হবে যখন taskComments অথবা addComment পরিবর্তিত হবে
    const contextValue = useMemo(
        () => ({
            taskComments,
            addComment
        }),
        [taskComments, addComment]
    );

    return <CommentContext.Provider value={contextValue}>{children}</CommentContext.Provider>;
}

export const useComments = () => useContext(CommentContext);
