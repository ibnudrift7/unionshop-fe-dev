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

import { ShoppingBag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePromotionsQuery } from '@/hooks/use-promotion';
import type { PromotionItem } from '@/types/promotion';

interface InlineVoucherModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  subtitle?: string;
  description?: string;
  promotions?: PromotionItem[] | null;
  loadingPromotions?: boolean;
}

function generatePromoCode() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < 6; i++)
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `UNION-${s}`;
}

function VoucherModalInline({
  open,
  onOpenChange,
  title,
  subtitle,
  description,
  promotions,
  loadingPromotions,
}: InlineVoucherModalProps) {
  const [code, setCode] = React.useState<string>(() => generatePromoCode());
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // prefer backend promo code if available; fallback to generated code
      const backendCode =
        promotions && promotions.length > 0 ? promotions[0].code : null;
      setCode(backendCode || generatePromoCode());
      setCopied(false);
    }
  }, [open, promotions]);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const firstPromo = promotions && promotions.length > 0 ? promotions[0] : null;
  const displayTitle = title || firstPromo?.name || 'VOUCHER';
  const displaySubtitle = subtitle ?? 'Voucher';
  const displayDescription =
    description ?? (firstPromo?.description || undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md border-0 p-0 shadow-lg'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Promotional Voucher</DialogTitle>
        </DialogHeader>

        <div className='flex h-56 overflow-hidden rounded-lg'>
          <div className='flex w-1/3 flex-col items-center justify-center bg-red-500 p-6'>
            <div className='relative flex items-center justify-center'>
              <ShoppingBag
                className='h-16 w-16 text-yellow-400'
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className='flex w-2/3 flex-col items-center justify-center bg-pink-50 p-6'>
            <div className='text-center'>
              <h3 className='text-sm font-semibold text-gray-500'>
                {displaySubtitle}
              </h3>
              <h2 className='text-3xl font-extrabold text-red-600 tracking-wider my-2'>
                {displayTitle}
              </h2>
              {displayDescription && (
                <p className='text-xs text-gray-600 mb-3'>
                  {displayDescription}
                </p>
              )}

              <button
                onClick={handleCopy}
                aria-label='Copy voucher code'
                className='mx-auto flex items-center gap-3 rounded-2xl border border-dashed border-red-200 bg-white/90 px-4 py-3 text-sm font-mono font-semibold text-red-600 shadow-sm hover:bg-white'
              >
                <span className='select-all'>
                  {loadingPromotions ? 'Memuat…' : code}
                </span>
                <span className='ml-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white'>
                  {copied ? 'Disalin' : 'Salin'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface Voucher1Props {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onClaim?: () => void;
}

export interface Voucher2Props {
  title1: string;
  title2?: string;
  description: string;
  buttonText: string;
  image: string;
  onClaim?: () => void;
}

export interface VoucherBannersSectionProps {
  voucher1: Voucher1Props;
  vouchers: Voucher2Props[];
  className?: string;
}

export default function VoucherBannersSection({
  voucher1,
  vouchers,
  className = '',
}: VoucherBannersSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );
  const router = useRouter();
  const vouchersSafe = vouchers.length > 0 ? vouchers : [];
  const [voucherModalOpen, setVoucherModalOpen] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] =
    React.useState<Voucher2Props | null>(null);
  const { data: promosResp, isLoading: loadingPromotions } =
    usePromotionsQuery(true);
  const promotions = promosResp?.data ?? [];

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

      <div className='mx-2 sm:mx-4 mb-4 sm:mb-6 md:mb-8'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start', loop: vouchersSafe.length > 1 }}
        >
          <CarouselContent className='pr-4 pb-4'>
            {vouchersSafe.map((item, idx) => (
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
                        {item.title2 && (
                          <h3 className='text-sm sm:text-xl md:text-xl lg:text-2xl font-bold text-[#26d367] mb-1 sm:mb-2'>
                            {item.title2}
                          </h3>
                        )}
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
        onOpenChange={(v) => setVoucherModalOpen(v)}
        title={selectedVoucher?.title1 ?? selectedVoucher?.title2}
        subtitle={selectedVoucher ? 'Promo' : undefined}
        description={selectedVoucher?.description}
        promotions={promotions}
        loadingPromotions={loadingPromotions}
      />
    </div>
  );
}
