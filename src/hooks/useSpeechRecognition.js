import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for Web Speech API speech recognition.
 * Supports Indian English/Hinglish/Tenglish (en-IN) with continuous recognition mode.
 * Falls back gracefully on unsupported browsers.
 */
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Use Indian English - it transcribes Hinglish and Tenglish romanized speech well
    recognition.lang = 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        const newFinal = final.trim();
        setTranscript((prev) => {
          // Prevent duplicate final results (common bug in Chrome Speech API)
          if (newFinal && prev.endsWith(newFinal)) {
            return prev;
          }
          return prev ? `${prev} ${newFinal}` : newFinal;
        });
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('[SpeechRecognition] Error:', event.error);

      // 'network' errors are transient — Chrome fires them on page load or
      // when the speech server is briefly unreachable. Ignore if the user
      // wasn't actively recording; auto-clear after a few seconds otherwise.
      if (event.error === 'network') {
        if (!recognitionRef.current?._shouldListen) return; // ignore on idle
        setError('Network issue — please check your internet and try again.');
        setTimeout(() => setError((prev) =>
          prev === 'Network issue — please check your internet and try again.' ? null : prev
        ), 4000);
        setIsListening(false);
        return;
      }

      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
        // Auto-clear "no speech" after a few seconds
        setTimeout(() => setError((prev) =>
          prev === 'No speech detected. Please try again.' ? null : prev
        ), 3000);
      } else if (event.error === 'aborted') {
        // Aborted is expected when we call .stop() or .abort() — ignore
        return;
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening (handles Chrome's auto-stop)
      if (recognitionRef.current?._shouldListen) {
        try {
          recognition.start();
        } catch (e) {
          console.warn('[SpeechRecognition] Restart failed:', e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    try {
      recognitionRef.current._shouldListen = true;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('[SpeechRecognition] Start failed:', e);
      setError('Failed to start speech recognition. Please try again.');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current._shouldListen = false;
    recognitionRef.current.stop();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
