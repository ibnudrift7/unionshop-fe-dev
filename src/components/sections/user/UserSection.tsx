'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Edit2, LogOut, MapPin, Menu, Phone } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ForgotPasswordSheet } from '@/components/sections/auth/ForgotPasswordSheet';
import { LoginSheet } from '@/components/sections/auth/LoginSheet';
import { RegisterSheet } from '@/components/sections/auth/RegisterSheet';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
} from '@/hooks/use-auth';
import { useProfileQuery } from '@/hooks/use-profile';
import { setAuthToken, useAuthStatus } from '@/hooks/use-auth-status';
import type { LoginPayload, RegisterPayload } from '@/types/auth';
import { locationService } from '@/services/location';
import { addressService } from '@/services/address';
import type { CreateAddressPayload } from '@/types/address';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  newTab?: boolean;
}

const menuItems: MenuItem[] = [
  {
    icon: <Menu className='w-5 h-5 text-brand' />,
    label: 'Riwayat Pesanan',
    href: '/orders',
  },
  {
    icon: <MapPin className='w-5 h-5 text-brand' />,
    label: 'Data Pengiriman',
    href: '/shipping',
  },
  {
    icon: <Phone className='w-5 h-5 text-brand' />,
    label: 'Pelayanan Whatsapp',
    href: 'https://wa.me/6283854560095',
    newTab: true,
  },
  {
    icon: (
      <Image
        src='/assets/logo-makna-about.jpg'
        alt='Tentang Makna'
        width={10}
        height={10}
        className='w-6 h-3 object-cover'
      />
    ),
    label: 'Tentang Makna',
    href: '/about',
  },
];

