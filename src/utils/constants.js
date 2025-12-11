// src/utils/constants.js

/**
 * ====================================================
 * PROJECT MANAGEMENT CONSTANTS
 * Defines core roles, statuses, and mock data structures.
 * ====================================================
 */

/**
 * Images used in the application (e.g., logos, avatars).
 */

import Alice from '../assets/Alice.jpeg';
import Bob from '../assets/Bob.avif';
import Charlie from '../assets/Charlie.avif';
import Chris from '../assets/Chris.webp';
import David from '../assets/David.webp';
import Eve from '../assets/Eve.avif';

// --- MOCK DATA (Simulating fetched data) ---

export const MOCK_DASHBOARD_DATA = {
    totalAssignedTasks: 12,
    completedTasks: 5,
    inProgressTasks: 4,
    blockedTasks: 1,
    dueDateApproaching: 2,
    totalProjects: 5,
    activeProjects: 3,
    recentActivities: [
        { id: 1, user: 'Bob J.', action: 'marked Task #203 as done', time: '5m ago' },
        { id: 2, user: 'You', action: 'added 3 new tasks to TaskMaster Core', time: '1h ago' },
        { id: 3, user: 'Eve A.', action: 'commented on Task #104', time: '3h ago' }
    ],
    recentComments: [
        { id: 1, user: 'Bob J.', action: 'Commented on Task #301', time: '10m ago' },
        { id: 2, user: 'You', action: 'Mentioned @Alice in Task #201', time: '4h ago' }
    ],
    assignedProjects: [
        {
            id: 1,
            title: 'TaskMaster Core Backend',
            status: 'In Progress',
            progress: 45,
            dueDate: '2026-01-15'
        },
        {
            id: 2,
            title: 'Frontend UI/UX Implementation',
            status: 'In Progress',
            progress: 60,
            dueDate: '2026-01-30'
        },
        {
            id: 3,
            title: 'Database Migration Planning',
            status: 'To Do',
            progress: 10,
            dueDate: '2026-02-28'
        }
    ]
};

/**
 * ----------------------------------------------------
 * USER ROLES (USER_ROLES)
 * Defines the roles used for access control.
 * ----------------------------------------------------
 */
export const USER_ROLES = {
    ADMIN: 'admin',
    PROJECT_MANAGER: 'project_manager',
    MEMBER: 'member',
    DEVELOPER: 'developer',
    VIEWER: 'viewer'
};

/**
 * ----------------------------------------------------
 * PROJECT STATUSES (PROJECT_STATUSES)
 * Defines the available statuses for projects.
 * ----------------------------------------------------
 */
export const PROJECT_STATUSES = ['To Do', 'In Progress', 'Completed', 'On Hold'];

/**
 * ----------------------------------------------------
 * MOCK AUTH DATA
 * Mock user data used for authentication context and initial state.
 * ----------------------------------------------------
 */
export const MOCK_CURRENT_USER = { name: 'Alice Smith', role: USER_ROLES.PROJECT_MANAGER };

// Initial mock users for simulating login/auth context
export const INITIAL_MOCK_USERS = [
    {
        id: 1,
        name: 'Alice Smith',
        email: 'admin@project.com',
        role: USER_ROLES.ADMIN,
        token: 'mock-admin-token',
        password: 'password'
    },
    {
        id: 2,
        name: 'Bob Johnson',
        email: 'manager@project.com',
        role: USER_ROLES.PROJECT_MANAGER,
        token: 'mock-manager-token',
        password: 'password'
    },
    {
        id: 3,
        name: 'Chris Lee',
        email: 'chris@project.com',
        role: USER_ROLES.PROJECT_MANAGER,
        token: 'mock-chris-token',
        password: 'password'
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david@project.com',
        role: USER_ROLES.MEMBER,
        token: 'mock-david-token',
        password: 'password'
    },
    {
        id: 5,
        name: 'Eve Adams',
        email: 'eve@project.com',
        role: USER_ROLES.MEMBER,
        token: 'mock-eve-token',
        password: 'password'
    },
    {
        id: 6,
        name: 'Charlie Brown',
        email: 'charlie@project.com',
        role: USER_ROLES.MEMBER,
        token: 'mock-charlie-token',
        password: 'password'
    }
];

/**
 * ----------------------------------------------------
 * MOCK PROJECT MEMBERS (mockProjectMembers)
 * Used to map member IDs to full member objects (name, role) in ProjectDetailPage.
 * ----------------------------------------------------
 */
export const mockProjectMembers = [
    { id: 1, name: 'Alice Smith', role: 'Admin', image: Alice, description: '' },
    { id: 2, name: 'Bob Johnson', role: 'Project Manager', image: Bob, description: '' },
    { id: 3, name: 'Chris Lee', role: 'Project Manager', image: Chris, description: '' },
    { id: 4, name: 'David Kim', role: 'Team Member', image: David, description: '' },
    { id: 5, name: 'Eve Adams', role: 'Team Member', image: Eve, description: '' },
    { id: 6, name: 'Charlie Brown', role: 'Team Member', image: Charlie, description: '' }
];

