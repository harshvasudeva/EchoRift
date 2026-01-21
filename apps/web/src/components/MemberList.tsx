import React from 'react';
import { Avatar } from './Avatar';
import { MOCK_USER } from '../store';

interface MemberListProps {
    serverId: string;
}

// Mock members for development
const MOCK_MEMBERS = [
    { ...MOCK_USER, role: 'owner' },
    { id: '2', username: 'jane', displayName: 'Jane Smith', status: 'online' as const, role: 'admin' },
    { id: '3', username: 'bob', displayName: 'Bob Wilson', status: 'idle' as const, role: 'member' },
    { id: '4', username: 'alice', displayName: 'Alice Johnson', status: 'dnd' as const, role: 'member' },
    { id: '5', username: 'charlie', displayName: 'Charlie Brown', status: 'offline' as const, role: 'member' },
];

export function MemberList({ serverId }: MemberListProps) {
    const onlineMembers = MOCK_MEMBERS.filter(m => m.status !== 'offline');
    const offlineMembers = MOCK_MEMBERS.filter(m => m.status === 'offline');

    return (
        <div className="member-list">
            {/* Online Members */}
            <div className="member-list-section">
                <div className="member-list-header">
                    Online — {onlineMembers.length}
                </div>
                {onlineMembers.map((member) => (
                    <div key={member.id} className="member-item">
                        <Avatar
                            src={member.avatarUrl}
                            alt={member.displayName}
                            size="sm"
                            status={member.status}
                        />
                        <span className="member-name">{member.displayName}</span>
                    </div>
                ))}
            </div>

            {/* Offline Members */}
            {offlineMembers.length > 0 && (
                <div className="member-list-section">
                    <div className="member-list-header">
                        Offline — {offlineMembers.length}
                    </div>
                    {offlineMembers.map((member) => (
                        <div key={member.id} className="member-item">
                            <Avatar
                                src={member.avatarUrl}
                                alt={member.displayName}
                                size="sm"
                                status={member.status}
                            />
                            <span className="member-name" style={{ opacity: 0.5 }}>{member.displayName}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
