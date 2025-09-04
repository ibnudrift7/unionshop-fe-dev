'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpecialTodayCarouselSkeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { SpecialProduct } from '@/types';
import { Package, Star, ChevronRight } from 'lucide-react';

interface SpecialTodaySectionProps {
  title?: string;
  products?: SpecialProduct[];
  isLoading?: boolean;
  onProductClick?: (product: SpecialProduct) => void;
}

const defaultProducts: SpecialProduct[] = [
  {
    id: '1',
    name: 'Produk 1',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '2',
    name: 'Produk 2',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '3',
    name: 'Produk 3',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '4',
    name: 'Produk 4',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '5',
    name: 'Produk 5',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '6',
    name: 'Produk 6',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '7',
    name: 'Produk 7',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '8',
    name: 'Produk 8',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
];

export default function SpecialTodaySection({
  title = 'Spesial Hari Ini',
  products = defaultProducts,
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
        <div className='text-start font-bold text-gray-700'>{title}</div>
        <ChevronRight className='w-5 h-5 text-gray-600' />
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {isLoading ? (
            <SpecialTodayCarouselSkeleton count={6} />
          ) : (
            products.map((product) => (
              <CarouselItem
                key={product.id}
                className='pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4'
              >
                <Card
                  className='shadow-sm cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => onProductClick?.(product)}
                >
                  <CardContent className='p-3'>
                    <div className='relative mb-2'>
                      <div className='w-full h-20 bg-gray-200 rounded flex items-center justify-center relative overflow-hidden'>
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
                      <Badge className='absolute top-1 left-1 bg-red-500 text-white text-xs'>
                        Promo
                      </Badge>
                    </div>
                    <p className='text-sm font-semibold'>{product.name}</p>
                    <div className='flex flex-col space-x-1'>
                      <span className='text-sm font-bold text-red-500'>
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className='text-xs text-gray-500 line-through'>
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
