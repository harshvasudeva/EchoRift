import React from 'react';

const MessageIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
);

export function EmptyState() {
    return (
        <div className="empty-state">
            <div className="empty-icon">
                <MessageIcon />
            </div>
            <h2 className="empty-title">Select a conversation</h2>
            <p>Choose from your existing conversations or start a new one</p>
        </div>
    );
}
