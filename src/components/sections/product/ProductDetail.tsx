'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import BottomActionBar from '../BottomActionBar';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const searchParams = useSearchParams();
  const noCart = searchParams.get('noCart') === '1';
  const [selectedColor, setSelectedColor] = useState('PURPLE');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));

  const colors = [
    { name: 'PURPLE', value: '#9333ea', code: 'PURPLE' },
    { name: 'BW', value: '#374151', code: 'BW' },
  ];

  const sizes = ['M', 'L', 'XL', 'XXL'];

  const images = [
    '/assets/Product.png',
    '/assets/Product2.png',
    '/assets/SpecialProduct.png',
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-brand px-4 py-4 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          className='text-white hover:bg-brand/80'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-6 w-6' />
        </Button>
      </div>

      <div className='bg-brand px-4 pb-6'>
        <div className='relative w-full max-w-[720px] mx-auto'>
          <Carousel
            plugins={[plugin.current]}
            className='w-full'
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ align: 'start', loop: true }}
          >
            <CarouselContent>
              {images.map((src, idx) => (
                <CarouselItem key={idx}>
                  <div className='relative w-full aspect-[4/5] overflow-hidden rounded-lg'>
                    <Image
                      src={src}
                      alt={`Product Image ${idx + 1}`}
                      fill
                      sizes='(max-width: 720px) 100vw, 720px'
                      className='object-cover'
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className='px-4 py-4'>
        <Badge className='bg-red-500 text-white mb-3'>Promo</Badge>

        <h1 className='text-xl font-bold text-gray-900 mb-2'>
          Makna - Jersey Boxy Oversized
        </h1>

        <button
          type='button'
          onClick={() =>
            productId && router.push(`/product/${productId}/reviews`)
          }
          className='flex items-center mb-3 w-full text-left bg-transparent p-0 hover:opacity-80 cursor-pointer'
        >
          <div className='flex items-center'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            <span className='ml-1 text-sm font-medium'>5.0</span>
            <span className='ml-1 text-sm text-gray-500'>500 • Terjual</span>
          </div>
        </button>

        <div className='flex items-center mb-4'>
          <span className='text-2xl font-bold text-red-500'>Rp. 200.000</span>
          <span className='ml-2 text-sm text-gray-400 line-through'>
            Rp 20.000
          </span>
        </div>

        <p className='text-sm text-gray-600 mb-6 leading-relaxed'>
          Ini adalah pilihan yang menggugah selera dan berbeda dari yang lain.
          Memberikan aroma lembut dan manis dari taro segar, perpaduan yang
          sempurna antara kelembutan dan kekayaan rasa yang tak terlupakan.
          Nikmati sensasi unik yang memberikan pengalaman tak terlupakan dengan
          setiap rasa manis. Tak ketinggalan, sentuhan kejut menambah dimensi
          gurih yang membuat aroma ini semakin unik dan menggoda.
        </p>

        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-900 mb-3'>
            Color <span className='text-brand'>Pilih 1</span>
          </h3>
          <div className='flex space-x-4'>
            {colors.map((color) => (
              <Card
                key={color.code}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedColor === color.code
                    ? 'border-brand border-2'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedColor(color.code)}
              >
                <div className='flex flex-col items-center space-y-2'>
                  <div
                    className='w-8 h-8 rounded-full border-2 border-gray-300'
                    style={{ backgroundColor: color.value }}
                  />
                  <span className='text-xs font-medium'>{color.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-900 mb-3'>
            Size <span className='text-brand'>Pilih 1</span>
          </h3>
          <div className='flex space-x-2'>
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                className={`px-6 py-2 ${
                  selectedSize === size
                    ? 'bg-brand text-white border-brand'
                    : 'border-gray-300 text-gray-700 hover:border-brand'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {!noCart && (
        <>
          <BottomActionBar
            noteText='Hemat Rp 20.000'
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