/**
 * ----------------------------------------------------
 * MOCK PROJECT DATA (INITIAL_PROJECTS)
 * Contains project details, including manager IDs, member IDs, and task IDs.
 * ----------------------------------------------------
 */
export const INITIAL_PROJECTS = [
    {
        id: 1,
        title: 'TaskMaster Core Backend',
        description:
            'Design and implement the core Django backend, including API endpoints for Auth, Projects, and Tasks. Focus on security and performance (NFR-1, NFR-3). This is a critical infrastructure project that underpins all frontend functionality. Key deliverables include API documentation and unit test coverage.',
        startDate: '2025-12-01',
        endDate: '2026-01-15',
        status: 'In Progress',
        progress: 45, // Percentage
        manager: 'Alice Smith (PM)', // Legacy string field
        managerId: 1, // ID used for mapping
        members: [1, 2, 5], // IDs used for mapping
        tasks: [1, 2, 5, 101, 102, 103, 104] // Associated Task IDs
    },
    {
        id: 2,
        title: 'Frontend UI/UX Implementation',
        description:
            'Develop the React frontend using Tailwind CSS. Focus on responsive design (NFR-7) and Task Board (Kanban) implementation (FR-15). The user experience must be intuitive and fast.',
        startDate: '2025-11-25',
        endDate: '2026-01-30',
        status: 'In Progress',
        progress: 60,
        manager: 'Bob Johnson (PM)',
        managerId: 2,
        members: [1, 2, 3],
        tasks: [3, 4, 201, 202, 203]
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
        managerId: 3,
        members: [3, 4, 6],
        tasks: []
    }
];

/**
 * ----------------------------------------------------
 * TASK STATUSES (TASK_STATUSES)
 * Defines statuses used for Task Management and Kanban columns (FR-12).
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
 * TASK PRIORITIES (TASK_PRIORITIES)
 * Defines priority levels for tasks (FR-10, FR-15).
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
 * PRIORITY SORT ORDER MAP (PRIORITY_ORDER)
 * Used for consistent sorting of tasks by priority.
 * ----------------------------------------------------
 */
export const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

/**
 * ----------------------------------------------------
 * ALL MOCK TASK DATA (ALL_MOCK_TASKS)
 * Consolidated list of all tasks used across the application.
 * ----------------------------------------------------
 */
export const ALL_MOCK_TASKS = [
    // Task ID 1-5
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
        assignee: 'Chris Lee',
        status: 'blocked'
    },
    {
        id: 5,
        projectId: 1,
        title: 'Write Task Management Documentation',
        description: 'Prepare documentation for Task Management module.',
        priority: 'medium',
        dueDate: '2025-12-20',
        assigneeId: 6,
        assignee: 'Charlie Brown',
        status: 'back_log'
    },
    // Task ID 101-203
    {
        id: 101,
        projectId: 1,
        title: 'Setup Database Schemas',
        status: 'done',
        priority: 'high',
        assignee: 'Alice Smith',
        assigneeId: 1,
        dueDate: '2025-12-10',
        description: 'Completed basic schemas for user and project models.'
    },
    {
        id: 102,
        projectId: 1,
        title: 'API for Project Creation',
        status: 'in_progress',
        priority: 'critical',
        assignee: 'Bob Johnson',
        assigneeId: 2,
        dueDate: '2025-12-18',
        description: 'Working on request validation and database interaction.'
    },
    {
        id: 103,
        projectId: 1,
        title: 'Write Unit Tests for Auth',
        status: 'to_do',
        priority: 'medium',
        assignee: 'Eve Adams',
        assigneeId: 5,
        dueDate: '2025-12-25',
        description: ''
    },
    {
        id: 104,
        projectId: 1,
        title: 'Integrate Email Notifications',
        status: 'blocked',
        priority: 'high',
        assignee: 'Alice Smith',
        assigneeId: 1,
        dueDate: '2026-01-05',
        description: 'Blocked waiting for SMTP server credentials.'
    },
    {
        id: 201,
        projectId: 2,
        title: 'Design System Documentation',
        status: 'done',
        priority: 'low',
        assignee: 'Bob Johnson',
        assigneeId: 2,
        dueDate: '2025-12-05',
        description: 'Documented core component styles and usage.'
    },
    {
        id: 202,
        projectId: 2,
        title: 'Develop TaskModal Component',
        status: 'in_progress',
        priority: 'medium',
        assignee: 'David Kim',
        assigneeId: 4,
        dueDate: '2025-12-20',
        description: 'Implementation in progress, focusing on form validation (FR-10).'
    },
    {
        id: 203,
        projectId: 2,
        title: 'Setup Routing and Layout',
        status: 'done',
        priority: 'high',
        assignee: 'Alice Smith',
        assigneeId: 1,
        dueDate: '2025-12-01',
        description: 'Finished basic React Router setup and main app layout.'
    }
];

/**
 * ----------------------------------------------------
 * NAVIGATION LINKS (NAV_LINKS)
 * Defines application navigation and access control based on roles.
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
