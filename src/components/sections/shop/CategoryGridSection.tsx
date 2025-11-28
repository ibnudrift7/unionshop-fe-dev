'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CategoryGridSkeleton } from '@/components/ui/skeleton';
import { Category } from '@/types';
import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

interface CategoryGridSectionProps {
  categories: Category[];
  isLoading?: boolean;
  onCategoryClick?: (category: Category) => void;
}

export default function CategoryGridSection({
  categories,
  isLoading = false,
  onCategoryClick,
}: CategoryGridSectionProps) {
  const router = useRouter();

  const handleClick = (category: Category) => {
    onCategoryClick?.(category);
    try {
      router.push(`/shop?category=${encodeURIComponent(category.id)}`);
    } catch {
      router.push(`/shop?category=${category.id}`);
    }
  };

  return (
    <div className='mx-4 mb-3'>
      {isLoading ? (
        <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
          <CategoryGridSkeleton count={4} />
        </div>
      ) : (
        <Carousel
          className='w-full overflow-hidden'
          opts={{ align: 'start', loop: true }}
        >
          <CarouselContent className='pb-2 -ml-2 sm:-ml-3 md:-ml-4'>
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className='pl-2 sm:pl-3 md:pl-4 basis-[calc(100%/3.5)]'
              >
                <button
                  onClick={() => handleClick(category)}
                  className='text-center bg-white rounded-lg shadow-lg p-2 sm:p-3 md:p-4 hover:shadow-xl transition-shadow cursor-pointer w-full'
                >
                  <Image
                    src={category.image}
                    alt={category.alt}
                    width={80}
                    height={80}
                    className='mx-auto mb-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain'
                  />
                  <p className='text-sm font-bold text-black whitespace-pre-line'>
                    {category.name}
                  </p>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
