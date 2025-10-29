export const TOKEN_KEY = 'laksdjfhlaksjdfhlaksjdfh_token_123456789';
export const AUTH_TOKEN_CHANGED_EVENT = 'auth:token-changed';
export const GUEST_TOKEN_KEY = 'guest_token';
export const GUEST_TOKEN_CHANGED_EVENT = 'auth:guest-token-changed';

export function getAuthToken(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getGuestToken(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(GUEST_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token?: string | null) {
  try {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);

    try {
      window.dispatchEvent(
        new CustomEvent(AUTH_TOKEN_CHANGED_EVENT, {
          detail: { token: token ?? null },
        }),
      );
    } catch {}
  } catch {}
}

export function setGuestToken(token?: string | null) {
  try {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem(GUEST_TOKEN_KEY, token);
    else localStorage.removeItem(GUEST_TOKEN_KEY);

    try {
      window.dispatchEvent(
        new CustomEvent(GUEST_TOKEN_CHANGED_EVENT, {
          detail: { token: token ?? null },
        }),
      );
    } catch {}
  } catch {}
}

export function clearUserLocalStorage() {
  try {
    if (typeof window === 'undefined') return;
    const keysToRemove = [
      'checkout_state',
      'guest_address',
      'guest_cart',
      TOKEN_KEY,
      GUEST_TOKEN_KEY,
      'guest_user',
      'TanstackQueryDevtools.open',
    ];

    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    try {
      setAuthToken(null);
    } catch {}
    try {
      setGuestToken(null);
    } catch {}
  } catch {}
}
