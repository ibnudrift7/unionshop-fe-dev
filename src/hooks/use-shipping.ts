'use client';

import { useQuery } from '@tanstack/react-query';
import { shippingService } from '@/services/shipping';
import type {
  CouriersResponse,
  ShippingCalculateResponse,
} from '@/types/shipping';
import type { HttpError } from '@/services/http';

export function useCouriersQuery(enabled: boolean) {
  return useQuery<CouriersResponse, HttpError>({
    queryKey: ['shipping', 'couriers'],
    queryFn: () => shippingService.getCouriers().then((r) => r.data),
    enabled,
    staleTime: 60_000,
  });
}

export function useShippingCalculateQuery(
  enabled: boolean,
  params: {
    courier: string;
    address_id: number | string;
    cart_id: number | string;
  },
) {
  return useQuery<ShippingCalculateResponse, HttpError>({
    queryKey: [
      'shipping',
      'calculate',
      params.courier,
      params.cart_id,
      params.address_id,
    ],
    queryFn: () => shippingService.calculate(params).then((r) => r.data),
    enabled,
  });
}
