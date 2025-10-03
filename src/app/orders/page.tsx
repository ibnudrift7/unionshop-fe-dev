'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FooterNavigationSection } from '@/components/sections';

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
        { label: 'Pengemasan', active: true },
        { label: 'Diterima Kurir', active: false },
        { label: 'Dalam Pengiriman', active: false },
        { label: 'Diterima', active: false },
      ],
    },
  ];

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
                    <p className='text-xl font-extralight text-black'>
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
                        className={`px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-xs font-bold rounded-lg sm:rounded-xl whitespace-normal break-words text-center leading-tight ${
                          step.active
                            ? 'bg-brand/30 text-brand border-brand border-2 hover:bg-brand/50'
                            : 'bg-white text-black border-black'
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
              </div>
            </div>
          );
        })}
      </div>
      <FooterNavigationSection activeTab='history' />
    </div>
  );
}
