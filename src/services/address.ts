import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type { DefaultAddressResponse } from '@/types/address';

export const addressService = {
  getDefaultAddress() {
    return httpFetch<DefaultAddressResponse>(API_ENDPOINTS.addressDefault, {
      method: 'GET',
    });
  },
};
