'use client';

import { useRef, useState, useMemo } from 'react';
import { Star } from 'lucide-react';
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
import type { EmblaCarouselType } from 'embla-carousel';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomActionBar from './BottomActionBar';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';

interface ProductDetailProps {
  product?: Product;
  loading?: boolean;
}

export default function ProductDetail({
  product,
  loading = false,
}: ProductDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noCart = searchParams.get('noCart') === '1';
  const [selectedColor, setSelectedColor] = useState('PURPLE');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | null>(
    null,
  );

  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) return product.images;
    if (product?.image) return [product.image];
    return ['/assets/Product.png'];
  }, [product]);

  const colors = [
    { name: 'PURPLE', value: '#9333ea', code: 'PURPLE' },
    { name: 'BW', value: '#374151', code: 'BW' },
  ];
  const sizes = ['M', 'L', 'XL', 'XXL'];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const addToCart = () => {
    if (!product) return;
    useCartStore.getState().addItem(product, quantity);
    router.push('/order-confirmation');
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* <div className='bg-brand px-4 py-4 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          className='text-white hover:bg-brand/80'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-6 w-6' />
        </Button>
      </div> */}

      <div className='bg-brand p-4 pb-6'>
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
                  <div className='relative w-full aspect-video overflow-hidden rounded-lg max-h-[320px] sm:max-h-[360px] mx-auto'>
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
          <div className='absolute left-0 right-4 -bottom-8 flex'>
            <Badge className='bg-red-500 text-white shadow-md px-3 py-1 rounded-md'>
              Promo
            </Badge>
          </div>
        </div>
      </div>

      <div className='px-4 py-4'>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex-1 min-w-0'>
            <h1 className='text-xl font-bold text-gray-900 mb-1 line-clamp-2'>
              {loading ? 'Memuat…' : product?.name || 'Produk Tidak Ditemukan'}
            </h1>
            <button
              type='button'
              onClick={() => {
                /* reviews route could use slug or id later */
              }}
              className='flex items-center w-full text-left bg-transparent p-0 hover:opacity-80 cursor-pointer'
            >
              <div className='flex items-center'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='ml-1 text-sm font-medium'>
                  {product?.rating ?? '-'}
                </span>
                <span className='ml-1 text-sm text-gray-500'>
                  {product?.sold ? `${product.sold} • Terjual` : '—'}
                </span>
              </div>
            </button>
          </div>
          <div className='text-right shrink-0'>
            <div className='text-2xl font-bold text-red-500 leading-tight'>
              {product
                ? new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(product.price)
                : '—'}
            </div>
            {product?.discountPrice && (
              <div className='text-sm text-gray-400 line-through'>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(product.discountPrice)}
              </div>
            )}
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-6 leading-relaxed whitespace-pre-line'>
          {loading
            ? 'Memuat deskripsi…'
            : product
            ? product.description || 'Deskripsi tidak tersedia.'
            : 'Produk tidak ditemukan atau belum tersedia.'}
        </p>

        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-900 mb-3'>
            Color <span className='text-brand'>Pilih 1</span>
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            {colors.map((color) => (
              <Card
                key={color.code}
                className={`w-full md:h-32 p-4 cursor-pointer transition-colors ${
                  selectedColor === color.code
                    ? 'border-brand border-2'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedColor(color.code)}
              >
                <div className='flex flex-col items-center justify-center h-full space-y-2'>
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
          <div className='flex w-full gap-2'>
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                className={`flex-1 py-2 ${
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
            noteText={
              product
                ? new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(product.price)
                : '—'
            }
            quantity={quantity}
            onDecrease={() => handleQuantityChange(-1)}
            onIncrease={() => handleQuantityChange(1)}
            primaryLabel={
              product
                ? `+ Keranjang ${new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(product.price * quantity)}`
                : '+ Keranjang'
            }
            onPrimaryClick={addToCart}
          />
          <div className='h-40 sm:h-44'></div>
        </>
      )}
    </div>
  );
}
