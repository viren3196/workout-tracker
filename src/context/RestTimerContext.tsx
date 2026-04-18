import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { haptic } from '../utils';

interface RestTimerContextValue {
  isRunning: boolean;
  secondsLeft: number;
  totalSeconds: number;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const RestTimerContext = createContext<RestTimerContextValue | null>(null);

export function RestTimerProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const endTimeRef = useRef<number>(0);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const startTimer = useCallback((seconds: number) => {
    stopTimer();
    setTotalSeconds(seconds);
    setSecondsLeft(seconds);
    endTimeRef.current = Date.now() + seconds * 1000;
    setIsRunning(true);
  }, [stopTimer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setSecondsLeft(0);
    setTotalSeconds(0);
  }, [stopTimer]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        haptic(200);
        // Try to play a notification sound
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch { /* audio not available */ }
      }
    }, 250);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <RestTimerContext.Provider value={{ isRunning, secondsLeft, totalSeconds, startTimer, stopTimer, resetTimer }}>
      {children}
    </RestTimerContext.Provider>
  );
}

export function useRestTimer(): RestTimerContextValue {
  const ctx = useContext(RestTimerContext);
  if (!ctx) throw new Error('useRestTimer must be used within RestTimerProvider');
  return ctx;
}
