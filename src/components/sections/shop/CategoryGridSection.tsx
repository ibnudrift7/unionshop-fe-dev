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
import Autoplay from 'embla-carousel-autoplay';

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
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );

  const handleClick = (category: Category) => {
    onCategoryClick?.(category);
    try {
      router.push(`/shop?category=${encodeURIComponent(category.id)}`);
    } catch {
      router.push(`/shop?category=${category.id}`);
    }
  };

  const pages = React.useMemo(() => {
    const result: Category[][] = [];
    for (let i = 0; i < categories.length; i += 4) {
      result.push(categories.slice(i, i + 4));
    }
    return result;
  }, [categories]);
  return (
    <div className='mx-4 mb-3'>
      {isLoading ? (
        <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
          <CategoryGridSkeleton count={4} />
        </div>
      ) : (
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start', loop: pages.length > 1 }}
        >
          <CarouselContent className='pb-2'>
            {pages.map((group, idx) => (
              <CarouselItem key={idx} className='basis-full'>
                <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
                  {group.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleClick(category)}
                      className='text-center bg-white rounded-lg shadow-lg p-2 sm:p-3 md:p-4 hover:shadow-xl transition-shadow cursor-pointer'
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
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
