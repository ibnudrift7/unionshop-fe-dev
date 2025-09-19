'use client';

import { ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    {
      id: 'INV-20250807-042',
      date: '07 Agu 2025, 14:12',
      address: 'Jl. Merdeka No.12',
      total: 'Rp 249.000',
      items: [
        { name: 'Makna - Kaos Basic Hitam, Size L', quantity: 2 },
        { name: 'Voucher Cashback', quantity: 1 },
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
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
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
            <Card key={order.id} className='p-4 border-0 shadow-sm bg-white'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex items-start gap-3'>
                  <div className='w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0'>
                    <MapPin className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-700 font-medium'>
                      Order {order.id}
                    </p>
                    <p className='text-xs text-gray-500'>{order.address}</p>
                    <p className='text-xs text-gray-400 mt-1'>{order.date}</p>
                  </div>
                </div>
              </div>

              <div className='mt-2 space-y-2'>
                {order.items.map((it, idx) => (
                  <div key={idx} className='flex items-center justify-between'>
                    <p className='text-sm text-gray-800'>{it.name}</p>
                    <p className='text-sm text-gray-600'>x{it.quantity}</p>
                  </div>
                ))}
              </div>

              <div className='mt-4'>
                <p className='text-sm text-gray-600 mb-2'>
                  Total {itemCount} menu .{' '}
                  <span className='font-medium text-gray-900'>
                    {order.total}
                  </span>
                </p>

                <div className='flex gap-2 flex-wrap'>
                  {order.statusSteps.map((step, index) => (
                    <Button
                      key={index}
                      variant={step.active ? 'default' : 'outline'}
                      size='sm'
                      className={`px-3 py-1 text-xs rounded-lg ${
                        step.active
                          ? 'bg-brand/90 text-white border-brand border-2 hover:bg-brand/95'
                          : 'bg-white text-gray-600 border-brand hover:bg-gray-50'
                      }`}
                    >
                      {step.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <FooterNavigationSection activeTab='history' />
    </div>
  );
}
