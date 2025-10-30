'use client';

import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import BottomActionBar from './BottomActionBar';
import { useState } from 'react';
import Image from 'next/image';
import { useProductReviewsQuery } from '@/hooks/use-product-reviews';

export default function ProductReviews() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const slug = params?.id;
  const page = 1;
  const { data, isLoading, isError } = useProductReviewsQuery(slug, page);

  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (change: number) => {
    setQuantity((q) => Math.max(1, q + change));
  };

  const stats = data?.statistics;
  const reviews = data?.reviews ?? [];

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[720px] border-x border-gray-200'>
      <div className='flex items-center justify-between p-3 pt-8 border-b border-gray-100'>
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
        <h2 className='text-lg font-semibold text-center text-brand mb-4'>
          {slug ? `Ulasan Produk` : 'Ulasan'}
        </h2>

        <div className='flex items-center gap-2 mb-6'>
          <div className='flex items-center gap-1'>
            <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
            <span className='text-xl font-semibold text-gray-900'>
              {stats ? stats.average_rating.toFixed(1) : '—'}
            </span>
            <span className='text-sm text-gray-500'>/5.0</span>
          </div>
          <div className='flex flex-col items-start ms-3'>
            <div className='text-sm text-black font-semibold'>
              {stats
                ? `${Math.round(
                    (stats.average_rating / 5) * 100,
                  )}% pembeli merasa puas`
                : ''}
            </div>
            <div className='text-sm text-black font-light'>
              {stats ? `${stats.total_reviews} rating` : ''}
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          {isLoading && <div>Memuat ulasan…</div>}
          {isError && <div>Gagal memuat ulasan.</div>}
          {!isLoading && !isError && reviews.length === 0 && (
            <div className='text-center text-gray-500'>Belum ada ulasan.</div>
          )}

          {reviews.map((review) => (
            <div key={review.id} className='flex items-start gap-3 py-3'>
              <div className='h-10 w-10 flex items-center justify-center'>
                <Image
                  src='/assets/user-icon.png'
                  alt={review.user_name}
                  width={40}
                  height={40}
                  className='h-10 w-10 object-contain'
                />
              </div>

              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-900'>
                    {review.user_name}
                  </span>
                  <div className='flex items-center gap-1'>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-5 w-5 ${
                          starIndex < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className='text-sm text-gray-700 mt-2'>
                  {review.review}
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  {new Date(review.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: pagination controls - use data.pagination */}
      </div>

      <BottomActionBar
        noteText='20.000'
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
