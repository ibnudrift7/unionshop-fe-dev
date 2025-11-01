'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';
import { useRouter } from 'next/navigation';

import { usePromotionsQuery } from '@/hooks/use-promotion';
import type { Voucher2Props, VoucherBannersSectionProps } from '@/types/promo';
import VoucherModalInline from './VoucherModalInline';

export default function VoucherBannersSection({
  voucher1,
  vouchers,
  className = '',
}: VoucherBannersSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );
  const router = useRouter();
  const vouchersSafe = React.useMemo(
    () => (vouchers.length > 0 ? vouchers : []),
    [vouchers],
  );
  const [voucherModalOpen, setVoucherModalOpen] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] =
    React.useState<Voucher2Props | null>(null);
  const { data: promosResp, isLoading: loadingPromotions } =
    usePromotionsQuery(true);
  const promotions = React.useMemo(() => promosResp?.data ?? [], [promosResp]);

  const promoItemsForBanner: Voucher2Props[] = React.useMemo(() => {
    if (!promotions || promotions.length === 0) return vouchersSafe;
    const DEFAULT_IMG = '/assets/Voucher.png';
    return promotions.map((p) => ({
      title1: p.name,
      description: p.description ?? '',
      buttonText: 'Klaim',
      image: p.image ? p.image : DEFAULT_IMG,
      code: p.code,
    }));
  }, [promotions, vouchersSafe]);

  return (
    <div className={`space-y-4 sm:space-y-6 md:space-y-8 ${className}`}>
      <div className='mx-2 sm:mx-4 mb-4 sm:mb-6'>
        <div className='bg-white rounded-2xl overflow-hidden shadow-lg border-2 sm:border-4 md:border-[5px] border-brand'>
          <div className='p-1 pt-0 md:p-2 md:pt-0 flex items-center gap-3'>
            <div className='flex-shrink-0 flex items-center justify-center'>
              <Image
                src={voucher1.image}
                alt='Voucher'
                width={96}
                height={96}
                className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain'
              />
            </div>

            <div className='flex-1 text-center'>
              <p className='font-extrabold text-sm md:text-lg text-black leading-tight tracking-tight'>
                {voucher1.title}
              </p>
              <p className='font-extrabold italic text-sm md:text-lg text-black'>
                {voucher1.subtitle}
              </p>
            </div>

            <div className='flex-shrink-0'>
              <Button
                className='bg-[#C70122] hover:bg-[#C70122]/90 text-white font-semibold w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-sm'
                aria-label='Klaim Voucher'
                onClick={() => router.push('/promo')}
              >
                {voucher1.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* voucher banner 2 */}
      <div className='mx-2 sm:mx-4 mb-4 sm:mb-6 md:mb-8'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start', loop: vouchersSafe.length > 1 }}
        >
          <CarouselContent className='pr-4 pb-4'>
            {promoItemsForBanner.map((item, idx) => (
              <CarouselItem
                key={idx}
                className='basis-[88%] sm:basis-[86%] md:basis-[80%]'
              >
                <div className='rounded-xl sm:rounded-2xl overflow-hidden [box-shadow:3px_6px_17px_-2px_rgba(0,0,0,0.19)] bg-white'>
                  <div className='p-3 md:p-6'>
                    <div className='grid grid-cols-2 items-center mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4'>
                      <div className='justify-self-start max-w-[32ch] sm:max-w-[36ch] md:max-w-[40ch]'>
                        <h3 className='text-sm sm:text-xl md:text-xl lg:text-2xl font-bold text-[#26d367] mb-1 sm:mb-2'>
                          {item.title1}
                        </h3>
                        <p className='text-xs sm:text-sm md:text-base text-gray-600 break-words leading-snug'>
                          {item.description}
                        </p>
                      </div>
                      <div className='flex justify-end justify-self-end shrink-0 min-w-[48px] sm:min-w-[80px] md:min-w-[112px] lg:min-w-[144px]'>
                        <div className='relative overflow-visible'>
                          <Image
                            src={item.image}
                            alt='Voucher'
                            width={150}
                            height={150}
                            className='w-auto h-24 object-contain max-w-none'
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      className='w-full bg-[#26d367] hover:bg-[#26d367]/90 text-white font-semibold py-6 sm:py-8 rounded-3xl text-sm sm:text-base md:text-lg'
                      onClick={() => {
                        setSelectedVoucher(item);
                        setVoucherModalOpen(true);
                        try {
                          if (item.onClaim) {
                            item.onClaim();
                          }
                        } catch {}
                      }}
                    >
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <VoucherModalInline
        open={voucherModalOpen}
        onOpenChange={(v: boolean) => setVoucherModalOpen(v)}
        title={selectedVoucher?.title1 ?? selectedVoucher?.title2}
        subtitle={selectedVoucher ? 'Promo' : undefined}
        description={selectedVoucher?.description}
        promotions={promotions}
        loadingPromotions={loadingPromotions}
        selectedCode={selectedVoucher?.code}
      />
    </div>
  );
}
