'use client';

import { useEffect, useRef, useState } from 'react';

function randomize(base: number): number {
  const factor = 0.85 + Math.random() * 0.4; // 0.85x – 1.25x
  return Math.floor(base * factor);
}

/**
 * Returns a listener count that is randomized on mount and gently drifts over
 * time so it feels "live" instead of showing the same static number.
 */
export function useLiveListeners(base: number): number {
  const [listeners, setListeners] = useState<number>(() => randomize(base));
  const baseRef = useRef(base);

  useEffect(() => {
    baseRef.current = base;
    setListeners(randomize(base));
  }, [base]);

  useEffect(() => {
    const id = setInterval(() => {
      setListeners((prev) => {
        const delta = Math.floor(prev * (Math.random() * 0.04 - 0.02));
        let next = prev + delta;
        const min = Math.floor(baseRef.current * 0.7);
        const max = Math.floor(baseRef.current * 1.6);
        next = Math.max(min, Math.min(max, next));
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return listeners;
}
