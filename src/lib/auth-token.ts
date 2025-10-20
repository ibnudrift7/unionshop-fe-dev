export const TOKEN_KEY = 'laksdjfhlaksjdfhlaksjdfh_token_123456789';
export const CSRF_TOKEN_KEY = 'csrf_token';
export const CSRF_TOKEN_EXP_KEY = 'csrf_token_exp';

export function getAuthToken(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token?: string | null) {
  try {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
  }
}

export function getStoredCsrfToken(): {
  token: string | null;
  exp: number | null;
} {
  try {
    if (typeof window === 'undefined') return { token: null, exp: null };
    const token = localStorage.getItem(CSRF_TOKEN_KEY);
    const expStr = localStorage.getItem(CSRF_TOKEN_EXP_KEY);
    const exp = expStr ? Number(expStr) : null;
    return { token, exp: Number.isFinite(exp) ? (exp as number) : null };
  } catch {
    return { token: null, exp: null };
  }
}

export function setStoredCsrfToken(
  token?: string | null,
  ttlMs: number = 60 * 60 * 1000,
) {
  try {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(CSRF_TOKEN_KEY, token);
      const exp = Date.now() + ttlMs;
      localStorage.setItem(CSRF_TOKEN_EXP_KEY, String(exp));
    } else {
      localStorage.removeItem(CSRF_TOKEN_KEY);
      localStorage.removeItem(CSRF_TOKEN_EXP_KEY);
    }
  } catch {
  }
}
