import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';
import { FaHeart, FaRocket, FaUsers, FaLightbulb } from 'react-icons/fa';

const About = () => {
    return (
        <DashboardLayout>
            <TopHeader />
            <div className="about-page">
                <div className="about-header">
                    <h1 className="about-title">About TaskMaster</h1>
                    <p className="about-subtitle">Your intelligent task management companion</p>
                </div>

                <div className="about-container">
                    {/* Mission Section */}
                    <div className="about-section">
                        <div className="section-header">
                            <FaRocket className="section-icon" />
                            <h2 className="section-title">Our Mission</h2>
                        </div>
                        <p className="section-content">
                            TaskMaster is designed to help you stay organized and productive. We believe that
                            managing tasks should be simple, intuitive, and powered by smart technology. Our
                            AI-powered assistant helps you create, organize, and prioritize your tasks with
                            natural language commands.
                        </p>
                    </div>

                    {/* Features Section */}
                    <div className="about-section">
                        <div className="section-header">
                            <FaLightbulb className="section-icon" />
                            <h2 className="section-title">What We Offer</h2>
                        </div>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>🤖 AI Assistant</h3>
                                <p>Manage tasks using natural language. Just tell our AI what you need to do.</p>
                            </div>
                            <div className="feature-card">
                                <h3>📊 Analytics</h3>
                                <p>Track your productivity with detailed insights and visualizations.</p>
                            </div>
                            <div className="feature-card">
                                <h3>⚡ Vital Tasks</h3>
                                <p>Prioritize what matters most with our vital task management system.</p>
                            </div>
                            <div className="feature-card">
                                <h3>📁 Categories</h3>
                                <p>Organize tasks by category for better workflow management.</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="about-section">
                        <div className="section-header">
                            <FaUsers className="section-icon" />
                            <h2 className="section-title">Built With Passion</h2>
                        </div>
                        <p className="section-content">
                            TaskMaster is built by developers who understand the challenges of staying
                            organized in a fast-paced world. We're committed to continuously improving
                            the platform based on user feedback and emerging technologies.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="about-section">
                        <div className="section-header">
                            <FaHeart className="section-icon" />
                            <h2 className="section-title">Get In Touch</h2>
                        </div>
                        <p className="section-content">
                            We'd love to hear from you! Whether you have feedback, suggestions, or just
                            want to say hello, feel free to reach out through our feedback form in the
                            Settings page.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <div className="stat-number">2026</div>
                                <div className="stat-label">Launched</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">∞</div>
                                <div className="stat-label">Possibilities</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">100%</div>
                                <div className="stat-label">Dedicated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default About;
