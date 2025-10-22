import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type {
  CreateAddressPayload,
  CreateAddressResponse,
  DefaultAddressResponse,
} from '@/types/address';

export const addressService = {
  getDefaultAddress() {
    return httpFetch<DefaultAddressResponse>(API_ENDPOINTS.addressDefault, {
      method: 'GET',
    });
  },
  createAddress(
    payload: CreateAddressPayload,
    options?: { headers?: HeadersInit },
  ) {
    const params = new URLSearchParams();
    params.set('recipient_name', payload.recipient_name);
    params.set('phone', payload.phone);
    params.set('province_id', String(payload.province_id));
    params.set('city_id', String(payload.city_id));
    params.set('subdistrict_id', String(payload.subdistrict_id));
    params.set('address_line', payload.address_line);
    params.set('postal_code', payload.postal_code);
    params.set('is_default', String(payload.is_default));
    params.set('subdistrict_name', payload.subdistrict_name);

    return httpFetch<CreateAddressResponse, URLSearchParams>(
      API_ENDPOINTS.addressCreate,
      {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(options?.headers ?? {}),
        },
      },
    );
  },
};
