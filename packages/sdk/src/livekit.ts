// LiveKit integration for voice, video, and screen sharing

import {
    Room,
    RoomEvent,
    LocalParticipant,
    RemoteParticipant,
    Track,
    ConnectionState,
    RemoteAudioTrack,
    RemoteTrack,
    RemoteTrackPublication,
    Participant,

} from 'livekit-client';

export {
    Room,
    RoomEvent,
    LocalParticipant,
    RemoteParticipant,
    Track,
    ConnectionState,
    RemoteAudioTrack,
    RemoteTrack,
    RemoteTrackPublication,
    Participant,
};

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
    screenShares: ScreenShareInfo[];
    audioInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
    selectedAudioInput: string;
    selectedAudioOutput: string;
    connectionState: ConnectionState;
}

export interface ScreenShareInfo {
    participantId: string;
    participantName: string;
    track: MediaStreamTrack;

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
        screenShares: [],
        audioInputs: [],
        audioOutputs: [],
        selectedAudioInput: '',
        selectedAudioOutput: '',
        connectionState: ConnectionState.Disconnected,
    };

    constructor() {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
            this.loadDevices();
            navigator.mediaDevices.ondevicechange = () => this.loadDevices();
        }
    }

    private async loadDevices() {
        try {
            // Request permission first to get labels
            // Note: This might need to be triggered by user action in some browsers initially
            // But if we are already in a call, we have permissions.
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter(d => d.kind === 'audioinput');
            const audioOutputs = devices.filter(d => d.kind === 'audiooutput');

            this.updateState({ audioInputs, audioOutputs });
        } catch (error) {
            console.error('Failed to load devices', error);
        }
    }

    async switchAudioInput(deviceId: string) {
        this.updateState({ selectedAudioInput: deviceId });
        if (this.room && this.room.state === ConnectionState.Connected) {
            await this.room.switchActiveDevice('audioinput', deviceId);
        }
    }

    async switchAudioOutput(deviceId: string) {
        this.updateState({ selectedAudioOutput: deviceId });
        if (this.room) {
            await this.room.switchActiveDevice('audiooutput', deviceId);
        }
    }


    async connect(token: string, _channelId: string): Promise<void> {
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
                        { width: 180, height: 180, resolution: { width: 180, height: 180, frameRate: 15 }, encoding: { maxBitrate: 150_000 } },
                        { width: 360, height: 360, resolution: { width: 360, height: 360, frameRate: 30 }, encoding: { maxBitrate: 500_000 } },
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
                    const audioTrack = pub.track as RemoteAudioTrack;
                    audioTrack.setVolume(newDeafenedState ? 0 : 1);
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

        this.room.on(RoomEvent.ParticipantConnected, () => {
            this.updateState({
                participants: Array.from(this.room!.remoteParticipants.values()),
            });
        });

        this.room.on(RoomEvent.TrackMuted, () => {
            this.emitParticipantUpdate();
        });

        this.room.on(RoomEvent.TrackUnmuted, () => {
            this.emitParticipantUpdate();
        });

        this.room.on(RoomEvent.ActiveSpeakersChanged, () => {
            this.emitParticipantUpdate();
        });

        this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
            if (track.source === Track.Source.ScreenShare && track.kind === "video") {
                const newShare: ScreenShareInfo = {
                    participantId: participant.identity,
                    participantName: participant.identity,
                    track: track.mediaStreamTrack,
                };
                this.updateState({
                    screenShares: [...this.state.screenShares, newShare]
                });
            }
        });

        this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
            if (track.source === Track.Source.ScreenShare) {
                this.updateState({
                    screenShares: this.state.screenShares.filter(s => s.participantId !== participant.identity)
                });
            }
        });


        this.room.on(RoomEvent.ParticipantDisconnected, () => {
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
            this.updateState({ connectionState: state });
            if (state === ConnectionState.Disconnected) {
                this.updateState({ connected: false });
            }
        });
    }
    private emitParticipantUpdate() {
        if (!this.room) return;
        this.updateState({
            participants: Array.from(this.room.remoteParticipants.values()),
            localParticipant: this.room.localParticipant
        });
    }
}

export const livekit = new LiveKitClient();
export { LiveKitClient };
