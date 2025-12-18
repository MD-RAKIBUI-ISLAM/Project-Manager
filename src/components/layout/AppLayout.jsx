// src/layout/AppLayout.jsx

import { Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { SidebarProvider } from '../../context/SidebarContext';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * AppLayout Component
 * * @BACKEND_TEAM_NOTE:
 * 1. এই লেআউটটি শুধুমাত্র Authenticated ইউজারদের জন্য রেন্ডার হয়।
 * 2. 'useAuth' কন্টেক্সট থেকে ইউজার ডাটা (Role, Permissions) পাওয়া যাবে।
 * 3. প্রতিবার পেজ রিফ্রেশ করলে ব্যাকএন্ডে 'GET /api/auth/me' কল করে টোকেন ভ্যালিডেশন
 * এবং ইউজার প্রোফাইল ডাটা সিঙ্ক করার সুপারিশ করা হচ্ছে।
 */
function AppLayout() {
    const { isAuthenticated, user, loading } = useAuth();

    /**
     * @BACKEND_TEAM_NOTE:
     * টোকেন ভ্যালিডেট হওয়ার সময় একটি 'Loading Spinner' দেখানো উচিত যাতে
     * আনঅথরাইজড ইউজার লেআউটের ঝলক (flicker) দেখতে না পায়।
     */
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                Loading Session...
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100 overflow-hidden">
                {/* * Sidebar Context: মোবাইলে স্লাইড ইন/আউট লজিক হ্যান্ডেল করে।
                 * ব্যাকএন্ড থেকে আসা ইউজারের 'Role' অনুযায়ী এখানে মেনু আইটেম ফিল্টার হতে পারে।
                 */}
                <Sidebar userRole={user?.role} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header: ইউজার প্রোফাইল এবং নোটিফিকেশন এপিআই-এর সাথে কানেক্টেড থাকবে */}
                    <Header user={user} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-slate-50/50">
                        {/* * Outlet: এখানে সব ডাইনামিক পেজ রেন্ডার হবে।
                         * API Calls-এর সময় 'Interceptor' ব্যবহার করে হেডার-এ
                         * 'Authorization: Bearer <token>' পাঠানো নিশ্চিত করতে হবে।
                         */}
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default AppLayout;
