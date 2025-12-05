// src/App.jsx (FINAL Working Version with AuthProvider Integration)

import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';
import TaskBoard from './components/tasks/TaskBoard';
// AUTHENTICATION FIX: AuthProvider এবং useAuth-কে context থেকে আমদানি করা হলো
import { AuthProvider, useAuth } from './context/AuthContext';
import UserManagementPage from './pages/Admin/UserManagementPage';
// Page Components
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotFound from './pages/NotFound';
import NotificationListPage from './pages/Notifications/NotificationListPage';
import ProjectDetailsPage from './pages/Projects/ProjectDetailsPage';
import ProjectListPage from './pages/Projects/ProjectListPage';
import { USER_ROLES } from './utils/constants';

// --- PrivateRoute কম্পোনেন্ট (Authentication and Role Check) ---
function PrivateRoute({ allowedRoles }) {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        // MAIN FIX: সম্পূর্ণ অ্যাপ্লিকেশনকে AuthProvider দ্বারা মুড়ে দেওয়া হলো
        <AuthProvider>
            <Routes>
                {/* --- 1. Public Routes --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* --- 2. Protected Routes (AppLayout এর মধ্যে Nesting) --- */}

                {/* Main Protection (Authentication Check) */}
                <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                        {/* Dashboard and General Routes (All logged-in users) */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/tasks" element={<TaskBoard />} />
                        <Route path="/projects" element={<ProjectListPage />} />
                        <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
                        <Route path="/notifications" element={<NotificationListPage />} />

                        {/* Admin Routes (Role Protection Check) */}
                        <Route element={<PrivateRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
                            <Route path="/admin/users" element={<UserManagementPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* 3. 404 Not Found Page */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
