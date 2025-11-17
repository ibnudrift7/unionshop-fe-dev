'use client';

import { ShopSection, FooterNavigationSection } from '@/components/sections';
import { Suspense, useEffect, useMemo } from 'react';
import { useCartQuery } from '@/hooks/use-cart';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/hooks/use-auth-status';
import type { CartItem } from '@/store/cart';
import { formatIDR } from '@/lib/utils';

export default function ShopPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const { isLoggedIn, isReady } = useAuthStatus();
  const { data: memberCart } = useCartQuery(Boolean(isReady && isLoggedIn));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isLoggedIn) return;
    try {
      const raw = localStorage.getItem('guest_cart');
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        useCartStore.setState({ items: parsed });
      }
    } catch {}
  }, [isLoggedIn]);

  const itemsCount = useMemo(() => {
    if (isLoggedIn) {
      const list = memberCart?.data?.items ?? [];
      return list.reduce((sum, i) => sum + (i.qty ?? 0), 0);
    }
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [isLoggedIn, items, memberCart]);

  const totalAmount = useMemo(() => {
    if (isLoggedIn) {
      const raw = memberCart?.data?.summary?.subtotal;
      const n = Number(raw ?? 0);
      return Number.isFinite(n) ? n : 0;
    }
    return getTotal();
  }, [isLoggedIn, memberCart, getTotal]);
  const totalFormatted = useMemo(
    () => formatIDR(totalAmount),
    [totalAmount],
  );
  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200'>
      <Suspense
        fallback={
          <div className='p-4 text-sm text-gray-500'>Memuat data shop...</div>
        }
      >
        <ShopSection onSearch={() => {}} />
      </Suspense>
      <div className='h-36 sm:h-40' aria-hidden />

      {itemsCount > 0 && (
        <div className='fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-24 w-full max-w-[550px] px-4 z-50'>
          <div className='w-full bg-brand text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-lg'>
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-90'>{itemsCount} produk</span>
              <span className='text-lg font-semibold'>{totalFormatted}</span>
            </div>
            <Button
              size='icon'
              className='h-8 w-8 rounded-full bg-white text-brand hover:bg-white/90'
              onClick={() => router.push('/order-confirmation')}
              aria-label='Lanjut ke order confirmation'
            >
              <ArrowRight className='h-5 w-5' />
            </Button>
          </div>
        </div>
      )}
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
