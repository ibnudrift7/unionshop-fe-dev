'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export interface ForgotPasswordSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: { email: string }) => void;
  onSwitchToLogin?: () => void;
  onSwitchToRegister?: () => void;
  isSubmitting?: boolean;
}

export function ForgotPasswordSheet({
  trigger,
  onSubmit,
  onSwitchToLogin,
  onSwitchToRegister,
  isSubmitting = false,
}: ForgotPasswordSheetProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ email });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <div className='relative'>
          {isSubmitting && (
            <div className='absolute inset-0 z-50 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 pointer-events-auto'>
              <Spinner className='size-8 text-brand' />
              <p className='text-sm text-gray-700'>Mengirim tautan…</p>
            </div>
          )}
          <SheetHeader>
            <SheetTitle className='text-center text-lg font-bold'>
              Tidak bisa masuk?
            </SheetTitle>
          </SheetHeader>
          <div className='px-4 pb-4 space-y-3'>
            <p className='text-sm text-gray-600'>
              Masukkan email. Kami akan kirim tautan untuk memulihkan akun dan
              membuat kata sandi baru.
            </p>
            <div className='space-y-1'>
              <Label htmlFor='forgot-email'>Email</Label>
              <Input
                id='forgot-email'
                type='email'
                placeholder='nama@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className='pt-2'>
              <Button
                className='w-full bg-brand hover:bg-brand/90 text-white'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Kirim tautan untuk masuk'}
              </Button>
            </div>
            <div className='pt-1 text-center text-sm'>
              <SheetClose asChild>
                <button
                  className='font-medium text-black'
                  onClick={onSwitchToLogin}
                  disabled={isSubmitting}
                >
                  kembali masuk
                </button>
              </SheetClose>
            </div>
            <div className='pt-1 text-center text-sm'>
              Belum punya akun?{' '}
              <SheetClose asChild>
                <button
                  className='font-semibold text-brand'
                  onClick={onSwitchToRegister}
                  disabled={isSubmitting}
                >
                  Daftar sekarang
                </button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ForgotPasswordSheet;
