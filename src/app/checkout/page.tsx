'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='flex items-center gap-2 p-4 pt-8 border-b border-gray-100 bg-white'>
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

      <div className='px-4 py-6 sm:py-8'>
        <Button
          className='w-full bg-brand hover:bg-brand/80 text-white font-bold text-lg py-7 rounded-xl justify-center'
          onClick={() => console.log('Proceed to payment')}
          aria-label='Bayar sekarang'
        >
          Bayar - {totalFormatted}
        </Button>
      </div>
    </div>
  );
}
