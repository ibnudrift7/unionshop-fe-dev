'use client';

import { useCallback, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ProductSection from '../product/ProductSection';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';

type ShopFilter = 'starter' | 'freebase' | 'saltnic' | 'official';

const FILTERS: { id: ShopFilter; label: string }[] = [
  { id: 'starter', label: 'Starter kit' },
  { id: 'freebase', label: 'Freebase' },
  { id: 'saltnic', label: 'Saltnic' },
  { id: 'official', label: 'Official merchandise' },
];

interface ShopSectionProps {
  cartCount?: number;
  onProductClick?: (product: Product) => void;
  onSearch?: (value: string) => void;
  onCartClick?: () => void;
}

const sampleProducts: Record<ShopFilter, Product[]> = {
  starter: [
    {
      id: 'st-1',
      name: 'Starter Kit Alpha',
      image: '/assets/Product.png',
      price: 250000,
      rating: 4.8,
      sold: 320,
      isNew: true,
    },
    {
      id: 'st-2',
      name: 'Starter Kit Beta',
      image: '/assets/Product.png',
      price: 299000,
      rating: 4.7,
      sold: 210,
    },
    {
      id: 'st-3',
      name: 'Starter Kit Gamma',
      image: '/assets/Product.png',
      price: 199000,
      rating: 4.6,
      sold: 185,
    },
  ],
  freebase: [
    {
      id: 'fb-1',
      name: 'Freebase English Breakfast 7MG',
      image: '/assets/Product.png',
      price: 75000,
      rating: 5.0,
      sold: 500,
      isNew: true,
    },
    {
      id: 'fb-2',
      name: 'Freebase Morning Citrus 9MG',
      image: '/assets/Product.png',
      price: 85000,
      rating: 4.9,
      sold: 420,
    },
  ],
  saltnic: [
    {
      id: 'sn-1',
      name: 'Saltnic Tropical Punch 25MG',
      image: '/assets/SpecialProduct.png',
      price: 95000,
      rating: 4.9,
      sold: 390,
    },
    {
      id: 'sn-2',
      name: 'Saltnic Cool Mint 35MG',
      image: '/assets/SpecialProduct.png',
      price: 99000,
      rating: 4.7,
      sold: 280,
    },
  ],
  official: [
    {
      id: 'om-1',
      name: 'Makna - Jersey Boxy Oversized Purple (M)',
      image: '/assets/OfficialMerch.png',
      price: 375000,
      rating: 5.0,
      sold: 150,
    },
    {
      id: 'om-2',
      name: 'Makna - Kaos Basic Hitam (L)',
      image: '/assets/OfficialMerch.png',
      price: 249000,
      rating: 4.8,
      sold: 260,
    },
  ],
};

export default function ShopSection({
  onProductClick,
  onSearch,
}: ShopSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<ShopFilter | null>(null);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const filterProducts = useCallback(
    (products: Product[]) => {
      if (!query) return products;
      const q = query.toLowerCase();
      return products.filter((p) => p.name.toLowerCase().includes(q));
    },
    [query],
  );

  const content = useMemo(() => {
    if (active) {
      return (
        <div className='space-y-6'>
          <ProductSection
            title={FILTERS.find((f) => f.id === active)?.label}
            products={filterProducts(sampleProducts[active])}
            onProductClick={(p) => {
              onProductClick?.(p);
              router.push(`/product/${p.id}`);
            }}
            showChevron={false}
          />
          {filterProducts(sampleProducts[active]).length === 0 && (
            <div className='px-4 text-sm text-gray-500'>Tidak ada produk.</div>
          )}
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <ProductSection
          title='Starter kit'
          products={filterProducts(sampleProducts.starter)}
          onProductClick={(p) => {
            onProductClick?.(p);
            router.push(`/product/${p.id}`);
          }}
          showChevron={false}
        />
        <ProductSection
          title='Freebase'
          products={filterProducts(sampleProducts.freebase)}
          onProductClick={(p) => {
            onProductClick?.(p);
            router.push(`/product/${p.id}`);
          }}
          showChevron={false}
        />
        <ProductSection
          title='Saltnic'
          products={filterProducts(sampleProducts.saltnic)}
          onProductClick={(p) => {
            onProductClick?.(p);
            router.push(`/product/${p.id}`);
          }}
          showChevron={false}
        />
        <ProductSection
          title='Official merchandise'
          products={filterProducts(sampleProducts.official)}
          onProductClick={(p) => {
            onProductClick?.(p);
            router.push(`/product/${p.id}`);
          }}
          showChevron={false}
        />
      </div>
    );
  }, [active, onProductClick, filterProducts, router]);

  return (
    <section className='pb-6'>
      <div className='relative'>
        <div className='px-4 py-3 bg-white border-b'>
          <div className='flex items-center gap-0 w-full'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-1' />
              <Input
                placeholder='Makna V4'
                className='pl-10 pr-0 bg-white/90 border-gray-200 rounded-l-lg rounded-r-none h-12 border-r-0'
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className='relative'>
              <Button
                className='bg-brand hover:bg-brand/90 rounded-l-none rounded-r-lg h-12 px-4 border-l-0 text-white flex items-center gap-2'
                onClick={() => onSearch?.(query)}
                aria-label='Search'
              >
                <span className='text-sm font-medium'>SEARCH</span>
              </Button>
            </div>
          </div>
        </div>

        <div className='px-4 py-3 bg-white border-b'>
          <div className='flex gap-4 flex-wrap' role='tablist'>
            {FILTERS.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  role='tab'
                  aria-selected={isActive}
                  onClick={() => setActive(isActive ? null : f.id)}
                  className='px-1 text-sm font-medium transition-colors'
                >
                  <span
                    className={
                      'inline-block pb-2 border-b-2 ' +
                      (isActive
                        ? 'border-brand text-brand'
                        : 'border-transparent text-gray-700 hover:text-gray-900')
                    }
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className='mt-4'>{content}</div>
    </section>
  );
}
