import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for browser SpeechSynthesis API (Text-to-Speech).
 * Attempts to find Hindi voice; falls back to default.
 */
const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const voiceRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Try to find a Hindi voice
      const hindiVoice = voices.find(v => v.lang.startsWith('hi'));
      // Fallback to any Indian English voice
      const indianVoice = voices.find(v => v.lang === 'en-IN');
      voiceRef.current = hindiVoice || indianVoice || voices[0] || null;
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceRef.current;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'hi-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
};

export default useSpeechSynthesis;
