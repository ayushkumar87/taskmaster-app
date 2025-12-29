import { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

const DashboardLayout = ({ children }) => {
    // Default open on desktop, closed on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        } else {
            // Optional: Do we want close button to work on desktop? Yes.
            setIsSidebarOpen(false);
        }
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
            <div className={`dashboard-wrapper ${isSidebarOpen ? 'layout-sidebar-open' : 'layout-sidebar-closed'}`}>
                <Sidebar />

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={closeSidebar}
                    />
                )}

                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </SidebarContext.Provider>
    );
};

export default DashboardLayout;
