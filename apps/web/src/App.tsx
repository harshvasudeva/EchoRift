import React, { useEffect } from 'react';
import { useAppStore, useThemeStore, MOCK_USER, MOCK_WORKSPACES, MOCK_THREADS, MOCK_MESSAGES } from './store';
import { NavSidebar } from './components/NavSidebar';
import { ThreadList } from './components/ThreadList';
import { ChatView } from './components/ChatView';
import { VoiceRoom } from './components/VoiceRoom';
import { EmptyState } from './components/EmptyState';

function App() {
  const { theme } = useThemeStore();
  const {
    setUser,
    setWorkspaces,
    setActiveWorkspace,
    setThreads,
    setActiveThread,
    setMessages,
    activeThreadId,
    threads,
    voiceState,
    setVoiceState,
  } = useAppStore();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initialize mock data
  useEffect(() => {
    setUser(MOCK_USER);
    setWorkspaces(MOCK_WORKSPACES);
    setActiveWorkspace(MOCK_WORKSPACES[0].id);
    setThreads(MOCK_THREADS);
    setMessages('t1', MOCK_MESSAGES);
    setActiveThread('t1');
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Handle joining voice channel
  const handleJoinVoice = (threadId: string) => {
    setVoiceState({ active: true, threadId });
  };

  // Handle leaving voice channel
  const handleLeaveVoice = () => {
    setVoiceState({
      active: false,
      threadId: null,
      muted: false,
      deafened: false,
      videoOn: false,
      screenSharing: false,
    });
  };

  // Check if in a voice call
  const isInVoiceCall = voiceState.active && voiceState.threadId;
  const voiceThread = isInVoiceCall ? threads.find(t => t.id === voiceState.threadId) : null;

  return (
    <div className="app">
      <NavSidebar />
      <ThreadList onJoinVoice={handleJoinVoice} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* Chat View - Rendered when active thread is NOT the voice room (or valid text channel) */}
        {activeThread && (!isInVoiceCall || activeThread.id !== voiceState.threadId) && (
          <div style={{ width: '100%', height: '100%' }}>
            <ChatView thread={activeThread} />
          </div>
        )}

        {/* Empty State - Rendered when no thread selected */}
        {!activeThread && !isInVoiceCall && <EmptyState />}

        {/* Voice Room - Always mounted when active to persist connection */}
        {isInVoiceCall && voiceThread && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: 'var(--bg-primary)',
            // Hide if we are viewing another thread (minimized mode)
            // In a real app we might show a mini player here or in sidebar
            visibility: (activeThreadId === voiceState.threadId) ? 'visible' : 'hidden',
            pointerEvents: (activeThreadId === voiceState.threadId) ? 'auto' : 'none'
          }}>
            <VoiceRoom thread={voiceThread} onLeave={handleLeaveVoice} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
