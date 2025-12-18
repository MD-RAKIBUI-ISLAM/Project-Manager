// src/components/tasks/TaskCard.jsx

import { Briefcase, Clock, Edit, Flag, MessageCircle, User } from 'lucide-react';

import TaskStatusDropdown from './TaskStatusDropdown';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. Data Shape: প্রতিটি 'task' অবজেক্টে অবশ্যই 'id', 'title', 'description', 'priority',
 * 'status', 'assignee', 'assigneeId', 'dueDate', এবং 'projectName' প্রপার্টিগুলো থাকতে হবে।
 * ২. Date Parsing: 'dueDate' স্ট্রিংটি ISO ফরম্যাটে পাঠানো হলে ফ্রন্টএন্ডে ক্যালকুলেশন (isOverdue) সহজ হয়।
 * ৩. Optimization: টাস্ক কার্ড অনেকবার রেন্ডার হয়, তাই অপ্রয়োজনীয় ডাটা এপিআই রেসপন্স থেকে বাদ দিন।
 */

const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
};

function TaskCard({ task, onEdit, onStatusChange, onCommentClick }) {
    const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

    // Due Date Color Logic
    // @BACKEND_NOTE: 'task.dueDate' এবং বর্তমান সময়ের তুলনা করে ওভারডিউ কি না তা বের করা হচ্ছে।
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600';

    const projectNameDisplay = task.projectName || 'No Project Assigned';

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition duration-200 cursor-grab">
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
                {/* Status Dropdown */}
                {/* @BACKEND_NOTE: এই কম্পোনেন্ট থেকে PATCH রিকোয়েস্ট ট্রিগার হবে স্ট্যাটাস বদলানোর জন্য। */}
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
                    {/* Comment Button */}
                    {/* @BACKEND_NOTE: এটি ক্লিক করলে 'taskId' অনুযায়ী কমেন্ট ফেচ করার এন্ডপয়েন্ট কল হবে। */}
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
