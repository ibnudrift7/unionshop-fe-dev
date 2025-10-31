'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { ProductsQuery } from '@/types/product';
import type { Product } from '@/types';
import { HttpError } from '@/services/http';

export function useProductsQuery(params: ProductsQuery = {}) {
  const key = ['products', params.search ?? '', params.categoryId ?? ''];
  return useQuery<Product[], HttpError>({
    queryKey: key,
    queryFn: () => productsService.getProductsUi(params),
    staleTime: 30_000,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => productsService.getCategoriesUi(),
    staleTime: 60_000,
  });
}
