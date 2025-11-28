'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

interface PromoSectionProps {
  images: string[];
}

export default function PromoSection({ images }: PromoSectionProps) {
  const image = images && images.length ? images[0] : null;

  if (!image) return null;

  return (
    <section className='p-4'>
      <Card className='overflow-hidden h-48 md:h-56 p-0'>
        <CardContent className='p-0'>
          <div className='relative w-full h-48 md:h-56'>
            <Image
              src={image}
              alt='Promo Banner'
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
