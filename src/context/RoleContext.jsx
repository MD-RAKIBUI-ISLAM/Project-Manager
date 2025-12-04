// src/context/RoleContext.jsx

import { createContext, useContext, useMemo } from 'react';

import { USER_ROLES } from '../utils/constants'; // Role constants
import { useAuth } from './AuthContext'; // AuthContext থেকে user ডেটা আনার জন্য

const RoleContext = createContext();

export function RoleProvider({ children }) {
    // AuthContext থেকে বর্তমান ইউজারের তথ্য নেওয়া হচ্ছে
    const { user, isAuthenticated } = useAuth();

    // useMemo ব্যবহার করে Role Check functions গুলো তৈরি করা
    // Performance অপটিমাইজেশন নিশ্চিত করার জন্য useMemo ব্যবহার করা হলো।
    const roleContextValue = useMemo(() => {
        // ধরে নিলাম user অবজেক্টে একটি 'role' property আছে, যেমন: 'Admin', 'Project Manager', ইত্যাদি।
        const userRole = user?.role || null;

        // NFR-5 (Access Control) এর জন্য Helper functions:

        // FR-4: শুধুমাত্র Admin কিনা চেক করা।
        const isAdmin = isAuthenticated && userRole === USER_ROLES.ADMIN;

        // Project Manager অথবা Admin কিনা চেক করা।
        const isProjectManager =
            isAuthenticated &&
            (userRole === USER_ROLES.PROJECT_MANAGER || userRole === USER_ROLES.ADMIN);

        // শুধুমাত্র Team Member কিনা চেক করা।
        const isMember = isAuthenticated && userRole === USER_ROLES.MEMBER;

        // isPermitted: একটি Array of allowed roles-এর মধ্যে ইউজারের রোল আছে কিনা চেক করা।
        const isPermitted = (allowedRoles) => {
            if (!isAuthenticated || !userRole || !allowedRoles || allowedRoles.length === 0) {
                return false;
            }
            return allowedRoles.includes(userRole);
        };

        return {
            userRole,
            isAdmin,
            isProjectManager,
            isMember,
            isPermitted
            // ভবিষ্যতের জন্য এখানে permissions array যুক্ত করা যেতে পারে।
        };
    }, [user, isAuthenticated]); // user বা isAuthenticated পরিবর্তন হলেই এই context value আপডেট হবে।

    return <RoleContext.Provider value={roleContextValue}>{children}</RoleContext.Provider>;
}

// Custom Hook to use the Role context
export const useRole = () => useContext(RoleContext);
