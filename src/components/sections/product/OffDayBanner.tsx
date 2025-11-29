'use client';

import RunningText from '@/components/animations/RunningText';

interface OffDayBannerProps {
  nextOperationalDate: string;
}

export default function OffDayBanner({
  nextOperationalDate,
}: OffDayBannerProps) {
  const message = `Mohon maaf, kami sedang libur sejenak. Pengiriman dan Layanan aktif kembali pada ${nextOperationalDate}`;

  return (
    <div className='bg-white text-red-500 py-3 px-4 shadow-md relative z-50'>
      <RunningText text={message} speed={60} className='text-sm font-medium' />
    </div>
  );
}
