// src/pages/Tasks/TaskBoard.jsx

import { AlertTriangle, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

// ✅ Activity, Auth এবং Notification Context ইমপোর্ট করা হলো
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
    ALL_MOCK_TASKS as initialTasks,
    mockProjectMembers,
    PRIORITY_ORDER,
    TASK_STATUSES,
    USER_ROLES
} from '../../utils/constants';
import Button from '../common/Button';
import CommentSection from './CommentSection';
import TaskCard from './TaskCard';
import TaskFilterSort from './TaskFilterSortBar';
import TaskModal from './TaskModal';

// --- INLINE CONFIRMATION MODAL (Design Unchanged) ---
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

function TaskBoard() {
    const { user, role } = useAuth();
    const { logActivity } = useActivity();
    const { addNotification } = useNotifications();

    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const [filters, setFilters] = useState({
        priority: null,
        assigneeId: null,
        searchTerm: '',
        sortBy: 'dueDate',
        sortOrder: 'asc',
        statusFilter: 'all' // Overview ফিল্টারের জন্য নতুন স্টেট
    });

    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [taskForComments, setTaskForComments] = useState(null);

    const handleOpenDeleteModal = (taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            const actorName = user?.name || 'User';
            logActivity(actorName, 'deleted task', taskToDelete?.title || 'Unknown Task');
            addNotification(actorName, 'deleted task', taskToDelete?.title);

            setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleStatusChange = (taskId, newStatusValue) => {
        const task = tasks.find((t) => t.id === taskId);
        const statusLabel =
            TASK_STATUSES.find((s) => s.value === newStatusValue)?.label || newStatusValue;

        const actorName = user?.name || 'User';
        logActivity(actorName, `moved task to ${statusLabel}`, task?.title || 'Task');
        addNotification(actorName, `moved task to ${statusLabel}`, task?.title);

        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatusValue } : t))
        );
    };

    const handleSaveTask = (taskData, isEditing) => {
        const assignee =
            mockProjectMembers.find((m) => m.id === Number(taskData.assigneeId))?.name ||
            'Unassigned';

        const actorName = user?.name || 'User';

        if (isEditing) {
            logActivity(actorName, 'updated task', taskData.title);
            addNotification(actorName, 'updated task', taskData.title);

            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData, assignee } : t))
            );
        } else {
            logActivity(actorName, 'created a new task', taskData.title);

            const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
            const newTask = {
                ...taskData,
                id: newId,
                projectId: 1,
                status: 'back_log',
                assignee,
                assigneeId: String(taskData.assigneeId)
            };

            addNotification(actorName, 'assigned a new task', taskData.title);
            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleOpenComments = (task) => {
        setTaskForComments(task);
        setIsCommentsOpen(true);
    };

    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks;
        const isManagerOrAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.PROJECT_MANAGER;

        // Role based visibility
        if (!isManagerOrAdmin && user) {
            const currentUserId = String(user.id);
            filtered = filtered.filter((t) => String(t.assigneeId) === currentUserId);
        }

        // ✅ Stats Card Filter
        if (filters.statusFilter !== 'all') {
            filtered = filtered.filter((t) => t.status === filters.statusFilter);
        }

        if (filters.priority) {
            filtered = filtered.filter((t) => t.priority === filters.priority);
        }
        if (filters.assigneeId) {
            filtered = filtered.filter((t) => String(t.assigneeId) === String(filters.assigneeId));
        }
        if (filters.searchTerm) {
            const lowerCaseSearch = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.title.toLowerCase().includes(lowerCaseSearch) ||
                    t.description.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return filtered.sort((a, b) => {
            let comparison = 0;
            const sortOrderMultiplier = filters.sortOrder === 'desc' ? -1 : 1;

            if (filters.sortBy === 'dueDate') {
                const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
                const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
                comparison = dateA - dateB;
            } else if (filters.sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (filters.sortBy === 'priority') {
                comparison = (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0);
            }

            return comparison * sortOrderMultiplier;
        });
    }, [tasks, filters, user, role]);

    // --- Task Overview Stats Calculation ---
    const stats = useMemo(() => {
        // বেইজ টাস্ক (রোল অনুযায়ী ফিল্টার করা, কিন্তু স্ট্যাটাস কার্ড ফিল্টারের আগের ডেটা)
        const baseTasks = tasks.filter((t) => {
            if (role === USER_ROLES.ADMIN || role === USER_ROLES.PROJECT_MANAGER) return true;
            return String(t.assigneeId) === String(user?.id);
        });

        const total = baseTasks.length;
        const done = baseTasks.filter((t) => t.status === 'done').length;
        const rate = total > 0 ? Math.round((done / total) * 100) : 0;

        return {
            total,
            backlog: baseTasks.filter((t) => t.status === 'back_log').length,
            inProgress: baseTasks.filter((t) => t.status === 'in_progress').length,
            done,
            rate
        };
    }, [tasks, user, role]);

    const statCards = [
        {
            id: 'all',
            label: 'TOTAL TASKS',
            value: stats.total,
            color: 'bg-indigo-50',
            textColor: 'text-indigo-700',
            sub: 'Assigned items'
        },
        {
            id: 'back_log',
            label: 'BACKLOG',
            value: stats.backlog,
            color: 'bg-gray-50',
            textColor: 'text-gray-600',
            sub: 'Waiting to start'
        },
        {
            id: 'in_progress',
            label: 'IN PROGRESS',
            value: stats.inProgress,
            color: 'bg-blue-50',
            textColor: 'text-blue-700',
            sub: 'Current focus'
        },
        {
            id: 'done',
            label: 'COMPLETED',
            value: stats.done,
            color: 'bg-green-50',
            textColor: 'text-green-700',
            sub: 'Finished work'
        },
        {
            id: 'rate',
            label: 'COMP. RATE',
            value: `${stats.rate}%`,
            color: 'bg-orange-50',
            textColor: 'text-orange-700',
            sub: 'Performance'
        }
    ];

    const getTasksByStatus = (statusValue) =>
        filteredAndSortedTasks.filter((t) => t.status === statusValue);

    return (
        <div className="py-6 flex-grow flex flex-col overflow-x-hidden px-6 bg-gray-50/30">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Task Board (Kanban)
                </h1>
                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="space-x-2 shadow-lg shadow-indigo-100"
                    onClick={() => {
                        setTaskToEdit(null);
                        setIsModalOpen(true);
                    }}
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Task</span>
                </Button>
            </div>

            {/* ✅ Task Overview Section */}
            <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Task Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() =>
                                card.id !== 'rate' &&
                                setFilters((prev) => ({ ...prev, statusFilter: card.id }))
                            }
                            className={`p-5 rounded-3xl border flex items-center justify-between transition-all text-left
                                ${filters.statusFilter === card.id ? 'ring-2 ring-indigo-500 border-transparent shadow-md bg-white' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}
                                ${card.id === 'rate' ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 tracking-tighter uppercase">
                                    {card.label}
                                </p>
                                <p className="text-[11px] text-gray-400 font-medium italic">
                                    {card.id === 'rate' ? 'Success rate' : 'Click to filter'}
                                </p>
                            </div>
                            <div
                                className={`min-w-[54px] h-[54px] ${card.color} ${card.textColor} rounded-2xl flex items-center justify-center text-xl font-black shadow-inner`}
                            >
                                {card.value}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-6 flex-shrink-0">
                <TaskFilterSort
                    filters={filters}
                    setFilters={setFilters}
                    assignees={mockProjectMembers}
                />
                {filters.statusFilter !== 'all' && (
                    <button
                        type="button"
                        onClick={() => setFilters((prev) => ({ ...prev, statusFilter: 'all' }))}
                        className="mt-2 text-xs text-indigo-600 font-bold underline px-1"
                    >
                        Clear status filter
                    </button>
                )}
            </div>

            {/* Kanban Columns */}
            <div className="flex flex-col space-y-4 pb-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:flex-grow lg:flex-nowrap">
                {TASK_STATUSES.filter(
                    (s) => filters.statusFilter === 'all' || s.value === filters.statusFilter
                ).map((statusObject) => (
                    <div
                        key={statusObject.value}
                        className="w-full lg:flex-1 lg:flex-shrink bg-gray-100/50 rounded-3xl border border-gray-200 overflow-y-auto flex flex-col transition-all duration-300"
                    >
                        <div className="sticky top-0 bg-gray-100/80 backdrop-blur-sm p-4 border-b border-gray-200 z-10">
                            <h2
                                className={`text-sm font-black flex justify-between items-center uppercase tracking-widest ${statusObject.tailwindColor || 'text-gray-700'}`}
                            >
                                <span>{statusObject.label}</span>
                                <span className="bg-white text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm">
                                    {getTasksByStatus(statusObject.value).length}
                                </span>
                            </h2>
                        </div>

                        <div className="p-3 space-y-3 flex-grow min-h-[150px]">
                            {getTasksByStatus(statusObject.value).map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleOpenDeleteModal}
                                    onCommentClick={handleOpenComments}
                                />
                            ))}
                            {getTasksByStatus(statusObject.value).length === 0 && (
                                <p className="text-center text-xs text-gray-400 mt-4">No tasks</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {isModalOpen && (
                <TaskModal
                    task={taskToEdit}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTask}
                    projectMembers={mockProjectMembers}
                />
            )}

            {isCommentsOpen && taskForComments && (
                <CommentSection
                    task={taskForComments}
                    onClose={() => {
                        setIsCommentsOpen(false);
                        setTaskForComments(null);
                    }}
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

export default TaskBoard;
