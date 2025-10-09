'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RegisterSheet } from '@/components/sections/auth/RegisterSheet';
import { ForgotPasswordSheet } from '@/components/sections/auth/ForgotPasswordSheet';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MapPin, Phone, LogOut, Edit2 } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Menu className='w-5 h-5 text-brand' />,
    label: 'Riwayat Pesanan',
    href: '/orders',
  },
  {
    icon: <MapPin className='w-5 h-5 text-brand' />,
    label: 'Data Pengiriman',
    href: '/shipping',
  },
  {
    icon: <Phone className='w-5 h-5 text-brand' />,
    label: 'Pelayanan Whatsapp',
    href: '/whatsapp',
  },
  {
    icon: (
      <Image
        src='/assets/logo-makna-about.jpg'
        alt='Tentang Makna'
        width={10}
        height={10}
        className='w-6 h-3 object-cover'
      />
    ),
    label: 'Tentang Makna',
    href: '/about',
  },
];

export default function MobileMenu() {
  const registerTriggerRef = useRef<HTMLButtonElement>(null);
  const forgotTriggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  const voucherBase = {
    title1: 'Mau Voucher',
    title2: 'Diskon 10RB?',
    description: 'Gabung & Ambil Vouchernya Sekarang juga!',
    buttonText: 'CLAIM SEKARANG',
    image: '/assets/Voucher.png',
  };
  const vouchers = [
    voucherBase,
    {
      ...voucherBase,
      title2: 'Diskon 15RB?',
      image: '/assets/Voucher2.png',
    },
  ];

  return (
    <div className='w-full bg-white min-h-screen relative'>
      <div className='p-6 pb-3 border-b-2 border-gray-200'>
        <div className='-mx-6 -mt-6 -mb-6'>
          <div className='w-full h-16 sm:h-20 bg-gradient-to-r from-brand to-brand/80' />
        </div>
        <div className='flex items-center justify-between mb-4 relative z-10 -mt-12'>
          <div className='h-15 w-15 flex items-center justify-center'>
            <Image
              src='/assets/user-icon.png'
              alt='User'
              width={70}
              height={70}
              className='h-15 w-15 object-contain'
            />
          </div>
          <Button
            variant='ghost'
            className='text-brand p-0 h-auto font-bold mt-14'
            onClick={() => router.push('/user/edit')}
          >
            Ganti
            <Edit2 className='ml-2 w-4 h-4' />
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 bg-gradient-to-l from-[#f6eac7] to-white rounded-full'>
            <div className='flex items-center gap-1'>
              <Image
                src='/assets/icon-star-user.png'
                alt='Poin kamu'
                width={16}
                height={16}
                className='w-6 h-6'
              />
              <span className='text-[10px] md:text-sm font-semibold text-[#997B27]'>
                Poin kamu
              </span>
            </div>
            <div className='flex items-end gap-1 text-black bg-white rounded-full p-1 px-3 border-2 border-gray-200'>
              <span className='text-sm font-bold leading-none'>100</span>
              <span className='text-[10px] font-medium leading-none text-[#9a7b29]'>
                pts
              </span>
            </div>
          </div>
          <h2 className='text-lg font-bold text-black'>Bombom Ganteng</h2>
        </div>
      </div>

      <div className='px-4 pt-4'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start', loop: vouchers.length > 1 }}
        >
          <CarouselContent className='pr-4'>
            {vouchers.map((item, idx) => (
              <CarouselItem key={idx} className='basis-full'>
                <div className='rounded-xl sm:rounded-2xl overflow-hidden border-3 border-gray-300 bg-white'>
                  <div className='p-4 px-6 md:p-6 md:px-8'>
                    <div className='flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4'>
                      <div className='flex-1'>
                        <h3 className='text-lg md:text-2xl font-bold text-[#218d46] mb-0 sm:mb-0 leading-tight'>
                          {item.title1}
                        </h3>
                        <h3 className='text-lg md:text-2xl font-bold text-[#218d46] mb-1 sm:mb-2'>
                          {item.title2}
                        </h3>
                        <p className='text-[9px] md:text-sm font-semibold text-[#7c7c7c]'>
                          {item.description}
                        </p>
                      </div>
                      <div className='flex justify-end'>
                        <div className='relative'>
                          <Image
                            src={item.image}
                            alt='Voucher'
                            width={150}
                            height={150}
                            className='w-auto h-20 md:w-auto md:h-28 object-contain'
                          />
                        </div>
                      </div>
                    </div>

                    <Button className='w-full bg-brand hover:bg-brand/90 text-white font-base py-6 md:py-8 rounded-4xl text-sm md:text-base'>
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='p-4 space-y-2'>
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className='border-0 shadow-none hover:bg-gray-50 transition-colors cursor-pointer'
          >
            <div
              className='flex items-center gap-4 p-4'
              role='button'
              tabIndex={0}
              onClick={() => router.push(item.href)}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(item.href);
                }
              }}
            >
              <div className='flex-shrink-0'>{item.icon}</div>
              <span className='text-gray-700 font-medium flex-1'>
                {item.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <RegisterSheet
        trigger={<button ref={registerTriggerRef} className='hidden' />}
      />

      <ForgotPasswordSheet
        trigger={<button ref={forgotTriggerRef} className='hidden' />}
      />
      <div className='p-4 pt-2 space-y-7'>
        <Button
          variant='outline'
          className='w-full h-auto py-5 md:py-6 text-base gap-3'
        >
          <LogOut
            className='w-7 h-7 text-black'
            strokeWidth={2.5}
            aria-hidden='true'
          />
          <span className='text-brand font-normal'>Logout</span>
        </Button>
        <p className='text-sm text-black text-center mb-10'>
          Versi Website 0 01.00.00
        </p>
      </div>
    </div>
  );
}
