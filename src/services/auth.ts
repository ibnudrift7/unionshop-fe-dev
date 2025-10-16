import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

export const authService = {
  login(payload: LoginPayload) {
    return httpFetch<AuthResponse, LoginPayload>(API_ENDPOINTS.login, {
      method: 'POST',
      body: payload,
    });
  },
  register(payload: RegisterPayload) {
    return httpFetch<AuthResponse, RegisterPayload>(API_ENDPOINTS.register, {
      method: 'POST',
      body: payload,
    });
  },
};
