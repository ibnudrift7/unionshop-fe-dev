'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useBundlesQuery from '@/hooks/use-bundles';

type PromoItem = {
  id: string;
  title: string;
  price: number;
  priceBefore?: number;
  shippingNote?: string;
  rating: number;
  sold: string;
  imageAlt?: string;
  image?: string;
  slug?: string;
};

// No dummy fallback: render empty state when no bundles

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function PromoCarouselSection({ searchTerm }: { searchTerm?: string }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: bundles } = useBundlesQuery({ search: searchTerm });

  const items: PromoItem[] = React.useMemo(() => {
    if (!bundles || bundles.length === 0) return [];
    return bundles.map((p) => ({
      id: p.id,
      title: p.name,
      price: p.price,
      priceBefore: p.discountPrice,
      slug: (p as unknown as { slug?: string }).slug,
      rating: p.rating ?? 0,
      sold: String(p.sold ?? 0),
      imageAlt: p.name,
      image: p.image ?? '/assets/promo-item.png',
    }));
  }, [bundles]);

  return (
    <section aria-labelledby='promo-title'>
      <div className='mb-3 flex items-center justify-between'>
        <div>
          <h2 id='promo-title' className='text-balance text-lg font-semibold'>
            Title Promo
          </h2>
          <p className='text-sm text-black'>Informasi singkat promo.</p>
        </div>
        <Button
          variant='secondary'
          size='sm'
          className='rounded-full bg-[#e0cae1] hover:bg-[#e0cae1]/90 text-brand border-none font-bold'
          aria-label='Lihat semua promo'
          onClick={() => router.push('/promo/all')}
        >
          Lihat semua
        </Button>
      </div>

      <div className='relative'>
        {items.length === 0 ? (
          <div className='px-1 py-6 text-sm text-foreground/60'>
            Tidak ada promo bundle ditemukan.
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className='flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1'
            role='list'
            aria-label='Promo pilihan'
          >
            {items.map((item) => (
              <article
                key={item.id}
                role='listitem'
                className='snap-start'
                aria-roledescription='kartu promo'
              >
                <PromoCard item={item} />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PromoCard({ item }: { item: PromoItem }) {
  const router = useRouter();

  return (
    <Card
      className='w-[175px] md:w-[245px] shrink-0 overflow-hidden p-0 flex flex-col border-1 cursor-pointer'
      onClick={() => router.push(`/promo/all/${item.slug ?? item.id}`)}
    >
      <div className='relative aspect-[16/10] w-full overflow-hidden rounded-xl cursor-pointer'>
        <Badge
          className='absolute left-2 top-2 z-10 rounded-full px-2 py-0.5'
          variant='destructive'
        >
          40k off
        </Badge>

        <Image
          src={item.image ?? '/assets/promo-item.png'}
          alt={item.imageAlt ?? 'Gambar promo'}
          fill
          priority
          className='object-cover rounded-xl'
        />
      </div>
      <CardContent className='pb-4 flex-1 flex flex-col px-4'>
        <div className='mt-1'>
          <h3 className='line-clamp-2 text-sm font-bold'>{item.title}</h3>
          <div className='text-base'>{formatIDR(item.price)}</div>
          {item.priceBefore ? (
            <div className='text-xs text-foreground/60 line-through'>
              {formatIDR(item.priceBefore)}
            </div>
          ) : null}
        </div>

        {item.shippingNote ? (
          <div className='mt-1 text-xs text-foreground/70'>
            {item.shippingNote}
          </div>
        ) : null}

        <div className='mt-6 flex items-center gap-2 text-xs text-foreground/50'>
          <Star
            className='h-4 w-4 fill-current text-[#efba35]'
            aria-hidden='true'
          />
          <span className='tabular-nums'>{item.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{item.sold}+ Terjual</span>
        </div>
      </CardContent>
    </Card>
  );
}
