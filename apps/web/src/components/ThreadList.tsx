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
                {/* Channels Section */}
                <div style={{ padding: '16px 8px 4px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Channels
                </div>
                {threads.filter(t => t.type === 'channel' || t.isVoice).map((thread) => {
                    const isActive = voiceState.threadId === thread.id && thread.isVoice
                        ? false // Don't mark as active in list if it's the connected voice (unless we are viewing it? logic overlap)
                        : activeThreadId === thread.id;

                    // Actually, if we are connected to voice, we might want to show it as active if we are viewing it.
                    // But if we are viewing text, voice is background.

                    const isSelected = activeThreadId === thread.id;

                    return (
                        <div
                            key={thread.id}
                            className={`thread-item ${isSelected ? 'active' : ''}`}
                            onClick={() => handleThreadClick(thread)}
                            style={{ marginBottom: 2 }}
                        >
                            <div className="thread-avatar" style={{ width: 24, justifyContent: 'flex-start' }}>
                                {thread.isVoice ? <VoiceIcon /> : <span style={{ fontSize: 20, color: 'var(--text-secondary)' }}>#</span>}
                            </div>
                            <div className="thread-info">
                                <div className="thread-name" style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                    {thread.name}
                                </div>
                            </div>
                            {voiceState.streamingParticipants?.[thread.id]?.length > 0 && (
                                <span style={{
                                    background: '#ED4245',
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    padding: '1px 4px',
                                    borderRadius: '4px',
                                    marginLeft: 'auto',
                                    marginRight: '8px'
                                }}>
                                    LIVE
                                </span>
                            )}
                        </div>
                    );
                })}

                {/* Direct Messages Section */}
                <div style={{ padding: '16px 8px 4px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: 12 }}>
                    Direct Messages
                </div>
                {threads.filter(t => t.type === 'direct' || t.type === 'group').map((thread) => {
                    const isActive = activeThreadId === thread.id;
                    return (
                        <div
                            key={thread.id}
                            className={`thread-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleThreadClick(thread)}
                        >
                            <div className="thread-avatar">
                                <Avatar
                                    name={thread.name}
                                    size={32}
                                    status={thread.participants[0]?.status}
                                />
                            </div>
                            <div className="thread-info">
                                <div className="thread-name">{thread.name}</div>
                                <div className="thread-preview">
                                    {thread.lastMessage?.content || 'No messages yet'}
                                </div>
                            </div>
                            <div className="thread-meta">
                                <span className="thread-time">
                                    {formatTime(thread.lastMessage?.timestamp)}
                                </span>
                                {thread.unreadCount > 0 && (
                                    <span className="thread-badge">{thread.unreadCount}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Voice Status Banner */}
            {voiceState.active && (
                <div
                    onClick={() => voiceState.threadId && onJoinVoice?.(voiceState.threadId)}
                    style={{
                        background: 'var(--bg-elevated)',
                        padding: '8px',
                        borderTop: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        marginTop: 'auto'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 8px',
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: voiceState.status === 'connected' ? 'var(--status-online)' :
                                voiceState.status === 'error' ? 'var(--status-busy)' :
                                    'var(--status-away)',
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: voiceState.status === 'connected' ? 'var(--status-online)' :
                                    voiceState.status === 'error' ? 'var(--status-busy)' :
                                        'var(--status-away)'
                            }}>
                                {voiceState.status === 'connected' ? 'Voice Connected' : 'Connecting...'}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                Click to Return
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
