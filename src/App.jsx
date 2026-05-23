import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import VoiceRecorder from './components/VoiceRecorder';
import TranscriptPanel from './components/TranscriptPanel';
import ChatWindow from './components/ChatWindow';
import HistorySidebar from './components/HistorySidebar';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import { sendMessage } from './services/api';

function App() {
  // ─── State ─────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('voicebot-dark-mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const saved = localStorage.getItem('voicebot-session-id');
    return saved || crypto.randomUUID();
  });

  // ─── Hooks ─────────────────────────────────────────────────
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported: sttSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();

  // ─── Effects ───────────────────────────────────────────────
  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('voicebot-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist session ID
  useEffect(() => {
    localStorage.setItem('voicebot-session-id', sessionId);
  }, [sessionId]);

  // ─── Handlers ──────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const messageText = transcript.trim();
    if (!messageText || isProcessing) return;

    // Stop any ongoing speech
    stopSpeaking();

    // Add user message to chat
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: messageText, time: now },
    ]);
    resetTranscript();
    setIsProcessing(true);

    try {
      const response = await sendMessage(messageText, sessionId);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: response.reply, time: botTime },
      ]);

      // Update session ID if returned
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Auto-play bot voice response
      speak(response.reply);
    } catch (err) {
      console.error('[App] Chat error:', err);
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Sorry, kuch technical problem aa gaya. Please try again.',
          time: errorTime,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [transcript, isProcessing, sessionId, resetTranscript, speak, stopSpeaking]);

  const handleLoadSession = useCallback((loadedSessionId, sessionMessages) => {
    setSessionId(loadedSessionId);
    const formattedMessages = sessionMessages.map((msg) => ([
      {
        role: 'user',
        text: msg.user_message,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        role: 'bot',
        text: msg.bot_reply,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])).flat();
    setMessages(formattedMessages);
    setSidebarOpen(false);
  }, []);

  const handleNewChat = useCallback(() => {
    setSessionId(crypto.randomUUID());
    setMessages([]);
    resetTranscript();
    stopSpeaking();
  }, [resetTranscript, stopSpeaking]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Premium Ambient Background */}
      <div className="ambient-bg" />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full relative z-10 px-0 lg:px-6 pt-2 lg:pt-6 pb-2 lg:pb-6">
        {/* Sidebar */}
        <HistorySidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLoadSession={handleLoadSession}
          currentSessionId={sessionId}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative h-full">
          
          {/* Top Actions */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              id="new-chat-btn"
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold glass shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-surface-800/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-surface-700 dark:text-surface-200"
            >
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Chat Window - takes up remaining space above the sticky recorder */}
          <div className="flex-1 min-h-0 mb-4 lg:mb-6 rounded-[2rem] shadow-2xl flex flex-col">
            <ChatWindow
              messages={messages}
              isTyping={isProcessing}
              isSpeaking={isSpeaking}
            />
          </div>

          {/* Bottom Sticky Controls */}
          <div className="w-full flex flex-col gap-3 shrink-0 pb-2 bg-gradient-to-t from-surface-50 via-surface-50 dark:from-surface-950 dark:via-surface-950 to-transparent pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 z-20">
            <TranscriptPanel
              transcript={transcript}
              interimTranscript={interimTranscript}
              isListening={isListening}
            />

            <VoiceRecorder
              isListening={isListening}
              isSupported={sttSupported}
              error={speechError}
              onStart={startListening}
              onStop={stopListening}
              onSend={handleSend}
              transcript={transcript}
              interimTranscript={interimTranscript}
              isProcessing={isProcessing}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
