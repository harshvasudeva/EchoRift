import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type Thread } from '../store';
import { Avatar } from './Avatar';

// Icons
const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const VideoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
);

const MoreIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

const AttachIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
);

const SmileIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

interface ChatViewProps {
    thread: Thread;
}

export function ChatView({ thread }: ChatViewProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { messages, addMessage, user } = useAppStore();
    const threadMessages = messages[thread.id] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [threadMessages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
        }
    }, [input]);

    const handleSend = () => {
        if (!input.trim() || !user) return;

        addMessage(thread.id, {
            id: `m${Date.now()}`,
            threadId: thread.id,
            senderId: user.id,
            sender: user,
            content: input.trim(),
            timestamp: new Date(),
            isOwn: true,
        });
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <main className="chat">
            {/* Header */}
            <header className="chat-header">
                <Avatar name={thread.name} size={36} status={thread.participants[0]?.status} />
                <div className="chat-header-info">
                    <div className="chat-header-name">{thread.name}</div>
                    <div className="chat-header-status">Active now</div>
                </div>
                <div className="chat-header-actions">
                    <button className="header-btn" title="Voice call">
                        <PhoneIcon />
                    </button>
                    <button className="header-btn primary" title="Video call">
                        <VideoIcon />
                    </button>
                    <button className="header-btn" title="More">
                        <MoreIcon />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="messages">
                <div className="date-divider">
                    <span>Today</span>
                </div>

                {threadMessages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.isOwn ? 'outgoing' : ''}`}>
                        {!msg.isOwn && (
                            <Avatar name={msg.sender?.name || 'User'} size={32} />
                        )}
                        <div className="message-bubble">
                            <div className="message-text">{msg.content}</div>
                            <div className="message-time">{formatTime(msg.timestamp)}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-area">
                <div className="input-wrapper">
                    <button className="input-btn" title="Attach file">
                        <AttachIcon />
                    </button>
                    <textarea
                        ref={textareaRef}
                        className="input-field"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button className="input-btn" title="Emoji">
                        <SmileIcon />
                    </button>
                    {input.trim() && (
                        <button className="input-btn send" onClick={handleSend} title="Send">
                            <SendIcon />
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
