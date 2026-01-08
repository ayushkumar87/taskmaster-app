import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Analytics from './pages/Analytics';
import VitalTask from './pages/VitalTask';
import TaskCategories from './pages/TaskCategories';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';
import About from './pages/About';
import Footer from './components/Footer';



class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
                    <h1>Something went wrong.</h1>
                    <pre style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const location = useLocation();
    // Hide footer on all dashboard-related pages
    const isDashboard = ['/dashboard', '/ai-assistant', '/analytics', '/vital', '/categories', '/settings', '/about'].some(path => location.pathname.startsWith(path));

    const { user, loading } = useAuth();

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="app-layout">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/ai-assistant"
                    element={
                        <PrivateRoute>
                            <AIAssistant />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <PrivateRoute>
                            <Analytics />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/vital"
                    element={
                        <PrivateRoute>
                            <VitalTask />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <PrivateRoute>
                            <TaskCategories />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <Settings />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <PrivateRoute>
                            <About />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {!isDashboard && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <SocketProvider>
                    <SettingsProvider>
                        <ThemeProvider>
                            <ErrorBoundary>
                                <AppContent />
                            </ErrorBoundary>
                        </ThemeProvider>
                    </SettingsProvider>
                </SocketProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
