import { Clock, Edit, Flag, User } from 'lucide-react';

import TaskStatusDropdown from './TaskStatusDropdown'; // Adjusted import path

// প্রায়োরিটি স্টাইল ম্যাপ
const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
};

function TaskCard({ task, onEdit, onStatusChange }) {
    const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

    // Due Date Color Logic
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600';

    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition duration-200 cursor-grab"
            // Drag and Drop implementation would be added here
        >
            {/* Header: Title and Edit Button */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-semibold text-gray-800 leading-tight pr-4">
                    {task.title}
                </h3>
                <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="text-gray-400 hover:text-indigo-600 transition"
                    title="Edit Task"
                >
                    <Edit className="w-4 h-4" />
                </button>
            </div>

            {/* Description (Truncated) */}
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>

            {/* Status, Priority, and Due Date */}
            <div className="flex items-center flex-wrap gap-2 mb-3">
                {/* Status Dropdown */}
                <TaskStatusDropdown
                    currentStatus={task.status}
                    taskId={task.id}
                    onStatusChange={onStatusChange}
                />

                {/* Priority Badge */}
                <span
                    className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${priorityInfo}`}
                >
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </div>

            {/* Footer: Assignee and Due Date */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                {/* Assignee Information (FIXED OVERFLOW) */}
                <div className="flex items-center text-sm text-gray-700 w-1/2 min-w-0">
                    <User className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                    {/* ✅ FIX: w-full min-w-0, overflow-hidden, and truncate ensure the name stays within bounds */}
                    <span
                        className="w-full truncate overflow-hidden whitespace-nowrap"
                        title={task.assignee}
                    >
                        {task.assignee}
                    </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center text-sm ml-2">
                    <Clock className={`w-4 h-4 mr-1 ${dueDateClass}`} />
                    <span className={`text-xs ${dueDateClass}`}>{task.dueDate}</span>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
