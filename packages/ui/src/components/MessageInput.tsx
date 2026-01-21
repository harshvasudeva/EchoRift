import React, { useState, useRef, useEffect } from 'react';
import { CSSProperties } from 'react';

export interface MessageInputProps {
    placeholder?: string;
    disabled?: boolean;
    onSend: (content: string) => void;
    onTyping?: () => void;
    onAttachClick?: () => void;
    onEmojiClick?: () => void;
    onGifClick?: () => void;
}

const containerStyle: CSSProperties = {
    padding: '0 16px 24px',
};

const inputContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    background: '#383A40',
    borderRadius: '8px',
    padding: '4px 4px 4px 16px',
};

const textareaStyle: CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#DBDEE1',
    fontSize: '15px',
    lineHeight: '22px',
    resize: 'none',
    padding: '10px 0',
    maxHeight: '200px',
    fontFamily: 'inherit',
};

const buttonStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#B5BAC1',
    borderRadius: '4px',
    transition: 'color 0.15s ease',
};

const AttachIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z" />
    </svg>
);

const EmojiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM8.5 8C9.329 8 10 8.671 10 9.5C10 10.329 9.329 11 8.5 11C7.671 11 7 10.329 7 9.5C7 8.671 7.671 8 8.5 8ZM12 18C9.021 18 6.505 15.961 5.851 13.207C5.76 12.797 6.069 12.405 6.487 12.385C6.487 12.385 7.235 12.329 7.412 12.316C8.612 12.224 9.812 12.15 11.014 12.109C11.509 12.093 12.004 12.086 12.5 12.086C13.035 12.086 13.57 12.094 14.104 12.113C15.234 12.152 16.363 12.22 17.489 12.308C17.729 12.327 18.415 12.385 18.415 12.385C18.828 12.412 19.129 12.797 19.044 13.203C18.397 15.958 15.882 18 12.903 18H12ZM15.5 11C14.671 11 14 10.329 14 9.5C14 8.671 14.671 8 15.5 8C16.329 8 17 8.671 17 9.5C17 10.329 16.329 11 15.5 11Z" />
    </svg>
);

const GifIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 2H4.5C3.12 2 2 3.12 2 4.5V19.5C2 20.88 3.12 22 4.5 22H19.5C20.88 22 22 20.88 22 19.5V4.5C22 3.12 20.88 2 19.5 2ZM10 14.5C10 15.32 9.33 16 8.5 16H5.5C4.67 16 4 15.32 4 14.5V9.5C4 8.68 4.67 8 5.5 8H8.5C9.33 8 10 8.68 10 9.5V10H8V10C8 9.45 7.55 9 7 9H7C6.45 9 6 9.45 6 10V14C6 14.55 6.45 15 7 15H7C7.55 15 8 14.55 8 14V13H7V12H10V14.5ZM14 16H12V8H14V16ZM20 10H18V11H20V12H18V16H16V8H20V10Z" />
    </svg>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

export function MessageInput({
    placeholder = 'Message',
    disabled = false,
    onSend,
    onTyping,
    onAttachClick,
    onEmojiClick,
    onGifClick,
}: MessageInputProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);

        // Debounced typing indicator
        if (onTyping) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            onTyping();
            typingTimeoutRef.current = setTimeout(() => { }, 3000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        const trimmed = value.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            setValue('');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={inputContainerStyle}>
                <button
                    style={buttonStyle}
                    onClick={onAttachClick}
                    type="button"
                >
                    <AttachIcon />
                </button>

                <textarea
                    ref={textareaRef}
                    style={textareaStyle}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                />

                <button
                    style={buttonStyle}
                    onClick={onGifClick}
                    type="button"
                >
                    <GifIcon />
                </button>

                <button
                    style={buttonStyle}
                    onClick={onEmojiClick}
                    type="button"
                >
                    <EmojiIcon />
                </button>

                {value.trim() && (
                    <button
                        style={{
                            ...buttonStyle,
                            color: '#5865F2',
                        }}
                        onClick={handleSend}
                        type="button"
                    >
                        <SendIcon />
                    </button>
                )}
            </div>
        </div>
    );
}
