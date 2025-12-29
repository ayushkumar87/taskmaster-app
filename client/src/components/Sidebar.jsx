import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaRobot, FaThLarge, FaExclamationCircle, FaChartPie, FaLayerGroup, FaSignOutAlt, FaCog, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useSidebar } from './DashboardLayout';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, closeSidebar } = useSidebar() || {}; // Fallback if used outside layout

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
            {/* Mobile Close Button */}
            <button
                className="sidebar-close-btn mobile-only"
                onClick={closeSidebar}
            >
                <FaTimes />
            </button>

            {/* User Profile Section */}
            <div className="sidebar-profile">
                {/* Placeholder Avatar */}
                <div className="sidebar-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="sidebar-user-info">
                    <h3 className="sidebar-username">{user?.name || 'User'}</h3>
                    <p className="sidebar-email">{user?.email || 'user@example.com'}</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav">
                <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaHome className="sidebar-icon" />
                    <span>Home</span>
                </Link>
                <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaThLarge className="sidebar-icon" />
                    <span>Dashboard</span>
                </Link>
                <Link to="/ai-assistant" className={`sidebar-link ${isActive('/ai-assistant') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaRobot className="sidebar-icon" />
                    <span>AI Assistant</span>
                </Link>
                <Link to="/vital" className={`sidebar-link ${isActive('/vital') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaExclamationCircle className="sidebar-icon" />
                    <span>Vital Task</span>
                </Link>
                <Link to="/analytics" className={`sidebar-link ${isActive('/analytics') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaChartPie className="sidebar-icon" />
                    <span>Analytics</span>
                </Link>
                <Link to="/categories" className={`sidebar-link ${isActive('/categories') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaLayerGroup className="sidebar-icon" />
                    <span>Categories</span>
                </Link>
                <div className="sidebar-divider"></div>
                <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaCog className="sidebar-icon" />
                    <span>Settings</span>
                </Link>
                <Link to="/about" className={`sidebar-link ${isActive('/about') ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaInfoCircle className="sidebar-icon" />
                    <span>About Us</span>
                </Link>
            </nav>

            {/* Logout */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link logout-btn">
                    <FaSignOutAlt className="sidebar-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
