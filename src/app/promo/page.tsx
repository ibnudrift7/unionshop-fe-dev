'use client';

import * as React from 'react';
import { FooterNavigationSection, HeroSection } from '@/components/sections';
import { CheckinClaimSection } from '@/components/sections/promo/CheckinClaim';
import ClaimResultCard from '@/components/sections/promo/ClaimResultCard';
import { PromoCarouselSection } from '@/components/sections/promo/PromoCarousel';
import PromoSection from '@/components/sections/shop/PromoSection';

export default function PromoPage() {
  const [showResult, setShowResult] = React.useState(false);
  const [reward, setReward] = React.useState<number>(0);
  const [claimed, setClaimed] = React.useState(0);

  function handleClaim(rewardAmount: number) {
    setReward(rewardAmount);
    setClaimed((c) => Math.min(7, c + 1));
    setShowResult(true);
  }

  function handleCloseResult() {
    setShowResult(false);
  }

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <HeroSection
        images={[
          '/assets/Background.png',
          '/assets/Background.png',
          '/assets/Background.png',
        ]}
      />

      <div className='mt-2'>
        {!showResult ? (
          <CheckinClaimSection onClaim={handleClaim} claimed={claimed} />
        ) : (
          <ClaimResultCard reward={reward} onClose={handleCloseResult} />
        )}
      </div>

      <div className='mt-6 px-4'>
        <PromoCarouselSection />
      </div>

      <div className='mt-4'>
        <div className='px-4'>
          <h2 id='promo-title' className='text-balance text-lg font-semibold'>
            Title Promo
          </h2>
          <p className='text-sm text-black'>Informasi singkat promo.</p>
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
