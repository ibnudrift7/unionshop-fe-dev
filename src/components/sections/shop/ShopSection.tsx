'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ProductSection from '../product/ProductSection';
import { Product } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { shopFilters as FILTERS, ShopFilter } from './data';
import { useProductsQuery } from '@/hooks/use-products';

interface ShopSectionProps {
  cartCount?: number;
  onProductClick?: (product: Product) => void;
  onSearch?: (value: string) => void;
  onCartClick?: () => void;
}

export default function ShopSection({
  onProductClick,
  onSearch,
}: ShopSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(''); // input text only
  const [active, setActive] = useState<ShopFilter | null>(null);
  const [committedQuery, setCommittedQuery] = useState(''); // applied when clicking search

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f && FILTERS.some((fi) => fi.id === f)) {
      setActive(f as ShopFilter);
    } else if (!f) {
      setActive(null);
    }
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
  };

  const handleSearchSubmit = () => {
    const val = query.trim();
    setCommittedQuery(val);
    onSearch?.(val);
  };

  const {
    data: apiProducts,
    isLoading,
    isError,
    error,
  } = useProductsQuery({
    search: committedQuery || undefined,
    // Note: category filter remains dummy for now; don't pass categoryId
  });

  const filterProducts = useCallback(
    (products: Product[]) => {
      if (!committedQuery) return products;
      const q = committedQuery.toLowerCase();
      return products.filter((p) => p.name.toLowerCase().includes(q));
    },
    [committedQuery],
  );

  const content = useMemo(() => {
    // Loading state
    if (isLoading) {
      return <div className='px-4 text-sm text-gray-500'>Memuat produk…</div>;
    }
    // Error state
    if (isError) {
      return (
        <div className='px-4 text-sm text-red-600'>
          Gagal memuat produk{error?.message ? `: ${error.message}` : ''}
        </div>
      );
    }

    const products = apiProducts ?? [];
    const filtered = filterProducts(products);

    if (active) {
      // Category filter is dummy: only affects title; list remains from API
      return (
        <div className='space-y-6'>
          <ProductSection
            title={FILTERS.find((f) => f.id === active)?.label}
            products={filtered}
            onProductClick={(p) => {
              onProductClick?.(p);
              router.push(`/product/${p.slug}`);
            }}
            showChevron={false}
          />
          {filtered.length === 0 && (
            <div className='px-4 text-sm text-gray-500'>Tidak ada produk.</div>
          )}
        </div>
      );
    }

    return (
      <>
        <ProductSection
          title='Semua Produk'
          products={filtered}
          onProductClick={(p) => {
            onProductClick?.(p);
            router.push(`/product/${p.slug}`);
          }}
          showChevron={false}
        />
        {filtered.length === 0 && (
          <div className='px-4 text-sm text-gray-500'>Tidak ada produk.</div>
        )}
      </>
    );
  }, [
    active,
    onProductClick,
    filterProducts,
    router,
    apiProducts,
    isLoading,
    isError,
    error,
  ]);

  return (
    <section className='pb-6'>
      <div className='relative'>
        <div className='px-4 py-3 bg-white border-b'>
          <div className='flex items-center gap-0 w-full'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-1' />
              <Input
                placeholder='Cari produk'
                className='pl-10 pr-0 bg-white/90 border-gray-200 rounded-l-lg rounded-r-none h-12 border-r-0'
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                }}
              />
            </div>
            <div className='relative'>
              <Button
                className='bg-brand hover:bg-brand/90 rounded-l-none rounded-r-lg h-12 px-4 border-l-0 text-white flex items-center gap-2'
                onClick={handleSearchSubmit}
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
                  onClick={() => {
                    const next = isActive ? null : f.id;
                    setActive(next);
                    const params = new URLSearchParams(searchParams.toString());
                    if (next) {
                      params.set('filter', next);
                    } else {
                      params.delete('filter');
                    }
                    router.push(
                      `/shop${
                        params.toString() ? `?${params.toString()}` : ''
                      }`,
                    );
                  }}
                  className='px-1 text-sm font-medium transition-colors cursor-pointer'
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
