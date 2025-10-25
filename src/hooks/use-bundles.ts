'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { Product } from '@/types';

export function useBundlesQuery(enabled = true) {
  return useQuery<Product[], Error>({
    queryKey: ['bundles'],
    queryFn: () => productsService.getBundlesUi(),
    enabled,
    staleTime: 30_000,
  });
}

export default useBundlesQuery;
