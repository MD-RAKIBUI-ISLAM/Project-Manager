// src/pages/Tasks/TaskBoard.jsx (Reverting path and adjusting imports)

import { Plus } from 'lucide-react';
import { useState } from 'react';

// ✅ Adjusted import paths for pages/Tasks location
import { TASK_STATUSES } from '../../utils/constants';
import Button from '../common/Button';
import TaskCard from './TaskCard';
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

function TaskBoard() {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null); // Edit এর জন্য

    // টাস্ক স্ট্যাটাস পরিবর্তন হ্যান্ডলার (TaskStatusDropdown থেকে কল করা হবে)
    const handleStatusChange = (taskId, newStatusValue) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatusValue } : t))
        );
    };

    // নতুন টাস্ক তৈরি বা এডিট করা ডেটা সেভ করার ফাংশন (FR-11)
    const handleSaveTask = (taskData, isEditing) => {
        // Assignee name find
        const assignee =
            mockProjectMembers.find((m) => m.id === Number(taskData.assigneeId))?.name ||
            'Unassigned';

        if (isEditing) {
            // Edit Logic: taskData তে id এবং status আছে
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData, assignee } : t))
            );
            // NOTE: In a real app, use a custom modal instead of alert
            // alert(`Task ${taskData.title} updated successfully!`);
        } else {
            // Create Logic (Mock ID generation)
            const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
            const newTask = {
                ...taskData,
                id: newId,
                projectId: 1, // Default project for now
                status: 'to_do', // New tasks start as 'to_do'
                assignee
            };
            setTasks((prevTasks) => [...prevTasks, newTask]);
            // NOTE: In a real app, use a custom modal instead of alert
            // alert(`Task ${newTask.title} created successfully!`);
        }
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    // Edit Modal ওপেন করার ফাংশন
    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    // টাস্ক স্ট্যাটাস অনুযায়ী কলামে ফিল্টার করা
    const getTasksByStatus = (statusValue) => tasks.filter((t) => t.status === statusValue);

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-4 mb-6 flex-shrink-0">
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

            {/* Kanban Board Layout (FR-15 - Filtering/Sorting) */}
            <div className="flex flex-grow overflow-x-auto pb-4 -mx-2">
                {/* TASK_STATUSES array এর প্রতিটি অবজেক্ট এর জন্য একটি কলাম তৈরি করা */}
                {TASK_STATUSES.map((statusObject) => (
                    <div
                        key={statusObject.value}
                        // Improved Column Styling for better aesthetics and clear separation
                        className="flex-shrink-0 w-80 mx-2 bg-gray-100 rounded-xl shadow-md border border-gray-200 overflow-y-auto transition duration-300 hover:shadow-lg"
                        style={{ height: 'calc(100vh - 160px)' }} // Responsive Height
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
                            {/* NOTE: Task Card Design Fix:
                                'TaskCard.jsx' ফাইলে গিয়ে assignee/user-এর নাম overflow 
                                ফিক্স করতে হবে। সেখানে text-ellipsis, overflow-hidden 
                                এবং whitespace-nowrap ক্লাসগুলো ব্যবহার করুন। */}
                            {getTasksByStatus(statusObject.value).map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onStatusChange={handleStatusChange}
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
                    projectMembers={mockProjectMembers} // Mock data passed
                />
            )}
        </div>
    );
}

export default TaskBoard;
