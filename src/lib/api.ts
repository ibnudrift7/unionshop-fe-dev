import axios from 'axios';
import Cookies from 'js-cookie';

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
    return Promise.reject(error);
  },
);
