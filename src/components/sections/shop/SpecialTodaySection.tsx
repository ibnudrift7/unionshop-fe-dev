'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SpecialTodayCarouselSkeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { SpecialProduct } from '@/types';
import { Package, Star } from 'lucide-react';

interface SpecialTodaySectionProps {
  title?: string;
  products: SpecialProduct[];
  isLoading?: boolean;
  onProductClick?: (product: SpecialProduct) => void;
}

export default function SpecialTodaySection({
  title = 'Spesial Hari Ini',
  products,
  isLoading = false,
  onProductClick,
}: SpecialTodaySectionProps) {
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
          {isLoading ? (
            <SpecialTodayCarouselSkeleton count={6} />
          ) : (
            products.map((product) => (
              <CarouselItem
                key={product.id}
                className='pl-2 md:pl-4 basis-[48%] sm:basis-[47%] md:basis-[46%]'
              >
                <Card
                  className='shadow-sm cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => onProductClick?.(product)}
                >
                  <CardContent className='p-3'>
                    <div className='relative mb-2'>
                      <div className='w-full h-20 md:h-32 bg-white rounded flex items-center justify-center relative overflow-hidden'>
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
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
                    <p className='text-sm font-semibold pt-4'>{product.name}</p>
                    <div className='flex flex-col space-x-1'>
                      <span className='text-lg text-red-600 leading-snug'>
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className='text-sm text-gray-500 line-through'>
                        {formatPrice(product.originalPrice)}
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
            ))
          )}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
