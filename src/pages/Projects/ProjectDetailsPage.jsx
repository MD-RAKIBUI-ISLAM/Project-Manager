// src/pages/Projects/ProjectDetailPage.jsx

import {
    Activity,
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Kanban,
    List,
    Loader,
    Plus,
    User,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CommentSection from '../../components/tasks/CommentSection';
import TaskBoard from '../../components/tasks/TaskBoard';
import TaskModal from '../../components/tasks/TaskModal';
// ✅ Updated Imports: ALL_MOCK_TASKS এবং অন্যান্য কনস্ট্যান্টস ব্যবহার করা হলো
import { ALL_MOCK_TASKS, INITIAL_PROJECTS, mockProjectMembers } from '../../utils/constants';

// --- MOCK DATA UTILITIES ---
/**
 * @BACKEND_TEAM_NOTE:
 * বর্তমানে এই ইউটিলিটি ফাংশনগুলো লোকাল কনস্ট্যান্ট থেকে ডেটা ফিল্টার করছে।
 * ইন্টিগ্রেশনের সময় এই লজিকগুলো সরাসরি API এন্ডপয়েন্টে (GET /projects/:id) স্থানান্তরিত হবে।
 */

const getProjectById = (id) => INITIAL_PROJECTS.find((p) => p.id === Number(id));

// টাস্কগুলি এখন ALL_MOCK_TASKS থেকে লোড করা হবে
const getTasksByProject = (projectTaskIds) =>
    ALL_MOCK_TASKS.filter((t) => projectTaskIds.includes(t.id));

// helper function: member IDs-কে সম্পূর্ণ member object-এ রূপান্তর করে
const mapMemberData = (memberIds, membersList) =>
    memberIds.map((id) => {
        const member = membersList.find((m) => m.id === id);
        return member || { id, name: 'Unknown Member', role: 'N/A' };
    });

// helper function: manager ID-কে manager object-এ রূপান্তর করে
const getManagerData = (managerId, membersList) => {
    const manager = membersList.find((m) => m.id === managerId);
    return manager
        ? { id: manager.id, name: manager.name }
        : { id: managerId, name: 'Unknown Manager' };
};

// --- END MOCK DATA UTILITIES ---

// Hardcoded Styles (Typically from constants.js)
const statusStyles = {
    to_do: { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Activity },
    blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: Loader },
    done: { label: 'Done', color: 'bg-green-100 text-green-700', icon: CheckCircle }
};

const priorityClasses = {
    critical: 'font-bold text-red-600',
    high: 'font-medium text-orange-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
};

