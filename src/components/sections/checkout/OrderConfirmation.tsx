'use client';

import {
  ArrowLeft,
  Minus,
  Plus,
  Pencil,
  ArrowRight,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
  const router = useRouter();
  const [quantities, setQuantities] = useState({ item1: 1, item2: 1 });

  const updateQuantity = (item: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(1, prev[item as keyof typeof prev] + change),
    }));
  };

  const items = [
    {
      id: 'item1',
      productId: '1',
      name: 'Freebase Makna Ice Sea Salt Caramel latte 35 MG',
      price: 130000,
      image: '/assets/Product.png',
    },
    {
      id: 'item2',
      productId: '2',
      name: 'Makna - Jersey Boxy Oversized Purple, XXL',
      price: 150000,
      image: '/assets/SpecialProduct.png',
    },
  ];

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * quantities[item.id as keyof typeof quantities],
    0,
  );

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <div className='flex items-center justify-between p-4 border-b border-gray-100'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-lg font-semibold text-gray-900'>
          Konfirmasi Pesanan
        </h1>
        <div className='w-8' />
      </div>

      <div className='bg-white'>
        <div className='px-4'>
          <Card className='p-4 border border-brand rounded-lg'>
            <div className='flex items-start justify-between gap-2'>
              <div>
                <p className='text-sm text-gray-900'>
                  Alamat: <span className='font-semibold'>Kantor</span>
                </p>
                <p className='text-xs text-gray-600 mt-1'>
                  Jl. Banyurip Wetan gang 5, Purworejo, 54112
                </p>
              </div>
              <button
                type='button'
                onClick={() => router.push('/shipping')}
                className='text-sm font-medium text-brand hover:underline'
              >
                Ubah
              </button>
            </div>
          </Card>
        </div>
        <div className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-base font-semibold text-gray-900'>Pesanan</h2>
            <Button
              variant='outline'
              className='text-brand border-brand hover:bg-brand/5 bg-transparent flex items-center gap-1'
              onClick={() => router.push('/orders/add')}
            >
              Tambah Pesanan
              <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-4'>
            {items.map((item) => (
              <Card key={item.id} className='p-4 border-0 shadow-sm'>
                <div className='flex items-start gap-3'>
                  <div className='relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes='64px'
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium text-sm mb-1'>{item.name}</h3>
                    <p className='text-lg font-semibold mb-2'>
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>

                    <div className='flex items-center justify-between'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8 px-2 text-xs rounded-md text-brand border-brand bg-transparent hover:bg-brand/5 flex items-center gap-1'
                        onClick={() =>
                          router.push(`/product/${item.productId}?noCart=1`)
                        }
                      >
                        <Pencil className='h-3.5 w-3.5' />
                        Ganti
                      </Button>

                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-7 w-7 rounded-full bg-transparent border-gray-300'
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className='h-3.5 w-3.5' />
                        </Button>
                        <span className='w-7 text-center'>
                          {quantities[item.id as keyof typeof quantities]}
                        </span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-7 w-7 rounded-full bg-transparent border-gray-300'
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className='h-3.5 w-3.5' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className='mt-6'>
            {/* guest mode */}
            <button
              type='button'
              onClick={() => router.push('/shipping')}
              className='w-full text-left mb-3'
            >
              <Card className='p-4 border-0 shadow-sm hover:bg-gray-50 transition'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Isi Data Pengiriman
                      </p>
                      <p className='text-xs text-gray-500'>
                        Lengkapi alamat pengiriman
                      </p>
                    </div>
                  </div>
                  <ArrowRight className='h-5 w-5 text-gray-400' />
                </div>
              </Card>
            </button>

            <div className='border border-brand rounded-lg p-3 flex items-start gap-2'>
              <Coins className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-gray-900'>
                Kamu akan mendapatkan{' '}
                <span className='font-semibold'>50 point</span> dari total
                belanja ini
              </p>
            </div>
          </div>
        </div>

        <div className='fixed left-1/2 -translate-x-1/2 bottom-[72px] sm:bottom-[76px] w-full max-w-[720px] bg-white border-t p-4'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-lg font-semibold text-gray-900'>
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
          <Button
            className='w-full bg-brand hover:bg-brand/80 text-white py-3'
            onClick={() => router.push('/checkout')}
          >
            Pilih Pembayaran
          </Button>
        </div>

        <div className='h-40 sm:h-44' />
      </div>
    </div>
  );
}
