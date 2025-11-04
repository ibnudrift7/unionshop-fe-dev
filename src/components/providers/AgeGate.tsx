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
        <div className='fixed inset-0 z-[9998] flex items-stretch justify-center pointer-events-auto'>
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
            <div className='absolute top-3 right-3'>
              <div className='rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1'>
                {countdown}s
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
        <div className='fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto'>
          <div className='absolute inset-0 bg-black/70' />
          <AgeVerificationRejectModal open={true} />
        </div>
      )}
    </>
  );
}
