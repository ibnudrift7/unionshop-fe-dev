'use client';

import {
  HeroSection,
  LocationSection,
  CategoryGridSection,
  VoucherBannersSection,
  SpecialTodaySection,
  OfficialMerchandiseSection,
  ProductSection,
  ChatAdminSection,
  FooterNavigationSection,
  PromoSection,
} from '@/components/sections';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useProductsQuery, useCategoriesQuery } from '@/hooks/use-products';
import { useCartQuery } from '@/hooks/use-cart';
import { useDefaultAddressQuery } from '@/hooks/use-address';
import { useCartStore } from '@/store/cart';
import type { CartItem } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  heroImages,
  locationData,
  categories as mockCategories,
  voucher1Data,
  voucher2List,
  officialMerchData,
  products as mockProducts,
  promoImages,
} from '@/components/sections/shop/data';
import { useProfileQuery } from '@/hooks/use-profile';

export default function Home() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const { isLoggedIn, isReady } = useAuthStatus();
  const { data: memberCart } = useCartQuery(Boolean(isReady && isLoggedIn));
  const { data: productsData, isLoading: isLoadingProducts } =
    useProductsQuery();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesQuery();
  const { data: defaultAddressResp } = useDefaultAddressQuery(
    isReady && isLoggedIn,
  );
  const { data: profileResp } = useProfileQuery(Boolean(isReady && isLoggedIn));
  const defaultAddress = defaultAddressResp?.data ?? null;
  const cityName = defaultAddress?.city_name;
  const districtName = defaultAddress?.subdistrict_name;
  const productsForHome = useMemo(() => {
    return productsData && productsData.length > 0
      ? productsData
      : mockProducts;
  }, [productsData]);

  const itemsCount = useMemo(() => {
    if (isLoggedIn) {
      const list = memberCart?.data?.items ?? [];
      return list.reduce((sum, i) => sum + (i.qty ?? 0), 0);
    }
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [isLoggedIn, items, memberCart]);

  const totalAmount = useMemo(() => {
    if (isLoggedIn) {
      const raw = memberCart?.data?.summary?.subtotal;
      const n = Number(raw ?? 0);
      return Number.isFinite(n) ? n : 0;
    }
    return getTotal();
  }, [isLoggedIn, memberCart, getTotal]);

  const totalFormatted = useMemo(
    () =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(totalAmount),
    [totalAmount],
  );

  const pointsBalance: number = useMemo(() => {
    if (!isReady || !isLoggedIn) return locationData.points;
    const n = Number(profileResp?.data?.points_balance ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [isReady, isLoggedIn, profileResp]);
  useEffect(() => {
    const timer = setTimeout(() => {}, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isLoggedIn) return;
    try {
      const raw = localStorage.getItem('guest_cart');
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        useCartStore.setState({ items: parsed });
      }
    } catch {}
  }, [isLoggedIn]);

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='relative'>
        <HeroSection searchPlaceholder='Makna V4' images={heroImages} />

        <div className='absolute bottom-0 left-0 right-0 transform translate-y-3/4 z-1'>
          <LocationSection
            points={pointsBalance}
            name={
              !isReady || !isLoggedIn
                ? locationData.name
                : [districtName, cityName].filter(Boolean).join(', ') ||
                  locationData.name
            }
            address={
              !isReady || !isLoggedIn
                ? locationData.address
                : defaultAddress?.address_line || locationData.address
            }
            isGuest={!isReady || !isLoggedIn}
          />
        </div>
      </div>

      <div className='pt-36'>
        <CategoryGridSection
          categories={categoriesData ?? mockCategories}
          isLoading={categoriesLoading}
        />
      </div>

      <VoucherBannersSection voucher1={voucher1Data} vouchers={voucher2List} />

      <SpecialTodaySection
        onProductClick={(p) => router.push(`/product/${p.slug ?? p.id}`)}
      />

      <OfficialMerchandiseSection
        title={officialMerchData.title}
        subtitle={officialMerchData.subtitle}
        buttonText={officialMerchData.buttonText}
        imageSrc={officialMerchData.imageSrc}
      />

      <ProductSection
        products={productsForHome}
        isLoading={isLoadingProducts}
        onProductClick={(p) => router.push(`/product/${p.slug ?? p.id}`)}
      />

      <PromoSection images={promoImages} />

      <ChatAdminSection />

      <div className='h-36 sm:h-40' aria-hidden />

      <div className='fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-24 w-full max-w-[550px] px-4 z-50'>
        <div className='w-full bg-brand text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-lg'>
          <div className='flex flex-col leading-tight'>
            <span className='text-xs opacity-90'>{itemsCount} produk</span>
            <span className='text-lg font-semibold'>{totalFormatted}</span>
          </div>
          <Button
            size='icon'
            className='h-8 w-8 rounded-full bg-white text-brand hover:bg-white/90'
            onClick={() => router.push('/order-confirmation')}
            aria-label='Lanjut ke order confirmation'
          >
            <ArrowRight className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <FooterNavigationSection activeTab='home' />
    </div>
  );
}
