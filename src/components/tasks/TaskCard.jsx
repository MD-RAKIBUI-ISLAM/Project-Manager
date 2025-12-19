// src/pages/Tasks/TaskCard.jsx

import { Briefcase, Check, Clock, Edit, Flag, MessageCircle, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { mockProjectMembers } from '../../utils/constants'; // constants থেকে মেম্বার ডাটা ইম্পোর্ট
import TaskStatusDropdown from './TaskStatusDropdown';

const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
};

function TaskCard({ task, onEdit, onStatusChange, onCommentClick, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    // এসাইনি ডাটা খুঁজে বের করা (ইমেজ এর জন্য)
    const assigneeData = mockProjectMembers.find((m) => String(m.id) === String(task.assigneeId));

    const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600';
    const projectNameDisplay = task.projectName || 'No Project Assigned';

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition duration-200 relative">
            {/* Inline Confirmation Overlay */}
            {isDeleting && (
                <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-2 text-center rounded-xl animate-in fade-in duration-200">
                    <p className="text-sm font-bold text-gray-800 mb-3">Delete this task?</p>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                onDelete(task.id);
                                setIsDeleting(false);
                            }}
                            className="flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                        >
                            <Check className="w-3 h-3 mr-1" /> Confirm
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDeleting(false)}
                            className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300 transition"
                        >
                            <X className="w-3 h-3 mr-1" /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <h3
                    className="text-md font-bold text-gray-800 leading-tight pr-4 truncate"
                    title={task.title}
                >
                    {task.title}
                </h3>
                <div className="flex space-x-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition hover:bg-indigo-50 rounded-lg"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsDeleting(true)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center text-[11px] text-gray-500 mb-2 uppercase tracking-wider font-semibold">
                <Briefcase className="w-3 h-3 mr-1 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{projectNameDisplay}</span>
            </div>

            <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                {task.description}
            </p>

            <div className="flex items-center flex-wrap gap-2 mb-4">
                <TaskStatusDropdown
                    currentStatus={task.status}
                    taskId={task.id}
                    onStatusChange={onStatusChange}
                />
                <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityInfo}`}
                >
                    <Flag className="w-2.5 h-2.5 mr-1" />
                    {task.priority.toUpperCase()}
                </span>
            </div>

            {/* Footer - Updated with Assignee Image */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2 min-w-0">
                    <div className="h-7 w-7 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-indigo-50 flex items-center justify-center">
                        {assigneeData?.image ? (
                            <img
                                src={assigneeData.image}
                                alt={task.assignee}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-[10px] font-bold text-indigo-600">
                                {task.assignee?.charAt(0)}
                            </span>
                        )}
                    </div>
                    <span
                        className="text-xs font-semibold text-gray-700 truncate"
                        title={task.assignee}
                    >
                        {task.assignee}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCommentClick(task);
                        }}
                        className="text-gray-400 hover:text-indigo-600 transition p-1.5 rounded-lg hover:bg-indigo-50 relative"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                        <Clock className={`w-3 h-3 mr-1 ${dueDateClass}`} />
                        <span className={`text-[10px] ${dueDateClass}`}>{task.dueDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
