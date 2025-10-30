import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type {
  OrderListResponse,
  OrderDetailResponse,
  OrderHistoryResponse,
  CreateOrderReviewPayload,
  CreateOrderReviewResponse,
  OrderReviewsResponse,
  OrderTrackingResponse,
} from '@/types/order';

export const ordersService = {
  list(params?: { page?: number; limit?: number }) {
    return httpFetch<OrderListResponse>(API_ENDPOINTS.orders, {
      method: 'GET',
      query: {
        ...(params?.page ? { page: params.page } : {}),
        ...(params?.limit ? { limit: params.limit } : {}),
      },
    });
  },

  detail(orderId: string | number) {
    const path = `${API_ENDPOINTS.orderDetail}/${encodeURIComponent(
      String(orderId),
    )}`;
    return httpFetch<OrderDetailResponse>(path, { method: 'GET' });
  },

  history(orderId: string | number) {
    const path = `${API_ENDPOINTS.orderShipmentHistory}/${encodeURIComponent(
      String(orderId),
    )}/history`;
    return httpFetch<OrderHistoryResponse>(path, { method: 'GET' });
  },

  createReview(orderId: string | number, payload: CreateOrderReviewPayload) {
    const path = `${API_ENDPOINTS.orderCreateReview}/${encodeURIComponent(
      String(orderId),
    )}/review`;
    const body = new URLSearchParams();
    body.set('product_id', String(payload.product_id));
    body.set('rating', String(payload.rating));
    body.set('review', payload.review);
    return httpFetch<CreateOrderReviewResponse, URLSearchParams>(path, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  reviews(orderId: string | number) {
    const path = `${API_ENDPOINTS.orderReviews}/${encodeURIComponent(
      String(orderId),
    )}/reviews`;
    return httpFetch<OrderReviewsResponse>(path, { method: 'GET' });
  },

  tracking(orderId: string | number) {
    const path = `${API_ENDPOINTS.orderShipmentHistory}/${encodeURIComponent(
      String(orderId),
    )}/tracking`;
    return httpFetch<OrderTrackingResponse>(path, { method: 'GET' });
  },
};
