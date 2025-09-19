'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutSection from '@/components/sections/checkout/CheckoutSection';

export default function CheckoutPage() {
  const router = useRouter();
  const [total, setTotal] = useState(0);

  const totalFormatted = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(total),
    [total],
  );

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='flex items-center gap-2 p-4 border-b border-gray-100 bg-white'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-base font-semibold text-gray-900'>Checkout</h1>
      </div>

      <CheckoutSection onTotalChange={setTotal} />

      <div className='fixed left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 w-full max-w-[550px] px-4'>
        <div className='w-full bg-brand text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-lg'>
          <div className='flex flex-col leading-tight'>
            <span className='text-xs opacity-90'>Total Pesanan</span>
            <span className='text-lg font-semibold'>{totalFormatted}</span>
          </div>
          <Button
            size='icon'
            className='h-8 w-8 rounded-full bg-white text-brand hover:bg-white/90'
            onClick={() => console.log('Proceed to payment')}
            aria-label='Lanjut ke pembayaran'
          >
            <ArrowRight className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div className='h-32 sm:h-36' />
    </div>
  );
}
