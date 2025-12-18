// src/pages/Projects/ProjectDetailPage.jsx

import {
    Activity,
    AlertTriangle, // ✅ আইকন যোগ করা হয়েছে
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Kanban,
    List,
    Loader,
    Plus,
    Trash2,
    User,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CommentSection from '../../components/tasks/CommentSection';
import TaskBoard from '../../components/tasks/TaskBoard';
import TaskModal from '../../components/tasks/TaskModal';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { ALL_MOCK_TASKS, INITIAL_PROJECTS, mockProjectMembers } from '../../utils/constants';

// --- INLINE CONFIRMATION MODAL COMPONENT ---
function DeleteConfirmationModal({ isOpen, onConfirm, onCancel, taskTitle }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                        Delete Task?
                    </h3>
                    <p className="text-sm text-center text-gray-500 mb-6">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-gray-800">"{taskTitle}"</span>? This
                        action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MOCK DATA UTILITIES ---
const getProjectById = (id) => INITIAL_PROJECTS.find((p) => p.id === Number(id));
const getTasksByProject = (projectTaskIds) =>
    ALL_MOCK_TASKS.filter((t) => projectTaskIds.includes(t.id));

const mapMemberData = (memberIds, membersList) =>
    memberIds.map((id) => {
        const member = membersList.find((m) => m.id === id);
        return member || { id, name: 'Unknown Member', role: 'N/A' };
    });

const getManagerData = (managerId, membersList) => {
    const manager = membersList.find((m) => m.id === managerId);
    return manager
        ? { id: manager.id, name: manager.name }
        : { id: managerId, name: 'Unknown Manager' };
};

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

function ProjectTaskItem({ task, onDelete }) {
    const statusInfo = statusStyles[task.status] || statusStyles.to_do;
    const StatusIcon = statusInfo.icon;

    return (
        <div className="group flex justify-between items-center p-3 border-b hover:bg-gray-100 transition rounded-lg cursor-pointer">
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
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function ProjectDetailPage() {
    const { projectId } = useParams();
    const { logActivity } = useActivity();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('kanban');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // ✅ ডিলিট মোডালের জন্য নতুন স্টেট
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleSaveTask = (taskData, isEditing) => {
        setTasks((prevTasks) => {
            if (isEditing) {
                logActivity(user?.name || 'User', 'updated task', taskData.title);
                return prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t));
            }
            logActivity(user?.name || 'User', 'created a new task', taskData.title);
            return [...prevTasks, { ...taskData, id: Date.now(), status: 'to_do' }];
        });
        setIsTaskModalOpen(false);
        setSelectedTask(null);
    };

    const handleStatusChange = (taskId, newStatus) => {
        const task = tasks.find((t) => t.id === taskId);
        logActivity(user?.name || 'User', `changed status to ${newStatus}`, task?.title || 'Task');
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    };

    // ✅ অ্যালার্ট ছাড়া ডিলিট মোডাল ওপেন করার ফাংশন
    const handleOpenDeleteModal = (taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    // ✅ কনফার্ম হওয়ার পর আসল ডিলিট করার ফাংশন
    const confirmDeleteTask = () => {
        if (taskToDelete) {
            logActivity(user?.name || 'User', 'deleted task', taskToDelete.title);
            setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleOpenTaskModal = (task = null) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    useEffect(() => {
        setLoading(true);
        const rawProject = getProjectById(projectId);
        if (rawProject) {
            setProject({
                ...rawProject,
                manager: getManagerData(rawProject.managerId, mockProjectMembers),
                members: mapMemberData(rawProject.members, mockProjectMembers)
            });
            setTasks(getTasksByProject(rawProject.tasks));
        } else {
            setError('Project not found.');
        }
        setLoading(false);
    }, [projectId]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    if (error || !project)
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl m-6">
                <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
                <p className="text-red-700">{error}</p>
            </div>
        );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const pendingTasks = totalTasks - completedTasks;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link
                to="/projects"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Link>

            {/* Project Header */}
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-8 h-8 mr-3 text-indigo-600" /> {project.title}
                </h1>
                <p className="text-gray-600 mb-6 border-b pb-4">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-indigo-600 mb-1">
                            Overall Progress
                        </p>
                        <p className="text-3xl font-bold text-indigo-800">{project.progress}%</p>
                        <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                            <div
                                className="h-2 rounded-full bg-indigo-500"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-gray-600 mb-1">
                            Total Tasks
                        </p>
                        <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-green-600 mb-1">
                            Completed
                        </p>
                        <p className="text-3xl font-bold text-green-800">{completedTasks}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold uppercase text-yellow-600 mb-1">
                            Pending
                        </p>
                        <p className="text-3xl font-bold text-yellow-800">{pendingTasks}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Info */}
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
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3 border-t pt-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-indigo-500" /> Team Members (
                        {project.members.length})
                    </h3>
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

                {/* Column 2 & 3: Task View */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
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
                                <div className="inline-flex rounded-lg shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('kanban')}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-l-lg border ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                                    >
                                        <Kanban className="w-4 h-4 mr-2" /> Kanban
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-r-lg border ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                                    >
                                        <List className="w-4 h-4 mr-2" /> List
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleOpenTaskModal(null)}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> New Task
                                </button>
                            </div>
                        </div>

                        {/* Kanban View & List View */}
                        <div className="min-h-[400px]">
                            {viewMode === 'kanban' ? (
                                <div className="overflow-x-auto py-4">
                                    <div className="min-w-max">
                                        <TaskBoard
                                            tasks={tasks}
                                            projectMembers={project.members}
                                            onStatusChange={handleStatusChange}
                                            onEditTask={handleOpenTaskModal}
                                            onDeleteTask={handleOpenDeleteModal} // ✅ বোর্ড ভিউ এর জন্যও আপডেট করা হয়েছে
                                            onOpenComments={(t) => {
                                                setSelectedTask(t);
                                                setIsCommentSidebarOpen(true);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1 py-4">
                                    {tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <button
                                                key={task.id}
                                                type="button"
                                                onClick={() => handleOpenTaskModal(task)}
                                                className="w-full text-left focus:outline-none"
                                            >
                                                <ProjectTaskItem
                                                    task={task}
                                                    onDelete={handleOpenDeleteModal} // ✅ লিস্ট ভিউ এর জন্য আপডেট
                                                />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                            No tasks found for this project yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isTaskModalOpen && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleSaveTask}
                    projectMembers={project.members}
                />
            )}

            {isCommentSidebarOpen && selectedTask && (
                <CommentSection
                    task={selectedTask}
                    onClose={() => setIsCommentSidebarOpen(false)}
                />
            )}

            {/* ✅ ইনলাইন ডিলিট মোডাল রেন্ডার */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                taskTitle={taskToDelete?.title}
                onConfirm={confirmDeleteTask}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setTaskToDelete(null);
                }}
            />
        </div>
    );
}

export default ProjectDetailPage;
