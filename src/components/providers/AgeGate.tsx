'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  AgeVerificationModal,
  AgeVerificationRejectModal,
} from '@/components/sections/shop/AgeVerificationModal';

export default function AgeGate() {
  const [open, setOpen] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);
  const INITIAL_COUNT = 3;

  React.useEffect(() => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;
    try {
      const verified = localStorage.getItem('age_verified');
      const rejectedFlag = localStorage.getItem('age_rejected');
      if (verified === 'true') return;
      if (rejectedFlag === 'true') {
        setRejected(true);
        document.body.style.overflow = 'hidden';
        return;
      }

      setShowSplash(true);
      setCountdown(3);
      document.body.style.overflow = 'hidden';
      intervalId = window.setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      timeoutId = window.setTimeout(() => {
        setShowSplash(false);
        setOpen(true);
        if (intervalId) window.clearInterval(intervalId);
      }, 3000);
    } catch {}

    return () => {
      try {
        if (intervalId) window.clearInterval(intervalId);
        if (timeoutId) window.clearTimeout(timeoutId);
        document.body.style.overflow = '';
      } catch {}
    };
  }, []);

  const handleConfirm = () => {
    try {
      localStorage.setItem('age_verified', 'true');
    } catch {}
    setOpen(false);
    try {
      document.body.style.overflow = '';
    } catch {}
  };

  const handleCancel = () => {
    try {
      localStorage.setItem('age_rejected', 'true');
    } catch {}
    setOpen(false);
    setRejected(true);
    try {
      document.body.style.overflow = 'hidden';
    } catch {}
  };

  return (
    <>
      {showSplash && (
        <div className='fixed inset-0 flex items-stretch justify-center pointer-events-auto z-[999]'>
          <div
            className='relative w-full max-w-[550px] h-screen bg-black'
            style={{
              backgroundImage: "url('/assets/homepage.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Image
              src={'/assets/homepage.jpg'}
              alt='Welcome'
              fill
              priority
              unoptimized
              draggable={false}
              sizes='(max-width: 550px) 100vw, 550px'
              className='object-cover'
            />
            <div className='absolute right-3 top-10 md:top-16'>
              <div className='relative w-8 h-8 md:w-9 md:h-9'>
                {(() => {
                  const R = 14;
                  const C = 2 * Math.PI * R;
                  const progress = Math.max(
                    0,
                    Math.min(1, countdown / INITIAL_COUNT),
                  );
                  const offset = C * (1 - progress);
                  return (
                    <svg
                      className='absolute inset-0 w-full h-full'
                      viewBox='0 0 36 36'
                    >
                      <circle
                        cx='18'
                        cy='18'
                        r={R}
                        fill='none'
                        stroke='rgba(16,185,129,0.12)'
                        strokeWidth='3'
                      />
                      <circle
                        cx='18'
                        cy='18'
                        r={R}
                        fill='none'
                        stroke='#10B981'
                        strokeOpacity='1'
                        strokeWidth='3'
                        strokeDasharray={C}
                        strokeDashoffset={offset}
                        strokeLinecap='round'
                        transform='rotate(-90 18 18)'
                      />
                    </svg>
                  );
                })()}

                <div className='absolute inset-0 flex items-center justify-center text-black text-sm font-semibold'>
                  {countdown}s
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AgeVerificationModal
        open={open}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {rejected && (
        <div className='fixed inset-0 flex items-center justify-center pointer-events-auto'>
          <div className='absolute inset-0' />
          <AgeVerificationRejectModal open={true} />
        </div>
      )}
    </>
  );
}
