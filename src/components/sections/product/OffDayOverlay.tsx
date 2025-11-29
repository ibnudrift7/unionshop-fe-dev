'use client';

import { ReactNode } from 'react';

interface OffDayOverlayProps {
  isActive: boolean;
  children: ReactNode;
}

export default function OffDayOverlay({
  isActive,
  children,
}: OffDayOverlayProps) {
  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div className='relative'>
      <div
        className='grayscale opacity-60 pointer-events-none select-none'
        aria-disabled='true'
      >
        {children}
      </div>

      <div className='absolute inset-0 z-999 cursor-not-allowed' />
    </div>
  );
}
