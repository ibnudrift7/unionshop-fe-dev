'use client';

import { Coins, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useCartQuery } from '@/hooks/use-cart';
import { useDefaultAddressQuery } from '@/hooks/use-address';
import { useGuestAddress } from '@/hooks/use-guest-address';
import { useProfileQuery } from '@/hooks/use-profile';
import type { ShippingServiceItem } from '@/types/shipping';
import {
  useCouriersQuery,
  useShippingCalculateQuery,
} from '@/hooks/use-shipping';

interface CheckoutSectionProps {
  onTotalChange?: (total: number) => void;
  onSelectionChange?: (sel: {
    courierId: number | null;
    serviceCode: string | null;
    shippingFee: number;
    estimatedDay: string | null;
    pointsToUse: number;
  }) => void;
}

export function CheckoutSection({
  onTotalChange,
  onSelectionChange,
}: CheckoutSectionProps) {
  const { isLoggedIn, isReady } = useAuthStatus();
  const { items: guestItems } = useCartStore();
  const [guestToken, setGuestToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('guest_token') : null,
  );
  const [guestCartInfo, setGuestCartInfo] = useState<{
    cart_id?: number;
    address_id?: number;
  } | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('guest_cart_info');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'guest_token')
        setGuestToken(localStorage.getItem('guest_token'));
      if (e.key === 'guest_cart_info') {
        try {
          const raw = localStorage.getItem('guest_cart_info');
          setGuestCartInfo(raw ? JSON.parse(raw) : null);
        } catch {
          setGuestCartInfo(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const { data: defaultAddress } = useDefaultAddressQuery(
    isReady && isLoggedIn,
  );
  const { data: guestAddress } = useGuestAddress();

  const isGuest = Boolean(guestToken);
  const { data: memberCart } = useCartQuery(isReady && (isLoggedIn || isGuest));
  const { data: profileResp } = useProfileQuery(isReady && isLoggedIn);
  const [usePoints, setUsePoints] = useState(false);
  const { data: couriersRes, isLoading: loadingCouriers } = useCouriersQuery(
    isReady && (isLoggedIn || isGuest),
  );
  const couriers = useMemo(() => couriersRes?.data ?? [], [couriersRes]);
  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (couriers.length > 0 && selectedCourierId == null) {
      setSelectedCourierId(couriers[0].id);
    }
  }, [couriers, selectedCourierId]);

  const selectedCourier = useMemo(() => {
    return couriers.find((c) => c.id === selectedCourierId) || null;
  }, [couriers, selectedCourierId]);

  const cartId = memberCart?.data?.cart_id ?? guestCartInfo?.cart_id;
  const addressId = defaultAddress?.data?.id ?? guestCartInfo?.address_id;

  const { data: shippingCalcRes, isLoading: loadingShipping } =
    useShippingCalculateQuery(
      (isLoggedIn || isGuest) &&
        Boolean(selectedCourier?.code) &&
        Boolean(cartId) &&
        Boolean(addressId),
      {
        courier: selectedCourier?.code || '',
        cart_id: cartId || 0,
        address_id: addressId || 0,
      },
    );

  const availableServices: ShippingServiceItem[] = useMemo(() => {
    if (!shippingCalcRes?.data || !selectedCourier?.code) return [];
    const key =
      selectedCourier.code as keyof typeof shippingCalcRes.data.shipping_options;
    const courierOpt = shippingCalcRes.data.shipping_options[key];
    return courierOpt?.services ?? [];
  }, [shippingCalcRes, selectedCourier]);

  const [selectedServiceCode, setSelectedServiceCode] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (availableServices.length > 0 && !selectedServiceCode) {
      setSelectedServiceCode(availableServices[0].code);
    }
  }, [availableServices, selectedServiceCode]);

  const selectedService = useMemo(() => {
    return (
      availableServices.find((s) => s.code === selectedServiceCode) || null
    );
  }, [availableServices, selectedServiceCode]);

  const displayItems = useMemo(() => {
    if (isLoggedIn) {
      return (memberCart?.data?.items ?? []).map((i) => {
        const price = Number(i.prices ?? i.sale_price ?? i.base_price ?? 0);
        const qty = Number(i.qty ?? 0);
        const total = Number(i.subtotal ?? price * qty);
        return {
          key: String(i.id),
          name: i.product_name,
          quantity: qty,
          price,
          total,
        };
      });
    }
    return guestItems.map((i) => ({
      key: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
      total: i.product.price * i.quantity,
    }));
  }, [isLoggedIn, memberCart, guestItems]);

  const subtotalProduct = useMemo(
    () => displayItems.reduce((sum, i) => sum + i.total, 0),
    [displayItems],
  );
  const subtotalShipping = useMemo(() => {
    if (!selectedService) return 0;
    return selectedService.cost || 0;
  }, [selectedService]);
  // if user chooses to use points, use their full points balance (1 point = 1 IDR)
  const pointsBalance = profileResp?.data?.points_balance ?? 0;
  const pointsToUse = usePoints ? pointsBalance : 0;
  const pointsDiscount = pointsToUse;
  const totalOrder = useMemo(
    () => Math.max(0, subtotalProduct + subtotalShipping - pointsDiscount),
    [subtotalProduct, subtotalShipping, pointsDiscount],
  );

  const estimatedDeliveryDate = useMemo(() => {
    const dayStr = selectedService?.estimated_day || '';
    const match = dayStr.match(/\d+/);
    const days = match ? parseInt(match[0], 10) : 3;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }, [selectedService]);

  useEffect(() => {
    onTotalChange?.(totalOrder);
  }, [totalOrder, onTotalChange]);

  useEffect(() => {
    onSelectionChange?.({
      courierId: selectedCourier?.id ?? null,
      serviceCode: selectedService?.code ?? null,
      shippingFee: subtotalShipping,
      estimatedDay: selectedService?.estimated_day ?? null,
      pointsToUse: pointsToUse,
    });
  }, [
    onSelectionChange,
    selectedCourier,
    selectedService,
    subtotalShipping,
    pointsToUse,
  ]);

  const format = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  return (
    <div className='p-4 space-y-4'>
      <Card className='border-0 m-0 p-0'>
        <CardContent className='px-4 py-2'>
          <div className='flex items-start gap-2'>
            <Image
              src='/assets/icon-check.png'
              alt='Alamat terpilih'
              width={28}
              height={28}
              className='mt-0.5 flex-shrink-0'
            />
            <div className='flex-1'>
              <p className='text-xs text-gray-600 mb-0.5'>Dikirim ke</p>
              {isLoggedIn ? (
                <>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    {defaultAddress?.data?.recipient_name || 'Alamat Utama'}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {defaultAddress?.data
                      ? `${defaultAddress.data.address_line}, ${defaultAddress.data.postal_code}`
                      : 'Memuat alamat…'}
                  </p>
                </>
              ) : (
                <>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    {guestAddress?.name || 'Alamat Tamu'}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {guestAddress
                      ? `${guestAddress.addressDetail}, ${
                          guestAddress.districtName || guestAddress.district
                        }, ${guestAddress.cityName || guestAddress.city}, ${
                          guestAddress.provinceName || guestAddress.province
                        } ${guestAddress.postalCode}`
                      : 'Diisi pada langkah sebelumnya'}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-2 pt-0 mt-4'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3 pb-3 mb-3 border-b-2'>
            <div className='w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center'>
              <ShoppingBag className='h-4 w-4 text-brand' />
            </div>
            <h3 className='text-sm font-semibold text-gray-900'>Pesanan</h3>
            <span className='text-xs text-gray-500 ml-auto'>
              Total {displayItems.reduce((acc, i) => acc + i.quantity, 0)} Item
            </span>
          </div>

          <div className='space-y-4'>
            {displayItems.length === 0 && (
              <p className='text-xs text-gray-500'>Keranjang kosong.</p>
            )}
            {displayItems.map((i, idx) => (
              <div
                key={i.key}
                className='flex justify-between items-center relative'
              >
                <div className='flex-1 pr-2'>
                  <span className='text-xs font-semibold text-gray-700'>
                    {i.quantity} x
                  </span>
                  <p className='text-sm font-semibold text-gray-900 mt-1 line-clamp-2'>
                    {i.name}
                  </p>
                  {typeof i.price !== 'undefined' && (
                    <p className='text-xs text-gray-500 mt-1'>
                      Rp {format(i.price)} / pcs
                    </p>
                  )}
                </div>
                <p className='text-sm font-semibold text-gray-900 ml-4 whitespace-nowrap'>
                  Rp {format(i.total)}
                </p>
                {idx !== displayItems.length - 1 && (
                  <hr className='border-dashed border-gray-300 absolute -bottom-2 left-0 right-0' />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert className='bg-brand/50 border-brand/60 grid-cols-[auto_1fr] gap-x-3 items-center'>
        <Image
          src='/assets/attention-icon.png'
          alt='Perhatian'
          width={25}
          height={25}
        />
        <AlertDescription className='text-black text-base font-bold'>
          Pastikan nomor kamu dapat dihubungi oleh pihak kurir.
        </AlertDescription>
      </Alert>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between gap-3'>
            <label
              htmlFor='courier'
              className='text-sm font-semibold text-gray-900'
            >
              Pilih kurir
            </label>
            {isLoggedIn || isGuest ? (
              <select
                id='courier'
                value={selectedCourierId ?? ''}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedCourierId(isNaN(id) ? null : id);
                  setSelectedServiceCode(null);
                }}
                disabled={displayItems.length === 0 || loadingCouriers}
                className='w-1/2 md:w-2/5 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-100 disabled:text-gray-400'
                aria-disabled={displayItems.length === 0}
              >
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.toUpperCase()}
                  </option>
                ))}
              </select>
            ) : (
              <p className='text-xs text-gray-600'>
                Masukkan alamat / daftar tamu untuk memilih kurir.
              </p>
            )}
          </div>
          {(isLoggedIn || isGuest) && selectedCourier && (
            <>
              <div className='flex items-center justify-between gap-3 mt-3'>
                <label
                  htmlFor='service'
                  className='text-sm font-semibold text-gray-900'
                >
                  Paket layanan
                </label>
                <select
                  id='service'
                  value={selectedServiceCode ?? ''}
                  onChange={(e) => setSelectedServiceCode(e.target.value)}
                  disabled={availableServices.length === 0 || loadingShipping}
                  className='w-1/2 md:w-2/5 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-100 disabled:text-gray-400'
                >
                  {availableServices.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} — Rp {format(s.cost)}
                    </option>
                  ))}
                </select>
              </div>

              <p className='text-xs text-gray-600 mt-2'>
                Ongkir: Rp {format(subtotalShipping)} • Estimasi:{' '}
                {selectedService?.estimated_day || '-'}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className='space-y-3'>
        <h3 className='text-sm font-semibold text-gray-900'>
          Estimasi Pengiriman {selectedService?.estimated_day || '-'}
        </h3>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image
              src='/assets/icon-check.png'
              alt='Alamat terpilih'
              width={28}
              height={28}
              className='mt-0.5 flex-shrink-0'
            />
            <div>
              <p className='text-base font-semibold text-black'>
                Tanggal dipesan :
              </p>
              <p className='text-base font-semibold text-black'>
                {new Date().toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Image
              src='/assets/icon-check.png'
              alt='Alamat terpilih'
              width={28}
              height={28}
              className='mt-0.5 flex-shrink-0'
            />
            <div>
              <p className='text-base font-semibold text-black'>
                Estimasi terkirim :
              </p>
              <p className='text-base font-semibold text-black'>
                {estimatedDeliveryDate.toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4 space-y-1'>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-600'>Subtotal produk</p>
            <p className='text-sm font-medium text-gray-900'>
              Rp {format(subtotalProduct)}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-600'>Subtotal Pengiriman</p>
            <p className='text-sm font-medium text-gray-900'>
              Rp {format(subtotalShipping)}
            </p>
          </div>
          {pointsDiscount > 0 && (
            <div className='flex justify-between items-center text-green-600'>
              <p className='text-sm'>Diskon Poin</p>
              <p className='text-sm font-medium'>
                - Rp {format(pointsDiscount)}
              </p>
            </div>
          )}
          <hr className='border-gray-200' />
          <div className='flex justify-end items-center gap-2'>
            <p className='text-base text-gray-900'>Total Pesanan:</p>
            <p className='text-base font-bold text-gray-900'>
              Rp {format(totalOrder)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <label htmlFor='use-points' className='cursor-pointer select-none'>
              <h3 className='text-sm font-semibold text-gray-900'>
                Gunakan poin
              </h3>
              <p className='text-xs text-gray-600'>
                Total poin kamu :{' '}
                {profileResp?.data?.points_balance !== undefined
                  ? new Intl.NumberFormat('id-ID').format(
                      profileResp.data.points_balance,
                    )
                  : '—'}
              </p>
            </label>
            <Checkbox
              id='use-points'
              checked={usePoints}
              onCheckedChange={(v) => setUsePoints(!!v)}
              className='size-5 border-2 border-gray-400 data-[state=checked]:bg-brand data-[state=checked]:border-brand focus-visible:ring-brand/50'
            />
          </div>

          <div className='border border-brand rounded-lg p-3 flex items-center gap-3'>
            <Coins className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
            <p className='text-base text-brand'>
              Kamu akan mendapatkan{' '}
              <span className='font-bold text-brand'>
                {Math.max(0, Math.round(subtotalProduct / 10000) * 10)} point
              </span>{' '}
              dari total belanja ini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckoutSection;
