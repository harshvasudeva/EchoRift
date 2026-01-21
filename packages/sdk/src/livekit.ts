// LiveKit integration for voice, video, and screen sharing

import {
    Room,
    RoomEvent,
    LocalParticipant,
    RemoteParticipant,
    Track,
    ConnectionState,
    createLocalTracks,
    LocalTrack
} from 'livekit-client';

export type { Room, LocalParticipant, RemoteParticipant, Track };

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';

export interface VoiceChannelState {
    connected: boolean;
    connecting: boolean;
    participants: RemoteParticipant[];
    localParticipant: LocalParticipant | null;
    isMuted: boolean;
    isDeafened: boolean;
    isVideoOn: boolean;
    isScreenSharing: boolean;
}

class LiveKitClient {
    private room: Room | null = null;
    private stateListeners: Set<(state: VoiceChannelState) => void> = new Set();

    private state: VoiceChannelState = {
        connected: false,
        connecting: false,
        participants: [],
        localParticipant: null,
        isMuted: false,
        isDeafened: false,
        isVideoOn: false,
        isScreenSharing: false,
    };

    async connect(token: string, channelId: string): Promise<void> {
        if (this.room) {
            await this.disconnect();
        }

        this.updateState({ connecting: true });

        try {
            this.room = new Room({
                adaptiveStream: true,
                dynacast: true,
                // Optimize for low bandwidth
                videoCaptureDefaults: {
                    resolution: { width: 640, height: 360, frameRate: 24 },
                },
                publishDefaults: {
                    simulcast: true,
                    videoSimulcastLayers: [
                        { width: 180, height: 180, encoding: { maxBitrate: 150_000 } },
                        { width: 360, height: 360, encoding: { maxBitrate: 500_000 } },
                    ],
                    audioPreset: {
                        maxBitrate: 32_000, // 32 kbps for voice
                    },
                },
            });

            this.setupEventListeners();

            await this.room.connect(LIVEKIT_URL, token, {
                autoSubscribe: true,
            });

            // Enable audio by default
            await this.room.localParticipant.setMicrophoneEnabled(true);

            this.updateState({
                connected: true,
                connecting: false,
                localParticipant: this.room.localParticipant,
                participants: Array.from(this.room.remoteParticipants.values()),
            });

        } catch (error) {
            console.error('[EchoRift] Failed to connect to voice channel:', error);
            this.updateState({ connecting: false });
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.room) {
            await this.room.disconnect();
            this.room = null;

            this.updateState({
                connected: false,
                connecting: false,
                participants: [],
                localParticipant: null,
                isMuted: false,
                isDeafened: false,
                isVideoOn: false,
                isScreenSharing: false,
            });
        }
    }

    async toggleMute(): Promise<boolean> {
        if (!this.room) return false;

        const newMutedState = !this.state.isMuted;
        await this.room.localParticipant.setMicrophoneEnabled(!newMutedState);
        this.updateState({ isMuted: newMutedState });
        return newMutedState;
    }

    async toggleDeafen(): Promise<boolean> {
        if (!this.room) return false;

        const newDeafenedState = !this.state.isDeafened;

        // Mute all remote tracks
        this.room.remoteParticipants.forEach((participant) => {
            participant.audioTrackPublications.forEach((pub) => {
                if (pub.track) {
                    pub.track.setEnabled(!newDeafenedState);
                }
            });
        });

        this.updateState({ isDeafened: newDeafenedState });
        return newDeafenedState;
    }

    async toggleVideo(): Promise<boolean> {
        if (!this.room) return false;

        const newVideoState = !this.state.isVideoOn;
        await this.room.localParticipant.setCameraEnabled(newVideoState);
        this.updateState({ isVideoOn: newVideoState });
        return newVideoState;
    }

    async toggleScreenShare(): Promise<boolean> {
        if (!this.room) return false;

        const newScreenShareState = !this.state.isScreenSharing;
        await this.room.localParticipant.setScreenShareEnabled(newScreenShareState);
        this.updateState({ isScreenSharing: newScreenShareState });
        return newScreenShareState;
    }

    getState(): VoiceChannelState {
        return { ...this.state };
    }

    subscribe(listener: (state: VoiceChannelState) => void): () => void {
        this.stateListeners.add(listener);
        listener(this.state);
        return () => this.stateListeners.delete(listener);
    }

    private updateState(updates: Partial<VoiceChannelState>): void {
        this.state = { ...this.state, ...updates };
        this.stateListeners.forEach((listener) => listener(this.state));
    }

    private setupEventListeners(): void {
        if (!this.room) return;

        this.room.on(RoomEvent.ParticipantConnected, (participant) => {
            this.updateState({
                participants: Array.from(this.room!.remoteParticipants.values()),
            });
        });

        this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
            this.updateState({
                participants: Array.from(this.room!.remoteParticipants.values()),
            });
        });

        this.room.on(RoomEvent.Disconnected, () => {
            this.updateState({
                connected: false,
                participants: [],
            });
        });

        this.room.on(RoomEvent.ConnectionStateChanged, (state) => {
            if (state === ConnectionState.Disconnected) {
                this.updateState({ connected: false });
            }
        });
    }
}

export const livekit = new LiveKitClient();
export { LiveKitClient };
