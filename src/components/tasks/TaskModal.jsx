// src/components/tasks/TaskModal.jsx

import { X } from 'lucide-react';
import { useState } from 'react';

import { TASK_PRIORITIES } from '../../utils/constants';
import Button from '../common/Button';

// Mock Users Data for assignment (TaskBoard.jsx থেকে পাস করা হবে)
const mockUsers = [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
    { id: 3, name: 'Eve Adams' }
];

// ✅ NEW: Mock Projects Data for selection - এটি ProjectListPage.jsx-এর ডেটা স্ট্রাকচার অনুসরণ করে তৈরি
const MOCK_PROJECTS = [
    { id: 1, title: 'TaskMaster Core Backend' },
    { id: 2, title: 'Frontend UI/UX Implementation' },
    { id: 3, title: 'Database Migration & Setup' }
];

/**
 * Task Modal Component (FR-11)
 * Used for creating new tasks or editing existing tasks.
 *
 * @param {object} props - Component props
 * @param {object|null} props.task - The task object for editing, or null for creation.
 * @param {function} props.onClose - Handler to close the modal.
 * @param {function} props.onSave - Handler to save the task data.
 * @param {Array} props.projectMembers - List of users who can be assigned the task.
 * @param {Array} props.availableProjects - List of available projects. (NEW)
 */
function TaskModal({
    task,
    onClose,
    onSave,
    projectMembers = mockUsers,
    availableProjects = MOCK_PROJECTS
}) {
    const isEditing = !!task;

    // Default values
    const defaultPriority = TASK_PRIORITIES[0]?.value || 'medium';
    const defaultAssigneeId = projectMembers[0]?.id || '';
    // ✅ Change 1: Set default project ID
    const defaultProjectId = availableProjects[0]?.id || '';

    // Form States - task থাকলে সেই ডেটা দিয়ে ইনিশিয়ালাইজ করা
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState(task?.priority || defaultPriority);
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [assignedUser, setAssignedUser] = useState(task?.assigneeId || defaultAssigneeId);
    // ✅ Change 2: Project ID state যোগ করা হলো
    const [projectId, setProjectId] = useState(task?.projectId || defaultProjectId);

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Change 3: Project ID validation যোগ করা হলো
        if (!title || !priority || !assignedUser || !dueDate || !projectId) {
            alert('Title, Priority, Assignee, Due Date, and Project are required.');
            return;
        }

        // Assumes assignedUser is the ID (number)
        const assigneeName =
            projectMembers.find((m) => m.id === Number(assignedUser))?.name || 'Unassigned';

        // ✅ Change 4: Project Name খুঁজে বের করা হলো (ProjectListPage-এর ডেটা অনুযায়ী 'title' ব্যবহার করা হলো)
        const projectName =
            availableProjects.find((p) => p.id === Number(projectId))?.title || 'Unknown Project';

        const taskData = {
            title,
            description,
            priority,
            dueDate,
            assigneeId: Number(assignedUser),
            assignee: assigneeName,
            // ✅ Change 5: Project ID and Name যোগ করা হলো
            projectId: Number(projectId),
            projectName
        };

        // If Editing, include the task ID and existing status
        if (isEditing) {
            taskData.id = task.id;
            taskData.status = task.status;
        }

        onSave(taskData, isEditing);
    };

    return (
        // Modal Overlay (FR-11)
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* ✅ Change 6: Project Selection (New Field) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Project <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                required
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            >
                                {/* if there is no default project, show a disabled option */}
                                {!projectId && (
                                    <option value="" disabled>
                                        Select Project
                                    </option>
                                )}
                                {availableProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}{' '}
                                        {/* Use project.title based on ProjectListPage.jsx */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority (FR-15) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            >
                                {TASK_PRIORITIES.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Due Date (FR-10) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Due Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Assigned User (FR-10) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Assign To <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={assignedUser}
                                onChange={(e) => setAssignedUser(e.target.value)}
                                required
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            >
                                {projectMembers.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditing ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
