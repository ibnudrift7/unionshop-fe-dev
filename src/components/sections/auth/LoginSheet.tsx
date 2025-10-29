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

export interface LoginSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: { email: string; password: string }) => void;
  onForgotPassword?: () => void;
  onSwitchToRegister?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function LoginSheet({
  trigger,
  onSubmit,
  onForgotPassword,
  onSwitchToRegister,
  isSubmitting = false,
}: LoginSheetProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit?.({ email, password });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <SheetHeader>
          <SheetTitle className='text-center text-lg'>Masuk</SheetTitle>
        </SheetHeader>
        <div className='px-4 pb-4 space-y-3'>
          <div className='space-y-1'>
            <Label htmlFor='login-email'>Email</Label>
            <Input
              id='login-email'
              type='email'
              placeholder='nama@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='login-password'>Kata sandi</Label>
            <Input
              id='login-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className='flex items-center gap-2 pt-1'>
            <input
              id='login-show-password'
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300'
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor='login-show-password' className='text-sm'>
              Perlihatkan password
            </Label>
          </div>
          <div className='pt-2'>
            <Button
              className='w-full bg-brand hover:bg-brand/90 text-white'
              onClick={handleSubmit}
              type='button'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </Button>
          </div>
          <div className='pt-1'>
            <button
              className='w-full text-center text-sm font-medium text-black'
              onClick={onForgotPassword}
              type='button'
              disabled={isSubmitting}
            >
              Lupa password?
            </button>
          </div>
          <div className='pt-1 text-center text-sm'>
            Belum punya akun?{' '}
            <SheetClose asChild>
              <button
                className='font-semibold text-brand'
                onClick={onSwitchToRegister}
                type='button'
                disabled={isSubmitting}
              >
                Daftar sekarang
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default LoginSheet;
