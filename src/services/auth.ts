import { API_ENDPOINTS } from '@/constants/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';
import { api } from '@/lib/api';

export const authService = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>(API_ENDPOINTS.login, payload);
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
    return api.post<AuthResponse>(API_ENDPOINTS.register, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  forgotPassword(email: string) {
    const params = new URLSearchParams();
    params.set('email', email);
    return api.post<AuthResponse>(API_ENDPOINTS.forgotPassword, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
};
