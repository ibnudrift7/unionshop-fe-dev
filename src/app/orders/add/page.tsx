'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductSection from '@/components/sections/product/ProductSection';
import { useProductsQuery } from '@/hooks/use-products';

export default function AddOrderPage() {
  const router = useRouter();
  const { data: products, isLoading, isError, error } = useProductsQuery();

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='flex items-center gap-2 p-4 pt-8 border-b border-gray-100 bg-white'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => router.back()}
        >
          <X className='h-5 w-5' />
        </Button>
        <h1 className='text-base font-semibold text-gray-900'>
          Tambah Pesanan
        </h1>
      </div>

      <div className='mt-2'>
        {isError && (
          <div className='px-4 text-sm text-red-600'>
            Gagal memuat produk{error?.message ? `: ${error.message}` : ''}
          </div>
        )}
        <ProductSection
          title='Pilih Produk'
          products={products ?? []}
          isLoading={isLoading}
          onProductClick={(p) => router.push(`/product/${p.slug}`)}
          showChevron={false}
        />
      </div>

      <div className='h-32 sm:h-36' />
    </div>
  );
}
