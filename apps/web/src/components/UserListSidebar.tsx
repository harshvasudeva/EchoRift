import React from 'react';
import { useAppStore } from '../store';
import { Avatar } from './Avatar';

export function UserListSidebar() {
    const { activeThreadId, threads, user: currentUser } = useAppStore();

    // Find active thread, or default to general if none
    const activeThread = threads.find(t => t.id === activeThreadId);

    // Get participants
    // If we're in a DM, we might still want to show the list, or maybe not. 
    // Usually User List is for Servers/Channels. For DMs it's just the 2 people.
    // User requested "right panel with list of active users".
    // We will show participants of the current thread.

    const participants = activeThread?.participants || [];

    // Group by status
    const onlineUsers = participants.filter(p => p.status === 'online');
    const awayUsers = participants.filter(p => p.status === 'away' || p.status === 'busy');
    const offlineUsers = participants.filter(p => p.status === 'offline');

    if (!activeThread || activeThread.type === 'direct') {
        // Option: in DMs, maybe show "Shared Groups" or profile? 
        // For now, let's just return null or generic list if user wants it *always*.
        // The user said "text channels that are pinned... and right panel". 
        // This implies it's a Server View feature.
        // Let's mimic Discord: DMs usually don't have a user list panel (except group DMs).
        // Channels DO have it.
        // We will render it if it's a channel/group.
        if (activeThread?.type === 'direct') return null;
    }

    const renderUser = (user: any) => (
        <div key={user.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: user.status === 'offline' ? 0.5 : 1,
            transition: 'background 0.1s'
        }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
            <Avatar name={user.name} size={32} status={user.status} src={user.avatar} />
            <div style={{
                color: 'var(--text-normal)',
                fontWeight: 500,
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {user.name}
                {user.id === currentUser?.id && <span style={{ marginLeft: 4, opacity: 0.5 }}>(You)</span>}
            </div>
        </div>
    );

    return (
        <aside style={{
            width: '240px',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 8px',
            overflowY: 'auto'
        }}>
            {participants.length === 0 && (
                <div style={{ padding: 16, color: 'var(--text-muted)', textAlign: 'center', fontSize: 13 }}>
                    No active members
                </div>
            )}

            {onlineUsers.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        padding: '0 8px 8px 8px',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                    }}>
                        Online — {onlineUsers.length}
                    </div>
                    {onlineUsers.map(renderUser)}
                </div>
            )}

            {awayUsers.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        padding: '0 8px 8px 8px',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                    }}>
                        Away — {awayUsers.length}
                    </div>
                    {awayUsers.map(renderUser)}
                </div>
            )}

            {offlineUsers.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        padding: '0 8px 8px 8px',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                    }}>
                        Offline — {offlineUsers.length}
                    </div>
                    {offlineUsers.map(renderUser)}
                </div>
            )}
        </aside>
    );
}
