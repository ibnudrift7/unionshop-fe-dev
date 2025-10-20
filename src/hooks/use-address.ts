'use client';

import { useQuery } from '@tanstack/react-query';
import { addressService } from '@/services/address';
import type { DefaultAddressResponse } from '@/types/address';
import { HttpError } from '@/services/http';

export function useDefaultAddressQuery(enabled: boolean = true) {
  return useQuery<DefaultAddressResponse, HttpError>({
    queryKey: ['address', 'default'],
    queryFn: () => addressService.getDefaultAddress().then((r) => r.data),
    enabled,
    staleTime: 60_000,
  });
}
