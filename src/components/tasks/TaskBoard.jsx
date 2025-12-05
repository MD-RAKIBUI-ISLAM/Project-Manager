// src/pages/Tasks/TaskBoard.jsx

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

// আপনার অন্যান্য কম্পোনেন্ট ইম্পোর্ট
import Button from '../common/Button';
import CommentSection from './CommentSection';
import TaskCard from './TaskCard';
import TaskFilterSort from './TaskFilterSortBar';
import TaskModal from './TaskModal';

// ধরে নেওয়া হলো এই ফাইলগুলি utils/constants.js এ সংজ্ঞায়িত:
const TASK_STATUSES = [
    { label: 'To Do', value: 'to_do', color: 'text-gray-700' },
    { label: 'In Progress', value: 'in_progress', color: 'text-blue-700' },
    { label: 'Blocked', value: 'blocked', color: 'text-red-700' },
    { label: 'Done', value: 'done', color: 'text-green-700' }
];

// --- MOCK DATA ---
const initialTasks = [
    {
        id: 1,
        projectId: 1,
        title: 'Setup React Frontend',
        description: 'Initialize project structure with Tailwind CSS and routing.',
        priority: 'high',
        dueDate: '2025-12-05',
        assigneeId: 1,
        assignee: 'Alice Smith',
        status: 'done'
    },
    {
        id: 2,
        projectId: 1,
        title: 'Implement Auth Pages',
        description: 'Create Login and Register pages (FR-1). Ensure validation.',
        priority: 'critical',
        dueDate: '2025-12-10',
        assigneeId: 2,
        assignee: 'Bob Johnson',
        status: 'in_progress'
    },
    {
        id: 3,
        projectId: 2,
        title: 'Design Task API Model',
        description: 'Define Task and Project models in Django (FR-10).',
        priority: 'medium',
        dueDate: '2025-12-15',
        assigneeId: 1,
        assignee: 'Alice Smith',
        status: 'to_do'
    },
    {
        id: 4,
        projectId: 2,
        title: 'Fix CSS bug on Sidebar',
        description: 'Sidebar is overlapping content on mobile views. Needs investigation.',
        priority: 'low',
        dueDate: '2025-12-12',
        assigneeId: 2,
        assignee: 'Bob Johnson',
        status: 'blocked'
    },
    {
        id: 5,
        projectId: 1,
        title: 'Write Task Management Documentation',
        description: 'Prepare documentation for Task Management module.',
        priority: 'medium',
        dueDate: '2025-12-20',
        assigneeId: 3,
        assignee: 'Eve Adams',
        status: 'to_do'
    }
];
const mockProjectMembers = [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
    { id: 3, name: 'Eve Adams' }
];
const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
// --- END MOCK DATA ---

function TaskBoard() {
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
                status: 'to_do',
                assignee
            };
            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    // Edit Modal ওপেন করার ফাংশন
    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    // Comment Handler
    const handleOpenComments = (task) => {
        setTaskForComments(task);
        setIsCommentsOpen(true);
    };

    // Filter এবং Sort করা টাস্কগুলো পেতে useMemo ব্যবহার করা হলো (FR-15)
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks;

        // Filtering Logic
        if (filters.priority) {
            filtered = filtered.filter((t) => t.priority === filters.priority);
        }
        if (filters.assigneeId) {
            filtered = filtered.filter((t) => t.assigneeId === Number(filters.assigneeId));
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
    }, [tasks, filters]);

    const getTasksByStatus = (statusValue) =>
        filteredAndSortedTasks.filter((t) => t.status === statusValue);

    return (
        // ✅ ফিক্স ১: `flex-grow` নিশ্চিত করে এটি প্যারেন্ট কন্টেইনারের পুরো উপলব্ধ প্রস্থ ব্যবহার করবে।
        // `overflow-x-hidden` কোনো অবাঞ্ছিত ওভারফ্লো আটকায়।
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

            {/* ✅ চূড়ান্ত ফিক্স ২: Kanban Board Layout (Responsive)
                - এই কন্টেইনারে কোনো স্ক্রল ক্লাস নেই।
            */}
            <div className="flex flex-col space-y-4 pb-4 lg:flex-row lg:space-y-0 lg:space-x-2 lg:flex-grow lg:flex-nowrap">
                {TASK_STATUSES.map((statusObject) => (
                    <div
                        key={statusObject.value}
                        // ✅ চূড়ান্ত ফিক্স ৩: `lg:min-w-72` সরিয়ে দেওয়া হয়েছে।
                        // কলামগুলি এখন `flex-1` দ্বারা সমানভাবে তাদের প্যারেন্ট কন্টেইনারের প্রস্থ ভাগ করে নেবে,
                        // ফলে তারা প্যারেন্টের মধ্যে ফিট হয়ে যাবে এবং ওভারফ্লো হবে না।
                        className="w-full lg:flex-1 lg:flex-shrink bg-gray-100 rounded-xl shadow-md border border-gray-200 overflow-y-auto transition duration-300 hover:shadow-lg"
                    >
                        {/* Column Header (Sticky) */}
                        <div className="sticky top-0 bg-gray-100 p-4 border-b border-gray-300 z-10 rounded-t-xl">
                            <h2
                                className={`text-lg font-bold flex justify-between items-center ${statusObject.color || 'text-gray-700'}`}
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
