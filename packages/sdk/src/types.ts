// EchoRift Core Types

// User types
export interface User {
    id: string;
    ldapDn?: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    status: UserStatus;
    lastSeen?: Date;
}

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

// Organization types
export interface Organization {
    id: string;
    name: string;
    ldapBaseDn?: string;
    settings: OrganizationSettings;
}

export interface OrganizationSettings {
    allowGuestAccess: boolean;
    defaultChannelPermissions: ChannelPermissions;
}

// Server (Guild) types
export interface Server {
    id: string;
    organizationId: string;
    name: string;
    iconUrl?: string;
    ownerId: string;
    channels: Channel[];
    members: ServerMember[];
}

export interface ServerMember {
    userId: string;
    serverId: string;
    roles: string[];
    nickname?: string;
    joinedAt: Date;
}

// Channel types
export interface Channel {
    id: string;
    serverId: string;
    name: string;
    type: ChannelType;
    position: number;
    parentId?: string; // For category grouping
    topic?: string;
}

export type ChannelType = 'text' | 'voice' | 'video' | 'category';

export interface ChannelPermissions {
    canRead: boolean;
    canWrite: boolean;
    canSpeak: boolean;
    canVideo: boolean;
    canScreenShare: boolean;
    canManage: boolean;
}

// Message types
export interface Message {
    id: string;
    channelId: string;
    authorId: string;
    author?: User;
    content: string;
    attachments: Attachment[];
    reactions: Reaction[];
    createdAt: Date;
    editedAt?: Date;
    replyToId?: string;
}

export interface Attachment {
    id: string;
    filename: string;
    url: string;
    contentType: string;
    size: number;
}

export interface Reaction {
    emoji: string;
    count: number;
    userIds: string[];
}

// Voice state types
export interface VoiceState {
    channelId: string;
    userId: string;
    muted: boolean;
    deafened: boolean;
    selfMuted: boolean;
    selfDeafened: boolean;
    streaming: boolean;
    video: boolean;
}

// Real-time event types
export type RealtimeEvent =
    | { type: 'MESSAGE_CREATE'; payload: Message }
    | { type: 'MESSAGE_UPDATE'; payload: Message }
    | { type: 'MESSAGE_DELETE'; payload: { messageId: string; channelId: string } }
    | { type: 'TYPING_START'; payload: { channelId: string; userId: string } }
    | { type: 'PRESENCE_UPDATE'; payload: { userId: string; status: UserStatus } }
    | { type: 'VOICE_STATE_UPDATE'; payload: VoiceState }
    | { type: 'CHANNEL_CREATE'; payload: Channel }
    | { type: 'CHANNEL_UPDATE'; payload: Channel }
    | { type: 'CHANNEL_DELETE'; payload: { channelId: string } };

// API Response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Auth types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export interface LdapLoginRequest {
    username: string;
    password: string;
    organizationId?: string;
}
