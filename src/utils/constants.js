// src/utils/constants.js (UPDATED for Task Management & Consistency)

/**
 * ----------------------------------------------------
 * USER ROLES (FR-3)
 * Defines the roles used for access control (NFR-5)
 * Roles match the string values used in AuthContext mock data
 * ----------------------------------------------------
 */
export const USER_ROLES = {
    ADMIN: 'admin', // Matches mock data
    PROJECT_MANAGER: 'project_manager', // UPDATED: Changed from 'Project Manager' to 'project_manager'
    MEMBER: 'member', // NEW role added, matches AuthContext
    DEVELOPER: 'member', // Mapped to 'member' as per user's logic
    VIEWER: 'viewer' // Keeping viewer role
};

/**
 * ----------------------------------------------------
 * TASK STATUSES (FR-12)
 * Defines the task workflow statuses
 * ----------------------------------------------------
 */
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
 * Defines task priority levels.
 * ----------------------------------------------------
 */
export const TASK_PRIORITIES = [
    { value: 'critical', label: 'Critical', color: 'text-red-700', badgeColor: 'bg-red-200' },
    { value: 'high', label: 'High', color: 'text-red-500', badgeColor: 'bg-red-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500', badgeColor: 'bg-yellow-100' },
    { value: 'low', label: 'Low', color: 'text-green-500', badgeColor: 'bg-green-100' }
];

/**
 * ----------------------------------------------------
 * PRIORITY SORT ORDER MAP (For quick use in useMemo)
 * ----------------------------------------------------
 */
export const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

/**
 * ----------------------------------------------------
 * MOCK PROJECT MEMBERS
 * ----------------------------------------------------
 */
// NOTE: ID 1, 2, 3 এখানে রাখা হলো। Assignee Role এখন AuthContext-এর Role-এর সাথে সামঞ্জস্যপূর্ণ।
export const mockProjectMembers = [
    { id: 1, name: 'Alice Smith' }, // Role: admin (from AuthContext mock)
    { id: 2, name: 'Bob Johnson' }, // Role: project_manager (from AuthContext mock)
    { id: 3, name: 'Charlie Brown' } // Role: member (from AuthContext mock)
];

/**
 * ----------------------------------------------------
 * MOCK TASK DATA (initialTasks)
 * ----------------------------------------------------
 */
export const initialTasks = [
    {
        id: 1,
        projectId: 1,
        title: 'Setup React Frontend',
        description: 'Initialize project structure with Tailwind CSS and routing.',
        priority: 'high',
        dueDate: '2025-12-05',
        assigneeId: 1,
        assignee: 'Alice Smith',
        status: 'done'
    },
    {
        id: 2,
        projectId: 1,
        title: 'Implement Auth Pages',
        description: 'Create Login and Register pages (FR-1). Ensure validation.',
        priority: 'critical',
        dueDate: '2025-12-10',
        assigneeId: 2,
        assignee: 'Bob Johnson',
        status: 'in_progress'
    },
    {
        id: 3,
        projectId: 2,
        title: 'Design Task API Model',
        description: 'Define Task and Project models in Django (FR-10).',
        priority: 'medium',
        dueDate: '2025-12-15',
        assigneeId: 1,
        assignee: 'Alice Smith',
        status: 'back_log'
    },
    {
        id: 4,
        projectId: 2,
        title: 'Fix CSS bug on Sidebar',
        description: 'Sidebar is overlapping content on mobile views. Needs investigation.',
        priority: 'low',
        dueDate: '2025-12-12',
        assigneeId: 3,
        assignee: 'Charlie Brown',
        status: 'blocked'
    },
    {
        id: 5,
        projectId: 1,
        title: 'Write Task Management Documentation',
        description: 'Prepare documentation for Task Management module.',
        priority: 'medium',
        dueDate: '2025-12-20',
        assigneeId: 3,
        assignee: 'Charlie Brown',
        status: 'back_log'
    }
];

/**
 * ----------------------------------------------------
 * NAVIGATION LINKS (NFR-8)
 * Defines main links based on user role
 * ----------------------------------------------------
 */
export const NAV_LINKS = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        // Role string updated to use the new constant values
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
    { path: '/admin/users', label: 'User Management', icon: 'Users', roles: [USER_ROLES.ADMIN] }
];
