import React from 'react';
import { CSSProperties } from 'react';

export interface ChannelData {
    id: string;
    name: string;
    type: 'text' | 'voice' | 'video' | 'category';
    parentId?: string;
    unreadCount?: number;
    userCount?: number; // For voice channels
}

export interface ChannelListProps {
    serverName: string;
    channels: ChannelData[];
    activeChannelId?: string;
    onChannelClick: (channelId: string) => void;
    onSettingsClick?: () => void;
}

const containerStyle: CSSProperties = {
    width: '240px',
    height: '100%',
    background: '#2B2D31',
    display: 'flex',
    flexDirection: 'column',
};

const headerStyle: CSSProperties = {
    height: '48px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1F2023',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '15px',
    color: '#F2F3F5',
};

const channelsContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
};

const categoryStyle: CSSProperties = {
    padding: '16px 8px 4px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#949BA4',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    cursor: 'pointer',
};

const getChannelStyle = (isActive: boolean, isVoice: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 8px',
    margin: '1px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: isActive ? '#F2F3F5' : '#949BA4',
    background: isActive ? 'rgba(79, 84, 92, 0.6)' : 'transparent',
    fontSize: '15px',
    fontWeight: isActive ? 500 : 400,
    transition: 'all 0.1s ease',
});

// Icons
const HashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
        <path d="M5.88657 21.0001C5.70561 21.0001 5.57551 20.8424 5.61127 20.6655L6.29167 17.0001H3C2.44772 17.0001 2 16.5524 2 16.0001C2 15.4479 2.44772 15.0001 3 15.0001H6.63667L7.33333 11.0001H4C3.44772 11.0001 3 10.5524 3 10.0001C3 9.44784 3.44772 9.00012 4 9.00012H7.66667L8.36127 5.33472C8.43679 4.93331 8.79928 4.64844 9.20917 4.68306C9.61906 4.71767 9.94179 5.05499 9.94179 5.46672L9.33333 9.00012H13.6667L14.3613 5.33472C14.4368 4.93331 14.7993 4.64844 15.2092 4.68306C15.6191 4.71767 15.9418 5.05499 15.9418 5.46672L15.3333 9.00012H18.6667C19.219 9.00012 19.6667 9.44784 19.6667 10.0001C19.6667 10.5524 19.219 11.0001 18.6667 11.0001H15L14.3033 15.0001H17.6667C18.219 15.0001 18.6667 15.4479 18.6667 16.0001C18.6667 16.5524 18.219 17.0001 17.6667 17.0001H13.97L13.2754 20.6655C13.1999 21.0668 12.8374 21.3517 12.4276 21.3171C12.0177 21.2825 11.695 20.9452 11.695 20.5335L12.3033 17.0001H7.97L7.27537 20.6655C7.19986 21.0668 6.83737 21.3517 6.42747 21.3171C6.01758 21.2825 5.69486 20.9452 5.69486 20.5335L5.88657 21.0001ZM9 15.0001H13.3333L14 11.0001H9.66667L9 15.0001Z" />
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

const PersonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
    </svg>
);

export function ChannelList({
    serverName,
    channels,
    activeChannelId,
    onChannelClick,
    onSettingsClick,
}: ChannelListProps) {
    const [collapsedCategories, setCollapsedCategories] = React.useState<Set<string>>(new Set());

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

    // Group channels by category
    const categories = channels.filter(c => c.type === 'category');
    const uncategorized = channels.filter(c => c.type !== 'category' && !c.parentId);

    const renderChannel = (channel: ChannelData) => {
        const isActive = channel.id === activeChannelId;
        const isVoice = channel.type === 'voice' || channel.type === 'video';

        return (
            <div
                key={channel.id}
                style={getChannelStyle(isActive, isVoice)}
                onClick={() => onChannelClick(channel.id)}
            >
                {channel.type === 'text' && <HashIcon />}
                {channel.type === 'voice' && <VoiceIcon />}
                {channel.type === 'video' && <VideoIcon />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {channel.name}
                </span>
                {isVoice && channel.userCount !== undefined && channel.userCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px' }}>
                        <PersonIcon /> {channel.userCount}
                    </span>
                )}
                {channel.unreadCount !== undefined && channel.unreadCount > 0 && (
                    <span style={{
                        background: '#F23F43',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '8px',
                        minWidth: '16px',
                        textAlign: 'center',
                    }}>
                        {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle} onClick={onSettingsClick}>
                <span>{serverName}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
            </div>

            <div style={channelsContainerStyle}>
                {/* Uncategorized channels */}
                {uncategorized.map(renderChannel)}

                {/* Categorized channels */}
                {categories.map((category) => {
                    const isCollapsed = collapsedCategories.has(category.id);
                    const childChannels = channels.filter(
                        c => c.parentId === category.id && c.type !== 'category'
                    );

                    return (
                        <React.Fragment key={category.id}>
                            <div
                                style={categoryStyle}
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
        </div>
    );
}
