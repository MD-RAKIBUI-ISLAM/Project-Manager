// src/layout/AppLayout.jsx (Updated)

import { Outlet } from 'react-router-dom';

import { SidebarProvider } from '../../context/SidebarContext'; // <--- এটি ইমপোর্ট করুন
import useAuth from '../../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';

function AppLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null; // Should not happen due to PrivateRoute

    return (
        // --- SidebarProvider যোগ করা হলো ---
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider> // <--- এখানে শেষ
    );
}

export default AppLayout;
