'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { Product } from '@/types';

export function useBundlesQuery(options?: {
  enabled?: boolean;
  search?: string;
}) {
  const enabled = options?.enabled ?? true;
  const search = options?.search;
  return useQuery<Product[], Error>({
    queryKey: ['bundles', { search: search ?? '' }],
    queryFn: () => productsService.getBundlesUi({ search }),
    enabled,
    staleTime: 30_000,
  });
}

export default useBundlesQuery;
