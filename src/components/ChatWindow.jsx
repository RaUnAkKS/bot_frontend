import { useRef, useEffect } from 'react';

/**
 * Chat window displaying conversation messages with bot typing animation.
 */
const ChatWindow = ({ messages, isTyping, isSpeaking }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      // Use setTimeout to ensure DOM has painted the new layout before scrolling
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [messages, isTyping]);

  const suggestions = [
    "Namaste naa peru Raju",
    "Mujhe software demo chahiye",
    "Naku software help kavali",
    "Aap kaise ho?",
  ];

  return (
    <div className="glass-strong rounded-[2rem] flex flex-col h-full shadow-2xl relative overflow-hidden">
      
      {/* Background Ambience inside chat */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-100/30 dark:to-surface-900/30 pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-surface-700/30 bg-white/40 dark:bg-surface-900/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
          <h2 className="text-sm font-bold text-surface-800 dark:text-surface-200">Conversation</h2>
        </div>
        {isSpeaking && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/30">
            <div className="flex gap-0.5 items-end h-3">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="speak-bar bg-primary-500" style={{ animationDelay: `${i * 0.15}s` }} />
               ))}
            </div>
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">Speaking</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="relative flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 z-10">
        
        {/* Empty State / Suggestions */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
            <div className="w-20 h-20 mb-6 rounded-[2rem] bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-2">How can I help you today?</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 max-w-xs">
              Speak to me in Hindi, Telugu, or a mix of both.
            </p>
            
            <div className="w-full max-w-md">
              <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-4">Try saying</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {suggestions.map((text, i) => (
                  <div key={i} className="suggestion-chip">
                    "{text}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div className={`flex items-end gap-3 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-primary-500/30'
                  : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/30'
              }`}>
                {msg.role === 'user' ? 'U' : 'B'}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1.5">
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                <p className={`text-[10px] font-medium text-surface-400 dark:text-surface-500 px-1 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="flex items-end gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                B
              </div>
              <div className="chat-bubble-bot">
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <div className="typing-dot" style={{ animationDelay: '0s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};

export default ChatWindow;
