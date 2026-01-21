import React, { useState } from 'react';

interface ServerIconProps {
    id: string;
    name: string;
    iconUrl?: string | null;
    isActive?: boolean;
    hasNotification?: boolean;
    onClick?: () => void;
}

interface ServerListProps {
    servers: ServerIconProps[];
    activeServerId?: string;
    onServerClick: (serverId: string) => void;
    onCreateServer?: () => void;
    onHomeClick?: () => void;
}

export function ServerList({
    servers,
    activeServerId,
    onServerClick,
    onCreateServer,
    onHomeClick,
}: ServerListProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const getIconStyle = (id: string, isActive: boolean) => ({
        width: '48px',
        height: '48px',
        borderRadius: isActive || hoveredId === id ? '16px' : '50%',
        background: id === 'home'
            ? (isActive ? '#5865F2' : '#313338')
            : '#313338',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        overflow: 'hidden',
        color: isActive || hoveredId === id ? '#fff' : '#DBDEE1',
        fontSize: '18px',
        fontWeight: 600,
    });

    const pillStyle = (isActive: boolean, hasNotification?: boolean) => ({
        position: 'absolute' as const,
        left: '-4px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '8px',
        height: isActive ? '40px' : hasNotification ? '8px' : '0px',
        borderRadius: '0 4px 4px 0',
        background: '#fff',
        transition: 'all 0.15s ease',
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 3);
    };

    return (
        <div style={{
            width: '72px',
            height: '100%',
            background: '#1E1F22',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 0',
            gap: '8px',
            overflowY: 'auto',
        }}>
            {/* Home Button */}
            <div
                style={{ position: 'relative', width: '48px', height: '48px' }}
                onMouseEnter={() => setHoveredId('home')}
                onMouseLeave={() => setHoveredId(null)}
                onClick={onHomeClick}
            >
                <div style={pillStyle(!activeServerId, false)} />
                <div style={getIconStyle('home', !activeServerId)}>
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
                        <path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0295 1.4184C10.8251 0.934541 10.5939 0.461742 10.3417 0C8.49074 0.320077 6.68674 0.881839 4.97529 1.67956C1.42976 6.77397 0.413156 11.7339 0.921273 16.6232C2.91049 18.1143 5.1729 19.2457 7.5812 19.9645C8.13242 19.2247 8.62515 18.4406 9.05317 17.6188C8.25296 17.3339 7.47895 16.9861 6.73807 16.5789C6.93762 16.4342 7.13233 16.2873 7.32216 16.1381C11.6629 18.1512 16.411 18.1512 20.6933 16.1381C20.885 16.2873 21.0797 16.4342 21.2774 16.5789C20.5365 16.9861 19.7625 17.3339 18.9623 17.6188C19.3923 18.4406 19.8854 19.2247 20.4349 19.9645C22.8432 19.2457 25.1056 18.1143 27.0948 16.6232C27.6965 10.8939 26.2056 5.98628 23.0212 1.67671Z" />
                    </svg>
                </div>
            </div>

            {/* Separator */}
            <div style={{
                width: '32px',
                height: '2px',
                background: '#35363C',
                borderRadius: '1px',
                margin: '4px 0',
            }} />

            {/* Server Icons */}
            {servers.map((server) => {
                const isActive = server.id === activeServerId;
                return (
                    <div
                        key={server.id}
                        style={{ position: 'relative', width: '48px', height: '48px' }}
                        onMouseEnter={() => setHoveredId(server.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => onServerClick(server.id)}
                    >
                        <div style={pillStyle(isActive, server.hasNotification)} />
                        <div style={getIconStyle(server.id, isActive)}>
                            {server.iconUrl ? (
                                <img
                                    src={server.iconUrl}
                                    alt={server.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                getInitials(server.name)
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Add Server Button */}
            <div
                style={{ position: 'relative', width: '48px', height: '48px' }}
                onMouseEnter={() => setHoveredId('add')}
                onMouseLeave={() => setHoveredId(null)}
                onClick={onCreateServer}
            >
                <div style={{
                    ...getIconStyle('add', false),
                    color: hoveredId === 'add' ? '#23A559' : '#23A559',
                    background: hoveredId === 'add' ? '#23A559' : '#313338',
                }}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={hoveredId === 'add' ? '#fff' : '#23A559'}
                    >
                        <path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