// Helper component for task list item (kept for 'List' View)
function ProjectTaskItem({ task }) {
    const statusInfo = statusStyles[task.status] || statusStyles.to_do;
    const StatusIcon = statusInfo.icon;

    return (
        <div className="flex justify-between items-center p-3 border-b hover:bg-gray-100 transition rounded-lg cursor-pointer">
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
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]); // Master state for tasks
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Task Management States
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // Task being edited or commented on

    // --- Task Handlers (Mock Implementation) ---
    const handleSaveTask = (taskData, isEditing) => {
        // In a real app, this calls an API and re-fetches tasks.
        /**
         * @BACKEND_TEAM_NOTE:
         * - isEditing == true হলে: PATCH/PUT `/api/tasks/${taskData.id}` কল করুন।
         * - isEditing == false হলে: POST `/api/projects/${projectId}/tasks` কল করুন।
         * ডেটা সেভ হওয়ার পর `setTasks` আপডেট করুন অথবা পুনরায় ফেচ করুন।
         */
        console.log(`[MOCK API] Saving task: ${isEditing ? 'Editing' : 'Creating'}`, taskData);

        setTasks((prevTasks) => {
            if (isEditing) {
                // Edit existing task
                return prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t));
            }
            // Create new task with a temporary ID and default status
            const newId = Date.now();
            return [...prevTasks, { ...taskData, id: newId, status: 'to_do' }];
        });

        setIsTaskModalOpen(false);
        setSelectedTask(null);
    };

    const handleStatusChange = (taskId, newStatus) => {
        // In a real app, this calls an API to update status (FR-12)
        /**
         * @BACKEND_TEAM_NOTE:
         * কানবান বোর্ডে ড্র্যাগ এন্ড ড্রপ বা স্ট্যাটাস চেঞ্জের সময়:
         * PATCH `/api/tasks/${taskId}/status` কল করুন যেখানে body হবে { status: newStatus }।
         */
        console.log(`[MOCK API] Task ${taskId} status changed to ${newStatus}`);

        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
    };

    // UI Handler for opening Task Modal (for creating or editing)
    const handleOpenTaskModal = (task = null) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    // UI Handler for opening Comment Section (FR-14)
    const handleOpenCommentSection = (task) => {
        setSelectedTask(task);
        setIsCommentSidebarOpen(true);
    };
    // --- End Task Handlers ---

    // Mock data fetching (simulating API call)
    useEffect(() => {
        setLoading(true);
        setError(null);

        /**
         * @BACKEND_TEAM_NOTE:
         * এখানে GET `/api/projects/${projectId}` কল করতে হবে।
         * রেসপন্স-এ অবশ্যই প্রজেক্টের সাথে সংশ্লিষ্ট tasks, manager এবং member details
         * (Nested objects/Populated data) থাকতে হবে।
         */
        const rawProject = getProjectById(projectId);

        if (rawProject) {
            // ✅ STEP 1: Process Manager and Members data using mockProjectMembers
            const processedManager = getManagerData(rawProject.managerId, mockProjectMembers);
            const processedMembers = mapMemberData(rawProject.members, mockProjectMembers);

            // ✅ STEP 2: Create the final project object (Merging raw data with processed objects)
            const finalProject = {
                ...rawProject,
                manager: processedManager, // Now an object: {id: 1, name: 'Alice Smith'}
                members: processedMembers // Now array of objects
            };

            setProject(finalProject);

            // ✅ STEP 3: Fetch tasks from the new ALL_MOCK_TASKS source
            const fetchedTasks = getTasksByProject(rawProject.tasks);
            setTasks(fetchedTasks);
        } else {
            setError('Project not found.');
        }

        setLoading(false);
        // Added dependencies to ensure useEffect runs correctly if IDs change
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

    if (error || !project) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl m-6">
                <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
                <p className="text-red-700">{error || 'An unknown error occurred.'}</p>
                <Link
                    to="/projects"
                    className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Project List
                </Link>
            </div>
        );
    }

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

            {/* Details and Task View Layout */}
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
                                {/* ✅ Now correctly uses object property */}
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
                        {/* ✅ Now maps over enriched member objects */}
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

                {/* Column 2 & 3: Task View (Kanban/List) */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        {/* Task View Header, Toggle, and Add Button */}
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                {viewMode === 'kanban' ? (
                                    <Kanban className="w-6 h-6 mr-3 text-indigo-500" />
                                ) : (
                                    <List className="w-6 h-6 mr-3 text-indigo-500" />
                                )}
                                Tasks Overview
                            </h2>
                            <div className="flex space-x-3">
                                {/* View Toggle */}
                                <div className="inline-flex rounded-lg shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('kanban')}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-l-lg transition-colors border ${
                                            viewMode === 'kanban'
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Kanban className="w-4 h-4 mr-2" /> Kanban
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-r-lg transition-colors border ${
                                            viewMode === 'list'
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        <List className="w-4 h-4 mr-2" /> List
                                    </button>
                                </div>
                                {/* Add Task Button (FR-10) */}
                                <button
                                    type="button"
                                    onClick={() => handleOpenTaskModal(null)}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> New Task
                                </button>
                            </div>
                        </div>

                        {/* Task Content Area */}
                        <div className="min-h-[400px]">
                            {/* @BACKEND_TEAM_NOTE: 
                            টাস্ক ফিল্টারিং বা সার্চ বার যোগ করলে এন্ডপয়েন্টে কুয়েরি প্যারামস (?status=done) পাঠাতে হবে।
                        */}
                            {viewMode === 'kanban' ? (
                                <div className="py-4">
                                    <TaskBoard
                                        tasks={tasks}
                                        projectMembers={project.members}
                                        onStatusChange={handleStatusChange}
                                        onEditTask={handleOpenTaskModal}
                                        onOpenComments={handleOpenCommentSection}
                                    />
                                </div>
                            ) : (
                                // List View
                                <div className="space-y-1 py-4">
                                    {tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <button
                                                key={task.id}
                                                type="button"
                                                onClick={() => handleOpenTaskModal(task)}
                                                className="w-full p-0 border-none bg-transparent appearance-none text-left"
                                            >
                                                <ProjectTaskItem task={task} />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                            <p>No tasks found for this project yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modals and Sidebars (Conditional Rendering) --- */}
            {isTaskModalOpen && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleSaveTask}
                    // ✅ Passes the enriched member array to the modal
                    projectMembers={project.members}
                />
            )}

            {isCommentSidebarOpen && selectedTask && (
                <CommentSection
                    task={selectedTask}
                    onClose={() => {
                        setIsCommentSidebarOpen(false);
                        setSelectedTask(null);
                    }}
                />
            )}
        </div>
    );
}

export default ProjectDetailPage;
