import React from 'react';

interface AvatarProps {
    name: string;
    src?: string;
    size?: number;
    status?: 'online' | 'away' | 'busy' | 'offline';
}

export function Avatar({ name, src, size = 40, status }: AvatarProps) {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const fontSize = size * 0.4;

    return (
        <div
            className="avatar"
            style={{ width: size, height: size }}
        >
            {src ? (
                <img src={src} alt={name} className="avatar-img" />
            ) : (
                <div className="avatar-fallback" style={{ fontSize }}>
                    {initials}
                </div>
            )}
            {status && <div className={`avatar-status ${status}`} />}
        </div>
    );
}
