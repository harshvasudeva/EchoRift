import React from 'react';
import { useAppStore, type Thread } from '../store';
import { Avatar } from './Avatar';

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const VoiceIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
    </svg>
);

interface ThreadListProps {
    onJoinVoice?: (threadId: string) => void;
}

export function ThreadList({ onJoinVoice }: ThreadListProps) {
    const { threads, activeThreadId, setActiveThread, user, voiceState } = useAppStore();

    const formatTime = (date?: Date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();

        if (diff < 60000) return 'now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const handleThreadClick = (thread: Thread) => {
        if (thread.isVoice) {
            onJoinVoice?.(thread.id);
        } else {
            setActiveThread(thread.id);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-title">Messages</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="user-btn" title="Search">
                        <SearchIcon />
                    </button>
                    <button className="user-btn" title="New message">
                        <PlusIcon />
                    </button>
                </div>
            </div>

            <div className="sidebar-content">
                {threads.map((thread) => {
                    const isActive = thread.isVoice
                        ? voiceState.threadId === thread.id
                        : activeThreadId === thread.id;

                    return (
                        <div
                            key={thread.id}
                            className={`thread-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleThreadClick(thread)}
                        >
                            <div className="thread-avatar">
                                {thread.isVoice ? (
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: voiceState.threadId === thread.id
                                            ? 'var(--status-online)'
                                            : 'var(--bg-hover)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: voiceState.threadId === thread.id ? 'white' : 'var(--text-secondary)',
                                    }}>
                                        <VoiceIcon />
                                    </div>
                                ) : (
                                    <Avatar
                                        name={thread.name}
                                        size={40}
                                        status={thread.participants[0]?.status}
                                    />
                                )}
                            </div>
                            <div className="thread-info">
                                <div className="thread-name">{thread.name}</div>
                                <div className="thread-preview">
                                    {thread.isVoice
                                        ? (voiceState.threadId === thread.id ? 'Connected' : 'Voice channel')
                                        : (thread.lastMessage?.content || 'No messages yet')
                                    }
                                </div>
                            </div>
                            <div className="thread-meta">
                                {!thread.isVoice && (
                                    <span className="thread-time">
                                        {formatTime(thread.lastMessage?.timestamp)}
                                    </span>
                                )}
                                {thread.unreadCount > 0 && (
                                    <span className="thread-badge">{thread.unreadCount}</span>
                                )}
                                {thread.isVoice && thread.participants.length > 0 && (
                                    <span style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}>
                                        <span style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            background: 'var(--status-online)',
                                        }} />
                                        {thread.participants.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {user && (
                <div className="sidebar-footer">
                    <div className="user-panel">
                        <Avatar name={user.name} size={32} status={user.status} />
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-status">Online</div>
                        </div>
                        <div className="user-actions">
                            <button className="user-btn" title="Settings">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
