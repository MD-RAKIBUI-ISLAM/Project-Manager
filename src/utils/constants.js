// src/utils/constants.js (UPDATED for Task Management & Consistency)

/**
 * ----------------------------------------------------
 * USER ROLES (FR-3)
 * Defines the roles used for access control (NFR-5)
 * ----------------------------------------------------
 */
export const USER_ROLES = {
    ADMIN: 'admin',
    PROJECT_MANAGER: 'Project Manager',
    DEVELOPER: 'Developer',
    VIEWER: 'Viewer'
};

/**
 * ----------------------------------------------------
 * TASK STATUSES (FR-12)
 * Defines the task workflow statuses
 * ----------------------------------------------------
 */
// ✅ Note: এই ARRAY টি TaskStatusDropdown এবং Kanban Board তৈরির জন্য ব্যবহার হবে
export const TASK_STATUSES = [
    { value: 'back_log', label: 'BackLog', color: 'bg-gray-400', tailwindColor: 'text-gray-700' },
    {
        value: 'in_progress',
        label: 'In Progress',
        color: 'bg-blue-500',
        tailwindColor: 'text-blue-700'
    },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-500', tailwindColor: 'text-red-700' },
    { value: 'done', label: 'Done', color: 'bg-green-500', tailwindColor: 'text-green-700' }
];

/**
 * ----------------------------------------------------
 * TASK PRIORITIES (FR-15 Filtering/Sorting & FR-10)
 * Defines task priority levels. Added 'Critical'.
 * ----------------------------------------------------
 */
// ✅ Added Critical priority for comprehensive task management
export const TASK_PRIORITIES = [
    { value: 'critical', label: 'Critical', color: 'text-red-700', badgeColor: 'bg-red-200' },
    { value: 'high', label: 'High', color: 'text-red-500', badgeColor: 'bg-red-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500', badgeColor: 'bg-yellow-100' },
    { value: 'low', label: 'Low', color: 'text-green-500', badgeColor: 'bg-green-100' }
];

/**
 * ----------------------------------------------------
 * NAVIGATION LINKS (NFR-8)
 * Defines main links based on user role
 * ----------------------------------------------------
 */
// ✅ FIX: USER_ROLES.MEMBER কে USER_ROLES.DEVELOPER দিয়ে প্রতিস্থাপন করা হলো
export const NAV_LINKS = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        roles: [USER_ROLES.ADMIN, USER_ROLES.PROJECT_MANAGER, USER_ROLES.DEVELOPER]
    },
    {
        path: '/projects',
        label: 'Projects',
        icon: 'FolderKanban',
        roles: [USER_ROLES.PROJECT_MANAGER, USER_ROLES.DEVELOPER]
    },
    {
        path: '/notifications',
        label: 'Notifications',
        icon: 'Bell',
        roles: [USER_ROLES.ADMIN, USER_ROLES.PROJECT_MANAGER, USER_ROLES.DEVELOPER]
    },
    { path: '/admin/users', label: 'User Management', icon: 'Users', roles: [USER_ROLES.ADMIN] } // FR-4
];
