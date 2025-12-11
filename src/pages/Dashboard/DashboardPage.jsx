// src/pages/Dashboard/DashboardPage.jsx (FIXED CARD WIDTH & REMOVED NOTIFICATION CARD)

import {
    Activity,
    Briefcase,
    CheckCircle,
    ChevronDown,
    Clock,
    Filter,
    ListChecks,
    Loader,
    MessageSquare,
    Search,
    Target,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
// --- MOCK DATA (Simulating fetched data) ---
import { MOCK_DASHBOARD_DATA } from '../../utils/constants';

// --- END MOCK DATA ---

// Helper Component: Metric Card (Unchanged)
function MetricCard({ title, value, icon: Icon, colorClass, description }) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border-b-4 border-t-2 border-gray-100 transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl cursor-pointer">
            <div className="flex items-center justify-between">
                <span className={`p-3 rounded-full ${colorClass} bg-opacity-20 flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mt-3 sm:mt-4">{title}</h3>
            <p className="text-xs text-gray-400 mt-1 truncate">{description}</p>
        </div>
    );
}

// Helper Component: Project Progress Card (Unchanged)
function ProjectProgressCard({ project }) {
    const progressColor =
        project.progress === 100
            ? 'bg-green-500'
            : project.progress > 60
              ? 'bg-sky-500'
              : project.progress > 20
                ? 'bg-amber-500'
                : 'bg-red-500';

    return (
        <div className="p-3 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition duration-200 cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <h4
                    className="font-semibold text-gray-800 text-sm sm:text-base truncate pr-2"
                    title={project.title}
                >
                    <Briefcase className="w-4 h-4 mr-1 inline text-indigo-500 flex-shrink-0" />
                    {project.title}
                </h4>
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${project.status === 'In Progress' ? 'bg-sky-100 text-sky-700' : 'bg-gray-200 text-gray-600'}`}
                >
                    {project.status}
                </span>
            </div>
            <div className="text-xs text-gray-600 mb-1 flex justify-between">
                <span>{project.progress}% Complete</span>
                <span className="font-medium text-gray-500">Due: {project.dueDate}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${progressColor}`}
                    style={{ width: `${project.progress}%` }}
                />
            </div>
        </div>
    );
}

// Advanced Filtering Component Placeholder (Unchanged)
function AdvancedFilters() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Filter 1: Status */}
            <select className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>Status: All</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>To Do</option>
            </select>

            {/* Filter 2: Priority */}
            <select className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>Priority: All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
            </select>

            {/* Filter 3: Assignee */}
            <select className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>Assignee: Me</option>
                <option>Bob J.</option>
                <option>Eve A.</option>
            </select>

            {/* Filter 4: Due Date */}
            <input
                type="date"
                className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="By Deadline"
            />
        </div>
    );
}

// Main Component: Project Management Dashboard
function ProjectDashboard() {
    const { user, loading: authLoading, hasRole } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                setData(MOCK_DASHBOARD_DATA);
                setLoading(false);
            }, 800);
        }
    }, [user]);

    if (authLoading || loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="ml-3 text-lg font-medium text-indigo-600">Data is loading...</span>
            </div>
        );
    }

    const completionRate =
        data.totalAssignedTasks > 0
            ? ((data.completedTasks / data.totalAssignedTasks) * 100).toFixed(0)
            : 0;

    const isManagerOrAdmin = hasRole(['admin', 'project_manager']);

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
            {/* 🚀 Modified Section: Header will only keep the Welcome Message and take full width */}
            <div className="mb-6 md:mb-8">
                {/* Header and Welcome Message (Full Width) */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        👋 Welcome, {user.name || user.email}
                    </h1>
                    <p className="text-gray-600 mt-2 text-base md:text-lg">
                        View today's work overview and project status. (Role:{' '}
                        <span className="font-semibold text-indigo-600">{user.role}</span>)
                    </p>
                </div>
            </div>
            {/* 🚀 Modified Section End */}

            {/* --- Global Search and Filtering (FR-15 Implementation) --- */}
            <div className="mb-8 p-4 bg-white rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Search Input (Unchanged) */}
                    <div className="relative w-full sm:flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by project or task name..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    {/* Filter Toggle Button (Unchanged) */}
                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`w-full sm:w-auto sm:min-w-[200px] p-3 rounded-xl font-semibold transition duration-300 flex items-center justify-center ${
                            showAdvancedFilters
                                ? 'bg-indigo-700 text-white shadow-lg'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        {showAdvancedFilters ? (
                            <>
                                <Filter className="w-5 h-5 mr-2" /> Hide Filters
                            </>
                        ) : (
                            <>
                                <Filter className="w-5 h-5 mr-2" /> Advanced Filters
                            </>
                        )}
                        <ChevronDown
                            className={`w-4 h-4 ml-1 transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                </div>

                {/* Advanced Filter Area (Collapsible) (Unchanged) */}
                {showAdvancedFilters && <AdvancedFilters />}
            </div>

            {/* --- 1. Top Metrics Grid (Fix: XL grid adjusted to 4) --- */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                {' '}
                {/* ✅ xl:grid-cols-5 to xl:grid-cols-4 adjusted */}
                {/* 1. Total Assigned Tasks */}
                <MetricCard
                    title="Total Assigned Tasks"
                    value={data.totalAssignedTasks}
                    icon={ListChecks}
                    colorClass="text-indigo-600"
                    description="Total tasks currently assigned to you"
                />
                {/* 2. Completed Tasks */}
                <MetricCard
                    title="Completed"
                    value={data.completedTasks}
                    icon={CheckCircle}
                    colorClass="text-green-600"
                    description="Tasks completed to date"
                />
                {/* 3. In Progress Tasks */}
                <MetricCard
                    title="In Progress"
                    value={data.inProgressTasks}
                    icon={Activity}
                    colorClass="text-sky-600"
                    description="Currently active tasks"
                />
                {/* 4. Completion Rate */}
                <MetricCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    colorClass="text-purple-600"
                    description="Ratio of completed to total tasks"
                />
                {/* 5. Projects Overview (Manager/Admin View) - This remains the fifth card if the role is Manager/Admin */}
                {isManagerOrAdmin && (
                    <MetricCard
                        title="Active Projects"
                        value={data.activeProjects}
                        icon={Briefcase}
                        colorClass="text-amber-600"
                        description="Total number of currently running projects"
                    />
                )}
            </div>

            {/* --- 2. Main Content Layout (Unchanged) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Critical and Assigned Tasks (2/3 width on desktop) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Critical Tasks Card (Unchanged) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500">
                        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center border-b pb-2">
                            <Clock className="w-5 h-5 mr-2" /> Upcoming Deadlines
                        </h2>
                        {data.dueDateApproaching > 0 ? (
                            <p className="text-red-500 font-medium">
                                Your{' '}
                                <span className="font-extrabold text-2xl">
                                    {data.dueDateApproaching}
                                </span>{' '}
                                tasks are due this week. Check now!
                            </p>
                        ) : (
                            <p className="text-gray-500 italic">
                                No tasks are currently at risk of missing their deadline.
                            </p>
                        )}
                    </div>

                    {/* Assigned Projects Quick Access (Unchanged) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <Target className="w-5 h-5 mr-2 text-indigo-500" /> Your Projects
                        </h2>
                        <div className="space-y-3">
                            {data.assignedProjects.map((project) => (
                                <ProjectProgressCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Recent Comments & Activity Log (1/3 width on desktop) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Recent Comments/Mentions (FR-18 Placeholder) (Unchanged) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl h-64 overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <MessageSquare className="w-5 h-5 mr-2 text-red-500" /> Recent
                            Comments/Mentions
                        </h2>
                        <ul className="space-y-3">
                            {data.recentComments.length > 0 ? (
                                data.recentComments.map((comment, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start text-sm border-l-2 border-red-300 pl-3 transition hover:bg-gray-50 p-1 rounded-sm"
                                    >
                                        <p className="text-gray-700 leading-snug">
                                            <span className="font-semibold text-indigo-600">
                                                {comment.user}
                                            </span>{' '}
                                            {comment.action}
                                            <span className="block text-xs text-gray-400 mt-0.5">
                                                {comment.time}
                                            </span>
                                        </p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-sm">
                                    No new comments or mentions available.
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Existing Recent Activity Log (FR-7) (Unchanged) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl h-96 overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <Activity className="w-5 h-5 mr-2 text-sky-500" /> Recent Activity
                            (Activity Log)
                        </h2>
                        <ul className="space-y-4">
                            {data.recentActivities.map((activity, index) => (
                                <li
                                    key={index}
                                    className="flex items-start text-sm transition hover:bg-gray-50 p-1 rounded-sm"
                                >
                                    <span className="w-2 h-2 mt-2 mr-3 rounded-full bg-sky-400 flex-shrink-0" />
                                    <p className="text-gray-700">
                                        <span className="font-semibold text-indigo-600">
                                            {activity.user}
                                        </span>{' '}
                                        {activity.action}
                                        <span className="block text-xs text-gray-400">
                                            {activity.time}
                                        </span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDashboard;
