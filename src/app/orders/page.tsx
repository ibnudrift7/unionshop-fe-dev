'use client';

import { ArrowLeft, Star, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FooterNavigationSection } from '@/components/sections';
import { useMemo, useState } from 'react';
import { OrderTrackingModal } from '@/components/sections/user/TrackingOrderDialog';
import {
  useCreateOrderReviewMutation,
  useOrderHistoryQuery,
  useOrderReviewsQuery,
  useOrdersQuery,
} from '@/hooks/use-orders';
import type { OrderListItem, OrderHistoryItem } from '@/types/order';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { HttpError } from '@/services/http';

function formatDateTimeID(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const date = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${date}, ${hh}:${mm}`;
}

function formatRupiah(value?: string | number | null): string {
  if (value === null || value === undefined) return '';
  const num =
    typeof value === 'string'
      ? parseFloat(value.replace(/,/g, ''))
      : Number(value);
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

function resolveOrderImage(image?: string | null): string {
  if (!image) return '/assets/Product.png';
  const s = String(image).trim();
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'))
    return s;
  return '/assets/Product.png';
}

function deliveredByName(statusName?: string | null): boolean {
  if (!statusName) return false;
  const name = statusName.toLowerCase().trim();
  return name === 'complete' || name === 'completed';
}

function isOrderDeliveredFrom(orderStatusName?: string): boolean {
  return deliveredByName(orderStatusName);
}

export default function RiwayatPesanan() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useOrdersQuery(true);
  const orders = useMemo(() => data?.data.data ?? [], [data]);

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x'>
      <div className='flex items-center justify-between p-4 border-b border-gray-100'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => router.push('/user')}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-lg font-semibold text-gray-900'>Riwayat Pesanan</h1>
        <div className='w-8' />
      </div>

      <div className='space-y-4 p-4'>
        {isLoading && (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='p-4 border-b-4 border-gray-300 bg-white'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-7 w-7 rounded-full' />
                  <div className='flex-1'>
                    <Skeleton className='h-4 w-3/4' />
                    <div className='mt-2 flex gap-2'>
                      <Skeleton className='h-3 w-1/3' />
                      <Skeleton className='h-3 w-1/5' />
                    </div>
                  </div>
                </div>
                <div className='mt-3'>
                  <Skeleton className='h-8 w-40 rounded-xl' />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className='p-4 text-sm text-red-600 bg-red-50 rounded-md'>
            {error?.message || 'Gagal memuat riwayat pesanan.'}
          </div>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className='p-6 text-center text-sm text-gray-500'>
            Belum ada riwayat pesanan.
          </div>
        )}

        {!isLoading &&
          !isError &&
          orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
      <FooterNavigationSection activeTab='history' />
    </div>
  );
}

function OrderCard({ order }: { order: OrderListItem }) {
  const [openRatings, setOpenRatings] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);

  const { data: historyData, isLoading: historyLoading } = useOrderHistoryQuery(
    order.id,
    true,
  );

  const { data: reviewsData, isLoading: reviewsLoading } = useOrderReviewsQuery(
    order.id,
    openRatings,
  );
  const createReview = useCreateOrderReviewMutation(order.id);

  type RatingState = { rating: number; hover: number; reviewText: string };
  const [ratings, setRatings] = useState<Record<number, RatingState>>({}); 

  const ensureRatingState = (productId: number): RatingState => {
    const state = ratings[productId] ?? { rating: 0, hover: 0, reviewText: '' };
    if (!ratings[productId]) {
      setRatings((prev) => ({ ...prev, [productId]: state }));
    }
    return state;
  };
  const setRating = (productId: number, value: number) =>
    setRatings((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] ?? { hover: 0 }), rating: value },
    }));
  const setHover = (productId: number, value: number) =>
    setRatings((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] ?? { rating: 0 }), hover: value },
    }));
  const setReviewText = (productId: number, value: string) =>
    setRatings((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] ?? { rating: 0, hover: 0 }),
        reviewText: value,
      },
    }));

  const stages = historyData?.data.shipping_progress ?? [];

  return (
    <div className='p-4 border-b-4 border-gray-300 bg-white'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3 w-full'>
          <div className='w-7 h-7 flex items-center justify-center flex-shrink-0'>
            <Image
              src='/assets/icon-orders.png'
              alt='Order Icon'
              width={36}
              height={36}
              className='w-7 h-7 object-contain'
            />
          </div>
          <div className='flex-1 flex items-center justify-between min-w-0'>
            <p className='text-xs text-black truncate min-w-0'>
              {order.first_product?.product_name ||
                `Pesanan ${order.invoice_no}`}
            </p>
            <p className='text-xs text-gray-400 ml-2 whitespace-nowrap flex items-center gap-1'>
              <CalendarDays className='w-4 h-4 text-gray-400' />
              {formatDateTimeID(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-2 space-y-1 mx-10'>
        <div className='flex items-center justify-start gap-2'>
          <p className='text-md font-extralight text-black'>
            {(order.first_product?.product_name ?? 'Produk') +
              ` x${order.total_items}`}
          </p>
        </div>
      </div>

      <div className='mt-2'>
        <p className='text-sm text-[#727272] mb-2 ml-10'>
          Total {order.total_items} menu •{' '}
          <span className='font-bold text-[#727272]'>
            {formatRupiah(order.final_amount)}
          </span>
        </p>

        <div className='border-t border-gray-200 mb-4' />
        <div className='inline-flex rounded-3xl items-center bg-white px-2 py-2 border border-gray-100 [box-shadow:0_0_5px_rgba(0,0,0,0.15)] relative'>
          {historyLoading && (
            <span className='text-xs text-gray-400 px-2'>
              Memuat riwayat...
            </span>
          )}
          {!historyLoading && stages.length === 0 && (
            <span className='text-xs text-gray-400 px-2'>
              Riwayat pengiriman belum tersedia
            </span>
          )}
          {!historyLoading &&
            stages.map((stage: OrderHistoryItem, index: number) => {
              const active = Boolean(stage.active);
              return (
                <div key={stage.stage} className='flex items-center relative'>
                  {active && (
                    <Image
                      src='/assets/check-icon.png'
                      alt='Active Step'
                      width={20}
                      height={20}
                      className='absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 drop-shadow-md'
                    />
                  )}
                  <Button
                    variant={active ? 'default' : 'outline'}
                    size='sm'
                    className={`px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-xs font-bold rounded-lg sm:rounded-xl whitespace-normal break-words text-center leading-tight transition-colors ${
                      active
                        ? 'bg-brand/30 text-brand border-brand border-2 hover:bg-brand/40'
                        : 'bg-white text-black border-black hover:bg-gray-50'
                    }`}
                  >
                    {stage.stage}
                  </Button>
                  {index < stages.length - 1 && (
                    <span className='mx-0 w-3 sm:w-4 border-t-2 border-dashed border-black'></span>
                  )}
                </div>
              );
            })}
        </div>

        <div className='mt-3'>
          <Button
            onClick={() => setOpenTracking(true)}
            className='bg-brand hover:bg-brand/80 text-white font-semibold rounded-xl px-4 py-2'
          >
            Lacak Pesanan
          </Button>
        </div>
        <OrderTrackingModal
          orderId={order.id}
          isOpen={openTracking}
          onOpenChange={(open: boolean) => setOpenTracking(open)}
        />
        <div className='border-t border-gray-200 mt-4' />

        {/* rating section - only show when order delivered */}
        {isOrderDeliveredFrom(order.status_name) && (
          <div className='mt-4'>
            <div className='bg-[#F5F5F5] rounded-2xl p-3 sm:p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <h2 className='text-sm md:text-base font-semibold text-black'>
                    Nilai
                  </h2>
                  <span className='text-sm md:text-base font-semibold text-black'>
                    +50 pts
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => setOpenRatings((v) => !v)}
                  aria-label={
                    openRatings ? 'Tutup penilaian' : 'Buka penilaian'
                  }
                  className='w-5 h-5 md:w-5 md:h-5 flex items-center justify-center'
                >
                  <Image
                    src={
                      openRatings
                        ? '/assets/icon-up.png'
                        : '/assets/icon-down.png'
                    }
                    alt={openRatings ? 'Collapse' : 'Expand'}
                    width={40}
                    height={40}
                    className='w-full h-full object-contain'
                  />
                </button>
              </div>
              {openRatings && (
                <div className='mt-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100'>
                  {reviewsLoading && (
                    <div className='text-xs text-gray-500'>
                      Memuat ulasan...
                    </div>
                  )}
                  {!reviewsLoading && reviewsData && (
                    <div className='space-y-4'>
                      {reviewsData.data.pending_review_products.length === 0 ? (
                        <div className='text-sm text-gray-600'>
                          Semua produk pada pesanan ini sudah dinilai. Terima
                          kasih!
                        </div>
                      ) : (
                        reviewsData.data.pending_review_products.map((p) => {
                          const state = ensureRatingState(p.product_id);
                          return (
                            <div
                              key={p.product_id}
                              className='border border-gray-100 rounded-lg p-3'
                            >
                              <div className='flex items-center gap-2'>
                                <Image
                                  src={resolveOrderImage(p.product_image)}
                                  alt={p.product_name}
                                  width={40}
                                  height={40}
                                  className='w-10 h-10 rounded object-cover'
                                />
                                <div className='flex-1'>
                                  <p className='text-xs font-medium text-gray-900 truncate'>
                                    {p.product_name}
                                  </p>
                                  <div className='flex gap-1 mt-1'>
                                    {[1, 2, 3, 4, 5].map((s) => {
                                      const filled =
                                        s <= (state.hover || state.rating);
                                      return (
                                        <button
                                          key={s}
                                          onClick={() =>
                                            setRating(p.product_id, s)
                                          }
                                          onMouseEnter={() =>
                                            setHover(p.product_id, s)
                                          }
                                          onMouseLeave={() =>
                                            setHover(p.product_id, 0)
                                          }
                                          className='transition-transform hover:scale-105'
                                        >
                                          <Star
                                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                              filled
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-none text-yellow-400'
                                            } stroke-[1.75]`}
                                          />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <textarea
                                value={state.reviewText}
                                onChange={(e) =>
                                  setReviewText(p.product_id, e.target.value)
                                }
                                placeholder='Tulis ulasan Anda...'
                                className='w-full mt-2 p-2 border border-gray-200 rounded-md text-sm resize-none h-20'
                              />
                              <Button
                                onClick={() =>
                                  createReview.mutate(
                                    {
                                      product_id: p.product_id,
                                      rating: state.rating,
                                      review: state.reviewText,
                                    },
                                    {
                                      onSuccess: () => {
                                        toast.success(
                                          'Ulasan berhasil dikirim',
                                        );
                                      },
                                      onError: (err: HttpError) => {
                                        const msg =
                                          err?.message ??
                                          'Gagal mengirim ulasan';
                                        toast.error(msg);
                                      },
                                    },
                                  )
                                }
                                disabled={
                                  createReview.isPending || state.rating === 0
                                }
                                className='w-full bg-brand text-white hover:bg-brand/90 text-xs sm:text-sm font-semibold py-2 sm:py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed mt-2'
                              >
                                {createReview.isPending
                                  ? 'Mengirim...'
                                  : state.rating
                                  ? 'Kirim'
                                  : 'Pilih rating'}
                              </Button>
                            </div>
                          );
                        })
                      )}

                      {reviewsData.data.reviewed_products.length > 0 && (
                        <div>
                          <p className='text-xs font-medium text-gray-900 mb-2'>
                            Ulasan Anda
                          </p>
                          <div className='space-y-2'>
                            {reviewsData.data.reviewed_products.map((r) => (
                              <div
                                key={r.id}
                                className='text-xs text-gray-700 border border-gray-100 rounded-md p-2'
                              >
                                <div className='flex items-center justify-between'>
                                  <span className='font-medium'>
                                    {r.product_name}
                                  </span>
                                  <div className='flex gap-0.5'>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-3.5 h-3.5 ${
                                          s <= r.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-none text-yellow-400'
                                        } stroke-[1.75]`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {r.review && <p className='mt-1'>{r.review}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
