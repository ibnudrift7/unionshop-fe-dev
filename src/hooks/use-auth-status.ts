'use client';

import { useEffect, useState } from 'react';
import { TOKEN_KEY, setAuthToken } from '@/lib/auth-token';

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

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  return { isLoggedIn, isReady };
}

export { setAuthToken };
