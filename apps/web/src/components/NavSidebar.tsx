import React from 'react';
import { useThemeStore, useAppStore } from '../store';

// Icons
const MessagesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
);

const ChannelsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
    </svg>
);

const VoiceIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

export function NavSidebar() {
    const { theme, toggleTheme } = useThemeStore();
    const [activeNav, setActiveNav] = React.useState('messages');

    return (
        <nav className="nav-sidebar">
            <div className="nav-logo">E</div>

            <div className="nav-items">
                <button
                    className={`nav-item ${activeNav === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveNav('messages')}
                    title="Messages"
                >
                    <MessagesIcon />
                </button>
                <button
                    className={`nav-item ${activeNav === 'channels' ? 'active' : ''}`}
                    onClick={() => setActiveNav('channels')}
                    title="Channels"
                >
                    <ChannelsIcon />
                </button>
                <button
                    className={`nav-item ${activeNav === 'voice' ? 'active' : ''}`}
                    onClick={() => setActiveNav('voice')}
                    title="Voice Rooms"
                >
                    <VoiceIcon />
                </button>
                <button
                    className={`nav-item ${activeNav === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveNav('calendar')}
                    title="Calendar"
                >
                    <CalendarIcon />
                </button>
            </div>

            <div className="nav-bottom">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                <button className="nav-item" title="Settings">
                    <SettingsIcon />
                </button>
            </div>
        </nav>
    );
}
