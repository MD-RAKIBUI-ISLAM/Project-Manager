// src/utils/constants.js

/**
 * ----------------------------------------------------
 * USER ROLES (Consistency maintained in Uppercase)
 * Defines the roles used for access control (NFR-5)
 * ----------------------------------------------------
 */
export const USER_ROLES = {
    ADMIN: 'admin',
    PROJECT_MANAGER: 'project_manager', // Matches mock data
    MEMBER: 'member',
    DEVELOPER: 'developer',
    VIEWER: 'viewer'
};

/**
 * ----------------------------------------------------
 * PROJECT STATUSES (FR-8 & Filter Options)
 * Defines the available statuses for projects and filter options.
 * ----------------------------------------------------
 */
export const PROJECT_STATUSES = ['To Do', 'In Progress', 'Completed', 'On Hold'];

/**
 * ----------------------------------------------------
 * MOCK AUTH HOOK DATA (Used in ProjectListPage's mock useAuth)
 * ----------------------------------------------------
 */
export const MOCK_CURRENT_USER = { name: 'Alice Smith', role: USER_ROLES.PROJECT_MANAGER };

/**
 Intial mock users for authentication context
*/
export const INITIAL_MOCK_USERS = [
    {
        id: 1,
        name: 'Alice Smith',
        email: 'admin@project.com',
        role: 'admin',
        token: 'mock-admin-token',
        password: 'password'
    },
    {
        id: 2,
        name: 'Bob Johnson',
        email: 'manager@project.com',
        role: 'project_manager',
        token: 'mock-manager-token',
        password: 'password'
    }
];
/**
 * ----------------------------------------------------
 * MOCK PROJECT MEMBERS (mockProjectMembers)
 * ProjectListPage এবং আপনার দেওয়া ডেটা একত্রিত করে তৈরি করা একক তালিকা।
 * ----------------------------------------------------
 */
export const mockProjectMembers = [
    { id: 1, name: 'Alice Smith', role: 'Project Manager' },
    { id: 2, name: 'Bob Johnson', role: 'Team Member' },
    { id: 3, name: 'Chris Lee', role: 'Admin' },
    { id: 4, name: 'David Kim', role: 'Team Member' },
    { id: 5, name: 'Eve Adams', role: 'Team Member' },
    { id: 6, name: 'Charlie Brown', role: 'Team Member' }
];

/**
 * ----------------------------------------------------
 * MOCK PROJECT DATA (INITIAL_PROJECTS) - (FR-1, FR-2)
 * ----------------------------------------------------
 */
export const INITIAL_PROJECTS = [
    {
        id: 1,
        title: 'TaskMaster Core Backend',
        description:
            'Design and implement the core Django backend, including API endpoints for Auth, Projects, and Tasks. Focus on security and performance (NFR-1, NFR-3).',
        startDate: '2025-12-01',
        endDate: '2026-01-15',
        status: 'In Progress',
        progress: 45, // Percentage
        manager: 'Alice Smith (PM)',
        members: ['Alice Smith', 'Bob Johnson', 'Eve Adams']
    },
    {
        id: 2,
        title: 'Frontend UI/UX Implementation',
        description:
            'Develop the React frontend using Tailwind CSS. Focus on responsive design (NFR-7) and Task Board (Kanban) implementation (FR-15).',
        startDate: '2025-11-25',
        endDate: '2026-01-30',
        status: 'In Progress',
        progress: 60,
        manager: 'Bob Johnson (PM)',
        members: ['Alice Smith', 'Bob Johnson', 'Chris Lee']
    },
    {
        id: 3,
        title: 'Database Migration & Setup',
        description:
            'Set up production PostgreSQL database and handle initial data migration and environment configuration.',
        startDate: '2025-11-10',
        endDate: '2025-12-05',
        status: 'Completed',
        progress: 100,
        manager: 'Chris Lee (Admin)',
        members: ['Chris Lee']
    }
];

/**
 * ----------------------------------------------------
 * TASK STATUSES (FR-12)
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
        assignee: 'Chris Lee', // Assignee updated to Chris Lee (ID 3)
        status: 'blocked'
    },
    {
        id: 5,
        projectId: 1,
        title: 'Write Task Management Documentation',
        description: 'Prepare documentation for Task Management module.',
        priority: 'medium',
        dueDate: '2025-12-20',
        assigneeId: 6, // Assignee updated to Charlie Brown (ID 6)
        assignee: 'Charlie Brown',
        status: 'back_log'
    }
];

// ✅ NEW: Mock Projects Data for selection - এটি ProjectListPage.jsx-এর ডেটা স্ট্রাকচার অনুসরণ করে তৈরি
export const MOCK_PROJECTS = [
    { id: 1, title: 'TaskMaster Core Backend' },
    { id: 2, title: 'Frontend UI/UX Implementation' },
    { id: 3, title: 'Database Migration & Setup' }
];

/**
 * ----------------------------------------------------
 * NAVIGATION LINKS (NFR-8)
 * ----------------------------------------------------
 */
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
    { path: '/admin/users', label: 'User Management', icon: 'Users', roles: [USER_ROLES.ADMIN] }
];
