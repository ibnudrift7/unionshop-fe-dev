'use client';

import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import ProductSection from '@/components/sections/product/ProductSection';
import { useProductsQuery } from '@/hooks/use-products';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useAddCartItemsMutation } from '@/hooks/use-cart';

export default function AddOrderPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStatus();
  const { mutate: addMemberCart, isPending: isAddingMember } =
    useAddCartItemsMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: products, isLoading, isError, error } = useProductsQuery();
  const { addItem } = useCartStore();

  const toggleSelect = useCallback((p: Product) => {
    setSelectedIds((prev) =>
      prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id],
    );
  }, []);

  const selectedProducts = useMemo(() => {
    const list = products ?? [];
    return list.filter((p) => selectedIds.includes(p.id));
  }, [products, selectedIds]);

  const selectedCount = selectedProducts.length;
  const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const totalFormatted = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(totalAmount),
    [totalAmount],
  );

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
          onProductClick={toggleSelect}
          showChevron={false}
          selectionMode
          selectedIds={selectedIds}
        />
      </div>

      <div className='fixed left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 w-full max-w-[550px] px-4'>
        <div className='w-full bg-brand text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-lg'>
          <div className='flex flex-col leading-tight'>
            <span className='text-xs opacity-90'>{selectedCount} produk</span>
            <span className='text-lg font-semibold'>{totalFormatted}</span>
          </div>
          <Button
            size='icon'
            disabled={selectedCount === 0 || isAddingMember}
            className='h-8 w-8 rounded-full bg-white text-brand hover:bg-white/90 disabled:opacity-50'
            onClick={() => {
              if (isLoggedIn) {
                const inputs = selectedProducts
                  .map((p) => {
                    const idNum = Number(p.id);
                    if (!Number.isFinite(idNum)) return null;
                    return { product_id: idNum, qty: 1, attributes: [] };
                  })
                  .filter(
                    (
                      x,
                    ): x is {
                      product_id: number;
                      qty: number;
                      attributes: [];
                    } => Boolean(x),
                  );

                if (inputs.length === 0) {
                  selectedProducts.forEach((p) => addItem(p, 1));
                  router.push('/order-confirmation');
                  return;
                }

                addMemberCart(inputs, {
                  onSuccess: () => {
                    router.push('/order-confirmation');
                  },
                  onError: () => {
                    selectedProducts.forEach((p) => addItem(p, 1));
                    router.push('/order-confirmation');
                  },
                });
                return;
              }

              selectedProducts.forEach((p) => addItem(p, 1));
              router.push('/order-confirmation');
            }}
            aria-label='Tambahkan & lanjut'
          >
            <ArrowRight className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div className='h-32 sm:h-36' />
    </div>
  );
}
