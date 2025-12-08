// src/components/tasks/TaskCard.jsx

import { Briefcase, Clock, Edit, Flag, MessageCircle, User } from 'lucide-react'; // ✅ Briefcase যোগ করা হলো

import TaskStatusDropdown from './TaskStatusDropdown';

// প্রায়োরিটি স্টাইল ম্যাপ
const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
};

// ✅ onCommentClick prop যোগ করা হলো
function TaskCard({ task, onEdit, onStatusChange, onCommentClick }) {
    const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

    // Due Date Color Logic
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600';

    // Fallback for projectName if it somehow wasn't set during creation
    const projectNameDisplay = task.projectName || 'No Project Assigned';

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

            {/* ✅ Project Name Display (New) */}
            <div
                className="flex items-center text-xs text-gray-600 mb-2"
                title={projectNameDisplay}
            >
                <Briefcase className="w-3 h-3 mr-1 text-indigo-500 flex-shrink-0" />
                <span className="font-medium truncate">{projectNameDisplay}</span>
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

            {/* Footer: Assignee, Comment Button, and Due Date */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                {/* Assignee Information (FIXED OVERFLOW) */}
                <div className="flex items-center text-sm text-gray-700 w-1/2 min-w-0">
                    <User className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                    <span
                        className="w-full truncate overflow-hidden whitespace-nowrap"
                        title={task.assignee}
                    >
                        {task.assignee}
                    </span>
                </div>

                {/* Comment Button (FR-14) & Due Date Group */}
                <div className="flex items-center space-x-3">
                    {/* ✅ Comment Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents card-level click events from interfering
                            onCommentClick(task);
                        }}
                        className="text-gray-400 hover:text-indigo-600 transition p-1 rounded hover:bg-indigo-50"
                        title="View Comments"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>

                    {/* Due Date */}
                    <div className="flex items-center text-sm">
                        <Clock className={`w-4 h-4 mr-1 ${dueDateClass}`} />
                        <span className={`text-xs ${dueDateClass}`}>{task.dueDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
