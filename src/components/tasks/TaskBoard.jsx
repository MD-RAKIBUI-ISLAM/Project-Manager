// src/pages/Tasks/TaskBoard.jsx

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import {
    initialTasks,
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
    // role এখন AuthContext-এর explicit state থেকে আসবে, যা খুবই নির্ভরযোগ্য।
    const { user, role } = useAuth();

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

    // টাস্ক স্ট্যাটাস পরিবর্তন হ্যান্ডলার (FR-12)
    const handleStatusChange = (taskId, newStatusValue) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatusValue } : t))
        );
    };

    // নতুন টাস্ক তৈরি বা এডিট করা ডেটা সেভ করার ফাংশন (FR-10)
    const handleSaveTask = (taskData, isEditing) => {
        const assignee =
            mockProjectMembers.find((m) => m.id === Number(taskData.assigneeId))?.name ||
            'Unassigned';

        if (isEditing) {
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData, assignee } : t))
            );
        } else {
            const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
            const newTask = {
                ...taskData,
                id: newId,
                projectId: 1,
                status: 'back_log',
                assignee
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

    // Filter এবং Sort করা টাস্কগুলো পেতে useMemo ব্যবহার করা হলো
    const filteredAndSortedTasks = useMemo(() => {
        // যদি user বা role লোড না হয়, তবে sorting করে সব টাস্ক দেখান
        if (!user || !role) {
            return tasks.sort((a, b) => {
                if (filters.sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
                return 0;
            });
        }

        let filtered = tasks;

        // --- রোল-ভিত্তিক ফিল্টারিং লজিক ---

        // ১. যদি ইউজার 'admin' বা 'project_manager' হয় (সবাইকে দেখান)
        const isManagerOrAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.PROJECT_MANAGER;

        // ২. যদি Manager বা Admin না হয় (শুধু নিজেকে অ্যাসাইন করা কাজ দেখান)
        if (!isManagerOrAdmin) {
            // ✅ FIX: ডেটা টাইপ সামঞ্জস্য করার জন্য String() ব্যবহার করা হলো।
            const currentUserId = String(user.id);

            filtered = filtered.filter(
                (t) =>
                    // Task-এর assigneeId-ও String-এ রূপান্তর করে তুলনা করা হলো
                    String(t.assigneeId) === currentUserId
            );
        }
        // --- শেষ রোল-ভিত্তিক ফিল্টারিং লজিক ---

        // Filtering Logic (Existing Logic)
        if (filters.priority) {
            filtered = filtered.filter((t) => t.priority === filters.priority);
        }
        if (filters.assigneeId) {
            // assigneeId ফিল্টারটিও type-safe করা হলো
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

        // Sorting Logic
        return filtered.sort((a, b) => {
            let comparison = 0;
            const sortOrderMultiplier = filters.sortOrder === 'desc' ? -1 : 1;

            if (filters.sortBy === 'dueDate') {
                comparison = new Date(a.dueDate) - new Date(b.dueDate);
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
        <div className="py-6 flex-grow flex flex-col overflow-x-hidden">
            {/* Header: px-6 */}
            <div className="flex justify-between items-center border-b px-6 pb-4 mb-4 flex-shrink-0">
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

            {/* Filter Bar: px-6 */}
            <div className="mb-6 flex-shrink-0 px-6">
                <TaskFilterSort
                    filters={filters}
                    setFilters={setFilters}
                    assignees={mockProjectMembers}
                />
            </div>

            {/* Kanban Board Layout */}
            <div className="flex flex-col space-y-4 pb-4 lg:flex-row lg:space-y-0 lg:space-x-2 lg:flex-grow lg:flex-nowrap">
                {TASK_STATUSES.map((statusObject) => (
                    <div
                        key={statusObject.value}
                        className="w-full lg:flex-1 lg:flex-shrink bg-gray-100 rounded-xl shadow-md border border-gray-200 overflow-y-auto transition duration-300 hover:shadow-lg"
                    >
                        {/* Column Header (Sticky) */}
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

                        {/* Task List Container */}
                        <div className="p-4 space-y-4">
                            {getTasksByStatus(statusObject.value).map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onStatusChange={handleStatusChange}
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

            {/* Task Modal (for Create/Edit) */}
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

            {/* Comment Section Component */}
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
