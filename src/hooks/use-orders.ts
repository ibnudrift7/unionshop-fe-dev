'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import type {
  OrderListResponse,
  OrderHistoryResponse,
  CreateOrderReviewPayload,
  CreateOrderReviewResponse,
  OrderReviewsResponse,
  OrderTrackingResponse,
} from '@/types/order';
import { HttpError } from '@/services/http';

export function useOrdersQuery(enabled: boolean = true) {
  return useQuery<OrderListResponse, HttpError>({
    queryKey: ['orders', 'list'],
    queryFn: () => ordersService.list().then((r) => r.data),
    enabled,
    staleTime: 30_000,
  });
}

export function useOrderHistoryQuery(
  orderId?: string | number,
  enabled = false,
) {
  return useQuery<OrderHistoryResponse, HttpError>({
    queryKey: ['orders', 'history', orderId],
    queryFn: () =>
      ordersService.history(orderId as string | number).then((r) => r.data),
    enabled: Boolean(orderId) && enabled,
    staleTime: 10_000,
  });
}

export function useOrderReviewsQuery(
  orderId?: string | number,
  enabled = false,
) {
  return useQuery<OrderReviewsResponse, HttpError>({
    queryKey: ['orders', 'reviews', orderId],
    queryFn: () =>
      ordersService.reviews(orderId as string | number).then((r) => r.data),
    enabled: Boolean(orderId) && enabled,
    staleTime: 60_000,
  });
}

export function useCreateOrderReviewMutation(orderId: string | number) {
  const qc = useQueryClient();
  return useMutation<
    CreateOrderReviewResponse,
    HttpError,
    CreateOrderReviewPayload
  >({
    mutationKey: ['orders', 'create-review', orderId],
    mutationFn: (payload) =>
      ordersService.createReview(orderId, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders', 'reviews', orderId] });
    },
  });
}

export function useOrderTrackingQuery(
  orderId?: string | number,
  enabled = false,
) {
  return useQuery<OrderTrackingResponse, HttpError>({
    queryKey: ['orders', 'tracking', orderId],
    queryFn: () =>
      ordersService.tracking(orderId as string | number).then((r) => r.data),
    enabled: Boolean(orderId) && enabled,
    staleTime: 10_000,
  });
}
