'use client';

import { Coins, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';

interface CheckoutSectionProps {
  onTotalChange?: (total: number) => void;
}

export function CheckoutSection({ onTotalChange }: CheckoutSectionProps) {
  const { items } = useCartStore();
  const [usePoints, setUsePoints] = useState(false);

  const subtotalProduct = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );
  const subtotalShipping = items.length > 0 ? 10000 : 0;
  const pointsDiscount = usePoints ? 5000 : 0; 
  const totalOrder = useMemo(
    () => Math.max(0, subtotalProduct + subtotalShipping - pointsDiscount),
    [subtotalProduct, subtotalShipping, pointsDiscount],
  );

  useEffect(() => {
    onTotalChange?.(totalOrder);
  }, [totalOrder, onTotalChange]);

  const format = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  return (
    <div className='p-4 space-y-4'>
      <Card className='border-0 m-0 p-0'>
        <CardContent className='px-4 py-2'>
          <div className='flex items-start gap-2'>
            <Image
              src='/assets/icon-check.png'
              alt='Alamat terpilih'
              width={28}
              height={28}
              className='mt-0.5 flex-shrink-0'
            />
            <div className='flex-1'>
              <p className='text-xs text-gray-600 mb-0.5'>Dikirim ke</p>
              <h3 className='text-sm font-semibold text-gray-900'>Kantor</h3>
              <p className='text-sm text-gray-600'>
                Jl. Suretejo Utara Baru No.174, RT. 003/RW.04, Dukuh
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-2 pt-0 mt-4'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3 pb-3 mb-3 border-b-2'>
            <div className='w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center'>
              <ShoppingBag className='h-4 w-4 text-brand' />
            </div>
            <h3 className='text-sm font-semibold text-gray-900'>Pesanan</h3>
            <span className='text-xs text-gray-500 ml-auto'>
              Total {items.reduce((acc, i) => acc + i.quantity, 0)} Item
            </span>
          </div>

          <div className='space-y-4'>
            {items.length === 0 && (
              <p className='text-xs text-gray-500'>Keranjang kosong.</p>
            )}
            {items.map((i, idx) => (
              <div
                key={i.product.id}
                className='flex justify-between items-center relative'
              >
                <div className='flex-1 pr-2'>
                  <span className='text-xs font-semibold text-gray-700'>
                    {i.quantity} x
                  </span>
                  <p className='text-sm font-semibold text-gray-900 mt-1 line-clamp-2'>
                    {i.product.name}
                  </p>
                </div>
                <p className='text-sm font-semibold text-gray-900 ml-4 whitespace-nowrap'>
                  Rp {format(i.product.price * i.quantity)}
                </p>
                {idx !== items.length - 1 && (
                  <hr className='border-dashed border-gray-300 absolute -bottom-2 left-0 right-0' />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert className='bg-brand/50 border-brand/60 grid-cols-[auto_1fr] gap-x-3 items-center'>
        <Image
          src='/assets/attention-icon.png'
          alt='Perhatian'
          width={25}
          height={25}
        />
        <AlertDescription className='text-black text-base font-bold'>
          Pastikan nomor kamu dapat dihubungi oleh pihak kurir.
        </AlertDescription>
      </Alert>

      <div className='space-y-3'>
        <h3 className='text-sm font-semibold text-gray-900'>
          Estimasi Pengiriman 2 - 4 hari
        </h3>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image
              src='/assets/icon-check.png'
              alt='Alamat terpilih'
              width={28}
              height={28}
              className='mt-0.5 flex-shrink-0'
            />
            <div>
              <p className='text-base font-semibold text-black'>
                Tanggal dipesan :
              </p>
              <p className='text-base font-semibold text-black'>
                {new Date().toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Image
              src='/assets/icon-check.png'
              alt='Alamat terpilih'
              width={28}
              height={28}
              className='mt-0.5 flex-shrink-0'
            />
            <div>
              <p className='text-base font-semibold text-black'>
                Estimasi terkirim :
              </p>
              <p className='text-base font-semibold text-black'>
                {new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4 space-y-1'>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-600'>Subtotal produk</p>
            <p className='text-sm font-medium text-gray-900'>
              Rp {format(subtotalProduct)}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-600'>Subtotal Pengiriman</p>
            <p className='text-sm font-medium text-gray-900'>
              Rp {format(subtotalShipping)}
            </p>
          </div>
          {pointsDiscount > 0 && (
            <div className='flex justify-between items-center text-green-600'>
              <p className='text-sm'>Diskon Poin</p>
              <p className='text-sm font-medium'>
                - Rp {format(pointsDiscount)}
              </p>
            </div>
          )}
          <hr className='border-gray-200' />
          <div className='flex justify-end items-center gap-2'>
            <p className='text-base text-gray-900'>Total Pesanan:</p>
            <p className='text-base font-bold text-gray-900'>
              Rp {format(totalOrder)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <label htmlFor='use-points' className='cursor-pointer select-none'>
              <h3 className='text-sm font-semibold text-gray-900'>
                Gunakan poin
              </h3>
              <p className='text-xs text-gray-600'>Total poin kamu : 10.050</p>
            </label>
            <Checkbox
              id='use-points'
              checked={usePoints}
              onCheckedChange={(v) => setUsePoints(!!v)}
              className='size-5 border-2 border-gray-400 data-[state=checked]:bg-brand data-[state=checked]:border-brand focus-visible:ring-brand/50'
            />
          </div>

          <div className='border border-brand rounded-lg p-3 flex items-center gap-3'>
            <Coins className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
            <p className='text-base text-brand'>
              Kamu akan mendapatkan{' '}
              <span className='font-bold text-brand'>
                {Math.max(0, Math.round(subtotalProduct / 10000) * 10)} point
              </span>{' '}
              dari total belanja ini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckoutSection;
