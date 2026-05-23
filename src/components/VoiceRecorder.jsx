import { useEffect } from 'react';

/**
 * Voice recorder component with animated waveform visualization.
 * Provides Start/Stop buttons and shows recording status.
 */
const VoiceRecorder = ({
  isListening,
  isSupported,
  error,
  onStart,
  onStop,
  onSend,
  transcript,
  interimTranscript,
  isProcessing,
}) => {
  return (
    <div className="glass-strong rounded-[2rem] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow when listening */}
      {isListening && (
        <div className="absolute inset-0 bg-primary-500/5 animate-pulse-slow pointer-events-none" />
      )}

      {/* Browser compatibility warning */}
      {!isSupported && (
        <div id="browser-warning" className="flex items-start gap-3 p-4 mb-4 rounded-2xl bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 backdrop-blur-md">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Browser Not Supported</p>
            <p className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-300 mt-1">
              Speech recognition requires <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>. 
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && isSupported && (
        <div className="flex items-center gap-3 p-3 mb-4 rounded-2xl bg-rose-50/80 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 animate-slide-in-up">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-800/50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Status Area / Waveform */}
        <div className="flex-1 flex items-center justify-center sm:justify-start min-h-[4rem]">
          {isListening ? (
            <div className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-surface-100/50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-2" />
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    height: '12px',
                  }}
                />
              ))}
              <span className="ml-3 text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest animate-pulse">Listening</span>
            </div>
          ) : isProcessing ? (
             <div className="flex items-center gap-3 animate-fade-in">
               <div className="flex gap-1">
                 <div className="typing-dot bg-purple-500" style={{ animationDelay: '0s' }} />
                 <div className="typing-dot bg-purple-500" style={{ animationDelay: '0.2s' }} />
                 <div className="typing-dot bg-purple-500" style={{ animationDelay: '0.4s' }} />
               </div>
               <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Processing...</span>
             </div>
          ) : (
            <div className="flex flex-col items-center sm:items-start animate-fade-in">
              <h3 className="text-base font-bold text-surface-800 dark:text-surface-100">Ready to listen</h3>
              <p className="text-xs text-surface-500 mt-1">Tap the microphone to start</p>
            </div>
          )}
        </div>

        {/* Right Controls Area */}
        <div className="flex items-center gap-3">
          {/* Main Record Button */}
          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-primary-500/50 animate-[micPulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            )}
            
            <button
              id={isListening ? "stop-mic-btn" : "start-mic-btn"}
              onClick={isListening ? onStop : onStart}
              disabled={!isSupported || isProcessing}
              className={`relative z-10 flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-full shadow-xl transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white hover:scale-105 shadow-rose-500/30' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white btn-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100'
              }`}
            >
              {isListening ? (
                <svg className="w-6 h-6 sm:w-5 sm:h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>

          {/* Send Button (Only shows when there's transcript and not listening) */}
          {transcript && !isListening && (
            <button
              id="send-msg-btn"
              onClick={onSend}
              disabled={isProcessing}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 animate-slide-in-right"
              aria-label="Send message"
            >
              <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default VoiceRecorder;
