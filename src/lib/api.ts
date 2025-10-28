import axios from 'axios';
import Cookies from 'js-cookie';
import { HttpError } from '@/services/http';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.titaniumprint.id',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const isCsrfEndpoint =
    typeof config.url === 'string' && config.url.includes('/csrf-token');
  if (isCsrfEndpoint) return config;

  let csrfToken = Cookies.get('X-CSRF-Token');

  if (!csrfToken) {
    const response = await api.get('/csrf-token');
    csrfToken = response.data.csrfToken;
    if (csrfToken) {
      Cookies.set('X-CSRF-Token', csrfToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  }

  if (csrfToken && config.headers) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize axios error to HttpError so callers can handle consistently
    try {
      if (error && error.response) {
        const resp = error.response;
        const status: number = resp.status;
        const data = resp.data;
        let message: string | undefined;
        if (data && typeof data === 'object') {
          if (typeof data.message === 'string') message = data.message;
          else if (typeof data.error === 'string') message = data.error;
          else if (data?.errors && typeof data.errors === 'object')
            message = 'Validation failed';
        }
        message = message ?? `Request failed with status code ${status}`;
        return Promise.reject(new HttpError(message, status, data));
      }
    } catch {
      // fallthrough to reject original error
    }
    return Promise.reject(error);
  },
);
