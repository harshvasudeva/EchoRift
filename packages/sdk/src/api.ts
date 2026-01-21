// API Client for EchoRift Backend

import type {
    ApiResponse,
    PaginatedResponse,
    User,
    Server,
    Channel,
    Message,
    AuthTokens,
    LdapLoginRequest
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
    private accessToken: string | null = null;

    setAccessToken(token: string | null) {
        this.accessToken = token;
    }

    private async fetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.accessToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            return {
                data: null as T,
                success: false,
                error: error.message || `HTTP ${response.status}`
            };
        }

        const data = await response.json();
        return { data, success: true };
    }

    // Auth endpoints
    async login(credentials: LdapLoginRequest): Promise<ApiResponse<AuthTokens>> {
        return this.fetch<AuthTokens>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
        return this.fetch<AuthTokens>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    async logout(): Promise<ApiResponse<void>> {
        return this.fetch<void>('/auth/logout', { method: 'POST' });
    }

    // User endpoints
    async getCurrentUser(): Promise<ApiResponse<User>> {
        return this.fetch<User>('/users/@me');
    }

    async updateCurrentUser(data: Partial<User>): Promise<ApiResponse<User>> {
        return this.fetch<User>('/users/@me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Server endpoints
    async getServers(): Promise<ApiResponse<Server[]>> {
        return this.fetch<Server[]>('/servers');
    }

    async getServer(serverId: string): Promise<ApiResponse<Server>> {
        return this.fetch<Server>(`/servers/${serverId}`);
    }

    async createServer(data: { name: string; iconUrl?: string }): Promise<ApiResponse<Server>> {
        return this.fetch<Server>('/servers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Channel endpoints
    async getChannels(serverId: string): Promise<ApiResponse<Channel[]>> {
        return this.fetch<Channel[]>(`/servers/${serverId}/channels`);
    }

    async createChannel(serverId: string, data: { name: string; type: string }): Promise<ApiResponse<Channel>> {
        return this.fetch<Channel>(`/servers/${serverId}/channels`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Message endpoints
    async getMessages(
        channelId: string,
        params: { before?: string; limit?: number } = {}
    ): Promise<ApiResponse<PaginatedResponse<Message>>> {
        const query = new URLSearchParams();
        if (params.before) query.set('before', params.before);
        if (params.limit) query.set('limit', params.limit.toString());

        return this.fetch<PaginatedResponse<Message>>(
            `/channels/${channelId}/messages?${query.toString()}`
        );
    }

    async sendMessage(channelId: string, content: string): Promise<ApiResponse<Message>> {
        return this.fetch<Message>(`/channels/${channelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
    }
}

export const api = new ApiClient();
export { ApiClient };
