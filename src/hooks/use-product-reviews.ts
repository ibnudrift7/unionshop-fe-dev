'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { ProductReviewsData } from '@/types/product-review';
import { HttpError } from '@/services/http';

export function useProductReviewsQuery(slug: string | undefined, page = 1) {
  return useQuery<ProductReviewsData, HttpError>({
    queryKey: ['product', 'reviews', slug, String(page)],
    queryFn: async () => {
      if (!slug) throw new Error('Missing product slug');
      const res = await productsService.reviews(slug, page);
      return res.data.data;
    },
    enabled: Boolean(slug),
    staleTime: 30_000,
  });
}
