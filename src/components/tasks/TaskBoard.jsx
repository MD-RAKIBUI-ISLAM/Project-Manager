// src/pages/Tasks/TaskBoard.jsx

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

// ✅ Activity এবং Auth Context ইমপোর্ট করা হলো
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
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

function TaskBoard() {
    const { user, role } = useAuth();
    const { logActivity } = useActivity(); // ✅ Activity logger initialization

    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const [filters, setFilters] = useState({
        priority: null,
        assigneeId: null,
        searchTerm: '',
        sortBy: 'dueDate',
        sortOrder: 'asc'
    });

    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [taskForComments, setTaskForComments] = useState(null);

    // ✅ ডিলিট টাস্ক হ্যান্ডলার (অ্যাক্টিভিটি লগসহ)
    const handleDeleteTask = (taskId) => {
        const taskToDelete = tasks.find((t) => t.id === taskId);
        if (window.confirm(`Are you sure you want to delete "${taskToDelete?.title}"?`)) {
            // অ্যাক্টিভিটি লগ
            logActivity(
                user?.name || 'User',
                'deleted task',
                taskToDelete?.title || 'Unknown Task'
            );

            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        }
    };

    // টাস্ক স্ট্যাটাস পরিবর্তন হ্যান্ডলার
    const handleStatusChange = (taskId, newStatusValue) => {
        const task = tasks.find((t) => t.id === taskId);
        const statusLabel =
            TASK_STATUSES.find((s) => s.value === newStatusValue)?.label || newStatusValue;

        // অ্যাক্টিভিটি লগ
        logActivity(user?.name || 'User', `moved task to ${statusLabel}`, task?.title || 'Task');

        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatusValue } : t))
        );
    };

    // সেভ টাস্ক হ্যান্ডলার
    const handleSaveTask = (taskData, isEditing) => {
        const assignee =
            mockProjectMembers.find((m) => m.id === Number(taskData.assigneeId))?.name ||
            'Unassigned';

        if (isEditing) {
            logActivity(user?.name || 'User', 'updated task', taskData.title);
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData, assignee } : t))
            );
        } else {
            logActivity(user?.name || 'User', 'created a new task', taskData.title);
            const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
            const newTask = {
                ...taskData,
                id: newId,
                projectId: 1,
                status: 'back_log',
                assignee,
                assigneeId: String(taskData.assigneeId)
            };
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
                const dateA = a.dueDate
                    ? new Date(a.dueDate)
                    : filters.sortOrder === 'asc'
                      ? new Date(8640000000000000)
                      : new Date(-8640000000000000);
                const dateB = b.dueDate
                    ? new Date(b.dueDate)
                    : filters.sortOrder === 'asc'
                      ? new Date(8640000000000000)
                      : new Date(-8640000000000000);
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
                                    onDelete={handleDeleteTask} // ✅ Delete handler পাঠানো হলো
                                    onCommentClick={handleOpenComments}
                                />
                            ))}
                            {getTasksByStatus(statusObject.value).length === 0 && (
                                <div className="text-center text-sm text-gray-400 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                                    এই স্ট্যাটাসে কোনো টাস্ক নেই।
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <TaskModal
                    task={taskToEdit}
                    onClose={() => {
                        setIsModalOpen(false);
                        setTaskToEdit(null);
                    }}
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
        </div>
    );
}

export default TaskBoard;
