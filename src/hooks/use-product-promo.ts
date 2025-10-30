'use client';

import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/types';
import { promosService } from '@/services/promos';
import { HttpError } from '@/services/http';

export function useProductPromoDetailQuery(slug: string | undefined) {
  return useQuery<Product, HttpError>({
    queryKey: ['promo', 'bundle-detail', slug],
    queryFn: () => {
      if (!slug) throw new Error('Missing bundle slug');
      return promosService.getBundleDetailUi(slug);
    },
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}

export default useProductPromoDetailQuery;
