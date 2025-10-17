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
    const params = new URLSearchParams();
    if (payload.email) params.set('email', payload.email);
    if (payload.name) params.set('full_name', payload.name);
    if (payload.password) params.set('password', payload.password);
    if (payload.phone) params.set('phone', payload.phone);
    if (payload.gender) {
      const g =
        payload.gender === 'pria'
          ? 'L'
          : payload.gender === 'wanita'
          ? 'P'
          : '';
      if (g) params.set('gender', g);
    }
    if (payload.dateOfBirth) params.set('date_of_birth', payload.dateOfBirth);
    return httpFetch<AuthResponse, URLSearchParams>(API_ENDPOINTS.register, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
};
