'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType } from 'embla-carousel';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomActionBar from './BottomActionBar';
import OffDayBanner from './OffDayBanner';
import OffDayOverlay from './OffDayOverlay';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useAddCartItemsMutation } from '@/hooks/use-cart';
import { useOffDay } from '@/hooks/use-off-day';
import { formatIDR } from '@/lib/utils';

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
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | null>(
    null,
  );
  const { isLoggedIn } = useAuthStatus();
  const { mutate: addMemberCart } = useAddCartItemsMutation();
  const { isOffDay, nextOperationalDate } = useOffDay();

  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) return product.images;
    if (product?.image) return [product.image];
    return ['/assets/Product.png'];
  }, [product]);

  const colorAttr = useMemo(
    () => product?.attributes?.find((a) => a.type === 'images'),
    [product],
  );
  const sizeAttr = useMemo(
    () => product?.attributes?.find((a) => a.type === 'options'),
    [product],
  );
  const colors = colorAttr?.values ?? [];
  const sizes = sizeAttr?.values ?? [];

  useEffect(() => {
    setSelectedColorId(colors.length > 0 ? colors[0].id : null);
    setSelectedSizeId(sizes.length > 0 ? sizes[0].id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const savingsAmount = useMemo(() => {
    if (!product) return 0;

    // Ambil base_price dan sale_price dari product (bisa jadi string dari API)
    const basePrice = Number(product.discountPrice ?? 0);
    const salePrice = Number(product.price ?? 0);

    // Hitung hemat jika base_price > sale_price dan sale_price > 0
    if (basePrice > salePrice && salePrice > 0) {
      return basePrice - salePrice;
    }

    return 0;
  }, [product]);

  const addToCart = () => {
    if (!product) return;
    setIsAddingToCart(true);
    const attrs: Array<{ name: string; value: string }> = [];
    if (colorAttr && selectedColorId != null) {
      const v = colorAttr.values.find((vv) => vv.id === selectedColorId);
      if (v) attrs.push({ name: colorAttr.name, value: v.value || 'null' });
    }
    if (sizeAttr && selectedSizeId != null) {
      const v = sizeAttr.values.find((vv) => vv.id === selectedSizeId);
      if (v) attrs.push({ name: sizeAttr.name, value: v.value || 'null' });
    }

    if (isLoggedIn) {
      const productIdNum = Number(product.id);
      if (!Number.isFinite(productIdNum)) {
        useCartStore.getState().addItem(product, quantity);
        router.push('/order-confirmation');
        return;
      }

      addMemberCart(
        [
          {
            product_id: productIdNum,
            qty: quantity,
            attributes: attrs,
          },
        ],
        {
          onSuccess: () => {
            router.push('/order-confirmation');
          },
          onError: () => {
            const productForCart = {
              ...product,
              selectedAttributes: attrs,
            } as unknown as Product;
            useCartStore.getState().addItem(productForCart, quantity);
            router.push('/order-confirmation');
          },
        },
      );
      return;
    }

    // Guest mode: keranjang lokal
    const productForCart = {
      ...product,
      selectedAttributes: attrs,
    } as unknown as Product;
    useCartStore.getState().addItem(productForCart, quantity);
    router.push('/order-confirmation');
  };

  return (
    <div className='min-h-screen bg-white'>
      {isOffDay && <OffDayBanner nextOperationalDate={nextOperationalDate} />}

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

      <OffDayOverlay isActive={isOffDay}>
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
              onClick={() => router.back()}
              aria-label='Kembali'
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
                {loading
                  ? 'Memuat…'
                  : product?.name || 'Produk Tidak Ditemukan'}
              </h1>
              <button
                type='button'
                onClick={() => {
                  if (product)
                    router.push(
                      `/product/${product.slug ?? product.id}/reviews`,
                    );
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
                {product ? formatIDR(product.price) : '—'}
              </div>
              {product?.discountPrice && (
                <div className='text-sm text-gray-400 line-through'>
                  {formatIDR(product.discountPrice)}
                </div>
              )}
            </div>
          </div>

          <p className='text-sm text-gray-600 mb-6 leading-relaxed whitespace-pre-line'>
            {loading ? (
              'Memuat deskripsi…'
            ) : product ? (
              product.description ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description),
                  }}
                />
              ) : (
                'Deskripsi tidak tersedia.'
              )
            ) : (
              'Produk tidak ditemukan atau belum tersedia.'
            )}
          </p>

          {colors.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-900 mb-3'>
                {colorAttr?.name ?? 'Color'}{' '}
                <span className='text-brand'>Pilih 1</span>
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                {colors.map((color) => (
                  <Card
                    key={color.id}
                    className={`w-full md:h-32 p-4 transition-colors ${
                      selectedColorId === color.id
                        ? 'border-brand border-2'
                        : 'border-gray-200'
                    } ${
                      isOffDay
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }`}
                    onClick={() => !isOffDay && setSelectedColorId(color.id)}
                  >
                    <div className='flex flex-col items-center justify-center h-full space-y-2'>
                      <div className='w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100'>
                        {color.image ? (
                          <Image
                            src={color.image}
                            alt={color.value || 'Color'}
                            width={48}
                            height={48}
                            className='object-cover w-full h-full'
                          />
                        ) : (
                          <span className='text-xs text-gray-700 text-center px-1'>
                            {color.value || '—'}
                          </span>
                        )}
                      </div>
                      <span className='text-xs font-medium'>
                        {color.value || '—'}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-900 mb-3'>
                {sizeAttr?.name ?? 'Size'}{' '}
                <span className='text-brand'>Pilih 1</span>
              </h3>
              <div className='flex w-full gap-2'>
                {sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={selectedSizeId === size.id ? 'default' : 'outline'}
                    className={`flex-1 py-2 ${
                      selectedSizeId === size.id
                        ? 'bg-brand text-white border-brand'
                        : 'border-gray-300 text-gray-700 hover:border-brand'
                    }`}
                    onClick={() => !isOffDay && setSelectedSizeId(size.id)}
                    disabled={isOffDay}
                  >
                    {size.value || '—'}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </OffDayOverlay>

      {!noCart && (
        <>
          {!isOffDay && (
            <BottomActionBar
              noteText={
                savingsAmount > 0 && product
                  ? formatIDR(savingsAmount)
                  : undefined
              }
              quantity={quantity}
              onDecrease={() => handleQuantityChange(-1)}
              onIncrease={() => handleQuantityChange(1)}
              primaryLabel={
                product
                  ? `+ Keranjang ${formatIDR(product.price * quantity)}`
                  : '+ Keranjang'
              }
              onPrimaryClick={addToCart}
              isLoading={isAddingToCart}
            />
          )}
          <div className='h-40 sm:h-44'></div>
        </>
      )}
    </div>
  );
}
