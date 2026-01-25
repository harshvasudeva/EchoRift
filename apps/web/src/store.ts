import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'busy' | 'offline';
}

export interface Workspace {
    id: string;
    name: string;
    icon?: string;
}

export interface Server {
    id: string;
    name: string;
    icon?: string;
}

export interface ServerMember {
    user: User;
    serverId: string;
    role: 'owner' | 'admin' | 'moderator' | 'member';
    joinedAt: Date;
}

export interface Channel {
    id: string;
    name: string;
    type: 'text' | 'voice' | 'video' | 'category';
    parentId?: string;
}

export interface Thread {
    id: string;
    type: 'direct' | 'group' | 'channel';
    name: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
    isVoice?: boolean;
}

export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    sender?: User;
    content: string;
    timestamp: Date;
    isOwn?: boolean;
}

export interface VoiceState {
    status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
    active: boolean;
    threadId: string | null;
    muted: boolean;
    deafened: boolean;
    videoOn: boolean;
    screenSharing: boolean;
    error?: string;
    streamingParticipants: Record<string, string[]>; // threadId -> list of streaming identity names
    connectedParticipants: Record<string, { id: string; name: string; streaming: boolean }[]>; // threadId -> list of connected users
}

// Theme Store
interface ThemeState {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark'
            })),
            setTheme: (theme) => set({ theme }),
        }),
        { name: 'echorift-theme' }
    )
);

// App Store
interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;

    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    setWorkspaces: (workspaces: Workspace[]) => void;
    setActiveWorkspace: (id: string | null) => void;

    threads: Thread[];
    activeThreadId: string | null;
    setThreads: (threads: Thread[]) => void;
    setActiveThread: (id: string | null) => void;

    messages: Record<string, Message[]>;
    addMessage: (threadId: string, message: Message) => void;
    setMessages: (threadId: string, messages: Message[]) => void;

    voiceState: VoiceState;
    setVoiceState: (updates: Partial<VoiceState>) => void;

    sidebarCollapsed: boolean;
    toggleSidebar: () => void;

    showMemberList: boolean;
    toggleMemberList: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    workspaces: [],
    activeWorkspaceId: null,
    setWorkspaces: (workspaces) => set({ workspaces }),
    setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

    threads: [],
    activeThreadId: null,
    setThreads: (threads) => set({ threads }),
    setActiveThread: (id) => set({ activeThreadId: id }),

    messages: {},
    addMessage: (threadId, message) => set((state) => ({
        messages: {
            ...state.messages,
            [threadId]: [...(state.messages[threadId] || []), message],
        },
    })),
    setMessages: (threadId, messages) => set((state) => ({
        messages: { ...state.messages, [threadId]: messages },
    })),

    voiceState: {
        status: 'disconnected',
        active: false,
        threadId: null,
        muted: false,
        deafened: false,
        videoOn: false,
        screenSharing: false,
        streamingParticipants: {},
        connectedParticipants: {},
    },
    setVoiceState: (updates) => set((state) => ({
        voiceState: { ...state.voiceState, ...updates },
    })),

    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    showMemberList: true,
    toggleMemberList: () => set((state) => ({ showMemberList: !state.showMemberList })),
}));

// Mock Data
export const MOCK_USER: User = {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex@echorift.io',
    status: 'online',
};

export const MOCK_WORKSPACES: Workspace[] = [
    { id: '1', name: 'EchoRift', icon: 'E' },
    { id: '2', name: 'Acme Corp', icon: 'A' },
    { id: '3', name: 'Design Team', icon: 'D' },
];

export const MOCK_USERS: User[] = [
    MOCK_USER,
    { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', status: 'online' },
    { id: '3', name: 'Marcus Johnson', email: 'marcus@company.com', status: 'away' },
    { id: '4', name: 'Elena Rodriguez', email: 'elena@company.com', status: 'busy' },
    { id: '5', name: 'David Park', email: 'david@company.com', status: 'offline' },
];

export const MOCK_SERVERS: Server[] = [
    { id: 's1', name: 'EchoRift Community', icon: 'E' },
    { id: 's2', name: 'Gaming Hub', icon: 'G' },
];

export const MOCK_SERVER_MEMBERS: ServerMember[] = [
    { user: MOCK_USERS[0], serverId: 's1', role: 'owner', joinedAt: new Date('2025-01-01') },
    { user: MOCK_USERS[1], serverId: 's1', role: 'admin', joinedAt: new Date('2025-01-05') },
    { user: MOCK_USERS[2], serverId: 's1', role: 'moderator', joinedAt: new Date('2025-01-10') },
    { user: MOCK_USERS[3], serverId: 's1', role: 'member', joinedAt: new Date('2025-01-15') },
    { user: MOCK_USERS[4], serverId: 's1', role: 'member', joinedAt: new Date('2025-01-20') },
    { user: MOCK_USERS[0], serverId: 's2', role: 'member', joinedAt: new Date('2025-02-01') },
    { user: MOCK_USERS[2], serverId: 's2', role: 'owner', joinedAt: new Date('2025-01-01') },
    { user: MOCK_USERS[4], serverId: 's2', role: 'admin', joinedAt: new Date('2025-01-10') },
];

export const MOCK_THREADS: Thread[] = [
    {
        id: 't1',
        type: 'direct',
        name: 'Sarah Chen',
        participants: [MOCK_USERS[1]],
        unreadCount: 3,
        lastMessage: {
            id: 'm1',
            threadId: 't1',
            senderId: '2',
            content: 'The new design looks amazing! When can we review?',
            timestamp: new Date(Date.now() - 300000),
        },
    },
    {
        id: 't2',
        type: 'group',
        name: 'Product Team',
        participants: MOCK_USERS.slice(1, 4),
        unreadCount: 0,
        lastMessage: {
            id: 'm2',
            threadId: 't2',
            senderId: '3',
            content: 'Sprint planning starts at 2pm',
            timestamp: new Date(Date.now() - 1800000),
        },
    },
    {
        id: 't3',
        type: 'channel',
        name: 'General',
        participants: MOCK_USERS,
        unreadCount: 12,
        lastMessage: {
            id: 'm3',
            threadId: 't3',
            senderId: '4',
            content: 'Welcome to the team, everyone!',
            timestamp: new Date(Date.now() - 7200000),
        },
    },
    {
        id: 'v1',
        type: 'channel',
        name: 'Voice Lounge',
        participants: MOCK_USERS.slice(0, 3),
        unreadCount: 0,
        isVoice: true,
    },
];

export const MOCK_MESSAGES: Message[] = [
    {
        id: 'm1',
        threadId: 't1',
        senderId: '2',
        sender: MOCK_USERS[1],
        content: 'Hey! Did you get a chance to look at the new mockups?',
        timestamp: new Date(Date.now() - 3600000),
    },
    {
        id: 'm2',
        threadId: 't1',
        senderId: '1',
        sender: MOCK_USER,
        content: 'Yes! They look incredible. The premium feel really comes through.',
        timestamp: new Date(Date.now() - 3400000),
        isOwn: true,
    },
    {
        id: 'm3',
        threadId: 't1',
        senderId: '2',
        sender: MOCK_USERS[1],
        content: 'The gold accent was a great choice. It really elevates the whole design.',
        timestamp: new Date(Date.now() - 3200000),
    },
    {
        id: 'm4',
        threadId: 't1',
        senderId: '1',
        sender: MOCK_USER,
        content: 'Absolutely. I think the glassmorphism adds a nice touch of luxury without being too flashy.',
        timestamp: new Date(Date.now() - 3000000),
        isOwn: true,
    },
];
