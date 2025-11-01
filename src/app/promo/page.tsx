'use client';

import * as React from 'react';
import { FooterNavigationSection, HeroSection } from '@/components/sections';
// import { CheckinClaimSection } from '@/components/sections/promo/CheckinClaim';
// import ClaimResultCard from '@/components/sections/promo/ClaimResultCard';
import { PromoCarouselSection } from '@/components/sections/promo/PromoCarousel';
import PromoSection from '@/components/sections/shop/PromoSection';
import { useSlidersQuery } from '@/hooks/use-sliders';

export default function PromoPage() {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const { data: promoSliderImages } = useSlidersQuery(2);
  // const [showResult, setShowResult] = React.useState(false);
  // const [reward, setReward] = React.useState<number>(0);
  // const [claimed, setClaimed] = React.useState(0);

  // function handleClaim(rewardAmount: number) {
  //   setReward(rewardAmount);
  //   setClaimed((c) => Math.min(7, c + 1));
  //   setShowResult(true);
  // }

  // function handleCloseResult() {
  //   setShowResult(false);
  // }

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <HeroSection
        images={
          (promoSliderImages && promoSliderImages.length > 0
            ? promoSliderImages
            : ['/assets/Background.png', '/assets/Background.png']) as string[]
        }
        onSearch={(value) => setSearchTerm(value)}
      />

      {/* <div className='mt-2'>
        {!showResult ? (
          <CheckinClaimSection onClaim={handleClaim} claimed={claimed} />
        ) : (
          <ClaimResultCard reward={reward} onClose={handleCloseResult} />
        )}
      </div> */}

      <div className='mt-6 px-4'>
        <PromoCarouselSection searchTerm={searchTerm} />
      </div>

      <div className='mt-4'>
        <div className='px-4'>
          <h2 id='promo-title' className='text-balance text-lg font-semibold'>
            Produk Promo
          </h2>
          <p className='text-sm text-black'>
            Nikmati berbagai produk promo menarik hanya untuk Anda
          </p>
        </div>
        <PromoSection
          images={[
            '/assets/Cashback.png',
            '/assets/Cashback.png',
            '/assets/Cashback.png',
          ]}
        />
      </div>

      <FooterNavigationSection activeTab='promo' />
    </div>
  );
}
