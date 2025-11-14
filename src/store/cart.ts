import { create } from 'zustand';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  getTotal: () => number;
}

const loadInitialCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('guest_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitialCart(),
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.max(1, quantity) }
          : i,
      ),
    }));
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },
  clear: () => set({ items: [] }),
  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },
}));

if (typeof window !== 'undefined') {
  useCartStore.subscribe((state: CartState) => {
    try {
      const payload = JSON.stringify(state.items);
      localStorage.setItem('guest_cart', payload);
    } catch {}
  });
}
