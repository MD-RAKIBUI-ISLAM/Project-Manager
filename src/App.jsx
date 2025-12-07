// src/App.jsx (FINAL FIX: Routing Focussed)

import { Navigate, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/auth/PrivateRoute';
// Component Imports
import AppLayout from './components/layout/AppLayout';
import TaskBoard from './components/tasks/TaskBoard';
// Context Imports
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
// Page Imports
import UserManagementPage from './pages/Admin/UserManagementPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotFound from './pages/NotFound';
import NotificationListPage from './pages/Notifications/NotificationListPage';
import ProjectDetailsPage from './pages/Projects/ProjectDetailsPage';
import ProjectListPage from './pages/Projects/ProjectListPage';
import { USER_ROLES } from './utils/constants';

function App() {
    return (
        <AuthProvider>
            <RoleProvider>
                <Routes>
                    {/* --- 1. Public Routes --- */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* --- 2. General Protected Routes Wrapper (AppLayout) --- */}
                    {/* এই রুটটি AppLayout এবং PrivateRoute দ্বারা সুরক্ষিত। */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <AppLayout />
                            </PrivateRoute>
                        }
                    >
                        {/* Nested Routes inside AppLayout (Accessible by all logged-in users) */}
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="tasks" element={<TaskBoard />} />
                        <Route path="projects" element={<ProjectListPage />} />
                        <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
                        <Route path="notifications" element={<NotificationListPage />} />

                        {/* 🛡️ 2.1: Admin Routes (Nested, Role Check) */}
                        {/* FIX: User Management কে এখন সাধারণ Protected Route এর ভেতরে নেস্টেড করা হলো। 
                            পাথ থেকে স্লাশ (/) সরানো হয়েছে।
                        */}
                        <Route
                            path="admin/users" // ✅ ফিক্সড: এখন এটি AppLayout এর ভেতরে কাজ করবে
                            element={
                                <PrivateRoute requiredRole={USER_ROLES.ADMIN}>
                                    <UserManagementPage />
                                </PrivateRoute>
                            }
                        />

                        {/* 404 Route within the protected layout */}
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* 3. Global 404 Not Found Page (যদি কোনো রুটই না মেলে) */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </RoleProvider>
        </AuthProvider>
    );
}

export default App;
