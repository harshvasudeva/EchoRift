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

      {isInVoiceCall && voiceThread ? (
        <VoiceRoom thread={voiceThread} onLeave={handleLeaveVoice} />
      ) : activeThread ? (
        <ChatView thread={activeThread} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default App;
