'use client';

import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FooterNavigationSection } from '@/components/sections';
import { useState } from 'react';

export default function RiwayatPesanan() {
  const router = useRouter();
  const orders = [
    {
      id: 'INV-20250808-001',
      date: '08 Agu 2025, 10:30',
      address: 'Jl. Banyurip Wetan gang 5',
      total: 'Rp 375.000',
      items: [
        { name: 'Makna - Jersey Boxy Overzised Purple, Size M', quantity: 1 },
        {
          name: 'Freebase English Breakfast - Morning Citrus 7 MG',
          quantity: 1,
        },
      ],
      statusSteps: [
        { label: 'Pengemasan', active: false },
        { label: 'Diterima Kurir', active: false },
        { label: 'Dalam Pengiriman', active: false },
        { label: 'Diterima', active: true },
      ],
    },
  ];

  // Manage open/close state per order for rating section
  const [openRatings, setOpenRatings] = useState<Record<string, boolean>>({});

  const toggleRating = (id: string) =>
    setOpenRatings((prev) => ({ ...prev, [id]: !prev[id] }));

  interface RatingState {
    rating: number;
    hover: number;
  }
  const [ratings, setRatings] = useState<Record<string, RatingState>>({});

  const ensureRatingState = (id: string) => {
    if (!ratings[id]) {
      setRatings((prev) => ({ ...prev, [id]: { rating: 0, hover: 0 } }));
    }
    return ratings[id] || { rating: 0, hover: 0 };
  };

  const setRating = (id: string, value: number) =>
    setRatings((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { hover: 0 }), rating: value },
    }));
  const setHover = (id: string, value: number) =>
    setRatings((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { rating: 0 }), hover: value },
    }));

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
        {orders.map((order) => {
          const itemCount = order.items.reduce(
            (sum, it) => sum + it.quantity,
            0,
          );
          return (
            <div
              key={order.id}
              className='p-4 border-b-4 border-gray-300 bg-white'
            >
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
                      {order.address}
                    </p>
                    <p className='text-xs text-gray-400 ml-2 whitespace-nowrap'>
                      {order.date}
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-2 space-y-1 mx-10'>
                {order.items.map((it, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-start gap-2'
                  >
                    <p className='text-md font-extralight text-black'>
                      {it.name} x{it.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className='mt-2'>
                <p className='text-sm text-[#727272] mb-2 ml-10'>
                  Total {itemCount} menu •{' '}
                  <span className='font-medium text-[#727272]'>
                    {order.total}
                  </span>
                </p>

                <div className='border-t border-gray-200 mb-4' />
                <div className='inline-flex rounded-3xl items-center bg-white px-2 py-2 border border-gray-100 [box-shadow:0_0_5px_rgba(0,0,0,0.15)] relative'>
                  {order.statusSteps.map((step, index) => (
                    <div key={index} className='flex items-center relative'>
                      {step.active && (
                        <Image
                          src='/assets/check-icon.png'
                          alt='Active Step'
                          width={20}
                          height={20}
                          className='absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 drop-shadow-md'
                        />
                      )}
                      <Button
                        variant={step.active ? 'default' : 'outline'}
                        size='sm'
                        className={`px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-xs font-bold rounded-lg sm:rounded-xl whitespace-normal break-words text-center leading-tight transition-colors ${
                          step.active
                            ? 'bg-brand/30 text-brand border-brand border-2 hover:bg-brand/40'
                            : 'bg-white text-black border-black hover:bg-gray-50'
                        }`}
                      >
                        {step.label}
                      </Button>
                      {index < order.statusSteps.length - 1 && (
                        <span className='mx-0 w-3 sm:w-4 border-t-2 border-dashed border-black'></span>
                      )}
                    </div>
                  ))}
                </div>
                <div className='border-t border-gray-200 mt-4' />

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
                        onClick={() => toggleRating(order.id)}
                        aria-label={
                          openRatings[order.id]
                            ? 'Tutup penilaian'
                            : 'Buka penilaian'
                        }
                        className='w-5 h-5 md:w-5 md:h-5 flex items-center justify-center'
                      >
                        <Image
                          src={
                            openRatings[order.id]
                              ? '/assets/icon-up.png'
                              : '/assets/icon-down.png'
                          }
                          alt={openRatings[order.id] ? 'Collapse' : 'Expand'}
                          width={40}
                          height={40}
                          className='w-full h-full object-contain'
                        />
                      </button>
                    </div>
                    {openRatings[order.id] && (
                      <div className='mt-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100'>
                        <div className='flex items-center justify-between mb-3'>
                          <h3 className='text-xs sm:text-sm font-medium text-gray-900'>
                            Nilai Produk
                          </h3>
                          <div className='flex gap-1'>
                            {[1, 2, 3, 4, 5].map((s) => {
                              const state = ensureRatingState(order.id);
                              const filled = s <= (state.hover || state.rating);
                              return (
                                <button
                                  key={s}
                                  onClick={() => setRating(order.id, s)}
                                  onMouseEnter={() => setHover(order.id, s)}
                                  onMouseLeave={() => setHover(order.id, 0)}
                                  className='transition-transform hover:scale-105'
                                >
                                  <Star
                                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
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
                        <Button
                          onClick={() =>
                            console.log(
                              'Rating submitted:',
                              ensureRatingState(order.id).rating,
                            )
                          }
                          disabled={!ensureRatingState(order.id).rating}
                          className='w-full bg-brand text-white hover:bg-brand/90 text-xs sm:text-sm font-semibold py-2 sm:py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          {ensureRatingState(order.id).rating
                            ? 'Kirim'
                            : 'Pilih rating'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FooterNavigationSection activeTab='history' />
    </div>
  );
}
