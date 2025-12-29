import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="nav-brand">
                    TaskMaster
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link" style={{ fontWeight: 500 }}>Dashboard</Link>
                            <Link to="/analytics" className="nav-link" style={{ fontWeight: 500 }}>Analytics</Link>
                            <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
