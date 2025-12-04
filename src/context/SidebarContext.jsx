// src/context/SidebarContext.jsx (FINAL FIX WITH useMemo)

import { createContext, useContext, useMemo, useState } from 'react'; // useMemo import করা হলো

const SidebarContext = createContext();

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
    ); // <-- Dependency array: শুধুমাত্র isSidebarOpen পরিবর্তন হলেই value নতুন হবে

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
