'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextToSpeechProps {
  text: string;
  title?: string;
  className?: string;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon';
  showLabel?: boolean;
  showRateControl?: boolean;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  title,
  className = '',
  buttonSize = 'default',
  showLabel = true,
  showRateControl = true,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [rate, setRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = React.useRef<HTMLDivElement>(null);

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

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSettings]);

  const speak = () => {
    if (!isSupported || !text) return;

    // ALWAYS cancel any ongoing speech first to prevent overlap
    window.speechSynthesis.cancel();

    // If already speaking, just stop (don't restart)
    if (isSpeaking && !isPaused) {
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

    // Small delay to ensure cancel is processed
    setTimeout(() => {
      // Start new speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Optional: Add title as a prefix
      if (title) {
        utterance.text = `${title}. ${text}`;
      }

      // Set voice properties
      utterance.rate = rate; // Use dynamic rate
      utterance.pitch = 1.0; // Pitch (0 to 2)
      utterance.volume = 1.0; // Volume (0 to 1)

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
    }, 50);
  };

  const pause = () => {
    if (!isSupported || !isSpeaking) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const stop = () => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={speak}
        variant={isSpeaking ? 'default' : 'outline'}
        size={buttonSize}
        className="gap-2"
        title={isSpeaking ? 'Stop reading' : isPaused ? 'Resume reading' : 'Read article aloud'}
      >
        {isSpeaking && !isPaused ? (
          <>
            <VolumeX className="h-4 w-4" />
            {showLabel && <span>Stop</span>}
          </>
        ) : isPaused ? (
          <>
            <Play className="h-4 w-4" />
            {showLabel && <span>Resume</span>}
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            {showLabel && <span>Listen</span>}
          </>
        )}
      </Button>

      {isSpeaking && !isPaused && (
        <Button
          onClick={pause}
          variant="outline"
          size={buttonSize}
          className="gap-2"
          title="Pause reading"
        >
          <Pause className="h-4 w-4" />
          {showLabel && <span>Pause</span>}
        </Button>
      )}

      {showRateControl && (
        <div className="relative" ref={settingsRef}>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size={buttonSize}
            title="Speech settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-[250px]">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between mb-2">
                    <span>Speed: {rate.toFixed(1)}x</span>
                    <button
                      onClick={() => setRate(1.0)}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Reset
                    </button>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Slow (0.5x)</span>
                    <span>Normal (1x)</span>
                    <span>Fast (2x)</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-slate-700">
                  Adjust the speech speed to your preference. Changes apply to new playback.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
