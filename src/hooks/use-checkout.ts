'use client';

import { useMutation } from '@tanstack/react-query';
import { checkoutService } from '@/services/checkout';
import type { ApplyPromoResponse } from '@/types/promo';
import type { HttpError } from '@/services/http';

export function useApplyPromoMutation() {
  return useMutation<ApplyPromoResponse, HttpError, { promoCode: string }>({
    mutationKey: ['checkout', 'apply-promo'],
    mutationFn: ({ promoCode }) =>
      checkoutService.applyPromo(promoCode).then((r) => r.data),
  });
}
