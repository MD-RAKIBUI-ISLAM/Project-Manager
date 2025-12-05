// File: src/components/tasks/TaskFilterSortBar.jsx
import { useState } from 'react';

// মকড অপশনস (constants.js থেকে আসা উচিত)
const STATUS_OPTIONS = ['To Do', 'In Progress', 'Blocked', 'Done', 'All'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low', 'All'];
const SORT_OPTIONS = ['Due Date (Asc)', 'Due Date (Desc)', 'Priority (High to Low)'];

function TaskFilterSortBar({ onFilterChange, onSortChange }) {
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [sortBy, setSortBy] = useState('Due Date (Asc)');

    // ফিল্টার পরিবর্তনের হ্যান্ডলার
    const handleFilterChange = (setter, value) => {
        setter(value);
        // এই লজিকটি পরে ProjectListPage.jsx এ onFilterChange ফাংশনের মাধ্যমে পাস করা হবে
        if (onFilterChange) {
            // মকড কল
            onFilterChange({ status: value, priority: filterPriority });
        }
    };

    // সর্টিং পরিবর্তনের হ্যান্ডলার
    const handleSortChange = (value) => {
        setSortBy(value);
        if (onSortChange) {
            // মকড কল
            onSortChange(value);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
                {/* স্ট্যাটাস ফিল্টার */}
                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="filterStatus"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        স্ট্যাটাস:
                    </label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => handleFilterChange(setFilterStatus, e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* প্রায়োরিটি ফিল্টার */}
                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="filterPriority"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        প্রায়োরিটি:
                    </label>
                    <select
                        id="filterPriority"
                        value={filterPriority}
                        onChange={(e) => handleFilterChange(setFilterPriority, e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {PRIORITY_OPTIONS.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                </div>

                {/* সর্ট বাই */}
                <div className="flex items-center space-x-2 ml-auto">
                    <label
                        htmlFor="sortBy"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        সর্ট করুন:
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default TaskFilterSortBar;
