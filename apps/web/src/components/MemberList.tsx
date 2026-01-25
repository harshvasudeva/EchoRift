import { useMemo } from 'react';
import { Avatar } from './Avatar';
import { MOCK_SERVER_MEMBERS } from '../store';

interface MemberListProps {
    serverId: string;
}

export function MemberList({ serverId }: MemberListProps) {
    // Filter members for this specific server
    const serverMembers = useMemo(() => {
        return MOCK_SERVER_MEMBERS.filter(member => member.serverId === serverId);
    }, [serverId]);

    // Group members by online/offline status
    const onlineMembers = useMemo(() => {
        return serverMembers.filter(m => m.user.status !== 'offline');
    }, [serverMembers]);

    const offlineMembers = useMemo(() => {
        return serverMembers.filter(m => m.user.status === 'offline');
    }, [serverMembers]);

    return (
        <div className="member-list">
            {/* Online Members */}
            <div className="member-list-section">
                <div className="member-list-header">
                    Online — {onlineMembers.length}
                </div>
                {onlineMembers.map((member) => (
                    <div key={member.user.id} className="member-item">
                        <Avatar
                            src={member.user.avatar}
                            name={member.user.name}
                            size={32}
                            status={member.user.status}
                        />
                        <span className="member-name">{member.user.name}</span>
                        {member.role !== 'member' && (
                            <span className={`member-role member-role-${member.role}`}>{member.role}</span>
                        )}
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
                        <div key={member.user.id} className="member-item">
                            <Avatar
                                src={member.user.avatar}
                                name={member.user.name}
                                size={32}
                                status={member.user.status}
                            />
                            <span className="member-name" style={{ opacity: 0.5 }}>{member.user.name}</span>
                            {member.role !== 'member' && (
                                <span className={`member-role member-role-${member.role}`}>{member.role}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
