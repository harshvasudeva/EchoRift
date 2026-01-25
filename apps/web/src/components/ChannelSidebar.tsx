import React, { useState } from 'react';
import type { Server, Channel, User } from '../store';
import { Avatar } from './Avatar';
import { useAppStore } from '../store';

interface ChannelSidebarProps {
    server: Server;
    channels: Channel[];
    activeChannelId?: string;
    onChannelClick: (channelId: string) => void;
    user: User | null;
}

// Icons
const HashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
        <path d="M5.88657 21C5.70561 21 5.57551 20.8424 5.61127 20.6655L6.29167 17H3C2.44772 17 2 16.5523 2 16C2 15.4477 2.44772 15 3 15H6.63667L7.33333 11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H7.66667L8.36127 5.33453C8.43679 4.93331 8.79928 4.64844 9.20917 4.68306C9.61906 4.71767 9.94179 5.05499 9.94179 5.46672L9.33333 9H13.6667L14.3613 5.33453C14.4368 4.93331 14.7993 4.64844 15.2092 4.68306C15.6191 4.71767 15.9418 5.05499 15.9418 5.46672L15.3333 9H18.6667C19.219 9 19.6667 9.44772 19.6667 10C19.6667 10.5523 19.219 11 18.6667 11H15L14.3033 15H17.6667C18.219 15 18.6667 15.4477 18.6667 16C18.6667 16.5523 18.219 17 17.6667 17H13.97L13.2754 20.6655C13.1999 21.0668 12.8374 21.3517 12.4276 21.3171C12.0177 21.2825 11.695 20.9452 11.695 20.5335L12.3033 17H7.97L7.27537 20.6655C7.19986 21.0668 6.83737 21.3517 6.42747 21.3171C6.01758 21.2825 5.69486 20.9452 5.69486 20.5335L5.88657 21ZM9 15H13.3333L14 11H9.66667L9 15Z" />
    </svg>
);

const VoiceIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
        <path d="M12 3C10.34 3 9 4.37 9 6.07V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V6.07C15 4.37 13.66 3 12 3ZM12 13C11.45 13 11 12.55 11 12V6.07C11 5.48 11.45 5 12 5C12.55 5 13 5.48 13 6.07V12C13 12.55 12.55 13 12 13ZM19 12C19 15.53 16.39 18.44 13 18.93V21H16V23H8V21H11V18.93C7.61 18.44 5 15.53 5 12H7C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12H19Z" />
    </svg>
);

const VideoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
        <path d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L17 9.882V8C17 6.897 16.103 6 15 6H4C2.897 6 2 6.897 2 8V16C2 17.103 2.897 18 4 18H15C16.103 18 17 17.103 17 16V14.118L20.553 15.895C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z" />
    </svg>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.1s ease',
        }}
    >
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
);

const MicIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C10.34 3 9 4.37 9 6.07V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V6.07C15 4.37 13.66 3 12 3Z" />
        <path d="M19 12C19 15.53 16.39 18.44 13 18.93V21H16V23H8V21H11V18.93C7.61 18.44 5 15.53 5 12H7C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12H19Z" />
    </svg>
);

const HeadphoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12V20C2 21.1 2.9 22 4 22H6C7.1 22 8 21.1 8 20V16C8 14.9 7.1 14 6 14H4V12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12V14H18C16.9 14 16 14.9 16 16V20C16 21.1 16.9 22 18 22H20C21.1 22 22 21.1 22 20V12C22 6.48 17.52 2 12 2Z" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" />
    </svg>
);

export function ChannelSidebar({
    server,
    channels,
    activeChannelId,
    onChannelClick,
    user,
}: ChannelSidebarProps) {
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
    const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
    const voiceState = useAppStore((state) => state.voiceState);

    const toggleCategory = (categoryId: string) => {
        setCollapsedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const categories = channels.filter(c => c.type === 'category');
    const uncategorized = channels.filter(c => c.type !== 'category' && !c.parentId);

    const renderChannel = (channel: Channel) => {
        const isActive = channel.id === activeChannelId;
        const isHovered = hoveredChannel === channel.id;
        const isVoice = channel.type === 'voice' || channel.type === 'video';

        return (
            <div
                key={channel.id}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    margin: '1px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: isActive ? '#F2F3F5' : '#949BA4',
                    background: isActive ? 'rgba(79, 84, 92, 0.6)' : isHovered ? 'rgba(79, 84, 92, 0.3)' : 'transparent',
                    fontSize: '15px',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'all 0.1s ease',
                }}
                onClick={() => onChannelClick(channel.id)}
                onMouseEnter={() => setHoveredChannel(channel.id)}
                onMouseLeave={() => setHoveredChannel(null)}
            >
                {channel.type === 'text' && <HashIcon />}
                {channel.type === 'voice' && <VoiceIcon />}
                {channel.type === 'video' && <VideoIcon />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {channel.name}
                </span>
                {voiceState.streamingParticipants?.[channel.id]?.length > 0 && (
                    <span style={{
                        background: '#ED4245',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '4px',
                        marginLeft: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                    }}>
                        LIVE
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="channel-sidebar">
            {/* Header */}
            <div className="channel-sidebar-header">
                <span>{server.name}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
            </div>

            {/* Channels */}
            <div className="channel-sidebar-content">
                {uncategorized.map(renderChannel)}

                {categories.map((category) => {
                    const isCollapsed = collapsedCategories.has(category.id);
                    const childChannels = channels.filter(
                        c => c.parentId === category.id && c.type !== 'category'
                    );

                    return (
                        <React.Fragment key={category.id}>
                            <div
                                style={{
                                    padding: '16px 8px 4px 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#949BA4',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.02em',
                                    cursor: 'pointer',
                                }}
                                onClick={() => toggleCategory(category.id)}
                            >
                                <ChevronIcon expanded={!isCollapsed} />
                                <span>{category.name}</span>
                            </div>
                            {!isCollapsed && childChannels.map(renderChannel)}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Voice Status (if active) */}
            {voiceState.active && (
                <div
                    onClick={() => voiceState.threadId && onChannelClick(voiceState.threadId)}
                    style={{
                        background: '#232428',
                        padding: '8px',
                        borderTop: '1px solid #1E1F22',
                        cursor: 'pointer',
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
                            background: voiceState.status === 'connected' ? '#23A559' :
                                voiceState.status === 'error' ? '#ED4245' :
                                    '#FEE75C', // Yellow for connecting/reconnecting
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: voiceState.status === 'connected' ? '#23A559' :
                                    voiceState.status === 'error' ? '#ED4245' :
                                        '#FEE75C'
                            }}>
                                {voiceState.status === 'connected' ? 'Voice Connected' :
                                    voiceState.status === 'connecting' ? 'Connecting...' :
                                        voiceState.status === 'reconnecting' ? 'Reconnecting...' :
                                            voiceState.status === 'error' ? 'Connection Failed' :
                                                'Disconnected'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#949BA4' }}>
                                General Voice • Click to View
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Panel */}
            {user && (
                <div className="user-panel">
                    <Avatar
                        src={user.avatar}
                        name={user.name}
                        size={32}
                        status={user.status}
                    />
                    <div className="user-panel-info">
                        <div className="user-panel-name">{user.name}</div>
                        <div className="user-panel-status">Online</div>
                    </div>
                    <div className="user-panel-controls">
                        <button className="user-panel-btn" title="Mute">
                            <MicIcon />
                        </button>
                        <button className="user-panel-btn" title="Deafen">
                            <HeadphoneIcon />
                        </button>
                        <button className="user-panel-btn" title="Settings">
                            <SettingsIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