export default function MobileMenu() {
  const registerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const forgotTriggerRef = useRef<HTMLButtonElement | null>(null);
  const loginTriggerRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  const { isLoggedIn } = useAuthStatus();
  const { data: profileData } = useProfileQuery(isLoggedIn);
  const [userName, setUserName] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const forgotMutation = useForgotPasswordMutation();

  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  const voucherBase = {
    title1: 'Mau Voucher',
    title2: 'Diskon 10RB?',
    description: 'Gabung & Ambil Vouchernya Sekarang juga!',
    buttonText: 'CLAIM SEKARANG',
    image: '/assets/Voucher.png',
  };
  const vouchers = [
    voucherBase,
    {
      ...voucherBase,
      title2: 'Diskon 15RB?',
      image: '/assets/Voucher2.png',
    },
  ];

  useEffect(() => {
    const fullName = profileData?.data?.full_name;
    if (isLoggedIn && fullName) {
      setUserName(fullName);
    }
  }, [isLoggedIn, profileData?.data?.full_name]);

  const closeActiveSheet = useCallback(() => {
    const activeSheet = document.querySelector<HTMLElement>(
      '[data-state="open"]',
    );
    activeSheet?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  }, []);

  const openSheet = useCallback(
    (ref: React.RefObject<HTMLButtonElement | null>) => {
      ref.current?.click();
    },
    [],
  );

  const handleLoginSubmit = useCallback(
    (payload: LoginPayload) => {
      setLoginError(null);
      loginMutation.mutate(payload, {
        onSuccess: (response) => {
          try {
            const token = response?.data?.token as string | undefined;
            setAuthToken(token);
          } catch {}
          const nameFromResponse =
            response?.data?.user?.full_name ??
            response?.data?.user?.name ??
            null;
          setUserName(nameFromResponse);
          setLoginError(null);
          toast.success(
            response?.message ?? 'Berhasil masuk. Selamat berbelanja!',
          );
          try {
            router.refresh();
          } catch {}
          closeActiveSheet();
        },
        onError: (error) => {
          const message = error.message || 'Gagal masuk. Silakan coba lagi.';
          setLoginError(message);
          toast.error(message);
        },
      });
    },
    [closeActiveSheet, loginMutation, router],
  );

  const handleRegisterSubmit = useCallback(
    (payload: RegisterPayload) => {
      setRegisterError(null);
      registerMutation.mutate(payload, {
        onSuccess: async (response) => {
          const tokenFromRegister =
            (response?.data?.token as string | undefined) ||
            ((response?.data?.tokens as { accessToken?: string } | undefined)
              ?.accessToken ??
              undefined);

          const headers = tokenFromRegister
            ? { Authorization: `Bearer ${tokenFromRegister}` }
            : undefined;

          const tryCreateAddress = async () => {
            const {
              name,
              phone,
              province,
              city,
              district,
              postalCode,
              addressDetail,
            } = payload;

            if (
              !name ||
              !phone ||
              !addressDetail ||
              !postalCode ||
              !province ||
              !city ||
              !district
            ) {
              return;
            }

            const parseMaybeNumber = (v: string | undefined) => {
              if (!v) return undefined;
              const n = Number(v);
              return Number.isFinite(n) && String(n) === v.trim()
                ? n
                : undefined;
            };

            let provinceId = parseMaybeNumber(province);
            if (!provinceId) {
              const provRes = await locationService.getProvinces();
              const prov = provRes.data.data.find(
                (p) => p.name.toLowerCase() === province.toLowerCase(),
              );
              provinceId = prov?.id;
            }

            if (!provinceId) return;

            let cityId = parseMaybeNumber(city);
            if (!cityId) {
              const cityRes = await locationService.getCities(provinceId);
              const ct = cityRes.data.data.find(
                (c) => c.name.toLowerCase() === city.toLowerCase(),
              );
              cityId = ct?.id;
            }

            if (!cityId) return;

            let subdistrictId = parseMaybeNumber(district);
            let subdistrictName = district;
            if (!subdistrictId) {
              const distRes = await locationService.getDistricts(cityId);
              const d = distRes.data.data.find(
                (x) => x.name.toLowerCase() === district.toLowerCase(),
              );
              if (d) {
                subdistrictId = d.id;
                subdistrictName = d.name;
              }
            }

            if (!subdistrictId) return;

            const addressPayload: CreateAddressPayload = {
              recipient_name: name,
              phone,
              province_id: provinceId,
              city_id: cityId,
              subdistrict_id: subdistrictId,
              address_line: addressDetail,
              postal_code: postalCode,
              is_default: 'true',
              subdistrict_name: subdistrictName,
            };

            try {
              const res = await addressService.createAddress(addressPayload, {
                headers,
              });
              if (res.ok) {
                toast.success('Alamat default berhasil dibuat.');
              }
            } catch (err) {
              const httpErr = err as unknown as {
                message?: string;
                status?: number;
                data?: unknown;
              };
              const maybeData = httpErr?.data;
              if (
                maybeData &&
                typeof maybeData === 'object' &&
                'errors' in (maybeData as Record<string, unknown>)
              ) {
                const errors = (maybeData as Record<string, unknown>)
                  .errors as Record<string, unknown>;
                const fieldErrors: Record<string, string> = {};
                const toStr = (v: unknown) =>
                  Array.isArray(v) ? String(v[0]) : String(v ?? '');
                if (errors?.province_id)
                  fieldErrors.province = toStr(errors.province_id);
                if (errors?.city_id) fieldErrors.city = toStr(errors.city_id);
                if (errors?.subdistrict_id)
                  fieldErrors.district = toStr(errors.subdistrict_id);
                if (errors?.postal_code)
                  fieldErrors.postalCode = toStr(errors.postal_code);
                if (errors?.address_line)
                  fieldErrors.addressDetail = toStr(errors.address_line);
                if (Object.keys(fieldErrors).length > 0) {
                  setRegisterFieldErrors((prev) => ({
                    ...prev,
                    ...fieldErrors,
                  }));
                }
              }
              toast.error(
                httpErr?.message ||
                  'Alamat tidak dapat dibuat otomatis. Anda bisa menambahkannya nanti.',
              );
            }
          };

          if (tokenFromRegister) {
            await tryCreateAddress();
          }

          toast.success(
            response?.message ?? 'Registrasi berhasil. Silakan masuk.',
          );
          closeActiveSheet();
          registerMutation.reset();
          loginMutation.reset();
          setRegisterError(null);
          setLoginError(null);
          const nameFromResponse = response?.data?.user?.full_name ?? null;
          if (nameFromResponse) {
            setUserName(nameFromResponse);
          }
          setTimeout(() => openSheet(loginTriggerRef), 0);
        },
        onError: (error) => {
          const message =
            error.message || 'Gagal mendaftar. Silakan coba lagi.';
          setRegisterError(message);
          const maybeData = (error as unknown as { data?: unknown })?.data;
          let beErrors: Record<string, string> = {};
          if (
            maybeData &&
            typeof maybeData === 'object' &&
            'errors' in (maybeData as Record<string, unknown>)
          ) {
            const candidate = (maybeData as Record<string, unknown>).errors;
            if (candidate && typeof candidate === 'object') {
              beErrors = candidate as Record<string, string>;
            }
          }
          const fieldErrors: Record<string, string> = {};
          if (beErrors.full_name) fieldErrors.name = beErrors.full_name;
          if (beErrors.password) fieldErrors.password = beErrors.password;
          if (beErrors.gender) fieldErrors.gender = beErrors.gender;
          if (beErrors.date_of_birth)
            fieldErrors.dateOfBirth = beErrors.date_of_birth;
          if (beErrors.email) fieldErrors.email = beErrors.email;
          if (Object.keys(fieldErrors).length > 0) {
            setRegisterFieldErrors(fieldErrors);
          }
          toast.error(message);
        },
      });
    },
    [closeActiveSheet, loginMutation, openSheet, registerMutation],
  );

  const handleOpenLogin = useCallback(() => {
    loginMutation.reset();
    setLoginError(null);
    openSheet(loginTriggerRef);
  }, [loginMutation, openSheet]);

  const handleOpenRegister = useCallback(() => {
    registerMutation.reset();
    setRegisterError(null);
    setRegisterFieldErrors({});
    openSheet(registerTriggerRef);
  }, [openSheet, registerMutation]);

  const handleLogout = useCallback(() => {
    setLoginError(null);
    setRegisterError(null);
    setUserName(null);
    try {
      setAuthToken(null);
    } catch {}
    try {
      router.refresh();
    } catch {}
    toast.message('Anda telah keluar dari akun.');
  }, [router]);

  const [registerFieldErrors, setRegisterFieldErrors] = useState<
    Record<string, string>
  >({});

  return (
    <div className='w-full bg-white min-h-screen relative'>
      <div className='p-6 pb-3 border-b-2 border-gray-200'>
        <div className='-mx-6 -mt-6 -mb-6'>
          <div className='w-full h-16 sm:h-20 bg-gradient-to-r from-brand to-brand/80' />
        </div>
        <div className='flex items-center justify-between relative z-10 -mt-12'>
          <div className='h-15 w-15 flex items-center justify-center'>
            <Image
              src='/assets/user-icon.png'
              alt='User'
              width={70}
              height={70}
              className='h-15 w-15 object-contain'
            />
          </div>
          {isLoggedIn ? (
            <Button
              variant='ghost'
              className='text-brand p-0 h-auto font-bold mt-14'
              onClick={() => router.push('/user/edit')}
            >
              Ganti
              <Edit2 className='ml-2 w-4 h-4' />
            </Button>
          ) : (
            <Button
              variant='ghost'
              className='text-brand p-0 h-auto font-bold mt-14'
              onClick={handleOpenLogin}
            >
              Masuk
              <ArrowRight className='ml-2 w-4 h-4 text-brand' />
            </Button>
          )}
        </div>
        <div className='flex items-center justify-between'>
          {isLoggedIn ? (
            <div className='flex items-center gap-2 bg-gradient-to-l from-[#f6eac7] to-white rounded-full'>
              <div className='flex items-center gap-1'>
                <Image
                  src='/assets/icon-star-user.png'
                  alt='Poin kamu'
                  width={16}
                  height={16}
                  className='w-6 h-6'
                />
                <span className='text-[10px] md:text-sm font-semibold text-[#997B27]'>
                  Poin kamu
                </span>
              </div>
              <div className='flex items-end gap-1 text-black bg-white rounded-full p-1 px-3 border-2 border-gray-200'>
                <span className='text-sm font-bold leading-none'>100</span>
                <span className='text-[10px] font-medium leading-none text-[#9a7b29]'>
                  pts
                </span>
              </div>
            </div>
          ) : (
            <div className='py-2 text-brand text-lg font-semibold'>Guest</div>
          )}
          <h2 className='text-lg font-bold text-black'>
            {isLoggedIn
              ? userName || profileData?.data?.full_name || 'Pengguna'
              : 'Hey, there gorgeous'}
          </h2>
        </div>
      </div>

      <div className='px-4 pt-4'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start', loop: vouchers.length > 1 }}
        >
          <CarouselContent className='pr-4'>
            {vouchers.map((item, idx) => (
              <CarouselItem key={idx} className='basis-full'>
                <div className='rounded-xl sm:rounded-2xl overflow-hidden border-3 border-gray-300 bg-white'>
                  <div className='p-4 px-6 md:p-6 md:px-8'>
                    <div className='flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4'>
                      <div className='flex-1'>
                        <h3 className='text-lg md:text-2xl font-bold text-[#218d46] mb-0 sm:mb-0 leading-tight'>
                          {item.title1}
                        </h3>
                        <h3 className='text-lg md:text-2xl font-bold text-[#218d46] mb-1 sm:mb-2'>
                          {item.title2}
                        </h3>
                        <p className='text-[9px] md:text-sm font-semibold text-[#7c7c7c]'>
                          {item.description}
                        </p>
                      </div>
                      <div className='flex justify-end'>
                        <div className='relative'>
                          <Image
                            src={item.image}
                            alt='Voucher'
                            width={150}
                            height={150}
                            className='w-auto h-20 md:w-auto md:h-28 object-contain'
                          />
                        </div>
                      </div>
                    </div>

                    <Button className='w-full bg-brand hover:bg-brand/90 text-white font-base py-6 md:py-8 rounded-4xl text-sm md:text-base'>
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='p-4 space-y-2'>
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className='border-0 shadow-none hover:bg-gray-50 transition-colors cursor-pointer'
          >
            <div
              className='flex items-center gap-4 p-4'
              role='button'
              tabIndex={0}
              onClick={() =>
                item.newTab
                  ? window.open(item.href, '_blank', 'noopener,noreferrer')
                  : router.push(item.href)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (item.newTab) {
                    window.open(item.href, '_blank', 'noopener,noreferrer');
                  } else {
                    router.push(item.href);
                  }
                }
              }}
            >
              <div className='flex-shrink-0'>{item.icon}</div>
              <span className='text-gray-700 font-medium flex-1'>
                {item.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <RegisterSheet
        trigger={<button ref={registerTriggerRef} className='hidden' />}
        onSubmit={handleRegisterSubmit}
        isSubmitting={registerMutation.isPending}
        errorMessage={registerError}
        fieldErrors={registerFieldErrors}
        onSwitchToLogin={() => {
          closeActiveSheet();
          registerMutation.reset();
          loginMutation.reset();
          setRegisterError(null);
          setRegisterFieldErrors({});
          setLoginError(null);
          setTimeout(() => handleOpenLogin(), 0);
        }}
      />

      <ForgotPasswordSheet
        trigger={<button ref={forgotTriggerRef} className='hidden' />}
        onSubmit={({ email }) => {
          forgotMutation.mutate(
            { email },
            {
              onSuccess: (res) => {
                toast.success(
                  res?.message ||
                    'Jika email terdaftar, tautan reset telah dikirim.',
                );
                closeActiveSheet();
              },
              onError: (err) => {
                const msg = err.message || 'Gagal mengirim tautan reset.';
                // Try backend error mapping
                const data = (err as unknown as { data?: unknown })?.data;
                if (
                  data &&
                  typeof data === 'object' &&
                  'message' in (data as Record<string, unknown>)
                ) {
                  const beMsg = String(
                    (data as Record<string, unknown>).message,
                  );
                  toast.error(beMsg);
                } else {
                  toast.error(msg);
                }
              },
            },
          );
        }}
        onSwitchToLogin={() => {
          closeActiveSheet();
          loginMutation.reset();
          setLoginError(null);
          setTimeout(() => handleOpenLogin(), 0);
        }}
        onSwitchToRegister={() => {
          closeActiveSheet();
          registerMutation.reset();
          setRegisterError(null);
          setTimeout(() => handleOpenRegister(), 0);
        }}
      />

      <LoginSheet
        trigger={<button ref={loginTriggerRef} className='hidden' />}
        onSubmit={handleLoginSubmit}
        isSubmitting={loginMutation.isPending}
        errorMessage={loginError}
        onForgotPassword={() => {
          closeActiveSheet();
          loginMutation.reset();
          setLoginError(null);
          setTimeout(() => openSheet(forgotTriggerRef), 0);
        }}
        onSwitchToRegister={() => {
          closeActiveSheet();
          loginMutation.reset();
          setLoginError(null);
          setRegisterError(null);
          setTimeout(() => handleOpenRegister(), 0);
        }}
      />

      <div className='p-4 pt-2 space-y-7'>
        <Button
          variant='outline'
          className='w-full h-auto py-5 md:py-6 text-base gap-3'
          onClick={handleLogout}
        >
          <LogOut
            className='w-7 h-7 text-black'
            strokeWidth={2.5}
            aria-hidden='true'
          />
          <span className='text-brand font-normal'>Logout</span>
        </Button>
        <p className='text-sm text-black text-center mb-10'>
          Versi Website 0 01.00.00
        </p>
      </div>
    </div>
  );
}
