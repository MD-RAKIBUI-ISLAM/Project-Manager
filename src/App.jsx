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
import AllMembersView from './pages/Team/AllMembersView';
// 👇 নতুন আমদানি (New Import)
import TeamMembersPage from './pages/Team/TeamMembersPage';
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
                        <Route path="members" element={<AllMembersView />} />
                        <Route path="tasks" element={<TaskBoard />} />
                        <Route path="projects" element={<ProjectListPage />} />
                        <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
                        <Route path="notifications" element={<NotificationListPage />} />

                        {/* 👇 নতুন রুট: Team Members (সকল লগইন করা ইউজারের জন্য) */}
                        <Route path="team" element={<TeamMembersPage />} />

                        {/* 🛡️ 2.1: Admin Routes (Nested, Role Check) */}
                        <Route
                            path="admin/users"
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
