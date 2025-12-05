// File: src/pages/Tasks/TaskFilterSort.jsx (TaskBoard.jsx এর পাশে ধরে নেওয়া হচ্ছে)

import { Search } from 'lucide-react'; // Search আইকন যোগ করা হলো

// ✅ MOCK DATA/CONSTANTS (এই ম্যাপগুলো TaskBoard.jsx এর লজিকের সাথে কাজ করার জন্য জরুরি)
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
// UI এর জন্য অপশন লিস্ট
const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'];
const SORT_OPTIONS_LABELS = Object.keys(SORT_OPTIONS_MAP);

// TaskBoard.jsx থেকে props হিসেবে `filters`, `setFilters` এবং `assignees` পাচ্ছে
function TaskFilterSortBar({ filters, setFilters, assignees }) {
    // 1. ✅ স্ট্যাটাস ফিল্টার বাদ দেওয়া হয়েছে কারণ Kanban Board এ স্ট্যাটাস ডিফল্ট ফিল্টার করা হয়।
    // 2. ✅ Assignee এবং Search বার যোগ করা হয়েছে।

    // ফিল্টার পরিবর্তনের হ্যান্ডলার
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            // Map the UI value to the backend/logic value
            [key]: key === 'priority' ? PRIORITY_MAP[value] : value
        }));
    };

    // সর্টিং পরিবর্তনের হ্যান্ডলার
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

    // UI তে দেখানোর জন্য বর্তমান সর্ট লেবেল খুঁজে বের করা
    const currentSortLabel =
        SORT_OPTIONS_LABELS.find((label) => {
            const detail = SORT_OPTIONS_MAP[label];
            return detail.sortBy === filters.sortBy && detail.sortOrder === filters.sortOrder;
        }) || SORT_OPTIONS_LABELS[0];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
                {/* 3. ✅ Search Bar (Title/Description Filter) */}
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

                {/* 4. ✅ প্রায়োরিটি ফিল্টার (FR-15) */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <label
                        htmlFor="filterPriority"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        Priority:
                    </label>
                    <select
                        id="filterPriority"
                        // Map the lower_snake_case value back to Title Case for UI
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

                {/* 5. ✅ Assignee ফিল্টার (FR-15) */}
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

                {/* 6. ✅ সর্ট বাই ড্রপডাউন (FR-15) */}
                <div className="flex items-center space-x-2 ml-auto flex-shrink-0">
                    <label
                        htmlFor="sortBy"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                        Sort By:
                    </label>
                    <select
                        id="sortBy"
                        value={currentSortLabel} // Mapped label ব্যবহার করা হলো
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

                {/* 7. ✅ Reset Button (অতিরিক্ত কিন্তু দরকারী) */}
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
