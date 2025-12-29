import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                {error && <div style={{
                    background: '#FEE2E2', color: '#B91C1C', padding: '1rem',
                    borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center'
                }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)' }}
                    >
                        Sign In
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
                    <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
