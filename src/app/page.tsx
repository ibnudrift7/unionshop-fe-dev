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
import { useRouter } from 'next/navigation';
import {
  heroImages,
  locationData,
  categories as mockCategories,
  voucher1Data,
  voucher2List,
  specialTodayProducts,
  officialMerchData,
  products as mockProducts,
  promoImages,
} from '@/components/sections/shop/data';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='relative'>
        <HeroSection searchPlaceholder='Makna V4' images={heroImages} />

        <div className='absolute bottom-0 left-0 right-0 transform translate-y-3/4 z-1'>
          <LocationSection
            points={locationData.points}
            name={locationData.name}
            address={locationData.address}
          />
        </div>
      </div>

      <div className='pt-36'>
        <CategoryGridSection
          categories={mockCategories}
          isLoading={isLoading}
        />
      </div>

      <VoucherBannersSection voucher1={voucher1Data} vouchers={voucher2List} />

      <SpecialTodaySection
        products={specialTodayProducts}
        isLoading={isLoading}
      />

      <OfficialMerchandiseSection
        title={officialMerchData.title}
        subtitle={officialMerchData.subtitle}
        buttonText={officialMerchData.buttonText}
        imageSrc={officialMerchData.imageSrc}
      />

      <ProductSection
        products={mockProducts}
        isLoading={isLoading}
        onProductClick={(p) => router.push(`/product/${p.id}`)}
      />

      <PromoSection images={promoImages} />

      <ChatAdminSection />

      <FooterNavigationSection activeTab='home' />
    </div>
  );
}
