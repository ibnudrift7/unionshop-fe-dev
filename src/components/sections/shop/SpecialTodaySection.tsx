'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SpecialTodayCarouselSkeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import type { ApiProduct } from '@/types/product';
import type { Product } from '@/types';
import { Package, Star } from 'lucide-react';
import { useProductsQuery } from '@/hooks/use-products';

interface SpecialTodaySectionProps {
  title?: string;
  // accept backend product shape (ApiProduct)
  products?: ApiProduct[];
  isLoading?: boolean;
  onProductClick?: (product: ApiProduct | Product) => void;
}

export default function SpecialTodaySection({
  title = 'Spesial Hari Ini',
  products,
  isLoading = false,
  onProductClick,
}: SpecialTodaySectionProps) {
  const { data: fetchedProducts, isLoading: fetchedLoading } =
    useProductsQuery();
  let sourceProducts: Array<ApiProduct | Product> = [];
  if (products && products.length > 0) {
    sourceProducts = products as Array<ApiProduct | Product>;
  } else if (Array.isArray(fetchedProducts)) {
    sourceProducts = fetchedProducts as Array<ApiProduct | Product>;
  }
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
            sourceProducts.map((p: ApiProduct | Product) => {
              const isApi = p && typeof p === 'object' && 'base_price' in p;
              const id = String(p.id);
              let name = '';
              if (typeof p.name === 'string') name = p.name;

              let img = '';
              if (isApi) {
                const ap = p as ApiProduct;
                if (typeof ap.cover_image === 'string') img = ap.cover_image;
              } else {
                const up = p as Product;
                if (typeof up.image === 'string' && up.image) img = up.image;
                else if (
                  Array.isArray(up.images) &&
                  typeof up.images[0] === 'string'
                )
                  img = up.images[0];
              }

              let currentPrice = 0;
              let originalPrice: number | null = null;
              if (isApi) {
                const ap = p as ApiProduct;
                const base =
                  typeof ap.base_price === 'string'
                    ? parseFloat(ap.base_price)
                    : NaN;
                const sale =
                  typeof ap.sale_price === 'string'
                    ? parseFloat(ap.sale_price)
                    : NaN;
                if (Number.isFinite(sale) && sale > 0) {
                  currentPrice = sale;
                  if (Number.isFinite(base) && base > 0) originalPrice = base;
                } else if (Number.isFinite(base)) {
                  currentPrice = base;
                }
              } else {
                const up = p as Product;
                if (typeof up.price === 'number' && Number.isFinite(up.price))
                  currentPrice = up.price;
                if (
                  typeof up.discountPrice === 'number' &&
                  Number.isFinite(up.discountPrice)
                )
                  originalPrice = up.discountPrice;
              }

              const rating = 5.0;
              const totalSales = Math.floor(450 + Math.random() * 51);

              // let rating = 0;
              // if (isApi) {
              //   const ap = p as ApiProduct;
              //   const r = Number(ap.average_rating);
              //   if (Number.isFinite(r)) rating = r;
              // } else {
              //   const up = p as Product;
              //   const r = Number(up.rating);
              //   if (Number.isFinite(r)) rating = r;
              // }

              // let totalSales = 0;
              // if (isApi) {
              //   const ap = p as ApiProduct;
              //   const raw =
              //     typeof ap.formatted_sales === 'string'
              //       ? ap.formatted_sales
              //       : '';
              //   const digits = raw.replace(/[^0-9]/g, '');
              //   const n = Number(digits);
              //   if (Number.isFinite(n)) totalSales = n;
              // } else {
              //   const up = p as Product;
              //   const n = Number(up.sold);
              //   if (Number.isFinite(n)) totalSales = n;
              // }

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
                          {formatPrice(currentPrice)}
                        </span>
                        {originalPrice !== null && originalPrice > 0 ? (
                          <span className='text-xs text-gray-500 line-through leading-tight'>
                            {formatPrice(originalPrice)}
                          </span>
                        ) : null}
                      </div>
                      <div className='flex items-center gap-1 mb-1'>
                        <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                        <span className='text-xs text-gray-600'>
                          {rating.toFixed(1)}
                        </span>
                        <span className='text-xs text-gray-400'>•</span>
                        <span className='text-xs text-gray-600'>
                          {totalSales > 999
                            ? `${Math.floor(totalSales / 1000)}k+ Terjual`
                            : `${totalSales} Terjual`}
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
