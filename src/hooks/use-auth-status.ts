'use client';

import { useEffect, useState } from 'react';
import {
  TOKEN_KEY,
  setAuthToken,
  AUTH_TOKEN_CHANGED_EVENT,
} from '@/lib/auth-token';

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      return Boolean(localStorage.getItem(TOKEN_KEY));
    } catch {
      return false;
    }
  });
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const check = () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem(TOKEN_KEY)
            : null;
        setIsLoggedIn(Boolean(token));
      } catch {
        setIsLoggedIn(false);
      }
    };

    check();
    setIsReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        check();
      }
    };

    const onAuthTokenChanged = () => {
      check();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(
      AUTH_TOKEN_CHANGED_EVENT,
      onAuthTokenChanged as EventListener,
    );
    document.addEventListener('visibilitychange', check);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(
        AUTH_TOKEN_CHANGED_EVENT,
        onAuthTokenChanged as EventListener,
      );
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  return { isLoggedIn, isReady };
}

export { setAuthToken };
