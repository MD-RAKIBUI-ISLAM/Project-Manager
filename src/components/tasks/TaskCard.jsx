// src/components/tasks/TaskCard.jsx

import { Briefcase, Clock, Edit, Flag, MessageCircle, Trash2, User } from 'lucide-react'; // ✅ Trash2 ইমপোর্ট করা হয়েছে

import TaskStatusDropdown from './TaskStatusDropdown';

const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
};

// ✅ onDelete প্রপটি রিসিভ করা হচ্ছে
function TaskCard({ task, onEdit, onStatusChange, onCommentClick, onDelete }) {
    const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600';

    const projectNameDisplay = task.projectName || 'No Project Assigned';

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition duration-200 cursor-grab">
            {/* Header: Title and Action Buttons */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-semibold text-gray-800 leading-tight pr-4">
                    {task.title}
                </h3>
                <div className="flex space-x-1 flex-shrink-0">
                    {/* Edit Button */}
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition hover:bg-indigo-50 rounded"
                        title="Edit Task"
                    >
                        <Edit className="w-4 h-4" />
                    </button>

                    {/* ✅ Delete Button যোগ করা হয়েছে */}
                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Project Name Display */}
            <div
                className="flex items-center text-xs text-gray-600 mb-2"
                title={projectNameDisplay}
            >
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
                        title="View Comments"
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
