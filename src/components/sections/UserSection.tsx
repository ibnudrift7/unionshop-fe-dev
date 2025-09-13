'use client';

import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// import { LoginSheet } from '@/components/sections/auth/LoginSheet';
import { RegisterSheet } from '@/components/sections/auth/RegisterSheet';
import { ForgotPasswordSheet } from '@/components/sections/auth/ForgotPasswordSheet';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  MapPin,
  Phone,
  Crown,
  // ChevronRight,
  Star,
  LogOut,
  Edit2,
} from 'lucide-react';
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
    icon: <Menu className='w-5 h-5 text-purple-600' />,
    label: 'Riwayat Pesanan',
    href: '/orders',
  },
  {
    icon: <MapPin className='w-5 h-5 text-purple-600' />,
    label: 'Data Pengiriman',
    href: '/shipping',
  },
  {
    icon: <Phone className='w-5 h-5 text-purple-600' />,
    label: 'Pelayanan Whatsapp',
    href: '/whatsapp',
  },
  {
    icon: <Crown className='w-5 h-5 text-purple-600' />,
    label: 'Tentang Makna',
    href: '/about',
  },
];

export function MobileMenu() {
  const registerTriggerRef = useRef<HTMLButtonElement>(null);
  const forgotTriggerRef = useRef<HTMLButtonElement>(null);
  // const toggleLogin = () => {};
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
      <div className='p-6 border-b border-gray-100'>
        <div className='-mx-6 -mt-6 -mb-6'>
          <div className='w-full h-16 sm:h-20 bg-gradient-to-r from-brand to-brand/70' />
        </div>
        <div className='flex items-center justify-between mb-4 relative z-10'>
          <div className='flex items-center gap-3'>
            <Avatar className='w-12 h-12'>
              <AvatarImage src='/placeholder.svg?height=48&width=48' />
              <AvatarFallback className='bg-gray-200 text-gray-600'>
                G
              </AvatarFallback>
            </Avatar>
          </div>
          <Button
            variant='ghost'
            className='bg-white text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto font-medium'
            onClick={() => router.push('/user/edit')}
          >
            Ganti
            <Edit2 className='ml-2 w-4 h-4' />
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 px-2 py-1 rounded-lg shadow-sm border border-black/5 bg-gradient-to-bl from-[#F6E8C3] to-white'>
              <Star className='w-4 h-4 text-[#997B27]' fill='currentColor' />
              <span className='text-xs font-semibold text-[#997B27]'>
                Poin kamu
              </span>
            </div>
            <div className='flex items-end gap-1 text-gray-900'>
              <span className='text-sm font-bold leading-none'>100</span>
              <span className='text-[10px] font-medium leading-none text-gray-700'>
                pts
              </span>
            </div>
          </div>
          <h2 className='text-lg font-medium text-gray-800'>
            Hey, there gorgeous
          </h2>
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
              <CarouselItem
                key={idx}
                className='basis-[88%] sm:basis-[86%] md:basis-[80%]'
              >
                <div className='rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-200 bg-white'>
                  <div className='p-3 sm:p-4 md:p-6'>
                    <div className='flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4'>
                      <div className='flex-1'>
                        <h3 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-green-500 mb-1 sm:mb-2'>
                          {item.title1}
                        </h3>
                        <h3 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-green-500 mb-1 sm:mb-2'>
                          {item.title2}
                        </h3>
                        <p className='text-xs sm:text-sm md:text-base text-gray-600'>
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
                            className='w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain'
                          />
                        </div>
                      </div>
                    </div>

                    <Button className='w-full bg-brand hover:bg-brand/90 text-white font-semibold py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg'>
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='p-4 space-y-2 pb-28'>
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

      <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[720px] px-4'>
        <Button variant='outline' className='w-full'>
          <LogOut className='w-4 h-4' />
          Logout
        </Button>
      </div>

      <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2'>
        <p className='text-xs text-gray-400 text-center'>Versi Website 1.0</p>
      </div>
    </div>
  );
}
