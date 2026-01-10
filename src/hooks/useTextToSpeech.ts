'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseTextToSpeechOptions {
  rate?: number; // 0.1 to 10, default 1
  pitch?: number; // 0 to 2, default 1
  volume?: number; // 0 to 1, default 1
  lang?: string; // e.g., 'en-US', 'hi-IN'
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const { rate = 1.0, pitch = 1.0, volume = 1.0, lang = 'en-US' } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setIsSupported(false);
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string, title?: string) => {
      if (!isSupported || !text) return;

      // If already speaking, stop
      if (isSpeaking && !isPaused) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }

      // If paused, resume
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        return;
      }

      // Start new speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Optional: Add title as a prefix
      if (title) {
        utterance.text = `${title}. ${text}`;
      }

      // Set voice properties
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = lang;

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      // Speak
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, isSpeaking, isPaused, rate, pitch, volume, lang]
  );

  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
  };
};
