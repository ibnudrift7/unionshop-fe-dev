'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutSection from '@/components/sections/checkout/CheckoutSection';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useDefaultAddressQuery } from '@/hooks/use-address';
import { checkoutService } from '@/services/checkout';
import { useCheckoutStore } from '@/store/checkout';
import { toast } from 'sonner';

async function loadMidtransSnap(paymentUrl?: string) {
  if (typeof window === 'undefined') return;
  if (window.snap?.pay) return;

  const isSandbox = paymentUrl?.includes('sandbox');
  const src = isSandbox
    ? 'https://app.sandbox.midtrans.com/snap/snap.js'
    : 'https://app.midtrans.com/snap/snap.js';

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Gagal memuat Midtrans Snap'));
    document.body.appendChild(s);
  });
}

function extractSnapToken(paymentUrl?: string): string | undefined {
  if (!paymentUrl) return undefined;
  try {
    const u = new URL(paymentUrl);
    const parts = u.pathname.split('/');
    return parts[parts.length - 1] || undefined;
  } catch {
    return undefined;
  }
}

function isCheckoutSuccess(
  x: unknown,
): x is { success: true; data?: { payment_url?: string } } {
  if (!x || typeof x !== 'object') return false;
  const obj = x as Record<string, unknown>;
  return obj.success === true;
}

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
  const promo = useCheckoutStore((s) => s.promo);
  const clearCheckout = useCheckoutStore((s) => s.clear);

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
        promo_code: promo?.promo_code || '',
        points_to_use: '0',
        order_notes: '',
        courier_id: courierId,
        shipping_package: serviceCode,
        shipping_day: day,
        shipping_fee: fee,
      });
      const payload = res.data as unknown;
      if (isCheckoutSuccess(payload) && payload.data) {
        const paymentUrl: string | undefined = payload.data.payment_url as
          | string
          | undefined;

        const token = extractSnapToken(paymentUrl);
        try {
          await loadMidtransSnap(paymentUrl);
          if (window.snap?.pay && token) {
            window.snap.pay(token, {
              onSuccess: () => {
                toast.success('Pembayaran berhasil');
                clearCheckout();
                router.push('/order-confirmation');
              },
              onPending: () => {
                toast.info('Menunggu pembayaran');
              },
              onError: () => {
                toast.error('Terjadi kesalahan pembayaran');
              },
              onClose: () => {
                // user closed modal
              },
            });
            return;
          }
        } catch (err) {
          console.warn('Snap modal tidak tersedia, fallback ke redirect:', err);
        }

        if (paymentUrl) {
          // Fallback redirect
          window.location.href = paymentUrl;
          return;
        }

        // Final fallback: go to confirmation if no payment url
        router.push('/order-confirmation');
        clearCheckout();
        return;
      }

      toast.error('Checkout gagal: respons tidak valid');
    } catch (e) {
      console.error('Checkout failed:', e);
      toast.error((e as Error)?.message || 'Checkout gagal');
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
        {promo?.promo_code && (
          <div className='text-xs text-green-700 mb-2'>
            Promo {promo.promo_code} diterapkan
          </div>
        )}
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
