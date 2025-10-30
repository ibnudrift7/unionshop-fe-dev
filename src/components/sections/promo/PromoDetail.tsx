'use client';

import { useMemo, useRef, useState } from 'react';
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
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import BottomActionBar from './BottomActionBar';
import { useCartStore } from '@/store/cart';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useAddCartItemsMutation } from '@/hooks/use-cart';
import useProductPromoDetailQuery from '@/hooks/use-product-promo';

export default function PromoDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const noCart = searchParams.get('noCart') === '1';
  const slug =
    (params as Record<string, string | undefined>)?.slug ||
    (params as Record<string, string | undefined>)?.id;

  const { data: product } = useProductPromoDetailQuery(slug);

  const imageAttrGroup = useMemo(
    () =>
      product?.attributes?.find((g) => g.type === 'images' && g.values?.length),
    [product?.attributes],
  );
  const optionAttrGroup = useMemo(
    () =>
      product?.attributes?.find(
        (g) => g.type === 'options' && g.values?.length,
      ),
    [product?.attributes],
  );

  const [selectedOptionValue, setSelectedOptionValue] = useState<
    string | number | undefined
  >(undefined);
  const [selectedImageValue, setSelectedImageValue] = useState<
    string | number | undefined
  >(undefined);

  useMemo(() => {
    if (optionAttrGroup && !selectedOptionValue) {
      setSelectedOptionValue(
        optionAttrGroup.values[0]?.id ?? optionAttrGroup.values[0]?.value,
      );
    }
    if (imageAttrGroup && !selectedImageValue) {
      setSelectedImageValue(
        imageAttrGroup.values[0]?.id ?? imageAttrGroup.values[0]?.value,
      );
    }
  }, [
    imageAttrGroup,
    optionAttrGroup,
    selectedImageValue,
    selectedOptionValue,
  ]);
  const [quantity, setQuantity] = useState(1);
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | null>(
    null,
  );

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : ['/assets/banner-promo-detial.png'];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const { isLoggedIn } = useAuthStatus();
  const { mutate: addMemberCart } = useAddCartItemsMutation();

  const addToCart = () => {
    if (!product) return;

    const attrs: Array<{ name: string; value: string }> = [];

    if (imageAttrGroup && selectedImageValue != null) {
      const v = imageAttrGroup.values.find(
        (vv) => (vv.id ?? vv.value) === selectedImageValue,
      );
      if (v)
        attrs.push({ name: imageAttrGroup.name, value: v.value || 'null' });
    }
    if (optionAttrGroup && selectedOptionValue != null) {
      const v = optionAttrGroup.values.find(
        (vv) => (vv.id ?? vv.value) === selectedOptionValue,
      );
      if (v)
        attrs.push({ name: optionAttrGroup.name, value: v.value || 'null' });
    }

    if (isLoggedIn) {
      const productIdNum = Number(product.id);
      if (!Number.isFinite(productIdNum)) {
        const productForCart = {
          ...product,
          selectedAttributes: attrs,
        } as unknown as typeof product;
        useCartStore.getState().addItem(productForCart, quantity);
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
            } as unknown as typeof product;
            useCartStore.getState().addItem(productForCart, quantity);
            router.push('/order-confirmation');
          },
        },
      );
      return;
    }

    const productForCart = {
      ...product,
      selectedAttributes: attrs,
    } as unknown as typeof product;
    useCartStore.getState().addItem(productForCart, quantity);
    router.push('/order-confirmation');
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
              {product?.name || 'Produk Promo'}
            </h1>
            <button
              type='button'
              className='flex items-center w-full text-left bg-transparent p-0 hover:opacity-80 cursor-pointer'
            >
              <div className='flex items-center'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='ml-1 text-sm font-medium text-gray-500'>
                  {product?.rating?.toFixed?.(1) ?? '0.0'}
                </span>
                <span className='ml-1 text-sm text-gray-500'>
                  {product?.sold ?? 0}+ • Terjual
                </span>
              </div>
            </button>
          </div>
          <div className='text-right shrink-0'>
            <div className='text-2xl font-bold text-black leading-tight'>
              Rp. {Number(product?.price ?? 0).toLocaleString('id-ID')}
            </div>
            <div className='text-sm text-gray-400'>Diskon Ongkir 40rb</div>
          </div>
        </div>
        <p className='text-sm text-gray-600 mb-6 leading-relaxed'>
          {product?.description || 'Produk bundel promo pilihan untuk Anda.'}
        </p>
        {/* "type": "images" */}
        {imageAttrGroup && imageAttrGroup.values.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              {imageAttrGroup.name}{' '}
              <span className='text-muted-foreground text-xs'>Pilih 1</span>
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              {imageAttrGroup.values.map((v) => (
                <Card
                  key={v.id}
                  className={`w-full h-32 md:h-36 p-4 cursor-pointer transition-colors ${
                    (selectedImageValue ?? '') === (v.id ?? v.value)
                      ? 'border-brand border-2'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImageValue(v.id ?? v.value)}
                >
                  <div className='flex flex-col items-center justify-between h-full space-y-2'>
                    <div className='relative h-16 w-16'>
                      <Image
                        src={v.image || '/assets/flavour-item.png'}
                        alt={v.value}
                        fill
                        className='object-contain'
                      />
                    </div>
                    <span className='text-xs font-medium text-center'>
                      {v.value}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* "type": "options"  */}
        {optionAttrGroup && optionAttrGroup.values.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              {optionAttrGroup.name}{' '}
              <span className='text-muted-foreground text-xs'>Pilih 1</span>
            </h3>
            <div className='grid grid-cols-3 gap-2'>
              {optionAttrGroup.values.map((v) => (
                <Card
                  key={v.id}
                  className={`w-full h-20 md:h-24 p-4 cursor-pointer transition-colors flex items-center justify-center ${
                    (selectedOptionValue ?? '') === (v.id ?? v.value)
                      ? 'border-brand border-2'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedOptionValue(v.id ?? v.value)}
                >
                  <span className='text-xs font-medium text-center'>
                    {v.value}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {!noCart && (
        <>
          <BottomActionBar
            noteText={`Rp ${Number(product?.price ?? 0).toLocaleString(
              'id-ID',
            )}`}
            quantity={quantity}
            onDecrease={() => handleQuantityChange(-1)}
            onIncrease={() => handleQuantityChange(1)}
            primaryLabel={`+ Keranjang Rp ${(
              Number(product?.price ?? 0) * quantity
            ).toLocaleString('id-ID')}`}
            onPrimaryClick={addToCart}
          />
          <div className='h-40 sm:h-44'></div>
        </>
      )}
    </div>
  );
}
