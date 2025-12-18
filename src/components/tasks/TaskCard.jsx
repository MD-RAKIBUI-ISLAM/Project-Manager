import { Briefcase, Check, Clock, Edit, Flag, MessageCircle, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';

import TaskStatusDropdown from './TaskStatusDropdown';

const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
};

function TaskCard({ task, onEdit, onStatusChange, onCommentClick, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600';
    const projectNameDisplay = task.projectName || 'No Project Assigned';

    return (
        /* ড্রপডাউন দেখানোর জন্য overflow-hidden সরিয়ে relative রাখা হয়েছে */
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition duration-200 relative">
            {/* Inline Confirmation Overlay - rounded-lg যোগ করা হয়েছে যাতে বর্ডার রেডিয়াস ঠিক থাকে */}
            {isDeleting && (
                <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-2 text-center rounded-lg animate-in fade-in duration-200">
                    <p className="text-sm font-bold text-gray-800 mb-3">Delete this task?</p>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                onDelete(task.id); // এখন এটা সরাসরি ডিলিট করবে
                                setIsDeleting(false);
                            }}
                            className="flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition"
                        >
                            <Check className="w-3 h-3 mr-1" /> Confirm
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDeleting(false)}
                            className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-300 transition"
                        >
                            <X className="w-3 h-3 mr-1" /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-semibold text-gray-800 leading-tight pr-4 truncate">
                    {task.title}
                </h3>
                <div className="flex space-x-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition hover:bg-indigo-50 rounded"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsDeleting(true)}
                        className="p-1 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center text-xs text-gray-600 mb-2">
                <Briefcase className="w-3 h-3 mr-1 text-indigo-500 flex-shrink-0" />
                <span className="font-medium truncate">{projectNameDisplay}</span>
            </div>

            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>

            <div className="flex items-center flex-wrap gap-2 mb-3">
                <TaskStatusDropdown
                    currentStatus={task.status}
                    taskId={task.id}
                    onStatusChange={onStatusChange}
                />
                <span
                    className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${priorityInfo}`}
                >
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-700 w-1/2 min-w-0">
                    <User className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                    <span
                        className="w-full truncate overflow-hidden whitespace-nowrap"
                        title={task.assignee}
                    >
                        {task.assignee}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCommentClick(task);
                        }}
                        className="text-gray-400 hover:text-indigo-600 transition p-1 rounded hover:bg-indigo-50"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>
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
