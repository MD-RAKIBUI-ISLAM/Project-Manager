// src/pages/Dashboard/DashboardPage.jsx

import {
    Activity,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    ListChecks,
    Loader,
    MessageSquare,
    Search,
    Target,
    TrendingUp,
    UserCircle
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ URL সিঙ্ক করার জন্য যোগ করা হয়েছে

import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useComments } from '../../context/CommentContext';
import { ALL_MOCK_TASKS, INITIAL_PROJECTS } from '../../utils/constants';

// ✅ ১. গ্লোবাল ডাইনামিক প্রোগ্রেস ক্যালকুলেটর
const calculateDynamicProgress = (project) => {
    if (project.status === 'Completed' || project.status === 'Done') return 100;
    if (!project.tasks || project.tasks.length === 0) return 0;

    const projectTasks = ALL_MOCK_TASKS.filter((t) => project.tasks.includes(t.id));
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
};

// ✅ ২. ডাইনামিক কালার ফাংশন
const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-indigo-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
};

// --- Helper Components ---

function MetricCard({ title, value, icon: Icon, colorClass, bgColor, description }) {
    return (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`p-3 rounded-2xl ${bgColor} transition-transform group-hover:scale-110`}
                >
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <span className="text-xl font-bold text-gray-800">{value}</span>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    );
}

function ProjectProgressCard({ project }) {
    const progress = calculateDynamicProgress(project);
    const progressColor = getProgressColor(progress);

    return (
        <div className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-base">{project.title}</h4>
                        <p className="text-xs text-gray-400">
                            Due: {project.dueDate || project.endDate}
                        </p>
                    </div>
                </div>
                <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        project.status === 'In Progress'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {project.status}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-grow bg-gray-100 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-1000 ${progressColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-gray-700 w-10">{progress}%</span>
            </div>
        </div>
    );
}

// --- Main Dashboard Component ---

function ProjectDashboard() {
    const { user, loading: authLoading, hasRole } = useAuth();
    const { taskComments } = useComments();
    const { activities } = useActivity();

    // ✅ URL Search Sync Logic
    const location = useLocation();
    const navigate = useNavigate();
    const searchTerm = new URLSearchParams(location.search).get('q') || '';

    const handleSearchChange = (e) => {
        const { value } = e.target;
        const params = new URLSearchParams(location.search);
        if (value) params.set('q', value);
        else params.delete('q');
        navigate({ search: params.toString() }, { replace: true });
    };

    const [loading, setLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [user]);

    const recentComments = useMemo(() => {
        const allComments = [];
        Object.entries(taskComments).forEach(([taskId, comments]) => {
            const task = ALL_MOCK_TASKS.find((t) => t.id === parseInt(taskId, 10));
            comments.forEach((comment) => {
                allComments.push({ ...comment, taskTitle: task ? task.title : 'Unknown Task' });
            });
        });
        return allComments.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
    }, [taskComments]);

    const dynamicData = useMemo(() => {
        if (!user) return null;

        let myProjects = INITIAL_PROJECTS.filter(
            (p) => p.members.includes(user.id) || p.managerId === user.id
        );
        let myTasks = ALL_MOCK_TASKS.filter((t) => t.assigneeId === user.id);

        if (searchTerm)
            myProjects = myProjects.filter((p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (statusFilter !== 'All') {
            myProjects = myProjects.filter((p) => p.status === statusFilter);
            const taskMap = { Completed: 'done', 'In Progress': 'in_progress', 'To Do': 'todo' };
            myTasks = myTasks.filter((t) => t.status === taskMap[statusFilter]);
        }

        if (priorityFilter !== 'All')
            myTasks = myTasks.filter((t) => t.priority === priorityFilter.toLowerCase());

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
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const completionRate =
        dynamicData.totalAssignedTasks > 0
            ? ((dynamicData.completedTasks / dynamicData.totalAssignedTasks) * 100).toFixed(0)
            : 0;

    return (
        <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm">
                        <UserCircle className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800">
                            Welcome, {user.name}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Role:{' '}
                            <span className="text-indigo-600 capitalize">
                                {user.role.replace('_', ' ')}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold text-slate-700">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-10">
                <MetricCard
                    title="Total Tasks"
                    value={dynamicData.totalAssignedTasks}
                    icon={ListChecks}
                    colorClass="text-rose-500"
                    bgColor="bg-rose-50"
                    description="Assigned to you"
                />
                <MetricCard
                    title="Completed"
                    value={dynamicData.completedTasks}
                    icon={CheckCircle}
                    colorClass="text-emerald-500"
                    bgColor="bg-emerald-50"
                    description="Finished work"
                />
                <MetricCard
                    title="In Progress"
                    value={dynamicData.inProgressTasks}
                    icon={Activity}
                    colorClass="text-indigo-500"
                    bgColor="bg-indigo-50"
                    description="Current focus"
                />
                <MetricCard
                    title="Comp. Rate"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    colorClass="text-amber-500"
                    bgColor="bg-amber-50"
                    description="Performance"
                />
                {hasRole(['admin', 'project_manager']) && (
                    <MetricCard
                        title="Projects"
                        value={dynamicData.activeProjects}
                        icon={Briefcase}
                        colorClass="text-sky-500"
                        bgColor="bg-sky-50"
                        description="Managing"
                    />
                )}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm} // ✅ এখন এটি URL থেকে ডাটা নেয়
                            onChange={handleSearchChange} // ✅ ইনপুট চেঞ্জ হলে URL আপডেট হবে
                            placeholder="Search projects..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${showAdvancedFilters ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <Filter className="w-5 h-5" /> Filters
                    </button>
                </div>

                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-2xl">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white p-3 rounded-xl border-none shadow-sm outline-none font-medium text-slate-600"
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-white p-3 rounded-xl border-none shadow-sm outline-none font-medium text-slate-600"
                        >
                            <option value="All">All Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-rose-50 p-6 rounded-3xl flex items-center justify-between border border-rose-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-rose-900">
                                        Upcoming Deadlines
                                    </h2>
                                    <p className="text-rose-600/80 font-medium text-sm">
                                        You have {dynamicData.dueDateApproaching} pending tasks
                                    </p>
                                </div>
                            </div>
                            <span className="text-3xl font-black text-rose-600">
                                {dynamicData.dueDateApproaching}
                            </span>
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
                                <Target className="w-6 h-6 text-indigo-500" /> Your Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {dynamicData.assignedProjects.map((project) => (
                                    <ProjectProgressCard key={project.id} project={project} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-500">
                                <MessageSquare className="w-5 h-5" /> Recent Comments
                            </h2>
                            <div className="space-y-4">
                                {recentComments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100"
                                    >
                                        <p className="text-sm text-slate-700">
                                            <span className="font-bold text-indigo-600">
                                                {comment.user}
                                            </span>
                                            : "{comment.text}"
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-400 mt-1 block uppercase">
                                            {new Date(comment.time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-sky-600">
                                <Activity className="w-5 h-5" /> Activity Log
                            </h2>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {activities.map((log) => (
                                    <div
                                        key={log.id}
                                        className="relative pl-6 pb-4 border-l-2 border-sky-100 last:border-0"
                                    >
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm" />
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <p className="text-xs text-slate-700">
                                                <span className="font-bold text-slate-900">
                                                    {log.user}
                                                </span>{' '}
                                                {log.action}
                                                <span className="font-medium text-sky-600 block">
                                                    "{log.target}"
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDashboard;
