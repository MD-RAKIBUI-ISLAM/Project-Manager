// src/pages/Dashboard/DashboardPage.jsx

import { Bell, Briefcase, ListTodo, User } from 'lucide-react'; // Example icons

import useAuth from '../../hooks/useAuth';

// ড্যাশবোর্ডের জন্য স্ট্যাটিক কার্ড ডেটা
const statsData = [
    { icon: Briefcase, title: 'Total Projects', value: '12', color: 'bg-indigo-500' },
    { icon: ListTodo, title: 'Tasks Assigned', value: '45', color: 'bg-green-500' },
    { icon: User, title: 'Team Members', value: '8', color: 'bg-yellow-500' },
    { icon: Bell, title: 'Pending Notifications', value: '3', color: 'bg-red-500' }
];

// একটি সাধারণ স্ট্যাট কার্ড কম্পোনেন্ট
function StatCard({ icon: Icon, title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 text-white ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    );
}

function DashboardPage() {
    const { user } = useAuth(); // Auth context থেকে ইউজারের নাম নিয়ে আসা

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <h1 className="text-4xl font-extrabold text-gray-800 border-b pb-4">
                Welcome Back, {user?.full_name || 'User'}!
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Placeholder for Task/Project lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Tasks (Placeholder) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Recent Tasks & Updates</h2>
                    <p className="mt-4 text-gray-500">
                        Task list visualization will be implemented here (FR-2).
                    </p>
                </div>

                {/* Notifications/Activity (Placeholder) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Activity Log</h2>
                    <p className="mt-4 text-gray-500">
                        Recent user activities will appear here (NFR-8).
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
