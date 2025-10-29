import { httpFetch } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/api';
import type { CheckoutPayload, CheckoutResponse } from '@/types/checkout';
import type { ApplyPromoResponse } from '@/types/promo';

export const checkoutService = {
  create(payload: CheckoutPayload) {
    const body = new URLSearchParams();
    body.set('shipping_address_id', String(payload.shipping_address_id));
    body.set('promo_code', payload.promo_code ?? '');
    body.set('points_to_use', String(payload.points_to_use ?? '0'));
    body.set('order_notes', payload.order_notes ?? '');
    body.set('courier_id', String(payload.courier_id));
    body.set('shipping_package', payload.shipping_package);
    body.set('shipping_day', String(payload.shipping_day));
    body.set('shipping_fee', String(payload.shipping_fee));

    return httpFetch<CheckoutResponse>(API_ENDPOINTS.checkout, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  applyPromo(promoCode: string) {
    const body = new URLSearchParams();
    body.set('promo_code', promoCode);
    return httpFetch<ApplyPromoResponse>(API_ENDPOINTS.checkoutApplyPromo, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
};
