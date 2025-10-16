'use client';

import { useEffect, useState } from 'react';

const TOKEN_KEY = 'laksdjfhlaksjdfhlaksjdfh_token_123456789';

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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

  return { isLoggedIn };
}

export function setAuthToken(token?: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}
