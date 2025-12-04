import { CheckCircle, ChevronDown, Clock, PauseCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

import { TASK_STATUSES } from '../../utils/constants';

// স্ট্যাটাসের রঙ এবং আইকন ম্যাপ
const statusStyles = {
    to_do: { icon: Clock, color: 'text-gray-600 bg-gray-100', dot: 'bg-gray-500' },
    in_progress: { icon: PauseCircle, color: 'text-blue-600 bg-blue-100', dot: 'bg-blue-500' },
    blocked: { icon: XCircle, color: 'text-red-600 bg-red-100', dot: 'bg-red-500' },
    done: { icon: CheckCircle, color: 'text-green-600 bg-green-100', dot: 'bg-green-500' }
};

// স্ট্যাটাস পরিবর্তনের জন্য ড্রপডাউন কম্পোনেন্ট
function TaskStatusDropdown({ currentStatus, taskId, onStatusChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const statusInfo = statusStyles[currentStatus] || statusStyles.to_do;
    const Icon = statusInfo.icon;

    const handleSelectStatus = (newStatusValue) => {
        onStatusChange(taskId, newStatusValue);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left z-20">
            <button
                type="button"
                className={`inline-flex justify-center items-center w-full rounded-full border border-gray-300 shadow-sm px-3 py-1 text-sm font-medium focus:outline-none transition duration-150 ease-in-out ${statusInfo.color}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Icon className="w-4 h-4 mr-1.5" />
                {TASK_STATUSES.find((s) => s.value === currentStatus)?.label || 'Status'}
                <ChevronDown className="-mr-1 ml-1 h-4 w-4" />
            </button>

            {isOpen && (
                <div
                    className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        {TASK_STATUSES.map((status) => {
                            const IconItem = statusStyles[status.value].icon;
                            return (
                                <button
                                    type="button"
                                    key={status.value}
                                    onClick={() => handleSelectStatus(status.value)}
                                    className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${status.value === currentStatus ? 'font-bold bg-gray-50' : ''}`}
                                    role="menuitem"
                                >
                                    <IconItem
                                        className={`w-4 h-4 mr-3 ${statusStyles[status.value].dot.replace('bg-', 'text-')}`}
                                    />
                                    {status.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskStatusDropdown;
