// src/pages/Tasks/TaskBoard.jsx

import { AlertTriangle, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

// ✅ Activity, Auth এবং Notification Context ইমপোর্ট করা হলো
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext'; // নতুন যোগ করা হয়েছে
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
    const { addNotification } = useNotifications(); // ✅ নোটিফিকেশন ফাংশন কল করা হলো

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
        sortOrder: 'asc'
    });

    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [taskForComments, setTaskForComments] = useState(null);

    const handleOpenDeleteModal = (taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    // ✅ ডিলিট নোটিফিকেশন ইন্টিগ্রেটেড
    const confirmDeleteTask = () => {
        if (taskToDelete) {
            const actorName = user?.name || 'User';
            logActivity(actorName, 'deleted task', taskToDelete?.title || 'Unknown Task');

            // Notification
            addNotification(actorName, 'deleted task', taskToDelete?.title);

            setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    // ✅ স্ট্যাটাস চেঞ্জ নোটিফিকেশন ইন্টিগ্রেটেড
    const handleStatusChange = (taskId, newStatusValue) => {
        const task = tasks.find((t) => t.id === taskId);
        const statusLabel =
            TASK_STATUSES.find((s) => s.value === newStatusValue)?.label || newStatusValue;

        const actorName = user?.name || 'User';
        logActivity(actorName, `moved task to ${statusLabel}`, task?.title || 'Task');

        // Notification
        addNotification(actorName, `moved task to ${statusLabel}`, task?.title);

        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatusValue } : t))
        );
    };

    // ✅ সেভ/ক্রিয়েট নোটিফিকেশন ইন্টিগ্রেটেড
    const handleSaveTask = (taskData, isEditing) => {
        const assignee =
            mockProjectMembers.find((m) => m.id === Number(taskData.assigneeId))?.name ||
            'Unassigned';

        const actorName = user?.name || 'User';

        if (isEditing) {
            logActivity(actorName, 'updated task', taskData.title);

            // Notification
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

            // Notification
            addNotification(actorName, 'assigned a new task', taskData.title);

            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    // --- বাকি লজিক এবং রেন্ডারিং সেম থাকবে (FilteredAndSorted, Render Return ইত্যাদি) ---
    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleOpenComments = (task) => {
        setTaskForComments(task);
        setIsCommentsOpen(true);
    };

    const filteredAndSortedTasks = useMemo(() => {
        if (!user || !role) {
            return tasks.sort((a, b) => {
                if (filters.sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
                return 0;
            });
        }

        let filtered = tasks;
        const isManagerOrAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.PROJECT_MANAGER;

        if (!isManagerOrAdmin) {
            const currentUserId = String(user.id);
            filtered = filtered.filter((t) => String(t.assigneeId) === currentUserId);
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
                comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            }

            return comparison * sortOrderMultiplier;
        });
    }, [tasks, filters, user, role]);

    const getTasksByStatus = (statusValue) =>
        filteredAndSortedTasks.filter((t) => t.status === statusValue);

    return (
        <div className="py-6 flex-grow flex flex-col overflow-x-hidden px-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Task Board (Kanban)</h1>
                <Button
                    variant="primary"
                    size="md"
                    className="space-x-2"
                    onClick={() => {
                        setTaskToEdit(null);
                        setIsModalOpen(true);
                    }}
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Task</span>
                </Button>
            </div>

            <div className="mb-6 flex-shrink-0">
                <TaskFilterSort
                    filters={filters}
                    setFilters={setFilters}
                    assignees={mockProjectMembers}
                />
            </div>

            <div className="flex flex-col space-y-4 pb-4 lg:flex-row lg:space-y-0 lg:space-x-2 lg:flex-grow lg:flex-nowrap">
                {TASK_STATUSES.map((statusObject) => (
                    <div
                        key={statusObject.value}
                        className="w-full lg:flex-1 lg:flex-shrink bg-gray-100 rounded-xl shadow-md border border-gray-200 overflow-y-auto transition duration-300 hover:shadow-lg"
                    >
                        <div className="sticky top-0 bg-gray-100 p-4 border-b border-gray-300 z-10 rounded-t-xl">
                            <h2
                                className={`text-lg font-bold flex justify-between items-center ${statusObject.tailwindColor || 'text-gray-700'}`}
                            >
                                <span>{statusObject.label}</span>
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    {getTasksByStatus(statusObject.value).length}
                                </span>
                            </h2>
                        </div>

                        <div className="p-4 space-y-4">
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
                <CommentSection task={taskForComments} onClose={() => setIsCommentsOpen(false)} />
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
