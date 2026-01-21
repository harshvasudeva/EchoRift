import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Room,
    RoomEvent,
    Track,
    ConnectionState,
    createLocalAudioTrack,
    createLocalVideoTrack,
    LocalAudioTrack,
} from 'livekit-client';
import { useAppStore, type Thread } from '../store';
import { Avatar } from './Avatar';

// LiveKit server config
const LIVEKIT_URL = 'ws://localhost:7880';
const TOKEN_SERVER = 'http://localhost:3001';

// Icons
const MicIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
);

const MicOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
        <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
        <path d="M12 19v4M8 23h8" />
    </svg>
);

const HeadphonesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
);

const ScreenShareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);

const PhoneOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

// Audio Level Meter component
function AudioLevelMeter({ level }: { level: number }) {
    const bars = 5;
    const activeColor = 'var(--status-online)';

    return (
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 16 }}>
            {Array.from({ length: bars }).map((_, i) => {
                const threshold = (i + 1) / bars;
                const isActive = level >= threshold * 0.5;
                return (
                    <div
                        key={i}
                        style={{
                            width: 4,
                            height: 6 + i * 2,
                            borderRadius: 2,
                            background: isActive ? activeColor : 'var(--bg-active)',
                            transition: 'background 0.1s',
                        }}
                    />
                );
            })}
        </div>
    );
}

// Video Track component for screen sharing
interface VideoTrackProps {
    track: MediaStreamTrack;
    style?: React.CSSProperties;
}

function VideoTrack({ track, style }: VideoTrackProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        const stream = new MediaStream([track]);
        videoEl.srcObject = stream;
        videoEl.play().catch(console.error);

        return () => {
            videoEl.srcObject = null;
        };
    }, [track]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background: '#000',
                borderRadius: 'var(--radius-lg)',
                ...style,
            }}
        />
    );
}

// Screen Share info
interface ScreenShareInfo {
    participantId: string;
    participantName: string;
    track: MediaStreamTrack;
}

// Device Selection Modal
interface DeviceSelectProps {
    audioInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
    selectedInput: string;
    selectedOutput: string;
    onInputChange: (deviceId: string) => void;
    onOutputChange: (deviceId: string) => void;
    onClose: () => void;
}

function DeviceSelectModal({
    audioInputs,
    audioOutputs,
    selectedInput,
    selectedOutput,
    onInputChange,
    onOutputChange,
    onClose,
}: DeviceSelectProps) {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }} onClick={onClose}>
            <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                padding: 24,
                width: 400,
                maxWidth: '90vw',
                border: '1px solid var(--border-default)',
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>Audio Settings</h3>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                        Microphone
                    </label>
                    <select
                        value={selectedInput}
                        onChange={(e) => onInputChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--bg-overlay)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 14,
                        }}
                    >
                        {audioInputs.map((d) => (
                            <option key={d.deviceId} value={d.deviceId}>
                                {d.label || `Microphone ${d.deviceId.slice(0, 8)}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                        Speaker
                    </label>
                    <select
                        value={selectedOutput}
                        onChange={(e) => onOutputChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--bg-overlay)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 14,
                        }}
                    >
                        {audioOutputs.map((d) => (
                            <option key={d.deviceId} value={d.deviceId}>
                                {d.label || `Speaker ${d.deviceId.slice(0, 8)}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 500,
                    }}
                >
                    Done
                </button>
            </div>
        </div>
    );
}

interface ParticipantInfo {
    identity: string;
    isSpeaking: boolean;
    isMuted: boolean;
    audioLevel: number;
}

interface VoiceRoomProps {
    thread: Thread;
    onLeave: () => void;
}

