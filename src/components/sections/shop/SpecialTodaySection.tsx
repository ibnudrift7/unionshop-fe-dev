'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SpecialTodayCarouselSkeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import type { Product } from '@/types';
import { Package, Star } from 'lucide-react';
import { useProductsQuery } from '@/hooks/use-products';

interface SpecialTodaySectionProps {
  title?: string;
  products?: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
}

export default function SpecialTodaySection({
  title = 'Spesial Hari Ini',
  products,
  isLoading = false,
  onProductClick,
}: SpecialTodaySectionProps) {
  const { data: fetchedProducts, isLoading: fetchedLoading } =
    useProductsQuery();
  const sourceProducts =
    products && products.length > 0 ? products : fetchedProducts ?? [];
  const loading = isLoading || fetchedLoading;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className='px-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='text-start font-bold text-black text-xl'>{title}</div>
        <Image
          src='/assets/icon-arrow.png'
          alt='Arrow'
          width={20}
          height={20}
          className='w-5 h-5'
        />
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4 pr-2 md:pr-4'>
          {loading ? (
            <SpecialTodayCarouselSkeleton count={6} />
          ) : (
            sourceProducts.map((p: Product) => {
              const id = String(p.id);
              const name = p.name ?? '';
              const img = p.image ?? p.images?.[0] ?? '';
              const discountPrice = Number(p.discountPrice ?? p.price ?? 0);
              const originalPrice = Number(p.price ?? discountPrice);

              return (
                <CarouselItem
                  key={id}
                  className='pl-2 md:pl-4 basis-[48%] sm:basis-[47%] md:basis-[46%]'
                >
                  <Card
                    className='cursor-pointer transition-shadow border-none'
                    onClick={() => onProductClick?.(p)}
                  >
                    <CardContent className='p-3'>
                      <div className='relative mb-2'>
                        <div className='w-full h-20 md:h-32 bg-white rounded flex items-center justify-center relative overflow-hidden'>
                          {img ? (
                            <Image
                              src={img}
                              alt={name}
                              width={80}
                              height={80}
                              className='object-contain w-full h-full'
                            />
                          ) : (
                            <span className='text-2xl'>
                              <Package className='w-8 h-8 text-gray-500' />
                            </span>
                          )}
                        </div>
                      </div>
                      <p className='text-sm font-semibold pt-1 leading-tight'>
                        {name}
                      </p>
                      <div className='flex flex-col leading-tight'>
                        <span className='text-lg text-red-600 leading-tight'>
                          {formatPrice(discountPrice)}
                        </span>
                        <span className='text-xs text-gray-500 line-through leading-tight'>
                          {formatPrice(originalPrice)}
                        </span>
                      </div>
                      <div className='flex items-center gap-1 mb-1'>
                        <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                        <span className='text-xs text-gray-600'>5.0</span>
                        <span className='text-xs text-gray-400'>•</span>
                        <span className='text-xs text-gray-600'>
                          500+ Terjual
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })
          )}
        </CarouselContent>
      </Carousel>
      <div className='border-t-2 border-gray-200 my-4' />
    </section>
  );
}
