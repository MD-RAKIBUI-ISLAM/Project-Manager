// src/pages/Tasks/TaskBoard.jsx

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react'; // useMemo import করা হলো

import { TASK_STATUSES } from '../../utils/constants';
import Button from '../common/Button';
import CommentSection from './CommentSection'; // CommentSection কম্পোনেন্ট import করা হলো (FR-14)
import TaskCard from './TaskCard';
import TaskFilterSort from './TaskFilterSortBar'; // TaskFilterSort কম্পোনেন্ট import করা হলো
import TaskModal from './TaskModal';

// --- MOCK DATA ---
// Mock Task Data Structure (using 'value' from constants)
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
// Mock Project Members (UserManagementPage থেকে নেওয়া)
const mockProjectMembers = [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
    { id: 3, name: 'Eve Adams' }
];
// --- END MOCK DATA ---

// Helper for Priority Sorting (for FR-15)
const PRIORITY_ORDER = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
};

function TaskBoard() {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // 1. ✅ Filter/Sort State যোগ করা হলো (FR-15)
    const [filters, setFilters] = useState({
        priority: null,
        assigneeId: null,
        searchTerm: '',
        sortBy: 'dueDate',
        sortOrder: 'asc'
    });

    // 2. ✅ Comment Section State যোগ করা হলো (FR-14)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [taskForComments, setTaskForComments] = useState(null);

    // টাস্ক স্ট্যাটাস পরিবর্তন হ্যান্ডলার (FR-12)
    const handleStatusChange = (taskId, newStatusValue) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatusValue } : t))
        );
        // NOTE: Real app would trigger Notification System (FR-13, FR-16) here
    };

    // নতুন টাস্ক তৈরি বা এডিট করা ডেটা সেভ করার ফাংশন (FR-10)
    const handleSaveTask = (taskData, isEditing) => {
        // Assignee name find
        const assignee =
            mockProjectMembers.find((m) => m.id === Number(taskData.assigneeId))?.name ||
            'Unassigned';

        if (isEditing) {
            // Edit Logic
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData, assignee } : t))
            );
        } else {
            // Create Logic (Mock ID generation)
            const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
            const newTask = {
                ...taskData,
                id: newId,
                projectId: 1, // Default project for now (Should be dynamic)
                status: 'to_do',
                assignee
            };
            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    // Edit Modal ওপেন করার ফাংশন (FR-14 - Task Edit)
    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    // ✅ Comment Handler (FR-14)
    const handleOpenComments = (task) => {
        setTaskForComments(task);
        setIsCommentsOpen(true);
    };

    // 3. ✅ Filter এবং Sort করা টাস্কগুলো পেতে useMemo ব্যবহার করা হলো (FR-15)
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks;

        // 3.1 Filtering Logic
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

        // 3.2 Sorting Logic
        return filtered.sort((a, b) => {
            let comparison = 0;
            const sortOrderMultiplier = filters.sortOrder === 'desc' ? -1 : 1;

            if (filters.sortBy === 'dueDate') {
                comparison = new Date(a.dueDate) - new Date(b.dueDate);
            } else if (filters.sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (filters.sortBy === 'priority') {
                // Custom Priority sorting logic
                comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            }

            return comparison * sortOrderMultiplier;
        });
    }, [tasks, filters]);

    // Filtered and Sorted list থেকে স্ট্যাটাস অনুযায়ী টাস্কগুলো ফিল্টার করা
    const getTasksByStatus = (statusValue) =>
        filteredAndSortedTasks.filter((t) => t.status === statusValue);

    return (
        <div className="p-6 h-full flex flex-col">
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

            {/* 4. ✅ TaskFilterSort কম্পোনেন্ট ইন্টিগ্রেট করা হলো (FR-15) */}
            <div className="mb-6 flex-shrink-0">
                <TaskFilterSort
                    filters={filters}
                    setFilters={setFilters}
                    assignees={mockProjectMembers} // Assignees list পাস করা হলো
                />
            </div>

            {/* Kanban Board Layout (FR-15 - Filtering/Sorting) */}
            <div className="flex flex-grow overflow-x-auto pb-4 -mx-2">
                {TASK_STATUSES.map((statusObject) => (
                    <div
                        key={statusObject.value}
                        className="flex-shrink-0 w-80 mx-2 bg-gray-100 rounded-xl shadow-md border border-gray-200 overflow-y-auto transition duration-300 hover:shadow-lg"
                        style={{ height: 'calc(100vh - 230px)' }} // Adjusted height for FilterSort bar
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
                                    onCommentClick={handleOpenComments} // ✅ নতুন প্রপ
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

            {/* 5. ✅ Comment Section Component ইন্টিগ্রেট করা হলো (FR-14) */}
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
