import { httpFetch } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  CouriersResponse,
  ShippingCalculateResponse,
} from '@/types/shipping';

export const shippingService = {
  getCouriers() {
    return httpFetch<CouriersResponse>(API_ENDPOINTS.shippingCouriers, {
      method: 'GET',
    });
  },
  calculate(params: {
    courier: string;
    address_id: number | string;
    cart_id: number | string;
  }) {
    const body = new URLSearchParams();
    body.set('courier', String(params.courier));
    body.set('address_id', String(params.address_id));
    body.set('cart_id', String(params.cart_id));
    return httpFetch<ShippingCalculateResponse>(
      API_ENDPOINTS.shippingCalculate,
      {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
  },
};
