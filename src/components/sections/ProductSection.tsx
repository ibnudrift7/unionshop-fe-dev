'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Product } from '@/types';
import { ChevronRight, Package, Star } from 'lucide-react';

interface ProductSectionProps {
  title?: string;
  products?: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Produk 1',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: true,
  },
  {
    id: '2',
    name: 'Produk 2',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: true,
  },
  {
    id: '3',
    name: 'Produk 3',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
  {
    id: '4',
    name: 'Produk 4',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
  {
    id: '5',
    name: 'Produk 5',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
  {
    id: '6',
    name: 'Produk 6',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
];

export default function ProductSection({
  title = 'Lihat Semua',
  products = defaultProducts,
  isLoading = false,
  onProductClick,
}: ProductSectionProps) {
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
      <div className='grid grid-cols-2 gap-4'>
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              className='shadow-sm cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => onProductClick?.(product)}
            >
              <CardContent className='p-3'>
                <div className='relative mb-2'>
                  <div className='w-full h-24 bg-gray-200 rounded flex items-center justify-center relative overflow-hidden'>
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
                    <Badge className='absolute top-1 right-1 bg-brand text-white text-xs rounded-full w-10 h-10 flex items-center justify-center p-0'>
                      Baru!
                    </Badge>
                  )}
                </div>
                <p className='text-sm font-semibold mb-1'>{product.name}</p>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between text-xs space-y-1 md:space-y-0'>
                  <span className='font-bold text-green-600'>
                    {formatPrice(product.price)}
                  </span>
                  <div className='flex items-center space-x-1'>
                    <span>
                      <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                    </span>
                    <span className='text-gray-600'>{product.rating}</span>
                    <span className='text-gray-500'>
                      • {product.sold} terjual
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
