import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/forgotpassword', { email });
            setMessage(data.data);
        } catch (err) {
            console.error("Forgot Password Error:", err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Forgot Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                {message && <div style={{
                    background: '#D1FAE5', color: '#065F46', padding: '1rem',
                    borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center'
                }}>{message}</div>}
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
