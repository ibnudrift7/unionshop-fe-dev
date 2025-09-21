'use client';

import Image from 'next/image';
import { CategoryGridSkeleton } from '@/components/ui/skeleton';
import { Category } from '@/types';

interface CategoryGridSectionProps {
  categories?: Category[];
  isLoading?: boolean;
  onCategoryClick?: (category: Category) => void;
}

const defaultCategories: Category[] = [
  {
    id: 'starter-kit',
    name: 'Starter\nKit',
    image: '/assets/starter-kit.png',
    alt: 'Starter Kit',
  },
  {
    id: 'freebase-liquid',
    name: 'Freebase\nLiquid',
    image: '/assets/freebase.png',
    alt: 'Freebase Liquid',
  },
  {
    id: 'saltnic-liquid',
    name: 'Saltnic\nLiquid',
    image: '/assets/saltnic.png',
    alt: 'Saltnic Liquid',
  },
  {
    id: 'official-merchandise',
    name: 'Official\nMerchandise',
    image: '/assets/official-merch.png',
    alt: 'Official Merchandise',
  },
];

export default function CategoryGridSection({
  categories = defaultCategories,
  isLoading = false,
  onCategoryClick,
}: CategoryGridSectionProps) {
  return (
    <div className='mx-4 mb-6'>
      <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
        {isLoading ? (
          <CategoryGridSkeleton count={4} />
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category)}
              className='text-center bg-white rounded-lg shadow-lg p-2 sm:p-3 md:p-4 hover:shadow-xl transition-shadow'
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
          ))
        )}
      </div>
    </div>
  );
}
