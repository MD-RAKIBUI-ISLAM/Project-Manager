// File: src/pages/Tasks/TaskFilterSort.jsx

import { Search } from 'lucide-react';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. Query Parameters: ফ্রন্টএন্ড থেকে ফিল্টার এবং সর্ট করার সময় এই প্যারামিটারগুলো
 * এপিআইতে পাঠানো উচিত। যেমন: GET /api/tasks?priority=high&assigneeId=5&search=bug&sort=dueDate&order=asc
 * ২. Server-side Filtering: বড় ডাটাসেটের ক্ষেত্রে ফ্রন্টএন্ডে ফিল্টার না করে সরাসরি
 * ডাটাবেজ কুয়েরিতে (WHERE clause) ফিল্টার করা পারফরম্যান্সের জন্য ভালো।
 */

const PRIORITY_MAP = {
    High: 'high',
    Medium: 'medium',
    Low: 'low',
    All: null
};

const SORT_OPTIONS_MAP = {
    'Due Date (Oldest First)': { sortBy: 'dueDate', sortOrder: 'asc' },
    'Due Date (Newest First)': { sortBy: 'dueDate', sortOrder: 'desc' },
    'Priority (High to Low)': { sortBy: 'priority', sortOrder: 'desc' },
    'Title (A-Z)': { sortBy: 'title', sortOrder: 'asc' }
};

const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'];
const SORT_OPTIONS_LABELS = Object.keys(SORT_OPTIONS_MAP);

function TaskFilterSortBar({ filters, setFilters, assignees }) {
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: key === 'priority' ? PRIORITY_MAP[value] : value
        }));
    };

    const handleSortChange = (value) => {
        const sortDetails = SORT_OPTIONS_MAP[value];
        if (sortDetails) {
            setFilters((prev) => ({
                ...prev,
                sortBy: sortDetails.sortBy,
                sortOrder: sortDetails.sortOrder
            }));
        }
    };

    const currentSortLabel =
        SORT_OPTIONS_LABELS.find((label) => {
            const detail = SORT_OPTIONS_MAP[label];
            return detail.sortBy === filters.sortBy && detail.sortOrder === filters.sortOrder;
        }) || SORT_OPTIONS_LABELS[0];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
                {/* Search Bar */}
                <div className="relative w-full max-w-xs flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Task Title / Description Search..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Priority Filter */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <label
                        htmlFor="filterPriority"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        Priority:
                    </label>
                    <select
                        id="filterPriority"
                        value={
                            Object.keys(PRIORITY_MAP).find(
                                (key) => PRIORITY_MAP[key] === filters.priority
                            ) || 'All'
                        }
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {PRIORITY_OPTIONS.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assignee Filter */}
                {/* @BACKEND_NOTE: 'assigneeId' ফরেন কি হিসেবে কাজ করবে। */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <label
                        htmlFor="filterAssignee"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        Assignee:
                    </label>
                    <select
                        id="filterAssignee"
                        value={filters.assigneeId || 'All'}
                        onChange={(e) =>
                            handleFilterChange(
                                'assigneeId',
                                e.target.value === 'All' ? null : Number(e.target.value)
                            )
                        }
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="All">All Assignees</option>
                        {assignees.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2 ml-auto flex-shrink-0">
                    <label
                        htmlFor="sortBy"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        Sort By:
                    </label>
                    <select
                        id="sortBy"
                        value={currentSortLabel}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {SORT_OPTIONS_LABELS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Button */}
                <button
                    type="button"
                    onClick={() =>
                        setFilters({
                            priority: null,
                            assigneeId: null,
                            searchTerm: '',
                            sortBy: 'dueDate',
                            sortOrder: 'asc'
                        })
                    }
                    className="p-2 text-sm text-gray-600 hover:text-red-500 transition duration-150"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default TaskFilterSortBar;
