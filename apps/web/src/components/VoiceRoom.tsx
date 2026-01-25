import { useEffect, useState, useCallback, useRef } from 'react';
import { livekit, Track, ConnectionState } from '@echorift/sdk';
import { useAppStore, type Thread } from '../store';
import { Avatar } from './Avatar';

// LiveKit token server config
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

interface VoiceRoomProps {
    thread: Thread;
    onLeave: () => void;
}

export function VoiceRoom({ thread, onLeave }: VoiceRoomProps) {
    const { setVoiceState, user } = useAppStore();
    const [lkState, setLkState] = useState(livekit.getState());
    const [error, setError] = useState<string | null>(null);
    const [localAudioLevel, setLocalAudioLevel] = useState(0);
    const audioAnalyserRef = useRef<AnalyserNode | null>(null);
    const frameRef = useRef<number>();

    const [showDeviceSelect, setShowDeviceSelect] = useState(false);

    // Subscribe to SDK state updates
    useEffect(() => {
        const unsubscribe = livekit.subscribe((state) => {
            setLkState(state);
            let status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' = 'disconnected';
            switch (state.connectionState) {
                case ConnectionState.Connected: status = 'connected'; break;
                case ConnectionState.Connecting: status = 'connecting'; break;
                case ConnectionState.Reconnecting: status = 'reconnecting'; break;
                case ConnectionState.Disconnected: status = 'disconnected'; break;
            }

            console.log('[VoiceRoom] LiveKit State Update:', { connectionState: state.connectionState, status });

            // Generate list of active streamers
            const streamers: string[] = [];
            state.screenShares.forEach(s => {
                if (s.participantName) streamers.push(s.participantName);
                else if (s.participantId) streamers.push(s.participantId);
            });

            // Add self if sharing
            if (state.isScreenSharing && user?.name) {
                streamers.push(user.name);
            }

            // Build connected participants list
            const connectedList: { id: string; name: string; streaming: boolean }[] = [];

            // Add remote participants
            state.participants.forEach(p => {
                const isStreaming = (p.name && streamers.includes(p.name)) || streamers.includes(p.identity);
                connectedList.push({
                    id: p.identity,
                    name: p.name || p.identity,
                    streaming: isStreaming
                });
            });

            // Add local user if connected
            if (status === 'connected' && user) {
                connectedList.push({
                    id: user.id,
                    name: user.name,
                    streaming: state.isScreenSharing
                });
            }

            // Sync with global store for other components to see status
            setVoiceState({
                status,
                muted: state.isMuted,
                deafened: state.isDeafened,
                screenSharing: state.isScreenSharing,
                streamingParticipants: {
                    [thread.id]: streamers
                },
                connectedParticipants: {
                    [thread.id]: connectedList
                }
            });
        });
        return unsubscribe;
    }, [setVoiceState]);

    // Token fetching logic
    const getToken = useCallback(async (identity: string, room: string) => {
        const res = await fetch(`${TOKEN_SERVER}/token?identity=${encodeURIComponent(identity)}&room=${encodeURIComponent(room)}`);
        if (!res.ok) throw new Error('Failed to get token');
        const data = await res.json();
        return data.token;
    }, []);

    // Connect to room
    useEffect(() => {
        let isMounted = true;

        const connect = async () => {
            try {
                const identity = user?.name || `user-${Date.now()}`;
                const roomName = thread.id;

                // Set initial connecting status
                setVoiceState({ status: 'connecting' });

                const token = await getToken(identity, roomName);

                if (!isMounted) return;

                await livekit.connect(token, roomName);
            } catch (err: any) {
                if (!isMounted) return;

                // Ignore disconnects that happen due to cleanup/remount
                if (err.message?.includes('Client initiated disconnect') ||
                    err.message?.includes('cancelled')) {
                    return;
                }

                console.error('Connection error:', err);
                const errorMessage = err instanceof Error ? err.message : 'Connection failed';
                setError(errorMessage);
                setVoiceState({ status: 'error', error: errorMessage });
            }
        };

        connect();

        return () => {
            isMounted = false;
            livekit.disconnect();
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [thread.id, getToken, user]);

    // Local Audio Analyser
    useEffect(() => {
        if (!lkState.localParticipant || !lkState.connected) return;

        const micPublication = lkState.localParticipant.getTrackPublication(Track.Source.Microphone);
        if (micPublication?.track?.mediaStreamTrack) {
            setupAudioAnalyser(micPublication.track.mediaStreamTrack);
        }
    }, [lkState.localParticipant, lkState.connected]);

    const setupAudioAnalyser = (mediaStreamTrack: MediaStreamTrack) => {
        try {
            if (audioAnalyserRef.current) return;

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
                frameRef.current = requestAnimationFrame(updateLevel);
            };
            updateLevel();
        } catch (err) {
            console.error('Failed to setup audio analyser:', err);
        }
    };

    // Derived state for UI
    const isConnecting = lkState.connecting;
    const isConnected = lkState.connected;

    // Actions
    const handleLeave = () => {
        livekit.disconnect();
        onLeave();
    };

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
                        {isConnecting ? 'Connecting...' : isConnected ? `${lkState.participants.length + (lkState.localParticipant ? 1 : 0)} connected` : 'Disconnected'}
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
            {(lkState.screenShares.length > 0 || lkState.isScreenSharing) && (
                <div style={{
                    flex: 2,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}>
                    {/* Local Screen Share Preview */}
                    {lkState.isScreenSharing && lkState.localParticipant && (
                        <div style={{
                            flex: 1,
                            position: 'relative',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '2px solid var(--accent)',
                            background: '#000',
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)',
                                fontSize: 14,
                                background: '#111'
                            }}>
                                You are sharing your screen
                            </div>
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
                                You (Screen)
                            </div>
                        </div>
                    )}

                    {lkState.screenShares.map((share) => (
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
            <div className="voice-grid" style={{
                flex: lkState.screenShares.length > 0 ? 0 : 1,
                minHeight: 200,
                padding: 'var(--spacing-md)', // Use variable spacing
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', // Auto-responsive grid
                gap: 'var(--spacing-md)',
                alignContent: 'center'
            }}>
                {/* Local Participant */}
                {lkState.localParticipant && (
                    <div
                        className={`voice-tile ${localAudioLevel > 0.1 ? 'speaking' : ''}`}
                        style={{
                            borderWidth: localAudioLevel > 0.1 ? 2 : 1,
                            borderColor: localAudioLevel > 0.1 ? 'var(--accent)' : undefined,
                            boxShadow: localAudioLevel > 0.1 ? '0 0 20px var(--accent-glow)' : undefined,
                        }}
                    >
                        <Avatar name={user?.name || 'You'} size={80} />
                        {!lkState.isMuted && (
                            <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                <AudioLevelMeter level={localAudioLevel} />
                            </div>
                        )}
                        <div className="voice-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {user?.name || 'You'} (You)
                            {lkState.isMuted && <span style={{ opacity: 0.6 }}><MicOffIcon /></span>}
                        </div>
                    </div>
                )}

                {/* Remote Participants */}
                {lkState.participants.map((p) => (
                    <div
                        key={p.identity}
                        className={`voice-tile ${p.isSpeaking ? 'speaking' : ''}`}
                        style={{
                            borderWidth: p.isSpeaking ? 2 : 1,
                            borderColor: p.isSpeaking ? 'var(--accent)' : undefined,
                            boxShadow: p.isSpeaking ? '0 0 20px var(--accent-glow)' : undefined,
                        }}
                    >
                        <Avatar name={p.identity} size={80} />
                        {!p.isMicrophoneEnabled && (
                            <div className="voice-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {p.identity}
                                <span style={{ opacity: 0.6 }}><MicOffIcon /></span>
                            </div>
                        )}
                        {p.isMicrophoneEnabled && (
                            <div className="voice-name">
                                {p.identity}
                            </div>
                        )}
                        {/* Note: AudioLevelMeter for remotes would require pulling audioLevel from p.audioLevel 
                            and forcing re-renders, or SDK emitting updates. SDK emits updates on active speakers. 
                            We simply use p.isSpeaking style for now. */}
                    </div>
                ))}

                {lkState.participants.length === 0 && !lkState.localParticipant && (
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
                flexWrap: 'wrap', // Allow wrapping on small screens
                gap: 12,
                padding: '16px 12px', // Reduce padding on mobile
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-elevated)',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <button
                    className={`voice-btn ${lkState.isMuted ? 'active' : ''}`}
                    onClick={() => livekit.toggleMute()}
                    title={lkState.isMuted ? 'Unmute' : 'Mute'}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: lkState.isMuted ? 'var(--status-busy)' : 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {lkState.isMuted ? <MicOffIcon /> : <MicIcon />}
                </button>

                <button
                    className={`voice-btn ${lkState.isDeafened ? 'active' : ''}`}
                    onClick={() => livekit.toggleDeafen()}
                    title={lkState.isDeafened ? 'Undeafen' : 'Deafen'}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: lkState.isDeafened ? 'var(--status-busy)' : 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <HeadphonesIcon />
                </button>

                <button
                    onClick={() => livekit.toggleScreenShare()}
                    title={lkState.isScreenSharing ? 'Stop sharing' : 'Share screen'}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: lkState.isScreenSharing ? 'var(--accent)' : 'var(--bg-hover)',
                        color: lkState.isScreenSharing ? 'white' : 'var(--text-primary)',
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
                    audioInputs={lkState.audioInputs}
                    audioOutputs={lkState.audioOutputs}
                    selectedInput={lkState.selectedAudioInput}
                    selectedOutput={lkState.selectedAudioOutput}
                    onInputChange={(id) => livekit.switchAudioInput(id)}
                    onOutputChange={(id) => livekit.switchAudioOutput(id)}
                    onClose={() => setShowDeviceSelect(false)}
                />
            )}
        </div>
    );
}
