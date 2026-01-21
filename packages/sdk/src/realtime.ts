// Real-time WebSocket client for EchoRift

import type { RealtimeEvent } from './types';

type EventHandler = (event: RealtimeEvent) => void;

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081';

class RealtimeClient {
    private ws: WebSocket | null = null;
    private handlers: Set<EventHandler> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private accessToken: string | null = null;

    setAccessToken(token: string | null) {
        this.accessToken = token;
    }

    connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        const url = this.accessToken
            ? `${WS_URL}?token=${encodeURIComponent(this.accessToken)}`
            : WS_URL;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('[EchoRift] WebSocket connected');
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            try {
                const data: RealtimeEvent = JSON.parse(event.data);
                this.handlers.forEach((handler) => handler(data));
            } catch (error) {
                console.error('[EchoRift] Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('[EchoRift] WebSocket closed:', event.code, event.reason);
            this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('[EchoRift] WebSocket error:', error);
        };
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[EchoRift] Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`[EchoRift] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(), delay);
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    subscribe(handler: EventHandler): () => void {
        this.handlers.add(handler);
        return () => this.handlers.delete(handler);
    }

    // Send typing indicator
    sendTyping(channelId: string): void {
        this.send({ type: 'TYPING_START', channelId });
    }

    // Join a voice channel
    joinVoice(channelId: string): void {
        this.send({ type: 'VOICE_JOIN', channelId });
    }

    // Leave voice channel
    leaveVoice(): void {
        this.send({ type: 'VOICE_LEAVE' });
    }

    // Update voice state
    updateVoiceState(updates: { muted?: boolean; deafened?: boolean }): void {
        this.send({ type: 'VOICE_STATE_UPDATE', ...updates });
    }

    private send(data: unknown): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('[EchoRift] WebSocket not connected, message not sent');
        }
    }
}

export const realtime = new RealtimeClient();
export { RealtimeClient };
