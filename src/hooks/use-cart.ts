'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart';
import type { CartResponse, CartProductInput } from '@/types/cart';
import { HttpError } from '@/services/http';

export function useCartQuery(enabled: boolean) {
  return useQuery<CartResponse, HttpError>({
    queryKey: ['member-cart'],
    queryFn: () => cartService.getCart().then((r) => r.data),
    select: (res) => {
      const DEFAULT_IMG = '/assets/SpecialProduct.png';
      const toAbs = (p?: string | null): string => {
        if (!p) return DEFAULT_IMG;
        if (/^https?:\/\//i.test(p)) return p;
        return DEFAULT_IMG;
      };
      return {
        ...res,
        data: {
          ...res.data,
          items: (res.data.items || []).map((it) => ({
            ...it,
            cover_image: toAbs(it.cover_image),
          })),
        },
      };
    },
    enabled,
    staleTime: 30_000,
  });
}

export function useAddCartItemsMutation() {
  const qc = useQueryClient();
  return useMutation<CartResponse, HttpError, CartProductInput[]>({
    mutationKey: ['member-cart', 'add'],
    mutationFn: (products) =>
      cartService.addItems(products).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['member-cart'] });
    },
  });
}

export function useUpdateCartItemQtyMutation() {
  const qc = useQueryClient();
  return useMutation<CartResponse, HttpError, { itemId: number; qty: number }>({
    mutationKey: ['member-cart', 'update-qty'],
    mutationFn: ({ itemId, qty }) =>
      cartService.updateItemQty(itemId, qty).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['member-cart'] });
    },
  });
}

export function useDeleteCartItemMutation() {
  const qc = useQueryClient();
  return useMutation<CartResponse, HttpError, { itemId: number }>({
    mutationKey: ['member-cart', 'delete'],
    mutationFn: ({ itemId }) =>
      cartService.deleteItem(itemId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['member-cart'] });
    },
  });
}

export function useClearCartMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['member-cart', 'clear'],
    mutationFn: () => cartService.clear().then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['member-cart'] });
    },
  });
}
