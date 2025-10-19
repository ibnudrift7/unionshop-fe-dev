'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { Product } from '@/types';
import { HttpError } from '@/services/http';

export function useProductDetailQuery(slugOrId: string | undefined) {
  return useQuery<Product, HttpError>({
    queryKey: ['product', slugOrId],
    queryFn: () => {
      if (!slugOrId) throw new Error('Missing product id/slug');
      return productsService.getProductDetailUi(slugOrId);
    },
    enabled: Boolean(slugOrId),
    staleTime: 60_000,
  });
}
