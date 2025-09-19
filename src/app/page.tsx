'use client';

import {
  HeroSection,
  LocationSection,
  CategoryGridSection,
  VoucherBannersSection,
  SpecialTodaySection,
  OfficialMerchandiseSection,
  ProductSection,
  ChatAdminSection,
  FooterNavigationSection,
  PromoSection,
} from '@/components/sections';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[720px] border-x border-gray-200'>
      <div className='relative'>
        <HeroSection searchPlaceholder='Makna V4' />

        <div className='absolute bottom-0 left-0 right-0 transform translate-y-3/4 z-1'>
          <LocationSection />
        </div>
      </div>

      <div className='pt-45'>
        <CategoryGridSection isLoading={isLoading} />
      </div>

      <VoucherBannersSection
        voucher1={{
          title: 'Voucher buy 1 get 1 special',
          subtitle: 'UNIONLABS WEBSITE USER.',
        }}
        voucher2={{
          title1: 'Mau Voucher',
          title2: 'Diskon 10RB?',
          description: 'Gabung & Ambil Vouchernya Sekarang juga!',
        }}
      />

      <SpecialTodaySection isLoading={isLoading} />

      <OfficialMerchandiseSection />

      <ProductSection isLoading={isLoading} />

      <PromoSection />

      <ChatAdminSection />

      <FooterNavigationSection activeTab='home' />
    </div>
  );
}
