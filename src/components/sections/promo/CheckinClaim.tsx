'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import HowToPlayDialogContent from './DialogCaraMain';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const REWARDS = [100, 150, 150, 150, 150, 150, 1000];

export function CheckinClaimSection({
  onClaim,
  claimed,
}: {
  onClaim?: (reward: number) => void;
  claimed: number;
}) {
  const [expanded, setExpanded] = React.useState(true);

  const canClaim = claimed < 7;

  function handleClaim() {
    if (!canClaim) return;
    const reward = REWARDS[claimed] ?? REWARDS[REWARDS.length - 1];
    onClaim?.(reward);
  }

  return (
    <section aria-labelledby='checkin-title' className='p-4'>
      <div className='relative z-10 overflow-hidden rounded-2xl bg-brand px-4 pt-4 pb-8 text-white shadow-sm'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Image
              src={
                claimed > 0
                  ? '/assets/promo-image-claim.png'
                  : '/assets/promo-image.png'
              }
              alt='Promo'
              width={60}
              height={60}
              className='h-10 w-10 object-contain'
            />
            <div className='min-w-0'>
              <h2
                id='checkin-title'
                className='text-pretty font-semibold text-lg md:text-xl'
              >
                Check-in Setiap Hari
              </h2>
              <p className='truncate opacity-90 text-xs/loose md:text-sm/loose'>
                Kamu udah klaim {claimed}/7 Hari
              </p>
            </div>
          </div>
          <Button
            size='sm'
            className={cn(
              'shrink-0 rounded-full px-5 text-lg font-semibold border border-transparent',
              canClaim
                ? 'bg-[#e1c35b] text-[#705e0f] hover:bg-[#e1c35b]/90'
                : 'bg-gray-300 text-[#705e0f] cursor-not-allowed',
            )}
            onClick={handleClaim}
            disabled={!canClaim}
            aria-disabled={!canClaim}
          >
            {canClaim ? 'Klaim' : 'Diambil'}
          </Button>
        </div>
        <div className='pointer-events-none absolute inset-0 z-40'>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-36  bg-gradient-to-tr from-white/50 blur-[2px] to-white/10 opacity-30 rotate-30' />
          <div className='absolute right-1/10 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-36  bg-gradient-to-tr from-white/50 blur-[2px] to-white/10 opacity-30 rotate-30' />
          <div className='absolute right-1/20 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-36  bg-gradient-to-tr from-white/50 blur-[2px] to-white/10 opacity-30 rotate-30' />
          <div className='absolute right-1/40 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-36  bg-gradient-to-tr from-white/50 blur-[2px] to-white/10 opacity-30 rotate-30' />
          <div className='absolute left-12/12 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-36  bg-gradient-to-tr from-white/50 blur-[2px] to-white/10 opacity-30 rotate-30' />
        </div>
      </div>

      {!expanded && (
        <div className='-mt-6 relative z-0 rounded-b-2xl flex justify-center pt-4 bg-[#e7e8e8] hover:bg-[#e7e8e8]/95'>
          <Button
            type='button'
            size='sm'
            className='w-full h-12 bg-[#e7e8e8] text-foreground/70 hover:bg-[#e7e8e8]/95 flex items-center justify-center gap-2'
            onClick={() => setExpanded(true)}
            aria-controls='checkin-content'
            aria-expanded='false'
          >
            Tampilkan
            <ChevronDown className='ml-2 h-4 w-4' aria-hidden='true' />
          </Button>
        </div>
      )}

      {/* Konten yang bisa disembunyikan */}
      <Card
        id='checkin-content'
        className={cn(
          '-mt-6 relative z-20 border border-gray-100 shadow-sm rounded-2xl bg-white',
          !expanded && 'sr-only',
        )}
      >
        <CardContent className='pt-5 pb-4'>
          <ol
            className='grid grid-cols-7 items-end gap-3'
            aria-label='Progres check-in 7 hari'
          >
            {REWARDS.map((reward, idx) => {
              const day = idx + 1;
              const done = claimed >= day;
              const isLast = day === 7;
              return (
                <li key={day} className='text-center'>
                  <div
                    className={cn(
                      'mx-auto flex h-10 w-10 items-center justify-center text-[11px] font-medium transition-colors overflow-hidden',
                    )}
                    aria-label={`Hari ${day} ${
                      done ? 'sudah klaim' : 'belum klaim'
                    }`}
                    role='status'
                  >
                    <Image
                      src={
                        isLast
                          ? '/assets/promo-last.png'
                          : done
                          ? '/assets/star-promo-claim.png'
                          : '/assets/star-promo.png'
                      }
                      alt={`Reward hari ${day}`}
                      width={40}
                      height={40}
                      className='h-8 w-8 object-contain'
                    />
                  </div>
                  <div className='mt-2 text-xs font-semibold'>
                    <div
                      className={cn(
                        done
                          ? 'font-semibold text-brand'
                          : 'text-foreground/70',
                      )}
                    >
                      {reward}
                    </div>
                    <div className='text-foreground/60 font-medium'>
                      Hari {day}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className='mt-5 flex items-center justify-between rounded-lg px-0 py-2 text-sm'>
            <span className='text-foreground/70 text-sm'>
              Berakhir dalam 7 hari
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 text-foreground/70 text-sm font-semibold hover:bg-gray-100'
                  aria-label='Cara main'
                >
                  Cara main
                  <ChevronRight className='h-5 w-5' aria-hidden='true' />
                </Button>
              </DialogTrigger>
              <HowToPlayDialogContent />
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Toggle sembunyikan/tampilkan */}
      {expanded && (
        <div className='-mt-4 rounded-b-2xl flex justify-center pt-4 bg-[#e7e8e8] hover:bg-[#e7e8e8]/95'>
          <Button
            type='button'
            size='sm'
            className='w-full h-12 bg-[#e7e8e8] text-foreground/70 hover:bg-[#e7e8e8]/95 flex items-center justify-center gap-2'
            onClick={() => setExpanded(false)}
            aria-controls='checkin-content'
            aria-expanded='true'
          >
            Sembunyikan
            <ChevronUp className='ml-2 h-4 w-4' aria-hidden='true' />
          </Button>
        </div>
      )}
    </section>
  );
}
