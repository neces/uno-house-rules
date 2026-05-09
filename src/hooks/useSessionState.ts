import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Typed sessionStorage-backed useState. Reads the initial value from
 * sessionStorage if present, otherwise falls back to `initialValue`.
 * Writes are JSON-serialised on every change. Safe against SSR / private
 * mode by guarding all storage access in try/catch.
 */
export function useSessionState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const raw = window.sessionStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  // Keep the latest key in a ref so that the setter is stable across renders
  // even if the consumer somehow passes a non-stable key.
  const keyRef = useRef(key);
  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  const setAndPersist = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(prev => {
        const next =
          typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          window.sessionStorage.setItem(keyRef.current, JSON.stringify(next));
        } catch {
          // sessionStorage might be unavailable (private mode, quota); ignore
        }
        return next;
      });
    },
    [],
  );

  return [state, setAndPersist];
}
