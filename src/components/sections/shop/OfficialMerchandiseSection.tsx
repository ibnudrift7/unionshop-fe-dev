'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import { offMerchData } from '@/components/sections/shop/data';

interface MerchItem {
  image: string;
  url: string;
}

interface OfficialMerchandiseSectionProps {
  items?: MerchItem[];
}

export default function OfficialMerchandiseSection({
  items = offMerchData,
}: OfficialMerchandiseSectionProps) {
  const item = items && items.length ? items[0] : null;

  if (!item) return null;

  return (
    <section className='p-4 pt-0'>
      <a
        href={item.url}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Official merchandise'
      >
        <Card className='bg-white py-0 overflow-hidden border-none'>
          <CardContent className='p-0'>
            <div className='w-full'>
              <Image
                src={item.image}
                alt='Official Merchandise'
                width={1200}
                height={600}
                className='w-full h-auto object-contain'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          </CardContent>
        </Card>
      </a>
    </section>
  );
}
