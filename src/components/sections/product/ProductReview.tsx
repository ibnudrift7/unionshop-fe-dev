'use client';

import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import BottomActionBar from './BottomActionBar';
import { useState } from 'react';
import Image from 'next/image';

export default function ProductReviews() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (change: number) => {
    setQuantity((q) => Math.max(1, q + change));
  };
  const reviews = Array(6).fill({
    id: 1,
    userName: 'Lebah Ganteng',
    rating: 5,
    comment: '',
  });

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
        <h1 className='text-lg font-semibold text-gray-900'>Ulasan</h1>
        <div className='w-8' />
      </div>

      <div className='p-4'>
        <h2 className='text-lg font-semibold text-brand mb-4'>
          Makna - Taro Milk Cheese
        </h2>

        <div className='flex items-center gap-2 mb-6'>
          <div className='flex items-center gap-1'>
            <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
            <span className='text-lg font-semibold text-gray-900'>4.9</span>
            <span className='text-sm text-gray-500'>/5.0</span>
          </div>
          <div className='text-sm text-gray-600'>97% pembeli merasa puas</div>
        </div>

        <div className='text-sm text-gray-500 mb-6'>6 rating</div>

        <div className='space-y-4'>
          {reviews.map((review, index) => (
            <div
              key={index}
              className='flex items-center gap-3 py-3'
            >
              <div className='h-10 w-10 flex items-center justify-center'>
                <Image
                  src='/assets/user-icon.png'
                  alt='User'
                  width={40}
                  height={40}
                  className='h-10 w-10 object-contain'
                />
              </div>

              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-900'>
                    {review.userName}
                  </span>
                  <div className='flex items-center gap-1'>
                    {Array(5)
                      .fill(0)
                      .map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className='h-7 w-7 fill-yellow-400 text-yellow-400'
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomActionBar
        noteText='Hemat Rp 20.000'
        quantity={quantity}
        onDecrease={() => handleQuantityChange(-1)}
        onIncrease={() => handleQuantityChange(1)}
        primaryLabel='+ Keranjang Rp 20.000.000'
        onPrimaryClick={() => router.push('/order-confirmation')}
      />

      <div className='h-40 sm:h-44' />
    </div>
  );
}
