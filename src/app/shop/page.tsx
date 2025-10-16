'use client';

import { ShopSection, FooterNavigationSection } from '@/components/sections';
import { toast } from 'sonner';
import { Suspense, useMemo } from 'react';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ShopPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();

  const itemsCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const totalAmount = getTotal();
  const totalFormatted = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(totalAmount),
    [totalAmount],
  );
  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200'>
      <Suspense
        fallback={
          <div className='p-4 text-sm text-gray-500'>Memuat data shop...</div>
        }
      >
        <ShopSection
          cartCount={3}
          onSearch={(v) => console.log('search:', v)}
          onCartClick={() => toast('Cart opened')}
        />
      </Suspense>
      <div className='h-36 sm:h-40' aria-hidden />

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
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
