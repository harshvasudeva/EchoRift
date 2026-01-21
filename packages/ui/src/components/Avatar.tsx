import React from 'react';
import { CSSProperties } from 'react';

export interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'idle' | 'dnd' | 'offline';
    className?: string;
    style?: CSSProperties;
}

const sizeMap: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 80,
    xl: 128,
};

const statusColors: Record<string, string> = {
    online: '#23A559',
    idle: '#F0B232',
    dnd: '#F23F43',
    offline: '#80848E',
};

export function Avatar({
    src,
    alt = 'Avatar',
    size = 'md',
    status,
    style
}: AvatarProps) {
    const dimension = sizeMap[size];

    const containerStyle: CSSProperties = {
        position: 'relative',
        width: dimension,
        height: dimension,
        flexShrink: 0,
        ...style,
    };

    const imageStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        background: '#5865F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: dimension * 0.4,
        fontWeight: 600,
    };

    const statusSize = Math.max(8, dimension * 0.25);
    const statusStyle: CSSProperties = {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: statusSize,
        height: statusSize,
        borderRadius: '50%',
        backgroundColor: status ? statusColors[status] : 'transparent',
        border: `3px solid #2B2D31`,
        boxSizing: 'content-box',
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div style={containerStyle}>
            {src ? (
                <img src={src} alt={alt} style={imageStyle} />
            ) : (
                <div style={imageStyle}>
                    {getInitials(alt || 'U')}
                </div>
            )}
            {status && <div style={statusStyle} />}
        </div>
    );
}
