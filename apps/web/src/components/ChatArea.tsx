import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type Channel, type Message } from '../store';
import { Avatar } from './Avatar';

interface ChatAreaProps {
    channel: Channel;
}

// Icons
const HashIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="chat-header-icon">
        <path d="M5.88657 21C5.70561 21 5.57551 20.8424 5.61127 20.6655L6.29167 17H3C2.44772 17 2 16.5523 2 16C2 15.4477 2.44772 15 3 15H6.63667L7.33333 11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H7.66667L8.36127 5.33453C8.43679 4.93331 8.79928 4.64844 9.20917 4.68306C9.61906 4.71767 9.94179 5.05499 9.94179 5.46672L9.33333 9H13.6667L14.3613 5.33453C14.4368 4.93331 14.7993 4.64844 15.2092 4.68306C15.6191 4.71767 15.9418 5.05499 15.9418 5.46672L15.3333 9H18.6667C19.219 9 19.6667 9.44772 19.6667 10C19.6667 10.5523 19.219 11 18.6667 11H15L14.3033 15H17.6667C18.219 15 18.6667 15.4477 18.6667 16C18.6667 16.5523 18.219 17 17.6667 17H13.97L13.2754 20.6655C13.1999 21.0668 12.8374 21.3517 12.4276 21.3171C12.0177 21.2825 11.695 20.9452 11.695 20.5335L12.3033 17H7.97L7.27537 20.6655C7.19986 21.0668 6.83737 21.3517 6.42747 21.3171C6.01758 21.2825 5.69486 20.9452 5.69486 20.5335L5.88657 21ZM9 15H13.3333L14 11H9.66667L9 15Z" />
    </svg>
);

const MembersIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: active ? 1 : 0.7 }}>
        <path d="M14 8.005C14 8.005 14 4.005 9 4.005C4 4.005 4 8.005 4 8.005V9.005C4 9.005 4 14.005 9 14.005C14 14.005 14 9.005 14 9.005V8.005ZM15.71 14.715C17.04 13.365 18 11.345 18 9.005V8.005C18 5.655 17.04 3.645 15.71 2.295C17.25 2.705 21 3.695 21 8.005V9.005C21 13.305 17.25 14.305 15.71 14.715Z" />
        <path d="M9 15.005C2.25 15.005 0 18.005 0 18.005V21.005H18V18.005C18 18.005 15.75 15.005 9 15.005ZM16.7 16.715C18.2 17.115 24 18.105 24 21.005V24.005H20V18.005C20 17.555 18.94 16.475 16.7 16.715Z" />
    </svg>
);

const PinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
        <path d="M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87901V9.88001L5.73596 8.46401L4.32196 9.88001L8.56496 14.122L2.90396 19.783L4.31796 21.197L9.97896 15.536L14.222 19.779L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
        <path d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 5.589 14.411 2 10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.707L21.707 20.293ZM4 10C4 6.691 6.691 4 10 4C13.309 4 16 6.691 16 10C16 13.309 13.309 16 10 16C6.691 16 4 13.309 4 10Z" />
    </svg>
);

export function ChatArea({ channel }: ChatAreaProps) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { messages, addMessage, user, showMemberList, toggleMemberList } = useAppStore();
    const channelMessages = messages[channel.id] || [];

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [channelMessages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSend = () => {
        const content = inputValue.trim();
        if (!content || !user) return;

        const newMessage: Message = {
            id: `m${Date.now()}`,
            threadId: channel.id,
            senderId: user.id,
            sender: user,
            content,
            timestamp: new Date(),
        };

        addMessage(channel.id, newMessage);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="chat-area">
            {/* Header */}
            <div className="chat-header">
                <HashIcon />
                <span className="chat-header-name">{channel.name}</span>
                <div className="chat-header-divider" />
                <span className="chat-header-topic">Welcome to #{channel.name}!</span>
                <div className="chat-header-actions">
                    <button className="chat-header-btn" title="Pinned Messages">
                        <PinIcon />
                    </button>
                    <button
                        className={`chat-header-btn ${showMemberList ? 'active' : ''}`}
                        onClick={toggleMemberList}
                        title="Member List"
                    >
                        <MembersIcon active={showMemberList} />
                    </button>
                    <button className="chat-header-btn" title="Search">
                        <SearchIcon />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {channelMessages.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#949BA4',
                        textAlign: 'center',
                        padding: '0 24px',
                    }}>
                        <div style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            background: '#5865F2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                        }}>
                            <HashIcon />
                        </div>
                        <h2 style={{ color: '#F2F3F5', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                            Welcome to #{channel.name}!
                        </h2>
                        <p>This is the start of the #{channel.name} channel.</p>
                    </div>
                ) : (
                    channelMessages.map((message, index) => {
                        const prevMessage = channelMessages[index - 1];
                        const isGrouped = prevMessage &&
                            prevMessage.senderId === message.senderId &&
                            (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) < 300000;

                        return (
                            <div key={message.id} className={`message ${isGrouped ? 'grouped' : ''}`}>
                                {!isGrouped && (
                                    <Avatar
                                        src={message.sender?.avatar}
                                        alt={message.sender?.name || 'User'}
                                        size="md"
                                    />
                                )}
                                {isGrouped && <div style={{ width: '40px' }} />}
                                <div className="message-content-wrapper">
                                    {!isGrouped && (
                                        <div className="message-header">
                                            <span className="message-author">{message.sender?.name || 'Unknown User'}</span>
                                            <span className="message-timestamp">{formatTimestamp(new Date(message.timestamp))}</span>
                                        </div>
                                    )}
                                    <div className="message-content">{message.content}</div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0 16px 24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                    background: '#383A40',
                    borderRadius: '8px',
                    padding: '4px 4px 4px 16px',
                }}>
                    <button style={{
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
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z" />
                        </svg>
                    </button>

                    <textarea
                        ref={textareaRef}
                        style={{
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
                        }}
                        placeholder={`Message #${channel.name}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    <button style={{
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
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM8.5 8C9.329 8 10 8.671 10 9.5C10 10.329 9.329 11 8.5 11C7.671 11 7 10.329 7 9.5C7 8.671 7.671 8 8.5 8ZM12 18C9.021 18 6.505 15.961 5.851 13.207C5.76 12.797 6.069 12.405 6.487 12.385C6.487 12.385 7.235 12.329 7.412 12.316C8.612 12.224 9.812 12.15 11.014 12.109C11.509 12.093 12.004 12.086 12.5 12.086C13.035 12.086 13.57 12.094 14.104 12.113C15.234 12.152 16.363 12.22 17.489 12.308C17.729 12.327 18.415 12.385 18.415 12.385C18.828 12.412 19.129 12.797 19.044 13.203C18.397 15.958 15.882 18 12.903 18H12ZM15.5 11C14.671 11 14 10.329 14 9.5C14 8.671 14.671 8 15.5 8C16.329 8 17 8.671 17 9.5C17 10.329 16.329 11 15.5 11Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
