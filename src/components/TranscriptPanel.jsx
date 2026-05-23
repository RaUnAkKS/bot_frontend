/**
 * Displays the live speech-to-text transcript with interim results.
 */
const TranscriptPanel = ({ transcript, interimTranscript, isListening }) => {
  if (!transcript && !interimTranscript && !isListening) return null;

  return (
    <div className="glass-strong rounded-2xl p-4 sm:p-5 shadow-lg border-primary-200/50 dark:border-primary-800/30 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-primary-500 animate-pulse' : 'bg-surface-400'}`} />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400">
          Live Transcript
        </h3>
      </div>

      <div className="min-h-[2.5rem] text-sm leading-relaxed">
        {transcript && (
          <span className="text-surface-800 dark:text-surface-200 font-medium">{transcript}</span>
        )}
        {interimTranscript && (
          <span className="text-primary-600 dark:text-primary-400 italic"> {interimTranscript}</span>
        )}
        {isListening && !transcript && !interimTranscript && (
          <span className="text-surface-400 dark:text-surface-500 italic animate-pulse">Listening to you...</span>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
