// src/pages/Projects/ProjectDetailPage.jsx

import {
    Activity,
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    List,
    Loader,
    User,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// --- MOCK DATA ---
// A centralized function to get project data
const mockProjects = [
    {
        id: 1,
        title: 'TaskMaster Core Backend',
        description:
            'Design and implement the core Django backend, including API endpoints for Auth, Projects, and Tasks. Focus on security and performance (NFR-1, NFR-3). This is a critical infrastructure project that underpins all frontend functionality. Key deliverables include API documentation and unit test coverage.',
        startDate: '2025-12-01',
        endDate: '2026-01-15',
        status: 'In Progress',
        progress: 45,
        manager: { id: 1, name: 'Alice Smith' },
        members: [
            { id: 1, name: 'Alice Smith' },
            { id: 2, name: 'Bob Johnson' },
            { id: 3, name: 'Eve Adams' }
        ],
        tasks: [101, 102, 103, 104] // Associated Task IDs
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
        manager: { id: 2, name: 'Bob Johnson' },
        members: [
            { id: 1, name: 'Alice Smith' },
            { id: 2, name: 'Bob Johnson' },
            { id: 4, name: 'Chris Lee' }
        ],
        tasks: [201, 202, 203]
    }
];

const mockTasks = [
    {
        id: 101,
        title: 'Setup Database Schemas',
        status: 'done',
        priority: 'high',
        assignee: 'Alice Smith',
        dueDate: '2025-12-10'
    },
    {
        id: 102,
        title: 'API for Project Creation',
        status: 'in_progress',
        priority: 'critical',
        assignee: 'Bob Johnson',
        dueDate: '2025-12-18'
    },
    {
        id: 103,
        title: 'Write Unit Tests for Auth',
        status: 'to_do',
        priority: 'medium',
        assignee: 'Eve Adams',
        dueDate: '2025-12-25'
    },
    {
        id: 104,
        title: 'Integrate Email Notifications',
        status: 'blocked',
        priority: 'high',
        assignee: 'Alice Smith',
        dueDate: '2026-01-05'
    },
    {
        id: 201,
        title: 'Design System Documentation',
        status: 'done',
        priority: 'low',
        assignee: 'Bob Johnson',
        dueDate: '2025-12-05'
    },
    {
        id: 202,
        title: 'Develop TaskModal Component',
        status: 'in_progress',
        priority: 'medium',
        assignee: 'Chris Lee',
        dueDate: '2025-12-20'
    },
    {
        id: 203,
        title: 'Setup Routing and Layout',
        status: 'done',
        priority: 'high',
        assignee: 'Alice Smith',
        dueDate: '2025-12-01'
    }
];

const getProjectById = (id) => mockProjects.find((p) => p.id === Number(id));
const getTasksByProject = (projectTaskIds) =>
    mockTasks.filter((t) => projectTaskIds.includes(t.id));
// --- END MOCK DATA ---

// Task Status Styles (Reused from Task Management)
const statusStyles = {
    to_do: { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Activity },
    blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: Loader },
    done: { label: 'Done', color: 'bg-green-100 text-green-700', icon: CheckCircle }
};

// Priority Styles (Reused from Task Management)
const priorityClasses = {
    critical: 'font-bold text-red-600',
    high: 'font-medium text-orange-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
};

// Helper component for task list item
function ProjectTaskItem({ task }) {
    const statusInfo = statusStyles[task.status] || statusStyles.to_do;
    const StatusIcon = statusInfo.icon;

    return (
        <div className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition rounded-lg">
            <div className="flex-grow min-w-0 pr-4">
                <p className="text-sm font-medium text-gray-800 truncate" title={task.title}>
                    {task.title}
                </p>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                    <User className="w-3 h-3 mr-1" />
                    <span>{task.assignee}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span
                        className={`capitalize ${priorityClasses[task.priority] || 'text-gray-500'}`}
                    >
                        {task.priority} Priority
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
                <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
                >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                </span>
                <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
            </div>
        </div>
    );
}

function ProjectDetailPage() {
    // Get project ID from URL parameters
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data fetching (simulating API call)
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate fetching project data
        const fetchedProject = getProjectById(projectId);

        if (fetchedProject) {
            setProject(fetchedProject);
            // Simulate fetching associated tasks
            const fetchedTasks = getTasksByProject(fetchedProject.tasks);
            setTasks(fetchedTasks);
        } else {
            setError('Project not found.');
        }

        setLoading(false);
    }, [projectId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="ml-3 text-lg font-medium text-indigo-600">
                    Loading Project Details...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl m-6">
                <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
                <p className="text-red-700">{error}</p>
                <Link
                    to="/projects"
                    className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Project List
                </Link>
            </div>
        );
    }

    // Calculate Task Metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const pendingTasks = totalTasks - completedTasks;

    const progressColor =
        project.progress === 100
            ? 'bg-green-500'
            : project.progress > 50
              ? 'bg-indigo-500'
              : 'bg-yellow-500';

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link
                to="/projects"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Link>

            {/* Project Header and Summary */}
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-8 h-8 mr-3 text-indigo-600" /> {project.title}
                </h1>

                <p className="text-gray-600 mb-6 border-b pb-4">{project.description}</p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    {/* Progress */}
                    <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-indigo-600 mb-1">
                            Overall Progress
                        </p>
                        <p className="text-3xl font-bold text-indigo-800">{project.progress}%</p>
                        <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                            <div
                                className={`h-2 rounded-full ${progressColor}`}
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Total Tasks */}
                    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-gray-600 mb-1">
                            Total Tasks
                        </p>
                        <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
                    </div>

                    {/* Completed Tasks */}
                    <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-green-600 mb-1">
                            Completed
                        </p>
                        <p className="text-3xl font-bold text-green-800">{completedTasks}</p>
                    </div>

                    {/* Pending Tasks */}
                    <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-yellow-600 mb-1">
                            Pending
                        </p>
                        <p className="text-3xl font-bold text-yellow-800">{pendingTasks}</p>
                    </div>
                </div>
            </div>

            {/* Details and Task List Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Project Details */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                        <List className="w-5 h-5 mr-2 text-indigo-500" /> Project Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-700">
                            <User className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Project Manager</p>
                                <p>{project.manager.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Timeline</p>
                                <p>
                                    From {project.startDate} to {project.endDate}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-700">
                            <Activity className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Current Status</p>
                                <p
                                    className={`font-bold ${project.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}
                                >
                                    {project.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3 border-t pt-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-indigo-500" /> Team Members (
                        {project.members.length})
                    </h3>

                    {/* Members List */}
                    <div className="space-y-2">
                        {project.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg"
                            >
                                <span className="w-8 h-8 bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center font-bold mr-3">
                                    {member.name.charAt(0)}
                                </span>
                                {member.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2 & 3: Associated Tasks */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                        <List className="w-5 h-5 mr-2 text-indigo-500" /> Associated Tasks
                    </h2>

                    {tasks.length > 0 ? (
                        <div className="space-y-1">
                            {tasks.map((task) => (
                                // Link to full Task Board is suggested here (FR-15)
                                <ProjectTaskItem key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p>No tasks found for this project yet.</p>
                            {/* In a real app, a button to create a new task would be here */}
                        </div>
                    )}

                    <div className="mt-4 text-center border-t pt-4">
                        <Link
                            to="/taskboard"
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                            View All Tasks in Kanban Board →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetailPage;
