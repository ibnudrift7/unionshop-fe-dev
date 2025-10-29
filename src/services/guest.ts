import { httpFetch } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  RegisterGuestPayload,
  RegisterGuestResponse,
} from '@/types/guest';

export const guestService = {
  registerGuest(payload: RegisterGuestPayload) {
    return httpFetch<RegisterGuestResponse, RegisterGuestPayload>(
      API_ENDPOINTS.registerGuest,
      {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  },
};
