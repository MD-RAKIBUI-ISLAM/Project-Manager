import {
    Activity,
    Bell,
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

// --- MOCK DATA (Simulating user context and fetched data) ---
const MOCK_USER = {
    id: 1,
    name: 'Alice Smith',
    role: 'Project Manager', // FR-4: Role-based view support
    username: 'alice.smith'
};

const MOCK_DASHBOARD_DATA = {
    // Metrics for the current user's performance and workload
    totalAssignedTasks: 12,
    completedTasks: 5,
    inProgressTasks: 4,
    blockedTasks: 1,
    dueDateApproaching: 2,

    // Overview metrics
    totalProjects: 5,
    activeProjects: 3,

    // Recent activities (FR-7: Activity Log)
    recentActivities: [
        { id: 1, user: 'Bob J.', action: 'marked Task #203 as done', time: '5m ago' },
        { id: 2, user: 'You', action: 'added 3 new tasks to TaskMaster Core', time: '1h ago' },
        { id: 3, user: 'Eve A.', action: 'commented on Task #104', time: '3h ago' }
    ],

    // Mock Recent Comments (FR-18)
    recentComments: [
        { id: 1, user: 'Bob J.', action: 'Task #301 এ মন্তব্য করেছেন', time: '10m ago' },
        { id: 2, user: 'You', action: 'Task #201 এ @Alice কে উল্লেখ করেছেন', time: '4h ago' }
    ],

    // Quick access to assigned projects
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
// --- END MOCK DATA ---

// Helper Component: Metric Card
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

// Helper Component: Project Progress Card (For Assigned Projects)
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
        // Added subtle hover effect and border
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

            {/* Progress Bar and Due Date */}
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

// Advanced Filtering Component Placeholder
function AdvancedFilters() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Filter 1: Status */}
            <select className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>স্থিতি: সব</option>
                <option>সম্পন্ন</option>
                <option>কাজ চলছে</option>
                <option>শুরু হবে</option>
            </select>

            {/* Filter 2: Priority */}
            <select className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>অগ্রাধিকার: সব</option>
                <option>উচ্চ</option>
                <option>মাঝারি</option>
                <option>নিম্ন</option>
            </select>

            {/* Filter 3: Assignee */}
            <select className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>অ্যাসাইনি: আমি</option>
                <option>Bob J.</option>
                <option>Eve A.</option>
            </select>

            {/* Filter 4: Due Date */}
            <input
                type="date"
                className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ডেডলাইন অনুযায়ী"
            />
        </div>
    );
}

