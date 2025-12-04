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

/**
 * Task Modal Component (FR-11)
 * Used for creating new tasks or editing existing tasks.
 *
 * @param {object} props - Component props
 * @param {object|null} props.task - The task object for editing, or null for creation.
 * @param {function} props.onClose - Handler to close the modal.
 * @param {function} props.onSave - Handler to save the task data.
 * @param {Array} props.projectMembers - List of users who can be assigned the task.
 */
function TaskModal({ task, onClose, onSave, projectMembers = mockUsers }) {
    const isEditing = !!task;

    // Default values
    const defaultPriority = TASK_PRIORITIES[0]?.value || 'medium'; // Default to the first priority (Critical/High)
    const defaultAssigneeId = projectMembers[0]?.id || '';

    // Form States - task থাকলে সেই ডেটা দিয়ে ইনিশিয়ালাইজ করা
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    // Note: Priority values are strings ('low', 'medium', etc.)
    const [priority, setPriority] = useState(task?.priority || defaultPriority);
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    // Assumes assigneeId is stored as a number/string ID
    const [assignedUser, setAssignedUser] = useState(task?.assigneeId || defaultAssigneeId);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !priority || !assignedUser) {
            alert('Title, Priority, and Assignee are required.');
            return;
        }

        // Assumes assignedUser is the ID (number)
        const assigneeName =
            projectMembers.find((m) => m.id === Number(assignedUser))?.name || 'Unassigned';

        const taskData = {
            title,
            description,
            // Ensure priority is the value (e.g., 'high')
            priority,
            dueDate,
            assigneeId: Number(assignedUser),
            assignee: assigneeName
        };

        // If Editing, include the task ID and existing status
        if (isEditing) {
            taskData.id = task.id;
            // Status is generally not edited via this form, but via TaskStatusDropdown
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
                        {/* Due Date (FR-10) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
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
