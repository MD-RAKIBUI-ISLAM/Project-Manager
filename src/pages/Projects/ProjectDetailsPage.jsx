// src/pages/Projects/ProjectDetailPage.jsx

import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Loader,
    Plus,
    Trash2,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CommentSection from '../../components/tasks/CommentSection';
import TaskBoard from '../../components/tasks/TaskBoard';
import TaskModal from '../../components/tasks/TaskModal';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ALL_MOCK_TASKS, INITIAL_PROJECTS, mockProjectMembers } from '../../utils/constants';

// --- INLINE CONFIRMATION MODAL ---
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
                        <span className="font-semibold text-gray-800">"{taskTitle}"</span>?
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
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg transition-colors"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- UTILITIES ---
const getProjectById = (id) => INITIAL_PROJECTS.find((p) => p.id === Number(id));
const getTasksByProject = (projectTaskIds) =>
    ALL_MOCK_TASKS.filter((t) => projectTaskIds.includes(t.id));

const mapMemberData = (memberIds, membersList) =>
    memberIds.map((id) => membersList.find((m) => m.id === id) || { id, name: 'Unknown Member' });

const getManagerData = (managerId, membersList) => {
    const manager = membersList.find((m) => m.id === managerId);
    return manager
        ? { id: manager.id, name: manager.name, image: manager.image } // ✅ ইমেজ ডাটা পাস করা হয়েছে
        : { id: managerId, name: 'Unknown Manager' };
};

const statusStyles = {
    to_do: { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Activity },
    blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: Loader },
    done: { label: 'Done', color: 'bg-green-100 text-green-700', icon: CheckCircle }
};

function ProjectTaskItem({ task, onDelete }) {
    const statusInfo = statusStyles[task.status] || statusStyles.to_do;
    const StatusIcon = statusInfo.icon;
    const assignee = mockProjectMembers.find((m) => m.id === task.assigneeId) || {
        name: task.assignee
    };

    return (
        <div className="group flex justify-between items-center p-3 border-b hover:bg-gray-50 transition-all rounded-lg">
            <div className="flex-grow min-w-0 pr-4 text-left">
                <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                    {assignee.image ? (
                        <img
                            src={assignee.image}
                            className="w-4 h-4 rounded-full mr-1.5 object-cover"
                            alt=""
                        />
                    ) : (
                        <User className="w-3 h-3 mr-1" />
                    )}
                    <span className="font-medium">{assignee.name}</span>
                    <span className="mx-2">|</span>
                    <span className="capitalize">{task.priority} Priority</span>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${statusInfo.color}`}
                >
                    <StatusIcon className="w-3 h-3 mr-1" /> {statusInfo.label}
                </span>
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
    const { addNotification } = useNotifications();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('kanban');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleSaveTask = (taskData, isEditing) => {
        const currentUser = user?.name || 'Someone';
        setTasks((prevTasks) => {
            if (isEditing) {
                logActivity(currentUser, 'updated task', taskData.title);
                addNotification(
                    currentUser,
                    'updated the task',
                    taskData.title,
                    `/projects/${projectId}`
                );
                return prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t));
            }
            logActivity(currentUser, 'created a new task', taskData.title);
            addNotification(
                currentUser,
                'created a new task',
                taskData.title,
                `/projects/${projectId}`
            );
            return [...prevTasks, { ...taskData, id: Date.now(), status: 'to_do' }];
        });
        setIsTaskModalOpen(false);
        setSelectedTask(null);
    };

    const handleStatusChange = (taskId, newStatus) => {
        const task = tasks.find((t) => t.id === taskId);
        const currentUser = user?.name || 'Someone';
        const statusLabel = statusStyles[newStatus]?.label || newStatus;

        logActivity(currentUser, `moved to ${statusLabel}`, task?.title);
        addNotification(
            currentUser,
            `moved task to ${statusLabel}`,
            task?.title,
            `/projects/${projectId}`
        );

        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    };

    const handleOpenDeleteModal = (taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            const currentUser = user?.name || 'Someone';
            logActivity(currentUser, 'deleted task', taskToDelete.title);
            addNotification(
                currentUser,
                'deleted a task',
                taskToDelete.title,
                `/projects/${projectId}`
            );
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
            <div className="flex items-center justify-center h-screen">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    if (error || !project)
        return (
            <div className="p-8 bg-red-50 m-6 rounded-xl text-red-800">
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link
                to="/projects"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Link>

            {/* Header Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                            <Briefcase className="w-8 h-8 mr-3 text-indigo-600" /> {project.title}
                        </h1>
                        <p className="text-gray-500 mt-2">{project.description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleOpenTaskModal()}
                        className="flex items-center px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                    >
                        <Plus className="w-5 h-5 mr-2" /> New Task
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                            Progress
                        </p>
                        <p className="text-2xl font-black text-indigo-900">{project.progress}%</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Total Tasks
                        </p>
                        <p className="text-2xl font-black text-gray-900">{tasks.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">
                            Completed
                        </p>
                        <p className="text-2xl font-black text-green-900">
                            {tasks.filter((t) => t.status === 'done').length}
                        </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                            Upcoming
                        </p>
                        <p className="text-2xl font-black text-orange-900">
                            {tasks.filter((t) => t.status !== 'done').length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    {/* Project Info - Manager Pic Update ✅ */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Project Info
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                {project.manager.image ? (
                                    <img
                                        src={project.manager.image}
                                        className="w-9 h-9 rounded-full object-cover"
                                        alt=""
                                    />
                                ) : (
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500">Manager</p>
                                    <p className="text-sm font-bold text-gray-800">
                                        {project.manager.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Due Date</p>
                                    <p className="text-sm font-bold text-gray-800">
                                        {project.endDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between">
                            Team <span>{project.members.length}</span>
                        </h2>
                        <div className="space-y-3">
                            {project.members.map((m) => (
                                <div key={m.id} className="flex items-center gap-3">
                                    {m.image ? (
                                        <img
                                            src={m.image}
                                            alt={m.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-700 font-bold text-xs shadow-sm">
                                            {m.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {m.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {m.role || 'Member'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                            <div className="flex bg-white rounded-xl p-1 shadow-sm border">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('kanban')}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Board
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    List
                                </button>
                            </div>
                        </div>

                        <div className="p-4 min-h-[500px]">
                            {viewMode === 'kanban' ? (
                                <TaskBoard
                                    tasks={tasks}
                                    projectMembers={project.members}
                                    onStatusChange={handleStatusChange}
                                    onEditTask={handleOpenTaskModal}
                                    onDeleteTask={handleOpenDeleteModal}
                                    onOpenComments={(t) => {
                                        setSelectedTask(t);
                                        setIsCommentSidebarOpen(true);
                                    }}
                                />
                            ) : (
                                <div className="space-y-2">
                                    {tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <button
                                                key={task.id}
                                                type="button"
                                                className="w-full text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                                onClick={() => handleOpenTaskModal(task)}
                                            >
                                                <ProjectTaskItem
                                                    task={task}
                                                    onDelete={handleOpenDeleteModal}
                                                />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 text-gray-400">
                                            No tasks found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                taskTitle={taskToDelete?.title}
                onConfirm={confirmDeleteTask}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}

export default ProjectDetailPage;
