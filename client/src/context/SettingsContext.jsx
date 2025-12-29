import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

const DEFAULT_SETTINGS = {
    language: 'en',
    fontSize: 'medium',
    primaryColor: '#6366F1',
    textColor: '#FFFFFF',
    backgroundColor: '#0F172A',
    theme: 'dark-slate',
    displayName: '',
    showEmail: true,
    profilePhoto: '',
};

const FONT_SIZES = {
    small: '14px',
    medium: '16px',
    large: '18px',
    xl: '20px',
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        // Load settings from localStorage on initial render
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.error('Failed to parse saved settings:', error);
                return DEFAULT_SETTINGS;
            }
        }
        return DEFAULT_SETTINGS;
    });

    // Apply settings to document root whenever they change
    useEffect(() => {
        const root = document.documentElement;

        // Apply font size
        root.style.setProperty('--font-size-base', FONT_SIZES[settings.fontSize]);

        // Apply colors
        root.style.setProperty('--primary-color', settings.primaryColor);
        root.style.setProperty('--text-primary', settings.textColor);
        root.style.setProperty('--bg-color', settings.backgroundColor);

        // Apply theme class
        root.setAttribute('data-theme', settings.theme);

        // Save to localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem('appSettings');
    };

    const value = {
        settings,
        updateSettings,
        resetSettings,
        FONT_SIZES,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SettingsContext;
