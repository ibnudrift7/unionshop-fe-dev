'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutSection from '@/components/sections/checkout/CheckoutSection';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useDefaultAddressQuery } from '@/hooks/use-address';
import { checkoutService } from '@/services/checkout';

export default function CheckoutPage() {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const { isLoggedIn, isReady } = useAuthStatus();
  const { data: defaultAddress } = useDefaultAddressQuery(
    isReady && isLoggedIn,
  );
  const [selection, setSelection] = useState<{
    courierId: number | null;
    serviceCode: string | null;
    shippingFee: number;
    estimatedDay: string | null;
  }>({
    courierId: null,
    serviceCode: null,
    shippingFee: 0,
    estimatedDay: null,
  });
  const [isPaying, setIsPaying] = useState(false);

  const totalFormatted = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(total),
    [total],
  );

  const handlePay = async () => {
    if (!isLoggedIn) {
      console.warn('User must login to proceed checkout');
      return;
    }
    const addressId = defaultAddress?.data?.id;
    const courierId = selection.courierId;
    const serviceCode = selection.serviceCode;
    const fee = selection.shippingFee;
    const dayStr = selection.estimatedDay || '';
    const match = dayStr.match(/\d+/);
    const day = match ? match[0] : '0';
    if (!addressId || !courierId || !serviceCode || !fee) {
      console.warn('Incomplete checkout selection');
      return;
    }
    setIsPaying(true);
    try {
      const res = await checkoutService.create({
        shipping_address_id: addressId,
        promo_code: '',
        points_to_use: '0',
        order_notes: '',
        courier_id: courierId,
        shipping_package: serviceCode,
        shipping_day: day,
        shipping_fee: fee,
      });
      // You can redirect based on response if backend returns payment link
      console.log('Checkout response:', res.data);
      // For now, go to order confirmation page after checkout
      router.push('/order-confirmation');
    } catch (e) {
      console.error('Checkout failed:', e);
    } finally {
      setIsPaying(false);
    }
  };

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

      <CheckoutSection
        onTotalChange={setTotal}
        onSelectionChange={setSelection}
      />

      <div className='px-4 py-6 sm:py-8'>
        <Button
          className='w-full bg-brand hover:bg-brand/80 text-white font-bold text-lg py-7 rounded-xl justify-center'
          onClick={handlePay}
          disabled={isPaying}
          aria-label='Bayar sekarang'
        >
          {isPaying ? 'Memproses…' : `Bayar - ${totalFormatted}`}
        </Button>
      </div>
    </div>
  );
}
