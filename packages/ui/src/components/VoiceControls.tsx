import React from 'react';
import { CSSProperties } from 'react';

export interface VoiceControlsProps {
    isMuted: boolean;
    isDeafened: boolean;
    isVideoOn?: boolean;
    isScreenSharing?: boolean;
    isConnected: boolean;
    onMuteToggle: () => void;
    onDeafenToggle: () => void;
    onVideoToggle?: () => void;
    onScreenShareToggle?: () => void;
    onDisconnect: () => void;
    onSettingsClick?: () => void;
    userName?: string;
    channelName?: string;
}

const containerStyle: CSSProperties = {
    background: '#232428',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid #1E1F22',
};

const connectionInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
};

const connectedDotStyle: CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#23A559',
};

const controlsRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const getButtonStyle = (isActive: boolean, isDanger?: boolean): CSSProperties => ({
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDanger ? '#F23F43' : isActive ? '#F23F43' : 'rgba(79, 84, 92, 0.4)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'all 0.15s ease',
});

// Icons
const MicIcon = ({ muted }: { muted: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        {muted ? (
            <>
                <path d="M12 3C10.34 3 9 4.37 9 6.07V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V6.07C15 4.37 13.66 3 12 3Z" />
                <path d="M19 12C19 15.53 16.39 18.44 13 18.93V21H16V23H8V21H11V18.93C7.61 18.44 5 15.53 5 12H7C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12H19Z" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
            </>
        ) : (
            <>
                <path d="M12 3C10.34 3 9 4.37 9 6.07V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V6.07C15 4.37 13.66 3 12 3Z" />
                <path d="M19 12C19 15.53 16.39 18.44 13 18.93V21H16V23H8V21H11V18.93C7.61 18.44 5 15.53 5 12H7C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12H19Z" />
            </>
        )}
    </svg>
);

const HeadphoneIcon = ({ deafened }: { deafened: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        {deafened ? (
            <>
                <path d="M12 2C6.48 2 2 6.48 2 12V20C2 21.1 2.9 22 4 22H6C7.1 22 8 21.1 8 20V16C8 14.9 7.1 14 6 14H4V12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12V14H18C16.9 14 16 14.9 16 16V20C16 21.1 16.9 22 18 22H20C21.1 22 22 21.1 22 20V12C22 6.48 17.52 2 12 2Z" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
            </>
        ) : (
            <path d="M12 2C6.48 2 2 6.48 2 12V20C2 21.1 2.9 22 4 22H6C7.1 22 8 21.1 8 20V16C8 14.9 7.1 14 6 14H4V12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12V14H18C16.9 14 16 14.9 16 16V20C16 21.1 16.9 22 18 22H20C21.1 22 22 21.1 22 20V12C22 6.48 17.52 2 12 2Z" />
        )}
    </svg>
);

const VideoIcon = ({ on }: { on: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        {on ? (
            <path d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L17 9.882V8C17 6.897 16.103 6 15 6H4C2.897 6 2 6.897 2 8V16C2 17.103 2.897 18 4 18H15C16.103 18 17 17.103 17 16V14.118L20.553 15.895C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z" />
        ) : (
            <>
                <path d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L17 9.882V8C17 6.897 16.103 6 15 6H4C2.897 6 2 6.897 2 8V16C2 17.103 2.897 18 4 18H15C16.103 18 17 17.103 17 16V14.118L20.553 15.895C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
            </>
        )}
    </svg>
);

const ScreenShareIcon = ({ on }: { on: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? '#23A559' : 'currentColor'}>
        <path d="M20 3H4C2.89 3 2 3.89 2 5V15C2 16.11 2.89 17 4 17H8V19H16V17H20C21.11 17 22 16.11 22 15V5C22 3.89 21.11 3 20 3ZM20 15H4V5H20V15ZM9 10H15V12H11V14L7 11L11 8V10Z" />
    </svg>
);

const DisconnectIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.7 12.71L16.42 12L21.71 17.29L20.29 18.71L15 13.41L9.71 18.71L8.29 17.29L13.59 12L8.29 6.71L9.71 5.29L15 10.59L20.29 5.29L21.71 6.71L16.42 12L15.7 12.71Z" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" />
    </svg>
);

export function VoiceControls({
    isMuted,
    isDeafened,
    isVideoOn = false,
    isScreenSharing = false,
    isConnected,
    onMuteToggle,
    onDeafenToggle,
    onVideoToggle,
    onScreenShareToggle,
    onDisconnect,
    onSettingsClick,
    userName = 'User',
    channelName,
}: VoiceControlsProps) {
    if (!isConnected) {
        return null;
    }

    return (
        <div style={containerStyle}>
            {channelName && (
                <div style={connectionInfoStyle}>
                    <div style={connectedDotStyle} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#23A559' }}>
                            Voice Connected
                        </div>
                        <div style={{ fontSize: '12px', color: '#949BA4' }}>
                            {channelName}
                        </div>
                    </div>
                </div>
            )}

            <div style={controlsRowStyle}>
                <button
                    style={getButtonStyle(isMuted)}
                    onClick={onMuteToggle}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    <MicIcon muted={isMuted} />
                </button>

                <button
                    style={getButtonStyle(isDeafened)}
                    onClick={onDeafenToggle}
                    title={isDeafened ? 'Undeafen' : 'Deafen'}
                >
                    <HeadphoneIcon deafened={isDeafened} />
                </button>

                {onVideoToggle && (
                    <button
                        style={getButtonStyle(!isVideoOn)}
                        onClick={onVideoToggle}
                        title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                    >
                        <VideoIcon on={isVideoOn} />
                    </button>
                )}

                {onScreenShareToggle && (
                    <button
                        style={getButtonStyle(false)}
                        onClick={onScreenShareToggle}
                        title={isScreenSharing ? 'Stop sharing' : 'Share your screen'}
                    >
                        <ScreenShareIcon on={isScreenSharing} />
                    </button>
                )}

                <button
                    style={getButtonStyle(false, true)}
                    onClick={onDisconnect}
                    title="Disconnect"
                >
                    <DisconnectIcon />
                </button>

                {onSettingsClick && (
                    <button
                        style={{
                            ...getButtonStyle(false),
                            marginLeft: 'auto',
                        }}
                        onClick={onSettingsClick}
                        title="User Settings"
                    >
                        <SettingsIcon />
                    </button>
                )}
            </div>
        </div>
    );
}
