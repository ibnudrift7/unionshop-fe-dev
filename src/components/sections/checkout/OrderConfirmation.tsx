'use client';

import { ArrowLeft, Minus, Plus, Coins, CircleArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useDefaultAddressQuery } from '@/hooks/use-address';
import {
  useCartQuery,
  useUpdateCartItemQtyMutation,
  useDeleteCartItemMutation,
} from '@/hooks/use-cart';
import { getGuestAddress } from '@/hooks/use-guest-address';

export default function OrderConfirmation() {
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuthStatus();

  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { data: memberCart } = useCartQuery(isReady && isLoggedIn);
  const { mutate: updateMemberQty } = useUpdateCartItemQtyMutation();
  const { mutate: deleteMemberItem } = useDeleteCartItemMutation();

  const total = useMemo(() => {
    if (isLoggedIn && memberCart?.data?.summary?.subtotal) {
      const n = Number(memberCart.data.summary.subtotal);
      return Number.isFinite(n) ? n : 0;
    }
    return getTotal();
  }, [isLoggedIn, memberCart, getTotal]);

  const handleDecrease = (
    productId: string,
    current: number,
    memberItemId?: number,
  ) => {
    if (isLoggedIn && memberItemId) {
      updateMemberQty({ itemId: memberItemId, qty: Math.max(1, current - 1) });
    } else {
      updateQuantity(productId, Math.max(1, current - 1));
    }
  };
  const handleIncrease = (
    productId: string,
    current: number,
    memberItemId?: number,
  ) => {
    if (isLoggedIn && memberItemId) {
      updateMemberQty({ itemId: memberItemId, qty: current + 1 });
    } else {
      updateQuantity(productId, current + 1);
    }
  };
  const handleRemove = (productId: string, memberItemId?: number) => {
    if (isLoggedIn && memberItemId) {
      deleteMemberItem({ itemId: memberItemId });
    } else {
      removeItem(productId);
    }
  };

  const { data: defaultAddress } = useDefaultAddressQuery(
    isReady && isLoggedIn,
  );
  const guestAddress = useMemo(() => getGuestAddress(), []);

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <div className='bg-[#d6b8d7] mb-4 flex items-center justify-between p-4 pt-10 border-b border-gray-100'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-lg font-semibold text-gray-900'>
          Konfirmasi Pesanan
        </h1>
        <div className='w-8' />
      </div>

      <div className='bg-white'>
        {/* alamat pengiriman member mode */}
        {isLoggedIn && (
          <div className='px-4'>
            <Card className='py-2 px-4 border-3 border-brand rounded-xl'>
              <div className='flex items-center justify-between gap-2'>
                <div>
                  <p className='text-sm text-gray-900 font-bold'>
                    Alamat Utama
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    {defaultAddress?.data
                      ? `${defaultAddress.data.recipient_name} - ${defaultAddress.data.phone} | ${defaultAddress.data.address_line}, ${defaultAddress.data.postal_code}`
                      : 'Memuat alamat…'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => router.push('/shipping')}
                  className='text-sm font-bold text-brand hover:underline'
                >
                  Ubah
                </button>
              </div>
            </Card>
          </div>
        )}
        <div className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-base font-semibold text-gray-900'>Pesanan</h2>
            <Button
              variant='outline'
              className='rounded-2xl bg-brand/10 font-semibold text-brand border-brand border-2 hover:bg-brand/20  flex items-center gap-1'
              onClick={() => router.push('/orders/add')}
            >
              Tambah Pesanan
              <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-4'>
            {(!isLoggedIn
              ? items.length === 0
              : (memberCart?.data?.items?.length ?? 0) === 0) && (
              <div className='text-sm text-gray-500 px-2'>
                Keranjang kosong.
              </div>
            )}
            {!isLoggedIn
              ? items.map(({ product, quantity }) => (
                  <Card key={product.id} className='p-4 border-1'>
                    <div className='flex flex-col gap-3'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-bold text-base mb-1 line-clamp-2'>
                            {product.name}
                          </h3>
                          <p className='text-base font-semibold'>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            }).format(product.price)}
                          </p>
                        </div>
                        <div className='relative w-25 h-25 rounded-lg overflow-hidden flex-shrink-0'>
                          <Image
                            src={product.image || '/assets/Product.png'}
                            alt={product.name}
                            fill
                            sizes='100px'
                            className='object-cover'
                          />
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-7 w-7 rounded-full bg-transparent border-brand text-brand hover:bg-brand/10'
                            onClick={() => handleDecrease(product.id, quantity)}
                          >
                            <Minus className='h-5 w-5 text-brand' />
                          </Button>
                          <span className='w-7 text-center'>{quantity}</span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-7 w-7 rounded-full bg-transparent border-brand text-brand hover:bg-brand/10'
                            onClick={() => handleIncrease(product.id, quantity)}
                          >
                            <Plus className='h-5 w-5 text-brand' />
                          </Button>
                        </div>
                        <Button
                          variant='ghost'
                          className='text-xs text-red-500 hover:text-red-600'
                          onClick={() => handleRemove(product.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              : (memberCart?.data?.items ?? []).map((it) => (
                  <Card key={it.id} className='p-4 border-1'>
                    <div className='flex flex-col gap-3'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-bold text-base mb-1 line-clamp-2'>
                            {it.product_name}
                          </h3>
                          <p className='text-base font-semibold'>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            }).format(it.sale_price ?? it.prices ?? 0)}
                          </p>
                        </div>
                        <div className='relative w-25 h-25 rounded-lg overflow-hidden flex-shrink-0'>
                          <Image
                            src={(() => {
                              const raw = it.cover_image;
                              if (!raw) return '/assets/Product.png';
                              if (/^https?:\/\//i.test(raw)) return raw;
                              const base =
                                process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
                              return base
                                ? `${base.replace(/\/$/, '')}/${raw.replace(
                                    /^\//,
                                    '',
                                  )}`
                                : '/assets/Product.png';
                            })()}
                            alt={it.product_name}
                            fill
                            sizes='100px'
                            className='object-cover'
                          />
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-7 w-7 rounded-full bg-transparent border-brand text-brand hover:bg-brand/10'
                            onClick={() =>
                              handleDecrease(
                                String(it.product_id),
                                it.qty,
                                it.id,
                              )
                            }
                          >
                            <Minus className='h-5 w-5 text-brand' />
                          </Button>
                          <span className='w-7 text-center'>{it.qty}</span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-7 w-7 rounded-full bg-transparent border-brand text-brand hover:bg-brand/10'
                            onClick={() =>
                              handleIncrease(
                                String(it.product_id),
                                it.qty,
                                it.id,
                              )
                            }
                          >
                            <Plus className='h-5 w-5 text-brand' />
                          </Button>
                        </div>
                        <Button
                          variant='ghost'
                          className='text-xs text-red-500 hover:text-red-600'
                          onClick={() =>
                            handleRemove(String(it.product_id), it.id)
                          }
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>

          <div className='mt-6'>
            {/* alamat pengiriman guest mode */}
            {!isLoggedIn && (
              <button
                type='button'
                onClick={() => router.push('/order-confirmation/address')}
                className='w-full text-left mb-3'
              >
                <div className='py-5 border-t border-b hover:bg-gray-50 transition'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div>
                        <p className='text-lg font-bold text-black'>
                          {guestAddress?.name
                            ? `${guestAddress.name} - ${guestAddress.phone}`
                            : 'Isi Data Pengiriman'}
                        </p>
                        {guestAddress && (
                          <p className='text-xs text-gray-600 mt-1'>
                            {`${guestAddress.addressDetail}, ${guestAddress.district}, ${guestAddress.city}, ${guestAddress.province}, ${guestAddress.postalCode}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <CircleArrowRight className='h-7 w-7 text-black' />
                  </div>
                </div>
              </button>
            )}

            <div className='border border-brand rounded-lg p-3 flex items-start gap-2'>
              <Coins className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-gray-900'>
                Kamu akan mendapatkan{' '}
                <span className='font-semibold'>50 point</span> dari total
                belanja ini
              </p>
            </div>

            <div className='flex flex-col items-start mt-4 border-b-2'>
              <h3 className='font-bold text-base'>Biaya Pengiriman</h3>
              <p className='text-base font-base mb-4'>Rp. 15.000</p>
            </div>

            <h3 className='font-bold text-base mt-4 mb-2'>
              Estimasi Pengiriman 2 - 4 hari
            </h3>
          </div>
        </div>

        <div className='fixed left-1/2 -translate-x-1/2 bottom-[72px] sm:bottom-[76px] w-full max-w-[550px] bg-white border-t p-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-col items-start'>
              <span className='text-gray-400'>Total</span>
              <span className='text-lg font-semibold text-gray-900'>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(total)}
              </span>
            </div>
            <Button
              className='bg-brand hover:bg-brand/80 text-white py-5 px-4 shrink-0'
              onClick={() => router.push('/checkout')}
            >
              Pilih Pembayaran
            </Button>
          </div>
        </div>

        <div className='h-40 sm:h-44' />
      </div>
    </div>
  );
}