export function VoiceRoom({ thread, onLeave }: VoiceRoomProps) {
    const { voiceState, setVoiceState, user } = useAppStore();
    const roomRef = useRef<Room | null>(null);
    const audioAnalyserRef = useRef<AnalyserNode | null>(null);

    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
    const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [localAudioLevel, setLocalAudioLevel] = useState(0);

    // Device selection
    const [showDeviceSelect, setShowDeviceSelect] = useState(false);
    const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
    const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
    const [selectedInput, setSelectedInput] = useState('');
    const [selectedOutput, setSelectedOutput] = useState('');

    // Screen sharing
    const [screenShares, setScreenShares] = useState<ScreenShareInfo[]>([]);

    // Load available devices
    useEffect(() => {
        const loadDevices = async () => {
            try {
                // Request permission first
                await navigator.mediaDevices.getUserMedia({ audio: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                setAudioInputs(devices.filter(d => d.kind === 'audioinput'));
                setAudioOutputs(devices.filter(d => d.kind === 'audiooutput'));
            } catch (err) {
                console.error('Failed to enumerate devices:', err);
            }
        };
        loadDevices();
    }, []);

    // Fetch token from server
    const getToken = useCallback(async (identity: string, room: string) => {
        const res = await fetch(`${TOKEN_SERVER}/token?identity=${encodeURIComponent(identity)}&room=${encodeURIComponent(room)}`);
        if (!res.ok) throw new Error('Failed to get token');
        const data = await res.json();
        return data.token;
    }, []);

    // Update participants list
    const updateParticipants = useCallback(() => {
        const room = roomRef.current;
        if (!room) return;

        const allParticipants: ParticipantInfo[] = [];

        // Local participant
        const local = room.localParticipant;
        allParticipants.push({
            identity: local.identity || user?.name || 'You',
            isSpeaking: local.isSpeaking,
            isMuted: !local.isMicrophoneEnabled,
            audioLevel: localAudioLevel,
        });

        // Remote participants
        room.remoteParticipants.forEach((participant) => {
            allParticipants.push({
                identity: participant.identity,
                isSpeaking: participant.isSpeaking,
                isMuted: !participant.isMicrophoneEnabled,
                audioLevel: participant.audioLevel,
            });
        });

        setParticipants(allParticipants);
    }, [user, localAudioLevel]);

    // Connect to room - only reconnect when thread.id changes
    useEffect(() => {
        // Use refs to access latest values without adding them to deps
        const currentUser = user;

        const room = new Room({
            adaptiveStream: true,
            dynacast: true,
            audioCaptureDefaults: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });
        roomRef.current = room;

        // Update participants function that uses the room ref
        const refreshParticipants = () => {
            if (!roomRef.current) return;
            const r = roomRef.current;

            const allParticipants: ParticipantInfo[] = [];
            const local = r.localParticipant;
            allParticipants.push({
                identity: local.identity || currentUser?.name || 'You',
                isSpeaking: local.isSpeaking,
                isMuted: !local.isMicrophoneEnabled,
                audioLevel: local.audioLevel,
            });

            r.remoteParticipants.forEach((participant) => {
                allParticipants.push({
                    identity: participant.identity,
                    isSpeaking: participant.isSpeaking,
                    isMuted: !participant.isMicrophoneEnabled,
                    audioLevel: participant.audioLevel,
                });
            });

            setParticipants(allParticipants);
        };

        // Event handlers
        room.on(RoomEvent.ConnectionStateChanged, (state) => {
            setConnectionState(state);
            setError(null);
            if (state === ConnectionState.Connected) {
                refreshParticipants();
            }
        });

        room.on(RoomEvent.ParticipantConnected, refreshParticipants);
        room.on(RoomEvent.ParticipantDisconnected, refreshParticipants);
        room.on(RoomEvent.TrackMuted, refreshParticipants);
        room.on(RoomEvent.TrackUnmuted, refreshParticipants);
        room.on(RoomEvent.ActiveSpeakersChanged, refreshParticipants);

        room.on(RoomEvent.LocalTrackPublished, (publication) => {
            if (publication.track?.kind === 'audio') {
                setupAudioAnalyser(publication.track.mediaStreamTrack);
            }
        });

        // Handle screen share tracks from remote participants
        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
            if (track.source === Track.Source.ScreenShare && track.kind === 'video') {
                setScreenShares(prev => [...prev, {
                    participantId: participant.identity,
                    participantName: participant.identity,
                    track: track.mediaStreamTrack,
                }]);
            }
        });

        room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
            if (track.source === Track.Source.ScreenShare) {
                setScreenShares(prev => prev.filter(s => s.participantId !== participant.identity));
            }
        });

        // Handle local screen share status
        room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
            if (publication.source === Track.Source.ScreenShare) {
                setVoiceState({ screenSharing: false });
            }
        });

        // Speaking indicator update
        const speakingInterval = setInterval(refreshParticipants, 100);

        // Connect
        const connect = async () => {
            try {
                const identity = currentUser?.name || `user-${Date.now()}`;
                const roomName = thread.id;
                const token = await getToken(identity, roomName);

                await room.connect(LIVEKIT_URL, token);
                await room.localParticipant.setMicrophoneEnabled(true);
                await room.localParticipant.setCameraEnabled(false);
            } catch (err) {
                console.error('Connection error:', err);
                setError(err instanceof Error ? err.message : 'Connection failed');
            }
        };

        connect();

        return () => {
            clearInterval(speakingInterval);
            room.disconnect();
            roomRef.current = null;
        };
    }, [thread.id, getToken]); // Only reconnect when thread changes

    // Set up audio analyser for visualizing local audio
    const setupAudioAnalyser = (mediaStreamTrack: MediaStreamTrack) => {
        try {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
            source.connect(analyser);
            audioAnalyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                if (!audioAnalyserRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                setLocalAudioLevel(average / 255);
                requestAnimationFrame(updateLevel);
            };
            updateLevel();
        } catch (err) {
            console.error('Failed to setup audio analyser:', err);
        }
    };

    // Toggle mute
    const toggleMute = async () => {
        const room = roomRef.current;
        if (!room) return;

        const newMuted = !voiceState.muted;
        await room.localParticipant.setMicrophoneEnabled(!newMuted);
        setVoiceState({ muted: newMuted });
        updateParticipants();
    };

    // Toggle deafen
    const toggleDeafen = () => {
        const newDeafened = !voiceState.deafened;
        setVoiceState({ deafened: newDeafened });

        const room = roomRef.current;
        if (room) {
            room.remoteParticipants.forEach((p) => {
                p.audioTrackPublications.forEach((pub) => {
                    if (pub.track) {
                        pub.track.setMuted(newDeafened);
                    }
                });
            });
        }
    };

    // Screen share
    const toggleScreenShare = async () => {
        const room = roomRef.current;
        if (!room) return;

        try {
            if (voiceState.screenSharing) {
                await room.localParticipant.setScreenShareEnabled(false);
                setVoiceState({ screenSharing: false });
            } else {
                await room.localParticipant.setScreenShareEnabled(true);
                setVoiceState({ screenSharing: true });
            }
        } catch (err) {
            console.error('Screen share error:', err);
        }
    };

    // Change input device
    const handleInputChange = async (deviceId: string) => {
        setSelectedInput(deviceId);
        const room = roomRef.current;
        if (room && room.state === ConnectionState.Connected) {
            await room.switchActiveDevice('audioinput', deviceId);
        }
    };

    // Change output device  
    const handleOutputChange = async (deviceId: string) => {
        setSelectedOutput(deviceId);
        const room = roomRef.current;
        if (room) {
            await room.switchActiveDevice('audiooutput', deviceId);
        }
    };

    // Handle leave
    const handleLeave = () => {
        roomRef.current?.disconnect();
        onLeave();
    };

    const isConnecting = connectionState === ConnectionState.Connecting;
    const isConnected = connectionState === ConnectionState.Connected;

    return (
        <div className="chat" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="chat-header">
                <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: isConnected ? 'var(--status-online)' : isConnecting ? 'var(--status-away)' : 'var(--status-busy)',
                    animation: isConnecting ? 'pulse 1s infinite' : undefined,
                }} />
                <div className="chat-header-info">
                    <div className="chat-header-name">{thread.name}</div>
                    <div className="chat-header-status" style={{ color: 'var(--text-secondary)' }}>
                        {isConnecting ? 'Connecting...' : isConnected ? `${participants.length} connected` : 'Disconnected'}
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button
                        className="header-btn"
                        title="Audio Settings"
                        onClick={() => setShowDeviceSelect(true)}
                    >
                        <SettingsIcon />
                    </button>
                </div>
            </header>

            {/* Connection status indicator */}
            {error && (
                <div style={{
                    padding: '8px 16px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: 'var(--status-away)',
                    textAlign: 'center',
                    fontSize: 12,
                    borderBottom: '1px solid var(--border-subtle)',
                }}>
                    ⚠️ {error} - retrying...
                </div>
            )}
            {/* Screen Share Viewer */}
            {screenShares.length > 0 && (
                <div style={{
                    flex: 2,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}>
                    {screenShares.map((share) => (
                        <div key={share.participantId} style={{
                            flex: 1,
                            position: 'relative',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '2px solid var(--accent)',
                            background: '#000',
                        }}>
                            <VideoTrack track={share.track} />
                            <div style={{
                                position: 'absolute',
                                bottom: 12,
                                left: 12,
                                background: 'rgba(0,0,0,0.7)',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 13,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                                <ScreenShareIcon />
                                {share.participantName}'s screen
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Participants Grid */}
            <div className="voice-grid" style={{ flex: screenShares.length > 0 ? 0 : 1, minHeight: 200, padding: 24 }}>
                {participants.map((p, i) => {
                    const isLocal = i === 0;
                    const level = isLocal ? localAudioLevel : p.audioLevel;

                    return (
                        <div
                            key={p.identity}
                            className={`voice-tile ${p.isSpeaking || level > 0.1 ? 'speaking' : ''}`}
                            style={{
                                borderWidth: p.isSpeaking || level > 0.1 ? 2 : 1,
                                borderColor: p.isSpeaking || level > 0.1 ? 'var(--accent)' : undefined,
                                boxShadow: p.isSpeaking || level > 0.1 ? '0 0 20px var(--accent-glow)' : undefined,
                                transition: 'all 0.1s ease',
                            }}
                        >
                            <Avatar name={p.identity} size={80} />

                            {/* Audio level indicator */}
                            {!p.isMuted && (
                                <div style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                }}>
                                    <AudioLevelMeter level={level} />
                                </div>
                            )}

                            <div className="voice-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {p.identity}
                                {p.isMuted && (
                                    <span style={{ opacity: 0.6, display: 'flex' }}>
                                        <MicOffIcon />
                                    </span>
                                )}
                                {isLocal && <span style={{ fontSize: 11, opacity: 0.6 }}>(You)</span>}
                            </div>
                        </div>
                    );
                })}

                {participants.length === 0 && (
                    <div className="voice-tile" style={{ opacity: 0.5 }}>
                        <div style={{ color: 'var(--text-secondary)' }}>
                            {isConnecting ? 'Connecting...' : 'No participants'}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            <div className="voice-bar" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                padding: 20,
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-elevated)',
            }}>
                <button
                    className={`voice-btn ${voiceState.muted ? 'active' : ''}`}
                    onClick={toggleMute}
                    title={voiceState.muted ? 'Unmute' : 'Mute'}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: voiceState.muted ? 'var(--status-busy)' : 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {voiceState.muted ? <MicOffIcon /> : <MicIcon />}
                </button>

                <button
                    className={`voice-btn ${voiceState.deafened ? 'active' : ''}`}
                    onClick={toggleDeafen}
                    title={voiceState.deafened ? 'Undeafen' : 'Deafen'}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: voiceState.deafened ? 'var(--status-busy)' : 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <HeadphonesIcon />
                </button>

                <button
                    onClick={toggleScreenShare}
                    title={voiceState.screenSharing ? 'Stop sharing' : 'Share screen'}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: voiceState.screenSharing ? 'var(--accent)' : 'var(--bg-hover)',
                        color: voiceState.screenSharing ? 'white' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ScreenShareIcon />
                </button>

                <button
                    onClick={handleLeave}
                    title="Leave call"
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'var(--status-busy)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <PhoneOffIcon />
                </button>
            </div>

            {/* Device Selection Modal */}
            {showDeviceSelect && (
                <DeviceSelectModal
                    audioInputs={audioInputs}
                    audioOutputs={audioOutputs}
                    selectedInput={selectedInput}
                    selectedOutput={selectedOutput}
                    onInputChange={handleInputChange}
                    onOutputChange={handleOutputChange}
                    onClose={() => setShowDeviceSelect(false)}
                />
            )}
        </div>
    );
}
