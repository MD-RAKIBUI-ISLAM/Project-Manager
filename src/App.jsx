// src/App.jsx (FINAL Working Version with TaskBoard Integration - CORRECTED PATH)

import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';
// ✅ CORRECTED IMPORT PATH: TaskBoard is in components/tasks/
import TaskBoard from './components/tasks/TaskBoard';
// Hooks & Context
import useAuth from './hooks/useAuth';
import UserManagementPage from './pages/Admin/UserManagementPage';
// Page Components
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotFound from './pages/NotFound';
import NotificationListPage from './pages/Notifications/NotificationListPage'; // ✅ NotificationListPage আমদানি করা হলো
import ProjectDetailsPage from './pages/Projects/ProjectDetailsPage';
import ProjectListPage from './pages/Projects/ProjectListPage';
import { USER_ROLES } from './utils/constants';

// --- PrivateRoute কম্পোনেন্ট (Component is defined here for simplicity) ---
// এটি শুধুমাত্র Authentication এবং Role Check হ্যান্ডেল করবে।
// এটি <Outlet /> রেন্ডার করে এর চাইল্ড রুটগুলিকে লোড হতে সাহায্য করে।
function PrivateRoute({ allowedRoles }) {
    const { isAuthenticated, isPermitted, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role restriction check (যদি allowedRoles ডিফাইন করা থাকে)
    if (allowedRoles && !isPermitted(allowedRoles)) {
        return <Navigate to="/dashboard" replace />;
    }

    // ✅ FIX: সবকিছু ঠিক থাকলে এটি এর চাইল্ড রুটকে রেন্ডার করবে (Outlet এর মাধ্যমে)
    return <Outlet />;
}

function App() {
    return (
        <Routes>
            {/* --- 1. Public Routes --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* --- 2. Protected Routes (AppLayout এর মধ্যে Nesting) --- */}

            {/* 2.1. Main Protection (Authentication Check) */}
            <Route element={<PrivateRoute />}>
                {/* 2.2. Layout Route (AppLayout এর Outlet এ চাইল্ড রুটগুলো রেন্ডার হবে) */}
                <Route element={<AppLayout />}>
                    {/* Dashboard and General Routes (All logged-in users) */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* ✅ ADDED: Task Management Route - Now correctly links to TaskBoard */}
                    <Route path="/tasks" element={<TaskBoard />} />

                    {/* ✅ PROJECT ROUTES: ProjectListPage এবং ProjectDetailsPage এখন সঠিকভাবে কাজ করবে */}
                    <Route path="/projects" element={<ProjectListPage />} />
                    <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />

                    {/* ✅ ADDED: Notification List Page Route */}
                    <Route path="/notifications" element={<NotificationListPage />} />

                    {/* 2.3. Admin Routes (Role Protection Check) */}

                    {/* একটি নতুন নেস্টেড রুট তৈরি করা হলো যা Admin Role দিয়ে সুরক্ষিত */}
                    <Route element={<PrivateRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
                        <Route path="/admin/users" element={<UserManagementPage />} />
                    </Route>
                </Route>
            </Route>

            {/* 3. 404 Not Found Page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
