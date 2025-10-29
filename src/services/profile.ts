import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type {
  ProfileResponse,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from '@/types/profile';

export const profileService = {
  getProfile() {
    return httpFetch<ProfileResponse>(API_ENDPOINTS.profile, {
      method: 'GET',
    });
  },
  updateProfile(payload: UpdateProfilePayload) {
    const params = new URLSearchParams();
    params.set('email', payload.email);
    params.set('full_name', payload.name);
    params.set('phone', payload.phone);
    params.set('gender', payload.gender === 'pria' ? 'L' : 'P');
    params.set('date_of_birth', payload.dateOfBirth);

    return httpFetch<ProfileResponse, URLSearchParams>(API_ENDPOINTS.profile, {
      method: 'PATCH',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  updatePassword(payload: UpdatePasswordPayload) {
    const params = new URLSearchParams();
    params.set('current_password', payload.currentPassword);
    params.set('new_password', payload.newPassword);
    params.set('confirm_password', payload.confirmPassword);

    return httpFetch<
      Pick<ProfileResponse, 'statusCode' | 'message' | 'success'>,
      URLSearchParams
    >(API_ENDPOINTS.profilePassword, {
      method: 'PATCH',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
};
