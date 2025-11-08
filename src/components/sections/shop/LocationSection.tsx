'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import RegisterSheet from '@/components/sections/auth/RegisterSheet';
import LoginSheet from '@/components/sections/auth/LoginSheet';
import ForgotPasswordSheet from '@/components/sections/auth/ForgotPasswordSheet';
import { useForgotPasswordMutation, useLoginMutation } from '@/hooks/use-auth';
import { setAuthToken } from '@/lib/auth-token';
import { toast } from 'sonner';

interface LocationSectionProps {
  onLocationClick?: () => void;
  points: number;
  name: string;
  address: string;
  isGuest?: boolean;
}

export default function LocationSection({
  onLocationClick,
  points,
  name,
  address,
  isGuest = false,
}: LocationSectionProps) {
  const registerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const loginTriggerRef = useRef<HTMLButtonElement | null>(null);
  const forgotTriggerRef = useRef<HTMLButtonElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginError, setLoginError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const forgotMutation = useForgotPasswordMutation();
  const handleLogin = (payload: { email: string; password: string }) => {
    setLoginError(null);
    loginMutation.mutate(payload, {
      onSuccess: (resp) => {
        try {
          const token =
            (resp?.data?.token as string | undefined) ||
            ((resp?.data?.tokens as { accessToken?: string } | undefined)
              ?.accessToken as string | undefined) ||
            undefined;
          if (token) setAuthToken(token);
        } catch {}
        toast.success('Berhasil masuk');
      },
      onError: (error) => {
        let msg = 'Gagal masuk';
        if (error && typeof error === 'object') {
          const errObj = error as { data?: unknown; message?: unknown };
          if (errObj.data && typeof errObj.data === 'object') {
            const dataObj = errObj.data as { message?: unknown };
            if (typeof dataObj.message === 'string') msg = dataObj.message;
          }
          if (msg === 'Gagal masuk' && typeof errObj.message === 'string') {
            msg = errObj.message;
          }
        }
        setLoginError(msg);
        toast.error(msg);
      },
    });
  };
  const truncatedAddressMobile =
    address.length > 37 ? address.slice(0, 37) + '…' : address;
  const truncatedAddressDesktop =
    address.length > 55 ? address.slice(0, 55) + '…' : address;
  return (
    <div className='mx-4'>
      <div className='bg-white rounded-3xl overflow-hidden shadow-lg'>
        <div className='flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-white border-b border-black/5'>
          <div className='flex items-center'>
            <div className='flex items-center gap-2 px-3 py-1 rounded-xl border border-black/5 bg-gradient-to-bl from-[#F6E8C3] to-white'>
              {isGuest ? (
                <span className='text-lg md:text-xl font-extrabold text-[#9a7b29]'>
                  Mau poin gratis ?
                </span>
              ) : (
                <>
                  <Image
                    src='/assets/icon-star.png'
                    alt='Star Points'
                    width={24}
                    height={24}
                    className='w-6 h-6 md:w-8 md:h-8'
                  />
                  <span className='text-sm sm:text-base font-semibold text-[#997B27]'>
                    Poin kamu
                  </span>
                </>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2 text-gray-900'>
            {isGuest ? (
              <>
                <RegisterSheet
                  trigger={
                    <button
                      ref={registerTriggerRef}
                      type='button'
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <span className='text-base sm:text-lg leading-none text-black'>
                        Daftar aja !
                      </span>
                      <Image
                        src='/assets/arrow-right-homepage.png'
                        alt='Arrow Right'
                        width={20}
                        height={20}
                        className='w-5 h-5 sm:w-6 sm:h-6'
                      />
                    </button>
                  }
                  onSwitchToLogin={() =>
                    setTimeout(() => loginTriggerRef.current?.click(), 0)
                  }
                />
                <LoginSheet
                  trigger={
                    <button
                      ref={loginTriggerRef}
                      type='button'
                      className='hidden'
                      aria-hidden='true'
                    />
                  }
                  onSubmit={handleLogin}
                  isSubmitting={loginMutation.status === 'pending'}
                  onForgotPassword={() =>
                    setTimeout(() => forgotTriggerRef.current?.click(), 0)
                  }
                  onSwitchToRegister={() =>
                    setTimeout(() => registerTriggerRef.current?.click(), 0)
                  }
                />
                <ForgotPasswordSheet
                  trigger={
                    <button
                      ref={forgotTriggerRef}
                      type='button'
                      className='hidden'
                      aria-hidden='true'
                    />
                  }
                  isSubmitting={forgotMutation.status === 'pending'}
                  onSubmit={({ email }) =>
                    forgotMutation.mutate(
                      { email },
                      {
                        onSuccess: (res) => {
                          toast.success(
                            res?.message ||
                              'Jika email terdaftar, tautan reset telah dikirim.',
                          );
                        },
                        onError: (err) => {
                          const msg =
                            err?.message || 'Gagal mengirim tautan reset.';
                          toast.error(msg);
                        },
                      },
                    )
                  }
                  onSwitchToLogin={() =>
                    setTimeout(() => loginTriggerRef.current?.click(), 0)
                  }
                  onSwitchToRegister={() =>
                    setTimeout(() => registerTriggerRef.current?.click(), 0)
                  }
                />
              </>
            ) : (
              <>
                <span className='text-lg sm:text-xl font-extrabold leading-none'>
                  {points}
                </span>
                <span className='text-sm sm:text-base font-medium leading-none text-gray-700'>
                  pts
                </span>
              </>
            )}
          </div>
        </div>

        <div className='bg-white'>
          <div className='bg-[#f3f3f3] rounded-2xl p-2'>
            <div className='bg-white flex items-center justify-between rounded-2xl px-3 py-2 sm:px-4 sm:py-3'>
              <div className='flex-1'>
                <h3 className='font-semibold text-lg text-black'>
                  {isGuest ? 'Selamat Datang di Makna Club' : name}
                </h3>
                <p
                  className='text-gray-600 text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis md:hidden'
                  title={
                    isGuest
                      ? 'Terimakasih sudah menjadi bagian dari pengalaman Makna'
                      : address
                  }
                >
                  {isGuest
                    ? 'Terimakasih sudah menjadi bagian dari pengalaman Makna'
                    : truncatedAddressMobile}
                </p>
                <p
                  className='text-gray-600 text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis hidden md:block'
                  title={
                    isGuest
                      ? 'Terimakasih sudah menjadi bagian dari pengalaman Makna'
                      : address
                  }
                >
                  {isGuest
                    ? 'Terimakasih sudah menjadi bagian dari pengalaman Makna'
                    : truncatedAddressDesktop}
                </p>
              </div>
              <div className='ml-4'>
                {isGuest ? (
                  <Image
                    src='/assets/logo-makna-homepage.png'
                    alt='Guest Location Icon'
                    width={54}
                    height={54}
                    className='w-15 h-auto'
                  />
                ) : (
                  <button
                    onClick={onLocationClick}
                    className='w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-brand hover:bg-purple-200 transition-colors'
                    aria-label='Ubah lokasi'
                  >
                    <Image
                      src='/assets/icon-location.png'
                      alt='Location Icon'
                      width={24}
                      height={24}
                      className='w-5 h-auto'
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-3 px-2'>
        <div className='flex items-center gap-2 text-gray-500'>
          <span className='text-sm font-bold'>Melayani</span>
          <span className='w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 rounded-full border-2 sm:border-4 border-green-500 inline-block'></span>
          <span className='text-sm font-bold text-black'>Delivery 8/5</span>
          <div className='flex-1 h-px bg-gray-300 ml-2'></div>
        </div>
      </div>
    </div>
  );
}
