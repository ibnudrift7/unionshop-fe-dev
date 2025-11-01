'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart';
import type {
  CartResponse,
  CartProductInput,
  CartItem as MemberCartItem,
} from '@/types/cart';
import { HttpError } from '@/services/http';
import { resolveMemberUnitPrice } from '@/lib/utils';

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
  return useMutation<
    CartResponse,
    HttpError,
    { itemId: number; qty: number },
    { previous: CartResponse | undefined }
  >({
    mutationKey: ['member-cart', 'update-qty'],
    mutationFn: ({ itemId, qty }) =>
      cartService.updateItemQty(itemId, qty).then((r) => r.data),
    onMutate: async ({ itemId, qty }) => {
      await qc.cancelQueries({ queryKey: ['member-cart'] });

      const previous = qc.getQueryData<CartResponse>(['member-cart']);

      if (previous?.data?.items) {
        const unitPrice = (it: MemberCartItem) => resolveMemberUnitPrice(it);

        const nextItems = previous.data.items.map((it) => {
          if (it.id !== itemId) return it;
          const u = unitPrice(it);
          const nextQty = Math.max(1, qty);
          const nextSubtotal = Math.max(0, Math.round(u * nextQty));
          return { ...it, qty: nextQty, subtotal: nextSubtotal };
        });

        const nextSubtotalAll = nextItems.reduce(
          (s, it) => s + (it.subtotal || 0),
          0,
        );
        const nextTotalItems = nextItems.reduce(
          (s, it) => s + (it.qty || 0),
          0,
        );

        const nextData: CartResponse = {
          ...previous,
          data: {
            ...previous.data,
            items: nextItems,
            summary: {
              ...previous.data.summary,
              subtotal: String(nextSubtotalAll),
              total_items: nextTotalItems,
            },
          },
        };
        qc.setQueryData(['member-cart'], nextData);
      }

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['member-cart'], ctx.previous);
    },
    onSettled: () => {
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
