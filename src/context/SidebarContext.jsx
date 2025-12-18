// src/context/SidebarContext.jsx

import { createContext, useContext, useMemo, useState } from 'react';

const SidebarContext = createContext();

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. UI PERSISTENCE (Optional): Currently, sidebar state is strictly client-side.
 * If you want to persist the sidebar's "open/collapsed" state in the user's preference
 * settings, add a 'sidebar_collapsed' boolean field to the User model/API.
 */

export function SidebarProvider({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // --- ✅ useMemo ব্যবহার করা হলো ---
    const value = useMemo(
        () => ({
            isSidebarOpen,
            toggleSidebar,
            closeSidebar
        }),
        [isSidebarOpen]
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// Custom hook for consuming the context
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
