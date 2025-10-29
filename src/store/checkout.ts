import { create } from 'zustand';
import type { ApplyPromoData } from '@/types/promo';

interface CheckoutState {
  promo: ApplyPromoData | null;
  setPromo: (promo: ApplyPromoData | null) => void;
  clear: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  promo: null,
  setPromo: (promo) => set({ promo }),
  clear: () => set({ promo: null }),
}));

if (typeof window !== 'undefined') {
  useCheckoutStore.subscribe((state) => {
    try {
      const payload = JSON.stringify({ promo: state.promo });
      localStorage.setItem('checkout_state', payload);
    } catch {}
  });

  try {
    const raw = localStorage.getItem('checkout_state');
    if (raw) {
      const parsed = JSON.parse(raw) as { promo?: ApplyPromoData | null };
      useCheckoutStore.setState({ promo: parsed?.promo ?? null });
    }
  } catch {}
}
