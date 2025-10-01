'use client';

import { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType } from 'embla-carousel';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomActionBar from './BottomActionBar';

export default function PromoDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noCart = searchParams.get('noCart') === '1';
  const [selectedColor, setSelectedColor] = useState('PURPLE');
  const [selectedFlavor, setSelectedFlavor] = useState('COOL MANGGO');
  const [quantity, setQuantity] = useState(1);
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | null>(
    null,
  );

  const variations = [
    { name: 'CARBON BLACK', value: '#374151', code: 'CARBON BLACK' },
    { name: 'CARBON WHITE', value: '#F3F4F6', code: 'CARBON WHITE' },
    { name: 'LEATHER BLACK', value: '#1F2937', code: 'LEATHER BLACK' },
    { name: 'LEATHER BROWN', value: '#A16207', code: 'LEATHER BROWN' },
    { name: 'METALIC SILVER', value: '#9CA3AF', code: 'METALLIC SILVER' },
    { name: 'METALIC PINK', value: '#F9A8D4', code: 'METALLIC PINK' },
  ];

  const flavors = [
    {
      name: 'COOL MANGGO',
      image: '/assets/flavour-item.png',
      code: 'COOL MANGGO',
    },
    {
      name: 'COOL STRAWBERRY',
      image: '/assets/flavour-item.png',
      code: 'COOL STRAWBERRY',
    },
  ];

  const images = [
    '/assets/banner-promo-detial.png',
    '/assets/banner-promo-detial.png',
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='relative w-full max-w-[550px] mx-auto'>
        <Carousel
          setApi={(api) => setCarouselApi(api ?? null)}
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start', loop: true }}
        >
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx}>
                <div className='relative w-full aspect-video overflow-hidden max-h-[320px] sm:max-h-[360px] mx-auto'>
                  <Image
                    src={src}
                    alt={`Product Image ${idx + 1}`}
                    fill
                    sizes='(max-width: 550px) 100vw, 550px'
                    className='object-contain'
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <button
          type='button'
          className='absolute left-2 top-1/3 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center'
          onClick={() => carouselApi?.scrollPrev?.()}
          aria-label='Sebelumnya'
        >
          <Image
            src='/assets/carousel-arrow-l.png'
            alt='Prev'
            width={30}
            height={30}
            className='pointer-events-none'
          />
        </button>
        <div className='absolute left-4 -bottom-3'>
          <Badge className='bg-red-500 text-white shadow-md px-3 py-1 rounded-md'>
            Promo
          </Badge>
        </div>
      </div>

      <div className='px-4 py-4'>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex-1 min-w-0'>
            <h1 className='text-xl font-bold text-gray-900 mb-1 line-clamp-2'>
              Wasp Nano x2 + Makna Fruity
            </h1>
            <button
              type='button'
              className='flex items-center w-full text-left bg-transparent p-0 hover:opacity-80 cursor-pointer'
            >
              <div className='flex items-center'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='ml-1 text-sm font-medium text-gray-500'>
                  5.0
                </span>
                <span className='ml-1 text-sm text-gray-500'>
                  500+ • Terjual
                </span>
              </div>
            </button>
          </div>
          <div className='text-right shrink-0'>
            <div className='text-2xl font-bold text-black leading-tight'>
              Rp. 200.000
            </div>
            <div className='text-sm text-gray-400'>Diskon Ongkir 40rb</div>
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-6 leading-relaxed'>
          Ini adalah pilihan yang menggugah selera dan berbeda dari yang lain.
          Menghadirkan aroma lembut dan manis dari taro segar, perpaduan yang
          memberikan kesan creamy dan membangkitkan nostalgia pada cita rasa
          manis. Tak ketinggalan, sentuhan keju menambah dimensi gurih yang
          membuat aroma ini semakin unik dan menggoda.
        </p>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            Flavor{' '}
            <span className='text-muted-foreground text-xs'>Pilih 1</span>
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            {flavors.map((flavor) => (
              <Card
                key={flavor.code}
                className={`w-full h-32 md:h-36 p-4 cursor-pointer transition-colors ${
                  selectedFlavor === flavor.code
                    ? 'border-brand border-2'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedFlavor(flavor.code)}
              >
                <div className='flex flex-col items-center justify-between h-full space-y-2'>
                  <div className='relative h-16 w-16'>
                    <Image
                      src={flavor.image}
                      alt={flavor.name}
                      fill
                      className='object-contain'
                    />
                  </div>
                  <span className='text-xs font-medium text-center'>
                    {flavor.name}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            Variasi{' '}
            <span className='text-muted-foreground text-xs'>Pilih 1</span>
          </h3>
          <div className='grid grid-cols-3 gap-2'>
            {variations.map((color) => (
              <Card
                key={color.code}
                className={`w-full h-32 md:h-36 p-4 cursor-pointer transition-colors ${
                  selectedColor === color.code
                    ? 'border-brand border-2'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedColor(color.code)}
              >
                <div className='flex flex-col items-center justify-between h-full space-y-2'>
                  <div
                    className='w-8 h-8 rounded-full border-2 border-gray-300'
                    style={{ backgroundColor: color.value }}
                  />
                  <span className='text-xs font-medium text-center'>
                    {color.name}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {!noCart && (
        <>
          <BottomActionBar
            noteText='Rp 20.000'
            quantity={quantity}
            onDecrease={() => handleQuantityChange(-1)}
            onIncrease={() => handleQuantityChange(1)}
            primaryLabel='+ Keranjang Rp 20.000.000'
            onPrimaryClick={() => router.push('/order-confirmation')}
          />
          <div className='h-40 sm:h-44'></div>
        </>
      )}
    </div>
  );
}
