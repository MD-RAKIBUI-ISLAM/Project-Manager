// src/pages/Dashboard/DashboardPage.jsx

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
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { ALL_MOCK_TASKS, INITIAL_PROJECTS, MOCK_DASHBOARD_DATA } from '../../utils/constants';

// --- Helper Components ---

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
        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition duration-200 cursor-pointer">
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
            <div className="text-xs text-gray-600 mb-2 flex justify-between">
                <span>{project.progress}% Complete</span>
                <span className="font-medium text-gray-500">
                    Due: {project.dueDate || project.endDate}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${progressColor}`}
                    style={{ width: `${project.progress}%` }}
                />
            </div>
        </div>
    );
}

// --- Main Dashboard Component ---

function ProjectDashboard() {
    const { user, loading: authLoading, hasRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // ফিল্টার স্টেট
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    useEffect(() => {
        let isMounted = true;
        let timer;
        if (user) {
            timer = setTimeout(() => {
                if (isMounted) setLoading(false);
            }, 800);
        }
        return () => {
            isMounted = false;
            if (timer) clearTimeout(timer);
        };
    }, [user]);

    const dynamicData = useMemo(() => {
        if (!user) return null;

        let myProjects = INITIAL_PROJECTS.filter(
            (proj) => proj.members.includes(user.id) || proj.managerId === user.id
        );
        let myTasks = ALL_MOCK_TASKS.filter((task) => task.assigneeId === user.id);

        if (searchTerm) {
            myProjects = myProjects.filter((p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            myProjects = myProjects.filter((p) => p.status === statusFilter);
            const taskMap = { Completed: 'done', 'In Progress': 'in_progress', 'To Do': 'todo' };
            myTasks = myTasks.filter((t) => t.status === taskMap[statusFilter]);
        }

        if (priorityFilter !== 'All') {
            myTasks = myTasks.filter((t) => t.priority === priorityFilter.toLowerCase());
        }

        return {
            totalAssignedTasks: myTasks.length,
            completedTasks: myTasks.filter((t) => t.status === 'done').length,
            inProgressTasks: myTasks.filter((t) => t.status === 'in_progress').length,
            activeProjects: myProjects.filter((p) => p.status === 'In Progress').length,
            assignedProjects: myProjects,
            dueDateApproaching: myTasks.filter((t) => t.status !== 'done').length
        };
    }, [user, searchTerm, statusFilter, priorityFilter]);

    if (authLoading || loading || !user || !dynamicData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="ml-3 text-lg font-medium text-indigo-600">
                    Updating Dashboard...
                </span>
            </div>
        );
    }

    const completionRate =
        dynamicData.totalAssignedTasks > 0
            ? ((dynamicData.completedTasks / dynamicData.totalAssignedTasks) * 100).toFixed(0)
            : 0;

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    Welcome, {user.name}
                </h1>
                <p className="text-gray-600 mt-1 text-base md:text-lg">
                    Role:{' '}
                    <span className="font-semibold text-indigo-600 capitalize">
                        {user.role.replace('_', ' ')}
                    </span>
                </p>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 p-4 bg-white rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`w-full sm:w-auto sm:min-w-[200px] p-3 rounded-xl font-semibold transition duration-300 flex items-center justify-center ${
                            showAdvancedFilters
                                ? 'bg-indigo-700 text-white'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
                        <ChevronDown
                            className={`w-4 h-4 ml-1 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* ✅ Assignee ড্রপডাউন সরিয়ে দিয়ে আপডেট করা ফিল্টার */}
                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 outline-none"
                        >
                            <option value="All">Status: All</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="To Do">To Do</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 outline-none"
                        >
                            <option value="All">Priority: All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>

                        <input
                            type="date"
                            className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm outline-none focus:ring-indigo-500"
                        />
                    </div>
                )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                <MetricCard
                    title="Tasks"
                    value={dynamicData.totalAssignedTasks}
                    icon={ListChecks}
                    colorClass="text-indigo-600"
                    description="Filtered tasks"
                />
                <MetricCard
                    title="Completed"
                    value={dynamicData.completedTasks}
                    icon={CheckCircle}
                    colorClass="text-green-600"
                    description="Tasks finished"
                />
                <MetricCard
                    title="In Progress"
                    value={dynamicData.inProgressTasks}
                    icon={Activity}
                    colorClass="text-sky-600"
                    description="Active now"
                />
                <MetricCard
                    title="Rate"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    colorClass="text-purple-600"
                    description="Efficiency"
                />
                {hasRole(['admin', 'project_manager']) && (
                    <MetricCard
                        title="Projects"
                        value={dynamicData.activeProjects}
                        icon={Briefcase}
                        colorClass="text-amber-600"
                        description="Managed"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500">
                        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center border-b pb-2">
                            <Clock className="w-5 h-5 mr-2" /> Deadlines
                        </h2>
                        <p className="text-red-500 font-medium">
                            You have{' '}
                            <span className="font-extrabold text-2xl">
                                {dynamicData.dueDateApproaching}
                            </span>{' '}
                            tasks pending.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <Target className="w-5 h-5 mr-2 text-indigo-500" />
                            {statusFilter === 'All' ? 'Your Projects' : `${statusFilter} Projects`}
                        </h2>
                        {/* ✅ এখানে গ্রিড সরিয়ে Single Column (space-y-4) করা হয়েছে */}
                        <div className="space-y-4">
                            {dynamicData.assignedProjects.length > 0 ? (
                                dynamicData.assignedProjects.map((project) => (
                                    <ProjectProgressCard key={project.id} project={project} />
                                ))
                            ) : (
                                <p className="text-center text-gray-400 py-4">
                                    No projects match your filters.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Comments & Activity Log */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl h-64 overflow-y-auto">
                        <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center border-b pb-2">
                            <MessageSquare className="w-5 h-5 mr-2" /> Comments
                        </h2>
                        <ul className="space-y-3">
                            {MOCK_DASHBOARD_DATA.recentComments.map((comment, index) => (
                                <li key={index} className="text-sm border-l-2 border-red-300 pl-3">
                                    <span className="font-semibold text-indigo-600">
                                        {comment.user}
                                    </span>{' '}
                                    {comment.action}
                                    <span className="block text-xs text-gray-400">
                                        {comment.time}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xl h-80 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2 text-sky-500">
                            <Activity className="w-5 h-5 mr-2" /> Activity Log
                        </h2>
                        <ul className="space-y-4">
                            {MOCK_DASHBOARD_DATA.recentActivities.map((activity, index) => (
                                <li key={index} className="flex items-start text-sm">
                                    <span className="w-2 h-2 mt-2 mr-3 rounded-full bg-sky-400 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-indigo-600">
                                            {activity.user}
                                        </span>{' '}
                                        {activity.action}
                                        <span className="block text-xs text-gray-400">
                                            {activity.time}
                                        </span>
                                    </div>
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
