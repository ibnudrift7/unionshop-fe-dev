'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useBundlesQuery from '@/hooks/use-bundles';
import type { Product as UiProduct } from '@/types';

interface PromoProduct {
  id: string;
  slug?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  soldCount: number;
  expiryDate: string;
  shippingDiscount: string;
  percentDiscount?: string;
}

export function DiscountOffers() {
  const router = useRouter();
  const { data: bundles } = useBundlesQuery();

  const DEFAULT_IMG = '/assets/promo-item.png';

  const products: PromoProduct[] = React.useMemo(() => {
    if (!bundles || bundles.length === 0) {
      return [
        {
          id: '1',
          name: 'Makna Trio Deal 7MG',
          image: '/assets/promo-item.png',
          price: 200000,
          originalPrice: 360000,
          rating: 5.0,
          soldCount: 500,
          expiryDate: '20 September 2025',
          shippingDiscount: 'Diskon Ongkir 40rb',
          percentDiscount: 'Diskon 50%',
        },
        {
          id: '2',
          name: 'Wasp Nano X2 + Makna ...',
          image: '/assets/promo-item.png',
          price: 200000,
          rating: 5.0,
          soldCount: 500,
          expiryDate: '20 September 2025',
          shippingDiscount: 'Diskon Ongkir 40rb',
        },
        {
          id: '3',
          name: 'Oxva + Makna',
          image: '/assets/promo-item.png',
          price: 200000,
          rating: 5.0,
          soldCount: 500,
          expiryDate: '20 September 2025',
          shippingDiscount: 'Diskon Ongkir 40rb',
        },
      ];
    }

    return bundles.map((b: UiProduct) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      image: (b.image as string) ?? DEFAULT_IMG,
      price: (b.price as number) ?? 0,
      originalPrice: (b.discountPrice as number) ?? undefined,
      rating: (b.rating as number) ?? 4.5,
      soldCount: Math.floor(Math.random() * 1000),
      expiryDate: 'Segera berakhir',
      shippingDiscount: 'Diskon Ongkir 40rb',
      percentDiscount: (b.discountPrice as number)
        ? `${Math.round(
            ((b.discountPrice as number) / ((b.price as number) || 1)) * 100,
          )}%`
        : undefined,
    }));
  }, [bundles]);

  return (
    <div className='mx-auto max-w-2xl px-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-foreground'>
          Tawaran Diskon Terbaik
        </h1>
        <p className='text-lg font-extralight text-black'>
          Belanja banyak tanpa takut dompet boncos.
        </p>
      </div>

      <div className='space-y-4'>
        {products.map((product) => (
          <Card
            key={product.id}
            className='p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand'
            role='button'
            tabIndex={0}
            onClick={() =>
              router.push(`/promo/all/${product.slug ?? product.id}`)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push(`/promo/all/${product.slug ?? product.id}`);
              }
            }}
          >
            <div className='flex gap-4'>
              <div className='relative h-[135px] w-28 flex-shrink-0 rounded-3xl overflow-hidden border border-gray-300'>
                <div className='h-24 w-28 absolute'>
                  <Image
                    src={product.image || DEFAULT_IMG}
                    alt={product.name}
                    fill
                    className='object-cover rounded-3xl'
                  />
                </div>

                <div className='absolute top-20 left-1/2 -translate-x-1/2 z-10'>
                  <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm'>
                    <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                    <span className='font-bold text-sm text-foreground'>
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-full text-center mb-1'>
                  <span className='text-xs text-gray-600 whitespace-nowrap'>
                    {product.soldCount}+ Terjual
                  </span>
                </div>
              </div>

              <div className='flex flex-1 flex-col justify-between'>
                <div>
                  <h3 className='font-semibold text-black mb-1 text-lg'>
                    {product.name}
                  </h3>
                  <p className='text-xs text-black mb-2 border-b-[1.5px] border-dashed pb-2'>
                    Hanya berlaku sampai {product.expiryDate}
                  </p>

                  <div className='flex items-center gap-1 mb-2'>
                    <span
                      className={`text-lg font-medium ${
                        product.originalPrice || product.percentDiscount
                          ? 'text-red-600'
                          : 'text-foreground'
                      }`}
                    >
                      Rp. {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                      <span className='text-xs font-light text-black line-through'>
                        Rp. {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  <div className='flex flex-col gap-1 '>
                    <div className='flex items-center gap-2'>
                      <Image
                        src='/assets/shipping-truck.png'
                        alt='Ongkos Kirim'
                        width={16}
                        height={16}
                        className='object-contain'
                      />
                      <span className='text-sm text-black'>
                        {product.shippingDiscount}
                      </span>
                    </div>

                    {product.percentDiscount && (
                      <div className='flex items-center gap-2'>
                        <Image
                          src='/assets/discount-icon.png'
                          alt='Diskon'
                          width={16}
                          height={16}
                          className='object-contain'
                        />
                        <span className='text-sm text-black'>
                          {product.percentDiscount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DiscountOffers;
