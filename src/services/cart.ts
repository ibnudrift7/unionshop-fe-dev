import { httpFetch } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  CartResponse,
  CartProductInput,
  ClearCartResponse,
} from '@/types/cart';

export const cartService = {
  getCart() {
    return httpFetch<CartResponse>(API_ENDPOINTS.cart, { method: 'GET' });
  },
  addItems(products: CartProductInput[]) {
    return httpFetch<CartResponse>(API_ENDPOINTS.cartItems, {
      method: 'POST',
      body: { products },
    });
  },
  updateItemQty(itemId: number, qty: number) {
    const body = new URLSearchParams();
    body.set('qty', String(qty));
    return httpFetch<CartResponse>(`${API_ENDPOINTS.cartItems}/${itemId}`, {
      method: 'PATCH',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  deleteItem(itemId: number) {
    return httpFetch<CartResponse>(`${API_ENDPOINTS.cartItems}/${itemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  clear() {
    // OAS shows form body with qty required, but semantically not needed; send a dummy per spec.
    const body = new URLSearchParams();
    body.set('qty', '1');
    return httpFetch<ClearCartResponse>(API_ENDPOINTS.cartClear, {
      method: 'DELETE',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
};
