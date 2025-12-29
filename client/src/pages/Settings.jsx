import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';
import { FaSave, FaUndo, FaPalette, FaFont, FaGlobe, FaUser, FaCamera, FaCommentDots, FaStar, FaPaperPlane } from 'react-icons/fa';
import api from '../utils/api';

const Settings = () => {
    const { settings, updateSettings, resetSettings } = useSettings();
    const [tempSettings, setTempSettings] = useState(settings);

    // Feedback form state
    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        rating: 5,
        category: 'General Feedback',
        message: ''
    });
    const [feedbackStatus, setFeedbackStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (key, value) => {
        setTempSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateSettings(tempSettings);
        alert('Settings saved successfully!');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
            resetSettings();
            setTempSettings(settings);
        }
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('profilePhoto', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Feedback form handlers
    const handleFeedbackChange = (key, value) => {
        setFeedback(prev => ({ ...prev, [key]: value }));
        setFeedbackStatus({ type: '', message: '' }); // Clear status on input change
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!feedback.name || !feedback.email || !feedback.message) {
            setFeedbackStatus({
                type: 'error',
                message: 'Please fill in all required fields'
            });
            return;
        }

        setIsSubmitting(true);
        setFeedbackStatus({ type: '', message: '' });

        try {
            const response = await api.post('/feedback', feedback);

            setFeedbackStatus({
                type: 'success',
                message: response.data.message || 'Thank you for your feedback!'
            });

            // Reset form
            setFeedback({
                name: '',
                email: '',
                rating: 5,
                category: 'General Feedback',
                message: ''
            });
        } catch (error) {
            setFeedbackStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to submit feedback. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी (Hindi)' },
        { code: 'es', name: 'Español (Spanish)' },
        { code: 'fr', name: 'Français (French)' },
    ];

    const fontSizes = [
        { value: 'small', label: 'Small (14px)' },
        { value: 'medium', label: 'Medium (16px)' },
        { value: 'large', label: 'Large (18px)' },
        { value: 'xl', label: 'Extra Large (20px)' },
    ];

    const themes = [
        { value: 'dark-slate', label: 'Dark Slate', bg: '#0F172A' },
        { value: 'deep-purple', label: 'Deep Purple', bg: '#1E1B4B' },
        { value: 'midnight-black', label: 'Midnight Black', bg: '#0a0a0a' },
        { value: 'dark-blue', label: 'Dark Blue', bg: '#0c1e3d' },
    ];

    return (
        <DashboardLayout>
            <TopHeader />
            <div className="settings-page">
                <div className="settings-header">
                    <h1 className="settings-title">Settings</h1>
                    <p className="settings-subtitle">Customize your TaskMaster experience</p>
                </div>

                <div className="settings-container">
                    {/* Language & Region Section */}
                    <div className="settings-section">
                        <div className="section-header">
                            <FaGlobe className="section-icon" />
                            <h2 className="section-title">Language & Region</h2>
                        </div>
                        <div className="settings-option">
                            <label className="option-label">
                                Language
                                <span style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                                    color: 'var(--primary-color)',
                                    borderRadius: '4px',
                                    border: '1px solid var(--primary-color)'
                                }}>
                                    COMING SOON
                                </span>
                            </label>
                            <select
                                className="option-select"
                                value={tempSettings.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            >
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            <p className="option-description">Multi-language support will be available in a future update</p>
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div className="settings-section">
                        <div className="section-header">
                            <FaPalette className="section-icon" />
                            <h2 className="section-title">Appearance</h2>
                        </div>

                        {/* Font Size */}
                        <div className="settings-option">
                            <label className="option-label">Font Size</label>
                            <div className="font-size-selector">
                                {fontSizes.map(size => (
                                    <button
                                        key={size.value}
                                        className={`font-size-btn ${tempSettings.fontSize === size.value ? 'active' : ''}`}
                                        onClick={() => handleChange('fontSize', size.value)}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                            <p className="option-description">Adjust text size throughout the application</p>
                        </div>

                        {/* Primary Color */}
                        <div className="settings-option">
                            <label className="option-label">Primary Color</label>
                            <div className="color-picker-wrapper">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={tempSettings.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                />
                                <span className="color-value">{tempSettings.primaryColor}</span>
                            </div>
                            <p className="option-description">Choose your accent color for buttons and highlights</p>
                        </div>

                        {/* Text Color */}
                        <div className="settings-option">
                            <label className="option-label">Text Color</label>
                            <div className="color-picker-wrapper">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={tempSettings.textColor}
                                    onChange={(e) => handleChange('textColor', e.target.value)}
                                />
                                <span className="color-value">{tempSettings.textColor}</span>
                            </div>
                            <p className="option-description">Customize the main text color</p>
                        </div>

                        {/* Background Theme */}
                        <div className="settings-option">
                            <label className="option-label">Background Theme</label>
                            <div className="theme-selector">
                                {themes.map(theme => (
                                    <button
                                        key={theme.value}
                                        className={`theme-btn ${tempSettings.theme === theme.value ? 'active' : ''}`}
                                        onClick={() => {
                                            handleChange('theme', theme.value);
                                            handleChange('backgroundColor', theme.bg);
                                        }}
                                        style={{ backgroundColor: theme.bg }}
                                    >
                                        <span className="theme-name">{theme.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="option-description">Select your preferred background theme</p>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="settings-section">
                        <div className="section-header">
                            <FaUser className="section-icon" />
                            <h2 className="section-title">Profile Settings</h2>
                        </div>

                        {/* Profile Photo */}
                        <div className="settings-option">
                            <label className="option-label">Profile Photo</label>
                            <div className="profile-photo-section">
                                <div className="profile-photo-preview">
                                    {tempSettings.profilePhoto ? (
                                        <img
                                            src={tempSettings.profilePhoto}
                                            alt="Profile"
                                            className="profile-photo-img"
                                        />
                                    ) : (
                                        <div className="profile-photo-placeholder">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>
                                <div className="profile-photo-actions">
                                    <label htmlFor="profile-photo-input" className="btn-upload-photo">
                                        <FaCamera /> Choose Photo
                                    </label>
                                    <input
                                        id="profile-photo-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePhotoChange}
                                        style={{ display: 'none' }}
                                    />
                                    {tempSettings.profilePhoto && (
                                        <button
                                            className="btn-remove-photo"
                                            onClick={() => handleChange('profilePhoto', '')}
                                        >
                                            Remove Photo
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="option-description">Upload a profile picture (JPG, PNG, or GIF)</p>
                        </div>

                        <div className="settings-option">
                            <label className="option-label">Display Name</label>
                            <input
                                type="text"
                                className="option-input"
                                value={tempSettings.displayName}
                                onChange={(e) => handleChange('displayName', e.target.value)}
                                placeholder="Enter your display name"
                            />
                            <p className="option-description">This name will appear in your profile</p>
                        </div>

                        <div className="settings-option">
                            <label className="option-label checkbox-label">
                                <input
                                    type="checkbox"
                                    className="option-checkbox"
                                    checked={tempSettings.showEmail}
                                    onChange={(e) => handleChange('showEmail', e.target.checked)}
                                />
                                <span>Show email in profile</span>
                            </label>
                            <p className="option-description">Display your email address in the sidebar</p>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="settings-section settings-preview-section">
                        <div className="section-header">
                            <FaFont className="section-icon" />
                            <h2 className="section-title">Preview</h2>
                        </div>
                        <div
                            className="settings-preview"
                            style={{
                                fontSize: tempSettings.fontSize === 'small' ? '14px' :
                                    tempSettings.fontSize === 'medium' ? '16px' :
                                        tempSettings.fontSize === 'large' ? '18px' : '20px',
                                color: tempSettings.textColor,
                                backgroundColor: tempSettings.backgroundColor,
                            }}
                        >
                            <h3 style={{ color: tempSettings.primaryColor }}>Sample Heading</h3>
                            <p>This is how your text will appear with the current settings. The quick brown fox jumps over the lazy dog.</p>
                            <button
                                className="preview-button"
                                style={{
                                    backgroundColor: tempSettings.primaryColor,
                                    color: '#FFFFFF'
                                }}
                            >
                                Sample Button
                            </button>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="settings-section feedback-section">
                        <div className="section-header">
                            <FaCommentDots className="section-icon" />
                            <h2 className="section-title">Help & Feedback</h2>
                        </div>

                        <p className="feedback-intro">
                            We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.
                        </p>

                        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={feedback.name}
                                        onChange={(e) => handleFeedbackChange('name', e.target.value)}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={feedback.email}
                                        onChange={(e) => handleFeedbackChange('email', e.target.value)}
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={feedback.category}
                                        onChange={(e) => handleFeedbackChange('category', e.target.value)}
                                    >
                                        <option value="General Feedback">General Feedback</option>
                                        <option value="Bug Report">Bug Report</option>
                                        <option value="Feature Request">Feature Request</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rating</label>
                                    <div className="rating-selector">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <FaStar
                                                key={star}
                                                className={`rating-star ${star <= feedback.rating ? 'active' : ''}`}
                                                onClick={() => handleFeedbackChange('rating', star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message *</label>
                                <textarea
                                    className="form-textarea"
                                    value={feedback.message}
                                    onChange={(e) => handleFeedbackChange('message', e.target.value)}
                                    placeholder="Tell us what's on your mind..."
                                    rows="5"
                                    required
                                />
                            </div>

                            {feedbackStatus.message && (
                                <div className={`feedback-status ${feedbackStatus.type}`}>
                                    {feedbackStatus.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-submit-feedback"
                                disabled={isSubmitting}
                            >
                                <FaPaperPlane /> {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </div>

                    {/* Action Buttons */}
                    <div className="settings-actions">
                        <button className="btn-save" onClick={handleSave}>
                            <FaSave /> Save Changes
                        </button>
                        <button className="btn-reset" onClick={handleReset}>
                            <FaUndo /> Reset to Defaults
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