// Main Component: Project Management Dashboard
function ProjectDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    // New state for filter toggle
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    useEffect(() => {
        // Simulating API call delay
        setTimeout(() => {
            setData(MOCK_DASHBOARD_DATA);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="ml-3 text-lg font-medium text-indigo-600">ডাটা লোড হচ্ছে...</span>
            </div>
        );
    }

    // Task Completion Rate calculation
    const completionRate =
        data.totalAssignedTasks > 0
            ? ((data.completedTasks / data.totalAssignedTasks) * 100).toFixed(0)
            : 0;

    return (
        // Use a clean, slightly off-white background
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
            {/* 🚀 পরিবর্তিত অংশ: Header (স্বাগতম) এবং Notification Card কে একই Grid-এ রাখা হয়েছে */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
                {/* 1. Header and Welcome Message (2/3 width) */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        👋 স্বাগতম, {MOCK_USER.name}
                    </h1>
                    <p className="text-gray-600 mt-2 text-base md:text-lg">
                        আজকের কাজের ওভারভিউ এবং প্রকল্পের স্থিতি দেখুন। (Role:{' '}
                        <span className="font-semibold text-indigo-600">{MOCK_USER.role}</span>)
                    </p>
                </div>

                {/* 2. Notification Card (1/3 width, Right Corner) */}
                <div className="lg:col-span-1 flex items-center justify-start lg:justify-end">
                    <div className="bg-white p-4 w-full md:max-w-xs rounded-2xl shadow-xl border border-indigo-100">
                        <h2 className="text-md font-bold text-gray-800 mb-2 flex items-center border-b pb-1">
                            <Bell className="w-5 h-5 mr-2 text-amber-500" /> নোটিফিকেশনস
                        </h2>
                        <p className="text-sm text-gray-500">৩টি নতুন নোটিফিকেশন অপেক্ষা করছে।</p>
                    </div>
                </div>
            </div>
            {/* 🚀 পরিবর্তিত অংশ সমাপ্ত */}

            {/* --- Global Search and Filtering (FR-15 Implementation) --- */}
            <div className="mb-8 p-4 bg-white rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Search Input */}
                    <div className="relative w-full sm:flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="প্রোজেক্ট বা কাজের নাম দিয়ে খুঁজুন..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    {/* Filter Toggle Button */}
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
                                <Filter className="w-5 h-5 mr-2" /> ফিল্টার লুকান
                            </>
                        ) : (
                            <>
                                <Filter className="w-5 h-5 mr-2" /> উন্নত ফিল্টার
                            </>
                        )}
                        <ChevronDown
                            className={`w-4 h-4 ml-1 transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                </div>

                {/* Advanced Filter Area (Collapsible) */}
                {showAdvancedFilters && <AdvancedFilters />}
            </div>
            {/* --- END NEW FILTERING UI --- */}

            {/* --- 1. Top Metrics Grid (Same as before) --- */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                {/* 1. Total Assigned Tasks */}
                <MetricCard
                    title="মোট অ্যাসাইন করা কাজ"
                    value={data.totalAssignedTasks}
                    icon={ListChecks}
                    colorClass="text-indigo-600"
                    description="আপনার মোট কতগুলি কাজ বাকি আছে"
                />

                {/* 2. Completed Tasks */}
                <MetricCard
                    title="সম্পন্ন হয়েছে"
                    value={data.completedTasks}
                    icon={CheckCircle}
                    colorClass="text-green-600"
                    description="আজ পর্যন্ত সম্পন্ন করা টাস্ক"
                />

                {/* 3. In Progress Tasks */}
                <MetricCard
                    title="কাজ চলছে"
                    value={data.inProgressTasks}
                    icon={Activity}
                    colorClass="text-sky-600"
                    description="বর্তমানে সক্রিয় টাস্ক"
                />

                {/* 4. Completion Rate */}
                <MetricCard
                    title="সম্পন্নতার হার"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    colorClass="text-purple-600"
                    description="মোট কাজের তুলনায় সম্পন্ন হওয়া টাস্কের অনুপাত"
                />

                {/* 5. Projects Overview (Manager/Admin View) */}
                {MOCK_USER.role !== 'Member' && (
                    <MetricCard
                        title="সক্রিয় প্রকল্প"
                        value={data.activeProjects}
                        icon={Briefcase}
                        colorClass="text-amber-600"
                        description="বর্তমানে চলমান মোট প্রকল্প সংখ্যা"
                    />
                )}
            </div>

            {/* --- 2. Main Content Layout (Task List & Activity Log) (Same as before) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Critical and Assigned Tasks (2/3 width on desktop) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Critical Tasks Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500">
                        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center border-b pb-2">
                            <Clock className="w-5 h-5 mr-2" /> ডেডলাইন কাছাকাছি (Upcoming Deadlines)
                        </h2>
                        {data.dueDateApproaching > 0 ? (
                            <p className="text-red-500 font-medium">
                                আপনার{' '}
                                <span className="font-extrabold text-2xl">
                                    {data.dueDateApproaching}
                                </span>{' '}
                                টি কাজের ডেডলাইন এই সপ্তাহে শেষ হতে চলেছে। এখনই দেখুন!
                            </p>
                        ) : (
                            <p className="text-gray-500 italic">
                                এই মুহূর্তে কোনো কাজ ডেডলাইন মিস করার ঝুঁকিতে নেই।
                            </p>
                        )}
                    </div>

                    {/* Assigned Projects Quick Access */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <Target className="w-5 h-5 mr-2 text-indigo-500" /> আপনার প্রকল্পসমূহ
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
                    {/* MOVED: Notifications card removed from here as it's moved to the top */}

                    {/* Recent Comments/Mentions (FR-18 Placeholder) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl h-64 overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <MessageSquare className="w-5 h-5 mr-2 text-red-500" /> সাম্প্রতিক
                            কমেন্টস/উল্লেখ
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
                                    আর কোনো নতুন মন্তব্য বা উল্লেখ নেই।
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Existing Recent Activity Log (FR-7) */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl h-96 overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <Activity className="w-5 h-5 mr-2 text-sky-500" /> সাম্প্রতিক কার্যকলাপ
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
