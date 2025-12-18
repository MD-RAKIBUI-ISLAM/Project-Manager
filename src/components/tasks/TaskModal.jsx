// src/components/tasks/TaskModal.jsx

import { X } from 'lucide-react';
import { useState } from 'react';

import { useActivity } from '../../context/ActivityContext'; // ✅ লগিং এর জন্য
import { useAuth } from '../../context/AuthContext'; // ✅ ইউজার ইনফোর জন্য
import { INITIAL_PROJECTS, mockProjectMembers, TASK_PRIORITIES } from '../../utils/constants';
import Button from '../common/Button';

/**
 * Task Modal Component (FR-11)
 */
function TaskModal({
    task,
    onClose,
    onSave,
    projectMembers = mockProjectMembers,
    availableProjects = INITIAL_PROJECTS
}) {
    const isEditing = !!task;
    const { user } = useAuth(); // বর্তমানে লগইন থাকা ইউজার
    const { logActivity } = useActivity(); // লগ ফাংশন

    // Default values
    const defaultPriority = TASK_PRIORITIES[0]?.value || 'medium';
    const defaultAssigneeId = projectMembers[0]?.id || '';
    const defaultProjectId = availableProjects[0]?.id || '';

    // Form States
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState(task?.priority || defaultPriority);
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [assignedUser, setAssignedUser] = useState(task?.assigneeId || defaultAssigneeId);
    const [projectId, setProjectId] = useState(task?.projectId || defaultProjectId);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !priority || !assignedUser || !dueDate || !projectId) {
            alert('Title, Priority, Assignee, Due Date, and Project are required.');
            return;
        }

        const assigneeName =
            projectMembers.find((m) => m.id === Number(assignedUser))?.name || 'Unassigned';

        const projectName =
            availableProjects.find((p) => p.id === Number(projectId))?.title || 'Unknown Project';

        const taskData = {
            title,
            description,
            priority,
            dueDate,
            assigneeId: Number(assignedUser),
            assignee: assigneeName,
            projectId: Number(projectId),
            projectName
        };

        if (isEditing) {
            taskData.id = task.id;
            taskData.status = task.status;
        }

        // --- ✅ অ্যাক্টিভিটি লগ যোগ করা হচ্ছে ---
        const actionMessage = isEditing ? 'updated the task' : 'created a new task';
        logActivity(user?.name || 'Unknown User', actionMessage, title);
        // --------------------------------------

        onSave(taskData, isEditing);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg transform transition-all border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="What needs to be done?"
                            className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="2"
                            placeholder="Add some details..."
                            className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Project Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Project <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-white cursor-pointer"
                            >
                                {!projectId && (
                                    <option value="" disabled>
                                        Select Project
                                    </option>
                                )}
                                {availableProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Priority <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-white cursor-pointer"
                            >
                                {TASK_PRIORITIES.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Due Date <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm"
                            />
                        </div>

                        {/* Assigned User */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Assign To <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={assignedUser}
                                onChange={(e) => setAssignedUser(e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-2xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-white cursor-pointer"
                            >
                                {projectMembers.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-50">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="rounded-2xl py-3 order-2 sm:order-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded-2xl py-3 shadow-lg shadow-indigo-200 order-1 sm:order-2"
                        >
                            {isEditing ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
