'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShopFilter } from './data';
import { CategoryGridSkeleton } from '@/components/ui/skeleton';
import { Category } from '@/types';

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

  const categoryToFilter: Record<string, ShopFilter | undefined> = {
    'starter-kit': 'starter',
    'freebase-liquid': 'freebase',
    'saltnic-liquid': 'saltnic',
    'official-merchandise': 'official',
  };

  const handleClick = (category: Category) => {
    onCategoryClick?.(category);
    const f = categoryToFilter[category.id];
    if (f) {
      router.push(`/shop?filter=${f}`);
    }
  };
  return (
    <div className='mx-4 mb-6'>
      <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
        {isLoading ? (
          <CategoryGridSkeleton count={4} />
        ) : (
          categories.map((category) => (
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
          ))
        )}
      </div>
    </div>
  );
}
