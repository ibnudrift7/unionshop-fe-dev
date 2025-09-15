'use client';

import {
  MapPin,
  ShoppingBag,
  AlertTriangle,
  Calendar,
  Truck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useMemo, useState } from 'react';

interface CheckoutSectionProps {
  onTotalChange?: (total: number) => void;
}

export function CheckoutSection({ onTotalChange }: CheckoutSectionProps) {
  const [usePoints, setUsePoints] = useState(false);

  const subtotalProduct = 280000;
  const subtotalShipping = 10000;
  const pointsDiscount = usePoints ? 50 : 0;
  const totalOrder = useMemo(
    () => subtotalProduct + subtotalShipping - pointsDiscount,
    [subtotalProduct, subtotalShipping, pointsDiscount],
  );

  useEffect(() => {
    onTotalChange?.(totalOrder);
  }, [totalOrder, onTotalChange]);

  const format = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  return (
    <div className='p-4 space-y-4'>
      <Card className='border border-gray-200 rounded-lg shadow-sm'>
        <CardContent className='px-4 py-2'>
          <div className='flex items-start gap-2'>
            <div className='w-7 h-7 bg-brand/10 rounded-full flex items-center justify-center mt-0.5'>
              <MapPin className='h-4 w-4 text-brand' />
            </div>
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

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center'>
              <ShoppingBag className='h-4 w-4 text-brand' />
            </div>
            <h3 className='text-sm font-semibold text-gray-900'>Pesanan</h3>
            <span className='text-xs text-gray-500 ml-auto'>Total 2 Item</span>
          </div>

          <div className='space-y-4'>
            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                <span className='text-xs font-medium text-gray-700'>1 x</span>
                <p className='text-sm font-medium text-gray-900 mt-1'>
                  Freebase Makna Ice Sea Salt Caramel latte 35 MG
                </p>
              </div>
              <p className='text-sm font-semibold text-gray-900 ml-4'>
                Rp {format(130000)}
              </p>
            </div>

            <hr className='border-dashed border-gray-400' />

            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                <span className='text-xs font-medium text-gray-700'>1 x</span>
                <p className='text-sm font-medium text-gray-900 mt-1'>
                  Makna - Jersey Boxy Oversized Purple, XXL
                </p>
              </div>
              <p className='text-sm font-semibold text-gray-900 ml-4'>
                Rp {format(150000)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className='bg-yellow-50 border-yellow-200'>
        <AlertTriangle className='h-4 w-4 text-yellow-700' />
        <AlertDescription className='text-yellow-800 text-xs'>
          Pastikan nomor kamu dapat dihubungi oleh pihak kurir.
        </AlertDescription>
      </Alert>

      <div className='space-y-3'>
        <h3 className='text-sm font-semibold text-gray-900'>
          Estimasi Pengiriman 2 - 4 hari
        </h3>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center'>
              <Calendar className='h-4 w-4 text-brand' />
            </div>
            <div>
              <p className='text-xs font-medium text-gray-900'>
                Tanggal dipesan :
              </p>
              <p className='text-xs text-gray-600'>17 - Agustus - 2025</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center'>
              <Truck className='h-4 w-4 text-brand' />
            </div>
            <div>
              <p className='text-xs font-medium text-gray-900'>
                Estimasi terkirim :
              </p>
              <p className='text-xs text-gray-600'>20 - Agustus - 2025</p>
            </div>
          </div>
        </div>
      </div>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4 space-y-3'>
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
          <hr className='border-gray-200' />
          <div className='flex justify-between items-center'>
            <p className='text-sm font-semibold text-gray-900'>Total Pesanan</p>
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

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-3'>
            <div className='w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center'>
              <span className='text-yellow-900 text-xs font-bold'>!</span>
            </div>
            <p className='text-xs text-gray-900'>
              Kamu akan mendapatkan{' '}
              <span className='font-semibold'>50 point</span> dari total belanja
              ini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckoutSection;
