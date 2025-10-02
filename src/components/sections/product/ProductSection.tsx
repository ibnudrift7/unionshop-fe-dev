'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Package, Star } from 'lucide-react';

interface ProductSectionProps {
  title?: string;
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
  showChevron?: boolean;
  selectionMode?: boolean;
  selectedIds?: string[];
}

export default function ProductSection({
  title = 'Lihat Semua',
  products,
  isLoading = false,
  onProductClick,
  showChevron = true,
  selectionMode = false,
  selectedIds = [],
}: ProductSectionProps) {
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className='px-4'>
      <div className='flex items-center justify-between mb-3'>
        <div className='text-start font-bold text-xl text-black'>{title}</div>
        {showChevron && (
          <button
            type='button'
            onClick={() => router.push('/shop')}
            aria-label='Lihat semua produk'
            className='p-1 rounded-md hover:bg-gray-100 active:scale-95 transition w-7 h-7 flex items-center justify-center cursor-pointer'
          >
            <Image
              src='/assets/icon-arrow.png'
              alt='Arrow'
              width={20}
              height={20}
              className='w-5 h-5'
            />
          </button>
        )}
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          products.map((product) => {
            const isSelected =
              selectionMode && selectedIds.includes(product.id);
            return (
              <Card
                key={product.id}
                className={`rounded-md shadow-none overflow-hidden py-0 transition-colors ${
                  selectionMode
                    ? isSelected
                      ? 'border border-brand bg-brand/5'
                      : 'border border-transparent hover:border-brand/40'
                    : 'border-none'
                }`}
                onClick={() => onProductClick?.(product)}
              >
                <CardContent className='p-3 cursor-pointer'>
                  <div className='relative mb-2'>
                    <div className='w-full h-28 md:h-36 py-2 rounded-sm flex items-center justify-center relative overflow-hidden'>
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
                    {product.isNew && (
                      <Badge className='absolute top-1 right-1 bg-brand text-white text-sm md:text-lg font-bold rounded-full w-10 h-10 md:h-15 md:w-15 flex items-center justify-center p-0'>
                        Baru!
                      </Badge>
                    )}
                    {selectionMode && (
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 rounded-sm border flex items-center justify-center text-[10px] font-bold ${
                          isSelected
                            ? 'bg-brand text-white border-brand'
                            : 'bg-white text-gray-400 border-gray-300'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </div>
                    )}
                  </div>
                  <p className='text-sm md:text-base font-semibold mb-1 pt-4 whitespace-nowrap overflow-hidden text-ellipsis'>
                    {product.name}
                  </p>
                  <div className='flex flex-col text-xs'>
                    <span className='text-sm md:text-base text-black'>
                      {formatPrice(product.price)}
                    </span>
                    <div className='flex items-center pt-2'>
                      <span>
                        <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                      </span>
                      <span className='text-gray-600'>{product.rating}</span>
                      <span className='text-gray-600'>
                        • {product.sold}+ terjual
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </section>
  );
}
