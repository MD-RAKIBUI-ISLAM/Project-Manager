// src/context/RoleContext.jsx

import { createContext, useContext, useMemo } from 'react';

import { USER_ROLES } from '../utils/constants'; // Role constants
import { useAuth } from './AuthContext'; // AuthContext থেকে user ডেটা আনার জন্য

const RoleContext = createContext();

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. RBAC (Role-Based Access Control): Ensure that the user's role is strictly managed in the database.
 * 2. MIDDLEWARE: While these frontend checks hide/show UI elements, you MUST implement
 * server-side middleware (e.g., checkRole(['admin'])) to protect API routes.
 * 3. HIERARCHY: If a Project Manager has all permissions of a Member, ensure the
 * backend logic supports this inheritance.
 */

export function RoleProvider({ children }) {
    // AuthContext থেকে বর্তমান ইউজারের তথ্য নেওয়া হচ্ছে
    const { user, isAuthenticated } = useAuth();

    // useMemo ব্যবহার করে Role Check functions গুলো তৈরি করা
    const roleContextValue = useMemo(() => {
        // BACKEND TEAM: 'user.role' must match the strings defined in USER_ROLES (e.g., 'admin', 'member').
        const userRole = user?.role || null;

        // NFR-5 (Access Control) এর জন্য Helper functions:

        // FR-4: শুধুমাত্র Admin কিনা চেক করা।
        const isAdmin = isAuthenticated && userRole === USER_ROLES.ADMIN;

        // Project Manager অথবা Admin কিনা চেক করা।
        // BACKEND TEAM: Ensure logic consistency if an Admin should automatically have Project Manager rights.
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
            // FUTURE: Add permission-based checks (e.g., 'can_edit_project') if the backend moves
            // from simple roles to complex permission arrays.
        };
    }, [user, isAuthenticated]);

    return <RoleContext.Provider value={roleContextValue}>{children}</RoleContext.Provider>;
}

// Custom Hook to use the Role context
export const useRole = () => useContext(RoleContext);
