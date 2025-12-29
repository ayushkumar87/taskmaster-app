import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            <nav className="navbar" style={{ background: 'transparent', borderBottom: 'none' }}>
                <div className="container navbar-content">
                    <div className="nav-brand">TaskMaster</div>
                    <div className="nav-links">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary">Login</Link>
                                <Link to="/signup" className="btn btn-primary btn-glow">Sign Up Free</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="landing-hero">
                <h1 className="landing-title">
                    Organize your work <br />
                    <span className="text-gradient">efficiently.</span>
                </h1>
                <p className="landing-subtitle">
                    TaskMaster helps you manage your tasks, track progress, and stay productive with a modern, intuitive interface.
                </p>
                <div className="landing-cta-group">
                    {user ? (
                        <Link to="/dashboard" className="btn btn-primary btn-glow" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            My Tasks
                        </Link>
                    ) : (
                        <Link to="/signup" className="btn btn-primary btn-glow" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            Get Started
                        </Link>
                    )}
                    <a href="#features" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        Learn More
                    </a>
                </div>

                <div id="features" className="features-grid">
                    <FeatureCard
                        icon={<FaCheckCircle style={{ fontSize: '2.5rem', color: 'var(--secondary-color)' }} />}
                        title="Task Management"
                        description="Create, edit, and organize your todos with ease."
                    />
                    <FeatureCard
                        icon={<FaChartLine style={{ fontSize: '2.5rem', color: 'var(--info-color)' }} />}
                        title="Progress Tracking"
                        description="Visual progress bars to keep you motivated."
                    />
                    <FeatureCard
                        icon={<FaShieldAlt style={{ fontSize: '2.5rem', color: '#8B5CF6' }} />}
                        title="Secure"
                        description="Your data is safe with JWT authentication."
                    />
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card-premium">
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
);

export default Landing;
